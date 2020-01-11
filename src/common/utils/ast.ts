/**
 * @author fishcui
 * @summary 这个文件是整个系统的 “抽象语法树” 的处理部分
 *          共分为三大类  AstParser AstNode ConfigItem
 *          其中 1.AstParser 类负责绝大多数的 Ast 解析和操作，也包括历史记录的保存
 *              2.AstNode 类负责接收物料库的参数，用以简单的生成 AstParser 中需要的节点类型
 *              3.ConfigItem 类负责简易的生成符合 Config 规范要求的 config
 *          
 *          这个 “抽象语法树” 在整个系统中的作用:
 *              1.记录布局信息
 *              2.记录历史操作记录
 *              3.后端存储
 *              4.记录数据以及事件信息
 * 
 *          渲染引擎和此处的关系
 *              1.渲染引擎根据此处的信息进行组件树的构建
 *              2.渲染引擎根据此处的状态和方法信息，注入全局状态和方法
 * @date 2020.1.11
 */
import _ from 'lodash';
import Utils from './utils';
const { GGErrorLogger, uuid } = Utils;

/**
 * 每个component的类型
 */
type AstNodeType = {

    /**
     * node 的名称 
     **/ 
    name: string,

    /** 
     * 是否为布局 node
     **/ 
    isLayoutNode: boolean,

    /**
     * node 的容纳能力
     **/ 
    layoutCapacity: number,

    /**
     * 放置 node 需求的能力
     **/ 
    nodeDemandCapacity: number,

    /**
     * node 的类型
     **/ 
    type: string,

    /**
     * node 的id
     **/ 
    id: string,

    /**
     * node 相关的 states 的 id 数组
     **/ 
    states: string[],

    /**
     * node 相关的配置
     **/ 
    config: ConfigType,

    /**
     * node 的父节点 可选项
     **/ 
    parentNode?: AstNodeType,

    /**
     * node 的子节点 可选项
     **/ 
    children?: AstNodeType[],

    /**
     * node 的下一个兄弟节点 可选项
     **/ 
    nextNode?: string,

    /**
     * node 的上一个兄弟节点 可选项
     **/ 
    prevNode?: string,

    /**
     * node 关联的方法 ids
     **/ 
    methods: string[],

    /**
     * 是否为一级节点
     */
    isFirstLevelNode: boolean,

    /**
     * 对父页面的引用 这里应该是id
     */
    parentPage?: string
}

type StateType = {
    id: string,
    relatedNodeId: string[],
    name: string,
    initValue: any
}

type MethodType = {
    id: string,
    name: string,
    relatedNodeId: string[],
    methodCode: string
}

type StaticConfigValue = {
    type: 'static',
    value: any
}

type StateConfigValue = {
    type: 'state',
    stateId: string
}

type MethodConfigValue = {
    type: 'method',
    methodId: string
}

type ConfigType = {
    [configKey: string]: StateConfigValue | StaticConfigValue | MethodConfigValue
}

type HistoryType = {
    id: string,

    // 保留的 JSON 化的 AST 信息
    ast: string,

    // 每次操作的记录
    msg: any,

    // 每次操作的时间
    time: Date
}

type PageType = {
    id: string,

    // 页面描述名称
    name: string,

    // 是否为首页
    isIndex: boolean,

    // 页面路由
    path: string,

    // 页面组件列表
    components?: AstNodeType[]
}

/**
 * 根节点类型
 */
type AstType = {

    /**
     * 所有的页面
     */
    pages?: PageType[],

    /**
     * 所有的方法
     */
    methods?: MethodType[],

    /**
     * 所有的属性
     */
    states?: StateType[]
}

/**
 *  TODO: 1.编写 AstNode 类和 ConfigItem 类的实现
 *        2.AstNode 类和物料库进行关联，物料库类的配置传入 AstNode 类生成符合 AstNodeType 规范要求的数据结构
 *        3.ConfigItem 类是用来进行生成符合 config 配置项的要求规范的数据结构的类
 *        4.工厂方法位于 AstParser 类中
 **/ 
class AstNode {

}

class ConfigItem {

}

class StaticConfigItem extends ConfigItem {

}

class StateConfigItem extends ConfigItem {

}

class MethodConfigItem extends ConfigItem {

}

/**
 * AstParser 类
 * 解析与操作 共工 系统的 AST 的类
 * TODO: 1.完成工厂函数
 * FIXME: 1.修复逻辑有误的地方
 */
class AstParser {

