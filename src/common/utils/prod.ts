import _ from 'lodash';

const isProd = function() {
    return _.get(window, 'gg.config.isProd', false);
}

const setProd = function(state: boolean):void {
    _.set(window, 'gg.config.isProd', state);
}

export {
    isProd,
    setProd
}