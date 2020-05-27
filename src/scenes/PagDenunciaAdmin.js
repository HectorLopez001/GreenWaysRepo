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

import Loader from "./../components/Loader";
import GestionComerciosActions from "./../actions/GestionComercios";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class PagDenunciaAdmin extends Component {
  static navigationOptions = {
    title: "Página de denuncia",
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
      idDenuncia: null,
      name: null,
      categoria: null,
      motivo: null,
      revisar: null,
      idComercio: null,
      nombreComercio: null,
      imagenComercio: null,
      idProducto: null,
      nombreProducto: null,
      imagenProducto: null,
      imagen: null,
      isStorageLoaded: false,
      coordenadaListView: null
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem("denuncia").then(value => {
      this.setState({
        idDenuncia: value
      });
    });

    await AsyncStorage.getItem("filaInicioDenuncia").then(value => {
      this.setState({
        coordenadaListView: value
      });
      //  alert(this.state.coordenadaListView);
    });

    return fetch("https://thegreenways.es/pagDenuncia.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idDenuncia: this.state.idDenuncia })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            idDenuncia: responseJson[0].idDenuncia,
            name: responseJson[0].name,
            categoria: responseJson[0].categoria,
            motivo: responseJson[0].motivo,
            revisar: responseJson[0].revisar,
            idComercio: responseJson[0].idComercio,
            nombreComercio: responseJson[0].nombreComercio,
            imagenComercio: responseJson[0].imagenComercio,
            idProducto: responseJson[0].idProducto,
            nombreProducto: responseJson[0].nombreProducto,
            imagenProducto: responseJson[0].imagenProducto,

            isStorageLoaded: true
          },
          function() {
            //State change
          }
        );

        this.props.denunciaRevisada(this.state.idDenuncia);
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    let { isStorageLoaded } = this.state;
    if (!isStorageLoaded) {
      return <Loader loading={true} />;
    } else {
      return (
        <View style={styles.MainContainer}>
          <View style={{ alignItems: "center", height: "100%" }}>
            <View style={{ alignItems: "center", height: "89%" }}>
              <View
                style={{
                  height: winHeight * 0.08,
                  marginTop: winHeight * 0.06
                }}
              >
                <Text style={styles.rowViewContainer1}>
                  {this.state.categoria}
                </Text>
              </View>

              <View
                style={{
                  height: winHeight * 0.08,
                  marginBottom: winHeight * 0.05
                }}
              >
                <Text style={styles.rowViewContainer2}>
                  {this.state.motivo}
                </Text>
              </View>

              <View style={{ height: winHeight * 0.06 }}>
                <Text style={styles.rowViewContainer0}>
                  {this.state.nombreProducto != null
                    ? "Producto: " + this.state.nombreProducto
                    : "Comercio: " + this.state.nombreComercio}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <ImageLoad
                    style={styles.imgRevisado}
                    source={
                      this.state.idProducto != null
                        ? {
                            uri:
                              "https://thegreenways.es/" +
                              this.state.imagenProducto
                          }
                        : {
                            uri:
                              "https://thegreenways.es/" +
                              this.state.imagenComercio
                          }
                    }
                    resizeMethod={"resize"}
                    placeholderSource={require("GreenWaysProject/images/time.png")}
                    isShowActivity={false}
                    placeholderStyle={styles.imgPlaceholder}
                  />
                </View>
              </View>
            </View>

            <View style={styles.lineaBotones}>
              <View style={{ flex: 0.5 }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.mensajeEliminarPagDenuncia(
                      this.state.nombreProducto == null
                        ? this.state.nombreComercio
                        : this.state.nombreProducto,
                      this.state.nombreProducto == null
                        ? "comercio"
                        : "producto",
                      this.state.nombreProducto == null
                        ? "nada"
                        : this.state.nombreComercio,
                      this.state.idDenuncia,
                      this.state.name,
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
                      <Text style={styles.textoBotones}>ELIMINAR</Text>
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
                  onPress={() => {
                    Actions.pop();
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
        </View>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    //isLogged: state.login.isLogged,
    // hasError: state.register.hasError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    mensajeEliminarPagDenuncia: (
      nombreAEliminar,
      comercioOProducto,
      nombreComercio,
      idDenuncia,
      nombreUsuario,
      coordenadaListView
    ) =>
      dispatch(
        GestionComerciosActions.mensajeEliminar3(
          nombreAEliminar,
          comercioOProducto,
          nombreComercio,
          idDenuncia,
          nombreUsuario,
          coordenadaListView,
          "pagDenuncia"
        )
      ),
    denunciaRevisada: idDenuncia =>
      dispatch(GestionComerciosActions.denunciaRevisada(idDenuncia))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagDenunciaAdmin);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  },
  container2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    padding: 10,
    backgroundColor: "#36ada4"
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5
  },
  lineaBotones: {
    height: winHeight * 0.08,
    marginTop: "3.5%",
    flexDirection: "row",
    marginBottom: "1%"
  },
  lineaBotones2: {
    height: winHeight * 0.08,
    marginTop: winHeight * 0.4,
    flexDirection: "row",
    marginBottom: "1%"
  },
  imgRevisado: {
    width: winWidth * 0.8,
    height: winHeight * 0.4,
    resizeMode: "cover",
    borderColor: "#8E8E8E",
    borderWidth: 2
    // marginRight: 10
  },
  rowViewContainer0: {
    fontSize: 24,
    flex: 1,
    color: "black",
    fontWeight: "bold"
  },
  rowViewContainer1: {
    fontSize: 22,
    flex: 1,
    color: "black"
  },
  rowViewContainer2: {
    fontSize: 22,
    flex: 1,
    color: "black"
  },
  rowViewContainer3: {
    fontSize: 24,
    flex: 1,
    color: "black",
    fontWeight: "bold"
  },
  imgPlaceholder: {
    height: 65,
    resizeMode: "contain",
    marginTop: 30,
    marginBottom: 30
  },
});
