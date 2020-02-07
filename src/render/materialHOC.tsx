import React, { Component } from 'react';
import { connect, MapDispatchToProps, Provider } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import store from './store/renderStore';
import Materials from '../materials/index';
import AstParser, { ConfigType, StateConfigValue, StaticConfigValue, MethodConfigValue } from '../common/utils/ast';
import { setStateById } from './store/renderAction';
import { isProd } from '../common/utils/prod';
import './mhoc.scss';
import { BEM } from '../common/utils/bem';
import { injectMethod } from './helper';
import { GlobalContext } from '../context/global';
import { render } from '@testing-library/react';

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
  // const compiledMethod = injectMethod(filterdMethod?.method) || noop;
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

class MaterialHOC extends Component<
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
    if (this.props.method) {
      let stateId: string;
      Object.keys(this.props.config).map(cf => {
        if (this.props.config[cf].type === 'state') {
          stateId = (this.props.config[cf] as StateConfigValue).stateId;
        }
      });
      Object.keys(this.props.method).forEach(k => {
        this.state.renderProps[k] = injectMethod(
          this.props.method ? this.props.method[k].method : '',
          stateId,
          this.props.changeState,
        );
      });
    }
  }

  static getDerivedStateFromProps(nextProps: MHOCPropsType, prevState: MHOCPropsType) {
    const renderProps: any = {};
    let stateId: string;
    Object.keys(nextProps.config).forEach(cf => {
      if (nextProps.config[cf].type === 'state') {
        stateId = (nextProps.config[cf] as StateConfigValue).stateId;
      }
    });
    if (nextProps.method) {
      Object.keys(nextProps.method).forEach(k => {
        renderProps[k] = injectMethod(
          nextProps.method ? nextProps.method[k].method : '',
          stateId,
          nextProps.changeState,
        );
      });
    }
    return {
      renderProps: {
        ..._.cloneDeep(nextProps),
        ..._.cloneDeep(renderProps),
      },
    };
  }

  componentDidMount() {}

  isLayout() {
    const layoutArray = new Set();
    layoutArray.add('Row');
    layoutArray.add('Col');
    return layoutArray.has(this.props.materialType);
  }

  getRelatedState() {}

  getRelatedMethod() {}

  render() {
    console.log(this.state);
    console.log(this.state.renderProps);
    return (
      <div className={this.state.isProd ? '' : BEM('render', 'hoc')}>
        {React.createElement(_.get(Materials, this.props.materialType), {
          ...this.state.renderProps,
        })}
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MaterialHOC);
