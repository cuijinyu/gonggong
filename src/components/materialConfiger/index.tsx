import React, { useEffect, useState, useCallback } from 'react';
import { BEM } from '../../common/utils/bem';
import _ from 'lodash';
import './index.scss';
import { Popover, Icon, Drawer, Button } from 'antd';
import { useGlobalContext } from '../../context/global';
import eventManager from '../../eventManager';
import { AstNodeType } from '../../core/ast';
import Material from '../../materials';
import { getMetaInfo } from '../../materials';

const MaterialConfiger = () => {
  const [selectedElement, setSelectedElement] = useState<AstNodeType | null>(null);
  const [metaConfig, setMetaConfig] = useState<{ config: { name: string }[] } | null>(null);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [codeEditorVisible, setCodeEditorVisible] = useState<boolean>(false);

  useEffect(() => {
    eventManager.listen('elementSelect', ({ component }: { component: AstNodeType }) => {
      setSelectedElement(component);
      const componentMetaInfo = getMetaInfo(_.get(Material, component.type)).config;
      if (componentMetaInfo) {
        setMetaConfig({ config: componentMetaInfo });
      }
    });
  }, []);

  const editProperty = useCallback(() => {
    setDrawerVisible(true);
  }, []);

  return (
    <>
      <div className={BEM('materialConfiger')}>
        <div className={BEM('materialConfiger', 'title')}>
          物料配置器
          <Popover content={'在这里配置物料属性'}>
            <Icon type="info-circle" style={{ marginLeft: 5, marginRight: 5 }} />
          </Popover>
        </div>
        <div>
          <div className={BEM('materialConfiger', 'panel')}>
            <div className={BEM('materialConfiger', 'panel-title')}>基础信息</div>
            <div className={BEM('materialConfiger', 'panel-item')}>
              <div className={BEM('materialConfiger', 'panel-item-title')}>id:</div>
              <div className={BEM('materialConfiger', 'panel-item-value')}>{selectedElement?.id}</div>
            </div>
          </div>
          <div className={BEM('materialConfiger', 'panel')}>
            <div className={BEM('materialConfiger', 'panel-title')}>基础配置</div>
            <div className={BEM('materialConfiger', 'panel-item')}>
              <div className={BEM('materialConfiger', 'panel-item-title')}>name:</div>
              <div className={BEM('materialConfiger', 'panel-item-value')}>
                {selectedElement?.name} <Button>编辑</Button>
              </div>
            </div>
          </div>
          <div className={BEM('materialConfiger', 'panel')}>
            <div className={BEM('materialConfiger', 'panel-title')}>物料配置项</div>
            {metaConfig?.config.map(cfg => {
              return (
                <div className={BEM('materialConfiger', 'panel-item')}>
                  <div className={BEM('materialConfiger', 'panel-item-title')}>{cfg.name}</div>
                  <div className={BEM('materialConfiger', 'panel-item-value')}>
                    <Button
                      onClick={() => {
                        editProperty();
                      }}>
                      编辑
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Drawer
        onClose={() => {
          setDrawerVisible(false);
        }}
        title={'属性编辑器'}
        visible={drawerVisible}
        placement={'right'}></Drawer>
    </>
  );
};

export default MaterialConfiger;