    /**
     * 构造函数
     * @param initAst 初始化的 Ast 字符串
     * @param astSetter 外界的 ast 修改触发函数
     */
    constructor(initAst: string, astSetter: (ast: string) => void) {
        this.ast = initAst;
        this.astSetter = astSetter;
        this.safeParser();
    }

    /**
     * 劫持 getter 方便的获取 ast 结构
     */
    get tree(): AstType {
        if (this.astTree) {
            return this.astTree;
        }
        return {};
    }

    private ast: string = '';

    // 历史记录
    private history: HistoryType[] = [];
    private astSetter: (ast: string) => void = (ast: string) => { };
    private astTree: AstType = {};

    // 当前选中的页面
    private selectPage: string | null = null;

    /**
     * 安全的ast解析
     */
    private safeParser() {
        try {
            const parsedAst = JSON.parse(this.ast);
            this.astTree = parsedAst;
        } catch (e) {
            GGErrorLogger('解析错误');
            console.error(e);
        }
    }

    /**
     * 保存至历史记录
     * @param msg 当前操作备注信息
     */
    private save(msg: any) {
        this.history.push({
            id: uuid(),
            ast: this.ast,
            msg,
            time: new Date()
        });
        const formattedAst = JSON.stringify(this.astTree);
        this.ast = formattedAst;
        this.astSetter(formattedAst);
    }

    /**
     * 检测是否为有效的AST node节点
     * @param node 
     */
    private isUsefulNodeType (node: Object): boolean {
        if (
            _.has(node, 'type') &&
            _.has(node, 'isLayoutNode')
        ) {
            return true;
        }
        return false;
    }

     /**
      * 深搜的内层依赖方法
      * @param cmp 
      * @param resultArray 
      */
    private walkInComponent (cmp: AstNodeType, resultArray: AstNodeType[]) {
        if (
            cmp.isLayoutNode &&
            cmp.children &&
            cmp.children.length > 0
        ) {
            resultArray = [
                ...resultArray,
                ...cmp.children
            ];
            cmp.children.forEach(component => {
                this.walkInComponent(component, resultArray);
            });
            return;
        }
        return;
    }

    /**
     * 深搜的外层依赖方法
     * @param page 
     * @param resultArray 
     */
    private walkIn (page: PageType, resultArray: AstNodeType[]) {
        if (page.components) {
            resultArray = [
                ...resultArray,
                ...page.components
            ];
            page.components.forEach(cmp => {
                this.walkInComponent(cmp, resultArray);
            })
            return;  
        }
        return;
    }

    public resetAst(ast: string) {
        this.history.push({
            id: uuid(),
            ast: this.ast,
            msg: '重置到指定的Schema',
            time: new Date()
        });
        this.ast = ast;
        this.safeParser();
    }

    public getMethodById(id: string) {
        if (this.astTree.methods) {
            const filterMethod = this.astTree.methods.filter(method => {
                return method.id === id;
            });
            if (filterMethod.length > 0) {
                return filterMethod[0];
            }
        }
        return null;
    }

    public getRelatedMethods(node: AstNodeType) {
        if (this.isUsefulNodeType(node)) {
            return node.methods.map(id => this.getMethodById(id));
        }
        return null;
    }

    public appendMethod(method: string, name: string, node: AstNodeType) {
        if (!this.isUsefulNodeType(node)) {
            GGErrorLogger('不是有效的节点');
            console.trace();
            return;
        }
        if (!this.astTree.methods) {
            this.astTree.methods = [];
        }
        const uid = uuid();
        const nodeId = node.id;
        const methodOption = {
            id: uid,
            name,
            relatedNodeId: [nodeId],
            methodCode: method
        };
        this.astTree.methods.push(methodOption);
        node.methods.push(uid);
        this.save('新增方法');
    }

    /**
     * 根据方法的ID删除方法
     * @param id 要删除的方法的 ID
     */
    public deleteMethodById(id: string) {
        if (!this.astTree.methods) {
            this.astTree.methods = [];
            return false;
        }
        const method = this.getMethodById(id);
        if (method) {
            const idx = this.astTree.methods.indexOf(method);
            this.astTree.methods.splice(idx, 1);        
            this.save(`删除方法，方法ID为${id}`);
            return true;
        }
        return false;
    }

    public getMethodsList(): MethodType[] {
        const methods = _.get(this.astTree, 'methods', []);
        return methods;
    }

    public getStateById(id: string) {
        if (!this.astTree.states) {
            this.astTree.states = [];
        }
        const filterState = this.astTree.states.filter(state => {
            return state.id === id;
        })
        if (filterState.length > 0) {
            return filterState[0];
        }
        return null;
    }

