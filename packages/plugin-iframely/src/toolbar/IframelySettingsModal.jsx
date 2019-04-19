import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { TextInput } from 'wix-rich-content-common';

export class IframelySettingsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.componentData.src || '',
    };
  }

  onConfirm = () => {
    const { url } = this.state;
    if (url) {
      const { componentData, onConfirm } = this.props;

      onConfirm({ ...componentData, src: url });

      this.onCloseRequested();
    }
  };

  onCloseRequested = () => {
    this.props.helpers.closeModal();
  };

  onUrlChange = e => this.setState({ url: e.target.value });

  handleKeyPress = e => {
    if (e.charCode === 13) {
      this.onConfirm();
    }
    if (e.charCode === 27) {
      this.onCloseRequested();
    }
  };

  render() {
    const { url } = this.state;
    const { styles } = this;

    return (
      <div>
        <TextInput
          type="url"
          onKeyPress={this.handleKeyPress}
          onChange={this.onUrlChange}
          value={url}
          placeholder="enter iframely url"
          theme={styles}
        />
      </div>
    );
  }
}

IframelySettingsModal.propTypes = {};
