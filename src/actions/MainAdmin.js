import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";

const isLogged = bool => {
  return {
    type: ActionTypes.IS_LOGGED,
    isLogged: bool
  };
};

const goGestionUsuariosRegistrados = () => {
  Actions.GestionUsuariosRegistrados();
  return {
    type: ActionTypes.GESTION_USUARIOS_REGISTRADOS,
    // flicker: "GestionUsuariosRegistrados"
  };
};

const goGestionComercios = () => {
  Actions.GestionComercios();
  return {
    type: ActionTypes.GESTION_COMERCIOS,
    // flicker: "GestionComercios"
  };
};

const terminarLoader = () => {
  return {
    type: ActionTypes.TERMINAR_LOADER
  };
};

const flick = () => {  
  Actions.MainAdmin();
  return {
    type: ActionTypes.MAINADMIN,
    // flicker: "MainAdmin"
  };
};

export default {
  isLogged,
  goGestionUsuariosRegistrados,
  goGestionComercios,
  terminarLoader,
  flick
};
