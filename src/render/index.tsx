import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import ErrorBoundary from '../components/errorBoundary/errorBoundary';
import 'reflect-metadata';
import { BEM } from '../common/utils/bem';
import dndTypes from '../constant/drag';
import { useDrop } from 'react-dnd';
import 'antd/dist/antd.css';
import { useGlobalContext } from '../context/global';
import { Provider } from 'react-redux';
import store from './store/renderStore';
import { AstNodeType } from '../core/ast';
import Material from './material';
import { notification, Icon } from 'antd';
import './index.scss';
import eventManager from '../eventManager';

type MaterialDropItem = {
  type: string;
  materialType: string;
  config: {
    name: string;
  }[];
  nodeDemandCapacity: number;
  layoutCapacity: number;
  isLayoutNode: boolean;
  desc: string;
  icon: string;
};

const Render: React.FC = function() {
  const [, setUpdater] = useState(0);
  const [hasSelectPage, setHasSelectPage] = useState<boolean>(false);
  const { ast, astTool, eBus } = useGlobalContext();
  const RenderByAstTree = useCallback(() => {
    setHasSelectPage(astTool.hasSelectPage());
  }, [astTool, ast]);

  const forceUpdate = useCallback(() => setUpdater(updater => updater + 1), []);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: [dndTypes.MATERIAL],
    drop: (item: MaterialDropItem, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      if (!hasSelectPage) {
        notification.error({
          message: '还没有选择一个添加页面哦',
        });
      } else {
        const selectedPageId = astTool.getSelectPage();
        if (selectedPageId) {
          const selectedPage = astTool.getPageById(selectedPageId);
          if (selectedPage) {
            if (item.isLayoutNode) {
              astTool.appendNodeToPage(
                astTool.makeLayoutNode({
                  name: '',
                  layoutCapacity: item.layoutCapacity,
                  nodeDemandCapacity: item.nodeDemandCapacity,
                  type: item.materialType,
                }),
              );
            } else {
              eventManager.error('功能物料必须位于布局物料中');
            }
          }
        }
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  useEffect(() => {
    RenderByAstTree();
  }, [ast]);

  useEffect(() => {
    notification.open({
      message: '渲染引擎加载完成',
      duration: 2,
      icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
    });
    eBus.listen('pageChange', page => {
      forceUpdate();
    });
  }, []);

  const renderComponent = (father: AstNodeType): any => {
    if (father.children)
      return father.children.map(cmp => {
        let child = null;
        if (astTool.hasChildren(cmp)) {
          child = renderComponent(cmp);
        }

        return (
          <Material id={cmp.id} astTool={astTool} config={cmp.config} materialType={cmp.type}>
            {child}
          </Material>
        );
      });

    return null;
  };

  const renderPage = () => {
    let cmps: AstNodeType[] = [];
    if (astTool.hasSelectPage()) cmps = astTool.getSelectPageComponents();
    else {
      const indexPage = astTool.getIndexPage();
      if (indexPage) cmps = astTool.getPageComponents(indexPage);

      const pages = astTool.getPageList();
      if (pages && pages.length > 0) cmps = astTool.getPageComponents(pages[0]);
    }

    return cmps.map(cmp => {
      return (
        <Material id={cmp.id} astTool={astTool} config={cmp.config} materialType={cmp.type}>
          {renderComponent(cmp)}
        </Material>
      );
    });
  };

  return (
    <Provider store={store}>
      <div ref={drop} className={BEM('render', 'wrapper')}>
        <ErrorBoundary>
          {!hasSelectPage && (
            <div className={BEM('render', 'info')}>
              <div>还没有选择页面哦</div>
              <div>如果还没有添加页面，试着添加一个页面</div>
            </div>
          )}
          <div>{renderPage()}</div>
        </ErrorBoundary>
      </div>
    </Provider>
  );
};

export default Render;
