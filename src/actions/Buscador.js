import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";

import { Alert } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

/*const isLogged = (bool) => {
    return {
        type: ActionTypes.IS_LOGGED,
        isLogged: bool
    }
};  */

const noMostrarlo = () => {
  return {
    type: ActionTypes.BUSCADOR_NO_MOSTRAR
  };
};

const mostrarlo = () => {
  return {
    type: ActionTypes.BUSCADOR_MOSTRAR
  };
};

/*const cambiarMostrar = stringMostrar => {
  return dispatch => {
    dispatch(mostrar(stringMostrar));
  };
};*/

/*const mostrar = string => {
  return {
    type: ActionTypes.BUSCADOR_NO_MOSTRAR,
    mostrar: string
  };
};*/

const buscadorHasError = bool => {
  return {
    type: ActionTypes.BUSCADOR_HAS_ERROR,
    hasError: bool
  };
};

const buscadorIsLoading = bool => {
  return {
    type: ActionTypes.BUSCADOR_IS_LOADING,
    isLoading: bool
  };
};

export default {
  // cambiarMostrar,
  mostrarlo,
  noMostrarlo,
  buscadorHasError,
  buscadorIsLoading
};
