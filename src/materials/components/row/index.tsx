import React from 'react';
import { BaseMaterial } from '../base';
import { Row } from 'antd';
import { Icon, Desc, IsLayout, Material, NodeDC, Config } from '../../decorators';

@Icon('align-left')
@Desc(`这个是row布局物料`)
@IsLayout(true, 24)
@NodeDC(1)
@Material()
class RowMaterial extends BaseMaterial {
  constructor(props: any) {
    super(props);
  }

  @Config()
  private gutter = '';

  componentDidMount() {
    console.log(this.mapConfigToTarget());
  }

  render() {
    return <Row>{this.props.children}</Row>;
  }
}

export default RowMaterial;
