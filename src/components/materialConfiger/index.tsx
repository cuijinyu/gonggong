import React, { useEffect } from 'react';
import { BEM } from '../../common/utils/bem';
import _ from 'lodash';
import './index.scss';
import { Popover, Icon } from 'antd';
import { useGlobalContext } from '../../context/global';
import eventManager from '../../eventManager';
import { AstNodeType } from '../../core/ast';
import Material from '../../materials';
import { getMetaInfo } from '../../materials';

const MaterialConfiger = () => {
  const { astTool } = useGlobalContext();

  useEffect(() => {
    eventManager.listen('elementSelect', ({ component }: { component: AstNodeType }) => {
      console.log(getMetaInfo(_.get(Material, component.type)));
    });
  }, []);

  return (
    <div className={BEM('materialConfiger')}>
      <div className={BEM('materialConfiger', 'title')}>
        物料配置器
        <Popover content={'在这里配置物料属性'}>
          <Icon type="info-circle" style={{ marginLeft: 5, marginRight: 5 }} />
        </Popover>
      </div>
      <div></div>
    </div>
  );
};

export default MaterialConfiger;