    public getRelatedStates(node: AstNodeType) {
        if (node.states) {
            return node.states.map(state => {
                return this.getStateById(state);
            })
        }
        return [];
    }

    public getStateList() {
        if (!this.astTree.states) {
            this.astTree.states = [];
        }
        return this.astTree.states;
    }

    public appendState(stateConfig: StateType) {
        if (!this.astTree.states) {
            this.astTree.states = [];
        }
        this.astTree.states.push(stateConfig);
        this.save(`新增state`);
    }

    public deleteStateById(id: string) {
        this.save(`删除state，state的id为${id}`);
    }

    public hasParent(node: AstNodeType) {
        return _.has(node, 'parentNode');
    }

    public getParent(node: AstNodeType) {
        return _.get(node, 'parentNode');
    }

    public hasChildren(node: AstNodeType) {
        return _.has(node, 'children');
    }

    public getChildren(node: AstNodeType) {
        return _.get(node, 'children');
    }

    public hasPrevNode(node: AstNodeType) {
        return _.has(node, 'prevNode');
    }

    public getPrevNode(node: AstNodeType) {
        const nodeId = _.get(node, 'prevNode');
        if (nodeId) {
            return this.getNodeById(nodeId);
        }
        return null;
    }

    public hasNextNode(node: AstNodeType) {
        return _.has(node, 'nextNode');
    }

    public getNextNode(node: AstNodeType) {
        const nodeId = _.get(node, 'nextNode');
        if (nodeId) {
            return this.getNodeById(nodeId);
        }
        return null;
    }

    public isFirstLevelNode(node: AstNodeType) {
        return _.get(node, 'isFirstLevelNode');
    }

    public getParentPageId(node: AstNodeType) {
        return _.get(node, 'parentPage');
    }

    public getParentPage(node: AstNodeType) {
        const parentPageId = _.get(node, 'parentPage');
        if (parentPageId) {
            return this.getPageById(parentPageId);
        }
        return null;
    }

    public getPageComponents(node: PageType) {
        return _.get(node, 'components', []);
    }

    public getSelectPageComponents() {
        if (
            !this.selectPage ||
            !this.astTree.pages ||
            this.astTree.pages.length === 0
        ) {
            return [];
        }
        const page = this.getPageById(this.selectPage);
        if (!page) {
            return [];
        }
        return this.getPageComponents(page);
    }

    public getComponentNodeList(node: AstNodeType) {
        let resultArray: AstNodeType[] = [];
        if (this.isUsefulNodeType(node)) {
            resultArray.push(node);
            if (this.isNodePluggable(node)) {
                this.walkInComponent(node, resultArray);
            }
            return resultArray;
        }
        return [];
    }

    public getPageNodeList(page: PageType) {
        let resultArray: AstNodeType[] = [];
        if (
            page &&
            page.components
        ) {
            this.walkIn(page, resultArray);
            return resultArray;
        }
        return [];
    }

    /**
     * 获取所有的 node 列表
     */
    public getNodeList() {
        let resultArray: AstNodeType[] = [];
        if (!this.astTree.pages) {
            return null;
        }

        this.astTree.pages.forEach(page => {
            this.walkIn(page, resultArray);
        })

        return resultArray;
    }

    public getNodeById(id: string) {
        const resultArray = this.getNodeList();
        
        if (!resultArray) {
            return null;
        }

        const filterNode = resultArray.filter(cmp => {
            return cmp.id === id
        });

        if (filterNode.length > 0) {
            return filterNode[0];
        }

        return null;
    }

    public getNodeConfig(node: AstNodeType) {
        return node.config;
    }

    public getNodeConfigById(nodeId: string) {
        const node = this.getNodeById(nodeId);
        if (node) {
            return this.getNodeConfig(node);
        }
        return null;
    }

    public deleteNode(node: AstNodeType) {
        if (this.isFirstLevelNode(node)) {
            // 如果是顶层节点,那么从它的 ParentPage 中删除它
            const parentPage = this.getParentPage(node);
            if (
                parentPage &&
                parentPage.components
            ) {
                // 获取 node 在其 parentPage 中的 index
                const idx = parentPage.components.indexOf(node);
                if (idx !== -1) {
                    // 如果 idx 存在
                    parentPage.components.splice(idx, 1);
                    return true;
                }
                GGErrorLogger('请检查你的 parentPage 中是否有当前节点');
                return false;
            }
            GGErrorLogger('当前节点的 parentPage 不存在');
            return false;
        } else {
            // 如果不是顶层节点，那么需要归还其顶层节点的存储能力

        }
    }

