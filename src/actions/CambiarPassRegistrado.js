import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";
import { Alert } from "react-native";

/*const goPrincipal = () => {
  Actions.Main();
  return {
    type: ActionTypes.MAIN
  };
};*/

const cambiarPassRegistradoHasError = bool => {
  return {
    type: ActionTypes.CAMBIAR_PASS_REGISTRADO_HAS_ERROR,
    hasError: bool
  };
};

const cambiarPassRegistradoIsLoading = bool => {
  return {
    type: ActionTypes.CAMBIAR_PASS_REGISTRADO_IS_LOADING,
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

const cambiarPassRegistrado = (
  nombreLogeo,
  passUsuario,
  passNueva,
  passNueva2
) => {
  return dispatch => {
    // Estado de envío activado
    dispatch(cambiarPassRegistradoIsLoading(true));
    dispatch(cambiarPassRegistradoHasError(false));
    dispatch(campoError(""));

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // Validacion de datos introducidos.
    if (!passUsuario) {
      Alert.alert("Aviso", "La contraseña actual está vacía");
      dispatch(campoError("passwordVieja"));
      // Estado de error en la modificacion
      dispatch(cambiarPassRegistradoHasError(true));
      // Se cancela el estado de envío
      dispatch(cambiarPassRegistradoIsLoading(false));

      return;
    } else if (!passNueva) {
      Alert.alert("Aviso", "La contraseña nueva está vacía");
      dispatch(campoError("password"));
      // Estado de error en la modificacion
      dispatch(cambiarPassRegistradoHasError(true));
      // Se cancela el estado de envío
      dispatch(cambiarPassRegistradoIsLoading(false));

      return;
    } else if (!passNueva2) {
      Alert.alert("Aviso", "La repetición de contraseña está vacía");
      dispatch(campoError("password2"));
      // Estado de error en la modificacion
      dispatch(cambiarPassRegistradoHasError(true));
      // Se cancela el estado de envío
      dispatch(cambiarPassRegistradoIsLoading(false));

      return;
    } else if (passNueva != passNueva2) {
      Alert.alert("Aviso", "Las contraseñas nuevas introducidas no coinciden");
      dispatch(campoError("password2"));
      // Estado de error en el modificacion
      dispatch(cambiarPassRegistradoHasError(true));
      // Se cancela el estado de envío
      dispatch(cambiarPassRegistradoIsLoading(false));

      return;
    }

    var md5 = require("md5");

    fetch("https://thegreenways.es/login.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: nombreLogeo, password: md5(passUsuario) })
    })
      .then(res => res.json())
      .then(responseJson => {
        // Se cancela el estado de envío
        dispatch(cambiarPassRegistradoIsLoading(false));
        // console.log(res);
        if (responseJson == "ok") {
          cambiarPass2(nombreLogeo, passNueva);
        } else {
          Alert.alert("Aviso", "La contraseña introducida no es la correcta");
          // Estado de error en el la modificacion
          dispatch(campoError("passwordVieja"));
          dispatch(cambiarPassRegistradoHasError(true));

          return;
        }
      })
      .catch(e => {
        //     console.warn(e);
        dispatch(cambiarPassRegistradoHasError(true));
      });
  };
};

const cambiarPass2 = (nombreLogeo, passNueva) => {
  // Variable que importa funciones de la libreria de encriptación md5
  var md5 = require("md5");

  fetch("https://thegreenways.es/cambiarPassRegistrado.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombreLogeo: nombreLogeo,
      passNueva: md5(passNueva)
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      // Se cancela el estado de envío

      if (responseJson == "modificado") {
        Alert.alert("Aviso", "Contraseña modificada correctamente.");
        Actions.PerfilRegistrado();
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      // console.warn(e);

      dispatch(cambiarPassRegistradoHasError(true));
    });
};

export default {
  //goPrincipal,
  campoError,
  noErrores,
  cambiarPassRegistrado,
  cambiarPassRegistradoIsLoading,
  cambiarPassRegistradoHasError
};
