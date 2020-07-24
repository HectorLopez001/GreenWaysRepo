import * as ActionTypes from '../constants/ActionTypes'

const initialState = {
    isLogged: false,
    hasError : false,
    isLoading: false,
    name: '',
    username: '',
    password: '',
    categoria: "TODO",
};



export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type){

        case ActionTypes.CATALOGO_HAS_ERROR:

            return Object.assign({}, state, {
                hasError: action.hasError,
            });
        case ActionTypes.CATALOGO_IS_LOADING:

            return Object.assign({}, state, {
                isLoading: action.isLoading,
            });

        case ActionTypes.CATEGORIA:
            return Object.assign({}, state, {
                categoria: action.categoria
            });

        default:
            return state
    }
}


