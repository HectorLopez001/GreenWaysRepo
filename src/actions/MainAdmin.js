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
    type: ActionTypes.GESTION_USUARIOS_REGISTRADOS
  };
};

const goGestionComercios = () => {
  Actions.GestionComercios();
  return {
    type: ActionTypes.GESTION_COMERCIOS
  };
};

const terminarLoader = () => {
  return {
    type: ActionTypes.TERMINAR_LOADER
  };
};

export default {
  isLogged,
  goGestionUsuariosRegistrados,
  goGestionComercios,
  terminarLoader
};
