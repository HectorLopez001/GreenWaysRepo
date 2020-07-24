import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import AsyncStorage from '@react-native-community/async-storage';
import ImageLoad from "react-native-image-placeholder";
import { HeaderBackButton } from 'react-navigation-stack';

import {
  StyleSheet,
  FlatList,
  Text,
  Alert,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions
} from "react-native";

import GestionUsuariosRegistradosActions from "./../actions/GestionUsuariosRegistrados";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class GestionFeedbacks extends Component {
  static navigationOptions = ({ navigation }) => {
    return{
      title: "Feedbacks",
      headerRight: (
        <View>
          <TouchableOpacity
            onPress={navigation.getParam('volverInicio')}
            style={{ padding: winHeight * 0.015 }}
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
      ),
      headerLeft:(<HeaderBackButton onPress={navigation.getParam('volverGestionUsuariosRegistrados') }/>)
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: new Animated.Value(0),
      coordenadaListView: null,
      datas: null,
      clicsPantallaActual: false,
      isStorageLoaded: false
    };
  }

  volverInicio = () => {
    this.props.volverInicio();
  };

  volverGestionUsuariosRegistrados = () => {
    this.props.volverGestionUsuariosRegistrados();
  };

  async componentDidMount() {

    this.props.navigation.setParams({
      volverInicio: this.volverInicio,
      volverGestionUsuariosRegistrados: this.volverGestionUsuariosRegistrados
    });

    await AsyncStorage.getItem("filaInicioFeedbackFinal").then(value => {
      this.setState({
        coordenadaListView: value
      });
    });

    return fetch("https://thegreenways.es/listaFeedbacks.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson === "No Results Found")
        {
          if (
            this.state.coordenadaListView === "0" ||
            this.state.coordenadaListView === null
          ) {

            this.setState({
              coordenadaListView: 1,
              isStorageLoaded: true
            });
          }
          else
          {
            this.setState({
              isStorageLoaded: true
            });
          }
        }
        else
        {

          if (
            this.state.coordenadaListView === "0" ||
            this.state.coordenadaListView === null
          ) {

           this.setState({
              datas: responseJson,
              coordenadaListView: 1,
              isStorageLoaded: true
            });
          }
          else
          {
            this.setState({
                datas: responseJson,
                isStorageLoaded: true
              });
          }

          setTimeout(() => {
            this.refs.listViewa.scrollToIndex({
              animated: true,
              index: parseInt(this.state.coordenadaListView) - 1
            });
          }, 50);

          //Reseteamos filaInicio a 0 para que cuando volvamos a recargar la página no vuelva a una posicion indicada anteriormente.
          AsyncStorage.setItem("filaInicioFeedbackFinal", (0).toString());
        }        
      })
      .catch(error => {
        console.error(error);
      });
  }

  cambioColor() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.backgroundColor, {
          delay: 0,
          duration: 2500,
          toValue: 1,
          isInteraction: false,
          useNativeDriver: false
        }),
        Animated.timing(this.state.backgroundColor, {
          delay: 0,
          duration: 2500,
          toValue: 0,
          isInteraction: false,
          useNativeDriver: false
        })
      ]),
      {
        iterations: 1000
      }
    ).start();
  }

  clickado(idFeedback) {
    this.props.clickado(idFeedback);

    if(this.state.clicsPantallaActual === false){
            
      this.setState ({
        clicsPantallaActual: true
      }); 
    }
  }

  GetItem(idFeedback, rowNumber) {
    AsyncStorage.setItem("feedback", idFeedback);
    AsyncStorage.setItem("filaInicioFeedback", rowNumber.toString());
    Actions.PagFeedbackAdmin();
  }

  render() {

    this.cambioColor();

    var coloro = this.state.backgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(121, 183, 0, 0.15)", "rgba(121, 183, 0, 0.35)"]
    });
    let { click, flicker } = this.props;
    let { isStorageLoaded } = this.state;
    if (!isStorageLoaded) {
      return <Loader loading={true} />;
    } else {
      return (
        <View style={styles.MainContainer}>
          <View style={styles.preContainer}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Ayuda",
                    "En ésta página puedes gestionar las valoraciones subidas a GreenWays, para ello pulsa sobre los iconos habilitados.\n\nSi un feedback resulta ser el primer feedback subido por un cierto usuario-comprador, de debera llevar a cabo también en ese mismo momento la primera revisión del perfil de este usuario.\n\nPuedes pulsar sobre cada valoración para verla en su página particular."
                  );
                }}
                style={{
                  paddingTop: winHeight * 0.01,
                  paddingBottom: winHeight * 0.01,
                  paddingLeft: 10,
                  paddingRight: 10
                }}
              >
                <Image
                  style={{
                    height: 26,
                    width: 26,
                    resizeMode: "cover"
                  }}
                  resizeMethod={"resize"}
                  source={require("GreenWaysProject/images/info8.png")}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{ justifyContent: "center", alignItems: "flex-start" }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: 18
                }}
              >
                Ayuda
              </Text>
            </View>
          </View>

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1
            }}
          />

          <FlatList
            ref="listViewa"
            getItemLayout={(data, index) => ({
              length: winHeight * 0.2533,
              offset: winHeight * 0.2533 * index,
              index
            })}
            // initialNumToRender={this.state.datas.length}
            data={this.state.datas}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={() => <View style={styles.listFooter} />}
            renderItem={({ item: rowData, index: rowNumber }) => (
              <TouchableOpacity
                onPress={() => {
                  this.clickado(rowData.idFeedback+"feedback");
                  this.GetItem(rowData.idFeedback, rowNumber);
                }}
              >
                <Animated.View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    height:
                      rowData.revisar !== "0" ||
                      click.includes(rowData.idFeedback+"feedback")
                        ? winHeight * 0.22
                        : winHeight * 0.22,
                    marginTop: winHeight * 0.015,
                    marginBottom: winHeight * 0.015,
                    backgroundColor:
                      rowData.revisar === "0" &&
                      !click.includes(rowData.idFeedback+"feedback") //&& flicker === "GestionFeedbacks"
                        ? coloro
                        : null
                  }}
                >
                  <View
                    style={
                      rowData.primerFeedback === "0"
                        ? {
                            height: winHeight * 0.21,
                            flex: 0.48,
                            justifyContent:
                              rowData.titulo.length +
                                rowData.comentario.length >
                              50
                                ? "flex-start"
                                : "center",
                            alignItems: "center"
                          }
                        : styles.container1SinComprador
                    }
                  >
                    <Text style={styles.rowViewContainer3}>
                      {rowData.idProducto !== null
                        ? "Producto: " + rowData.nombreProducto
                        : "Comercio: " + rowData.nombreComercio}
                    </Text>
                    <Text style={styles.rowViewContainer5}>
                      {rowData.titulo}
                    </Text>
                    <Text style={styles.rowViewContainer4}>
                      {rowData.primerFeedback !== "0" &&
                      rowData.titulo.length + rowData.comentario.length > 150
                        ? rowData.comentario.substring(0, 130) + "..."
                        : rowData.primerFeedback === "0" &&
                          rowData.titulo.length + rowData.comentario.length > 70
                        ? rowData.comentario.substring(0, 38) + "..."
                        : rowData.comentario}
                    </Text>
                  </View>

                  <View
                    style={
                      rowData.primerFeedback === "0"
                        ? { flex: 0.445 }
                        : { flex: 0 }
                    }
                  >
                    <Image
                      style={
                        rowData.primerFeedback === "0"
                          ? styles.imgRevisado
                          : { flex: 0 }
                      }
                      source={{
                        uri: "https://thegreenways.es/" + rowData.imagen
                      }}
                      resizeMethod={"resize"}
                    />

                    <View
                      style={
                        rowData.primerFeedback === "0"
                          ? {
                              //  flex: 0.445,
                              justifyContent: "center",
                              alignItems: "center"
                            }
                          : { flex: 0 }
                      }
                    >
                      <Text
                        style={
                          rowData.primerFeedback === "0"
                            ? styles.rowViewContainerNombreUsuario
                            : { color: "transparent" }
                        }
                      >
                        {rowData.name}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={
                      rowData.revisar === "0" &&
                      !click.includes(rowData.idFeedback+"feedback")
                        ? styles.container2
                        : styles.container2SinTick
                    }
                  >
                    <View
                      style={
                        rowData.revisar === "0" &&
                        !click.includes(rowData.idFeedback+"feedback")
                          ? styles.mostrarTick
                          : styles.ocultarTick
                      }
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.props.feedbackRevisado(rowData.idFeedback),
                            this.clickado(rowData.idFeedback+"feedback");
                        }}
                      >
                        <Image
                          style={styles.mostrarTickImagen}
                          resizeMethod={"resize"}
                          source={require("GreenWaysProject/images/tick2.png")}
                        />
                      </TouchableOpacity>
                    </View>

                    <View>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.mensajeEliminar(
                            rowData.nombreProducto === null
                              ? rowData.nombreComercio
                              : rowData.nombreProducto,
                            rowData.idFeedback,
                            rowData.name,
                            rowNumber
                          )
                        }
                      >
                        <Image
                          style={{
                            height: winWidth * 0.147,
                            width: winWidth * 0.147,
                            resizeMode: "cover",
                            marginRight: 8,
                            marginTop: 8
                            //marginBottom: 10
                          }}
                          resizeMethod={"resize"}
                          source={require("GreenWaysProject/images/eliminar3.png")}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            )}
          />

          <View
            style={{
              marginTop: "0.5%",
              marginBottom: "1%"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.goGestionUsuariosRegistrados(this.state.clicsPantallaActual);
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
                  //  marginTop: 5,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.textoBotones}>VOLVER</Text>
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
    click: state.gestionFeedbacks.click,
    flicker: state.mainAdmin.flicker
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goGestionUsuariosRegistrados: (clicsPantallaActual) =>
      dispatch(
        GestionUsuariosRegistradosActions.goGestionUsuariosRegistrados2(clicsPantallaActual)
      ),
    mensajeEliminar: (nombreAEliminar, idFeedback, nombreUsuario, rowNumber) =>
      dispatch(
        GestionUsuariosRegistradosActions.mensajeEliminar0(
          nombreAEliminar,
          idFeedback,
          nombreUsuario,
          rowNumber,
          "listaFeedbacks"
        )
      ),
    feedbackRevisado: idFeedback =>
      dispatch(GestionUsuariosRegistradosActions.feedbackRevisado(idFeedback)),
    clickado: idFeedback =>
      dispatch(GestionUsuariosRegistradosActions.clickado2(idFeedback)),
    volverInicio: () =>
      dispatch(GestionUsuariosRegistradosActions.volverInicio()),
    volverGestionUsuariosRegistrados: () =>
      dispatch(GestionUsuariosRegistradosActions.goGestionUsuariosRegistrados3())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GestionFeedbacks);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    flex: 1,
    //marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  },
  preContainer: {
    flexDirection: "row",
    margin: 0,
    height: winHeight * 0.06
  },
  container: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10
  },
  container1: {
    //marginTop: winHeight * 0.02,
    height: winHeight * 0.21,
    flex: 0.48,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  container1SinComprador: {
    marginBottom: winHeight * 0.01,
    height: winHeight * 0.21,
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center"
  },
  container3: {
    flex: 0.425,
    justifyContent: "center",
    alignItems: "center"
  },
  container3SinComprador: {
    flex: 0
  },
  container2: {
    marginTop: winHeight * 0.095,
    marginRight: 5,
    marginLeft: 5,
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center"
  },
  container2SinTick: {
    marginRight: 5,
    marginLeft: 5,
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center"
    // marginBottom: winHeight * 0.01
  },
  rowViewContainer2: {
    fontSize: 21,
    fontWeight: "bold",
    color: "black",
    flex: 1
  },
  rowViewContainer3: {
    fontSize: 19,
    // flex: 1,
    color: "black",
    fontWeight: "bold"
  },
  rowViewContainerNombreUsuario: {
    fontSize: 19,
    // flex: 1,
    color: "black",
    fontWeight: "bold"
  },
  rowViewContainer4: {
    fontSize: 16,
    // flex: 1,
    color: "black"
  },

  rowViewContainer5: {
    fontSize: 18,
    // flex: 1,
    color: "black"
  },
  separator: {
    height: StyleSheet.hairlineWidth + 2,
    backgroundColor: "#8E8E8E"
  },
  listFooter: {
    height: StyleSheet.hairlineWidth + 2,
    backgroundColor: "#8E8E8E"
  },
  button: {
    backgroundColor: "#36ada4"
  },
  lineaBotones: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "2%"
  },
  img: {
    height: 150,
    resizeMode: "cover",
    borderColor: "#8E8E8E",
    borderWidth: 2,
    marginRight: 10
  },
  imgRevisado: {
    flex: 1,
    //height: winHeight,
    resizeMode: "cover",
    borderColor: "#8E8E8E",
    borderWidth: 2,
    marginRight: 10
  },
  mostrarTick: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center"
  },
  ocultarTick: {
    display: "none"
  },
  mostrarTickImagen: {
    width: winWidth * 0.14,
    height: winWidth * 0.14,
    resizeMode: "cover",
    borderColor: "black",
    marginRight: 14,
    marginTop: winHeight * 0.06,
    marginBottom: winHeight * 0.16,
    marginLeft: 5,
    borderWidth: 1,
    borderRadius: 100
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
