import React, { useEffect, useCallback, useState } from 'react';
import { BEM } from '../../common/utils/bem';
import './index.scss';
import { Popover } from 'antd';
import { useGlobalContext } from '../../context/global';
import { AstNodeType } from '../../core/ast';

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

  const renderComponentTree = useCallback((component: AstNodeType, depth: number) => {
    return (
      <div
        style={{
          paddingLeft: depth * 20,
        }}>
        {component.isLayoutNode && (
          <div className={BEM('renderTree', 'layout-container')}>
            <svg width="21" height="24" viewBox="0 0 21 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 3H4C2.9 3 2.01 3.9 2.01 5L2 21L9 18L16 21V5C16 3.9 15.1 3 14 3Z" fill="#2196F3" />
            </svg>
            {component.type}
          </div>
        )}
        {!component.isLayoutNode && <div className={BEM('renderTree', 'fc-container')}>{component.type}</div>}
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
      <Popover content={'渲染树是配置渲染信息的展示区域'}>
        <div className={BEM('renderTree', 'title')}>渲染树</div>
      </Popover>
      <div>
        {selectedPage?.components?.map(cmp => {
          return renderComponentTree(cmp, 0);
        })}
      </div>
    </div>
  );
};
