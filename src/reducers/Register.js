import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
  isLogged: false,
  hasError: false,
  isLoading: false,
  campoError: "",
  name: "",
  username: "",
  password: "",
  actualizar: "",
  latitud: null,
  longitud: null
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.REGISTER_HAS_ERROR:
      return Object.assign({}, state, {
        hasError: action.hasError
      });
    case ActionTypes.REGISTER_IS_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isLoading
      });

    case ActionTypes.REGISTER:
      return Object.assign({}, state, {
        hasError: false
      });

    case ActionTypes.CAMPO_ERROR:
      return Object.assign({}, state, {
        campoError: action.campoError
      });

    case ActionTypes.NO_ERROR:
      return Object.assign({}, state, {
        campoError: ""
      });

    case ActionTypes.ACTUALIZAR_COORDENADAS_REGISTRO:
      return Object.assign({}, state,{
          latitud: action.latitud,
          longitud :action.longitud
      });
    case ActionTypes.RENDERIZAR_MAPA:
      return Object.assign({}, state,{
          actualizar :action.actualizar
      });    

    default:
      return state;
  }
};
