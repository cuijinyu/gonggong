/** @format */

import React from 'react';
import _ from 'lodash';
import Axios from 'axios';
import store from './store/renderStore';
//@ts-ignore
import eventBus from 'eventbus';
import { isProd } from '../common/utils/prod';
import { setStateById } from './store/renderAction';

type ListenEvent = {
  id: string;
  trigger: any;
};

const listenEventsArray: ListenEvent[] = [];

const createMaterial = <GP extends Record<string, any>>(name: string, group: GP, props: any) => {
  return React.createElement(_.get(group, name), props);
};

const ajaxAdapter = () => {};

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
  client: Axios,
  isProd: isProd(),
};

export const injectMethod = (method: string, id: string, changeState: (id: string, value: any) => any) => {
  const _method = wrapMethod(method);
  const compiledMethod = compileMethod(_method);

  const { getState, dispatch } = store;

  return compiledMethod.bind(null, getState, () => {}, changeState.bind(null, id), Ajax);
};

export const chainMethod = (method: string, chainMethodArray: string[]) => {
  const listen = (id: any) => {};

  const emit = (id: string) => {
    const filterdEvent = listenEventsArray.find(ev => ev.id === id);
    if (filterdEvent) filterdEvent.trigger();
  };

  const wrapMethodChain = (method: string, method1: string, method2: string) => {
    return `
            (
                ${method}()
            )()
        `;
  };
};

export const injectState = () => {};

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

export default {
  createMaterial,
  injectMethod,
};

console.log(eventBus);
