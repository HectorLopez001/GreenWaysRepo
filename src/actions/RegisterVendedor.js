import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";
import RNFetchBlob from "rn-fetch-blob";
import { Alert } from "react-native";

const registerHasError = bool => {
  return {
    type: ActionTypes.REGISTER_HAS_ERROR,
    hasError: bool
  };
};

const registerIsLoading = bool => {
  return {
    type: ActionTypes.REGISTER_IS_LOADING,
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

const cambioCoordenadas = (latitudNueva, longitudNueva) => {
  return{
    type: ActionTypes.ACTUALIZAR_COORDENADAS_REGISTRO,
    latitud: latitudNueva,
    longitud: longitudNueva
  };
};

const uploadPhoto = (datas, image, nameCreated) => {
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
    .then(resp => {
      console.log(resp);
    })
    .catch(err => {
      console.log(err);
    });
};

const registerVendedor = (
  username,
  email,
  password,
  password2,
  nombreComercio,
  descripcionComercio,
  direccionComercio,
  latitud,
  longitud,
  imageSource,
  data,
  image
) => {
  return dispatch => {
    // Estado de envío activado
    dispatch(registerIsLoading(true));
    dispatch(registerHasError(false));
    dispatch(campoError(""));

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //let regLocalizacion = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // Campos vacios
    if (!username) {
      Alert.alert("Aviso", "El nombre de usuario se encuentra vacío");
      dispatch(campoError("nombre"));
      // Estado de error en el register
      dispatch(registerHasError(true));
      // Se cancela el estado de envío
      dispatch(registerIsLoading(false));

      return;
    } else if (!email) {
      Alert.alert("Aviso", "El email se encuentra vacío");
      dispatch(campoError("email"));
      // Estado de error en el register
      dispatch(registerHasError(true));
      // Se cancela el estado de envío
      dispatch(registerIsLoading(false));

      return;
    } else if (!password) {
      Alert.alert("Aviso", "La contraseña se encuentra vacía");
      dispatch(campoError("password"));
      // Estado de error en el register
      dispatch(registerHasError(true));
      // Se cancela el estado de envío
      dispatch(registerIsLoading(false));

      return;
    } else if (!password2) {
      Alert.alert("Aviso", "La repeticion de contraseña se encuentra vacía");
      dispatch(campoError("password2"));
      // Estado de error en el register
      dispatch(registerHasError(true));
      // Se cancela el estado de envío
      dispatch(registerIsLoading(false));

      return;
    } else if (!nombreComercio) {
      Alert.alert("Aviso", "El nombre del comercio se encuentra vacío");
      dispatch(campoError("nombreComercio"));
      // Estado de error en el register
      dispatch(registerHasError(true));
      // Se cancela el estado de envío
      dispatch(registerIsLoading(false));

      return;
    } else if (!descripcionComercio) {
      Alert.alert("Aviso", "La descripción del comercio se encuentra vacía");
      dispatch(campoError("descripcionComercio"));
      // Estado de error en el register
      dispatch(registerHasError(true));
      // Se cancela el estado de envío
      dispatch(registerIsLoading(false));

      return;
    } else if (!direccionComercio) {
      Alert.alert("Aviso", "La dirección del comercio no puede estar vacía");
      dispatch(campoError("direccionComercio"));
      // Estado de error en el register
      dispatch(registerHasError(true));
      // Se cancela el estado de envío
      dispatch(registerIsLoading(false));

      return;
    } else if (!latitud) {
      Alert.alert(
        "Aviso",
        "Debes introducir la localización del comercio utilizando el mapa."
      );
      dispatch(campoError("latitud"));
      // Estado de error en el register
      dispatch(registerHasError(true));
      // Se cancela el estado de envío
      dispatch(registerIsLoading(false));

      return;
    } else if (reg.test(email) == false) {
      Alert.alert("Aviso", "Por favor introduce un email válido");
      dispatch(campoError("email"));
      // Estado de error en el register
      dispatch(registerHasError(true));
      // Se cancela el estado de envío
      dispatch(registerIsLoading(false));

      return;
    } else if (username.length < 3) {
      Alert.alert(
        "Aviso",
        "El nombre de usuario debe tener al menos 3 caracteres"
      );
      dispatch(campoError("nombre"));
      // Estado de error en el register
      dispatch(registerHasError(true));
      // Se cancela el estado de envío
      dispatch(registerIsLoading(false));

      return;
    } else if (password.length < 3) {
      Alert.alert("Aviso", "La contraseña debe tener al menos 3 caracteres");
      dispatch(campoError("password"));
      // Estado de error en el register
      dispatch(registerHasError(true));
      // Se cancela el estado de envío
      dispatch(registerIsLoading(false));

      return;
    } else if (nombreComercio.length < 3 || nombreComercio.length > 40) {
      Alert.alert(
        "Aviso",
        "El nombre de comercio debe tener entre 3 y 40 caracteres"
      );
      dispatch(campoError("nombreComercio"));
      // Estado de error en el register
      dispatch(registerHasError(true));
      // Se cancela el estado de envío
      dispatch(registerIsLoading(false));

      return;
    } else if (password != password2) {
      Alert.alert("Aviso", "Las contraseñas introducidas no coinciden");
      dispatch(campoError("password2"));
      // Estado de error en el register
      dispatch(registerHasError(true));
      // Se cancela el estado de envío
      dispatch(registerIsLoading(false));

      return;
    } else if (descripcionComercio.length > 90) {
      Alert.alert(
        "Aviso",
        "La descripción del comercio no debe superar los 90 caracteres"
      );
      dispatch(campoError("descripcionComercio"));
      // Estado de error en el register
      dispatch(registerHasError(true));
      // Se cancela el estado de envío
      dispatch(registerIsLoading(false));

      return;
    }
    //Se comprueba que no exista un nombre o un correo en alguna de las tablas de usuarios en la BD

    fetch("https://thegreenways.es/comprobarNombreUsuarioLibreSinId.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        email: email
      })
    })
      .then(res => res.json())
      .then(responseJson => {
        // Se cancela el estado de envío
        dispatch(registerIsLoading(false));

        if (responseJson == "libre") {
          fetch(
            "https://thegreenways.es/comprobarNombreComercioLibreSinId.php",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                nombreComercio: nombreComercio
              })
            }
          )
            .then(res => res.json())
            .then(responseJson => {
              // Se cancela el estado de envío

              if (responseJson == "libre") {
                registerVendedor3(
                  username,
                  email,
                  password,
                  password2,
                  nombreComercio,
                  descripcionComercio,
                  direccionComercio,
                  latitud,
                  longitud,
                  imageSource,
                  data,
                  image
                );
              } else {
                if (
                  responseJson == "El nombre de comercio no está disponible."
                ) {
                  Alert.alert("Aviso", responseJson);

                  dispatch(campoError("nombreComercio"));

                  dispatch(registerHasError(true));

                  return;
                }
              }
            })
            .catch(e => {
              // console.warn(e);
              // dispatch(registerHasError(true));
            });
        } else {
          if (responseJson == "El email no está disponible.") {
            dispatch(campoError("email"));
            Alert.alert("Aviso", responseJson);

            dispatch(registerHasError(true));

            return;
          } else {
            dispatch(campoError("nombre"));
            Alert.alert("Aviso", responseJson);

            dispatch(registerHasError(true));

            return;
          }
        }
      })
      .catch(e => {
        // console.warn(e);

        dispatch(registerHasError(true));
      });
  };
};

