import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";
import RNFetchBlob from "rn-fetch-blob";
import { Alert, Keyboard } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

const modificarHasError = bool => {
  return {
    type: ActionTypes.MODIFICAR_HAS_ERROR,
    hasError: bool
  };
};

const modificarIsLoading = bool => {
  return {
    type: ActionTypes.MODIFICAR_IS_LOADING,
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

const modificar = (
  idProducto,
  nombre,
  descripcion,
  categoria,
  precio,
  value,
  username,
  imageSource,
  data,
  idComercio,
  filaInicio,
  categoriaVendedorSeleccionada
) => {
  return dispatch => {
    // Estado de envío activado
    dispatch(modificarIsLoading(true));
    dispatch(modificarHasError(false));
    dispatch(campoError(""));

    let reg = /^[0-9]+([,][0-9]{2})?$/;

    // Validacion de datos introducidos.
    if (!nombre) {
      Alert.alert("Aviso", "El nombre del producto se encuentra vacío");
      dispatch(campoError("nombre"));
      // Estado de error en el insert
      dispatch(modificarHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarIsLoading(false));

      return;
    } else if (!precio) {
      Alert.alert("Aviso", "El precio se encuentra vacío");
      dispatch(campoError("precio"));
      // Estado de error en el insert
      dispatch(modificarHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarIsLoading(false));

      return;
    } else if (!categoria) {
      Alert.alert("Aviso", "Selecciona una categoría para el producto.");
      dispatch(campoError("categoria"));
      // Estado de error en el insert
      dispatch(modificarHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarIsLoading(false));

      return;
    } else if (nombre.length < 3 || nombre.length > 30) {
      Alert.alert(
        "Aviso",
        "El nombre de producto debe tener entre 3 y 30 caracteres"
      );
      dispatch(campoError("nombre"));
      // Estado de error en el insert
      dispatch(modificarHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarIsLoading(false));

      return;
    } else if (precio.length > 8) {
      Alert.alert(
        "Aviso",
        "El precio del producto no debe superar los 8 caracteres"
      );
      dispatch(campoError("precio"));
      // Estado de error en el insert
      dispatch(modificarHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarIsLoading(false));

      return;
    } else if (descripcion.length > 70) {
      Alert.alert(
        "Aviso",
        "La descripción del producto no debe superar los 70 caracteres"
      );
      dispatch(campoError("descripcion"));
      // Estado de error en el insert
      dispatch(modificarHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarIsLoading(false));

      return;
    } else if (reg.test(precio) === false) {
      Alert.alert(
        "Aviso",
        "Por favor introduce un precio válido [Ejemplos: 9,50 // 28 // 3,95]"
      );
      dispatch(campoError("precio"));
      // Estado de error en el modificar
      dispatch(modificarHasError(true));
      // Se cancela el estado de envío
      dispatch(modificarIsLoading(false));

      return;
    }

    fetch("https://thegreenways.es/comprobarNombreProductoLibre.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        nombre: nombre,
        idProducto: idProducto
      })
    })
      .then(res => res.json())
      .then(responseJson => {
        // Se cancela el estado de envío

        dispatch(modificarIsLoading(false));

        if (responseJson == "libre") {
          modificar2(
            idProducto,
            nombre,
            descripcion,
            categoria,
            precio,
            value,
            username,
            imageSource,
            data,
            idComercio,
            filaInicio,
            categoriaVendedorSeleccionada
          );
        } else {
          dispatch(campoError("nombre"));
          Alert.alert("Aviso", responseJson);
          dispatch(modificarHasError(true));

          return;
        }
      })
      .catch(e => {
        // console.warn(e);

        dispatch(modificarHasError(true));
      });
  };
};

const modificar2 = (
  idProducto,
  nombre,
  descripcion,
  categoria,
  precio,
  value,
  username,
  imageSource,
  data,
  idComercio,
  filaInicio,
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

      dispatch(modificarHasError(true));
      // Se cancela el estado de envío
      return;
    }

    nameCreated = "upload/images/" + nameCreated + ".jpeg";
    //  alert(nameCreated);
  } else {
    //SI NO INTRODUCIMOS UNA NUEVA FOTO
    nameCreated = imageSource.uri.substring(24, imageSource.uri.length);
  }

  // alert(categoria + categoria.name);

  if (value == 0) {
    precio = precio + " €/Unidad";
  } else {
    precio = precio + " €/Kilo";
  }

  //Campo descripcion vacio.
  if (descripcion == null) {
    descripcion = "No hay descripción disponible para esta tienda.";
  }

  fetch("https://thegreenways.es/modificar.php", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      idProducto: idProducto,
      nombre: nombre,
      descripcion: descripcion,
      categoria: categoria,
      precio: precio,
      username: username,
      nameCreated: nameCreated,
      idComercio: idComercio
    })
  })
    .then(res => res.json())
    .then(responseJson => {
      // Se cancela el estado de envío

      if (responseJson == "modificado") {
        AsyncStorage.setItem(
          "filaInicioCatalogoVendedorFinal",
          filaInicio.toString()
        ); // ejemplo

        AsyncStorage.setItem(
          "categoriaVendedorSeleccionadaFinal",
          categoriaVendedorSeleccionada
        );
        //  Actions.refresh({ key: Math.random() });

        //Esto es por si modifica el nombre del producto desde la pagina del producto (recarga sino no encuentra el nombre)
        AsyncStorage.setItem("producto", nombre);

        Keyboard.dismiss();

        AsyncStorage.getItem("catalogo").then(value => {
          AsyncStorage.getItem("visitado").then(value2 => {
            if (value == "detalle" && value2 != "pagProducto") {
              goCatalogoDetalle();
            } else {
              if (value == "rapido" && value2 != "pagProducto") {
                goCatalogo();
              } else {
                goPagProductoVendedor();
              }
            }
          });
        });
      } else {
        // dispatch(modificarHasError(true));
        Alert.alert("Aviso", responseJson);
      }
    })
    .catch(e => {
      // console.warn(e);
      dispatch(modificarHasError(true));
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

export default {
  campoError,
  noErrores,
  modificarHasError,
  modificarIsLoading,
  modificar,
  refresh,
  goCatalogo,
  goCatalogoDetalle,
  goPagProductoVendedor
};
