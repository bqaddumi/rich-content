import { DEFAULTS, MobileFullScreenCustomStyle, DesktopFlyOutModalStyles } from '../constants';
import {
  getModalStyles,
  TOOLBARS,
  DECORATION_MODE,
  decorateComponentWithProps,
} from 'wix-rich-content-common';
import YoutubeApiInputModal from './youtubeApiInputModal';
import { InsertPluginIcon, InsertPluginMobileIcon } from '../icons';
import Arrow from './arrow';

export default ({ helpers, t, settings, isMobile }) => {
  console.log(isMobile);
  return [
    {
      type: 'modal',
      name: 'YouTube',
      tooltipText: t('YoutubePlugin_InsertButton_Tooltip'),
      Icon: isMobile ? InsertPluginMobileIcon : InsertPluginIcon,
      componentData: DEFAULTS,
      toolbars: [TOOLBARS.FOOTER],
      modalElement: decorateComponentWithProps(YoutubeApiInputModal, { ...settings, isMobile }),
      modalStyles: isMobile
        ? getModalStyles({ customStyles: MobileFullScreenCustomStyle, fullScreen: true })
        : null,
      modalStylesFn: ({ buttonRef }) => {
        const modalStyles = getModalStyles({
          customStyles: DesktopFlyOutModalStyles,
          fullScreen: true,
        });
        const { top, left } = buttonRef.getBoundingClientRect();
        const modalLeft = left - 66;
        const modalTop = top - 386;
        return {
          ...modalStyles,
          content: {
            ...modalStyles.content,
            top: modalTop,
            left: modalLeft,
            margin: 0,
            position: 'absolute',
          },
        };
      },
      modalDecorations: [
        {
          decorationMode: DECORATION_MODE.APPEND,
          decorator: Arrow,
        },
      ],
      helpers,
    },
  ];
};
