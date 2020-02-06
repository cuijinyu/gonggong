import React from 'react';
import { BaseMaterial } from '../base';
import { Row } from 'antd';

@Reflect.metadata('icon', 'Row')
@Reflect.metadata('desc', `这个是row布局物料`)
@Reflect.metadata('isLayoutNode', true)
@Reflect.metadata('layoutCapacity', 24)
@Reflect.metadata('nodeDemandCapacity', '1')
@Reflect.metadata('type', 'Row')
@Reflect.metadata('config', {})
class RowMaterial extends BaseMaterial {
  constructor(props: any) {
    super(props);
  }

  render() {
    return <Row>{this.props.children}</Row>;
  }
}

export default RowMaterial;
