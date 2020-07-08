import React, { Component } from "react";
import { connect } from "react-redux";
import { HeaderBackButton } from 'react-navigation-stack';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from "react-native-router-flux";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions
} from "react-native";

import GestionComerciosActions from "./../actions/GestionComercios";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class GestionCatalogoProductos extends Component {
  static navigationOptions = ({ navigation }) => {
    return{
      title: "Catálogos de los Comercios",
      headerRight: (
        <View>
          <TouchableOpacity
            onPress={navigation.getParam('volverInicio')}
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
      ),
      headerLeft:(<HeaderBackButton onPress={navigation.getParam('volverGestionComercios') }/>)
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: new Animated.Value(0),
      dataSource: null,
      nombreUsuario: null,
      coordenadaListView: null,
      datas: null,
      isStorageLoaded: false
    };
  }

  GetItem(nombreComercio, idComercio, rowNumber) {
    //Alert.alert(nombreComercio);
    AsyncStorage.setItem("comercio", nombreComercio);
    AsyncStorage.setItem("idComercio", idComercio);
    //AsyncStorage.setItem("sceneAnterior", "listaComercios");
    AsyncStorage.setItem("filaInicio", rowNumber.toString());
    // AsyncStorage.setItem("sceneComerciosAnterior", "listaComercios");

    this.props.goCatalogoProductosAdmin();

    //Actions.CatalogoProductosAdmin();
  }

  volverInicio = () => {
    this.props.volverInicio();
  };

  volverGestionComercios = () => {
    this.props.volverGestionComercios();
  };

  async componentDidMount() {

    this.props.navigation.setParams({
      volverInicio: this.volverInicio,
      volverGestionComercios: this.volverGestionComercios
    });

    await AsyncStorage.getItem("filaInicioFinal").then(value => {
      this.setState({
        coordenadaListView: value
      });
    });

    return fetch("https://thegreenways.es/listaComerciosRevisarCatalogo.php")
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson === "No Results Found")
        {
          if (this.state.coordenadaListView == 0 ||
             this.state.coordenadaListView == null
          )  {
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
            this.state.coordenadaListView == 0 ||
            this.state.coordenadaListView == 1 ||
            this.state.coordenadaListView == null
          ) {
            this.setState({
              coordenadaListView: 2
            });
          }

          this.setState(
            {
              datas: responseJson,
              isStorageLoaded: true
            });

            if (this.state.coordenadaListView >= 3) {
            setTimeout(() => {
              this.refs.listViewa.scrollToIndex({
                animated: true,
                index: parseInt(this.state.coordenadaListView) - 2
              });
            }, 50);
          }

            AsyncStorage.setItem("filaInicioFinal", (0).toString());

          if (this.state.coordenadaListView >= 3) {
            this.setState(
              {
                datas: responseJson,
                isStorageLoaded: true
              },
              function() {
                setTimeout(() => {
                  this.refs.listViewa.scrollToIndex({
                    animated: true,
                    index: parseInt(this.state.coordenadaListView) - 2
                  });
                }, 50);

                //Reseteamos filaInicio a 0 para que cuando volvamos a recargar la página no vuelva a una posicion indicada anteriormente.
                AsyncStorage.setItem("filaInicioFinal", (0).toString());
              }
            );
          } else {
            this.setState(
              {
                datas: responseJson,
                isStorageLoaded: true
              },
              function() {
                //Reseteamos filaInicio a 0 para que cuando volvamos a recargar la página no vuelva a una posicion indicada anteriormente.
                AsyncStorage.setItem("filaInicioFinal", (0).toString());
              }
            );
          }
        }
        // setTimeout(() => {
        //   this.cambioColor();
        //   //  this.props.revisadosProductos(this.state.nombreComercio);
        // }, 1000);
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

  clickado(nombreComercio) {
    // alert(nombreProducto);
    this.props.clickado(nombreComercio);
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
                    "En ésta página puedes elegir el/los comercio(s) cuyo catálogo de productos deseas gestionar, para ello pulsa sobre cada comercio.\n\n Los catálogos de productos que deben ser revisados, si los hay, se muestran en la parte superior de la lista y su fila se resalta con un color distinto que los demas."
                  );
                }}
                style={{
                  paddingTop: 7,
                  paddingBottom: 7,
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

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text
                style={{
                  color: "black",
                  fontSize: 18
                }}
              >
                Pulsa aquí para obtener ayuda.
              </Text>
            </View>
          </View>

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1
            }}
          />

          <View style={{ height: "84.5%" }}>
            <FlatList
              ref="listViewa"
              getItemLayout={(data, index) => ({
                length: 71,
                offset: 71 * index,
                index
              })}
              data={this.state.datas}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListFooterComponent={() => <View style={styles.listFooter} />}
              //  initialNumToRender={this.state.datas.length}
              renderItem={({ item: rowData, index: rowNumber }) => (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      //this.clickado(rowData.nombreComercio);
                      this.GetItem(
                        rowData.nombreComercio,
                        rowData.idComercio,
                        rowNumber
                      );
                    }}
                  >
                    <Animated.View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        paddingTop: 15,
                        paddingBottom: 15,
                        marginTop: 5,
                        marginBottom: 5,
                        backgroundColor:
                          rowData.revisarCatalogo == "0" &&
                          !click.includes(rowData.nombreComercio) //&& flicker === "GestionCatalogoProductos"
                            ? // click != rowData.nombreProducto
                              coloro
                            : null
                      }}
                    >
                      <View style={styles.container1}>
                        <Text style={styles.rowViewContainer2}>
                          {rowData.nombreComercio}
                        </Text>
                      </View>
                    </Animated.View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <View
              style={{
                width: winWidth * 0.9,
                height: winHeight * 0.06,
                marginBottom: winHeight * 0.1
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.goGestionComercios();
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
                  <Text style={styles.textoBotones}>{"VOLVER"}</Text>
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
    click: state.gestionComercios.click,
    flicker: state.mainAdmin.flicker
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goGestionComercios: () =>
      dispatch(GestionComerciosActions.goGestionComercios2()),
    clickado: nombreComercio =>
      dispatch(GestionComerciosActions.clickado(nombreComercio)),
    goCatalogoProductosAdmin: () =>
      dispatch(GestionComerciosActions.goCatalogoProductosAdmin()),
    volverInicio: () =>
      dispatch(GestionComerciosActions.volverInicio()),
    volverGestionComercios: () =>
      dispatch(GestionComerciosActions.goGestionComercios2())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GestionCatalogoProductos);

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  },

  preContainer: {
    flexDirection: "row",
    margin: 0
  },
  container: {
    flex: 1,
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20
  },
  container1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  container3: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center"
  },
  container2: {
    justifyContent: "center",
    alignItems: "center"
  },
  rowViewContainer2: {
    fontSize: 21,
    marginLeft: 10,
    fontWeight: "bold",
    color: "black",
    justifyContent: "center",
    alignItems: "center"
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
    width: 150,
    height: 150,
    resizeMode: "cover",
    borderColor: "#8E8E8E",
    borderWidth: 2
  },
  textoBotones: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white"
  },
  lineaBotones: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignItems: "center",
    height: winHeight * 0.06,
    marginTop: winHeight * 0.01
  }
});
