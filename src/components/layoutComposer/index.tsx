import React, { useEffect, useState } from 'react';

type LayoutConfigType = {
  isUsed: boolean;
  group?: number;
  start?: boolean;
  end?: boolean;
};

const initLayoutConfig = () => {
  const configArray: LayoutConfigType[] = [];
  for (let i = 0; i < 24; i++) {
    configArray.push({
      isUsed: false,
    });
  }
  return configArray;
};

const LayoutComposer = () => {
  const [layoutGroup, setLayoutGroup] = useState<LayoutConfigType[]>(initLayoutConfig());
  useEffect(() => {}, []);
  return (
    <div
      style={{
        display: 'flex',
      }}>
      {layoutGroup.map(layoutConfig => {
        return (
          <div
            style={{
              border: '1px solid black',
              height: '12px',
              width: '12px',
              marginRight: '3px',
              background: 'white',
            }}></div>
        );
      })}
    </div>
  );
};

export default LayoutComposer;
