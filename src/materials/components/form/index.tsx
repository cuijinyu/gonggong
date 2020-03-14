import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { Modal, Row, Col, Form, Input, Select, Radio, Button, Switch, Divider } from 'antd';
import { BaseMaterial } from '../base';
import { Icon, Desc, IsLayout, Material, NodeDC, Config } from '../../decorators';
import FormItem from 'antd/lib/form/FormItem';

interface FormItemType {
  name: string;
  rule: string;
  type: 'input' | 'select' | 'radio' | 'switch' | 'time' | 'date';
  options?: string[];
}

@Icon(require('../../../imgs/form.png'), 'src')
@Desc('这个是input物料')
@IsLayout(false)
@Material()
@NodeDC(1)
class FormMaterial extends BaseMaterial {
  static async beforeInstantiate() {
    const modal = () => {
      return new Promise((resolve, reject) => {
        const ConfigerModal = () => {
          const [modalVisible, setModalVisible] = useState<boolean>(true);
          const [formItem, setFormItem] = useState<FormItemType[]>([]);
          const [form] = Form.useForm();

          const renderFormItems = (item: FormItemType, idx: number) => {
            return (
              <>
                <FormItem>
                  <Divider type="horizontal" />
                </FormItem>
                <FormItem name={item.name} label={`表单项${idx}标签`} required>
                  <Input />
                </FormItem>
                <FormItem name={item.name} label={`表单项${idx}类型`} required>
                  <Radio.Group>
                    <Radio.Button value="input">输入框</Radio.Button>
                    <Radio.Button value="numberPicker">数字选择器</Radio.Button>
                    <Radio.Button value="select">选择器</Radio.Button>
                    <Radio.Button value="radio">单选</Radio.Button>
                    <Radio.Button value="checkbox">多选</Radio.Button>
                    <Radio.Button value="time">时间</Radio.Button>
                    <Radio.Button value="date">日期</Radio.Button>
                  </Radio.Group>
                </FormItem>
                <FormItem name={item.name} label={`表单项${idx}校验规则`} required>
                  <Input />
                </FormItem>
                <FormItem name={item.name} label={`表单项${idx}是否必选`} required>
                  <Switch />
                </FormItem>
                <FormItem name={item.name} label={`表单项${idx}额外信息`} required>
                  <Input />
                </FormItem>
                <FormItem name={item.name} label={`表单项${idx}初始值`} required>
                  <Input />
                </FormItem>
              </>
            );
          };

          return (
            <Modal
              title="配置表单"
              visible={modalVisible}
              onCancel={() => {
                setModalVisible(false);
              }}
              onOk={() => {
                setModalVisible(false);
                resolve({
                  a: 1,
                  b: 2,
                });
              }}>
              <Row>
                <Form form={form}>
                  <Form.Item name="name" label="表单名" required>
                    <Input />
                  </Form.Item>
                  <Form.Item name="label" label="标签位置" required>
                    <Radio.Group>
                      <Radio.Button value="left">左对齐</Radio.Button>
                      <Radio.Button value="right">右对齐</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item name="size" label="表单尺寸" required>
                    <Radio.Group>
                      <Radio.Button value="small">Small</Radio.Button>
                      <Radio.Button value="middle">Middle</Radio.Button>
                      <Radio.Button value="large">Large</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                  {formItem.map((item, idx) => {
                    return renderFormItems(item, idx);
                  })}
                  <Form.Item>
                    <Button
                      onClick={() => {
                        setFormItem(items => {
                          items.push({} as any);
                          return _.cloneDeep(items);
                        });
                      }}>
                      新增表单项
                    </Button>
                  </Form.Item>
                </Form>
              </Row>
            </Modal>
          );
        };
        ReactDOM.render(<ConfigerModal />, document.getElementById('root-append'));
      });
    };
    return await modal();
  }
  @Config()
  private createProps = null;

  instantiate(createProps?: any) {
    console.log(createProps);
    return (
      <div>
        {createProps.a}
        {createProps.b}
      </div>
    );
  }
}

export default FormMaterial;
