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

const denunciaHasError = bool => {
  return {
    type: ActionTypes.DENUNCIA_HAS_ERROR,
    hasError: bool
  };
};

const denunciaIsLoading = bool => {
  return {
    type: ActionTypes.DENUNCIA_IS_LOADING,
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

const guardarDenuncia = (
  nombreUsuario,
  nombreProducto,
  nombreComercio,
  categoriaDenuncia,
  motivoDenuncia,
  buscador
) => {
  return dispatch => {
    // Estado de envío activado
    dispatch(denunciaIsLoading(true));
    dispatch(denunciaHasError(false));
    dispatch(campoError(""));

    //let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // Validacion de datos introducidos.
    if (!categoriaDenuncia) {
      Alert.alert("Aviso", "Selecciona una categoria para la denuncia.");
      dispatch(campoError("categoriaDenuncia"));
      // Estado de error en el denuncia
      dispatch(denunciaHasError(true));
      // Se cancela el estado de envío
      dispatch(denunciaIsLoading(false));

      return;
    } else if (!motivoDenuncia) {
      Alert.alert("Aviso", "El motivo de la denuncia se encuentra vacío.");
      dispatch(campoError("motivoDenuncia"));
      // Estado de error en el denuncia
      dispatch(denunciaHasError(true));
      // Se cancela el estado de envío
      dispatch(denunciaIsLoading(false));

      return;
    } else if (motivoDenuncia.length < 5 || motivoDenuncia.length > 150) {
      Alert.alert(
        "Aviso",
        "El motivo de la denuncia debe tener entre 5 y 150 caracteres."
      );
      dispatch(campoError("motivoDenuncia"));
      // Estado de error en el denuncia
      dispatch(denunciaHasError(true));
      // Se cancela el estado de envío
      dispatch(denunciaIsLoading(false));

      return;
    }

    fetch("https://thegreenways.es/introDenuncia.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        motivoDenuncia: motivoDenuncia,
        categoriaDenuncia: categoriaDenuncia,
        nombreUsuario: nombreUsuario,
        nombreProducto: nombreProducto,
        nombreComercio: nombreComercio
      })
    })
      .then(res => res.json())
      .then(responseJson => {
        // Se cancela el estado de envío

        dispatch(denunciaIsLoading(false));

        if (responseJson == "subido") {
          Alert.alert(
            "Aviso",
            "Denuncia introducida correctamente."
          );

          AsyncStorage.setItem("nombreProducto", " ");
          AsyncStorage.setItem("nombreComercio", " ");

          if (buscador == "no") {
            nombreProducto == " "
              ? Actions.PagComercio()
              : Actions.PagProducto();
          } else {
            nombreProducto == " "
              ? Actions.PagComercioBuscador()
              : Actions.PagProductoBuscador();
          }
        } else {
          Alert.alert("Aviso", responseJson);
          dispatch(denunciaHasError(true));
        }
      })
      .catch(e => {
        // console.warn(e);
      });
  };
};

/*function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}*/

export default {
  denunciaHasError,
  denunciaIsLoading,
  campoError,
  noErrores,
  guardarDenuncia
};
