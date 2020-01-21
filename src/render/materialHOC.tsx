import React, { Component } from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import _ from 'lodash';
import store from './store/renderStore';
import Materials from '../materials/index';
import { ConfigType, StateConfigValue, StaticConfigValue, MethodConfigValue } from '../common/utils/ast';
import { setStateById } from './store/renderAction';

type stateType = ReturnType<typeof store.getState>
const mapStoreStateToMaterial = (state: stateType, stateId: string) => {
    if (!state.stateReducer.states) {
        return {}
    }
    const filterdState = state.stateReducer.states.find(state => state.id === stateId);
    return filterdState;
}

const mapStoreMethodToMaterial = (state: stateType, methodId: string) => {
    const noop = () => {};
    if (!state.methodReducer.methods) {
        return noop;
    }
    const filterdMethod = state.methodReducer.methods.find(method => method.id === methodId);
    const compiledMethod = eval(filterdMethod?.method) || noop;
    return compiledMethod;
}

const mapConfigToMaterial = (state: stateType, config: ConfigType) => {
    let obj = {} as any;
    Object.keys(config).map(key => {
        switch(config[key].type) {
            case 'static':
                obj[key] = (config[key] as StaticConfigValue).value;
                break;
            case 'state':
                obj[key] = mapStoreStateToMaterial(state, (config[key] as StateConfigValue).stateId);
                break;
            case 'method':
                obj[key] = mapStoreMethodToMaterial(state, (config[key] as MethodConfigValue).methodId);
                break;
        }
    })
    return obj;
}

class MaterialHOC extends Component<
    { 
        config: ConfigType,
        materialType: string,
        children?: any
    }
> {
    constructor (props: any) {
        super(props);
    }

    render() {
        return React.createElement(
            _.get(Materials, this.props.materialType),
            {
                ...this.props
            }
        )
    }
}

const mapStateToProps = (
    state: stateType,
    ownProps: { config: ConfigType }
) => {
    return mapConfigToMaterial(state, ownProps.config);
}

const mapDispatchToProps = (
    dispatch: typeof store.dispatch,
    ownProps: { config: ConfigType }
) => {
    return {
        changeState: (id:string, value:any) => {
            dispatch(
                setStateById({
                    id,
                    value
                })
            )
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MaterialHOC);