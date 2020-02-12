import React from 'react';
import cn from 'classnames';
import './index.scss';
import { BEM } from '../../common/utils/bem';
import Render from '../../render';
import dndTypes from '../../constant/drag';
import { useDrop } from 'react-dnd';
import PageView from '../../components/pageView';

const Content: React.FC<{}> = function() {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: [dndTypes.MATERIAL, dndTypes.ELEMENT],
    drop: item => {
      console.log(item);
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  return (
    <div ref={drop} className={cn([BEM('content', 'wrapper')])}>
      <div>
        <PageView />
      </div>
      <Render />
    </div>
  );
};

export default Content;