    public deleteNodeById(id: string) {
        const node = this.getNodeById(id);
        if (node) {
            return this.deleteNode(node);
        }
        return false;
    }

    /**
     * 判断节点是否可插入
     * @param node 
     */
    public isNodePluggable(node: AstNodeType): boolean {
        if (!node.isLayoutNode) {
            return false;
        }
        return true;
    }

    public appendNode(target: AstNodeType, node: Omit<AstNodeType, 'id' | 'isFirstLevelNode'>) {
        if (
            !this.isUsefulNodeType(target) ||
            !this.isUsefulNodeType(node)
        ) {
            return false;
        }
        // 如果还没有children字段，新增children字段
        if (!target.children) {
            target.children = [];
        }
        if (
            this.isNodePluggable(target) &&
            target.layoutCapacity >= node.nodeDemandCapacity
        ) {
           (node as AstNodeType).id = uuid();
           (node as AstNodeType).isFirstLevelNode = false;
            if (target.children.length > 0) {
                const lastChild = target.children[target.children.length - 1];
                node.prevNode = lastChild.id;
                lastChild.nextNode = (node as AstNodeType).id;
            }
            node.parentNode = target;
            target.children.push(node as AstNodeType);
            target.layoutCapacity = target.layoutCapacity - node.nodeDemandCapacity;
            return true;
        }
        this.save('新增节点');
        return false;
    }

    /**
     * 为页面添加节点
     * @param node 节点
     */
    public appendNodeToPage(node: Omit<AstNodeType, 'id' | 'isFirstLevelNode'>) {
        if (!this.astTree.pages)
            return false;
        if (!this.selectPage) 
            return false;
        const page = this.getPageById(this.selectPage);
        if (page) {
            if(!page.components) {
                page.components = [];
            }
            (node as AstNodeType).id = uuid();
            (node as AstNodeType).isFirstLevelNode = true;
            (node as AstNodeType).parentPage = page.id;
            page.components.push(node as AstNodeType);
        }
        this.save('为页面新增节点');
        return true;
    }

    /**
     * 在某一目标节点后添加节点
     * @param target 目标节点
     * @param node 节点
     */
    public appendNodeAfter(target: AstNodeType, node: Omit<AstNodeType, 'id' | 'isFirstLevelNode'>) {
        (node as AstNodeType).id = uuid();
        if (target.isFirstLevelNode) {
            const parentPage = this.getParentPageId(target);
            if (parentPage) {
                const parentPageNode = this.getPageById(parentPage);
                if (
                    !parentPageNode ||
                    !parentPageNode.components
                ) {
                    return;
                }
                const idx = parentPageNode.components.indexOf(target);
                if (idx === -1) {
                    return false;
                }
                if (target.nextNode) {
                    node.nextNode = target.nextNode;
                }
                node.prevNode = target.id;
                node.parentPage = parentPage;
                (node as AstNodeType).isFirstLevelNode = true;
                (target as AstNodeType).nextNode = (node as AstNodeType).id;
                parentPageNode.components.splice(idx + 1, 0, node as AstNodeType);
            }
        } else {
            const parentNode = this.getParent(target);
            if (parentNode) {
                const idx = (parentNode as Required<AstNodeType>).children.indexOf(target);
                if (idx === -1) {
                    return false;
                }
                if (target.nextNode) {
                    node.nextNode = target.nextNode;
                }
                node.prevNode = target.id;
                node.parentNode = parentNode;
                (node as AstNodeType).isFirstLevelNode = false;
                (target as AstNodeType).nextNode = (node as AstNodeType).id;
                (parentNode as Required<AstNodeType>).children.splice(idx + 1, 0, node as AstNodeType);
            }
        }
        this.save('在节点后新增了节点');
    }

