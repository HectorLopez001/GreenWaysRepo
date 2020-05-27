import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import AsyncStorage from '@react-native-community/async-storage';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated
} from "react-native";

import GestionComerciosActions from "./../actions/GestionComercios";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class GestionComercios extends Component {
  static navigationOptions = {
    title: "Gestión de Comercios",
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
      backgroundColor: new Animated.Value(0),
      datas: null,
      datas2: null,
      datas3: null,
      hayDenuncias: null,
      numDenuncias: null,
      hayHomeComercios: null,
      numHomeComercios: null,
      hayCatalogos: null,
      numCatalogos: null,
      isStorageLoaded: false
    };
  }

  async componentDidMount() {
    return fetch("https://thegreenways.es/numeroDenunciasRevisables.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson === "No Results Found") {
          this.setState({
              hayDenuncias: "no"
            });

          return fetch(
            "https://thegreenways.es/numeroHomeComerciosYCatalogosRevisables.php", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              }
            }
          )
            .then(response2 => response2.json())
            .then(responseJson2 => {
              if (responseJson2 === "No Results Found") {

                this.setState({
                    hayHomeComercios: "no",
                    hayCatalogos: "no",
                    isStorageLoaded: true
                  });
              }
              else
              {
                //this.state.datas2 = responseJson2;

                //TRATAR DATOS

                var aux = Object.entries(responseJson2);
                var i;

                var auxHayHomeComercios = "no";
                var auxNumHomeComercios = 0;
                var auxHayCatalogos = "no";
                var auxNumCatalogos = 0;

                for (var [key, value] of aux) {
                  if (value.revisar === "0") {
                    auxNumHomeComercios = auxNumHomeComercios + 1;
                  }
                  if (value.revisarCatalogo === "0") {
                    auxNumCatalogos = auxNumCatalogos + 1;
                  }
                }

                if (auxNumHomeComercios > 0) {
                  auxHayHomeComercios = "si";
                }

                if (auxNumCatalogos > 0) {
                  auxHayCatalogos = "si";
                }

                this.setState(
                  {
                    datas2: responseJson2,
                    hayHomeComercios: auxHayHomeComercios,
                    numHomeComercios: auxNumHomeComercios,
                    hayCatalogos: auxHayCatalogos,
                    numCatalogos: auxNumCatalogos,
                    isStorageLoaded: true
                  });
              }

              setTimeout(() => {
                this.cambioColor();
              }, 500);
            })
            .catch(error => {
              console.error(error);
            });
        }
        else
        {

          this.setState(
            {
              datas: responseJson,
              hayDenuncias: "si",
              // numDenuncias: Object.keys(this.state.datas).length
              numDenuncias: Object.keys(responseJson).length
            });

          return fetch(
            "https://thegreenways.es/numeroHomeComerciosYCatalogosRevisables.php", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              }
            }
          )
            .then(response2 => response2.json())
            .then(responseJson2 => {
              if (responseJson2 === "No Results Found") {
                this.setState(
                  {
                    hayHomeComercios: "no",
                    hayCatalogos: "no",
                    isStorageLoaded: true
                  });
              }
              else
              {
                //this.state.datas2 = responseJson2;

                //TRATAR DATOS

                var aux = Object.entries(responseJson2);
                var i;

                var auxHayHomeComercios = "no";
                var auxNumHomeComercios = 0;
                var auxHayCatalogos = "no";
                var auxNumCatalogos = 0;

                for (var [key, value] of aux) {
                  if (value.revisar === "0") {
                    auxNumHomeComercios = auxNumHomeComercios + 1;
                  }
                  if (value.revisarCatalogo === "0") {
                    auxNumCatalogos = auxNumCatalogos + 1;
                  }
                }

                if (auxNumHomeComercios > 0) {
                  auxHayHomeComercios = "si";
                }

                if (auxNumCatalogos > 0) {
                  auxHayCatalogos = "si";
                }

                this.setState({
                    datas2: responseJson2,
                    hayHomeComercios: auxHayHomeComercios,
                    numHomeComercios: auxNumHomeComercios,
                    hayCatalogos: auxHayCatalogos,
                    numCatalogos: auxNumCatalogos,
                    isStorageLoaded: true
                  });
              }

              setTimeout(() => {
                this.cambioColor();
              }, 500);
            })
            .catch(error => {
              console.error(error);
            });
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
          duration: 100,
          toValue: 1,
          isInteraction: false,
          useNativeDriver: false
        }),
        Animated.timing(this.state.backgroundColor, {
          delay: 400,
          duration: 100,
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

  render() {
    var color = this.state.backgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(121, 183, 0, 0.4)", "rgba(121,183,0, 0.8)"]
    });

    let { isStorageLoaded } = this.state;
    if (!isStorageLoaded) {
      return <Loader loading={true} />;
    } else {
      return (
        <View style={styles.MainContainer}>
          <View
            style={{
              justifyContent: "center"
            }}
          >
            <View
              style={{
                marginTop: winHeight * 0.01
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.goGestionDenuncias();
                }}
              >
                <Animated.View
                  style={{
                    height: winHeight * 0.08,
                    borderWidth: 2,
                    borderColor: "black",
                    borderRadius: 20,
                    backgroundColor:
                      this.state.hayDenuncias === "si" ? color : "#79B700",
                    marginLeft: "2%",
                    marginRight: "2%",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={styles.textoBotones}>
                    {this.state.hayDenuncias === "si"
                      ? "DENUNCIAS (" + this.state.numDenuncias + ")"
                      : "DENUNCIAS"}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: winHeight * 0.01
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.goGestionPagComercio();
                }}
              >
                <Animated.View
                  style={{
                    height: winHeight * 0.08,
                    borderWidth: 2,
                    borderColor: "black",
                    borderRadius: 20,
                    backgroundColor:
                      this.state.hayHomeComercios === "si" ? color : "#79B700",
                    marginLeft: "2%",
                    marginRight: "2%",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={styles.textoBotones}>
                    {this.state.hayHomeComercios === "si"
                      ? "HOME COMERCIO (" + this.state.numHomeComercios + ")"
                      : "HOME COMERCIO"}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: winHeight * 0.01
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.goGestionCatalogoProductos();
                }}
              >
                <Animated.View
                  style={{
                    height: winHeight * 0.08,
                    borderWidth: 2,
                    borderColor: "black",
                    borderRadius: 20,
                    backgroundColor:
                      this.state.hayCatalogos === "si" ? color : "#79B700",
                    marginLeft: "2%",
                    marginRight: "2%",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={styles.textoBotones}>
                    {this.state.hayCatalogos === "si"
                      ? "CATÁLOGO(" + this.state.numCatalogos + ")"
                      : "CATÁLOGO"}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: winHeight * 0.52,
                marginBottom: winHeight * 0.01
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
    goPrincipal: () => dispatch(GestionComerciosActions.goPrincipal()),
    goGestionPagComercio: () =>
      dispatch(GestionComerciosActions.goGestionPagComercio()),
    goGestionCatalogoProductos: () =>
      dispatch(GestionComerciosActions.goGestionCatalogoProductos()),
    goGestionDenuncias: () =>
      dispatch(GestionComerciosActions.goGestionDenuncias())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GestionComercios);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    flex: 1,
    padding: 20,
    justifyContent: "center"
  },
  container2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  textoBotones: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5
  }
});
