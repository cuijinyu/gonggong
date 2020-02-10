import React, { Component } from 'react';
import { getMetaInfo } from '../index';

export class BaseMaterial<P = {}, S = {}> extends Component<P, S> {
  // getStateById() {}

  // getMethodById() {}

  // getRouterInfo() {}

  // getAuthInfo() {}

  getMaterialConfig() {
    return Reflect.getMetadata('config', this.constructor);
  }

  mapConfigToTarget() {
    return getMetaInfo(this.constructor);
  }
}
