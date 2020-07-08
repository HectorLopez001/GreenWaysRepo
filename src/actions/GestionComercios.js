import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";

import { Alert } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

const filaClickada = string => {
  return {
    type: ActionTypes.FILA_CLICKADA,
    click: string
  };
};

const filaClickada2 = string => {
  return {
    type: ActionTypes.FILA_CLICKADA2,
    click: string
  };
};

const filaClickada3 = string => {
  return {
    type: ActionTypes.FILA_CLICKADA5,
    click: string
  };
};

const goPrincipal = () => {
  Actions.MainAdmin();
  return {
    type: ActionTypes.MAINADMIN,
    // flicker: "MainAdmin"
  };
};

const goGestionDenuncias = () => {
  Actions.GestionDenuncias();
  return {
    type: ActionTypes.GESTION_DENUNCIAS,
    // flicker: "GestionDenuncias"
  };
};

const goGestionPagComercio = () => {
  Actions.GestionPagComercio();
  return {
    type: ActionTypes.GESTION_PAG_COMERCIO,
    // flicker: "GestionPagComercio"
  };
};

const goGestionCatalogoProductos = () => {
  Actions.GestionCatalogoProductos();
  return {
    type: ActionTypes.GESTION_CATALOGO_PRODUCTOS,
    // flicker: "GestionCatalogoProductos"
  };
};

const goCatalogoProductosAdmin = () => {
  Actions.CatalogoProductosAdmin();
  return {
    type: ActionTypes.CATALOGO_PRODUCTOS_ADMIN,
    // flicker: "CatalogoProductosAdmin"
  };
};

const volverInicio = () => {
  Actions.MainAdmin();
  return {
    type: ActionTypes.MAINADMIN,
    // flicker: "MainAdmin"
  };
};

const goGestionComercios = (clicsPantallaActual) => {
  fetch("https://thegreenways.es/comprobarHomeComerciosRevisados.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson == "Revisado") {
        Actions.GestionComercios();
      } else {
        Alert.alert(
          "Aviso",
          "¿Has finalizado la revisión de todos los home de comercios?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            {
              text: "Sí",
              onPress: () => {
                revisadosHomeComercios();
                Actions.GestionComercios();
              }
            },
            {
              text: "No",
              onPress: () => {
                if (clicsPantallaActual) {
                  Actions.GestionComercios();
                }
                else{
                  Actions.popTo("GestionComercios")
                }
              }
            }
          ],
          { cancelable: false }
        );
      }
    })
    .catch(error => {
      console.error(error);
    });

  return {
    type: ActionTypes.GESTION_COMERCIOS,
    // flicker: "GestionComercios"
  };
};

const goGestionComercios2 = () => {
  Actions.GestionComercios();
  return {
    type: ActionTypes.GESTION_COMERCIOS,
    // flicker: "GestionComercios"
  };
};

const goGestionComercios3 = (clicsPantallaActual) => {
  fetch("https://thegreenways.es/comprobarDenunciasRevisadas.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson == "Revisado") {
        Actions.GestionComercios();
      } else {
        Alert.alert(
          "Aviso",
          "¿Has finalizado la revisión de todas las denuncias?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            {
              text: "Sí",
              onPress: () => {
                revisadasDenuncias();
                Actions.GestionComercios();
              }
            },
            {
              text: "No",
              onPress: () => {
                if (clicsPantallaActual) {
                  Actions.GestionComercios();
                }
                else{
                  Actions.popTo("GestionComercios")
                }
              }
            }
          ],
          { cancelable: false }
        );
      }
    })
    .catch(error => {
      console.error(error);
    });
  return {
    type: ActionTypes.GESTION_COMERCIOS,
    // flicker: "GestionComercios"
  };
};

