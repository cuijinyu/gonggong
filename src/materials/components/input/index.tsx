import React from 'react';
import "reflect-metadata";
import { BaseMaterial } from '../base';
import { Input } from 'antd';

@Reflect.metadata('icon', 'Input')
@Reflect.metadata('desc', `这个是input物料`)
@Reflect.metadata('isLayoutNode', false)
@Reflect.metadata('nodeDemandCapacity', '1')
@Reflect.metadata('type', 'Input')
export default class InputMaterial extends BaseMaterial<
    { value: string }
> {
    constructor(props: any) {
        super(props);
    }

    onChange(value: Event) {
        if (value.target) {
            console.log((value.target as any).value);
        }
    }

    render() {
        return <Input value={this.props.value} 
                      onChange={this.onChange as any}/>
    }
}