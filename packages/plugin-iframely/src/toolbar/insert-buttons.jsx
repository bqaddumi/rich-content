import { DEFAULTS } from '../constants';
import { TOOLBARS, getModalStyles } from 'wix-rich-content-common';
import { IframelySettingsModal } from './IframelySettingsModal';
import { InsertPluginIcon } from './../icons';

export default ({ helpers, t }) => {
  return [
    {
      type: 'modal',
      name: 'Iframely',
      tooltipText: t('SoundCloudPlugin_InsertButton_Tooltip'),
      Icon: InsertPluginIcon,
      componentData: DEFAULTS,
      toolbars: [TOOLBARS.FOOTER, TOOLBARS.SIDE],
      modalElement: IframelySettingsModal,
      modalStyles: getModalStyles({ customStyles: DEFAULTS, fullScreen: true }),
      helpers,
    },
  ];
};
