import React from 'react';
import 'reflect-metadata';
import { BaseMaterial } from '../base';
import { Icon, Desc, IsLayout, Material, NodeDC, Config } from '../../decorators';

@Icon('edit')
@Desc('这个是label物料')
@IsLayout(false)
@Material()
@NodeDC(1)
export default class LabelMaterial extends BaseMaterial {
  constructor(props: any) {
    super(props);
  }

  @Config()
  private value = '';

  @Config()
  private onChange = () => {};

  render() {
    return <span>label</span>;
  }
}
