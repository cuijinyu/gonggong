import React, { useState, useEffect } from 'react';
import { Select, Radio, Input, Button, Drawer, Card } from 'antd';
import { useGlobalContext } from '../../../../context/global';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import { useConfigerContext } from '../../context';

const { Option } = Select;

type onOkType = (type: string, value: any) => any;

const StaticDataViewer: React.FC<{
  onOk: onOkType;
}> = ({ onOk }) => {
  const [staticValue, setStaticValue] = useState<string>('');
  const { setSelectPropertyConfig } = useConfigerContext();
  const appendStaticConfigToElement = () => {
    onOk('static', staticValue);
  };
  return (
    <div>
      <div>静态数据</div>
      <div>
        <Input
          value={staticValue}
          onChange={e => {
            setStaticValue(e.target.value);
          }}
        />
      </div>
      <div>
        <Button onClick={appendStaticConfigToElement}>确定</Button>
      </div>
    </div>
  );
};

const StateDataViewer: React.FC<{
  onOk: onOkType;
}> = () => {
  const { astTool } = useGlobalContext();
  const [stateConfigerVisible, setStateConfigerVisible] = useState<boolean>(false);
  const [states, setStates] = useState(astTool.getStateList());
  const [stateName, setStateName] = useState<string>('');
  const [stateInitValue, setStateInitValue] = useState<any>();

  const createState = () => {
    astTool.appendState({
      name: stateName,
      initValue: stateInitValue,
    });
    setStateConfigerVisible(false);
    setStateName('');
    setStateInitValue('');
  };

  return (
    <div>
      <div>状态</div>
      <div>
        <div>
          {states.map(state => {
            return (
              <Card>
                <div>属性ID: {state.id}</div>
                <div>属性名: {state.name}</div>
                <div>属性初始值: {state.initValue}</div>
                <div>
                  <Button>选取属性</Button>
                </div>
              </Card>
            );
          })}
        </div>
        <div>
          <Button onClick={() => setStateConfigerVisible(true)}>添加状态</Button>
        </div>
      </div>
      <Drawer visible={stateConfigerVisible} onClose={() => setStateConfigerVisible(false)} title="状态编辑">
        <div>
          <div>
            <span>状态名</span>
          </div>
          <div>
            <Input value={stateName} onChange={e => setStateName(e.target.value)} />
          </div>
        </div>
        <div>
          <div>
            <span>初始状态值</span>
          </div>
          <div>
            <AceEditor
              value={stateInitValue}
              mode={'javascript'}
              theme={'github'}
              onChange={value => setStateInitValue(value)}
            />
          </div>
        </div>
        <div>
          <div>
            <Button onClick={createState}>确认</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

const MethodDataViewer: React.FC<{
  onOk: onOkType;
}> = () => {
  const { astTool } = useGlobalContext();
  const [methodConfigerVisible, setMethodConfigerVisible] = useState<boolean>(false);
  const [methods, setMethods] = useState(astTool.getMethodsList());
  return (
    <div>
      <div>方法</div>
      <div>
        <div></div>
        <div>
          <Button onClick={() => setMethodConfigerVisible(true)}>添加方法</Button>
        </div>
      </div>
      <Drawer visible={methodConfigerVisible} onClose={() => setMethodConfigerVisible(false)} title="方法编辑">
        <div>
          <div>
            <span>方法名称</span>
          </div>
          <div>
            <Input />
          </div>
        </div>
        <div>
          <div>
            <span>方法生成工具</span>
          </div>
          <div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div>
          <div>
            <span>方法流程列表</span>
          </div>
        </div>
        <div></div>
      </Drawer>
    </div>
  );
};

const PropertyEditor: React.FC<{
  onOk: onOkType;
}> = ({ onOk }) => {
  const [propertyType, setPropertyType] = useState<string>('static');

  const renderEditPanel = () => {
    switch (propertyType) {
      case 'static':
        return <StaticDataViewer onOk={onOk} />;
      case 'state':
        return <StateDataViewer onOk={onOk} />;
      case 'method':
        return <MethodDataViewer onOk={onOk} />;
    }
  };

  return (
    <div>
      <div>
        <div>属性类型</div>
        <Radio.Group
          value={propertyType}
          onChange={e => {
            setPropertyType(e.target.value);
          }}>
          <Radio.Button value={'static'}>静态数据</Radio.Button>
          <Radio.Button value={'state'}>状态</Radio.Button>
          <Radio.Button value={'method'}>方法</Radio.Button>
        </Radio.Group>
      </div>
      <div>{renderEditPanel()}</div>
    </div>
  );
};

export default PropertyEditor;
