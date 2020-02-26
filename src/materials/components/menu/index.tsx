import React from 'react';
import 'reflect-metadata';
import { Menu } from 'antd';
import { BaseMaterial } from '../base';
import { Icon, Desc, IsLayout, Material, NodeDC, Config } from '../../decorators';

@Icon('edit')
@Desc('这个是menu物料')
@IsLayout(false)
@Material()
@NodeDC(1)
export default class MenuMaterial extends BaseMaterial {
  constructor(props: any) {
    super(props);
  }

  @Config()
  private value = '';

  @Config()
  private onChange = () => {};

  render() {
    return <Menu />;
  }
}
