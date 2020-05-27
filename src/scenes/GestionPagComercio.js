import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import AsyncStorage from '@react-native-community/async-storage';
import ImageLoad from "react-native-image-placeholder";

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

import GestionComerciosActions from "./../actions/GestionComercios";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class GestionPagComercio extends Component {
  static navigationOptions = {
    title: "Páginas de Comercio",
    headerRight: (
      <View>
        <TouchableOpacity
          onPress={() => {
            Actions.MainAdmin();
            return;
          }}
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
    )
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

  async componentDidMount() {
    await AsyncStorage.getItem("filaInicioPagComercioFinal").then(value => {
      this.setState({
        coordenadaListView: value
      });
    });

    return fetch("https://thegreenways.es/listaComercios.php", {
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
          AsyncStorage.setItem(
            "filaInicioPagComercioFinal",
            (0).toString()
          );          
        }

        setTimeout(() => {
          this.cambioColor();
          //  this.props.revisadosProductos(this.state.nombreComercio);
        }, 1000);

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
        iterations: 100
      }
    ).start();
  }

  clickado(nombreComercio) {
    this.props.clickado(nombreComercio);

    if(this.state.clicsPantallaActual === false){
            
      this.setState ({
        clicsPantallaActual: true
      }); 
    }
  }

  GetItem(nombreComercio, rowNumber) {
    //Alert.alert(nombreComercio);
    AsyncStorage.setItem("comercio", nombreComercio);
    //AsyncStorage.setItem("sceneAnterior", "listaComercios");
    AsyncStorage.setItem("filaInicioPagComercio", rowNumber.toString());
    //AsyncStorage.setItem("sceneComerciosAnterior", "listaComercios");
    Actions.PagComercioAdmin();
  }

  render() {
    var coloro = this.state.backgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(121, 183, 0, 0.15)", "rgba(121, 183, 0, 0.35)"]
    });
    let { click } = this.props;
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
                    "En ésta página puedes gestionar los comercios de GreenWays, para ello pulsa sobre el botón y los iconos habilitados.\n\nPuedes pulsar sobre cada comercio para verlos en su página particular."
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
              length: winHeight * 0.2535,
              offset: winHeight * 0.2535 * index,
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
                  this.clickado(rowData.nombreComercio);
                  this.GetItem(rowData.nombreComercio, rowNumber);
                }}
              >
                <Animated.View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: winHeight * 0.015,
                    marginBottom: winHeight * 0.015,
                    backgroundColor:
                      rowData.revisar === "0" &&
                      !click.includes(rowData.nombreComercio) // click != rowData.nombreComercio
                        ? coloro
                        : null
                  }}
                >
                  <View style={styles.container1}>
                    <Text style={styles.rowViewContainer2}>
                      {rowData.nombreComercio}
                    </Text>
                    <Text style={styles.rowViewContainer3}>
                      {rowData.localizacionComercio}
                    </Text>
                    <Text style={styles.rowViewContainer4}>
                      {rowData.localizacionComercio.length +
                        rowData.descripcionComercio.length >
                      70
                        ? rowData.descripcionComercio.substring(0, 50) + "..."
                        : rowData.descripcionComercio}
                    </Text>
                  </View>

                  <ImageLoad
                    style={styles.img}
                    source={{
                      uri: "https://thegreenways.es/" + rowData.imagenComercio
                    }}
                    resizeMethod={"resize"}
                    placeholderSource={require("GreenWaysProject/images/time.png")}
                    isShowActivity={false}
                    placeholderStyle={styles.imgPlaceholder}
                  />

                  <View style={styles.container2}>
                    <View
                      style={
                        rowData.revisar === "0" &&
                        !click.includes(rowData.nombreComercio)
                          ? styles.mostrarTick
                          : styles.ocultarTick
                      }
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.props.comercioRevisado(rowData.nombreComercio),
                            this.clickado(rowData.nombreComercio);
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
                            rowData.nombreComercio,
                            rowNumber
                          )
                        }
                      >
                        <Image
                          style={{
                            height: winWidth * 0.147,
                            width: winWidth * 0.147,
                            resizeMode: "cover",
                            marginRight: 8
                            // marginBottom: 10
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
                this.props.goGestionComercios(this.state.clicsPantallaActual);
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
                  //marginTop: winHeight * 0.007,
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
    // isLogged: state.login.isLogged,
    // hasError: state.register.hasError,
    // isLoading: state.register.isLoading
    click: state.gestionComercios2.click
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goGestionComercios: (clicsPantallaActual) =>
      dispatch(GestionComerciosActions.goGestionComercios(clicsPantallaActual)),
    mensajeEliminar: (nombreComercio, rowNumber) =>
      dispatch(
        GestionComerciosActions.mensajeEliminar(
          nombreComercio,
          rowNumber,
          "listaComercios"
        )
      ),
    revisadosHomeComercios: () =>
      dispatch(GestionComerciosActions.revisadosHomeComercios()),
    comercioRevisado: nombreComercio =>
      dispatch(GestionComerciosActions.comercioRevisado(nombreComercio)),
    clickado: nombreComercio =>
      dispatch(GestionComerciosActions.clickado2(nombreComercio))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GestionPagComercio);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    flex: 1,
    marginLeft: 10,
    marginRight: 10
  },
  preContainer: {
    flexDirection: "row",
    //margin: 0,
    height: winHeight * 0.06
  },
  container: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10
  },
  container1: {
    flex: 0.425,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  container1Revisado: {
    flex: 0.45,
    justifyContent: "center",
    alignItems: "center"
  },
  container3: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center"
  },
  container2: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center"
  },
  rowViewContainer2: {
    fontSize: 21,
    fontWeight: "bold",
    color: "black",
    flex: 1
  },
  rowViewContainer3: {
    fontSize: 19,
    flex: 1,
    color: "black"
  },
  rowViewContainer4: {
    fontSize: 17,
    flex: 1,
    color: "black"
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth + 2,
    backgroundColor: "#8E8E8E"
  },
  listFooter: {
    borderBottomColor: "#8E8E8E",
    borderBottomWidth: 2
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
    flex: 0.425,
    height: 150,
    resizeMode: "cover",
    borderColor: "#8E8E8E",
    borderWidth: 2,
    marginRight: 10
  },
  imgRevisado: {
    flex: 0.4,
    height: 150,
    resizeMode: "cover",
    borderColor: "#8E8E8E",
    borderWidth: 2,
    marginRight: 2
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
    marginTop: winHeight * 0.002,
    marginBottom: winHeight * 0.02,
    marginLeft: 4,
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
  }
});
