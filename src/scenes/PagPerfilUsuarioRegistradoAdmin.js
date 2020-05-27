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

import GestionUsuariosRegistradosActions from "./../actions/GestionUsuariosRegistrados";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class PagPerfilUsuarioRegistradoAdmin extends Component {
  static navigationOptions = {
    title: "Perfiles de Usuario",
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
      idUsuario: null,
      nombreUsuario: null,
      email: null,
      imageSource: null,
      isStorageLoaded: false,
      revisado: null,
      coordenadaListView: null,
      coordenadaListViewPagActual: null
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem("usuarioRegistrado").then(value => {
      this.setState({
        nombreUsuario: value
      });
    });

    await AsyncStorage.getItem("filaInicioPerfilUsuario").then(value => {
      this.setState({
        coordenadaListView: value
      });
    });

    await AsyncStorage.getItem("filaInicioPagActual2").then(value => {
      this.setState({
        coordenadaListViewPagActual: value
      });
    });

    return fetch("https://thegreenways.es/pagPerfilRegistrado.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombreUsuario: this.state.nombreUsuario })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            // isLoading: false,
            idUsuario: responseJson[0].idRegistrado,
            nombreUsuario: responseJson[0].name,
            email: responseJson[0].email,
            imageSource: responseJson[0].imagen,
            revisado: responseJson[0].revisar,
            isStorageLoaded: true
          },
          function() {
            //State change
          }
        );

        this.props.perfilUsuarioRevisado(this.state.nombreUsuario);
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
            <View style={{ alignItems: "center", height: "85%" }}>
              <View style={{ height: winHeight * 0.1 }}>
                <Text
                  style={{
                    textAlign: "center",
                    color: "black",
                    fontSize: 40,
                    fontWeight: "bold",
                    marginTop: 10,
                    marginBottom: 5
                  }}
                >
                  {this.state.nombreUsuario}
                </Text>
              </View>

              <View style={{ height: winHeight * 0.1 }}>
                <Text
                  style={{
                    textAlign: "left",
                    color: "black",
                    fontSize: 18,
                    marginBottom: 10,
                    marginTop: 5
                  }}
                >
                  {this.state.email}
                </Text>
              </View>

              <View style={{ height: winHeight * 0.54 }}>
                <ImageLoad
                  style={{
                    resizeMode: "cover",
                    width: winWidth * 0.9,
                    height: winHeight * 0.5,
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
            </View>

            <View style={styles.lineaBotones}>
              <View style={{ flex: 0.5 }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.mensajeEliminar(
                      this.state.nombreUsuario,
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
                        USUARIO
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

              <View
                style={{
                  flex: 0.5
                }}
              >
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
    //  isLogged: state.login.isLogged,
    //  hasError: state.register.hasError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    mensajeEliminar: (nombreUsuario, coordenadaListView) =>
      dispatch(
        GestionUsuariosRegistradosActions.mensajeEliminar(
          nombreUsuario,
          coordenadaListView,
          "pagUsuario"
        )
      ),
    perfilUsuarioRevisado: nombreUsuario =>
      dispatch(
        GestionUsuariosRegistradosActions.perfilUsuarioRevisado(nombreUsuario)
      )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagPerfilUsuarioRegistradoAdmin);

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
  lineaBotones: {
    height: winHeight * 0.08,
    marginTop: "10%",
    flexDirection: "row",
    marginBottom: "1%"
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
