import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import AsyncStorage from '@react-native-community/async-storage';
import ImageLoad from "react-native-image-placeholder";

import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";

import Loader from "./../components/Loader";
import GestionUsuariosRegistradosActions from "./../actions/GestionUsuariosRegistrados";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class PagFeedbackAdmin extends Component {
  static navigationOptions = {
    title: "Página de valoración",
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
      revisarComprador: null,
      primerFeedback: null,
      revisar: null,
      name: null,
      nombreComercio: null,
      nombreProducto: null,
      imagen: null,
      idFeedback: null,
      nota: null,
      titulo: null,
      comentario: null,
      isStorageLoaded: false,
      coordenadaListView: null
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem("feedback").then(value => {
      this.setState({
        idFeedback: value
      });
    });

    await AsyncStorage.getItem("filaInicioFeedback").then(value => {
      this.setState({
        coordenadaListView: value
      });
      //  alert(this.state.coordenadaListView);
    });

    return fetch("https://thegreenways.es/pagFeedback.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idFeedback: this.state.idFeedback })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            name: responseJson[0].name,
            nombreComercio: responseJson[0].nombreComercio,
            nombreProducto: responseJson[0].nombreProducto,
            imagen: responseJson[0].imagen,
            revisarComprador: responseJson[0].revisarComprador,
            primerFeedback: responseJson[0].primerFeedback,
            revisar: responseJson[0].revisar,
            nota: responseJson[0].nota,
            titulo: responseJson[0].titulo,
            comentario: responseJson[0].comentario,
            isStorageLoaded: true
          },
          function() {
            //State change
          }
        );

        this.props.feedbackRevisado(this.state.idFeedback);
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
            <View
              style={
                this.state.primerFeedback == "1"
                  ? { alignItems: "center", height: "46%" }
                  : { alignItems: "center", height: "89.4%" }
              }
            >
              <View
                style={{
                  height: winHeight * 0.06,
                  marginTop: winHeight * 0.02
                }}
              >
                <Text style={styles.rowViewContainer0}>
                  {this.state.nombreProducto != null
                    ? "Producto: " + this.state.nombreProducto
                    : "Comercio: " + this.state.nombreComercio}
                </Text>
              </View>
              <View
                style={
                  this.state.primerFeedback == "0"
                    ? { height: winHeight * 0.05 }
                    : { height: winHeight * 0.05 }
                }
              >
                <Text style={styles.rowViewContainer1}>
                  {this.state.titulo}
                </Text>
              </View>

              <View
                style={
                  this.state.primerFeedback == "0"
                    ? {
                        height: winHeight * 0.14,
                        marginBottom: winHeight * 0.02,
                        marginTop: winHeight * 0.02
                      }
                    : {
                        height: winHeight * 0.14,
                        marginBottom: winHeight * 0.02,
                        marginTop: winHeight * 0.02
                      }
                }
              >
                <Text style={styles.rowViewContainer2}>
                  {this.state.comentario}
                </Text>
              </View>

              <View
                style={
                  this.state.primerFeedback == "0" ? { flex: 1 } : { flex: 0 }
                }
              >
                <View
                  style={
                    this.state.primerFeedback == "0" ? { flex: 1 } : { flex: 0 }
                  }
                >
                  <ImageLoad
                    style={
                      this.state.primerFeedback == "0"
                        ? styles.imgRevisado
                        : { flex: 0 }
                    }
                    source={{
                      uri: "https://thegreenways.es/" + this.state.imagen
                    }}
                    resizeMethod={"resize"}
                    placeholderSource={require("GreenWaysProject/images/time.png")}
                    isShowActivity={false}
                    placeholderStyle={styles.imgPlaceholder}
                  />
                </View>
                <View
                  style={
                    this.state.primerFeedback == "0"
                      ? {
                          marginTop: winHeight * 0.4,
                          justifyContent: "center",
                          alignItems: "center"
                        }
                      : { flex: 0 }
                  }
                >
                  <Text
                    style={
                      this.state.primerFeedback == "0"
                        ? styles.rowViewContainer3
                        : { color: "transparent" }
                    }
                  >
                    {this.state.name}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={
                this.state.primerFeedback == "0"
                  ? styles.lineaBotones
                  : styles.lineaBotones2
              }
            >
              <View style={{ flex: 0.5 }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.mensajeEliminarPagFeedback(
                      this.state.nombreProducto == null
                        ? this.state.nombreComercio
                        : this.state.nombreProducto,
                      this.state.idFeedback,
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
    mensajeEliminarPagFeedback: (
      nombreAEliminar,
      idFeedback,
      nombreUsuario,
      coordenadaListView
    ) =>
      dispatch(
        GestionUsuariosRegistradosActions.mensajeEliminar0bis(
          nombreAEliminar,
          idFeedback,
          nombreUsuario,
          coordenadaListView,
          "pagFeedback"
        )
      ),
    feedbackRevisado: idFeedback =>
      dispatch(GestionUsuariosRegistradosActions.feedbackRevisado(idFeedback))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagFeedbackAdmin);

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
    color: "black",
    fontWeight: "bold"
  },
  rowViewContainer2: {
    fontSize: 19,
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
