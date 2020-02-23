import React, { useEffect, useCallback, useState } from 'react';
import { BEM } from '../../common/utils/bem';
import './index.scss';
import { Popover, Icon } from 'antd';
import { useGlobalContext } from '../../context/global';
import { AstNodeType } from '../../core/ast';
import eventManager from '../../eventManager';

export default () => {
  const { ast, astTool, eBus } = useGlobalContext();
  const [selectedPage, setSelectedPage] = useState<ReturnType<typeof astTool.getPageById> | undefined>();

  const getSelectedPage = () => {
    const selectedPageId = astTool.getSelectPage();
    if (selectedPageId) {
      const page = astTool.getPageById(selectedPageId);
      setSelectedPage(page);
    }
  };

  useEffect(() => {
    eBus.listen('pageChange', page => {
      getSelectedPage();
    });
  }, []);

  useEffect(() => {
    getSelectedPage();
  }, [ast]);

  const handleElementClick = useCallback((component: any) => {
    eventManager.emit('elementSelect', { component });
  }, []);

  const renderComponentTree = useCallback((component: AstNodeType, depth: number) => {
    return (
      <div
        style={{
          paddingLeft: depth === 0 ? 0 : 20,
        }}>
        {component.isLayoutNode && (
          <div onClick={() => handleElementClick(component)} className={BEM('renderTree', 'layout-container')}>
            <svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 3H4C2.9 3 2.01 3.9 2.01 5L2 21L9 18L16 21V5C16 3.9 15.1 3 14 3Z" fill="#2196F3" />
            </svg>
            {component.type}
          </div>
        )}
        {!component.isLayoutNode && (
          <div onClick={() => handleElementClick(component)} className={BEM('renderTree', 'fc-container')}>
            {component.type}
          </div>
        )}
        {component.children && (
          <div className={BEM('renderTree', 'children-container')}>
            {component.children.map(childComponent => {
              return renderComponentTree(childComponent, depth + 1);
            })}
          </div>
        )}
      </div>
    );
  }, []);

  return (
    <div className={BEM('renderTree')}>
      <div className={BEM('renderTree', 'title')}>
        渲染树
        <Popover content={'渲染树是配置渲染信息的展示区域'}>
          <Icon type="info-circle" style={{ marginLeft: 5, marginRight: 5 }} />
        </Popover>
      </div>
      <div>
        {selectedPage?.components?.map(cmp => {
          return renderComponentTree(cmp, 0);
        })}
      </div>
    </div>
  );
};
