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

import GestionComerciosActions from "./../actions/GestionComercios";

import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class PagProductoAdmin extends Component {
  static navigationOptions = {
    title: "Página de Producto",
    headerRight: (
      <View>
        <TouchableOpacity
          onPress={() => {
            Actions.MainAdmin();
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
      idProducto: null,
      nombreProducto: null,
      descripcionProducto: null,
      imageSource: null,
      precio: null,
      nombreUsuario: null,
      nombreComercio: null,
      coordenadaListView: null,
      coordenadaListViewPagActual: null,
      isStorageLoaded: false,
      revisado: null,
      revisadoInicial: null
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem("producto").then(value => {
      this.setState({
        nombreProducto: value
      });
    });

    await AsyncStorage.getItem("comercio").then(value => {
      this.setState({
        nombreComercio: value
      });
    });

    await AsyncStorage.getItem("filaInicio").then(value => {
      this.setState({
        coordenadaListView: value
      });
    });

    await AsyncStorage.getItem("filaInicioPagActual").then(value => {
      this.setState({
        coordenadaListViewPagActual: value
      });
    });

    return fetch("https://thegreenways.es/pagProductoNoVendedor.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombreProducto: this.state.nombreProducto,
        nombreComercio: this.state.nombreComercio
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            idProducto: responseJson[0].idProducto,
            nombreProducto: responseJson[0].nombreProducto,
            descripcionProducto: responseJson[0].descripcionProducto,
            precio: responseJson[0].precio,
            imageSource: responseJson[0].imagenProducto,
            isStorageLoaded: true,
            revisado: responseJson[0].revisar,
            revisadoInicial:
              responseJson[0].revisar == "0" ? responseJson[0].revisar : null
          },
          function() {}
        );

        this.props.productoRevisado(
          this.state.nombreProducto,
          this.state.nombreComercio
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
          <View style={{ alignItems: "center", height: "100%" }}>
            <View style={{ alignItems: "center", height: "74%" }}>
              <View style={{ height: winHeight * 0.1 }}>
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
              </View>

              <View style={{ height: winHeight * 0.08 }}>
                <Text
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    color: "black",
                    fontSize: 18,
                    marginBottom: 11
                  }}
                >
                  {this.state.descripcionProducto}
                </Text>
              </View>

              <View style={{ height: winHeight * 0.4 }}>
                <ImageLoad
                  style={{
                    resizeMode: "cover",
                    width: winWidth * 0.84,
                    height: winHeight * 0.4,
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
              </View>

              <View
                style={{
                  height: winHeight * 0.035,
                  marginTop: winHeight * 0.04
                }}
              >
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
              </View>
            </View>

            <View style={styles.lineaBotones}>
              <View style={{ flex: 0.5 }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.mensajeEliminar2(
                      this.state.nombreComercio,
                      this.state.nombreProducto,
                      this.state.coordenadaListViewPagActual
                    )
                  }
                >
                  <View
                    style={{
                      borderWidth: 1.5,
                      borderColor: "black",
                      borderRadius: 20,
                      backgroundColor: "#79B700",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: "2%",
                      marginRight: "2%"
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Text style={styles.textoBotones}>
                        ELIMINAR
                        {"\n"}
                        PRODUCTO
                      </Text>
                    </View>
                    <View>
                      <Image
                        style={{
                          height: 50,
                          width: 50,
                          resizeMode: "cover",
                          marginLeft: 10,
                          marginRight: 5,
                          marginTop: 2
                        }}
                        resizeMethod={"resize"}
                        source={require("GreenWaysProject/images/eliminar3.png")}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 0.5 }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.mensajeEliminar(
                      this.state.nombreComercio,
                      this.state.coordenadaListView
                    )
                  }
                >
                  <View
                    style={{
                      borderWidth: 1.5,
                      borderColor: "black",
                      borderRadius: 20,
                      backgroundColor: "#79B700",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: "2%",
                      marginRight: "2%"
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Text style={styles.textoBotones}>
                        ELIMINAR
                        {"\n"}
                        COMERCIO
                      </Text>
                    </View>
                    <View>
                      <Image
                        style={{
                          height: 50,
                          width: 50,
                          resizeMode: "cover",
                          marginLeft: 10,
                          marginRight: 5,
                          marginTop: 2
                        }}
                        resizeMethod={"resize"}
                        source={require("GreenWaysProject/images/eliminar3.png")}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                flex: 1,
                width: winWidth * 0.972,
                height: winHeight * 0.08
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.volverCatalogo(this.state.revisadoInicial);
                }}
              >
                <View
                  style={{
                    height: 55,
                    borderWidth: 1.5,
                    borderColor: "black",
                    borderRadius: 20,
                    backgroundColor: "#79B700",
                    marginLeft: "2%",
                    marginRight: "2%",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={styles.textoBotones}>VOLVER</Text>
                </View>
              </TouchableOpacity>
            </View>
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
    mensajeEliminar: (nombreComercio, rowNumber) =>
      dispatch(
        GestionComerciosActions.mensajeEliminar(
          nombreComercio,
          rowNumber,
          "PagProductosAdmin"
        )
      ),
    mensajeEliminar2: (
      nombreComercio,
      nombreProducto,
      coordenadaListViewPagActual
    ) =>
      dispatch(
        GestionComerciosActions.mensajeEliminarPagProducto(
          nombreComercio,
          nombreProducto,
          coordenadaListViewPagActual
        )
      ),
    volverCatalogo: revisar =>
      dispatch(GestionComerciosActions.volverCatalogo(revisar)),
    productoRevisado: (nombreProducto, nombreComercio) =>
      dispatch(
        GestionComerciosActions.productoRevisado(nombreProducto, nombreComercio)
      )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagProductoAdmin);

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
  button: {
    padding: 10,
    backgroundColor: "#36ada4",
    justifyContent: "center",
    alignItems: "center"
  },
  lineaBotones: {
    height: winHeight * 0.08,
    marginTop: "10%",
    flexDirection: "row",
    marginBottom: "1%"
  },
  imgPlaceholder: {
    height: 65,
    resizeMode: "contain",
    marginTop: 30,
    marginBottom: 30
  },
});
