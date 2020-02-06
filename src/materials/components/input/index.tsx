import React from 'react';
import 'reflect-metadata';
import { Input } from 'antd';
import { BaseMaterial } from '../base';
import { Icon, Desc, IsLayout, Material, NodeDC } from '../../decorators';

@Icon('input')
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
    console.log(this.props);
  }

  onChange(value: Event) {
    console.log(this);
    console.log(value);
    // if (!this.props.onChange) {
    //     if (value.target) {
    //         console.log((value.target as any).value);
    //     }
    //     return;
    // }
    // this.props.onChange()
  }

  render() {
    return <Input value={this.props.value} onClick={this.props.onClick} onChange={this.props.onChange as any} />;
  }
}
