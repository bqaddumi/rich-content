import React, { Component } from 'react';
import { RichContentEditor, RichContentEditorModal } from 'wix-rich-content-editor';
import PluginsConfig from './PluginsConfig';
import theme from './theme/theme';
import * as PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { testImages, testVideos } from './mock';
import Plugins from './Plugins';
import ModalsMap from './ModalsMap';

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
const anchorTarget = '_blank';
const relValue = 'nofollow';

export class Editor extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.initEditorProps();
  }

  initEditorProps() {
    this.plugins = Plugins;
    const mockUpload = (files, updateEntity) => {
      //mock upload
      const testItem = testImages[Math.floor(Math.random() * testImages.length)];
      const data = {
        id: testItem.photoId,
        original_file_name: files && files[0] ? files[0].name : testItem.url,
        file_name: testItem.url,
        width: testItem.metadata.width,
        height: testItem.metadata.height,
      };
      setTimeout(() => {
        updateEntity({ data, files });
        console.log('consumer uploaded', data);
      }, 500);
    };
    this.helpers = {
      onFilesChange: (files, updateEntity) => mockUpload(files, updateEntity),
      // handleFileSelection: (index, multiple, updateEntity, removeEntity) => {
      //   const count = multiple ? [1,2,3] : [1];
      //   const data = [];
      //   count.forEach(_ => {
      //     const testItem = testImages[Math.floor(Math.random() * testImages.length)];
      //     data.push({
      //       id: testItem.photoId,
      //       original_file_name: testItem.url,
      //       file_name: testItem.url,
      //       width: testItem.metadata.width,
      //       height: testItem.metadata.height,
      //     });
      //   })
      //   setTimeout(() => { updateEntity({ data }) }, 500);
      // },
      onVideoSelected: (url, updateEntity) => {
        setTimeout(() => {
          const testVideo = testVideos[Math.floor(Math.random() * testVideos.length)];
          updateEntity(testVideo);
        }, 500);
      },
      openModal: data => {
        const { modalStyles, ...modalProps } = data;
        try {
          document.documentElement.style.height = '100%';
          document.documentElement.style.position = 'relative';
        } catch (e) {
          console.warn('Cannot change document styles', e);
        }
        this.setState({
          showModal: true,
          modalProps,
          modalStyles,
        });
      },
      closeModal: () => {
        try {
          document.documentElement.style.height = 'initial';
          document.documentElement.style.position = 'initial';
        } catch (e) {
          console.warn('Cannot change document styles', e);
        }
        this.setState({
          showModal: false,
          modalProps: null,
          modalStyles: null,
          modalContent: null,
        });
      },
    };
  }

  componentDidMount() {
    ReactModal.setAppElement('body');
    this.setEditorToolbars();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.textToolbarType !== this.props.textToolbarType) {
      this.setEditorToolbars();
    }
  }

  setEditorToolbars = () => {
    const { MobileToolbar, TextToolbar } = this.editor.getToolbars();
    this.setState({ MobileToolbar, TextToolbar });
  };

  render() {
    const modalStyles = {
      content: Object.assign(
        {},
        (this.state.modalStyles || modalStyleDefaults).content,
        theme.modalTheme.content
      ),
      overlay: Object.assign(
        {},
        (this.state.modalStyles || modalStyleDefaults).overlay,
        theme.modalTheme.overlay
      ),
    };
    const { MobileToolbar, TextToolbar } = this.state;
    return (
      <div>
        {MobileToolbar && <MobileToolbar />}
        {TextToolbar && <TextToolbar />}
        <RichContentEditor
          ref={editor => (this.editor = editor)}
          onChange={this.props.onChange}
          helpers={this.helpers}
          plugins={this.plugins}
          config={PluginsConfig}
          editorState={this.props.editorState}
          // initialState={this.state.initialState}
          readOnly={this.props.readOnly}
          isMobile={this.props.mobile}
          textToolbarType={this.props.textToolbarType}
          theme={theme}
          editorKey={'random-editorKey-ssr'}
          anchorTarget={anchorTarget}
          relValue={relValue}
        />
        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="External Modal Example"
          style={modalStyles}
          role="dialog"
          onRequestClose={this.helpers.closeModal}
        >
          {this.state.showModal && (
            <RichContentEditorModal modalsMap={ModalsMap} {...this.state.modalProps} />
          )}
        </ReactModal>
      </div>
    );
  }
}

Editor.propTypes = {
  onChange: PropTypes.func,
  editorState: PropTypes.any,
  readOnly: PropTypes.any,
  mobile: PropTypes.any,
  textToolbarType: PropTypes.any,
};
