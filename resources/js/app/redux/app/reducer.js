import types from './const';

const initState = {
    user_auth:false,
    user:null
}

const Reducer = (state=initState, action) => {
    switch (action.type) {

        case types.LOGIN:
            return Object.assign({}, state, {
                user_auth:true,
                user:action.user
            });
            break;
        case types.LOGOUT:
            return Object.assign({}, state, initState);
            break;
        case types.SYNC_USER:
            return Object.assign({}, state, {
                user:action.user
            });
            break;
        default:
    }

    return state;
}

export default Reducer;
