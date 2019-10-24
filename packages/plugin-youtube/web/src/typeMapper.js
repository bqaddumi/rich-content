import YoutubeViewer from './components/youtube-viewer';
import { YOUTUBE_TYPE } from './constants';
import { containerClassName } from './classNameStrategies';

export const typeMapper = () => ({
  [YOUTUBE_TYPE]: {
    component: YoutubeViewer,
    classNameStrategies: {
      container: containerClassName,
    },
  },
});
