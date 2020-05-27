import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from "react-native";

/*const isLogged = (bool) => {
    return {
        type: ActionTypes.IS_LOGGED,
        isLogged: bool
    }
};  */

const feedbackHasError = bool => {
  return {
    type: ActionTypes.FEEDBACK_HAS_ERROR,
    hasError: bool
  };
};

const feedbackIsLoading = bool => {
  return {
    type: ActionTypes.FEEDBACK_IS_LOADING,
    isLoading: bool
  };
};

const campoError = string => {
  return {
    type: ActionTypes.CAMPO_ERROR,
    campoError: string
  };
};

const noErrores = () => {
  return {
    type: ActionTypes.NO_ERROR
  };
};

const guardarFeedback = (
  nombreUsuario,
  nombreProducto,
  nombreComercio,
  nota,
  titulo,
  comentario,
  buscador
) => {
  return dispatch => {
    // Estado de envío activado
    dispatch(feedbackIsLoading(true));
    dispatch(feedbackHasError(false));
    dispatch(campoError(""));

    //let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // Validacion de datos introducidos.
    if (!titulo) {
      Alert.alert("Aviso", "El título se encuentra vacío");
      dispatch(campoError("titulo"));
      // Estado de error en el feedback
      dispatch(feedbackHasError(true));
      // Se cancela el estado de envío
      dispatch(feedbackIsLoading(false));

      return;
    } else if (!comentario) {
      Alert.alert("Aviso", "El comentario se encuentra vacío");
      dispatch(campoError("comentario"));
      // Estado de error en el feedback
      dispatch(feedbackHasError(true));
      // Se cancela el estado de envío
      dispatch(feedbackIsLoading(false));

      return;
    } else if (titulo.length < 3 || titulo.length > 30) {
      Alert.alert("Aviso", "El título debe tener entre 3 y 30 caracteres");
      dispatch(campoError("titulo"));
      // Estado de error en el feedback
      dispatch(feedbackHasError(true));
      // Se cancela el estado de envío
      dispatch(feedbackIsLoading(false));

      return;
    } else if (comentario.length < 3 || comentario.length > 150) {
      Alert.alert("Aviso", "El comentario debe tener entre 3 y 150 caracteres");
      dispatch(campoError("comentario"));
      // Estado de error en el feedback
      dispatch(feedbackHasError(true));
      // Se cancela el estado de envío
      dispatch(feedbackIsLoading(false));

      return;
    }

    if (
      nota != 0.5 &&
      nota != 1 &&
      nota != 1.5 &&
      nota != 2 &&
      nota != 3 &&
      nota != 3.5 &&
      nota != 4 &&
      nota != 4.5 &&
      nota != 5
    ) {
      nota = 2.5;
    }

    fetch("https://thegreenways.es/comprobarPrimerFeedbackSubido.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombreUsuario: nombreUsuario
      })
    })
      .then(res => res.json())
      .then(responseJson => {
        // Se cancela el estado de envío

        dispatch(feedbackIsLoading(false));

        if (responseJson == "primero") {
          guardarFeedback2(
            nombreUsuario,
            nombreProducto,
            nombreComercio,
            nota,
            titulo,
            comentario,
            "0",
            buscador
          );
        } else if (responseJson == "noPrimero") {
          guardarFeedback2(
            nombreUsuario,
            nombreProducto,
            nombreComercio,
            nota,
            titulo,
            comentario,
            "1",
            buscador
          );
        } else {
          //dispatch(campoError("nombre"));
          Alert.alert("Aviso", responseJson);
          dispatch(feedbackHasError(true));

          return;
        }
      })
      .catch(e => {
        // console.warn(e);

        dispatch(feedbackHasError(true));
      });
  };
};

const guardarFeedback2 = (
  nombreUsuario,
  nombreProducto,
  nombreComercio,
  nota,
  titulo,
  comentario,
  primerFeedback,
  buscador
) => {
  fetch("https://thegreenways.es/introFeedback.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nota: nota,
      titulo: titulo,
      comentario: comentario,
      nombreUsuario: nombreUsuario,
      nombreProducto: nombreProducto,
      nombreComercio: nombreComercio,
      primerFeedback: primerFeedback
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      // Se cancela el estado de envío

      //   dispatch(feedbackIsLoading(false));

      if (responseJson == "subido") {
        Alert.alert("Aviso", "Feedback introducido correctamente.");

        AsyncStorage.setItem("nombreProducto", " ");
        AsyncStorage.setItem("nombreComercio", " ");

        if (buscador == "no") {
          nombreProducto == " " ? Actions.PagComercio() : Actions.PagProducto();
        } else {
          nombreProducto == " "
            ? Actions.PagComercioBuscador()
            : Actions.PagProductoBuscador();
        }
      } else {
        Alert.alert("Aviso", responseJson);
        dispatch(feedbackHasError(true));
      }
    })
    .catch(e => {
      // console.warn(e);
    });
};

/*function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}*/

export default {
  feedbackHasError,
  feedbackIsLoading,
  campoError,
  noErrores,
  guardarFeedback
};
