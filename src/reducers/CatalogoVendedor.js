import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
  isLogged: false,
  hasError: false,
  isLoading: false,
  categoria: "TODO",
  name: "",
  username: "",
  password: ""
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.CATEGORIA_VENDEDOR:
      return Object.assign({}, state, {categoria: action.categoria});

    case ActionTypes.CATALOGO_VENDEDOR_HAS_ERROR:
      return Object.assign({}, state, {
        hasError: action.hasError
      });
    case ActionTypes.CATALOGO_VENDEDOR_IS_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isLoading
      });

    case ActionTypes.CATEGORIA:
      return Object.assign({}, state, {
        categoria: action.categoria
      });

    case ActionTypes.NO_CATEGORIA:
      return Object.assign({}, state, {
        categoria: ""
      });

    default:
      return state;
  }
};
