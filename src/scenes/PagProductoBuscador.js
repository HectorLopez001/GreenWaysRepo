import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import Stars from "react-native-stars";
import AsyncStorage from '@react-native-community/async-storage';
import ImageLoad from "react-native-image-placeholder";

import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Alert,
  Button,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";

import MainActions from "./../actions/Main";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class PagProductoBuscador extends Component {
  static navigationOptions = {
    title: "Página del Producto",
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
      idProducto: null,
      nombreProducto: null,
      descripcionProducto: null,
      nombreUsuario: null,
      imageSource: null,
      precio: null,
      // sceneCatalogoAnterior: null,
      datas: null,
      notaMedia: null,
      isStorageLoaded: false
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem("producto").then(value => {
      this.setState({
        nombreProducto: value
      });
    });

    await AsyncStorage.getItem("comercio").then(value => {
      this.setState({
        nombreComercio: value
      });
    });

    /* await AsyncStorage.getItem("sceneCatalogoAnterior").then(value => {
      this.setState({
        sceneCatalogoAnterior: value
      });
    });*/

    return fetch("https://thegreenways.es/pagProductoNoVendedor.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nombreProducto: this.state.nombreProducto,
        nombreComercio: this.state.nombreComercio
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            //  isLoading: false,
            idProducto: responseJson[0].idProducto,
            nombreProducto: responseJson[0].nombreProducto,
            descripcionProducto: responseJson[0].descripcionProducto,
            precio: responseJson[0].precio,
            imageSource: responseJson[0].imagenProducto
          },
          function() {
            //State change
          }
        );

        return fetch("https://thegreenways.es/listaFeedbacksProducto.php", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nombreProducto: this.state.nombreProducto,
            nombreComercio: this.state.nombreComercio
          })
        })
          .then(response => response.json())
          .then(responseJson2 => {
            if (responseJson2 == "No Results Found") {
              this.setState(
                {
                  //  isLoading: false,
                  notaMedia: 2.5,
                  isStorageLoaded: true
                },
                function() {
                  //State change
                }
              );
            } else {
              this.setState(
                {
                  //  isLoading: false,
                  datas: responseJson2,
                  notaMedia: this.media(responseJson2),
                  isStorageLoaded: true
                },
                function() {
                  //State change
                }
              );
            }
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }

  media(array) {
    var suma = parseFloat(0);
    var i;
    for (i = 0; i < array.length; i++) {
      suma = suma + parseFloat(array[i].nota);
    }
    return suma / i;
  }

  introFeedback(nombreProducto, nombreComercio, pathImagen) {
    AsyncStorage.setItem("nombreProducto", nombreProducto);
    AsyncStorage.setItem("nombreComercio", nombreComercio);
    AsyncStorage.setItem("pathImagen", pathImagen);

    AsyncStorage.setItem("buscador", "si");

    this.props.introFeedback();
  }

  introDenuncia(nombreProducto, nombreComercio, pathImagen) {
    AsyncStorage.setItem("nombreProducto", nombreProducto);
    AsyncStorage.setItem("nombreComercio", nombreComercio);
    AsyncStorage.setItem("pathImagen", pathImagen);

    AsyncStorage.setItem("buscador", "si");

    this.props.introDenuncia();
  }

  render() {
    var Image_Http_URL = {
      uri: "https://thegreenways.es/" + this.state.imageSource
    };
    // var width = Dimensions.get("window").width;

    let { isStorageLoaded } = this.state;
    if (!isStorageLoaded) {
      return <Loader loading={true} />;
    } else {
      return (
        <View style={styles.MainContainer}>
          <View style={{ flexDirection: "row", height: winHeight * 0.055 }}>
            <View
              style={{
                flex: 0.1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.introDenuncia(
                    this.state.nombreProducto,
                    this.state.nombreComercio,
                    this.state.imageSource
                  )
                }
                style={{
                  paddingTop: 7,
                  paddingBottom: 5,
                  paddingLeft: 10,
                  paddingRight: 10
                }}
              >
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    resizeMode: "cover"
                  }}
                  resizeMethod={"resize"}
                  source={require("GreenWaysProject/images/denunciar.png")}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
                flex: 0.4
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: 17
                }}
              >
                Denunciar
              </Text>
            </View>

            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-end",
                flex: 0.4
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: 17
                }}
              >
                Valorar
              </Text>
            </View>

            <View
              style={{
                flex: 0.1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  this.introFeedback(
                    this.state.nombreProducto,
                    this.state.nombreComercio,
                    this.state.imageSource
                  )
                }
                style={{
                  paddingTop: 3,
                  paddingBottom: 5,
                  paddingLeft: 10,
                  paddingRight: 10
                }}
              >
                <Image
                  style={{
                    height: 35,
                    width: 35,
                    resizeMode: "cover"
                  }}
                  resizeMethod={"resize"}
                  source={require("GreenWaysProject/images/estrella5.png")}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 2
            }}
          />

          <View style={{ height: "84.6%" }}>
            <View style={{ height: winHeight * 0.06 }}>
              <Text
                style={{
                  textAlign: "center",
                  color: "black",
                  fontSize: 38,
                  fontWeight: "bold"
                }}
              >
                {this.state.nombreProducto}
              </Text>
            </View>
            <View
              style={{
                height: winHeight * 0.07,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  textAlign: "left",
                  color: "black",
                  fontSize: 17,
                  marginBottom: 3
                }}
              >
                {this.state.descripcionProducto}
              </Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View
                style={{
                  height: winHeight * 0.3,
                  width: winWidth * 0.71
                }}
              >
                <ImageLoad
                  style={{
                    flex: 1,
                    alignSelf: "stretch",
                    width: undefined,
                    height: undefined,
                    borderColor: "#8E8E8E",
                    borderWidth: 2
                  }}
                  resizeMode="cover"
                  resizeMethod={"resize"}
                  source={Image_Http_URL}
                  placeholderSource={require("GreenWaysProject/images/time.png")}
                  isShowActivity={false}
                  placeholderStyle={styles.imgPlaceholder}
                />
              </View>
            </View>
            <View style={{ height: winHeight * 0.05 }}>
              <Text
                style={{
                  textAlign: "center",
                  color: "black",
                  fontSize: 22,
                  fontWeight: "bold"
                }}
              >
                Precio: {this.state.precio}
              </Text>
            </View>

            <View
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1.5
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignContent: "flex-start",
                height: winHeight * 0.001
              }}
            >
              <View style={{ marginRight: winWidth * 0.01 }}>
                <Text style={styles.rowViewContainer2}>Valoración: </Text>
              </View>
              <View>
                {this.state.datas != null ? (
                  <Stars
                    default={this.state.notaMedia}
                    display={this.state.notaMedia}
                   // backingColor={"#EEEEEE"}
                    count={5}
                    half={true}
                    disabled={true}
                    starSize={
                      20
                    } /* must be set to the size of the custom component if in selection mode */
                    fullStar={require("./../../images/starFilled.png")}
                    emptyStar={require("./../../images/starEmpty.png")}
                    halfStar={require("./../../images/starHalf.png")}
                  />
                ) : (
                  <Text />
                )}
              </View>
              <View style={{ marginLeft: winWidth * 0.02 }}>
                {this.state.datas != null ? (
                  <Text style={styles.rowViewContainer1}>
                    ({Math.round(this.state.notaMedia * 100) / 100}/5)
                  </Text>
                ) : (
                  <Text />
                )}
              </View>
            </View>

            <View
              style={
                this.state.datas == null
                  ? { marginTop: winHeight * 0.035 }
                  : { marginTop: 0 }
              }
            >
              <Text style={{ fontSize: 17, color: "black" }}>
                {this.state.datas == null
                  ? "No existen valoraciones, sé el primero en opinar sobre este producto."
                  : ""}
              </Text>
            </View>

            <FlatList
              ref="listViewa"
              getItemLayout={(data, index) => ({
                length: 77,
                offset: 77 * index,
                index
              })}
              data={this.state.datas}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListFooterComponent={() => <View style={styles.listFooter} />}
              renderItem={({ item: rowData, index: rowNumber }) => (
                <View style={styles.container}>
                  <View style={styles.container2}>
                    <View>
                      <ImageLoad
                        style={{
                          height: 38,
                          width: 38,
                          flex: 0.8,
                          resizeMode: "cover",
                          marginTop: 5,
                          marginBottom: 5
                        }}
                        resizeMethod={"resize"}
                        source={{
                          uri: "https://thegreenways.es/" + rowData.imagen
                        }}
                        placeholderSource={require("GreenWaysProject/images/time.png")}
                        isShowActivity={false}
                        placeholderStyle={styles.imgPlaceholder}
                        borderRadius={50}
                      />
                    </View>
                    <View style={styles.container3}>
                      <Text style={styles.rowViewContainer1}>
                        {rowData.name}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.container2}>
                    <View>
                      <Stars
                        default={parseFloat(rowData.nota)}
                        display={parseFloat(rowData.nota)}
                       // backingColor={"#EEEEEE"}
                        count={5}
                        half={true}
                        disabled={true}
                        starSize={
                          20
                        } /* must be set to the size of the custom component if in selection mode */
                        fullStar={require("./../../images/starFilled.png")}
                        emptyStar={require("./../../images/starEmpty.png")}
                        halfStar={require("./../../images/starHalf.png")}
                      />
                    </View>

                    <View style={styles.container3}>
                      <Text style={styles.rowViewContainer2}>
                        {rowData.titulo}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.container4}>
                    <Text style={styles.rowViewContainer3}>
                      {rowData.comentario}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>

          <View
            style={{
              height: winHeight * 0.1
              // marginTop: winHeight * 0.01
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Actions.popTo("Buscador");
              }}
            >
              <View
                style={{
                  height: 40,
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
                <Text style={styles.textoBotones}>{"VOLVER AL BUSCADOR"}</Text>
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
    isLogged: state.login.isLogged,
    hasError: state.register.hasError,
    isLoading: state.register.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    //goCatalogoCliente: () => dispatch(MainActions.goCatalogoCliente()),
    introFeedback: () => dispatch(MainActions.introFeedback()),
    introDenuncia: () => dispatch(MainActions.introDenuncia())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagProductoBuscador);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    // height: winHeight,
    marginLeft: 10,
    marginRight: 10
  },
  container2: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  container3: {
    marginLeft: winWidth * 0.02
  },
  container4: {
    marginTop: 8,
    marginBottom: 8
  },
  button: {
    padding: 10,
    backgroundColor: "#36ada4",
    justifyContent: "center",
    alignItems: "center"
  },
  rowViewContainer1: {
    fontSize: 16,
    color: "black"
  },
  rowViewContainer2: {
    fontSize: 17,
    fontWeight: "bold",
    color: "black"
  },
  rowViewContainer3: {
    fontSize: 16,
    color: "black"
  },
  separator: {
    height: StyleSheet.hairlineWidth + 2,
    backgroundColor: "#8E8E8E"
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  },
  imgPlaceholder: {
    height: 65,
    resizeMode: "contain",
    marginTop: 30,
    marginBottom: 30
  },
});
