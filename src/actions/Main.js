import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";
import AsyncStorage from '@react-native-community/async-storage';

const isLogged = bool => {
  return {
    type: ActionTypes.IS_LOGGED,
    isLogged: bool
  };
};

const comerciosHasError = bool => {
  return {
    type: ActionTypes.COMERCIOS_HAS_ERROR,
    hasError: bool
  };
};

const comerciosIsLoading = bool => {
  return {
    type: ActionTypes.COMERCIOS_IS_LOADING,
    isLoading: bool
  };
};
const setAsyncStorage = () => {};

const goMapa = () => {
  Actions.Mapa();
  return {
    type: ActionTypes.MAPA
  };
};

const goMapaPagComercio = () => {
  Actions.MapaPaginaComercio();
  return {
    type: ActionTypes.MAPA_PAGINA_COMERCIO
  };
};


const goComerciosInicial = () => {
  Actions.Comercios();
  return {
    type: ActionTypes.COMERCIOS
  };
};

const goComercios = (comercios) => {
  AsyncStorage.setItem("comerciosCliente", JSON.stringify(comercios));
  Actions.Comercios();
  return {
    type: ActionTypes.COMERCIOS
  };
};

const goComerciosDetalle = (comercios) => {
  AsyncStorage.setItem("comerciosCliente", JSON.stringify(comercios));
  Actions.ComerciosDetalle();
  return {
    type: ActionTypes.COMERCIOS_DETALLE
  };
};

const goCatalogoCliente = () => {
  Actions.CatalogoClientes();
  return {
    type: ActionTypes.CATALOGO_CLIENTES
  };
};

const goCatalogoClienteFast = () => {
  Actions.CatalogoClientesFast();
  return {
    type: ActionTypes.CATALOGO_CLIENTES_FAST
  };
};

const goPrincipal = () => {
  Actions.Main();
  return {
    type: ActionTypes.MAIN
  };
};

const goBuscador = () => {
  Actions.Buscador();
  return {
    type: ActionTypes.BUSCADOR
  };
};

const goPaginaComercio = () => {
  Actions.PagComercio();
  return {
    type: ActionTypes.PAG_COMERCIO
  };
};

const introDenuncia = () => {
  Actions.IntroDenuncia();
  return {
    type: ActionTypes.DENUNCIA
  };
};

const introFeedback = () => {
  Actions.IntroFeedback();
  return {
    type: ActionTypes.FEEDBACK
  };
};

const goComercioMapa = () => {
  Actions.PagComercioMapa();
  return {
    type: ActionTypes.PAG_COMERCIO_MAPA
  };
};

const terminarLoader = () => {
  return {
    type: ActionTypes.TERMINAR_LOADER
  };
};

export default {
  goMapa,
  goComerciosInicial,
  goComercios,
  goComerciosDetalle,
  goPrincipal,
  goCatalogoCliente,
  goCatalogoClienteFast,
  goPaginaComercio,
  comerciosHasError,
  comerciosIsLoading,
  isLogged,
  introFeedback,
  introDenuncia,
  goBuscador,
  goMapaPagComercio,
  goComercioMapa,
  terminarLoader
};
