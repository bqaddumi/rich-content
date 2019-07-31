/* eslint-disable no-undef */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { mergeStyles, WixUtils } from 'wix-rich-content-common';
import SearchInputCompnent from '../components/search-input-component';
import Navbar from '../components/navbar';
import ImagesList from '../components/images-list';
import styles from '../../statics/styles/unsplash-api-input-modal.scss';

class UnsplashApiInputModal extends Component {
  constructor(props) {
    super(props);
    this.styles = mergeStyles({ styles, theme: props.theme });
    this.isMobile = WixUtils.isMobile();
    this.state = {
      searchTerm: '',
    };
  }

  onTextChanged = term => {
    this.setState({ searchTerm: term });
  };
  onBackClickedHandler = () => {
    this.props.helpers.closeModal();
  };
  render() {
    const { theme, t } = this.props;
    return (
      <div>
        {this.isMobile && <Navbar onBackClicked={this.onBackClickedHandler} {...this.props} />}
        <SearchInputCompnent
          onTextChanged={this.onTextChanged.bind(this)}
          theme={theme}
          isMobile={this.isMobile}
          t={t}
        />
        <ImagesList
          searchTerm={this.state.searchTerm}
          theme={theme}
          isMobile={this.isMobile}
          {...this.props}
        />
      </div>
    );
  }
}

UnsplashApiInputModal.propTypes = {
  theme: PropTypes.object,
  helpers: PropTypes.object,
  t: PropTypes.func.isRequired,
};

export default UnsplashApiInputModal;