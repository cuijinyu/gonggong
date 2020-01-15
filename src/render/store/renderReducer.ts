import { combineReducers } from "redux";
import { SET_METHOD,
         SET_STATE,
         ADD_METHOD,
         ADD_STATE,
         DELETE_METHOD,
         DELETE_STATE } from './renderAction';
import { produce } from 'immer';

type StateReducerAction = {
    type: typeof SET_STATE,
    payload: {
        id: string,
        value: any
    }
} | {
    type: typeof ADD_STATE,
    payload: {
        id: string,
        name: string,
        initValue: any
    }
} | {
    type: typeof DELETE_STATE,
    payload: {
        id: string
    }
}

type MethodReducerAction = {
    type: typeof SET_METHOD,
    payload: {
        id: string,
        value: any
    }
} | {
    type: typeof ADD_METHOD,
    payload: {
        id: string,
        name: string,
        method: any
    }
} | {
    type: typeof DELETE_METHOD,
    payload: {
        id: string
    }
}

type StateType = {
    id: string,
    name: string,
    value: any
}

type MethodType = {
    id: string,
    name: string,
    value: any
}

const stateReducer = function (
    state:{
        states: StateType[]
    } = {
        states: []
    }, 
    action: StateReducerAction
) {
    switch (action.type) {
        case 'addState':
            return produce(state, draft => {
                const { id, name, initValue } = action.payload;
                const option = {
                    id,
                    name,
                    value: initValue
                }
                console.log(state)
                draft.states.push(
                    option
                )
                return draft;
            });
        case 'setState':
            return produce(state, draft => {
                const filtedState = draft.states.filter(state => state.id === action.payload.id);
                if (filtedState.length > 0) {
                    filtedState[0].value = action.payload.value;
                }
                return draft;
            })
        case 'deleteState':
            return produce(state, draft => {
                const filtedState = draft.states.filter(state => state.id === action.payload.id);
                if (filtedState.length > 0) {
                    const idx = draft.states.indexOf(filtedState[0]);
                    draft.states.splice(idx, 1);
                }
                return draft;
            })
        default:
            return state;
    }
}

const methodReducer = function (
    state = {
        methods: []
    }, 
    action: MethodReducerAction
) {
    switch (action.type) {
        case 'addMethod':
            return produce(state, draft => {

            })
        case 'setMethod':
            return produce(state, draft => {

            })
        case 'deleteMethod':
            return produce(state, draft => {
                
            })
        default:
            return state;
    }
}

export default combineReducers({
    stateReducer, 
    methodReducer
});