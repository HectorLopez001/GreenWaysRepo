import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";

import { Alert } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

const filaClickada = string => {
  return {
    type: ActionTypes.FILA_CLICKADA3,
    click: string
  };
};

const filaClickada2 = string => {
  return {
    type: ActionTypes.FILA_CLICKADA4,
    click: string
  };
};

const goPrincipal = () => {
  Actions.MainAdmin();
  return {
    type: ActionTypes.MAINADMIN,
    flicker: "MainAdmin"
  };
};

const goGestionFeedbacks = () => {
  Actions.GestionFeedbacks();
  return {
    type: ActionTypes.GESTION_FEEDBACKS,
    flicker: "GestionFeedbacks"
  };
};

const goGestionPerfilesUsuario = () => {
  Actions.GestionPerfilesUsuario();
  return {
    type: ActionTypes.GESTION_PERFILES_USUARIO,
    flicker: "GestionPerfilesUsuario"
  };
};

const volverInicio = () => {
  Actions.MainAdmin();
  return {
    type: ActionTypes.MAINADMIN,
    flicker: "MainAdmin"
  };
};

const goGestionUsuariosRegistrados3 = () => {
  Actions.GestionUsuariosRegistrados();
  return {
    type: ActionTypes.GESTION_USUARIOS_REGISTRADOS,
    flicker: "GestionUsuariosRegistrados"
  };
};


