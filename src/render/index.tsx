import React from 'react';
import _ from 'lodash';
import ErrorBoundary from '../components/errorBoundary/errorBoundary';
import { BEM } from '../common/utils/bem';
import { Card, Input } from 'antd';
import 'antd/dist/antd.css'
import AstParser from '../common/utils/ast';

const Material = {
    Card,
    Input
}

const astParser = new AstParser('{}', (ast: string) => {});

astParser.createNewPage({
    name: 'test',
    isIndex: false,
    path: '/index'
})

astParser.createNewPage({
    name: 'test2',
    isIndex: true,
    path: '/bbq'
})

let pages = astParser.getPageList();
if (pages)
    astParser.changePage(pages[0].id);
const node = {
    name: 'node1',
    isLayoutNode: true,
    layoutCapacity: 12,
    nodeDemandCapacity: 1,
    type: 'card',
    id: '123123',
    states: [],
    config: {},
    methods: []
}

const node2 = {
    name: 'node2',
    isLayoutNode: true,
    layoutCapacity: 12,
    nodeDemandCapacity: 1,
    type: 'card',
    id: '123123',
    states: [],
    config: {},
    methods: []
}

const node3 = _.cloneDeep(node2);
const node4 = _.cloneDeep(node2);

node3.name = 'node3';
node4.name = 'node4';

astParser.appendNodeToPage(
    astParser.makeFunctionNode({
        name: 'test',
        type: 'card',
        nodeDemandCapacity: 2
    })
);
// astParser.appendMethod('function() {}', 'test', node);
astParser.displayAstTree();

const page = astParser.getSelectPageComponents()[0];

astParser.appendNodeAfter(
    page, 
    astParser.makeLayoutNode({
        name: 'layout1',
        layoutCapacity: 12,
        nodeDemandCapacity: 1,
        type: 'row'
    })
);
astParser.appendNodeAfter(page, node3);
astParser.appendNodeBefore(page, node4);
console.log(astParser.tree);

astParser.deleteNode(page);

console.log(astParser.tree);

// astParser.appendNode(node, {
//     name: '',
//     isLayoutNode: false,
//     layoutCapacity: 0,
//     nodeDemandCapacity: 1,
//     type: 'card',
//     states: [],
//     config: {},
//     methods: []
// })


const Render = function () {
    // const { ast, setAst } = useGlobalContext();
    const test1 = React.createElement(_.get(Material, 'Input'), {
        placeholder: '123',
        onChange: (e) => {
            console.log(e);
        }
    });
    return (
        <div className={BEM('render', 'wrapper')}>
            <ErrorBoundary>
                {test1}
            </ErrorBoundary>
        </div>
    )
}

export default Render;