/** @format */

import _ from 'lodash';
import store from './store/renderStore';
import { isProd } from '../common/utils/prod';
import AjaxClient from '../core/request';

interface injectMethodType {
  getState: (id: string) => any;
  setState: (id: string, value: any) => any;
  ajax: any;
}

const wrapMethod = (method: string, { getState, setState, ajax }: injectMethodType) => {
  const getStateName = getState.name;
  const setStateName = setState.name;
  const ajaxName = ajax.name;
  return `
        (() => {
          return function temp(...args) {
              const getState = ${getStateName}
              const setState = ${setStateName}
              const ajax = ${ajaxName}
              (${method})(...args)
          }
        })()
    `;
};

const Ajax = {
  client: AjaxClient,
  isProd: isProd(),
};

export const injectMethod = (method: string, changeState: (id: string, value: any) => any) => {
  const { getState, dispatch } = store;
  const setState = changeState;
  const state = null;
  const ajax = Ajax;
  const compiledMethod = compileMethod(method, {
    getState: (id: string) => getState().stateReducer.states.find(state => state.id === id),
    setState,
    ajax,
  });

  // return compiledMethod.bind(null, getState, () => {}, changeState, Ajax);
  return compiledMethod.bind(null);
};

export const chainMethod = (method: string, chainMethodArray: string[]) => {
  const wrapMethodChain = (method: string, method1: string, method2: string) => {
    return `
            (
                ${method}()
            )()
        `;
  };
};

export const pageJump = () => {};

export const injectStyleClass = (styleClass: string) => {
  const body = document.getElementsByTagName('body')[0];
  const style = document.createElement('style');
  style.innerHTML = styleClass;
  body.appendChild(style);
};

export const compileMethod = (method: string, { getState, setState, ajax }: injectMethodType) => {
  const _method = wrapMethod(method, {
    getState,
    setState,
    ajax,
  });
  return eval(method);
};