    /**
     * 在某一目标节点前添加节点
     * @param target 目标节点
     * @param node 节点
     */
    public appendNodeBefore(target: AstNodeType, node: Omit<AstNodeType, 'id' | 'isFirstLevelNode'>) {
        (node as AstNodeType).id = uuid();
        if (target.isFirstLevelNode) {
            const parentPage = this.getParentPageId(target);
            if (parentPage) {
                const parentPageNode = this.getPageById(parentPage);
                if (
                    !parentPageNode ||
                    !parentPageNode.components
                ) {
                    return;
                }
                const idx = parentPageNode.components.indexOf(target);
                if (idx === -1) {
                    return false;
                }
                if (target.prevNode) {
                    node.prevNode = target.prevNode;
                }
                node.nextNode = target.id;
                node.parentPage = parentPage;
                (node as AstNodeType).isFirstLevelNode = true;
                (target as AstNodeType).prevNode = (node as AstNodeType).id;
                parentPageNode.components.splice(idx, 0, (node as AstNodeType));
            }
        } else {
            const parentNode = this.getParent(target);
            if (parentNode) {
                const idx = (parentNode as Required<AstNodeType>).children.indexOf(target);
                if (idx === -1) {
                    return false;
                }
                if (target.prevNode) {
                    node.prevNode = target.prevNode;
                }
                node.nextNode = target.id;
                node.parentNode = parentNode;
                (node as AstNodeType).isFirstLevelNode = false;
                (target as AstNodeType).prevNode = (node as AstNodeType).id;
                (parentNode as Required<AstNodeType>).children.splice(idx, 0, node as AstNodeType);
            }
        }
        this.save('在节点前新增了节点');
    }

    public setNodeConfig(node: AstNodeType, config: ConfigType) {
        node.config = config;
        this.save('保存了节点配置');
        return true;
    }

    public setNodeDemandCapacity(node: AstNodeType, dc: number) {
        node.nodeDemandCapacity = dc;
        this.save('保存了节点的需求');
        return true;
    }

    /**
     * 罗列所有的 page
     */
    public getPageList() {
        return this.astTree.pages;
    }

    /**
     * 新增页面
     * @param param0 
     */
    public createNewPage({
        name = '',
        isIndex = false,
        path = ''
    }) {
        if (!this.astTree.pages) {
            this.astTree.pages = [];
        }
        this.astTree.pages.push({
            id: uuid(),
            name,
            isIndex,
            path
        });
        this.save('新增了页面');
        return true;
    }

    /**
     * 根据ID删除某个页面
     * @param id 
     */
    public deletePageById(id: string) {
        let idx: number | null = null;
        if (!this.astTree.pages) {
            GGErrorLogger('不存在Page');
            return false;
        }
        this.astTree.pages.forEach((page, index) => {
            if (page.id === id) {
                idx = index;
            }
        })
        if (_.isFinite(idx)) {
            this.astTree.pages.splice(idx as unknown as number, 1);
        }
        this.save('根据ID删除了页面');
        return true;
    }

    /**
     * 根据ID获取某个页面
     * @param id 
     */
    public getPageById(id: string) {
        if (this.astTree.pages) {
            const filterResult = this.astTree.pages.filter((page) => {
                return page.id === id;
            })
            if (filterResult.length > 0) {
                return filterResult[0];
            }
        }
        return null;
    }

    /**
     * 设置所有页面中的首页
     * @param id 
     */
    public setIndexPageById(id: string) {
        const page = this.getPageById(id);
        if (page) {
            page.isIndex = true;
            this.save('设置页面为首页')
            return true;
        }
        return false;
    }

    // 切换页面
    public changePage(id: string) {
        this.selectPage = id;
        return true;
    }

    /**
     * 获取历史操作记录
     */
    public getHistorys(): HistoryType[] {
        return this.history;
    }

    /**
     * 根据 ID 获取某次历史记录的消息
     * @param id 历史记录ID
     */
    public getHistoryById(id: string) {
        if (this.history) {
            const filterHistory = this.history.filter(his => {
                return his.id === id;
            });
            if (filterHistory.length > 0) {
                return filterHistory[0];
            }
        }
        return null;
    }

    /**
     * 返回至某一历史记录
     * @param id 历史记录ID
     */
    public goBackToByHistoryId(id: string) {
        const history = this.getHistoryById(id);
        if (history) {
            this.resetAst(history.ast);
            this.astSetter(history.ast);
            return true;
        }
        return false;
    }

    /**
     * 打印 AST 树
     */
    public displayAstTree() {
        console.group('AST');
        console.log(this.astTree);
        console.groupEnd();
    }

    public makeLayoutNode() {
        // 布局节点的工厂函数
    }

    public makeFunctionNode() {
        // 功能节点的工厂函数
    }

    public makeConfig() {
        // 节点 config 的工厂函数
    }

    public makeValueConfig() {
        // config 配置静态 value 的工厂函数
    }

    public makeStateConfig() {
        // config 配置 state 的工厂函数
    }

    public makeMethodConfig() {
        // config 配置 method 的工厂函数
    }

    public makePage() {
        // 页面的工厂函数
    }
}

export default AstParser;