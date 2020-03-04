import React, { useEffect, useState, useCallback } from 'react';
import { BEM } from '../../common/utils/bem';
import _ from 'lodash';
import './index.scss';
import { Popover, Icon, Drawer, Button, Modal, Tag } from 'antd';
import { useGlobalContext } from '../../context/global';
import eventManager from '../../eventManager';
import { AstNodeType } from '../../core/ast';
import Material from '../../materials';
import { getMetaInfo } from '../../materials';
import PropertyEditor from './components/propertyEditor';
import ConfigerContext, { SelectPropertyConfigName } from './context';
import StyleEditor from './components/styleEditor';

const MaterialConfiger = () => {
  const [selectedElement, setSelectedElement] = useState<AstNodeType | null>(null);
  const [metaConfig, setMetaConfig] = useState<{ config: { name: string }[] } | null>(null);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [codeEditorVisible, setCodeEditorVisible] = useState<boolean>(false);

  const [selectElementId, setSelectElementId] = useState<string>('');
  const [selectPropertyName, setSelectPropertyName] = useState<string>('');
  const [selectPropertyConfig, setSelectPropertyConfig] = useState<SelectPropertyConfigName>();
  const [nodeConfig, setNodeConfig] = useState<any>({});

  const { ast, astTool } = useGlobalContext();

  useEffect(() => {
    eventManager.listen('elementSelect', ({ component }: { component: AstNodeType }) => {
      setSelectedElement(component);
      setSelectElementId(component.id);
      const componentMetaInfo = getMetaInfo(_.get(Material, component.type)).config;
      if (componentMetaInfo) {
        setMetaConfig({ config: componentMetaInfo });
      }
    });
  }, []);

  useEffect(() => {
    setNodeConfig(astTool.getNodeConfigById(selectElementId));
  }, [ast, astTool, selectElementId]);

  const editProperty = useCallback((propertyName: string) => {
    setSelectPropertyName(propertyName);
    setDrawerVisible(true);
  }, []);

  const renderValueLabel = (nodeConfig: any, cfg: any) => {
    if (nodeConfig[cfg.name]) {
      switch (nodeConfig[cfg.name].type) {
        case 'static':
          return <Tag>{nodeConfig[cfg.name]?.value}</Tag>;
        case 'state':
          return <Tag color={'red'}></Tag>;
        case 'method':
          return <Tag color={'green'}></Tag>;
        default:
          return null;
      }
    }
  };

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
            <div className={BEM('materialConfiger', 'style-editor')}>
              <ConfigerContext.Provider
                value={{
                  selectElementId,
                  selectPropertyConfig,
                  selectPropertyName,
                  setSelectElementId,
                  setSelectPropertyConfig,
                  setSelectPropertyName,
                }}>
                <StyleEditor />
              </ConfigerContext.Provider>
            </div>
          </div>
          <div className={BEM('materialConfiger', 'panel')}>
            <div className={BEM('materialConfiger', 'panel-title')}>物料配置项</div>
            {metaConfig?.config.map(cfg => {
              return (
                <div className={BEM('materialConfiger', 'panel-item')}>
                  <div className={BEM('materialConfiger', 'panel-item-title')}>
                    {cfg.name}
                    {nodeConfig && renderValueLabel(nodeConfig, cfg)}
                  </div>
                  <div className={BEM('materialConfiger', 'panel-item-value')}>
                    <Button
                      onClick={() => {
                        editProperty(cfg.name);
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
      <ConfigerContext.Provider
        value={{
          selectElementId,
          selectPropertyConfig,
          selectPropertyName,
          setSelectElementId,
          setSelectPropertyConfig,
          setSelectPropertyName,
        }}>
        <Drawer
          onClose={() => {
            setDrawerVisible(false);
          }}
          title={'属性编辑器'}
          visible={drawerVisible}
          placement={'right'}>
          <PropertyEditor
            onOk={(type, value) => {
              setDrawerVisible(false);
              let typedConfig: any;
              switch (type) {
                case 'static':
                  typedConfig = astTool.makeValueConfig(value);
                  break;
                case 'state':
                  break;
                case 'method':
                  break;
              }
              const node = astTool.getNodeById(selectElementId);
              if (node && typedConfig) {
                astTool.setNodeKeyConfig(node, selectPropertyName, typedConfig);
              }
            }}
          />
        </Drawer>
      </ConfigerContext.Provider>
    </>
  );
};

export default MaterialConfiger;
