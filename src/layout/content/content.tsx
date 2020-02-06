import React from 'react';
import cn from 'classnames';
import './index.scss';
import { BEM } from '../../common/utils/bem';
import Render from '../../render';

const Content: React.FC<{}> = function() {
  return (
    <div className={cn([BEM('content', 'wrapper')])}>
      <Render />
    </div>
  );
};

export default Content;
