import React, { Component } from "react";
import { connect } from "react-redux";
import AsyncStorage from '@react-native-community/async-storage';
import ImageLoad from "react-native-image-placeholder";
import { HeaderBackButton } from 'react-navigation-stack';
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions
} from "react-native";

import GestionComerciosActions from "./../actions/GestionComercios";
import Loader from "./../components/Loader";

import { Actions } from "react-native-router-flux";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class CatalogoProductosAdmin extends Component {
  static navigationOptions = ({ navigation }) => {
    return{
      title: "Catálogo de Productos",
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
      headerLeft:(<HeaderBackButton onPress={navigation.getParam('volverGestionCatalogoProductos') }/>)
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      //  isLoading: true,
      dataSource: null,
      nombreComercio: null,
      idComercio: null,
      backgroundColor: new Animated.Value(0),
      coordenadaListView: null,
      coordenadaListViewPagActual: null,
      datas: null,
      clicsPantallaActual: false,
      isStorageLoaded: false,
      numeroProductosRevisables: 0
    };
  }

  GetItem(nombreProducto, rowNumber) {
    AsyncStorage.setItem("producto", nombreProducto);

    AsyncStorage.setItem("catalogo", "detalle");

    AsyncStorage.setItem("filaInicioPagActual", rowNumber.toString());

    Actions.PagProductoAdmin();
  }

  volverInicio = () => {
    this.props.volverInicio();
  };

  volverGestionCatalogoProductos = () => {
    this.props.volverGestionCatalogoProductos();
  };

  async componentDidMount() {

    this.props.navigation.setParams({
      volverInicio: this.volverInicio,
      volverGestionCatalogoProductos: this.volverGestionCatalogoProductos
    });
    
    await AsyncStorage.getItem("idComercio").then(value => {
      this.setState({
        idComercio: value
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

    await AsyncStorage.getItem("filaInicioPagActualFinal").then(value => {
      this.setState({
        coordenadaListViewPagActual: value
      });
    });

    fetch("https://thegreenways.es/listaProductos.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombreComercio: this.state.nombreComercio })
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson === "No Results Found")
        {
          if (this.state.coordenadaListViewPagActual === "0" || this.state.coordenadaListViewPagActual === null)
          {
              this.setState({
                coordenadaListViewPagActual: 1,
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

          let auxNumeroProductosRevisables = 0;
          for(let i=0 ; i<responseJson.length ; i++)
          {

           // alert(responseJson[0].revisar); 
            if(responseJson[i].revisar === "0")
            {
              auxNumeroProductosRevisables++;
            }
          }

          if(auxNumeroProductosRevisables > 0)
          {
            this.setState({
              numeroProductosRevisables: auxNumeroProductosRevisables
            })
          }
          



          if (this.state.coordenadaListViewPagActual === "0" || this.state.coordenadaListViewPagActual === null)
          {
            this.setState({
              coordenadaListViewPagActual: 1,
              datas: responseJson,
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

          if (this.state.coordenadaListViewPagActual > 1)
          {
            setTimeout(() => {
              this.refs.listViewa.scrollToIndex({
                animated: true,
                index: parseInt(this.state.coordenadaListViewPagActual) - 1
              });
            }, 50);
          }

          //Reseteamos filaInicio a 0 para que cuando volvamos a recargar la página no vuelva a una posicion indicada anteriormente.
          AsyncStorage.setItem("filaInicioPagActualFinal", (0).toString());
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

  clickado(nombreProducto) {
    // alert(nombreProducto);
    this.props.clickado(nombreProducto);

    if(this.state.clicsPantallaActual === false){
            
      this.setState ({
        clicsPantallaActual: true
      }); 
    }
  }

 productoRevisado(nombreProducto, nombreComercio, numeroProductosRevisables) {

    this.setState({
      numeroProductosRevisables: this.state.numeroProductosRevisables -1
    })

    this.props.productoRevisado(
      nombreProducto,
      nombreComercio,
      numeroProductosRevisables-1
    )
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
                    "En ésta página puedes gestionar el catálogo de productos de un comercio particular.\n\nSi es necesario borrar este comercio, pulsa sobre el botón habilitado.\n\nEs posible pulsar sobre cada fila de productos para verlos en su página particular.\n\nLos productos que deben ser revisados, si los hay, se muestran en la parte superior de la lista y su fila se resalta con un color distinto que las demás.\n\nPara dar por revisados los productos existen 3 posibilidades: Para revisarlos uno a uno (esto está pensado para listas grandes) utilizar el botón habilitado en cada fila con un 'tick'. También se dará un producto por revisado si se entra en su página particular. Asimismo, es posible dar por revisados todos los productos revisables de una sola vez, si los hay, pulsando sobre el botón 'Volver' y respondiendo afirmativamente a la pregunta formulada."
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
            //   initialNumToRender={this.state.datas.length}
            data={this.state.datas}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={() => <View style={styles.listFooter} />}
            renderItem={({ item: rowData, index: rowNumber }) => (
              <TouchableOpacity
                onPress={() => {
                  this.clickado(rowData.nombreProducto + rowData.idProducto);
                  this.productoRevisado(
                    rowData.nombreProducto,
                    this.state.nombreComercio,
                    this.state.numeroProductosRevisables
                  );
                  this.GetItem(rowData.nombreProducto, rowNumber);
                }}
              >
                <Animated.View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: winHeight * 0.015,
                    marginBottom: winHeight * 0.015,
                    justifyContent: "center",
                    alignItems: "center",
                    height:
                      rowData.revisar == "0" ||
                      click.includes(rowData.nombreProducto+rowData.idProducto)
                        ? winHeight * 0.22
                        : winHeight * 0.22,
                    // height: winHeight * 0.25,
                    backgroundColor:
                      rowData.revisar == "0" &&
                      !click.includes(rowData.nombreProducto+rowData.idProducto) 
                        ? coloro
                        : null
                  }}
                >
                  <View
                    style={
                      rowData.descripcionProducto.length < 40
                        ? styles.container1
                        : styles.container1Largo
                    }
                  >
                    <Text style={styles.rowViewContainer2}>
                      {rowData.nombreProducto}
                    </Text>

                    <Text style={styles.rowViewContainer3}>
                      {rowData.precio}
                    </Text>

                    <Text style={styles.rowViewContainer4}>
                      {rowData.descripcionProducto.length < 50
                        ? rowData.descripcionProducto
                        : rowData.descripcionProducto.substring(0, 50) + "..."}
                    </Text>
                  </View>

                  <ImageLoad
                    style={styles.img}
                    resizeMethod={"resize"}
                    source={{
                      uri: "https://thegreenways.es/" + rowData.imagenProducto
                    }}
                    placeholderSource={require("GreenWaysProject/images/time.png")}
                    isShowActivity={false}
                    placeholderStyle={styles.imgPlaceholder}
                  />

                  <View
                    style={
                      rowData.revisar == "0" &&
                      !click.includes(rowData.nombreProducto+rowData.idProducto)
                        ? styles.container2
                        : styles.container2SinTick
                    }
                  >
                    <View
                      style={
                        rowData.revisar == "0" &&
                        !click.includes(rowData.nombreProducto+rowData.idProducto)
                          ? styles.mostrarTick
                          : styles.ocultarTick
                      }
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.productoRevisado(
                            rowData.nombreProducto,
                            this.state.nombreComercio,
                            this.state.numeroProductosRevisables
                          ),
                          this.clickado(rowData.nombreProducto+rowData.idProducto);
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
                          this.props.mensajeEliminar2(
                            this.state.nombreComercio,
                            rowData.nombreProducto,
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

          <View style={styles.lineaBotones}>
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
                    height: winHeight * 0.08,
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
                        marginRight: 5
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
                  this.props.goGestionCatalogoProductos(
                    this.state.nombreComercio,
                    this.state.idComercio,
                    this.state.coordenadaListView,
                    this.state.clicsPantallaActual
                  );
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
    click: state.gestionComercios.click,
    flicker: state.mainAdmin.flicker
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goGestionCatalogoProductos: (
      nombreComercio,
      idComercio,
      coordenadaListView,
      clicsPantallaActual
    ) =>
      dispatch(
        GestionComerciosActions.volverGestionCatalogoProductos(
          nombreComercio,
          idComercio,
          coordenadaListView,
          clicsPantallaActual
        )
      ),
    mensajeEliminar: (nombreComercio, rowNumber) =>
      dispatch(
        GestionComerciosActions.mensajeEliminar(
          nombreComercio,
          rowNumber,
          "catalogoProductosAdmin"
        )
      ),
    mensajeEliminar2: (nombreComercio, nombreProducto, rowNumber) =>
      dispatch(
        GestionComerciosActions.mensajeEliminar2(
          nombreComercio,
          nombreProducto,
          rowNumber
        )
      ),
    revisadosProductos: nombreComercio =>
      dispatch(GestionComerciosActions.revisadosProductos(nombreComercio)),
    productoRevisado: (nombreProducto, nombreComercio, numeroProductosRevisables) =>
      dispatch(
        GestionComerciosActions.productoRevisado(nombreProducto, nombreComercio, numeroProductosRevisables)
      ),
    clickado: nombreProducto =>
      dispatch(GestionComerciosActions.clickado(nombreProducto)),
    volverInicio: () =>
      dispatch(GestionComerciosActions.volverInicio()),
    volverGestionCatalogoProductos: () =>
      dispatch(GestionComerciosActions.goGestionCatalogoProductos()),
    resetearClicks:() => dispatch(GestionComerciosActions.resetearClicks())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogoProductosAdmin);

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10
  },
  preContainer: {
    flexDirection: "row",
    height: winHeight * 0.06
  },
  container: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10
  },
  container1: {
    flex: 0.425,
    height: winHeight * 0.21,
    justifyContent: "center",
    alignItems: "center"
  },
  container1Largo: {
    flex: 0.425,
    height: winHeight * 0.21,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  container3: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5
  },
  rowViewContainer2: {
    fontSize: 21,
    fontWeight: "bold",
    color: "black",
    marginBottom: winHeight * 0.01
  },
  rowViewContainer3: {
    fontSize: 19,
    color: "black",
    marginBottom: winHeight * 0.01
  },
  rowViewContainer4: {
    fontSize: 17,
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
    marginTop: "0.5%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: "1%"
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
    marginTop: winHeight * 0.06,
    marginBottom: winHeight * 0.16,
    marginLeft: 5,
    borderWidth: 1,
    borderRadius: 100
  },
  container2: {
    marginTop: winHeight * 0.095,
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center"
  },
  container2SinTick: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: winHeight * 0.01
  },
  imgPlaceholder: {
    height: 65,
    resizeMode: "contain",
    marginTop: 30,
    marginBottom: 30
  },
});
