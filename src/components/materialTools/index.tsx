import React, { FC, useEffect, useState, useCallback } from 'react';
import { produce } from 'immer';
import Materials, { getMetaInfo } from '../../materials/index';
import './index.scss';
import { BEM } from '../../common/utils/bem';
import { Icon, Popover } from 'antd';

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

  const renderIcon = useCallback((iconPath: string) => {
    const httpReg = /http[s]?:/;
    const maxStyle = { height: '32px', width: '32px' };
    if (iconPath.match(httpReg)) {
      return <img style={maxStyle} src={iconPath} />;
    }
    return <Icon style={maxStyle} type={iconPath} />;
  }, []);

  return (
    <div className={BEM('materialTools')}>
      <div className={BEM('materialTools', 'title')}>物料集合</div>
      <div className={BEM('materialTools', 'wrapper')}>
        {materials.map(material => {
          return (
            <Popover content={material.desc}>
              <div className={BEM('materialTools', 'item')}>
                <div className={BEM('materialTools', 'item-icon')}>{renderIcon(material.icon)}</div>
                <div className={BEM('materialTools', 'item-type')}>{material.type}</div>
              </div>
            </Popover>
          );
        })}
      </div>
    </div>
  );
};

export default MaterialTools;
