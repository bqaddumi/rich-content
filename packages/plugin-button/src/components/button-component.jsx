import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { normalizeUrl } from 'wix-rich-content-common';
import ButtonViewer from './button-viewer';

class ButtonComponent extends PureComponent {
  constructor(props) {
    super(props);
    const {
      componentData: { button },
    } = this.props;
    this.state = {
      style: button,
    };
  }

  render() {
    const { colors } = this.props.settings;
    const {
      componentData: { button },
      buttonObj,
      t,
      theme,
      blockProps,
    } = this.props;
    const anchorTarget = this.props.anchorTarget ? this.props.anchorTarget : '_self';
    const relValue = this.props.relValue ? this.props.relValue : '';
    let buttonText = button.buttonText;
    let rel = '';
    let url = '';
    let style = {
      border: '0px solid blue',
      ...this.props.style,
    };

    const target =
      typeof button.target === 'undefined' ? anchorTarget : button.target ? '_blank' : '_self';
    rel = typeof button.rel === 'undefined' ? relValue : button.rel ? 'nofollow' : '';
    style = {
      ...style,
      borderWidth: button.borderWidth + 'px',
      padding: button.padding + 'px',
      borderRadius: button.borderRadius,
      color: button.textColor ? button.textColor : colors.color_1,
      background: button.backgroundColor ? button.backgroundColor : colors.color_8,
      borderColor: button.borderColor ? button.borderColor : colors.color_8,
    };
    url = button.url;
    const textColor = blockProps &&
      !blockProps.isFocused &&
      !url && {
        color: '#5D9AFF',
      };
    style = {
      ...style,
      ...textColor,
    };
    if (buttonObj) {
      style = {
        ...style,
        borderWidth: buttonObj.design.borderWidth + 'px',
        padding: buttonObj.design.padding + 'px',
        borderRadius: buttonObj.design.borderRadius,
        color: buttonObj.design.textColor,
        background: buttonObj.design.backgroundColor,
        borderColor: buttonObj.design.borderColor,
      };
      buttonText = buttonObj.data.buttonText;
    }

    return (
      <ButtonViewer
        url={normalizeUrl(url)}
        style={style}
        target={target}
        rel={rel}
        buttonText={buttonText}
        t={t}
        theme={theme}
      />
    );
  }
}

ButtonComponent.propTypes = {
  theme: PropTypes.object.isRequired,
  componentData: PropTypes.object,
  style: PropTypes.object,
  buttonObj: PropTypes.object,
  anchorTarget: PropTypes.string,
  relValue: PropTypes.string,
  settings: PropTypes.object.isRequired,
  t: PropTypes.func,
  blockProps: PropTypes.object,
};

export default ButtonComponent;
