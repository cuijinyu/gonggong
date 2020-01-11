import React from 'react';
import _ from 'lodash';

const createMaterial = <GP extends Object>(name: string, group: GP, props: any) => {
    return React.createElement(_.get(group, name), props);
};

export default {
    createMaterial
}