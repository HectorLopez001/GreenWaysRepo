import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";

/*const goPrincipal = () => {
  Actions.Main();
  return {
    type: ActionTypes.MAIN
  };
};*/

const perfilRegistradoHasError = bool => {
  return {
    type: ActionTypes.PERFILREGISTRADO_HAS_ERROR,
    hasError: bool
  };
};

const perfilRegistradoIsLoading = bool => {
  return {
    type: ActionTypes.PERFILREGISTRADO_IS_LOADING,
    isLoading: bool
  };
};
/*
const pararLoader = () => {
  return {
    type: ActionTypes.PERFILREGISTRADO_IS_LOADING,
    isLoading: false
  };
};

const cargarLoader = () => {
  return {
    type: ActionTypes.PERFILREGISTRADO_IS_LOADING,
    isLoading: true
  };
};
*/

const goCambiarPass = () => {
  Actions.CambiarPassRegistrado();
  return {
    type: ActionTypes.CAMBIAR_PASS_REGISTRADO
  };
};

const goModificarPerfilRegistrado = () => {
  Actions.ModificarPerfilRegistrado();
  return {
    type: ActionTypes.MODIFICARPERFILREGISTRADO
  };
};

export default {
  //goPrincipal,
  goModificarPerfilRegistrado,
  goCambiarPass,
  perfilRegistradoHasError,
  perfilRegistradoIsLoading
  // pararLoader,
  // cargarLoader
};