const revisadasDenuncias = () => {
  fetch("https://thegreenways.es/revisadasDenuncias.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  })
    .then(res => res.json())
    .then(responseJson => {
      if (responseJson == "revisado") {
        Alert.alert("Aviso", "Todas las denuncias han sido revisadas.");
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      console.warn(e);
    });
};

const volverCatalogo = revisar => {
  //if (revisar == "0") {
  //  Actions.CatalogoProductosAdmin();
  //} else {
  Actions.pop();
  //}

  return {
    type: ActionTypes.CATALOGO_PRODUCTOS_ADMIN
  };
};

// const goCatalogoProductosAdmin = () => {
//   Actions.CatalogoProductosAdmin();
//   return {
//     type: ActionTypes.CATALOGO_PRODUCTOS_ADMIN
//   };
// };

const volverGestionCatalogoProductos = (
  nombreComercio,
  idComercio,
  coordenadaListView,
  clicsPantallaActual
) => {
  fetch("https://thegreenways.es/comprobarCatalogoRevisado.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombreComercio: nombreComercio
    })
  })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson == "Revisado") {
        revisadosProductos(nombreComercio, idComercio);
        AsyncStorage.setItem("filaInicioFinal", coordenadaListView.toString());

        Actions.GestionCatalogoProductos();
      } else {
        Alert.alert(
          "Aviso",
          "¿Has finalizado la revisión del comercio " + nombreComercio + "?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            {
              text: "Sí",
              onPress: () => {
                revisadosProductos(nombreComercio, idComercio);
                AsyncStorage.setItem(
                  "filaInicioFinal",
                  coordenadaListView.toString()
                );
                Actions.GestionCatalogoProductos();
                //  filaClickada(nombreComercio);
              }
            },
            {
              text: "No",
              onPress: () => {
                AsyncStorage.setItem(
                  "filaInicioFinal",
                  coordenadaListView.toString()
                );

                if (clicsPantallaActual) {
                  Actions.GestionCatalogoProductos();
                }
                else{
                  Actions.popTo("GestionCatalogoProductos")
                }
              }
            }
          ],
          { cancelable: false }
        );
      }
    })
    .catch(error => {
      console.error(error);
    });

  return {
    type: ActionTypes.GESTION_CATALOGO_PRODUCTOS
  };
};

const productoRevisado = (nombreProducto, nombreComercio) => {
  fetch("https://thegreenways.es/revisadoProducto.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombreProducto: nombreProducto,
      nombreComercio: nombreComercio
    })
  })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson == "revisado") {
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(error => {
      console.error(error);
    });
  return {
    type: ActionTypes.CATALOGO_PRODUCTOS_ADMIN
  };
};

const revisadosProductos = (nombreComercio, idComercio) => {
  fetch("https://thegreenways.es/revisadoCatalogo.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      idComercio: idComercio
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      if (responseJson == "revisado") {
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      console.warn(e);
    });
};

const comercioRevisado = nombreComercio => {
  fetch("https://thegreenways.es/revisadoComercio.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombreComercio: nombreComercio
    })
  })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson == "revisado") {
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(error => {
      console.error(error);
    });
  return {
    type: ActionTypes.GESTION_PAG_COMERCIO
  };
};

const revisadosHomeComercios = () => {
  fetch("https://thegreenways.es/revisadosComercios.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  })
    .then(res => res.json())
    .then(responseJson => {
      if (responseJson == "revisado") {
        Alert.alert("Aviso", "Todos los home de comercios han sido revisados.");
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      console.warn(e);
    });
};

const denunciaRevisada = idDenuncia => {
  fetch("https://thegreenways.es/revisadaDenuncia.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      idDenuncia: idDenuncia
    })
  })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson == "revisado") {
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(error => {
      console.error(error);
    });
  return {
    type: ActionTypes.GESTION_DENUNCIAS
  };
};

const eliminarComercio = (nombreComercio, rowId, sceneProcedencia) => {
  fetch("https://thegreenways.es/eliminarComercio.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombreComercio: nombreComercio
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      if (responseJson == "eliminado") {
        if (sceneProcedencia == "listaComercios") {
          AsyncStorage.setItem("filaInicioPagComercioFinal", rowId.toString());
          Actions.refresh({ key: Math.random() });
        } else if (sceneProcedencia == "pagComercio") {
          AsyncStorage.setItem("filaInicioPagComercioFinal", rowId.toString());
          Actions.GestionPagComercio();
        } else if (
          sceneProcedencia == "catalogoProductosAdmin" ||
          sceneProcedencia == "PagProductosAdmin"
        ) {
          AsyncStorage.setItem("filaInicioFinal", rowId.toString());
          Actions.GestionCatalogoProductos();
        }

        //Parche key: Math.random

        /*  Alert.alert(
          "Aviso",
          "Se ha borrado el comercio " + nombreComercio
        );*/
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      console.warn(e);
    });
};

