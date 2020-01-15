import { combineReducers } from "redux"

const stateReducer = function (
    state = {
        states: []
    }, 
    action: any
) {

}

const methodReducer = function (
    state = {
        methods: []
    }, 
    action: any
) {

}

export default combineReducers({
    states: stateReducer, 
    methods: methodReducer
});