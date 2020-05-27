import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";
import RNFetchBlob from "rn-fetch-blob";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

/*const goPrincipal = () => {
  Actions.Main();
  return {
    type: ActionTypes.MAIN
  };
};*/

const modificarPerfilRegistradoHasError = bool => {
  return {
    type: ActionTypes.MODIFICARPERFILREGISTRADO_HAS_ERROR,
    hasError: bool
  };
};

const modificarPerfilRegistradoIsLoading = bool => {
  return {
    type: ActionTypes.MODIFICARPERFILREGISTRADO_IS_LOADING,
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

const uploadPhoto = (datas, nameCreated) => {
  RNFetchBlob.fetch(
    "POST",
    "https://thegreenways.es/upload.php",
    {
      Authorization: "Bearer access-token",
      otherHeader: "foo",
      "Content-Type": "multipart/form-data"
    },
    [{ name: "image", filename: "image.jpeg", type: nameCreated, data: datas }]
  )
    // .then(resp => {

    .then(res => res.json())
    .then(responseJson => {
      // alert(responseJson);
    })
    .catch(err => {
      console.log(err);
    });
};

const modificarPerfilRegistrado = (
  nombreLogeo,
  idUsuario,
  username,
  password,
  email,
  tieneFeedback,
  imageSource,
  data,
  datosCambiados
) => {
  return dispatch => {
    // Estado de envío activado

    dispatch(modificarPerfilRegistradoIsLoading(true));
    dispatch(modificarPerfilRegistradoHasError(false));
    dispatch(campoError(""));

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // Validacion de datos introducidos.
    if (!username) {
      Alert.alert("Aviso", "El nombre de usuario se encuentra vacío");
      dispatch(campoError("nombre"));
      // Estado de error en la modificacion
      dispatch(modificarPerfilRegistradoHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarPerfilRegistradoIsLoading(false));

      return;
    } else if (!email) {
      Alert.alert("Aviso", "El email se encuentra vacío");
      dispatch(campoError("email"));
      // Estado de error en la modificacion
      dispatch(modificarPerfilRegistradoHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarPerfilRegistradoIsLoading(false));

      return;
    } else if (username.length < 3) {
      Alert.alert(
        "Aviso",
        "El nombre de usuario debe tener al menos 3 caracteres"
      );
      dispatch(campoError("nombre"));
      // Estado de error en el la modificacion
      dispatch(modificarPerfilRegistradoHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarPerfilRegistradoIsLoading(false));

      return;
    } else if (reg.test(email) == false) {
      Alert.alert("Aviso", "Por favor introduce un email válido");
      dispatch(campoError("email"));
      // Estado de error en el la modificacion
      dispatch(modificarPerfilRegistradoHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarPerfilRegistradoIsLoading(false));

      return;
    } else if (datosCambiados != "no") {
      if (!password) {
        Alert.alert(
          "Aviso",
          "Debe insertar la contraseña de la cuenta para esta operacion"
        );
        dispatch(campoError("password"));
        // Estado de error en la modificacion
        dispatch(modificarPerfilRegistradoHasError(true));
        // Se cancela el estado de envío
        dispatch(modificarPerfilRegistradoIsLoading(false));

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
            dispatch(modificarPerfilRegistradoIsLoading(false));
            // console.log(res);
            if (responseJson == "ok") {
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
                      email,
                      tieneFeedback,
                      imageSource,
                      data
                    );
                  } else {
                    if (responseJson == "El email no está disponible.") {
                      dispatch(campoError("email"));
                      Alert.alert("Aviso", responseJson);

                      dispatch(modificarPerfilRegistradoHasError(true));

                      return;
                    } else {
                      dispatch(campoError("nombre"));
                      Alert.alert("Aviso", responseJson);

                      dispatch(modificarPerfilRegistradoHasError(true));

                      return;
                    }
                  }
                })
                .catch(e => {
                  // console.warn(e);
                  //  dispatch(modificarPerfilRegistradoHasError(true));
                });
            } else {
              Alert.alert(
                "Aviso",
                "La contraseña introducida no es la correcta"
              );
              // Estado de error en el la modificacion
              dispatch(campoError("password"));
              dispatch(modificarPerfilRegistradoHasError(true));

              return;
            }
          })
          .catch(e => {
            //     console.warn(e);
            dispatch(modificarPerfilRegistradoHasError(true));
          });
      }
    } else {
      dispatch(modificarPerfilRegistradoIsLoading(false));
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
              email,
              tieneFeedback,
              imageSource,
              data
            );
          } else {
            if (responseJson == "El email no está disponible.") {
              dispatch(campoError("email"));
              Alert.alert("Aviso", responseJson);

              dispatch(modificarPerfilRegistradoHasError(true));

              return;
            } else {
              dispatch(campoError("nombre"));
              Alert.alert("Aviso", responseJson);

              dispatch(modificarPerfilRegistradoHasError(true));

              return;
            }
          }
        })
        .catch(e => {
          // console.warn(e);

          dispatch(modificarPerfilRegistradoHasError(true));
        });
    }
  };
};

