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

class PagComercioAdmin extends Component {
  static navigationOptions = {
    title: "Página del Comercio",
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
      idComercio: null,
      nombreComercio: null,
      descripcionComercio: null,
      imageSource: null,
      isStorageLoaded: false,
      coordenadaListView: null
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem("comercio").then(value => {
      this.setState({
        nombreComercio: value
      });
    });

    await AsyncStorage.getItem("filaInicioPagComercio").then(value => {
      this.setState({
        coordenadaListView: value
      });
      //  alert(this.state.coordenadaListView);
    });

    return fetch("https://thegreenways.es/pagComercio.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombreComercio: this.state.nombreComercio })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            // isLoading: false,
            idComercio: responseJson[0].idComercio,
            nombreComercio: responseJson[0].nombreComercio,
            descripcionComercio: responseJson[0].descripcionComercio,
            imageSource: responseJson[0].imagenComercio,
            isStorageLoaded: true
          },
          function() {
            //State change
          }
        );

        this.props.comercioRevisado(this.state.nombreComercio);
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
            <View style={{ alignItems: "center", height: "89%" }}>
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
                  {this.state.nombreComercio}
                </Text>
              </View>

              <View style={{ height: winHeight * 0.08 }}>
                <Text
                  style={{
                    textAlign: "left",
                    color: "black",
                    fontSize: 18,
                    marginBottom: 15
                  }}
                >
                  {this.state.descripcionComercio}
                </Text>
              </View>

              <View style={{ height: winHeight * 0.47 }}>
                <ImageLoad
                  style={{
                    resizeMode: "cover",
                    width: winWidth * 0.85,
                    height: winHeight * 0.47,
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
                style={{ height: winHeight * 0.1, marginTop: winHeight * 0.03 }}
              >
                <Text
                  style={{
                    textAlign: "left",
                    color: "black",
                    fontSize: 20,
                    fontWeight: "bold"
                  }}
                >
                  Localización: ##########################
                </Text>
              </View>
            </View>

            <View style={styles.lineaBotones}>
              <View style={{ flex: 0.5 }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.mensajeEliminarPagComercio(
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
    mensajeEliminarPagComercio: (nombreComercio, coordenadaListView) =>
      dispatch(
        GestionComerciosActions.mensajeEliminar(
          nombreComercio,
          coordenadaListView,
          "pagComercio"
        )
      ),
    comercioRevisado: nombreComercio =>
      dispatch(GestionComerciosActions.comercioRevisado(nombreComercio))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagComercioAdmin);

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
  imgPlaceholder: {
    height: 80,
    resizeMode: "contain",
    marginTop: 20,
    marginBottom: 20
  },
});
