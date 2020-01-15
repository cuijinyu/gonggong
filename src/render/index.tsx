import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import ErrorBoundary from '../components/errorBoundary/errorBoundary';
import "reflect-metadata";
import { BEM } from '../common/utils/bem';
import Util from './helper';
import Materials from '../materials/index';
import 'antd/dist/antd.css'
import { useGlobalContext } from '../context/global';
import { Provider } from 'react-redux';
import store from './store/renderStore';
import AstParser, { AstNodeType, ConfigType } from '../common/utils/ast';
import { addState } from './store/renderAction';

const { injectMethod } = Util;

const Render = function () {
    const [updater, setUpdater] = useState(0);
    const tst = React.createElement(Materials.Input, {
        onClick: injectMethod(`
            () => {
                listen('123');
                emit('234');
            }
        `)
    })
    const { ast, astTool } = useGlobalContext();
    const RenderByAstTree = useCallback(() => {
        const page = astTool.createNewPage({
            name: 'index',
            isIndex: true,
            path: '/index'
        });
        astTool.changePage(page.id);
        if (page) {
            const row = astTool.makeLayoutNode(
                Materials.getMetaInfo(
                    Materials.Row
                ) as any
            )

            const col = astTool.makeLayoutNode(
                Materials.getMetaInfo(
                    Materials.Col
                ) as any
            )

            const input = astTool.makeFunctionNode(
                Materials.getMetaInfo(
                    Materials.Input
                )
            )

            const input2 = astTool.makeFunctionNode(
                Materials.getMetaInfo(
                    Materials.Input
                )
            )

            astTool.appendNodeToPage(
                row
            )

            astTool.appendNode(
                row,
                col
            )

            astTool.appendNode(
                col, 
                input
            )


            astTool.appendNodeAfter(
                input,
                input2
            )

            const state = astTool.appendState({
                name: 'test',
                initValue: 1
            })
            console.log(state);
            console.log(input)
            astTool.relateStateToNode(
                state as any,
                input
            )

            dispatch(addState(state));

            console.log(astTool);
        }
    }, [astTool, ast]);

    useEffect(() => {
        RenderByAstTree();
        console.log(store.getState());
        console.log(store.getState());
        return () => {
            
        };
    }, [])

    const { dispatch } = store;

    const mapStoreStateToMaterial = (stateId: string) => {
        const { stateReducer } = store.getState();
        const filterdStates = stateReducer.states.filter(state => {
            return state.id === stateId
        })
        if (
            filterdStates &&
            filterdStates.length > 0
        ) {
            return filterdStates[0];
        }
    }

    const mapStoreMethodToMaterial = (methodId: string) => {
        const { methodReducer } = store.getState();
        const filterdMethod = methodReducer
    }

    const mapConfigToMaterial = (config: ConfigType) => {
        Object.keys(config).map(key => {
            switch(config[key].type) {
                case 'static':
                    break;
                case 'state':
                    break;
                case 'method':
                    break;
                default:
            }
        })
    }

    const renderPage = () => {
        let cmps: AstNodeType[] = [];
        if (astTool.hasSelectPage()) {
            cmps = astTool.getSelectPageComponents();
        } else {
            const indexPage = astTool.getIndexPage();
            if (indexPage) {
                cmps = astTool.getPageComponents(indexPage);
            }

            const pages = astTool.getPageList();
            if (
                pages &&
                pages.length > 0
            ) {
                cmps = astTool.getPageComponents(pages[0]);
            }
        }

        return cmps.map(cmp => {
            return React.createElement(
                _.get(Materials, cmp.type),
                {
                    children: renderComponent(cmp),
                    key: cmp.id
                }
            )
        })
    }

    const renderComponent = (father: AstNodeType):any => {
        if (father.children) {
            return father.children.map(cmp => {
                let child = null;
                if (astTool.hasChildren(cmp)) {
                    child = renderComponent(cmp);
                }
                const rss = astTool.getRelatedStates(cmp) && astTool.getRelatedStates(cmp)[0];
                if (rss) {
                    console.log(mapStoreStateToMaterial(rss.id));
                }
                return React.createElement(
                    _.get(Materials, cmp.type),
                    {
                        key: cmp.id,
                        children: child,
                        value: rss && mapStoreStateToMaterial(rss.id)
                    }
                )
            });
        }
        return null;
    }

    return (
        <Provider store={store}>
            <div className={BEM('render', 'wrapper')}>
                <ErrorBoundary>
                    <div>
                        {renderPage()}
                    </div>
                </ErrorBoundary>
            </div>
        </Provider>
    )
}

export default Render;