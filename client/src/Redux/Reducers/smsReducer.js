import {
    GET_SMS_SETTINGS,
    REMOVE_SMS_SETTINGS,
    ADD_SMS_SETTINGS,
    SMS_ERROR,
    REMOVE_ERROR
} from './../Actions/smsActions';
import initialState from './initialState';

export default function(state = initialState.smssettings, action) {
    switch(action.type) {
        case GET_SMS_SETTINGS:
            return {...state, error: '', smssettings: action.data};
        case REMOVE_SMS_SETTINGS:
            return {...state, error: '', smssettings: initialState.smssettings};
        case SET_SMS_SETTINGS:
            return {...state, error: ''};
        case SMS_ERROR:
            return {...state, error: action.payload};
        case REMOVE_ERROR:
            return {...state, error: ''};
    }

    return state;
}