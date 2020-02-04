import React from 'react';
import "reflect-metadata";
import { BaseMaterial } from '../base';
import { Input } from 'antd';

@Reflect.metadata('icon', 'Input')
@Reflect.metadata('desc', `这个是input物料`)
@Reflect.metadata('isLayoutNode', false)
@Reflect.metadata('nodeDemandCapacity', '1')
@Reflect.metadata('type', 'Input')
@Reflect.metadata('config', {
    
})
export default class InputMaterial extends BaseMaterial<
    { 
        value: string,
        onClick: any,
        onChange?: any
    }
> {
    constructor(props: any) {
        super(props);
        console.log(this.props);
    }

    onChange(value: Event) {
        console.log(this)
        console.log(value)
        // if (!this.props.onChange) {
        //     if (value.target) {
        //         console.log((value.target as any).value);
        //     }
        //     return;
        // }
        // this.props.onChange()
    }

    render() {
        return <Input value={this.props.value} 
                      onClick={this.props.onClick}
                      onChange={this.props.onChange as any}/>
    }
}