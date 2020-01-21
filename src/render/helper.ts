import React from 'react';
import _ from 'lodash';

const createMaterial = <GP extends Object>(name: string, group: GP, props: any) => {
    return React.createElement(_.get(group, name), props);
};

const ajaxAdapter = () => {
    
}

const wrapMethod = (method: string) => {
    return `
        function(
            state,
            method,
            setState,
            ajax
        ) {

        }
    `
};

const injectMethod = (method: string) => {
    const wrapper = ``
    const listen = (str: any) => {
        console.log(str);
    }

    const emit = (str: any) => {
        console.log(str);
    }

    return eval(method);
}

const chainMethod = () => {

}

const injectState = () => {

}

const pageJump = () => {

}

const injectStyleClass = () => {

}

const compileMethod = () => {
    
}

export default {
    createMaterial,
    injectMethod
}