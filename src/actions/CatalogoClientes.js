import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";

import { Alert } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

const goCatalogoCliente = (categoriaSeleccionada, productos, categorias) => {
  AsyncStorage.setItem(
    "categoriaCompradorSeleccionadaFinal",
    categoriaSeleccionada
  );

  AsyncStorage.setItem(
    "productosComercioCliente",
    JSON.stringify(productos)
  );

  AsyncStorage.setItem(
    "categoriasComercio",
    categorias
  );

  Actions.CatalogoClientes();
  return {
    type: ActionTypes.CATALOGO_CLIENTES
  };
};

const goCatalogoClienteFast = (categoriaSeleccionada, productos, categorias) => {
  AsyncStorage.setItem(
    "categoriaCompradorSeleccionadaFinal",
    categoriaSeleccionada
  );

  AsyncStorage.setItem(
    "productosComercioCliente",
    JSON.stringify(productos)
  );

  AsyncStorage.setItem(
    "categoriasComercio",
    categorias
  );

  Actions.CatalogoClientesFast();
  return {
    type: ActionTypes.CATALOGO_CLIENTES_FAST
  };
};

const goPaginaComercio = () => {
  Actions.PagComercio();
  return {
    type: ActionTypes.PAG_COMERCIO
  };
};

const cambiarCategoria = stringCategoria => {
  return dispatch => {
    dispatch(categoria(stringCategoria));
  };
};

const categoria = string => {
  return {
    type: ActionTypes.CATEGORIA,
    categoria: string
  };
};

export default {
  goCatalogoCliente,
  goCatalogoClienteFast,
  goPaginaComercio,
  categoria,
  cambiarCategoria
};
