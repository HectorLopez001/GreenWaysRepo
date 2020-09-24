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

import GestionComerciosActions from "./../actions/GestionComercios";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class GestionDenuncias extends Component {
  static navigationOptions = ({ navigation }) => {
    return{
      title: "Denuncias",
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
      headerLeft:(<HeaderBackButton onPress={navigation.getParam('volverGestionComercios') }/>)
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

  volverGestionComercios = () => {
    this.props.volverGestionComercios();
  };

  async componentDidMount() {

    this.props.navigation.setParams({
      volverInicio: this.volverInicio,
      volverGestionComercios: this.volverGestionComercios
    });

    await AsyncStorage.getItem("filaInicioDenunciaFinal").then(value => {
      this.setState({
        coordenadaListView: value
      });
    });

    return fetch("https://thegreenways.es/listaDenuncias.php", {
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
            this.state.coordenadaListView == null
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

            this.setState(
              {
                coordenadaListView:1,
                datas: responseJson,
                isStorageLoaded: true
              });
          }
          else
          {
            this.setState(
              {
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
          AsyncStorage.setItem("filaInicioDenunciaFinal", (0).toString());
          this.props.resetearClicks();
        }

        // setTimeout(() => {
        //   this.cambioColor();
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

  clickado(idDenuncia) {
    this.props.clickado(idDenuncia);

    if(this.state.clicsPantallaActual === false){
            
      this.setState ({
        clicsPantallaActual: true
      }); 
    }
  }

  GetItem(idDenuncia, rowNumber) {
    AsyncStorage.setItem("denuncia", idDenuncia);
    AsyncStorage.setItem("filaInicioDenuncia", rowNumber.toString());
    Actions.PagDenunciaAdmin();
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
                    "En ésta página puedes gestionar las denuncias subidas a GreenWays, para ello pulsa sobre los iconos habilitados.\n\nPuedes pulsar sobre cada denuncia para verla en su página particular."
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
                  source={{
                    uri: "https://thegreenways.es/upload/images/info8.png"
                  }}
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
              length: winHeight * 0.28245,
              offset: winHeight * 0.28245 * index,
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
                  this.clickado(rowData.idDenuncia+"denuncia");
                  this.GetItem(rowData.idDenuncia, rowNumber);
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
                      !click.includes(rowData.idDenuncia+"denuncia") //&& flicker === "GestionDenuncias"
                        ? coloro
                        : null
                  }}
                >
                  <View style={styles.container1}>
                    <Text style={styles.rowViewContainer3}>
                      {rowData.idProducto !== null
                        ? "Producto: " + rowData.nombreProducto
                        : "Comercio: " + rowData.nombreComercio}
                    </Text>
                    <Text style={styles.rowViewContainer5}>
                      {rowData.categoria}
                    </Text>
                    <Text style={styles.rowViewContainer4}>
                      {rowData.motivo.length + rowData.categoria.length < 85
                        ? rowData.motivo
                        : rowData.motivo.substring(0, 65) + "..."}
                    </Text>
                  </View>

                  <View style={{ flex: 0.445 }}>
                    <View
                      style={{
                        flex: 0.445
                      }}
                    >
                      <ImageLoad
                        style={styles.imgRevisado}
                        source={
                          rowData.idProducto !== null
                            ? {
                                uri:
                                  "https://thegreenways.es/" +
                                  rowData.imagenProducto
                              }
                            : {
                                uri:
                                  "https://thegreenways.es/" +
                                  rowData.imagenComercio
                              }
                        }
                        resizeMethod={"resize"}
                        placeholderSource={require("GreenWaysProject/images/time.png")}
                        isShowActivity={false}
                        placeholderStyle={styles.imgPlaceholder}
                        
                      />
                    </View>
                  </View>

                  <View style={styles.container2}>
                    <View
                      style={
                        rowData.revisar === "0" &&
                        !click.includes(rowData.idDenuncia+"denuncia")
                          ? styles.mostrarTick
                          : styles.ocultarTick
                      }
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.props.denunciaRevisada(rowData.idDenuncia),
                            this.clickado(rowData.idDenuncia+"denuncia");
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
                            rowData.nombreProducto === null
                              ? "comercio"
                              : "producto",
                            rowData.nombreProducto === null
                              ? "nada"
                              : rowData.nombreComercio,
                            rowData.idDenuncia,
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
                            marginBottom: 10
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
    click: state.gestionDenuncias.click,
    flicker: state.mainAdmin.flicker
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goGestionComercios: (clicsPantallaActual) =>
      dispatch(GestionComerciosActions.goGestionComercios3(clicsPantallaActual)),
    mensajeEliminar: (
      nombreAEliminar,
      comercioOProducto,
      nombreComercio,
      idDenuncia,
      nombreUsuario,
      rowNumber
    ) =>
      dispatch(
        GestionComerciosActions.mensajeEliminar3(
          nombreAEliminar,
          comercioOProducto,
          nombreComercio,
          idDenuncia,
          nombreUsuario,
          rowNumber,
          "listaDenuncias"
        )
      ),
    denunciaRevisada: idDenuncia =>
      dispatch(GestionComerciosActions.denunciaRevisada(idDenuncia)),
    clickado: idDenuncia =>
      dispatch(GestionComerciosActions.clickado3(idDenuncia)),
    volverInicio: () =>
      dispatch(GestionComerciosActions.volverInicio()),
    volverGestionComercios: () =>
      dispatch(GestionComerciosActions.goGestionComercios2()),
    resetearClicks:() => dispatch(GestionComerciosActions.resetearClicks())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GestionDenuncias);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    flex: 1,
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
    flex: 0.48,
    justifyContent: "flex-start",
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
    color: "black",
    fontWeight: "bold"
  },
  rowViewContainer4: {
    fontSize: 17,
    flex: 1,
    color: "black"
  },
  rowViewContainer5: {
    fontSize: 17,
    flex: 1,
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
    flex: 0.3,
    height: 150,
    resizeMode: "cover",
    borderColor: "#8E8E8E",
    borderWidth: 2,
    marginRight: 10,
    marginTop: winHeight * 0.015,
    marginBottom: winHeight * 0.015
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
    marginTop: winHeight * 0.02,
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
