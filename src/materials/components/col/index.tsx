import React from 'react';
import { BaseMaterial } from '../base';
import { Col } from 'antd';

@Reflect.metadata('icon', 'Col')
@Reflect.metadata('desc', `这个是col布局物料`)
@Reflect.metadata('isLayoutNode', true)
@Reflect.metadata('layoutCapacity', 100)
@Reflect.metadata('nodeDemandCapacity', '1')
@Reflect.metadata('type', 'Col')
class ColMaterial extends BaseMaterial {
    constructor(props: any) {
        super(props);
    }

    render() {
        return <Col>{this.props.children}</Col>
    }
}

export default ColMaterial;