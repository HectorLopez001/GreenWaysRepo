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
  Dimensions
} from "react-native";

import LoginActions from "./../actions/Login";
import MainVendedorActions from "./../actions/MainVendedor";
import PerfilAdminActions from "./../actions/PerfilAdmin";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class PerfilAdmin extends Component {
  static navigationOptions = {
    title: "Perfil de Usuario",
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
      // nombreComercio: null,
      // isLoading: true,
      idUsuario: null,
      nombreUsuario: null,
      emailUsuario: null,
      imageSource: null,
      isStorageLoaded: false
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem("name").then(value => {
      this.setState({
        nombreUsuario: value
      });
    });

    return fetch("https://thegreenways.es/pagPerfilAdmin.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombreUsuario: this.state.nombreUsuario })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            // isLoading: false,
            idAdmin: responseJson[0].idAdmin,
            nombreUsuario: responseJson[0].name,
            emailUsuario: responseJson[0].email,
            isStorageLoaded: true
          },
          function() {
            //State change
          }
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    let { isStorageLoaded } = this.state;
    if (!isStorageLoaded) {
      return <Loader loading={true} />;
    } else {
      return (
        <View style={styles.MainContainer}>
          <View>
            <View style={{ justifyContent: "center" }}>
              <View style={{ height: "89.5%" }}>
                <View>
                  <Text style={styles.bigblack}>Datos de la cuenta:</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "30%" }}>
                    <Text style={styles.tinyblack}>Nombre:</Text>
                  </View>
                  <View style={{ width: "70%" }}>
                    <Text
                      style={{
                        textAlign: "left",
                        color: "black",
                        fontSize: 20,
                        marginTop: 15
                      }}
                    >
                      {this.state.nombreUsuario}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", marginBottom: "36%" }}>
                  <View style={{ width: "30%" }}>
                    <Text style={styles.tinyblack}>Email:</Text>
                  </View>
                  <View style={{ width: "70%", marginBottom: "62%" }}>
                    <Text
                      style={{
                        textAlign: "left",
                        color: "black",
                        marginTop: 15,
                        fontSize: 20
                      }}
                    >
                      {this.state.emailUsuario}
                    </Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: "2%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: winWidth * 0.45
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

                <View
                  style={{
                    width: winWidth * 0.45
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.props.logout();
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
                      <Text style={styles.textoBotones}>{"CERRAR SESIÓN"}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
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
    goPrincipal: () => dispatch(PerfilAdminActions.goPrincipal()),
    logout: () => dispatch(LoginActions.logout())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PerfilAdmin);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: "2%"
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
  tinyblack: {
    color: "black",
    fontWeight: "bold",
    fontSize: 19,
    marginTop: 15,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  bigblack: {
    color: "black",
    fontWeight: "bold",
    fontSize: 21,
    marginTop: 20,
    marginBottom: 10
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5
  }
});