const registerVendedor2 = (
  username,
  email,
  password,
  password2,
  nombreComercio,
  descripcionComercio,
  imageSource,
  data,
  image
) => {
  return dispatch => {
    fetch("https://thegreenways.es/comprobarNombreComercioLibreSinId.php", {
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
        // Se cancela el estado de envío

        if (responseJson == "libre") {
          registerVendedor3(
            username,
            email,
            password,
            password2,
            nombreComercio,
            descripcionComercio,
            direccionComercio,
            imageSource,
            data,
            image
          );
        } else {
          if (responseJson == "El nombre de comercio no está disponible.") {
            dispatch(campoError("nombreComercio"));
            dispatch(registerHasError(true));
            Alert.alert("Aviso", responseJson);
          }
        }
      })
      .catch(e => {
        // console.warn(e);
        dispatch(registerHasError(true));
      });
  };
};

const registerVendedor3 = (
  username,
  email,
  password,
  password2,
  nombreComercio,
  descripcionComercio,
  direccionComercio,
  latitud,
  longitud,
  imageSource,
  data,
  image
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

    var exito = uploadPhoto(data, image, nameCreated);

    if (exito == false) {
      Alert.alert(
        "Aviso",
        "Error en la conexion a internet, por favor intentalo otra vez"
      );
      dispatch(registerHasError(true));

      return;
    }

    nameCreated = "upload/images/" + nameCreated + ".jpeg";
  } else {
    nameCreated = "upload/images/comercio10.jpg";
  }

  // Variable que importa funciones de la libreria de encriptación md5
  var md5 = require("md5");

  fetch("https://thegreenways.es/registerVendedor.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      email: email,
      password: md5(password),
      nombreComercio: nombreComercio,
      descripcionComercio: descripcionComercio,
      direccionComercio: direccionComercio,
      latitud: latitud,
      longitud: longitud,
      nameCreated: nameCreated
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      // Se cancela el estado de envío

      if (responseJson == "registrado vendedor") {
        Alert.alert("Aviso", "Usuario vendedor registrado correctamente.");
        Actions.Login();
      } else {
        Alert.alert("Aviso", responseJson);
        dispatch(registerHasError(true));
      }
    })
    .catch(e => {
      //     console.warn(e);
      //  dispatch(registerHasError(true));
    });
};

const goLogin = () => {
  Actions.Login();
  return {
    type: ActionTypes.LOGOUT
  };
};

const goMapa = () => {
  Actions.MapaRegistroVendedor();
  return {
    type: ActionTypes.MAPA_REGISTRO_VENDEDOR
  };
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
  registerHasError,
  registerIsLoading,
  campoError,
  noErrores,
  registerVendedor,
  goLogin,
  goMapa,
  cambioCoordenadas
};
