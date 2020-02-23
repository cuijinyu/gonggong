import React, { useEffect, useState } from 'react';
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
  const [selectedElement, setSelectedElement] = useState<AstNodeType | null>(null);
  const [metaConfig, setMetaConfig] = useState<{ config: { name: string }[] } | null>(null);

  useEffect(() => {
    eventManager.listen('elementSelect', ({ component }: { component: AstNodeType }) => {
      setSelectedElement(component);
      const componentMetaInfo = getMetaInfo(_.get(Material, component.type)).config;
      if (componentMetaInfo) {
        setMetaConfig({ config: componentMetaInfo });
      }
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
      <div>
        <div>
          <div>基础信息</div>
          <div>id: {selectedElement?.id}</div>
        </div>
        <div>
          <div>基础配置</div>
          <div>id: {selectedElement?.id}</div>
        </div>
        <div>
          <div>物料配置项</div>
          {metaConfig?.config.map(cfg => {
            return cfg.name;
          })}
        </div>
      </div>
    </div>
  );
};

export default MaterialConfiger;
