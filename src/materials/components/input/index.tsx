import React from 'react';
import 'reflect-metadata';
import { Input } from 'antd';
import { BaseMaterial } from '../base';
import { Icon, Desc, IsLayout, Material, NodeDC, Config } from '../../decorators';

@Icon('edit')
@Desc('这个是input物料')
@IsLayout(false)
@Material()
@NodeDC(1)
export default class InputMaterial extends BaseMaterial<{
  value: string;
  onClick: any;
  onChange?: any;
}> {
  constructor(props: any) {
    super(props);
  }

  @Config()
  private value = '';

  @Config()
  private onChange = () => {};

  static async beforeInstantiate() {
    return {
      a: 1,
      b: 2,
    };
  }

  static async afterInstantiate() {
    console.log('123');
    return;
  }

  instantiate(createProps?: any) {
    console.log(createProps);
    return <Input value={this.props.value} onClick={this.props.onClick} onChange={this.props.onChange as any} />;
  }
}
