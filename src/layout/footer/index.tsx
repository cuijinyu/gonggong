import React from 'react';
import './index.scss';
import { BEM } from '../../common/utils/bem';

const Footer: React.FC<{}> = function({}) {
    return (
        <div className={BEM('footer', 'wrapper')}>
            Footer
        </div>
    )
}

export default Footer;