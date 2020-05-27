import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

const isLogged = bool => {
  return {
    type: ActionTypes.IS_LOGGED,
    isLogged: bool
  };
};

const loginHasError = bool => {
  return {
    type: ActionTypes.LOGIN_HAS_ERROR,
    hasError: bool
  };
};

const loginIsLoading = bool => {
  return {
    type: ActionTypes.LOGIN_IS_LOADING,
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

const login = (username, password) => {
  // console.log('user', username);
  // console.log('pass', password);
  return dispatch => {
    // Estado de envío activado
    dispatch(loginIsLoading(true));

    // Campos vacios
    if (!username) {
      Alert.alert("Aviso", "Debe introducir su nombre de usuario o email.");
      dispatch(campoError("nombre"));
      // Estado de error en el login
      dispatch(loginHasError(true));
      // Se cancela el estado de envío
      dispatch(loginIsLoading(false));

      return;
    } else if (!password) {
      Alert.alert("Aviso", "Debe introducir la contraseña de la cuenta.");
      dispatch(campoError("pass"));
      // Estado de error en el login
      dispatch(loginHasError(true));
      // Se cancela el estado de envío
      dispatch(loginIsLoading(false));

      return;
    } else if (username.length < 3) {
      Alert.alert(
        "Aviso",
        "El nombre de usuario debe tener al menos 3 caracteres."
      );
      dispatch(campoError("nombre"));
      // Estado de error en el register
      dispatch(loginHasError(true));
      // Se cancela el estado de envío
      dispatch(loginIsLoading(false));

      return;
    } else if (password.length < 3) {
      Alert.alert("Aviso", "La contraseña debe tener al menos 3 caracteres.");
      dispatch(campoError("pass"));
      // Estado de error en el register
      dispatch(loginHasError(true));
      // Se cancela el estado de envío
      dispatch(loginIsLoading(false));

      return;
    }

    // Variable que importa funciones de la libreria de encriptación md5
    var md5 = require("md5");

    fetch("https://thegreenways.es/login.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: username, password: md5(password) })
    })
      .then(res => res.json())
      .then(responseJson => {
        // Se cancela el estado de envío
        dispatch(loginIsLoading(false));
        // console.log(res);
        if (responseJson == "ok") {
          dispatch(loginHasError(false));
          //   dispatch(isLogged(true));
          AsyncStorage.setItem("token", "registrado");
          AsyncStorage.setItem("name", username);
          Actions.Main();
        } else {
          if (responseJson == "ok vendedor") {
            dispatch(loginHasError(false));
            //   dispatch(isLogged(true));
            AsyncStorage.setItem("token", "vendedor");
            AsyncStorage.setItem("name", username);
            Actions.MainVendedor();
          } else {
            if (responseJson == "ok admin") {
              dispatch(loginHasError(false));
              //  dispatch(isLogged(true));
              AsyncStorage.setItem("token", "admin");
              AsyncStorage.setItem("name", username);
              Actions.MainAdmin();
            } else {
              Alert.alert(
                "Aviso ",
                "El nombre de usuario y/o la contraseña no existen. "
              );
            }
          }
        }
      })
      .catch(e => {
        //     console.warn(e);

        dispatch(loginHasError(true));
      });
  };
};

const logout = () => {
  AsyncStorage.removeItem("token");
  AsyncStorage.removeItem("name");
  AsyncStorage.removeItem("comercio");

  // Actions.Login();
  Actions.Login();
  // Actions.pop();
  return {
    type: ActionTypes.LOGOUT
  };
};

const goRegister = () => {
  Actions.Register();
  return {
    type: ActionTypes.REGISTER
  };
};

const goRegisterVendedor = () => {
  Actions.RegisterVendedor();
  return {
    type: ActionTypes.REGISTER
  };
};

/*const noErrores = () => {
  return {
    type: ActionTypes.NO_ERROR
  };
};*/

export default {
  isLogged,
  loginHasError,
  loginIsLoading,
  goRegister,
  goRegisterVendedor,
  login,
  logout,
  campoError,
  noErrores
};
