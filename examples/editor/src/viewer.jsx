import { Component } from 'react';
import ReactModal from 'react-modal';
import { RichContentViewer } from 'wix-rich-content-viewer';
import theme from './theme/theme';
import * as PropTypes from 'prop-types';
import React from 'react';
import { videoTypeMapper } from 'wix-rich-content-plugin-video/dist/module.viewer';
import { dividerTypeMapper } from 'wix-rich-content-plugin-divider/dist/module.viewer';
import { HTML_TYPE, htmlTypeMapper } from 'wix-rich-content-plugin-html/dist/module.viewer';
import { soundCloudTypeMapper } from 'wix-rich-content-plugin-sound-cloud/dist/module.viewer';
import {
  LINK_TYPE,
  LinkParseStrategy,
  linkTypeMapper,
  LinkViewer,
} from 'wix-rich-content-plugin-link/dist/module.viewer';
import { imageTypeMapper } from 'wix-rich-content-plugin-image/dist/module.viewer';

import { Component as HashTag, Strategy as HashTagStrategy } from 'wix-rich-content-plugin-hashtag';
import {
  createHeadersMarkdownDecorator,
  HEADERS_MARKDOWN_TYPE,
} from 'wix-rich-content-plugin-headers-markdown';
import { CodeBlockDecorator } from 'wix-rich-content-plugin-code-block/dist/module.viewer';
import {
  MENTION_TYPE,
  mentionsTypeMapper,
} from 'wix-rich-content-plugin-mentions/dist/module.viewer';

import 'wix-rich-content-common/dist/styles.min.css';
import 'wix-rich-content-viewer/dist/styles.min.css';
// import 'wix-rich-content-plugin-code-block/dist/styles.min.css';
import 'wix-rich-content-plugin-divider/dist/styles.min.css';
import 'wix-rich-content-plugin-emoji/dist/styles.min.css';
import 'wix-rich-content-plugin-hashtag/dist/styles.min.css';
import 'wix-rich-content-plugin-html/dist/styles.min.css';
import 'wix-rich-content-plugin-image/dist/styles.min.css';
import 'wix-rich-content-plugin-link/dist/styles.min.css';
import 'wix-rich-content-plugin-mentions/dist/styles.min.css';
import 'wix-rich-content-plugin-video/dist/styles.min.css';
import 'wix-rich-content-plugin-sound-cloud/dist/styles.min.css';

const modalStyleDefaults = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const linkPluginSettings = {
  onClick: (event, url) => console.log('link clicked!', url),
};
const mentionsPluginSettings = {
  onMentionClick: mention => console.log('mention clicked!', mention),
  getMentionLink: () => '/link/to/mention',
};
const anchorTarget = '_top';
const relValue = 'noreferrer';

export class Viewer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onHashTagClick = (event, text) => {
    event.preventDefault();
    console.log(`'${text}' hashtag clicked!`);
  };

  typeMappers = [
    videoTypeMapper,
    dividerTypeMapper,
    htmlTypeMapper,
    linkTypeMapper,
    soundCloudTypeMapper,
    mentionsTypeMapper,
    imageTypeMapper,
  ];

  config = {
    [HEADERS_MARKDOWN_TYPE]: {
      hideMarkdown: true,
    },
    [HTML_TYPE]: {
      htmlIframeSrc: 'http://localhost:3001/static/html-plugin-embed.html',
    },
    [LINK_TYPE]: linkPluginSettings,
    [MENTION_TYPE]: mentionsPluginSettings,
  };

  decorators = [
    {
      strategy: LinkParseStrategy,
      component: ({ children, decoratedText, rel, target }) => (
        <LinkViewer
          componentData={{ rel, target, url: decoratedText }}
          anchorTarget={anchorTarget}
          relValue={relValue}
          settings={linkPluginSettings}
        >
          {children}
        </LinkViewer>
      ),
    },
    {
      strategy: HashTagStrategy,
      component: ({ children, decoratedText }) => (
        <HashTag
          theme={theme}
          onClick={this.onHashTagClick}
          createHref={decoratedText =>
            `/search/posts?query=${encodeURIComponent('#')}${decoratedText}`
          }
          decoratedText={decoratedText}
        >
          {children}
        </HashTag>
      ),
    },
    new CodeBlockDecorator({ theme }),
    createHeadersMarkdownDecorator(this.config),
  ];

  closeModal = () => {
    this.setState({
      showModal: false,
      modalContent: null,
    });
  };

  render() {
    return (
      <>
        <RichContentViewer
          helpers={this.helpers}
          typeMappers={this.typeMappers}
          decorators={this.decorators}
          config={this.config}
          initialState={this.props.initialState}
          theme={theme}
          isMobile={this.props.mobile}
          anchorTarget={anchorTarget}
          relValue={relValue}
        />
        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="External Modal Example"
          style={this.state.modalStyles || modalStyleDefaults}
          onRequestClose={this.closeModal}
        >
          {this.state.showModal && <RichContentModal {...this.state.modalProps} />}
        </ReactModal>
      </>
    );
  }
}

Viewer.propTypes = {
  initialState: PropTypes.any,
  mobile: PropTypes.any,
  config: PropTypes.any,
};
