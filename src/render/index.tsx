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
import MaterialHOC from './materialHOC';
import { notification, Icon } from 'antd';
import './index.scss';

const Render: React.FC = function() {
  const { dispatch } = store;
  const [updater, setUpdater] = useState(0);
  const [hasSelectPage, setHasSelectPage] = useState<boolean>(false);
  const { ast, astTool } = useGlobalContext();
  const RenderByAstTree = useCallback(() => {
    setHasSelectPage(astTool.hasSelectPage());
  }, [astTool, ast]);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: [dndTypes.MATERIAL, dndTypes.ELEMENT],
    drop: item => {
      if (!hasSelectPage) {
        notification.error({
          message: '还没有选择一个添加页面哦',
        });
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  useEffect(() => {
    RenderByAstTree();
    notification.open({
      message: '渲染引擎加载完成',
      duration: 2,
      icon: <Icon type="smile" style={{ color: '#108ee9' }} />,
    });
  }, [ast]);

  const renderComponent = (father: AstNodeType): any => {
    if (father.children)
      return father.children.map(cmp => {
        let child = null;
        if (astTool.hasChildren(cmp)) {
          child = renderComponent(cmp);
        }

        return (
          <MaterialHOC id={cmp.id} astTool={astTool} config={cmp.config} materialType={cmp.type}>
            {child}
          </MaterialHOC>
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
        <MaterialHOC id={cmp.id} astTool={astTool} config={cmp.config} materialType={cmp.type}>
          {renderComponent(cmp)}
        </MaterialHOC>
      );
    });
  };

  return (
    <Provider store={store}>
      <div ref={drop} className={BEM('render', 'wrapper')}>
        <ErrorBoundary>
          {!hasSelectPage && <div>还没有选择页面哦</div>}
          <div>{renderPage()}</div>
        </ErrorBoundary>
      </div>
    </Provider>
  );
};

export default Render;
