import React from 'react';
import { BaseMaterial } from '../base';
import { Col } from 'antd';

@Reflect.metadata('icon', 'dash')
@Reflect.metadata('desc', `这个是col布局物料`)
@Reflect.metadata('isLayoutNode', true)
@Reflect.metadata('layoutCapacity', 100)
@Reflect.metadata('nodeDemandCapacity', '1')
@Reflect.metadata('type', 'Col')
@Reflect.metadata('config', {
  span: {
    name: '列宽度',
    type: 'select',
    min: 1,
    max: 24,
    default: 1,
    unit: null,
  },
  gutter: {
    name: '间隙',
    type: 'select',
  },
})
class ColMaterial extends BaseMaterial {
  constructor(props: any) {
    super(props);
  }

  render() {
    return <Col>{this.props.children}</Col>;
  }
}

export default ColMaterial;