const eliminarComercioDenuncia = (
  idDenuncia,
  nombreAEliminar,
  sceneProcedencia,
  rowNumber
) => {
  fetch("https://thegreenways.es/eliminarComercio2.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombreAEliminar: nombreAEliminar
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      if (responseJson != "Compruebe conexión a internet.") {
        var numeroDenunciasTotalesAlComercio = Object.keys(responseJson).length;

        var contador2 = 0;
        var i;
        for (i = 0; i < numeroDenunciasTotalesAlComercio; i++) {
          if (responseJson[i].idDenuncia < idDenuncia) {
            contador2 += 1;
          }
        }

        AsyncStorage.setItem(
          "filaInicioDenunciaFinal",
          (rowNumber - contador2).toString()
        );

        if (sceneProcedencia == "listaDenuncias") {
          Actions.refresh({ key: Math.random() });
        } else {
          Actions.GestionDenuncias();
        }

        Alert.alert(
          "Aviso de confirmación",
          "Se ha borrado el comercio " +
            nombreAEliminar +
            " y todas sus denuncias."
        );
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      console.warn(e);
    });
};

const eliminarProducto = (nombreComercio, nombreProducto, rowNumber) => {
  fetch("https://thegreenways.es/eliminarProductoAdmin.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombreComercio: nombreComercio,
      nombreProducto: nombreProducto
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      if (responseJson == "eliminado") {
        AsyncStorage.setItem("filaInicioPagActualFinal", rowNumber.toString());

        Actions.refresh({ key: Math.random() });
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      console.warn(e);
    });
};

const eliminarDenuncia = (idDenuncia, rowNumber, sceneProcedencia) => {
  fetch("https://thegreenways.es/eliminarDenuncia.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      idDenuncia: idDenuncia
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      if (responseJson == "eliminado") {
        AsyncStorage.setItem("filaInicioDenunciaFinal", rowNumber.toString());

        if (sceneProcedencia == "listaDenuncias") {
          Actions.refresh({ key: Math.random() });
        } else {
          Actions.GestionDenuncias();
        }
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      console.warn(e);
    });
};

const eliminarProductoDenuncia = (
  idDenuncia,
  nombreAEliminar,
  nombreComercio,
  sceneProcedencia,
  rowNumber
) => {
  fetch("https://thegreenways.es/eliminarProductoAdmin2.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombreComercio: nombreComercio,
      nombreProducto: nombreAEliminar
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      if (responseJson != "Compruebe conexión a internet.") {
        var numeroDenunciasAlProducto = Object.keys(responseJson).length;

        var contador3 = 0;
        var i;
        for (i = 0; i < numeroDenunciasAlProducto; i++) {
          if (responseJson[i].idDenuncia < idDenuncia) {
            contador3 += 1;
          }
        }

        AsyncStorage.setItem(
          "filaInicioDenunciaFinal",
          (rowNumber - contador3).toString()
        );

        if (sceneProcedencia == "listaDenuncias") {
          Actions.refresh({ key: Math.random() });
        } else if (sceneProcedencia == "pagDenuncia") {
          Actions.GestionDenuncias();
        }

        Alert.alert(
          "Aviso de confirmación",
          "Se ha borrado el producto " +
            nombreAEliminar +
            " y todas sus denuncias."
        );
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      console.warn(e);
    });
};

const eliminarProductoPagProducto = (
  nombreComercio,
  nombreProducto,
  rowNumber
) => {
  fetch("https://thegreenways.es/eliminarProductoAdmin.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombreComercio: nombreComercio,
      nombreProducto: nombreProducto
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      if (responseJson == "eliminado") {
        AsyncStorage.setItem("filaInicioPagActualFinal", rowNumber.toString());

        Actions.CatalogoProductosAdmin();
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      console.warn(e);
    });
};

function mensajeEliminar(nombreComercio, rowID, sceneProcedencia) {
  Alert.alert(
    "Aviso",
    "¿Deseas eliminar el comercio " + nombreComercio + "?",
    [
      {
        text: "Sí",
        onPress: () => eliminarComercio(nombreComercio, rowID, sceneProcedencia)
      },
      { text: "No", onPress: () => null }
    ],
    { cancelable: false }
  );
  return {
    type: ActionTypes.GESTION_PAG_COMERCIO
  };
}

function mensajeEliminar2(nombreComercio, nombreProducto, rowNumber) {
  Alert.alert(
    "Aviso",
    "¿Deseas eliminar el producto " + nombreProducto + "?",
    [
      {
        text: "Sí",
        onPress: () =>
          eliminarProducto(nombreComercio, nombreProducto, rowNumber)
      },
      { text: "No", onPress: () => null }
    ],
    { cancelable: false }
  );
  return {
    type: ActionTypes.GESTION_PAG_COMERCIO
  };
}