const goGestionUsuariosRegistrados = (clicsPantallaActual) => {
  fetch("https://thegreenways.es/comprobarPerfilesUsuarioRevisados.php", {
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
        Actions.GestionUsuariosRegistrados();
      } else {
        Alert.alert(
          "Aviso",
          "¿Has finalizado la revisión de todos los perfiles de usuario comprador?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            {
              text: "Sí",
              onPress: () => {
                revisadosPerfilesUsuario();
                Actions.GestionUsuariosRegistrados();
              }
            },
            {
              text: "No",
              onPress: () => {
                if (clicsPantallaActual) {
                  Actions.GestionUsuariosRegistrados();
                }
                else{
                  Actions.popTo("GestionUsuariosRegistrados")
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
    type: ActionTypes.GESTION_USUARIOS_REGISTRADOS,
    flicker: "GestionUsuariosRegistrados"
  };
};

const goGestionUsuariosRegistrados2 = (clicsPantallaActual) => {
  fetch("https://thegreenways.es/comprobarFeedbackRevisados.php", {
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
        Actions.GestionUsuariosRegistrados();
      } else {
        Alert.alert(
          "Aviso",
          "¿Has finalizado la revisión de todos las valoraciones?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            {
              text: "Sí",
              onPress: () => {
                revisadosFeedbacks();
                Actions.GestionUsuariosRegistrados();
              }
            },
            {
              text: "No",
              onPress: () => {
                if (clicsPantallaActual) {
                  Actions.GestionUsuariosRegistrados();
                }
                else{
                  Actions.popTo("GestionUsuariosRegistrados")
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
    type: ActionTypes.GESTION_USUARIOS_REGISTRADOS,
    flicker: "GestionUsuariosRegistrados"
  };
};

const perfilUsuarioRevisado = nombreUsuario => {
  fetch("https://thegreenways.es/revisadoPerfilUsuario.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombreUsuario: nombreUsuario
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
    type: ActionTypes.GESTION_PERFILES_USUARIO,
  };
};

const feedbackRevisado = idFeedback => {
  fetch("https://thegreenways.es/revisadoFeedback.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      idFeedback: idFeedback
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
    type: ActionTypes.GESTION_FEEDBACKS
  };
};

const revisadosPerfilesUsuario = () => {
  fetch("https://thegreenways.es/revisadosPerfilesUsuario.php", {
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
        Alert.alert(
          "Aviso",
          "Todos los perfiles de usuario han sido revisados."
        );
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      console.warn(e);
    });
};

const revisadosFeedbacks = () => {
  fetch("https://thegreenways.es/revisadosFeedbacks.php", {
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
        Alert.alert("Aviso", "Todos las valoraciones han sido revisadas.");
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      console.warn(e);
    });
};

const eliminarUsuarioRegistrado = (name, rowId, sceneProcedencia) => {
  fetch("https://thegreenways.es/eliminarUsuarioRegistrado.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      if (responseJson == "eliminado") {
        AsyncStorage.setItem("filaInicioPerfilUsuarioFinal", rowId.toString());

        if (sceneProcedencia == "listaUsuarios") {
          Actions.refresh({ key: Math.random() });
        } else {
          Actions.GestionPerfilesUsuario();
        }
        //Parche key: Math.random
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      console.warn(e);
    });
};

const eliminarUsuarioRegistradoDesdeFeedback = (
  idFeedback,
  name,
  rowId,
  sceneProcedencia
) => {
  fetch("https://thegreenways.es/eliminarUsuarioRegistrado2.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      if (responseJson != "Compruebe conexión a internet.") {
        var numeroFeedbacksUsuario = Object.keys(responseJson).length;

        var contador = 0;
        var i;
        for (i = 0; i < numeroFeedbacksUsuario; i++) {
          if (responseJson[i].idFeedback < idFeedback) {
            contador += 1;
          }
        }

        AsyncStorage.setItem(
          "filaInicioFeedbackFinal",
          (rowId - contador).toString()
        );

        if (sceneProcedencia === "listaFeedbacks") {
          Actions.refresh({ key: Math.random() });
        } else {
          Actions.GestionFeedbacks();
        }
        //Parche key: Math.random

        Alert.alert(
          "Aviso de confirmación",
          "Se ha borrado al usuario " + name + " y todas sus valoraciones."
        );
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      console.warn(e);
    });
};

function mensajeEliminar(name, rowID, sceneProcedencia) {
  Alert.alert(
    "Aviso",
    "¿Deseas eliminar " + name + "?",
    [
      {
        text: "Sí",
        onPress: () => eliminarUsuarioRegistrado(name, rowID, sceneProcedencia)
      },
      { text: "No", onPress: () => null }
    ],
    { cancelable: false }
  );
  return {
    type: ActionTypes.GESTION_PERFILES_USUARIO
  };
}

const eliminarFeedback = (idFeedback, rowId, sceneProcedencia) => {
  fetch("https://thegreenways.es/eliminarFeedback.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      idFeedback: idFeedback
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      if (responseJson == "eliminado") {
        AsyncStorage.setItem("filaInicioFeedbackFinal", rowId.toString());

        if (sceneProcedencia == "listaFeedbacks") {
          Actions.refresh({ key: Math.random() });
        } else {
          Actions.GestionFeedbacks();
        }
        //Parche key: Math.random

        /*   Alert.alert(
          "Aviso de confirmación",
          "Se ha borrado el producto " + nombreComercio
        );*/
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      console.warn(e);
    });
};

function mensajeEliminar2(
  nombreAEliminar,
  idFeedback,
  rowID,
  sceneProcedencia
) {
  Alert.alert(
    "Aviso",
    "¿Deseas eliminar esta valoración sobre " + nombreAEliminar + "?",
    [
      {
        text: "Sí",
        onPress: () => eliminarFeedback(idFeedback, rowID, sceneProcedencia)
      },
      { text: "No", onPress: () => null }
    ],
    { cancelable: false }
  );
  return {
    type: ActionTypes.GESTION_FEEDBACKS
  };
}

function mensajeEliminarUsuarioDesdeFeedback(
  idFeedback,
  name,
  rowID,
  sceneProcedencia
) {
  Alert.alert(
    "Aviso",
    "¿Deseas eliminar " + name + "?",
    [
      {
        text: "Sí",
        onPress: () =>
          eliminarUsuarioRegistradoDesdeFeedback(
            idFeedback,
            name,
            rowID,
            sceneProcedencia
          )
      },
      { text: "No", onPress: () => null }
    ],
    { cancelable: false }
  );
  return {
    type: ActionTypes.GESTION_PERFILES_USUARIO
  };
}

function mensajeEliminar0bis(
  nombreAEliminar,
  idFeedback,
  nombreUsuario,
  rowID,
  sceneProcedencia
) {
  Alert.alert(
    "Aviso",
    "¿Deseas eliminar la valoración o al usuario-comprador?",
    [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      {
        text: "Eliminar usuario-comprador",
        onPress: () =>
          mensajeEliminarUsuarioDesdeFeedback(
            idFeedback,
            nombreUsuario,
            rowID,
            sceneProcedencia
          )
      },
      {
        text: "Eliminar valoración",
        onPress: () =>
          mensajeEliminar2(nombreAEliminar, idFeedback, rowID, sceneProcedencia)
      }
    ],
    { cancelable: false }
  );
  return {
    type: ActionTypes.GESTION_FEEDBACKS
  };
}

function mensajeEliminar0(
  nombreAEliminar,
  idFeedback,
  nombreUsuario,
  rowID,
  sceneProcedencia
) {
  Alert.alert(
    "Aviso",
    "¿Deseas eliminar la valoración o al usuario-comprador?",
    [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      {
        text: "Eliminar usuario-comprador",
        onPress: () =>
          mensajeEliminarUsuarioDesdeFeedback(
            idFeedback,
            nombreUsuario,
            rowID,
            sceneProcedencia
          )
      },
      {
        text: "Eliminar valoración",
        onPress: () =>
          mensajeEliminar2(nombreAEliminar, idFeedback, rowID, sceneProcedencia)
      }
    ],
    { cancelable: false }
  );
  return {
    type: ActionTypes.GESTION_FEEDBACKS
  };
}

const clickado = nombreUsuario => {
  return dispatch => {
    dispatch(filaClickada(nombreUsuario));
  };
};

const clickado2 = idFeedback => {
  return dispatch => {
    dispatch(filaClickada2(idFeedback));
  };
};

export default {
  goPrincipal,
  goGestionFeedbacks,
  goGestionPerfilesUsuario,
  goGestionUsuariosRegistrados,
  goGestionUsuariosRegistrados2,
  goGestionUsuariosRegistrados3,
  mensajeEliminar,
  mensajeEliminar2,
  mensajeEliminar0,
  eliminarUsuarioRegistrado,
  clickado,
  clickado2,
  perfilUsuarioRevisado,
  feedbackRevisado,
  revisadosPerfilesUsuario,
  mensajeEliminar0bis,
  volverInicio
};
