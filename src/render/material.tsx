import React, { Component } from 'react';
import { connect, MapDispatchToProps, Provider } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import store from './store/renderStore';
import Materials from '../materials/index';
import AstParser, { ConfigType, StateConfigValue, StaticConfigValue, MethodConfigValue } from '../core/ast';
import { setStateById } from './store/renderAction';
import { isProd } from '../common/utils/prod';
import './mhoc.scss';
import { BEM } from '../common/utils/bem';
import { injectMethod } from './helper';
import { GlobalContext } from '../context/global';
import { DragSource, DropTarget } from 'react-dnd';
import dndTypes from '../constant/drag';
import eventManager from '../eventManager';

type stateType = ReturnType<typeof store.getState>;
const mapStoreStateToMaterial = (state: stateType, stateId: string) => {
  if (!state.stateReducer.states) return {};

  const filterdState = state.stateReducer.states.find(state => state.id === stateId);
  return filterdState;
};

const mapStoreMethodToMaterial = (state: stateType, methodId: string) => {
  const noop = () => {};
  if (!state.methodReducer.methods) return noop;

  const filterdMethod = state.methodReducer.methods.find(method => method.id === methodId);
  return filterdMethod;
};

const mapConfigToMaterial = (state: stateType, config: ConfigType) => {
  const obj = {} as any;
  Object.keys(config).map(key => {
    switch (config[key].type) {
      case 'static':
        obj[key] = (config[key] as StaticConfigValue).value;
        break;
      case 'state':
        const storeState = mapStoreStateToMaterial(state, (config[key] as StateConfigValue).stateId);
        if (_.has(storeState, 'value')) {
          obj[key] = (storeState as typeof state.stateReducer.states[0]).value;
        } else {
          obj[key] = storeState;
        }
        break;
      case 'method':
        if (!obj.method) {
          obj.method = {};
        }
        obj.method[key] = mapStoreMethodToMaterial(state, (config[key] as MethodConfigValue).methodId);
        break;
    }
  });
  return obj;
};

interface MHOCPropsType {
  config: ConfigType;
  astTool: AstParser;
  materialType: string;
  children?: any;
  id: string;
  method?: {
    [key: string]: {
      method: string;
    };
  };
  changeState?: any;
}

const elementSource = {
  canDrag(props: any) {
    return true;
  },

  beginDrag(props: any, monitor: any, component: any) {
    return { ...props };
  },

  isDragging(props: any, monitor: any, component: any) {
    return monitor.getItem().id === props.id;
  },

  endDrag(props: any, monitor: any, component: any) {
    return true;
  },
};

const materialTarget = {
  canDrop(props: any, monitor: any, isHandled: any) {
    return true;
  },

  hover(props: any, monitor: any, component: any) {},

  drop(props: any, monitor: any, component: any) {
    if (monitor.didDrop()) {
      return;
    }
    const materialConfig = monitor.getItem();
    component.insertMaterial(materialConfig);
  },
};

const collect = (connect: any, monitor: any) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
};

const dropCollect = (connect: any, monitor: any) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
  };
};

class Material extends Component<
  MHOCPropsType,
  {
    isProd: boolean;
    isLayout: boolean;
    renderProps: {
      [key: string]: any;
    };
  }
> {
  static contextType = GlobalContext;

  constructor(props: any) {
    super(props);
    this.state = {
      isProd: isProd(),
      isLayout: this.isLayout(),
      renderProps: {
        ...this.props,
      },
    };
    this.materialContextMenu.bind(this);
  }

  static getDerivedStateFromProps(nextProps: MHOCPropsType, prevState: MHOCPropsType) {
    const renderProps: any = {};
    if (nextProps.method) {
      Object.keys(nextProps.method).forEach(k => {
        renderProps[k] = injectMethod(nextProps.method ? nextProps.method[k].method : '', nextProps.changeState);
      });
    }
    return {
      renderProps: {
        ...nextProps,
        ...renderProps,
      },
    };
  }

  insertMaterial(materialConfig: any) {
    const targetNodeId = this.props.id;
    const astTool: AstParser = this.context.astTool;
    const targetNode = astTool.getNodeById(targetNodeId);
    if (targetNode) {
      if (materialConfig.isLayoutNode) {
        astTool.appendNode(
          targetNode,
          astTool.makeLayoutNode({
            name: '',
            layoutCapacity: materialConfig.layoutCapacity,
            nodeDemandCapacity: materialConfig.nodeDemandCapacity,
            type: materialConfig.materialType,
          }),
        );
      } else {
        astTool.appendNode(
          targetNode,
          astTool.makeFunctionNode({
            name: '',
            nodeDemandCapacity: materialConfig.nodeDemandCapacity,
            type: materialConfig.materialType,
          }),
        );
      }
    }
  }

  isLayout() {
    const layoutArray = new Set();
    layoutArray.add('Row');
    layoutArray.add('Col');
    return layoutArray.has(this.props.materialType);
  }

  materialContextMenu(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (e.button !== 2) return;
    this.context.eBus.emit('render-content-contextMenu', {
      position: {
        x: e.pageX,
        y: e.pageY,
      },
      item: {
        ...this.props,
      },
    });
  }

  render() {
    const { connectDragSource, connectDropTarget } = this.props as any;
    const { isOver } = this.props as any;
    return connectDropTarget(
      connectDragSource(
        <div
          style={{
            border: isOver ? '1px solid green' : '',
          }}
          onMouseDown={e => this.materialContextMenu(e)}
          className={this.state.isProd ? '' : BEM('render', 'hoc')}>
          {React.createElement(_.get(Materials, this.props.materialType), {
            ...this.state.renderProps,
          })}
        </div>,
      ),
    );
  }
}

const mapStateToProps = (state: stateType, ownProps: { config: ConfigType }) => {
  return mapConfigToMaterial(state, ownProps.config);
};

const mapDispatchToProps = (dispatch: typeof store.dispatch, ownProps: { config: ConfigType }) => {
  return {
    changeState: (id: string, value: any) => {
      dispatch(
        setStateById({
          id,
          value,
        }),
      );
    },
  };
};

export default _.flow(
  DropTarget(dndTypes.MATERIAL, materialTarget as any, dropCollect),
  DragSource(dndTypes.ELEMENT, elementSource as any, collect),
  connect(mapStateToProps, mapDispatchToProps),
)(Material);
