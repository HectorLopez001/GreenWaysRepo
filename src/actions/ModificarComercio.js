import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";
import RNFetchBlob from "rn-fetch-blob";
import { Alert } from "react-native";

const modificarComercioHasError = bool => {
  return {
    type: ActionTypes.MODIFICARCOMERCIO_HAS_ERROR,
    hasError: bool
  };
};

const modificarComercioIsLoading = bool => {
  return {
    type: ActionTypes.MODIFICARCOMERCIO_IS_LOADING,
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

const goMapa = () => {
  Actions.MapaModificarComercio();
  return {
    type: ActionTypes.MAPA_MODIFICAR_COMERCIO
  };
};

const cambioCoordenadas = (latitudNueva, longitudNueva) => {
  return {
    type: ActionTypes.ACTUALIZAR_COORDENADAS,
    latitud: latitudNueva,
    longitud: longitudNueva
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

const modificarComercio = (
  nombreLogeo,
  idComercio,
  nombreComercio,
  descripcionComercio,
  direccionComercio,
  latitud,
  longitud,
  imageSource,
  data,
  path
) => {
  return dispatch => {
    // Estado de envío activado
    dispatch(modificarComercioIsLoading(true));
    dispatch(modificarComercioHasError(false));
    dispatch(campoError(""));

    let reg = /^[0-9]+([,][0-9]{2})?$/;

    // Validacion de datos introducidos.
    if (!nombreComercio) {
      dispatch(campoError("nombre"));
      Alert.alert("Aviso", "El nombre del comercio se encuentra vacío");
      dispatch(campoError("nombreComercio"));
      // Estado de error en el insert
      dispatch(modificarComercioHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarComercioIsLoading(false));

      return;
    } else if (!descripcionComercio) {
      Alert.alert("Aviso", "La descripción del comercio se encuentra vacío");
      dispatch(campoError("descripcionComercio"));
      // Estado de error en el insert
      dispatch(modificarComercioHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarComercioIsLoading(false));

      return;
    } else if (!direccionComercio) {
      Alert.alert("Aviso", "La dirección del comercio se encuentra vacía");
      dispatch(campoError("direccionComercio"));
      // Estado de error en el insert
      dispatch(modificarComercioHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarComercioIsLoading(false));

      return;
    } else if (!latitud) {
      Alert.alert(
        "Aviso",
        "Debes introducir la localización del comercio utilizando el mapa."
      );
      dispatch(campoError("latitud"));
      // Estado de error en el insert
      dispatch(modificarComercioHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarComercioIsLoading(false));

      return;
    } else if (nombreComercio.length < 3 || nombreComercio.length > 40) {
      Alert.alert(
        "Aviso",
        "El nombre de comercio debe tener entre 3 y 40 caracteres"
      );
      dispatch(campoError("nombreComercio"));
      // Estado de error en el insert
      dispatch(modificarComercioHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarComercioIsLoading(false));

      return;
    } else if (descripcionComercio.length > 90) {
      Alert.alert(
        "Aviso",
        "La descripción del comercio no debe superar los 90 caracteres"
      );
      dispatch(campoError("descripcionComercio"));
      // Estado de error en el insert
      dispatch(modificarComercioHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarComercioIsLoading(false));

      return;
    }

    fetch("https://thegreenways.es/comprobarNombreComercioLibre.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombreComercio: nombreComercio,
        idComercio: idComercio
      })
    })
      .then(res => res.json())
      .then(responseJson => {
        // Se cancela el estado de envío

        dispatch(modificarComercioIsLoading(false));

        if (responseJson == "libre") {
          modificarComercio2(
            nombreLogeo,
            idComercio,
            nombreComercio,
            descripcionComercio,
            direccionComercio,
            latitud,
            longitud,
            imageSource,
            data,
            path
          );
        } else {
          Alert.alert("Aviso", responseJson);
          dispatch(campoError("nombreComercio"));
          dispatch(modificarComercioHasError(true));

          return;
        }
      })
      .catch(e => {
        // console.warn(e);

        dispatch(modificarComercioHasError(true));
      });
  };
};

const modificarComercio2 = (
  nombreLogeo,
  idComercio,
  nombreComercio,
  descripcionComercio,
  direccionComercio,
  latitud,
  longitud,
  imageSource,
  data,
  path
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

      dispatch(modificarComercioHasError(true));
      // Se cancela el estado de envío
      return;
    }

    nameCreated = "upload/images/" + nameCreated + ".jpeg";
    //  alert(nameCreated);
  } else {
    //SI NO INTRODUCIMOS UNA NUEVA FOTO
    nameCreated = imageSource.uri.substring(24, imageSource.uri.length);
  }

  fetch("https://thegreenways.es/modificarComercio.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nombreLogeo: nombreLogeo,
      idComercio: idComercio,
      nombreComercio: nombreComercio,
      descripcionComercio: descripcionComercio,
      localizacionComercio: direccionComercio,
      latitud: latitud,
      longitud: longitud,
      nameCreated: nameCreated
    })
  })
    .then(res => res.json())
    .then(responseJson => {

      if (responseJson === "modificado") {
        goPrincipalVendedor();
      } else {
        dispatch(modificarComercioHasError(true));
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      // console.warn(e);
      dispatch(modificarComercioHasError(true));
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

const goPagProductoVendedor = () => {
  Actions.PagProductoVendedor();
  return {
    type: ActionTypes.PAG_PRODUCTO_VENDEDOR
  };
};

const goPrincipalVendedor = () => {
  Actions.MainVendedor();
  setTimeout(() =>   Alert.alert("Aviso","Comercio modificado correctamente"), 100);
  return {
    type: ActionTypes.MAINVENDEDOR
  };
};

export default {
  campoError,
  noErrores,
  modificarComercioHasError,
  modificarComercioIsLoading,
  modificarComercio,
  refresh,
  goCatalogo,
  goCatalogoDetalle,
  goPagProductoVendedor,
  goPrincipalVendedor,
  goMapa,
  cambioCoordenadas
};
