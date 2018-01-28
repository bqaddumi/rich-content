import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SelectionList, SelectionListOption } from 'stylable-components/dist/src/components/selection-list';

import style from './layout-selector.scss';
class LayoutSelector extends Component {
  layouts = [
    { layoutId: 0, name: 'Grid' },
    { layoutId: 1, name: 'Masonry' },
    { layoutId: 2, name: 'Collage' },
    { layoutId: 3, name: 'Thumbnails' },
    { layoutId: 4, name: 'Slideshow' },
    { layoutId: 5, name: 'Panorama' },
    { layoutId: 6, name: 'Columns' },
    { layoutId: 7, name: 'Slides' },
  ];

  layoutsMapper = sidebarLayoutId => {
    const { sidebar, original } = this.props.layoutsOrder;
    const sidebarLayoutName = sidebar[sidebarLayoutId];
    const originalLayoutId = original.indexOf(sidebarLayoutName);
    return originalLayoutId;
  }

  dataMapper = ({ layoutId, name }) => ({ value: layoutId, label: name });

  renderOption = ({ layoutId }, { label }, { id, selected, focused }) => (
    <SelectionListOption id={id} value={layoutId} selected={selected} focused={focused}>
      <div className={style['layout-tile']}>
        <div className={style[selected ? `${label.toLowerCase()}_selected` : label.toLowerCase()]} />
        <div>{label}</div>
      </div>
    </SelectionListOption>
  );

  onLayoutChange = ({ value }) => {
    const originalLayoutId = this.layoutsMapper(value);
    this.props.onChange(originalLayoutId);
  }

  render() {
    const { value } = this.props;
    return (
      <SelectionList
        className={style['layouts-grid']}
        dataSource={this.layouts}
        dataMapper={this.dataMapper}
        renderItem={this.renderOption}
        value={value}
        onChange={this.onLayoutChange}
      />
    );
  }
}

LayoutSelector.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  layoutsOrder: PropTypes.object.isRequired,
};

export default LayoutSelector;
