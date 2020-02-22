import React, { Component } from 'react';
import { getMetaInfo } from '../index';
import { GlobalContext } from '../../context/global';
import AstParser from '../../core/ast';

export class BaseMaterial<P = {}, S = {}> extends Component<P, S> {
  static contextType = GlobalContext;
  getRouterConfig() {
    const astTool: AstParser = this.context.astTool;
    return astTool.getPageList();
  }

  getMaterialConfig() {
    return Reflect.getMetadata('config', this.constructor);
  }

  mapConfigToTarget() {
    return getMetaInfo(this.constructor);
  }
}
