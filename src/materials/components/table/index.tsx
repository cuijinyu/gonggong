import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'reflect-metadata';
import { Table, Modal, Input } from 'antd';
import { BaseMaterial } from '../base';
import { Icon, Desc, IsLayout, Material, NodeDC, Config } from '../../decorators';
import { useForm } from 'antd/lib/form/util';
import Form from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';

@Icon(require('../../../imgs/table.png'), 'src')
@Desc('这个是table物料')
@IsLayout(false)
@Material()
@NodeDC(1)
export default class TableMaterial extends BaseMaterial {
  constructor(props: any) {
    super(props);
  }

  static async beforeInstantiate() {
    const modal = () => {
      return new Promise((resolve, reject) => {
        const ConfigerModal = () => {
          const [modalVisible, setModalVisible] = useState<boolean>(true);

          const [form] = useForm();

          return (
            <Modal title="配置表格" visible={modalVisible}>
              <Form>
                <FormItem>
                  <Input />
                </FormItem>
              </Form>
            </Modal>
          );
        };
        ReactDOM.render(<ConfigerModal />, document.getElementById('root-append'));
      });
    };
    return await modal();
  }

  @Config()
  private value = '';

  @Config()
  private onChange = () => {};

  instantiate(createProps?: any) {
    return <Table />;
  }
}
