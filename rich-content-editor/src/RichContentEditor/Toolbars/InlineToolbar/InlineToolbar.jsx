import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getVisibleSelectionRect } from '@wix/draft-js';
import Styles from '~/Styles/inline-toolbar.scss';

const getRelativeParent = element => {
  if (!element) {
    return null;
  }

  const position = window.getComputedStyle(element).getPropertyValue('position');
  if (position !== 'static') {
    return element;
  }

  return getRelativeParent(element.parentElement);
};

export default class InlineToolbar extends Component {
  static propTypes = {
    pubsub: PropTypes.object.isRequired,
    structure: PropTypes.array.isRequired,
    theme: PropTypes.object,
  };

  state = {
    isVisible: false,
    position: undefined,
    overrideContent: undefined,
    extendContent: undefined,
  }

  componentWillMount() {
    this.props.pubsub.subscribe('selection', this.onSelectionChanged);
  }

  componentWillUnmount() {
    this.props.pubsub.unsubscribe('selection', this.onSelectionChanged);
  }

  onOverrideContent = overrideContent => this.setState({ overrideContent });

  onExtendContent = extendContent => this.setState({ extendContent });

  onSelectionChanged = () => {
    // need to wait a tick for window.getSelection() to be accurate
    // when focusing editor with already present selection
    setTimeout(() => {
      if (!this.toolbar) {
        return;
      }

      const relativeParent = getRelativeParent(this.toolbar.parentElement);
      const halfToolbarWidth = this.toolbar.clientWidth / 2;
      const toolbarHeight = this.toolbar.clientHeight;
      const relativeRect = (relativeParent || document.body).getBoundingClientRect();
      const selectionRect = getVisibleSelectionRect(window);

      if (!selectionRect) {
        return;
      }

      const top = (selectionRect.top - relativeRect.top) - toolbarHeight;
      let left = (selectionRect.left - relativeRect.left) + (selectionRect.width / 2);

      // make sure we're not out of bounds, adjust position if we are
      if (left < halfToolbarWidth) {
        left = halfToolbarWidth;
      } else if ((left + halfToolbarWidth) > relativeRect.width) {
        left = relativeRect.width - halfToolbarWidth;
      }

      this.setState({ position: { top, left } });
    });
  };

  getStyle() {
    const { pubsub } = this.props;
    const { overrideContent, extendContent, position } = this.state;
    const selection = pubsub.get('getEditorState')().getSelection();
    // overrideContent could for example contain a text input, hence we always show overrideContent
    // TODO: Test readonly mode and possibly set isVisible to false if the editor is readonly
    const isVisible = (!selection.isCollapsed() && selection.getHasFocus()) || overrideContent || extendContent;
    const style = { ...position };

    if (isVisible) {
      style.visibility = 'visible';
      style.transform = 'translate(-50%) scale(1)';
      style.transition = 'transform 0.15s cubic-bezier(.3,1.2,.2,1)';
    } else {
      style.transform = 'translate(-50%) scale(0)';
      style.visibility = 'hidden';
    }

    return style;
  }

  handleToolbarRef = node => {
    this.toolbar = node;
  };

  render() {
    const { theme, pubsub, structure } = this.props;
    const { overrideContent: OverrideContent, extendContent: ExtendContent } = this.state;
    const { buttonStyles, toolbarStyles } = theme || {};
    const toolbarClassNames = classNames(Styles.toolbar, toolbarStyles && toolbarStyles.toolbar);
    const buttonClassNames = classNames(Styles.buttons, toolbarStyles && toolbarStyles.buttons);
    const extendClassNames = classNames(Styles.extend, toolbarStyles && toolbarStyles.extend);
    const childrenProps = {
      theme: buttonStyles,
      getEditorState: pubsub.get('getEditorState'),
      setEditorState: pubsub.get('setEditorState'),
      onOverrideContent: this.onOverrideContent,
      onExtendContent: this.onExtendContent,
    };

    return (
      <div
        className={toolbarClassNames}
        style={this.getStyle()}
        ref={this.handleToolbarRef}
      >
        <div className={buttonClassNames}>
          {OverrideContent ? <OverrideContent {...childrenProps} /> : structure.map((Button, index) => <Button key={index} {...childrenProps} />)}
        </div>
        {ExtendContent && (
          <div className={extendClassNames}>
            <ExtendContent {...childrenProps} />
          </div>
        )}
      </div>
    );
  }
}
