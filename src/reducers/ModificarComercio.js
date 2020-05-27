import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
  isLogged: false,
  hasError: false,
  isLoading: false,
  campoError: "",
  name: "",
  username: "",
  password: "",
  latitud: null,
  longitud: null
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.MODIFICARCOMERCIO_HAS_ERROR:
      return Object.assign({}, state, {
        hasError: action.hasError
      });
    case ActionTypes.MODIFICARCOMERCIO_IS_LOADING:
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
    case ActionTypes.ACTUALIZAR_COORDENADAS:
      return Object.assign({}, state,{
          latitud: action.latitud,
          longitud :action.longitud
    });

    default:
      return state;
  }
};
