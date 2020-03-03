import React, { useReducer, useCallback } from 'react';
import produce from 'immer';
import { Collapse, Row, Col, Input } from 'antd';

const { Panel } = Collapse;

type directionStateType = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

type directionActionType =
  | {
      type: 'changeTop';
      data: {
        top: number;
      };
    }
  | {
      type: 'changeBottom';
      data: {
        bottom: number;
      };
    }
  | {
      type: 'changeLeft';
      data: {
        left: number;
      };
    }
  | {
      type: 'changeRight';
      data: {
        right: number;
      };
    };
type fontActionType =
  | {
      type: 'changeFontType';
      data: {
        fontType: string;
      };
    }
  | {
      type: 'changeFontSize';
      data: {
        fontSize: number;
      };
    };

type fontStateType = {
  fontType: string;
  fontSize: number;
};

type backgroundStateType =
  | {
      backgroundType: 'image';
      url: string;
    }
  | {
      backgroundType: 'color';
      rgba: string;
    };

type backgroundActionType =
  | {
      type: 'changeBackgroundType';
      data: {
        backgroundType: 'image' | 'color';
      };
    }
  | {
      type: 'changeBackgroundUrl';
      data: {
        url: string;
      };
    }
  | {
      type: 'changeBackgoundColor';
      data: {
        rgba: string;
      };
    };

type animateStateType = {
  animates: {
    name: string;
  }[];
};

type animateActionType =
  | {
      type: 'addAnimate';
      data: {
        name: string;
      };
    }
  | {
      type: 'deleteAnimate';
      data: {
        idx: number;
      };
    };
type sizeStateType = {
  width: string;
  height: string;
};

type sizeActionType =
  | {
      type: 'changeWidth';
      data: {
        width: string;
      };
    }
  | {
      type: 'changeHeight';
      data: {
        height: string;
      };
    };

const sizeReducer = (state: sizeStateType, action: sizeActionType) =>
  produce(state, draft => {
    switch (action.type) {
      case 'changeWidth':
        draft.width = action.data.width;
        break;
      case 'changeHeight':
        draft.height = action.data.height;
        break;
      default:
        return state;
    }
  });
const fontReducer = (state: fontStateType, action: fontActionType) =>
  produce(state, draft => {
    switch (action.type) {
      case 'changeFontSize':
        draft.fontSize = action.data.fontSize;
        break;
      case 'changeFontType':
        draft.fontType = action.data.fontType;
        break;
      default:
        return state;
    }
  });
const directionReducer = (state: directionStateType, action: directionActionType) =>
  produce(state, draft => {
    switch (action.type) {
      case 'changeBottom':
        draft.bottom = action.data.bottom;
        break;
      case 'changeLeft':
        draft.left = action.data.left;
        break;
      case 'changeRight':
        draft.right = action.data.right;
        break;
      case 'changeTop':
        draft.top = action.data.top;
        break;
      default:
        return state;
    }
  });
const backgroundReducer = (state: backgroundStateType, action: backgroundActionType) =>
  produce(state, draft => {
    switch (action.type) {
      case 'changeBackgoundColor':
        if (state.backgroundType === 'color') {
          (draft as any).rgba = action.data.rgba;
        }
        break;
      case 'changeBackgroundType':
        draft.backgroundType = action.data.backgroundType;
        break;
      case 'changeBackgroundUrl':
        if (state.backgroundType === 'image') {
          (draft as any).url = action.data.url;
        }
        break;
      default:
        return state;
    }
  });
const animateReducer = (state: animateStateType, action: animateActionType) =>
  produce(state, draft => {
    switch (action.type) {
      case 'addAnimate':
        draft.animates.push({
          name: action.data.name,
        });
        break;
      case 'deleteAnimate':
        draft.animates.splice(action.data.idx, 1);
        break;
      default:
        return state;
    }
  });

const StyleEditor: React.FC = () => {
  const [size, dispatchSize] = useReducer<typeof sizeReducer>(sizeReducer, {
    height: '100%',
    width: '100%',
  });
  const [margin, dispatchMargin] = useReducer<typeof directionReducer>(directionReducer, {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  const [padding, setPadding] = useReducer<typeof directionReducer>(directionReducer, {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });
  const [font, setFont] = useReducer<typeof fontReducer>(fontReducer, {
    fontType: '',
    fontSize: 14,
  });
  const [background, setBackground] = useReducer<typeof backgroundReducer>(backgroundReducer, {
    backgroundType: 'color',
    rgba: '(255, 255, 255, 0)',
  });
  const [animateType, setAnimateType] = useReducer<typeof animateReducer>(animateReducer, {
    animates: [],
  });
  const composeAllStyle = useCallback(() => {}, [size, margin, padding, font, background, animateType]);
  return (
    <>
      <Collapse bordered={false}>
        <Panel header="尺寸" key="1">
          <div>
            <Row>
              <Col span={8}>宽</Col>
              <Col span={16}>
                <Input />
              </Col>
            </Row>
            <Row>
              <Col span={8}>高</Col>
              <Col span={16}>
                <Input />
              </Col>
            </Row>
          </div>
        </Panel>
        <Panel header="外边距" key="2">
          <div>
            {/* 外边距 */}
            <div>
              <div>左边距</div>
              <div>上边距</div>
              <div>右边距</div>
              <div>下边距</div>
            </div>
          </div>
        </Panel>
        <Panel header="内边距" key="3">
          <div>
            {/* 内边距 */}
            <div>
              <div>左边距</div>
              <div>上边距</div>
              <div>右边距</div>
              <div>下边距</div>
            </div>
          </div>
        </Panel>

        <Panel header="字体" key="4">
          <div>
            {/* 字体 */}
            <div>
              <div>字体类型</div>
              <div>字体大小</div>
            </div>
          </div>
        </Panel>
        <Panel header="背景" key="5">
          <div>
            {/* 背景 */}
            <div>
              <div>背景类型</div>
              <div>背景图片地址</div>
              <div>背景颜色</div>
            </div>
          </div>
        </Panel>
        <Panel header="动画" key="6">
          <div>
            {/* 动画 */}
            <div>
              <div>添加动画</div>
              <div>已添加的动画列表</div>
            </div>
          </div>
        </Panel>
      </Collapse>
    </>
  );
};

export default StyleEditor;
