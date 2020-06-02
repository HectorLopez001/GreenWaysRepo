import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated
} from "react-native";

import LoginActions from "./../actions/Login";
import MainAdminActions from "./../actions/MainAdmin";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class MainAdmin extends Component {
  static navigationOptions = {
    title: "Página Principal Admin",
    gesturesEnabled: false,
    headerLeft: null,
    headerRight: (
      <View>
        <TouchableOpacity
          onPress={() => {
            Actions.PerfilAdmin();
          }}
          style={{ padding: winHeight * 0.015 }}
        >
          <Image
            style={{
              height: 50,
              width: 50,
              resizeMode: "cover"
            }}
            resizeMethod={"resize"}
            source={require("GreenWaysProject/images/perfil.png")}
          />
        </TouchableOpacity>
      </View>
    )
  };

  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: new Animated.Value(0),
      hayFeedbacksOUsuariosCompradores: null,
      hayDenunciasOHomeComerciosOCatalogos: null,
      isStorageLoaded: false
    };
  }

  async componentDidMount() {
    return fetch("https://thegreenways.es/numeroFeedbacksRevisables.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == "No Results Found") {
          return fetch(
            "https://thegreenways.es/numeroUsuariosCompradoresRevisables.php",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({})
            }
          )
            .then(response2 => response2.json())
            .then(responseJson2 => {
              if (responseJson2 == "No Results Found") {
                this.setState(
                  {
                    hayFeedbacksOUsuariosCompradores: "no"
                  }
                );
              } else {
                this.setState(
                  {
                    hayFeedbacksOUsuariosCompradores: "si"
                  }
                );
              }

              this.parteDatosComercios();
            })
            .catch(error => {
              console.error(error);
            });
            
        } else {
          this.setState({
            hayFeedbacksOUsuariosCompradores: "si"
          });
          this.parteDatosComercios();

          this.props.flick();
        }  
        
      })
      .catch(error => {
        console.error(error);
      });
  }

  terminarLoader() {
    this.setState({ isStorageLoaded: true });
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
        iterations: 1000
      }
    ).start();
  }
  

  async parteDatosComercios() {
    try {
      const response3 = await fetch("https://thegreenways.es/numeroDenunciasRevisables.php", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });
      const responseJson3 = await response3.json();
      if (responseJson3 == "No Results Found") {
        return fetch("https://thegreenways.es/numeroHomeComerciosYCatalogosRevisables.php", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({})
        })
          .then(response4 => response4.json())
          .then(responseJson4 => {
            if (responseJson4 == "No Results Found") {
              this.setState({
                hayDenunciasOHomeComerciosOCatalogos: "no",
                isStorageLoaded: true
              });
            }
            else {
              this.setState({
                hayDenunciasOHomeComerciosOCatalogos: "si",
                isStorageLoaded: true
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
      else {
        this.setState({
          hayDenunciasOHomeComerciosOCatalogos: "si",
          isStorageLoaded: true
        });
      }
    }
    catch (error_1) {
      console.error(error_1);
    }
  }

  render() {

    this.cambioColor();

    var color = this.state.backgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(121, 183, 0, 0.4)", "rgba(121,183,0, 0.8)"]
    });

    let { isStorageLoaded } = this.state;
    let { flicker } = this.props;
    if (!isStorageLoaded) {
      return <Loader loading={true} />;
    } else {
      return (
        <View style={styles.container}>
          <View
            style={{
              marginBottom: winHeight * 0.01
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.goGestionComercios();
              }}
            >
              <Animated.View
                style={{
                  height: winHeight * 0.08,
                  borderWidth: 2,
                  borderColor: "black",
                  borderRadius: 20,
                  backgroundColor:
                    this.state.hayDenunciasOHomeComerciosOCatalogos == "si" && flicker === "MainAdmin"
                      ? color
                      : "#79B700",
                  marginLeft: "2%",
                  marginRight: "2%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.textoBotones}> GESTIÓN COMERCIOS</Text>
              </Animated.View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginBottom: winHeight * 0.2
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.goGestionUsuariosRegistrados();
              }}
            >
              <Animated.View
                style={{
                  height: winHeight * 0.08,
                  borderWidth: 2,
                  borderColor: "black",
                  borderRadius: 20,
                  backgroundColor:
                    this.state.hayFeedbacksOUsuariosCompradores == "si" && flicker === "MainAdmin"
                      ? color
                      : "#79B700",
                  marginLeft: "2%",
                  marginRight: "2%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.textoBotones}>GESTIÓN COMPRADORES</Text>
              </Animated.View>
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
    hasError: state.login.hasError,
    isLoading: state.login.isLoading,
    flicker: state.mainAdmin.flicker
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(LoginActions.logout()),
    goGestionUsuariosRegistrados: () =>
      dispatch(MainAdminActions.goGestionUsuariosRegistrados()),
    goGestionComercios: () => dispatch(MainAdminActions.goGestionComercios()),
    flick: () => dispatch(MainAdminActions.flick())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainAdmin);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center"
  },
  button: {
    padding: 10,
    backgroundColor: "#36ada4"
  },
  textoBotones: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5
  }
});
