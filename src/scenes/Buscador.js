import React, { Component } from "react";
//import fetch from 'react-native-fetch-polyfill';

import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import AsyncStorage from '@react-native-community/async-storage';
import RadioButton from "radio-button-react-native";
import ImageLoad from "react-native-image-placeholder";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ScrollView,
  Keyboard,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { SearchBar, Icon } from "react-native-elements";
import MainActions from "./../actions/Main";
import BuscadorActions from "./../actions/Buscador";
import Loader from "./../components/Loader";

{/* <script src="http://localhost:8097"></script>   */}

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class Buscador extends Component {
  static navigationOptions = {
    title: "Buscador",
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
      datas: null,
      textoBusqueda: null,
      tipoBusqueda: 1,
      coordenadaListView: null,
      vistaInicial: 0,
      isStorageLoaded: true
    };
  }

  handleOnPress(tipoBusqueda) {
    this.setState({ tipoBusqueda: tipoBusqueda });
  }

  componentDidMount() {
    this.props.noMostrarlo();
  }

  traerResultados(textoBusqueda) {
    this.setState({ textoBusqueda: textoBusqueda });
  }

  async buscar() {
    Keyboard.dismiss();

    this.setState({ datas: null, vistaInicial: 1, isStorageLoaded: false });

    return fetch("https://thegreenways.es/buscador.php", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tipoBusqueda: this.state.tipoBusqueda,
        textoBusqueda: this.state.textoBusqueda
      })
    })
      .then(response => response.json())
      .then(responseJson => {

        if (responseJson === "No Results Found")
        {
          if (this.state.coordenadaListView <= 0)
          {
            this.setState(
              {
                coordenadaListView: 1,
                isStorageLoaded: true
              }            
            );
          }
          else
          {
            this.setState(
              {
                isStorageLoaded: true
              }            
            );
          }
          
          this.props.noMostrarlo();          
        }
        else{

          if (this.state.coordenadaListView <= 0)
          {
            this.setState({
              coordenadaListView: 1,
              datas: responseJson,
              isStorageLoaded: true
            })
          }
          else{
            this.setState({
              datas: responseJson,
              isStorageLoaded: true
            })
          }

          this.props.mostrarlo();



          // this.setState(
          //   {
          //     // isLoading: false
          //     datas: responseJson,
          //     isStorageLoaded: true
          //   },
          //   function() {
          //     this.props.mostrarlo();
          //     /*  setTimeout(() => {
          //       this.refs.listViewa.scrollToIndex({
          //         animated: true,
          //         index: parseInt(this.state.coordenadaListView) - 1
          //       });
          //     }, 50);*/
          //     //Reseteamos filaInicio a 0 para que cuando volvamos a recargar la página no vuelva a una posicion indicada anteriormente.
          //     //AsyncStorage.setItem("filaInicioDenunciaFinal", (0).toString());
          //   }
          // );
        }

        //alert(this.props.mostrar);
      })
      .catch(error => {
        console.error(error);
      });
  }

  GetItemProducto(nombreProducto, nombreComercio) {
    AsyncStorage.setItem("producto", nombreProducto);
    AsyncStorage.setItem("comercio", nombreComercio);

    //AsyncStorage.setItem("filaInicioFeedback", rowNumber.toString());
    Actions.PagProductoBuscador();
  }

  GetItemComercio(nombreComercio) {
    AsyncStorage.setItem("comercio", nombreComercio);

    //AsyncStorage.setItem("filaInicioFeedback", rowNumber.toString());
    Actions.PagComercioBuscador();
  }

  goScrollStart() {}

  render() {
    let { isStorageLoaded } = this.state;
    let { mostrar } = this.props;
    if (!isStorageLoaded) {
      return (<View style={styles.MainContainer}>
      <View style={{ flexDirection: "row" }}>
      <View
        style={{
          marginTop: winHeight * 0.021,
          marginRight: winWidth * 0.01,
          flex: 0.75
        }}
      >
        <SearchBar
          inputStyle={{
      //      marginTop: winHeight * 0.018,
            backgroundColor: "white",
            borderColor: "black",
            color: "black",
            fontSize: 16,
            height: winHeight * 0.04,
            marginLeft: 5,
            marginRight: 5,
            borderRadius: 10,
            borderColor:"black",
            borderWidth: 1
          }}
          containerStyle={{
            backgroundColor: "#79B700",
            borderColor: "black",
            borderWidth: 2,
            borderRadius: 20,
            height: winHeight * 0.1
          }}
          round
          value={this.state.textoBusqueda}
          placeholderTextColor={"black"}
          clearIcon
          //lightTheme
          onChangeText={textoBusqueda =>
            this.traerResultados(textoBusqueda)
          }
          onClearText={null}
          placeholder="Escribe aquí..."
        // showLoading
          platform="android"
          icon={{ type: "font-awesome", name: "search", color: "#484848" }}
        />
      </View>
      <View
        style={{
          flex: 0.25,
          marginTop: winHeight * 0.021,
          marginLeft: winWidth * 0.005
        }}
      >
        <TouchableOpacity
          onPress={() => {
            //this.goScrollStart();
            this.buscar();
          }}
        >
          <View
            style={{
              height: winHeight * 0.1,
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
            <Text style={styles.textoBotones}>BUSCAR</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.container3}>
      <View style={{ marginRight: winWidth * 0.04 }}>
        <RadioButton
          currentValue={this.state.tipoBusqueda}
          value={0}
          onPress={this.handleOnPress.bind(this)}
          outerCircleColor="black"
          outerCircleSize={24}
          outerCircleWidth={2}
          innerCircleColor="#79B700"
          innerCircleSize={12}
        >
          <Text style={styles.radio}>{" Comercio"}</Text>
        </RadioButton>
      </View>

      <View style={{ marginLeft: winWidth * 0.04 }}>
        <RadioButton
          currentValue={this.state.tipoBusqueda}
          value={1}
          onPress={this.handleOnPress.bind(this)}
          outerCircleColor="black"
          outerCircleSize={24}
          outerCircleWidth={2}
          innerCircleColor="#79B700"
          innerCircleSize={12}
        >
          <Text style={styles.radio}>{" Producto"}</Text>
        </RadioButton>
      </View>
    </View>

    <View
      style={{
        borderBottomColor: "black",
        borderBottomWidth: 1
      }}
    />
    
    <Loader loading={true} />

    <View style={{height: winHeight * 0.617}}>
    <View
            style={{
              marginTop: winHeight * 0.620,
              marginBottom: "1%"
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
    </View>);
    } else {
      return (
        <View style={styles.MainContainer}>
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                marginTop: winHeight * 0.021,
                marginRight: winWidth * 0.01,
                flex: 0.75
              }}
            >
              <SearchBar
                inputStyle={{
            //      marginTop: winHeight * 0.018,
                  backgroundColor: "white",
                  borderColor: "black",
                  color: "black",
                  fontSize: 16,
                  height: winHeight * 0.04,
                  marginLeft: 5,
                  marginRight: 5,
                  borderRadius: 10,
                  borderColor:"black",
                  borderWidth: 1
                }}
                containerStyle={{
                  backgroundColor: "#79B700",
                  borderColor: "black",
                  borderWidth: 2,
                  borderRadius: 20,
                  height: winHeight * 0.1
                }}
                round
                value={this.state.textoBusqueda}
                placeholderTextColor={"black"}
                clearIcon
                //lightTheme
                onChangeText={textoBusqueda =>
                  this.traerResultados(textoBusqueda)
                }
                onClearText={null}
                placeholder="Escribe aquí..."
              // showLoading
                platform="android"
                icon={{ type: "font-awesome", name: "search", color: "#484848" }}
              />
            </View>
            <View
              style={{
                flex: 0.25,
                marginTop: winHeight * 0.021,
                marginLeft: winWidth * 0.005
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  //this.goScrollStart();
                  this.buscar();
                }}
              >
                <View
                  style={{
                    height: winHeight * 0.1,
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
                  <Text style={styles.textoBotones}>BUSCAR</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.container3}>
            <View style={{ marginRight: winWidth * 0.04 }}>
              <RadioButton
                currentValue={this.state.tipoBusqueda}
                value={0}
                onPress={this.handleOnPress.bind(this)}
                outerCircleColor="black"
                outerCircleSize={24}
                outerCircleWidth={2}
                innerCircleColor="#79B700"
                innerCircleSize={12}
              >
                <Text style={styles.radio}>{" Comercio"}</Text>
              </RadioButton>
            </View>

            <View style={{ marginLeft: winWidth * 0.04 }}>
              <RadioButton
                currentValue={this.state.tipoBusqueda}
                value={1}
                onPress={this.handleOnPress.bind(this)}
                outerCircleColor="black"
                outerCircleSize={24}
                outerCircleWidth={2}
                innerCircleColor="#79B700"
                innerCircleSize={12}
              >
                <Text style={styles.radio}>{" Producto"}</Text>
              </RadioButton>
            </View>
          </View>

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1
            }}
          />

          <View style={{height: winHeight * 0.617}}>
            {mostrar == "si" ? (
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
                  ItemSeparatorComponent={() => (
                    <View
                      style={this.state.datas !== null ? styles.separator : null}
                    />
                  )}
                  ListFooterComponent={() => (
                    <View
                      style={this.state.datas !== null ? styles.listFooter : null}
                    />
                  )}
                  renderItem={({ item: rowData, index: rowNumber }) => (
                    <TouchableOpacity
                      onPress={() => {
                        rowData.idProducto != null
                          ? //  this.clickado(rowData.idDenuncia);
                            this.GetItemProducto(
                              rowData.nombreProducto,
                              rowData.nombreComercio
                            )
                          : this.GetItemComercio(rowData.nombreComercio);
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          marginTop: winHeight * 0.015,
                          marginBottom: winHeight * 0.015
                        }}
                      >
                        <View
                          style={
                            rowData.idProducto != null
                              ? styles.container1
                              : styles.container1bis
                          }
                        >
                          <Text style={styles.rowViewContainer3}>
                            {rowData.idProducto != null
                              ? rowData.nombreProducto
                              : rowData.nombreComercio}
                          </Text>
                          <Text style={styles.rowViewContainer5}>
                            {rowData.idProducto != null
                              ? rowData.descripcionProducto.length < 44
                                ? rowData.descripcionProducto
                                : rowData.descripcionProducto.substring(0, 45) +
                                  "..."
                              : rowData.descripcionComercio.length < 44
                              ? rowData.descripcionComercio
                              : rowData.descripcionComercio.substring(0, 65) +
                                "..."}
                          </Text>
                          <Text style={styles.rowViewContainer4}>
                            {rowData.idProducto != null
                              ? rowData.precio
                              : rowData.localizacionComercio}
                          </Text>
                        </View>

                        <View
                          style={
                            rowData.idProducto != null
                              ? { flex: 0.33 }
                              : { flex: 0.5 }
                          }
                        >
                          <View
                            style={{
                              flex: 0.445,
                              marginRight: 1
                            }}
                          >
                            <ImageLoad
                              style={styles.imgRevisado}
                              source={
                                rowData.idProducto != null
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

                        {rowData.idProducto != null ? (
                          <View style={styles.container2}>
                            <Text style={styles.rowViewContainer3Comercio}>
                              {rowData.nombreComercio}
                            </Text>

                            <Text style={styles.rowViewContainer4}>
                              {rowData.localizacionComercio}
                            </Text>

                            <View
                              style={{
                                width: winWidth * 0.3,
                                justifyContent: "center",
                                alignItems: "center"
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  this.GetItemComercio(rowData.nombreComercio);
                                }}
                              >
                                <Image
                                  style={styles.imgFlecha}
                                  resizeMethod={"resize"}
                                  source={require("GreenWaysProject/images/flecha1.png")}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  )}
                />
            ) : this.state.vistaInicial === 1 &&
              this.state.datas === null &&
              this.state.isStorageLoaded === true ? 
                <Text style={styles.mensajeNoCoincidencia}>
                  {"No existen coincidencias para el término introducido."}
                </Text>
            : null}
            </View>

          <View
            style={{
              marginTop: "0.5%",
              marginBottom: "1%"
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
    mostrar: state.buscador.mostrar
  };
};

const mapDispatchToProps = dispatch => {
  return {
    //cambiarMostrar: string => dispatch(BuscadorActions.cambiarMostrar(string)),
    noMostrarlo: () => dispatch(BuscadorActions.noMostrarlo()),
    mostrarlo: () => dispatch(BuscadorActions.mostrarlo()),
    goPrincipal: () => dispatch(MainActions.goPrincipal())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Buscador);

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10
  },
  button: {
    padding: 10,
    backgroundColor: "#36ada4"
  },
  radio: {
    fontSize: 18,
    color: "black"
  },
  container1: {
    flex: 0.33,
    justifyContent: "center",
    alignItems: "center"
  },
  container1bis: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  container3: {
    marginTop: winHeight * 0.01,
    marginBottom: winHeight * 0.01,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
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
  mostrarTick: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center"
  },
  ocultarTick: {
    flex: 0
  },
  ocultarTickImagen: {
    flex: 0
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
  imgRevisado: {
    flex: 0.3,
    height: 125,
    resizeMode: "center",
    borderColor: "#8E8E8E",
    borderWidth: 2
  },
  imgPlaceholder: {
    height: 65,
    resizeMode: "contain",
    marginTop: 30,
    marginBottom: 30
  },
  imgFlecha: {
    width: winWidth * 0.11,
    height: winWidth * 0.11,
    resizeMode: "cover",
    borderColor: "#8E8E8E",
    borderWidth: 0
    //marginTop: winHeight * 0.015,
    // marginBottom: winHeight * 0.015
  },
  lineaBotones: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "2%"
  },
  container2: {
    flex: 0.33,
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
    fontSize: 18,
    flex: 1,
    color: "black",
    fontWeight: "bold"
  },
  rowViewContainer3Comercio: {
    fontSize: 18,
    flex: 1,
    color: "black",
    fontWeight: "bold"
  },
  mensajeNoCoincidencia: {
    marginTop: winHeight * 0.02,
    marginLeft: winWidth * 0.02,
    fontSize: 18,
    flex: 1,
    color: "black"
  },
  rowViewContainer4: {
    fontSize: 16,
    flex: 1,
    color: "black",
    fontWeight: "bold"
  },
  rowViewContainer5: {
    fontSize: 16,
    flex: 1,
    color: "black"
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  }
});
