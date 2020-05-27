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

import MainActions from "./../actions/Main";
import LoginActions from "./../actions/Login";
import PerfilRegistradoActions from "./../actions/PerfilRegistrado";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class PerfilRegistrado extends Component {
  static navigationOptions = {
    title: "Perfil de Usuario",
    headerRight: (
      <View>
        <TouchableOpacity
          onPress={() => {
            Actions.Main();
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
      //isLoading: true,
      idUsuario: null,
      nombreUsuario: null,
      emailUsuario: null,
      imageSource: null,
      isStorageLoaded: false
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem("name").then(value => {
      this.setState({
        nombreUsuario: value
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
            isStorageLoaded: true,
            idUsuario: responseJson[0].idRegistrado,
            nombreUsuario: responseJson[0].name,
            emailUsuario: responseJson[0].email,
            imageSource: responseJson[0].imagen
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

  pararLoader() {
    this.props.pararLoader();
  }

  cargarLoader() {
    this.props.cargarLoader();
  }

  render() {
    let { hasError, isLoading } = this.props;
    let { isStorageLoaded } = this.state;
    var Image_Http_URL = {
      uri: "https://thegreenways.es/" + this.state.imageSource
    };
    if (!isStorageLoaded) {
      return <Loader loading={true} />;
    } else {
      return (
        <View style={styles.MainContainer}>
          <View>
            <View style={{ height: "79.5%", justifyContent: "center" }}>
              <View>
                <Text style={styles.bigblack}>Datos de la cuenta</Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "30%" }}>
                  <Text style={styles.tinyblack}>Nombre:</Text>
                </View>
                <View style={{ width: "70%" }}>
                  <Text
                    style={{
                      textAlign: "left",
                      color: "black",
                      fontSize: 20,
                      marginTop: 15
                    }}
                  >
                    {this.state.nombreUsuario}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "30%" }}>
                  <Text style={styles.tinyblack}>Email:</Text>
                </View>
                <View style={{ width: "70%" }}>
                  <Text
                    style={{
                      textAlign: "left",
                      color: "black",
                      fontSize: 20,
                      marginTop: 15,
                      marginBottom: 15
                    }}
                  >
                    {this.state.emailUsuario}
                  </Text>
                </View>
              </View>

              <View>
                <Text style={styles.bigblack2}>Imagen de perfil:</Text>
              </View>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <ImageLoad
                  style={{
                    resizeMode: "cover",
                    width: 230,
                    height: 230,
                    borderColor: "#8E8E8E",
                    borderWidth: 2,
                    marginTop: "4%",
                    marginBottom: "6%"
                  }}
                  resizeMethod={"resize"}
                  source={Image_Http_URL}
                  placeholderSource={require("GreenWaysProject/images/time.png")}
                  isShowActivity={false}
                  placeholderStyle={styles.imgPlaceholder}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row"
              }}
            >
              <View
                style={{
                  width: "49%",
                  marginRight: "1%"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.goModificarPerfilRegistrado();
                  }}
                >
                  <View
                    style={{
                      height: winHeight * 0.08,
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
                    <Text style={styles.textoBotones}>{"EDITAR PERFIL"}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: "49%",
                  marginLeft: "1%"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.goCambiarPass();
                  }}
                >
                  <View
                    style={{
                      height: winHeight * 0.08,
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
                    <Text style={styles.textoBotones}>{"CAMBIAR PASS"}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: "2%",
                marginBottom: "2%"
              }}
            >
              <View
                style={{
                  width: "49%",
                  marginRight: "1%"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.goPrincipal();
                  }}
                >
                  <View
                    style={{
                      height: winHeight * 0.08,
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
                    <Text style={styles.textoBotones}>{"VOLVER"}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: "49%",
                  marginLeft: "1%"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.logout();
                  }}
                >
                  <View
                    style={{
                      height: winHeight * 0.08,
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
                    <Text style={styles.textoBotones}>{"CERRAR SESIÓN"}</Text>
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
    hasError: state.perfilRegistrado.hasError,
    isLoading: state.perfilRegistrado.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goCatalogoCliente: () => dispatch(MainActions.goCatalogoCliente()),
    goPrincipal: () => dispatch(MainActions.goPrincipal()),
    goModificarPerfilRegistrado: () =>
      dispatch(PerfilRegistradoActions.goModificarPerfilRegistrado()),
    goCambiarPass: () => dispatch(PerfilRegistradoActions.goCambiarPass()),
    logout: () => dispatch(LoginActions.logout()),
    pararLoader: () => dispatch(PerfilRegistradoActions.pararLoader()),
    cargarLoader: () => dispatch(PerfilRegistradoActions.cargarLoader())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PerfilRegistrado);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: "2%"
  },
  container2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    padding: 10,
    backgroundColor: "#36ada4",
    justifyContent: "center",
    alignItems: "center"
  },
  tinyblack: {
    color: "black",
    fontWeight: "bold",
    fontSize: 19,
    marginTop: 15,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  tinyblack2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 19,
    marginTop: 15,
    marginLeft: 10,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  bigblack2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 21,
    marginTop: 20,
    marginBottom: "1%"
  },
  bigblack: {
    color: "black",
    fontWeight: "bold",
    fontSize: 21,
    marginTop: 20
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
