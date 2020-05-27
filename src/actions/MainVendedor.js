import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";
import AsyncStorage from '@react-native-community/async-storage';

const isLogged = bool => {
  return {
    type: ActionTypes.IS_LOGGED,
    isLogged: bool
  };
};

const catalogoHasError = bool => {
  return {
    type: ActionTypes.CATALOGO_HAS_ERROR,
    hasError: bool
  };
};

const catalogoIsLoading = bool => {
  return {
    type: ActionTypes.CATALOGO_IS_LOADING,
    isLoading: bool
  };
};
const setAsyncStorage = () => {};

const goCatalogo = () => {
  AsyncStorage.setItem("categoriaVendedorSeleccionadaFinal", "TODO");
  Actions.Catalogo();
  return {
    type: ActionTypes.CATALOGO
  };
};

const goVerFeedbacks = () => {
  Actions.VerFeedbacksComercio();
  return {
    type: ActionTypes.VER_FEEDBACKS_COMERCIO
  };
};

const goModificarComercio = () => {
  Actions.ModificarComercio();
  return {
    type: ActionTypes.MODIFICARCOMERCIO
  };
};

const goCatalogoDetalle = () => {
  Actions.CatalogoDetalle();
  return {
    type: ActionTypes.CATALOGO_DETALLE
  };
};

const goPrincipalVendedor = () => {
  Actions.MainVendedor();
  return {
    type: ActionTypes.MAINVENDEDOR
  };
};

const terminarLoader = () => {
  return {
    type: ActionTypes.TERMINAR_LOADER
  };
};

export default {
  goModificarComercio,
  goVerFeedbacks,
  goCatalogo,
  goCatalogoDetalle,
  goPrincipalVendedor,
  catalogoHasError,
  catalogoIsLoading,
  isLogged,
  terminarLoader
};
