import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import ErrorBoundary from '../components/errorBoundary/errorBoundary';
import "reflect-metadata";
import { BEM } from '../common/utils/bem';
import Util from './helper';
import Materials from '../materials/index';
import 'antd/dist/antd.css'
import { useGlobalContext } from '../context/global';
// import store from './store/renderStore';
import AstParser, { AstNodeType, ConfigType } from '../common/utils/ast';

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

            console.log(astTool);
        }
    }, [astTool, ast]);

    useEffect(() => {
        RenderByAstTree();
        return () => {
            
        };
    }, [])

    const mapStoreStateToMaterial = (stateId: string) => {
        
    }

    const mapStoreMethodToMaterial = (methodId: string) => {

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
                return React.createElement(
                    _.get(Materials, cmp.type),
                    {
                        key: cmp.id,
                        children: child
                    }
                )
            });
        }
        return null;
    }

    return (
        <div className={BEM('render', 'wrapper')}>
            <ErrorBoundary>
                <div>
                    {renderPage()}
                </div>
            </ErrorBoundary>
        </div>
    )
}

export default Render;