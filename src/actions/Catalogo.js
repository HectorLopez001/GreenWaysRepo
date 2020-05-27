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

const cambiarCategoria = stringCategoria => {
  return dispatch => {
    dispatch(categoria(stringCategoria));
  };
};

const categoria = string => {
  return {
    type: ActionTypes.CATEGORIA_VENDEDOR,
    categoria: string
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

const goInsertar = categoriaSeleccionada => {
  AsyncStorage.setItem("categoriaVendedorSeleccionada", categoriaSeleccionada);

  // alert(categoriaSeleccionada);

  Actions.Insertar();
  return {
    type: ActionTypes.INSERTAR
  };
};

const goEliminar = () => {
  Actions.Eliminar();
  return {
    type: ActionTypes.ELIMINAR
  };
};

const goCatalogo = (categoriaSeleccionada, productos) => {
  AsyncStorage.setItem(
    "categoriaVendedorSeleccionadaFinal",
    categoriaSeleccionada
  );

  AsyncStorage.setItem(
    "productosComercio",
    JSON.stringify(productos)
  );

  Actions.Catalogo();
  return {
    type: ActionTypes.CATALOGO
  };
};

const goCatalogoDetalles = (categoriaSeleccionada, productos) => {
  AsyncStorage.setItem(
    "categoriaVendedorSeleccionadaFinal",
    categoriaSeleccionada
  );

  AsyncStorage.setItem(
    "productosComercio",
    JSON.stringify(productos)
  );

 // alert(productos);

  Actions.CatalogoDetalle();
  return {
    type: ActionTypes.CATALOGO_DETALLE
  };
};

const goPrincipal = () => {
  Actions.MainVendedor();
  return {
    type: ActionTypes.MODIFICAR
  };
};

const volverCatalogos = (coordenadaListView, categoriaSeleccionada) => {
  AsyncStorage.setItem(
    "filaInicioCatalogoVendedorFinal",
    coordenadaListView.toString()
  );

  AsyncStorage.setItem(
    "categoriaVendedorSeleccionadaFinal",
    categoriaSeleccionada
  );

  AsyncStorage.setItem("visitado", "no");

  AsyncStorage.getItem("catalogo").then(value => {
    if (value == "detalle") {
      Actions.CatalogoDetalle();
    } else {
      if (value == "rapido") {
        Actions.Catalogo();
      }
    }
  });
  return {
    type: ActionTypes.CATALOGO
  };
};

function modificarPagProducto() {
  AsyncStorage.setItem("visitado", "pagProducto");

  Actions.Modificar();

  return {
    type: ActionTypes.MODIFICAR
  };
}

function modificar(
  nombreProducto,
  nombreUsuario,
  rowID,
  categoriaSeleccionada
) {
  AsyncStorage.setItem("visitado", "no");

  AsyncStorage.setItem("producto", nombreProducto);
  AsyncStorage.setItem("filaInicioCatalogoVendedor", rowID.toString());
  AsyncStorage.setItem("categoriaVendedorSeleccionada", categoriaSeleccionada);
  AsyncStorage.setItem("catalogo", "rapido");

  Actions.Modificar();

  return {
    type: ActionTypes.MODIFICAR
  };
}

function modificarDetalle(
  nombreProducto,
  nombreUsuario,
  rowID,
  categoriaSeleccionada
) {
  AsyncStorage.setItem("visitado", "no");

  AsyncStorage.setItem("producto", nombreProducto);
  AsyncStorage.setItem("filaInicioCatalogoVendedor", rowID.toString());
  AsyncStorage.setItem("categoriaVendedorSeleccionada", categoriaSeleccionada);
  AsyncStorage.setItem("catalogo", "detalle");

  Actions.Modificar();

  return {
    type: ActionTypes.MODIFICAR
  };
}

function mensajeEliminar(
  nombreProducto,
  nombreUsuario,
  rowID,
  categoriaSeleccionada
) {
  Alert.alert(
    "Aviso",
    "¿Deseas eliminar " + nombreProducto + "?",
    [
      {
        text: "Sí",
        onPress: () =>
          eliminarProducto(
            nombreProducto,
            nombreUsuario,
            rowID,
            categoriaSeleccionada
          )
      },
      { text: "No", onPress: () => null }
    ],
    { cancelable: false }
  );
  return {
    type: ActionTypes.CATALOGO
  };
}

const eliminarProducto = (
  nombreProducto,
  nombreUsuario,
  rowId,
  categoriaSeleccionada
) => {
  fetch("https://thegreenways.es/eliminarProducto.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombreProducto: nombreProducto,
      nombreUsuario: nombreUsuario
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      if (responseJson == "eliminado") {
        AsyncStorage.setItem(
          "categoriaVendedorSeleccionadaFinal",
          categoriaSeleccionada
        );

        AsyncStorage.setItem(
          "filaInicioCatalogoVendedorFinal",
          rowId.toString()
        );

        Actions.refresh({ key: Math.random() });

        /*   Alert.alert(
          "Aviso de confirmación",
          "Se ha borrado el producto " + nombreProducto
        );*/
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      console.warn(e);
    });
};

const mensajeEliminarPagProducto = (
  nombreProducto,
  nombreUsuario,
  rowId,
  categoriaSeleccionada
) => {
  Alert.alert(
    "Aviso",
    "¿Deseas eliminar " + nombreProducto + "?",
    [
      {
        text: "Sí",
        onPress: () =>
          eliminarProductoPagProducto(
            nombreProducto,
            nombreUsuario,
            rowId,
            categoriaSeleccionada
          )
      },
      { text: "No", onPress: () => null }
    ],
    { cancelable: false }
  );
  return {
    type: ActionTypes.CATALOGO
  };
};

const eliminarProductoPagProducto = (
  nombreProducto,
  nombreUsuario,
  rowId,
  categoriaSeleccionada
) => {
  fetch("https://thegreenways.es/eliminarProducto.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombreProducto: nombreProducto,
      nombreUsuario: nombreUsuario
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      if (responseJson == "eliminado") {
        AsyncStorage.setItem(
          "categoriaVendedorSeleccionadaFinal",
          categoriaSeleccionada
        );

        AsyncStorage.setItem(
          "filaInicioCatalogoVendedorFinal",
          rowId.toString()
        );

        AsyncStorage.getItem("catalogo").then(value => {
          if (value == "detalle") {
            Actions.CatalogoDetalle();
          } else {
            Actions.Catalogo();
          }
        });

        /*   Alert.alert(
          "Aviso de confirmación",
          "Se ha borrado el producto " + nombreProducto
        );*/
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      console.warn(e);
    });
};

export default {
  cambiarCategoria,
  categoria,
  catalogoHasError,
  catalogoIsLoading,
  goInsertar,
  goEliminar,
  goCatalogo,
  goPrincipal,
  goCatalogoDetalles,
  mensajeEliminar,
  mensajeEliminarPagProducto,
  modificarPagProducto,
  modificarDetalle,
  modificar,
  volverCatalogos
};
