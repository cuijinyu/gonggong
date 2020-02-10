import React, { useEffect, useCallback } from 'react';
import { BEM } from '../../common/utils/bem';
import './index.scss';
import { Popover } from 'antd';

export default () => {
  return (
    <div className={BEM('renderTree')}>
      <Popover content={'渲染树是配置渲染信息的展示区域'}>
        <div className={BEM('renderTree', 'title')}>渲染树</div>
      </Popover>
    </div>
  );
};
