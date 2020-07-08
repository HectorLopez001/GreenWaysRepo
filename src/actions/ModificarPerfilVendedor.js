import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';


const modificarPerfilVendedorHasError = bool => {
  return {
    type: ActionTypes.MODIFICARPERFILVENDEDOR_HAS_ERROR,
    hasError: bool
  };
};

const modificarPerfilVendedorIsLoading = bool => {
  return {
    type: ActionTypes.MODIFICARPERFILVENDEDOR_IS_LOADING,
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

const modificarPerfilVendedor = (
  nombreLogeo,
  idUsuario,
  username,
  password,
  email,
  datosCambiados
) => {
  return dispatch => {
    // Estado de envío activado
    dispatch(modificarPerfilVendedorIsLoading(true));
    dispatch(modificarPerfilVendedorHasError(false));
    dispatch(campoError(""));

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // Validacion de datos introducidos.
    if (!username) {
      Alert.alert("Aviso", "El nombre de usuario se encuentra vacío");
      dispatch(campoError("nombre"));
      // Estado de error en la modificacion
      dispatch(modificarPerfilVendedorHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarPerfilVendedorIsLoading(false));

      return;
    } else if (!email) {
      Alert.alert("Aviso", "El email se encuentra vacío");
      dispatch(campoError("email"));
      // Estado de error en la modificacion
      dispatch(modificarPerfilVendedorHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarPerfilVendedorIsLoading(false));

      return;
    } else if (username.length < 3) {
      Alert.alert(
        "Aviso",
        "El nombre de usuario debe tener al menos 3 caracteres"
      );
      dispatch(campoError("nombre"));
      // Estado de error en el la modificacion
      dispatch(modificarPerfilVendedorHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarPerfilVendedorIsLoading(false));

      return;
    } else if (reg.test(email) === false) {
      Alert.alert("Aviso", "Por favor introduce un email válido");
      dispatch(campoError("email"));
      // Estado de error en el la modificacion
      dispatch(modificarPerfilVendedorHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarPerfilVendedorIsLoading(false));

      return;
    }

    if (datosCambiados != "no") {
      if (!password) {
        Alert.alert(
          "Aviso",
          "Debe insertar la contraseña de la cuenta para esta operación"
        );
        dispatch(campoError("password"));
        // Estado de error en la modificacion
        dispatch(modificarPerfilVendedorHasError(true));
        // Se cancela el estado de envío
        dispatch(modificarPerfilVendedorIsLoading(false));

        return;
      } else {
        var md5 = require("md5");

        fetch("https://thegreenways.es/login.php", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name: nombreLogeo, password: md5(password) })
        })
          .then(res => res.json())
          .then(responseJson => {
            // Se cancela el estado de envío
            dispatch(modificarPerfilVendedorIsLoading(false));
            // console.log(res);
            if (responseJson == "ok vendedor") {
              fetch("https://thegreenways.es/comprobarNombreUsuarioLibre.php", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  idUsuario: idUsuario,
                  username: username,
                  email: email
                })
              })
                .then(res => res.json())
                .then(responseJson => {
                  // Se cancela el estado de envío

                  if (responseJson == "libre") {
                    modificarPerfil3(
                      nombreLogeo,
                      idUsuario,
                      username,
                      password,
                      email
                    );
                  } else {
                    if (responseJson == "El email no está disponible.") {
                      dispatch(campoError("email"));
                      Alert.alert("Aviso", responseJson);

                      dispatch(modificarPerfilVendedorHasError(true));

                      return;
                    } else {
                      dispatch(campoError("nombre"));
                      Alert.alert("Aviso", responseJson);

                      dispatch(modificarPerfilVendedorHasError(true));

                      return;
                    }
                  }
                })
                .catch(e => {
                  // console.warn(e);
                  //dispatch(modificarPerfilVendedorHasError(true));
                });
            } else {
              Alert.alert(
                "Aviso",
                "La contraseña introducida no es la correcta"
              );
              dispatch(campoError("password"));
              // Estado de error en el la modificacion
              dispatch(modificarPerfilVendedorHasError(true));

              return;
            }
          })
          .catch(e => {
            //     console.warn(e);
            dispatch(modificarPerfilVendedorHasError(true));
          });
      }
    } else {
      dispatch(modificarPerfilVendedorIsLoading(false));
      fetch("https://thegreenways.es/comprobarNombreUsuarioLibre.php", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idUsuario: idUsuario,
          username: username,
          email: email
        })
      })
        .then(res => res.json())
        .then(responseJson => {
          // Se cancela el estado de envío

          if (responseJson == "libre") {
            modificarPerfil3(nombreLogeo, idUsuario, username, password, email);
          } else {
            Alert.alert("Aviso", responseJson);
            dispatch(modificarPerfilVendedorHasError(true));

            return;
          }
        })
        .catch(e => {
          // console.warn(e);

          dispatch(modificarPerfilVendedorHasError(true));
        });
    }
  };
};

// const modificarPerfil2 = (
//   nombreLogeo,
//   idUsuario,
//   username,
//   password,
//   email
// ) => {
//   fetch("https://thegreenways.es/comprobarNombreUsuarioLibre.php", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       idUsuario: idUsuario,
//       username: username,
//       email: email
//     })
//   })
//     .then(res => res.json())
//     .then(responseJson => {
//       // Se cancela el estado de envío

//       if (responseJson == "libre") {
//         modificarPerfil3(nombreLogeo, idUsuario, username, password, email);
//       } else {
//         Alert.alert("Aviso", responseJson);
//         dispatch(modificarPerfilVendedorHasError(true));

//         return;
//       }
//     })
//     .catch(e => {
//       // console.warn(e);

//       dispatch(modificarPerfilVendedorHasError(true));
//     });

//   // Variable que importa funciones de la libreria de encriptación md5
// };

const modificarPerfil3 = (
  nombreLogeo,
  idUsuario,
  username,
  password,
  email
) => {
  fetch("https://thegreenways.es/modificarPerfilVendedor.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombreLogeo: nombreLogeo,
      idUsuario: idUsuario,
      username: username,
      email: email
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      // Se cancela el estado de envío

      if (responseJson == "modificado") {
        Alert.alert("Aviso", "Usuario modificado correctamente.");
        AsyncStorage.setItem("name", username);
        Actions.PerfilVendedor();
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      // console.warn(e);

      dispatch(modificarPerfilVendedorHasError(true));
    });
};

export default {
  //goPrincipal,
  campoError,
  noErrores,
  modificarPerfilVendedor,
  modificarPerfilVendedorIsLoading,
  modificarPerfilVendedorHasError
};
