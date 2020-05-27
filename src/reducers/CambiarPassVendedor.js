import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
  isLogged: false,
  hasError: false,
  isLoading: false,
  campoError: "",
  name: "",
  username: "",
  password: ""
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.CAMBIAR_PASS_VENDEDOR_HAS_ERROR:
      return Object.assign({}, state, {
        hasError: action.hasError
      });
    case ActionTypes.CAMBIAR_PASS_VENDEDOR_IS_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isLoading
      });
    case ActionTypes.CAMPO_ERROR:
      return Object.assign({}, state, {
        campoError: action.campoError
      });
    case ActionTypes.NO_ERROR:
      return Object.assign({}, state, {
        campoError: ""
      });

    default:
      return state;
  }
};
