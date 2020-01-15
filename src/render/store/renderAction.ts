export const setStateById = () => {
    return {
        type: SET_STATE,
        payload: {}
    }
}

export const setMethodById = () => {
    return {
        type: SET_METHOD,
        payload: {}
    }
}

export const addState = () => {
    return {
        type: ADD_STATE,
        payload: {}
    }
}

export const addMethod = () => {
    return {
        type: ADD_METHOD,
        payload: {}
    }
}

export const deleteState = () => {
    return {
        type: DELETE_STATE,
        payload: {}
    }
}

export const deleteMethod = () => {
    return {
        type: DELETE_METHOD,
        payload: {}
    }
}

export const SET_STATE = 'setState';
export const SET_METHOD = 'setMethod';
export const ADD_STATE = 'addState';
export const ADD_METHOD = 'addMethod';
export const DELETE_STATE = 'deleteState';
export const DELETE_METHOD = 'deleteMethod';