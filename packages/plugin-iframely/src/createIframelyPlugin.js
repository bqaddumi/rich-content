import { createBasePlugin } from 'wix-rich-content-common';
import { IFRAMELY_TYPE } from './constants';
import { IframelyViewer } from './IframelyViewer';
import createToolbar from './toolbar';
import createDraftIframelyPlugin from '@jimmycode/draft-js-iframely-plugin';
import '@jimmycode/draft-js-iframely-plugin/lib/plugin.css';
import { EditorState } from '@wix/draft-js';
import { getCurrentBlock } from '@jimmycode/draft-js-toolbox';

function removeBlockFromEditorState(editorState, blockKey) {
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap();
  const newBlockMap = blockMap.remove(blockKey);
  const newContentState = contentState.merge({
    blockMap: newBlockMap,
  });
  const newEditorState = EditorState.push(editorState, newContentState, 'remove-range');
  return newEditorState;
}

const createIframelyPlugin = (config = {}) => {
  const type = IFRAMELY_TYPE;
  const { helpers, theme, t, [type]: settings = {}, ...rest } = config;

  const draftIframelyPlugin = createDraftIframelyPlugin({
    options: {
      apiKey: '72478b7e521daa15948726',
    },
  });

  console.log('hello');
  console.log(draftIframelyPlugin);

  //const draftJsToolbox = require('@jimmycode/draft-js-toolbox');
  const { handleReturn: iframleyHandleReturn, blockRendererFn } = draftIframelyPlugin;

  const handleReturn = async (event, editorState, { setEditorState }) => {
    if (iframleyHandleReturn(event, editorState, { setEditorState }) === 'handled') {
      const currentBlock = getCurrentBlock(editorState);
      const newEditorState = removeBlockFromEditorState(editorState, currentBlock.key);
      setEditorState(newEditorState);
      return 'handled';
    } else {
      return 'not-handled';
    }
  };

  return createBasePlugin(
    {
      component: IframelyViewer,
      type: IFRAMELY_TYPE,
      settings,
      theme,
      toolbar: createToolbar({
        settings,
        helpers,
        theme,
        t,
      }),
      helpers,
      t,
      ...rest,
    },
    {
      handleReturn,
      blockRendererFn,
    }
  );
};

export { createIframelyPlugin, IFRAMELY_TYPE };
