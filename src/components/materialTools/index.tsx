import React, { FC, useEffect, useState, useCallback } from 'react';
import { produce } from 'immer';
import Materials, { getMetaInfo } from '../../materials/index';
import './index.scss';
import { BEM } from '../../common/utils/bem';
import { Icon, Popover } from 'antd';
import { useDrag } from 'react-dnd';
import dndType from '../../constant/drag';
import _ from 'lodash';

const MaterialItem: FC<{ material: ReturnType<typeof getMetaInfo> }> = ({ material }) => {
  const [collectedProps, drag] = useDrag({
    item: {
      type: dndType.MATERIAL,
      materialType: material.type,
      ..._.omit(material, 'type'),
    },
  });

  const renderIcon = useCallback((iconPath: string) => {
    const httpReg = /http[s]?:/;
    const maxStyle = { height: '32px', width: '32px' };
    if (iconPath.match(httpReg)) {
      return <img style={maxStyle} src={iconPath} />;
    }
    return <Icon style={maxStyle} type={iconPath} />;
  }, []);

  return (
    <Popover content={material.desc}>
      <div className={BEM('materialTools', 'item')}>
        <div ref={drag}>
          <div className={BEM('materialTools', 'item-icon')}>{renderIcon(material.icon)}</div>
          <div className={BEM('materialTools', 'item-type')}>{material.type}</div>
        </div>
      </div>
    </Popover>
  );
};

const MaterialTools: FC = () => {
  const [materials, setMaterials] = useState<ReturnType<typeof getMetaInfo>[]>([]);

  useEffect(() => {
    for (const materialKey in Materials) {
      const material = Materials[materialKey as keyof typeof Materials];
      setMaterials(materials =>
        produce(materials, draft => {
          draft.push(getMetaInfo(material));
        }),
      );
    }
  }, []);

  return (
    <div className={BEM('materialTools')}>
      <Popover content={'这里是所有可以使用的物料合集，包括布局物料和功能物料'}>
        <div className={BEM('materialTools', 'title')}>物料集合</div>
      </Popover>
      <div className={BEM('materialTools', 'wrapper')}>
        <div>
          <div className={BEM('materialTools', 'wrapper-container-title')}>布局物料</div>
          <div className={BEM('materialTools', 'wrapper-container')}>
            {materials.map(material => {
              return material.isLayoutNode && <MaterialItem material={material} />;
            })}
          </div>
        </div>
        <div>
          <div className={BEM('materialTools', 'wrapper-container-title')}>功能物料</div>
          <div className={BEM('materialTools', 'wrapper-container')}>
            {materials.map(material => {
              return !material.isLayoutNode && <MaterialItem material={material} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialTools;
