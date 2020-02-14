import React from 'react';
import { BaseMaterial } from '../base';
import { Col } from 'antd';
import { Material, Icon, Desc, IsLayout, NodeDC } from '../../decorators';

@Icon('dash')
@Desc(`这个是col布局物料`)
@IsLayout(true, 100)
@NodeDC(1)
@Material()
class ColMaterial extends BaseMaterial {
  constructor(props: any) {
    super(props);
  }

  render() {
    return <Col>{this.props.children}</Col>;
  }
}

export default ColMaterial;