function mensajeEliminar3(
  nombreAEliminar,
  comercioOProducto,
  nombreComercio,
  idDenuncia,
  nombreUsuario,
  rowNumber,
  sceneProcedencia
) {
  if (comercioOProducto == "producto") {
    Alert.alert(
      "Aviso",
      "¿Deseas eliminar el producto " + nombreAEliminar + " o la denuncia?",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        {
          text: "Eliminar producto",
          onPress: () =>
            Alert.alert(
              "Aviso",
              "¿Deseas eliminar el producto " + nombreAEliminar + "?",
              [
                {
                  text: "Si",
                  onPress: () =>
                    eliminarProductoDenuncia(
                      idDenuncia,
                      nombreAEliminar,
                      nombreComercio,
                      sceneProcedencia,
                      rowNumber
                    )
                },
                { text: "No", onPress: () => null }
              ],
              { cancelable: false }
            )
        },
        {
          text: "Eliminar denuncia",
          onPress: () =>
            Alert.alert(
              "Aviso",
              "¿Deseas eliminar la denuncia hecha al producto " +
                nombreAEliminar +
                "?",
              [
                {
                  text: "Si",
                  onPress: () =>
                    eliminarDenuncia(idDenuncia, rowNumber, sceneProcedencia)
                },
                { text: "No", onPress: () => null }
              ],
              { cancelable: false }
            )
        }
      ],
      { cancelable: false }
    );
  } else {
    Alert.alert(
      "Aviso",
      "¿Deseas eliminar el comercio " + nombreAEliminar + " o la denuncia?",
      [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        {
          text: "Eliminar comercio",
          onPress: () =>
            Alert.alert(
              "Aviso",
              "¿Deseas eliminar el comercio " + nombreAEliminar + "?",
              [
                {
                  text: "Si",
                  onPress: () => eliminarComercioDenuncia(idDenuncia)
                },
                { text: "No", onPress: () => null }
              ],
              { cancelable: false }
            )
        },
        {
          text: "Eliminar denuncia",
          onPress: () =>
            Alert.alert(
              "Aviso",
              "¿Deseas eliminar la denuncia hecha al comercio " +
                nombreAEliminar +
                "?",
              [
                {
                  text: "Si",
                  onPress: () =>
                    eliminarDenuncia(idDenuncia, rowNumber, sceneProcedencia)
                },
                { text: "No", onPress: () => null }
              ],
              { cancelable: false }
            )
        }
      ],
      { cancelable: false }
    );
  }

  return {
    type: ActionTypes.GESTION_DENUNCIAS
  };
}

function mensajeEliminarPagProducto(nombreComercio, nombreProducto, rowNumber) {
  Alert.alert(
    "Aviso",
    "¿Deseas eliminar el producto " + nombreProducto + "?",
    [
      {
        text: "Sí",
        onPress: () =>
          eliminarProductoPagProducto(nombreComercio, nombreProducto, rowNumber)
      },
      { text: "No", onPress: () => null }
    ],
    { cancelable: false }
  );
  return {
    type: ActionTypes.GESTION_PAG_COMERCIO
  };
}

const clickado = nombreProducto => {
  return dispatch => {
    dispatch(filaClickada(nombreProducto));
  };
};

const clickado2 = nombreComercio => {
  return dispatch => {
    dispatch(filaClickada2(nombreComercio));
  };
};

const clickado3 = idDenuncia => {
  return dispatch => {
    dispatch(filaClickada3(idDenuncia));
  };
};

export default {
  goPrincipal,
  goGestionPagComercio,
  goGestionCatalogoProductos,
  goGestionComercios,
  goGestionComercios2,
  goGestionComercios3,
  goGestionDenuncias,
  mensajeEliminar,
  mensajeEliminar2,
  mensajeEliminar3,
  eliminarComercio,
  volverCatalogo,
  goCatalogoProductosAdmin,
  volverGestionCatalogoProductos,
  revisadosProductos,
  revisadasDenuncias,
  productoRevisado,
  denunciaRevisada,
  clickado,
  clickado2,
  clickado3,
  filaClickada,
  filaClickada2,
  comercioRevisado,
  revisadosHomeComercios,
  mensajeEliminarPagProducto,
  eliminarProductoPagProducto,
  eliminarDenuncia,
  goCatalogoProductosAdmin,
  volverInicio
};
