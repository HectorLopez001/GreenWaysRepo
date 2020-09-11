import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";

import { Alert } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';


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

const cambiarScroll = numero => {
  return dispatch => {
    dispatch(scroll(numero));
  };
};

const scroll = numero => {
  return {
    type: ActionTypes.SCROLL_CATEGORIA_VENDEDOR,
    scroll: numero
  };
};

const modificarPropsCategoria = (categoriaVieja, categoriaNueva) => {
  return dispatch => {
    dispatch(modificarPropsCategoria2( categoriaVieja, categoriaNueva));
  };
};

const modificarPropsCategoria2 = (categoriaVieja, categoriaNueva) => {
  return {
    type: ActionTypes.MODIFICAR_CATEGORIA_VENDEDOR,
    categoriaVieja: categoriaVieja,
    categoriaNueva: categoriaNueva
  }
}

const agregarCategoria = (newCategoria) => {
  return dispatch => {
    dispatch(agregarCategoria2(newCategoria));
  }
}

const agregarCategoria2 = (newCategoria) => {
  return {
    type: ActionTypes.AGREGAR_CATEGORIA_VENDEDOR,
    categoriaNueva: newCategoria
  };
};

const quitarCategoria = (categoria) => {
  return dispatch => {
    dispatch(quitarCategoria2(categoria));
  }
}

const quitarCategoria2 = (categoria) => {
  return {
    type: ActionTypes.QUITAR_CATEGORIA_VENDEDOR,
    categoriaQuitar: categoria
  };
};

const actualizarCategorias = newCategorias => {
  return dispatch => {
    dispatch(categorias(newCategorias));
  };
};

const categorias = newCategorias => {
  return {
    type: ActionTypes.ACTUALIZAR_CATEGORIAS_VENDEDOR,
    categorias: newCategorias
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
    isLoadingCategoria: bool
  };
};

const categoriasHasError = bool => {
  return {
    type: ActionTypes.CATEGORIA_HAS_ERROR,
    hasError: bool
  };
};

