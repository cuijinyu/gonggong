/** @format */
import _ from 'lodash';
import store from './store/renderStore';
import { isProd } from '../common/utils/prod';
import AjaxClient from '../core/request';

const wrapMethod = (method: string) => {
  return `
        (() => function temp(
            state,
            method,
            setState,
            ajax
        ) {
            (${method})()
        })()
    `;
};

const Ajax = {
  client: AjaxClient,
  isProd: isProd(),
};

export const injectMethod = (method: string, changeState: (id: string, value: any) => any) => {
  const _method = wrapMethod(method);
  const compiledMethod = compileMethod(_method);

  const { getState, dispatch } = store;

  return compiledMethod.bind(null, getState, () => {}, changeState, Ajax);
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

export const compileMethod = (method: string) => {
  return eval(method);
};
