import React from 'react';
import cn from 'classnames';
import "./index.scss";
import { BEM } from '../../common/utils/bem';

const Header: React.FC<{}> = function({}) {
    return (
        <div className={
                cn(
                    [BEM('header', 'wrapper')]
                )
            }>
            Header
        </div>
    )
}

export default Header;