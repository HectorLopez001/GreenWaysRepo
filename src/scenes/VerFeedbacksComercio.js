import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import Stars from "react-native-stars";
import AsyncStorage from '@react-native-community/async-storage';
import ImageLoad from "react-native-image-placeholder";

import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions
} from "react-native";

import MainActions from "./../actions/Main";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class PagComercio extends Component {
  static navigationOptions = {
    title: "Valoraciones del comercio",
    headerRight: (
      <View>
        <TouchableOpacity
          onPress={() => {
            Actions.MainVendedor();
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
      nombreUsuario: null,
      nombreComercio: null,
      descripcionComercio: null,
      imageSource: null,
      sceneAnterior: null,
      sceneComerciosAnterior: null,
      datas: null,
      numValoracionesAlComercio: null,
      notaMedia: null,
      isStorageLoaded: false
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem("name").then(value => {
      this.setState({
        nombreUsuario: value
      });
    });

    return fetch(
      "https://thegreenways.es/listaFeedbacksComercioComerciante.php",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombreUsuario: this.state.nombreUsuario
        })
      }
    )
      .then(response => response.json())
      .then(responseJson2 => {
        if (responseJson2 == "No Results Found") {
          this.setState(
            {
              //  isLoading: false,
              notaMedia: 0,
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
              //       numValoracionesAlComercio: this.valora
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
  }

  media(array) {
    var suma = parseFloat(0);
    var i;
    var contadorValoracionesComercio = 0;
    for (i = 0; i < array.length; i++) {
      if (array[i].idProducto == null) {
        contadorValoracionesComercio = contadorValoracionesComercio + 1;
        suma = suma + parseFloat(array[i].nota);
      }
    }

    if (contadorValoracionesComercio > 0) {
      this.setState({
        numValoracionesAlComercio: contadorValoracionesComercio
      });
      return suma / contadorValoracionesComercio;
    } else {
      return 0;
    }
  }

  render() {
    let { isStorageLoaded } = this.state;
    if (!isStorageLoaded) {
      return <Loader loading={true} />;
    } else {
      return (
        <View style={styles.MainContainer}>
          <View style={{ height: "89.5%" }}>
            <View>
              <View
                style={{
                  // flexDirection: "row",
                  marginTop: winHeight * 0.02,
                  justifyContent: "center",
                  alignItems: "center"
                  //  height: winHeight * 0.05
                }}
              >
                <View
                  style={{
                    flexDirection: "row"
                  }}
                >
                  <View
                    style={{
                      marginRight: winWidth * 0.01
                    }}
                  >
                    <Text style={styles.rowViewContainer4}>{"Media:"}</Text>
                  </View>
                  <View>
                    <Stars
                      default={this.state.notaMedia}
                      display={this.state.notaMedia}
                     // backingColor={"#EEEEEE"}
                      count={5}
                      half={true}
                      disabled={true}
                      starSize={
                        30
                      } /* must be set to the size of the custom component if in selection mode */
                      fullStar={require("./../../images/starFilled.png")}
                      emptyStar={require("./../../images/starEmpty.png")}
                      halfStar={require("./../../images/starHalf.png")}
                    />
                  </View>
                  <View style={{ marginLeft: winWidth * 0.02 }}>
                    <Text style={styles.rowViewContainer5}>
                      ({Math.round(this.state.notaMedia * 100) / 100}/5)
                    </Text>
                  </View>
                </View>

                {this.state.numValoracionesAlComercio == null &&
                this.state.datas != null ? (
                  <View style={{ marginTop: winHeight * 0.02 }}>
                    <Text style={styles.rowViewContainer1}>
                      {"[Aún no hay valoraciones sobre éste comercio.]"}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            <View
              style={
                this.state.datas != null
                  ? {
                      marginTop: winHeight * 0.02,
                      borderBottomColor: "black",
                      borderBottomWidth: 2
                    }
                  : { margin: 0 }
              }
            />

            <View
              style={
                this.state.datas == null
                  ? { marginTop: winHeight * 0.01 }
                  : { margin: 0 }
              }
            >
              {this.state.datas == null ? (
                <Text
                  style={{
                    fontSize: 18,
                    color: "black",
                    marginTop: winHeight * 0.02,
                    marginLeft: winWidth * 0.02,
                    marginRight: winWidth * 0.02
                  }}
                >
                  (Aún no hay valoraciones para tu comercio.)
                </Text>
              ) : null}
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
              ListFooterComponent={() => (
                <View
                  style={this.state.datas != null ? styles.listFooter : null}
                />
              )}
              renderItem={({ item: rowData, index: rowNumber }) => (
                <View>
                  <View style={styles.container2}>
                    <View
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "center"
                      }}
                    >
                      <ImageLoad
                        style={{
                          height: 38,
                          width: 38,
                          flex: 0.8,
                          resizeMode: "cover",
                          marginTop: 5,
                          marginBottom: 5,
                          borderRadius: 50
                        }}
                        resizeMethod={"resize"}
                        source={{
                          uri: "https://thegreenways.es/" + rowData.imagen
                        }}
                        placeholderSource={require("GreenWaysProject/images/time.png")}
                        isShowActivity={false}
                        placeholderStyle={styles.imgPlaceholder}
                      />
                    </View>
                    <View style={styles.container3}>
                      <Text style={styles.rowViewContainer1}>
                        {rowData.name}
                      </Text>
                    </View>
                    <View style={styles.containerDerecha}>
                      <Text style={styles.rowViewContainer2}>
                        {rowData.nombreProducto != null
                          ? "Producto: " + rowData.nombreProducto
                          : "Comercio"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.container2}>
                    <View>
                      <Stars
                        default={rowData.nota}
                        display={rowData.nota}
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
            }}
          >
            <View
              style={
                {
                  //   height: winHeight * 0.1
                }
              }
            >
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
    isLogged: state.login.isLogged,
    hasError: state.register.hasError
    // isLoading: state.register.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goComercios: () => dispatch(MainActions.goComercios()),
    goCatalogoCliente: () => dispatch(MainActions.goCatalogoCliente())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PagComercio);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    // height: winHeight,
    marginLeft: 10,
    marginRight: 10
  },
  container2: {
    flexDirection: "row"
  },
  container3: {
    marginLeft: winWidth * 0.02,
    justifyContent: "center",
    alignItems: "center"
  },
  containerDerecha: {
    marginLeft: winWidth * 0.2,
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1
  },
  container4: {
    marginTop: 8,
    marginBottom: 8
  },
  button: {
    padding: 10,
    backgroundColor: "#36ada4"
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
  rowViewContainer4: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black"
  },
  rowViewContainer6: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black"
  },
  rowViewContainer5: {
    fontSize: 20,
    color: "black"
  },
  separator: {
    height: StyleSheet.hairlineWidth + 2,
    backgroundColor: "#8E8E8E"
  },
  listFooter: {
    borderBottomColor: "#8E8E8E",
    borderBottomWidth: 2
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