const categoriasIsLoading = bool => {
  return {
    type: ActionTypes.CATEGORIA_IS_LOADING,
    isLoadingCategoria: bool
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

const goGestionarCategoriasCatalogo = () => {
  Actions.CategoriasYCatalogo();
  return {
    type: ActionTypes.CATALOGO_CATEGORIAS_CATALOGO
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

const modificarCategoria = (categoriaVieja, categoriaNueva, nombreUsuario) => {

  return dispatch => {

    dispatch(categoriasIsLoading(true));

    // Campos vacios
    if (!categoriaNueva) {
      Alert.alert("Aviso", "Debes introducir el nombre de la categoria.");
  
      // Estado de error en el login
      dispatch(categoriasHasError(true));
      // Se cancela el estado de envío
      dispatch(categoriasIsLoading(false));
  
      return;
    }
    else if (categoriaNueva.length < 3)
    {
      Alert.alert("Aviso", "Debes introducir un nombre de categoria de al menos 3 digitos.");
  
      // Estado de error en el login
      dispatch(categoriasHasError(true));
      // Se cancela el estado de envío
      dispatch(categoriasIsLoading(false));
  
      return;
    }
    else if(categoriaNueva.includes(",,,"))
    {
      Alert.alert("Aviso", "Por favor puto troll, introduce un nombre correcto.");
  
      // Estado de error en el login
      dispatch(categoriasHasError(true));
      // Se cancela el estado de envío
      dispatch(categoriasIsLoading(false));
  
      return;
    }

    fetch("https://thegreenways.es/modificarCategoriaComercio.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        categoriaVieja: categoriaVieja,
        categoriaNueva: categoriaNueva,
        nombreUsuario: nombreUsuario
      })
    })
      .then(res => res.json())
      .then(responseJson => {
        
        dispatch(categoriasIsLoading(false));

        if(!isNaN(responseJson))
        {
          dispatch(modificarPropsCategoria(categoriaVieja,categoriaNueva));
          dispatch(desplegarModificarComercio(""));
          dispatch(cambiarScroll(responseJson));
        }
        else if (responseJson === "categoriaExiste")
        {
          Alert.alert("Aviso", "Ya existe una categoria con ese nombre.");
        }
        else{
          Alert.alert("Aviso", responseJson);
        }
      })
      .catch(e => {
        dispatch(categoriasHasError(true));
      });      
  }
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

const desplegarModificarComercio = categoriaCatalogo =>{

  return {
    type: ActionTypes.CATEGORIA_CATEGORIA_CATALOGO,
    categoriaCatalogo: categoriaCatalogo
  };

};


const guardarCategoria = (categoria, nombreUsuario) => {

  return dispatch => {

    dispatch(categoriasIsLoading(true));

    // Campos vacios
    if (!categoria) {
      Alert.alert("Aviso", "Debes introducir el nombre de la categoria.");
  
      // Estado de error en el login
      dispatch(categoriasHasError(true));
      // Se cancela el estado de envío
      dispatch(categoriasIsLoading(false));
  
      return;
    }
    else if (categoria.length < 3)
    {
      Alert.alert("Aviso", "Debes introducir un nombre de categoria de al menos 3 digitos.");
  
      // Estado de error en el login
      dispatch(categoriasHasError(true));
      // Se cancela el estado de envío
      dispatch(categoriasIsLoading(false));
  
      return;
    }
    else if(categoria.includes(",,,"))
    {
      Alert.alert("Aviso", "Por favor puto troll, introduce un nombre correcto.");
  
      // Estado de error en el login
      dispatch(categoriasHasError(true));
      // Se cancela el estado de envío
      dispatch(categoriasIsLoading(false));
  
      return;
    }

    fetch("https://thegreenways.es/guardarCategoriaComercio.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        categoria: categoria,
        nombreUsuario: nombreUsuario
      })
    })
      .then(res => res.json())
      .then(responseJson => {

        dispatch(categoriasIsLoading(false));

        if(!isNaN(responseJson))
        {
          // Actions.refresh({ key: Math.random() });

          dispatch(agregarCategoria(categoria));
          dispatch(cambiarScroll(responseJson));
        }
        else if (responseJson === "categoriaExiste")
        {
          Alert.alert("Aviso", "Ya existe una categoria con ese nombre.");
        }
        else
        {
          Alert.alert("Aviso", responseJson);
        }


      })
      .catch(e => {
        //     console.warn(e);
        dispatch(categoriasHasError(true));
      });      
  }
};

const mensajeEliminarCategoria = (
  categoria,
  nombreUsuario,
) => {

  return dispatch => {

    Alert.alert(
      "Aviso",
      "¿Deseas eliminar la categoria " + categoria + "? (Todos los productos de esta categoria serán eliminados)",
      [
        {
          text: "Sí",
          onPress: () => {

          dispatch(categoriasIsLoading(true));
          
          fetch("https://thegreenways.es/eliminarCategoriaComercio.php", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              categoria: categoria,
              nombreUsuario: nombreUsuario
            })
          })
            .then(res => res.json())
            .then(responseJson => {
        
              dispatch(categoriasIsLoading(false));
        
                if(!isNaN(responseJson))
                {      
                  dispatch(quitarCategoria(categoria));
                  dispatch(cambiarScroll(responseJson));
                }
                else
                {
                  Alert.alert("Aviso", responseJson);
                }
            })
            .catch(e => {
              console.warn(e);
            })
          }
        },
        { text: "No", onPress: () => null }
      ],
      { cancelable: false }
    );
    return {
      type: ActionTypes.CATALOGO
    };

  }
};



export default {
  actualizarCategorias,
  agregarCategoria,
  modificarCategoria,
  guardarCategoria,
  cambiarCategoria,
  cambiarScroll,
  categoria,
  catalogoHasError,
  catalogoIsLoading,
  categoriasHasError,
  categoriasIsLoading,
  goInsertar,
  goEliminar,
  goCatalogo,
  goPrincipal,
  goCatalogoDetalles,
  mensajeEliminar,
  mensajeEliminarPagProducto,
  desplegarModificarComercio,
  modificarDetalle,
  modificarPagProducto,
  modificar,
  volverCatalogos,
  goGestionarCategoriasCatalogo,
  mensajeEliminarCategoria
};
