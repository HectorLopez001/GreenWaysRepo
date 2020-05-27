import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated
} from "react-native";

import GestionUsuariosRegistradosActions from "./../actions/GestionUsuariosRegistrados";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class GestionUsuariosRegistrados extends Component {
  static navigationOptions = {
    title: "Usuarios Registrados",
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
      datas: null,
      datas2: null,
      hayFeedbacks: null,
      numFeedbacks: null,
      hayUsuariosCompradores: null,
      numUsuariosCompradores: null,
      isStorageLoaded: false
    };
  }

  async componentDidMount() {
    return fetch("https://thegreenways.es/numeroFeedbacksRevisables.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson === "No Results Found")
        {
          this.setState({
              hayFeedbacks: "no"
            });

          return fetch(
            "https://thegreenways.es/numeroUsuariosCompradoresRevisables.php",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              }
            }
          )
            .then(response2 => response2.json())
            .then(responseJson2 => {
              if (responseJson2 === "No Results Found")
              {

                this.setState({
                    hayUsuariosCompradores: "no",
                    isStorageLoaded: true
                  });
              }
              else
              {

                this.setState({
                    datas2: responseJson2,
                    hayUsuariosCompradores: "si",
                    numUsuariosCompradores: Object.keys(responseJson2).length,
                    //numUsuariosCompradores: Object.keys(this.state.datas2).length,
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
          this.setState({
              datas: responseJson,
              hayFeedbacks: "si",
            //  numFeedbacks: Object.keys(this.state.datas).length
              numFeedbacks: Object.keys(responseJson).length
            });

          return fetch(
            "https://thegreenways.es/numeroUsuariosCompradoresRevisables.php",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              }
            }
          )
            .then(response2 => response2.json())
            .then(responseJson2 => {
              if (responseJson2 === "No Results Found")
              {

                this.setState({
                    hayUsuariosCompradores: "no",
                    isStorageLoaded: true
                  });

                setTimeout(() => {
                  this.cambioColor();
                }, 500);
              }
              else
              {

                this.setState({
                    datas2: responseJson2,
                    hayUsuariosCompradores: "si",
                    numUsuariosCompradores: Object.keys(responseJson2).length,
                    //numUsuariosCompradores: Object.keys(this.state.datas2).length,
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
          <View style={{ justifyContent: "center" }}>
            <View
              style={{
                marginTop: winHeight * 0.01
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.goGestionPerfilesUsuario();
                }}
              >
                <Animated.View
                  style={{
                    height: winHeight * 0.08,
                    borderWidth: 2,
                    borderColor: "black",
                    borderRadius: 20,
                    backgroundColor:
                      this.state.hayUsuariosCompradores === "si"
                        ? color
                        : "#79B700",
                    marginLeft: "2%",
                    marginRight: "2%",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={styles.textoBotones}>
                    {this.state.hayUsuariosCompradores === "si"
                      ? "USUARIO COMPRADOR (" +
                        this.state.numUsuariosCompradores +
                        ")"
                      : "USUARIO COMPRADOR"}
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
                  this.props.goGestionFeedbacks();
                }}
              >
                <Animated.View
                  style={{
                    height: winHeight * 0.08,
                    borderWidth: 2,
                    borderColor: "black",
                    borderRadius: 20,
                    backgroundColor:
                      this.state.hayFeedbacks === "si" ? color : "#79B700",
                    marginLeft: "2%",
                    marginRight: "2%",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Text style={styles.textoBotones}>
                    {this.state.hayFeedbacks === "si"
                      ? "FEEDBACK (" + this.state.numFeedbacks + ")"
                      : "FEEDBACK"}
                  </Text>
                </Animated.View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: winHeight * 0.61,
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
    goPrincipal: () =>
      dispatch(GestionUsuariosRegistradosActions.goPrincipal()),
    goGestionFeedbacks: () =>
      dispatch(GestionUsuariosRegistradosActions.goGestionFeedbacks()),
    goGestionPerfilesUsuario: () =>
      dispatch(GestionUsuariosRegistradosActions.goGestionPerfilesUsuario())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GestionUsuariosRegistrados);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: "2%",
    justifyContent: "center"
    // alignItems: "center"
  },
  container2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    padding: 10,
    backgroundColor: "#36ada4",
    justifyContent: "center",
    alignItems: "center"
  },
  textoBotones: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5
  },
  textoBotonBrillante: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5
  }
});
