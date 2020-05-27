import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";
import RNFetchBlob from "rn-fetch-blob";
import { Alert, Keyboard } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

const insertarHasError = bool => {
  return {
    type: ActionTypes.INSERTAR_HAS_ERROR,
    hasError: bool
  };
};

const insertarIsLoading = bool => {
  return {
    type: ActionTypes.INSERTAR_IS_LOADING,
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
    .catch(err => {
      console.log(err);
    });
};

const insertar = (
  nombre,
  descripcion,
  categoria,
  precio,
  value,
  username,
  imageSource,
  data,
  categoriaVendedorSeleccionada
) => {
  return dispatch => {
    // Estado de envío activado
    dispatch(insertarIsLoading(true));
    dispatch(insertarHasError(false));
    dispatch(campoError(""));

    let reg = /^[0-9]+([,][0-9]{2})?$/;

    //alert(categoriaVendedorSeleccionada);

    // Validacion de datos introducidos.
    if (!nombre) {
      Alert.alert("Aviso", "El nombre del producto se encuentra vacío");
      // Estado de error en el insert

      dispatch(campoError("nombre"));

      dispatch(insertarHasError(true));

      dispatch(insertarIsLoading(false));

      return;
    } else if (!precio) {
      Alert.alert("Aviso", "El precio del producto se encuentra vacío");
      // Estado de error en el insert
      dispatch(campoError("precio"));

      dispatch(insertarHasError(true));

      dispatch(insertarIsLoading(false));

      return;
    } else if (!categoria) {
      Alert.alert("Aviso", "Selecciona una categoría para el producto.");
      dispatch(campoError("categoria"));
      // Estado de error en el insert
      dispatch(insertarHasError(true));
      // Se cancela el estado de envío
      dispatch(insertarIsLoading(false));

      return;
    } else if (nombre.length < 3 || nombre.length > 30) {
      Alert.alert(
        "Aviso",
        "El nombre de producto debe tener entre 3 y 30 caracteres"
      );
      dispatch(campoError("nombre"));
      // Estado de error en el insert
      dispatch(insertarHasError(true));

      dispatch(insertarIsLoading(false));

      return;
    } else if (precio.length > 7) {
      Alert.alert(
        "Aviso",
        "El precio del producto no debe superar los 7 caracteres"
      );
      dispatch(campoError("precio"));
      // Estado de error en el insert
      dispatch(insertarHasError(true));

      dispatch(insertarIsLoading(false));

      return;
    } else if (reg.test(precio) === false) {
      Alert.alert(
        "Aviso",
        "Por favor introduce un precio válido [Ejemplos: 9,50 // 28 // 3,95]"
      );
      dispatch(campoError("precio"));
      // Estado de error en el insertar
      dispatch(insertarHasError(true));

      dispatch(insertarIsLoading(false));

      return;
    } else if (descripcion && descripcion.length > 70) {
      Alert.alert(
        "Aviso",
        "La descripción del producto no debe superar los 70 caracteres"
      );
      dispatch(campoError("descripcion"));
      // Estado de error en el insert
      dispatch(insertarHasError(true));

      dispatch(insertarIsLoading(false));

      return;
    }

    fetch("https://thegreenways.es/comprobarNombreProductoLibreSinId.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        nombre: nombre
      })
    })
      .then(res => res.json())
      .then(responseJson => {
        // Se cancela el estado de envío

        dispatch(insertarIsLoading(false));

        if (responseJson == "libre") {
          insertar2(
            nombre,
            descripcion,
            categoria,
            precio,
            value,
            username,
            data,
            categoriaVendedorSeleccionada
          );
        } else {
          dispatch(campoError("nombre"));
          Alert.alert("Aviso", responseJson);
          dispatch(insertarHasError(true));
          return;
        }
      })
      .catch(e => {
        // console.warn(e);

        dispatch(insertarHasError(true));
      });
  };
};

const insertar2 = (
  nombre,
  descripcion,
  categoria,
  precio,
  value,
  username,
  data,
  categoriaVendedorSeleccionada
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

      dispatch(insertarHasError(true));
      // Se cancela el estado de envío

      return;
    }

    nameCreated = "upload/images/" + nameCreated + ".jpeg";
    //  alert(nameCreated);
  } else {
    nameCreated = "upload/images/producti3.jpg";
  }

  if (value == 0) {
    precio = precio + " €/Unidad";
  } else {
    precio = precio + " €/Kilo";
  }

  //Campo descripcion vacio.
  if (descripcion == null) {
    descripcion = "No hay descripción disponible para esta tienda.";
  }

  fetch("https://thegreenways.es/insertar.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombre: nombre,
      descripcion: descripcion,
      categoria: categoria,
      precio: precio,
      username: username,
      nameCreated: nameCreated
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      // Se cancela el estado de envío

      if (responseJson == "insertado") {
        insertar3(
          nombre,
          username,
          categoria,
          categoriaVendedorSeleccionada
        );
      } else {
        dispatch(insertarHasError(true));
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      // console.warn(e);
      dispatch(insertarHasError(true));
    });
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function refresh() {
  Actions.refresh({ key: Math.random() });
}

const goCatalogo = () => {
  Actions.Catalogo();
  return {
    type: ActionTypes.CATALOGO
  };
};

const goCatalogoDetalle = () => {
  Actions.CatalogoDetalle();
  return {
    type: ActionTypes.CATALOGO_DETALLE
  };
};

const insertar3 = (
  nombre,
  username,
  categoria,
  categoriaVendedorSeleccionada
) => {
  fetch("https://thegreenways.es/traerNumFilaInsercionProducto.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombre: nombre,
      username: username,
      categoria:
        categoriaVendedorSeleccionada != "TODO"
          ? categoria
          : categoriaVendedorSeleccionada
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      if (responseJson != "Compruebe conexión a internet.") {
        var aux = Object.entries(responseJson);
        var i = 0;

        for (var [key, value] of aux) {
          if (value.nombreProducto < nombre) {
            i = i + 1;
          }
        }

        AsyncStorage.setItem("filaInicioCatalogoVendedorFinal", i.toString());

        if (categoriaVendedorSeleccionada != "TODO") {
          AsyncStorage.setItem("categoriaVendedorSeleccionadaFinal", categoria);
        } else {
          AsyncStorage.setItem("categoriaVendedorSeleccionadaFinal", "TODO");
        }

        Keyboard.dismiss();

        Alert.alert(
          "Aviso",
          "¡Producto introducido! ¿Deseas introducir más?",
          [
            { text: "Sí", onPress: () => refresh() },
            {
              text: "No",
              onPress: () =>
                AsyncStorage.getItem("catalogo").then(value => {
                  if (value == "detalle") {
                    goCatalogoDetalle();
                  } else {
                    //  alert(categoriaVendedorSeleccionada);
                    goCatalogo();
                  }
                })
            }
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      // console.warn(e);
      dispatch(insertarHasError(true));
    });
};

export default {
  insertarHasError,
  insertarIsLoading,
  campoError,
  noErrores,
  insertar,
  refresh,
  goCatalogo,
  goCatalogoDetalle
};
