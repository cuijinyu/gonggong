import React from 'react';
import './index.scss';
import { BEM } from '../../common/utils/bem';

const RightBar: React.FC<{}> = function({}) {
    return (
        <div className={BEM('rightBar', 'wrapper')}>
            right bar
        </div>
    )
}

export default RightBar;