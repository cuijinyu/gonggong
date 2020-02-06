import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import ErrorBoundary from '../components/errorBoundary/errorBoundary';
import 'reflect-metadata';
import { BEM } from '../common/utils/bem';
import Util from './helper';
import Materials from '../materials/index';
import 'antd/dist/antd.css';
import { useGlobalContext } from '../context/global';
import { Provider } from 'react-redux';
import store from './store/renderStore';
import AstParser, {
  AstNodeType,
  ConfigType,
  StaticConfigValue,
  StateConfigValue,
  MethodConfigValue,
} from '../common/utils/ast';
import { addState, setStateById, addMethod } from './store/renderAction';
import MaterialHOC from './materialHOC';
import { configConsumerProps } from 'antd/lib/config-provider';

const { injectMethod } = Util;

const Render: React.FC = function() {
  const { dispatch } = store;
  const [updater, setUpdater] = useState(0);
  const tst = React.createElement(Materials.Input, {
    onClick: injectMethod(`
            () => {
                listen('123');
                emit('234');
            }
        `),
  });
  const { ast, astTool } = useGlobalContext();
  const RenderByAstTree = useCallback(() => {
    const page = astTool.createNewPage({
      name: 'index',
      isIndex: true,
      path: '/index',
    });
    astTool.changePage(page.id);
    if (page) {
      const row = astTool.makeLayoutNode(Materials.getMetaInfo(Materials.Row) as any);

      const col = astTool.makeLayoutNode(Materials.getMetaInfo(Materials.Col) as any);

      const input = astTool.makeFunctionNode(Materials.getMetaInfo(Materials.Input));

      const input2 = astTool.makeFunctionNode(Materials.getMetaInfo(Materials.Input));

      astTool.appendNodeToPage(row);

      astTool.appendNode(row, col);

      astTool.appendNode(col, input);

      astTool.appendNodeAfter(input, input2);

      const state = astTool.appendState({
        name: 'test',
        initValue: 1,
      });
      const state2 = astTool.appendState({
        name: 'test2',
        initValue: 2,
      });
      const value = astTool.makeValueConfig(2);
      const value2 = astTool.makeStateConfig(state2.id);
      const method = astTool.appendMethod(
        `
                function abc() {
                    console.log(state, method, setState, ajax);
                }
                `,
        'test',
        input,
      );
      const md = astTool.makeMethodConfig(method?.id || '');

      astTool.setNodeKeyConfig(input, 'value2', value);

      astTool.setNodeKeyConfig(input, 'value', value2);

      astTool.setNodeKeyConfig(input, 'onChange', md);

      astTool.relateStateToNode(state as any, input);

      dispatch(addState(state));
      dispatch(addState(state2));
      if (method)
        dispatch(
          addMethod({
            id: method.id,
            name: method.name,
            method: method.methodCode as any,
          }),
        );

      console.log(astTool);
    }
  }, [astTool, ast]);

  useEffect(() => {
    RenderByAstTree();
  }, []);

  const renderComponent = (father: AstNodeType): any => {
    if (father.children)
      return father.children.map(cmp => {
        let child = null;
        if (astTool.hasChildren(cmp)) child = renderComponent(cmp);

        return (
          <MaterialHOC astTool={astTool} config={cmp.config} materialType={cmp.type}>
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
        <MaterialHOC astTool={astTool} config={cmp.config} materialType={cmp.type}>
          {renderComponent(cmp)}
        </MaterialHOC>
      );
    });
  };

  return (
    <Provider store={store}>
      <div className={BEM('render', 'wrapper')}>
        <ErrorBoundary>
          <div>{renderPage()}</div>
        </ErrorBoundary>
      </div>
    </Provider>
  );
};

injectMethod(`function abc() {
    console.log('!!!!!!!!!!!!!')
    console.log(state, method, setState, ajax)
}`);

export default Render;
