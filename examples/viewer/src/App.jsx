import React, { Component } from 'react';
import MobileDetect from 'mobile-detect';
import { normalizeInitialState, RichContentModal } from 'wix-rich-content-common';
import RichContentRawDataViewer from './RichContentRawDataViewer';
import TestData from './TestData/initial-state';
import styles from './App.scss';
import { Viewer } from './viewer';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      raw: TestData.onlyText,
    };
    this.md = window ? new MobileDetect(window.navigator.userAgent) : null;
  }

  /* eslint-disable no-console */
  handleContentChange = () => {
    const value = document.getElementById('testData').value;
    this.setState({
      raw: TestData[value],
    });
    //console.log('on change are', TestData[value]);
  };

  isMobile = () => {
    return this.md && this.md.mobile() !== null;
  };

  generateViewerState() {
    if (this.state.content && this.state.content.jsObject) {
      const normalizedState = normalizeInitialState(this.state.content.jsObject, {
        anchorTarget,
        relValue,
      });
      this.setState({ raw: normalizedState });
    }
  }

  render() {
    const contentOptions = Object.keys(TestData).map(key => (
      <option value={key} key={key}>
        {' '}
        {key}
      </option>
    ));

    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          {!this.isMobile() ? (
            <div className={styles.header}>
              <h1>Wix Rich Content Viewer</h1>
              <div className={styles['toggle-container']}>
                <div className={styles.toggle}>
                  <select
                    id="testData"
                    name="testData"
                    onChange={() => this.handleContentChange(this)}
                  >
                    {contentOptions}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <select id="testData" name="testData" onChange={() => this.handleContentChange(this)}>
              {contentOptions}
            </select>
          )}
          <div className={styles.content}>
            <div className={styles.columns}>
              <div className={styles.column}>
                <Viewer
                  initialState={this.state.raw}
                  mobile={this.isMobile()}
                  config={this.config}
                />
              </div>
              {!this.isMobile() && (
                <div className={styles.column}>
                  <RichContentRawDataViewer
                    onChange={content => this.setState({ content })}
                    content={this.state.raw}
                    width="740px"
                  />
                  <button
                    className={styles.raw_input_button}
                    onClick={() => this.generateViewerState()}
                  >
                    Apply Rich Content
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
