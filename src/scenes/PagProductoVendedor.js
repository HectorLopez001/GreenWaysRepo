import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import AsyncStorage from '@react-native-community/async-storage';
import ImageLoad from "react-native-image-placeholder";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";

import CatalogoActions from "./../actions/Catalogo";

import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class PagProductoVendedor extends Component {
  static navigationOptions = {
    title: "Página de Producto",
    headerRight: (
      <View>
        <TouchableOpacity
          onPress={() => {
            Actions.MainVendedor();
            return;
          }}
          style={{ padding: 10 }}
        >
          <Image
            style={{
              height: 40,
              width: 40,
              resizeMode: "cover"
            }}
            resizeMethod={"resize"}
            source={require("GreenWaysProject/images/home.png")}
          />
        </TouchableOpacity>
      </View>
    )
  };

  constructor(props) {
    super(props);

    this.state = {
      // nombreComercio: null,
      // isLoading: true,
      idProducto: null,
      nombreProducto: null,
      descripcionProducto: null,
      imageSource: null,
      precio: null,
      nombreUsuario: null,
      coordenadaListView: null,
      categoriaSeleccionada: "TODO",
      isStorageLoaded: false
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem("producto").then(value => {
      this.setState({
        nombreProducto: value
      });
    });

    await AsyncStorage.getItem("name").then(value => {
      this.setState({
        nombreUsuario: value
      });
    });

    await AsyncStorage.getItem("categoriaVendedorSeleccionada").then(value => {
      if (value != "TODO") {
        this.setState({
          categoriaSeleccionada: value
        });
      }
    });

    await AsyncStorage.getItem("filaInicioCatalogoVendedor").then(value => {
      this.setState({
        coordenadaListView: value
      });
    });

    return fetch("https://thegreenways.es/pagProducto.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombreProducto: this.state.nombreProducto,
        username: this.state.nombreUsuario
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            //  isLoading: false,
            idProducto: responseJson[0].idProducto,
            nombreProducto: responseJson[0].nombreProducto,
            descripcionProducto: responseJson[0].descripcionProducto,
            categoriaProducto: responseJson[0].categoriaProducto,
            precio: responseJson[0].precio,
            imageSource: responseJson[0].imagenProducto,
            isStorageLoaded: true
          },
          function() {
            //State change
          }
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    var Image_Http_URL = {
      uri: "https://thegreenways.es/" + this.state.imageSource
    };

    let { isStorageLoaded } = this.state;
    if (!isStorageLoaded) {
      return <Loader loading={true} />;
    } else {
      return (
        <View style={styles.MainContainer}>
          <View style={{ alignItems: "center", height: "90%" }}>
            <Text
              style={{
                textAlign: "center",
                color: "black",
                fontSize: 40,
                fontWeight: "bold",
                marginBottom: 5,
                marginTop: 8
              }}
            >
              {this.state.nombreProducto}
            </Text>

            <Text
              style={{
                justifyContent: "flex-start",
                alignItems: "flex-start",
                color: "black",
                fontSize: 18,
                marginBottom: 8
              }}
            >
              {this.state.descripcionProducto}
            </Text>

            <Text
              style={{
                justifyContent: "flex-start",
                alignItems: "flex-start",
                color: "black",
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 10
              }}
            >
              Categoría: {this.state.categoriaProducto}
            </Text>

            <ImageLoad
              style={{
                resizeMode: "cover",
                width: "90%",
                height: "50%",
                justifyContent: "center",
                alignItems: "center",
                borderColor: "#8E8E8E",
                borderWidth: 2,
                marginBottom: 8
              }}
              resizeMethod={"resize"}
              source={Image_Http_URL}
              placeholderSource={require("GreenWaysProject/images/time.png")}
              isShowActivity={false}
              placeholderStyle={styles.imgPlaceholder}
            />

            <Text
              style={{
                textAlign: "left",
                color: "black",
                fontSize: 24,
                fontWeight: "bold"
              }}
            >
              Precio: {this.state.precio}
            </Text>

            <View style={styles.container2}>
              <View>
                <TouchableOpacity
                  onPress={() => this.props.modificarPagProducto()}
                >
                  <Image
                    style={{
                      height: 65,
                      width: 65,
                      resizeMode: "cover",
                      margin: 10,
                      marginRight: 30,
                      marginBottom: 10
                    }}
                    resizeMethod={"resize"}
                    source={require("GreenWaysProject/images/modificar5.png")}
                  />
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity
                  onPress={() =>
                    this.props.mensajeEliminarPagProducto(
                      this.state.nombreProducto,
                      this.state.nombreUsuario,
                      this.state.coordenadaListView,
                      this.state.categoriaSeleccionada
                    )
                  }
                >
                  <Image
                    style={{
                      height: 65,
                      width: 65,
                      resizeMode: "cover",
                      margin: 10,
                      marginLeft: 30,
                      marginBottom: 10
                    }}
                    resizeMethod={"resize"}
                    source={require("GreenWaysProject/images/eliminar3.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              marginTop: "0.5%",
              marginBottom: "1%"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.volverCatalogos(
                  this.state.coordenadaListView,
                  this.state.categoriaSeleccionada
                );
              }}
            >
              <View
                style={{
                  height: winHeight * 0.08,
                  borderWidth: 2,
                  borderColor: "black",
                  borderRadius: 20,
                  backgroundColor: "#79B700",
                  marginLeft: "2%",
                  marginRight: "2%",
                  //marginTop: 5,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.textoBotones}>VOLVER AL CATALOGO</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    isLogged: state.login.isLogged,
    hasError: state.register.hasError,
    isLoading: state.register.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    //  goCatalogoCliente: () => dispatch(MainActions.goCatalogoCliente())
    mensajeEliminarPagProducto: (
      nombreProducto,
      nombreUsuario,
      coordenadaListView,
      categoriaSeleccionada
    ) =>
      dispatch(
        CatalogoActions.mensajeEliminarPagProducto(
          nombreProducto,
          nombreUsuario,
          coordenadaListView,
          categoriaSeleccionada
        )
      ),
    modificarPagProducto: () =>
      dispatch(CatalogoActions.modificarPagProducto()),
    volverCatalogos: (coordenadaListView, categoriaSeleccionada) =>
      dispatch(
        CatalogoActions.volverCatalogos(
          coordenadaListView,
          categoriaSeleccionada
        )
      )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagProductoVendedor);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    flex: 1,
    marginLeft: 10,
    marginRight: 10
  },
  container2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5
  },
  imgPlaceholder: {
    height: 65,
    resizeMode: "contain",
    marginTop: 30,
    marginBottom: 30
  },
});
