import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mergeStyles, isVideoUrl } from 'wix-rich-content-common';
import VideoListComponent from './../components/video-list-component';
import SearchInputComponent from './../components/search-input-component';
import NavbarComponent from './../components/navbar-component';
import styles from '../../statics/styles/youtube-api-input-modal.scss';

export default class YoutubeApiInputModal extends Component {
  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
    this.state = {
      selectedVideoUrl: '',
      searchTerm: '',
      onTextBoxFocus: false,
    };
  }

  updateComponentData = videoUrl => {
    const { componentData, helpers, pubsub, onConfirm } = this.props;
    if (onConfirm) {
      onConfirm({ ...componentData, youtube: { url: videoUrl } });
    } else {
      pubsub.update('componentData', { youtube: { url: videoUrl } });
    }
    helpers.closeModal();
  };

  onSearchButtonClicked = term => {
    if (isVideoUrl(term)) {
      this.updateComponentData(term);
    } else {
      this.setState({ searchTerm: term });
    }
  };

  handelOnKeyPress = term => {
    this.setState({ searchTerm: term });
    const { componentData, helpers, pubsub, onConfirm } = this.props;
    if (isVideoUrl(term)) {
      const youtubeObj = {
        url: term,
      };
      if (onConfirm) {
        onConfirm({ ...componentData, youtube: youtubeObj });
      } else {
        pubsub.update('componentData', { youtube: youtubeObj });
      }
      helpers.closeModal();
    }
  };

  onItemClickedHandler = url => {
    const { isMobile } = this.props;
    this.setState({ selectedVideoUrl: url });
    if (!isMobile) {
      this.updateComponentData(url);
    }
  };

  onAddClickedHandler = url => {
    this.updateComponentData(url);
  };

  onBackClickedHandler = () => {
    this.props.helpers.closeModal();
  };

  onSearchTextBoxFocused = isFocus => {
    this.setState({ onTextBoxFocus: isFocus });
  };

  onSearchTextBoxBlured = isBlur => {
    this.setState({ onTextBoxFocus: isBlur });
  };

  render() {
    const { isMobile } = this.props;
    return (
      <div className={this.styles.youtube_api_input_modal_modal_container}>
        {isMobile && (
          <NavbarComponent
            selectedVideoUrl={this.state.selectedVideoUrl}
            isTextBoxFocused={this.state.onTextBoxFocus}
            onAddClicked={this.onAddClickedHandler.bind(this)}
            onBackClicked={this.onBackClickedHandler}
            {...this.props}
          />
        )}
        <div className={this.styles.youtube_api_input_modal_search_modal_container}>
          <SearchInputComponent
            onSearchButtonClicked={this.onSearchButtonClicked.bind(this)}
            selectedVideoUrl={this.state.selectedVideoUrl}
            onKeyPress={this.handelOnKeyPress.bind(this)}
            onSearchTextBoxFocused={this.onSearchTextBoxFocused.bind(this)}
            onSearchTextBoxBlured={this.onSearchTextBoxBlured.bind(this)}
            isMobile={isMobile}
            {...this.props}
          />
          <VideoListComponent
            onItemClickedHandler={this.onItemClickedHandler.bind(this)}
            isMobile={isMobile}
            isTextBoxFocused={this.state.onTextBoxFocus}
            searchTerm={this.state.searchTerm}
            {...this.props}
          />
        </div>
      </div>
    );
  }
}

YoutubeApiInputModal.propTypes = {
  theme: PropTypes.object.isRequired,
  componentData: PropTypes.object.isRequired,
  helpers: PropTypes.object,
  pubsub: PropTypes.object,
  onConfirm: PropTypes.func,
  isMobile: PropTypes.bool,
  t: PropTypes.func,
};