const modificarPerfil2 = (
  nombreLogeo,
  idUsuario,
  username,
  password,
  email,
  imageSource,
  data
) => {
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
          email,
          imageSource,
          data
        );
      } else {
        Alert.alert("Aviso", responseJson);
        dispatch(modificarPerfilRegistradoHasError(true));

        return;
      }
    })
    .catch(e => {
      // console.warn(e);

      dispatch(modificarPerfilRegistradoHasError(true));
    });
};

const modificarPerfil3 = (
  nombreLogeo,
  idUsuario,
  username,
  password,
  email,
  tieneFeedback,
  imageSource,
  data
) => {
  // Comprobamos si el usuario quiere subir una imagenes y, si es así, realizamos la inserción y le ponemos un nombre unico para distinguirlo (random + datetime),
  // luego juntamos la ruta relativa del server donde se almacenan las imagenes junto con el nombre creado para guardar esa localizacion, junto con los otros datos del producto
  // en una columna de la BD (no es recomendable guardar las imagenes en la BD directamente).
  if (data != null) {
    var random = getRandomInt(0, 100000);
    var currentdate = new Date();
    var datetime =
      currentdate.getDate() +
      "-" +
      (currentdate.getMonth() + 1) +
      "-" +
      currentdate.getFullYear() +
      "_" +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();

    var nameCreated = random + "_" + datetime;

    //SUBIMOS LA IMAGEN AL SERVIDOR
    var exito = uploadPhoto(data, nameCreated);

    // alert(exito);

    if (exito == false) {
      Alert.alert(
        "Aviso",
        "Error en la conexion a internet, por favor intentalo otra vez"
      );

      dispatch(modificarPerfilRegistradoHasError(true));
      // Se cancela el estado de envío
      return;
    }

    nameCreated = "upload/images/" + nameCreated + ".jpeg";
  } else {
    //SI NO INTRODUCIMOS UNA NUEVA FOTO
    nameCreated = imageSource.uri.substring(24, imageSource.uri.length);
  }

  // Variable que importa funciones de la libreria de encriptación md5

  fetch("https://thegreenways.es/modificarPerfilRegistrado.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombreLogeo: nombreLogeo,
      idUsuario: idUsuario,
      username: username,
      email: email,
      tieneFeedback: tieneFeedback,
      nameCreated: nameCreated
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      // Se cancela el estado de envío

      if (responseJson == "modificado") {
        Alert.alert("Aviso", "Usuario modificado correctamente.");
        AsyncStorage.setItem("name", username);
        Actions.PerfilRegistrado();
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      // console.warn(e);

      dispatch(modificarPerfilRegistradoHasError(true));
    });
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
  //goPrincipal,
  campoError,
  noErrores,
  modificarPerfilRegistrado,
  modificarPerfilRegistradoIsLoading,
  modificarPerfilRegistradoHasError
};
