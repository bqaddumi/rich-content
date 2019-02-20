/* eslint-disable */
import React, { Component } from 'react';
import MobileDetect from 'mobile-detect';
import { convertFromRaw, convertToRaw } from '@wix/draft-js';
import { EditorState } from 'wix-rich-content-editor';
import { normalizeInitialState } from 'wix-rich-content-common';
import './App.css';
import RichContentRawDataViewer from './RichContentRawDataViewer';
import { Editor } from './editor';
import { Viewer } from './viewer';
import Resizable from 're-resizable';

const anchorTarget = '_top';
const relValue = 'noreferrer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastSave: new Date(),
      editorState: EditorState.createEmpty(),
      readOnly: false,
      mounted: true,
      textToolbarType: 'inline',
      showContentStateEditor: true,
      showDevToggles: true,
    };
    this.md = window ? new MobileDetect(window.navigator.userAgent) : null;
  }

  onMountedChange = event => this.setState({ mounted: event.target.checked });

  onTextToolbarTypeChange = event => {
    this.setState({ textToolbarType: event.target.checked ? 'static' : 'inline' });
  };

  onReadOnlyChange = event => this.setState({ readOnly: event.target.checked });

  onShowContentStateEditorChange = event =>
    this.setState({ showContentStateEditor: event.target.checked });

  onEditorChange = editorState => {
    this.setState({
      lastSave: new Date(),
      editorState,
      viewerState: convertToRaw(editorState.getCurrentContent()),
    });
  };

  isMobile = () => {
    return this.md && this.md.mobile() !== null;
  };

  generateEditorState() {
    if (this.state.content && this.state.content.jsObject) {
      const normalizedState = normalizeInitialState(this.state.content.jsObject, {
        anchorTarget,
        relValue,
      });
      const editorState = EditorState.createWithContent(convertFromRaw(normalizedState));
      this.setState({ editorState, viewerState: normalizedState });
    }
  }

  render() {
    const { showDevToggles } = this.state;
    return (
      <div className="wrapper">
        <div className="container">
          {!this.isMobile() && (
            <div className="header">
              <h1 onClick={() => this.setState({ showDevToggles: !showDevToggles })}>
                Wix Rich Content Editor
              </h1>
              <div
                className="toggle-container"
                style={{ display: this.state.showDevToggles ? 'block' : 'none' }}
              >
                <div className="toggle">
                  <input
                    type="checkbox"
                    id="mountedToggle"
                    onChange={this.onMountedChange}
                    defaultChecked={this.state.mounted}
                  />
                  <label htmlFor="mountedToggle">Mounted</label>
                </div>
                <div className="toggle">
                  <input
                    type="checkbox"
                    id="textToolbarType"
                    onChange={this.onTextToolbarTypeChange}
                    defaultChecked={this.state.textToolbarType === 'static'}
                  />
                  <label htmlFor="textToolbarType">Static Text Toolbar</label>
                </div>
                <div className="toggle">
                  <input
                    type="checkbox"
                    id="readOnlyToggle"
                    onChange={this.onReadOnlyChange}
                    defaultChecked={this.state.readOnly}
                  />
                  <label htmlFor="readOnlyToggle">Read Only</label>
                </div>
                <div className="toggle">
                  <input
                    type="checkbox"
                    id="showContentStateEditorToggle"
                    onChange={this.onShowContentStateEditorChange}
                    defaultChecked={this.state.showContentStateEditor}
                  />
                  <label htmlFor="showContentStateEditorToggle">Show Content State Editor</label>
                </div>
              </div>
              <span className="intro">Last saved on {this.state.lastSave.toTimeString()}</span>
            </div>
          )}
          <div className="content">
            {this.state.mounted && (
              <div className="columns">
                <Resizable
                  onResize={(event, direction, { clientWidth }) =>
                    this.setState({ contentWidth: clientWidth - 2 })
                  }
                  defaultSize={{ width: '60%' }}
                  className={'resizable'}
                >
                  <Editor
                    onChange={this.onEditorChange}
                    editorState={this.state.editorState}
                    readOnly={this.state.readOnly}
                    mobile={this.isMobile()}
                    textToolbarType={this.state.textToolbarType}
                  />
                  <Viewer
                    initialState={this.state.viewerState}
                    mobile={this.isMobile()}
                    config={this.config}
                  />
                </Resizable>
                {this.state.showContentStateEditor && !this.isMobile() && (
                  <div className="column side">
                    <RichContentRawDataViewer
                      onChange={content => this.setState({ content })}
                      content={convertToRaw(this.state.editorState.getCurrentContent())}
                      width={'100%'}
                    />
                    <button
                      className="raw_input_button submit"
                      onClick={() => this.generateEditorState()}
                    >
                      Apply Rich Content
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
