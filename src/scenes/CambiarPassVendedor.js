import React, { Component } from "react";
import { connect } from "react-redux";
import * as ActionTypes from "../constants/ActionTypes";
import { Actions } from "react-native-router-flux";
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";

import MainVendedorActions from "./../actions/MainVendedor";
import CambiarPassVendedorActions from "./../actions/CambiarPassVendedor";
import Loader from "./../components/Loader";

class CambiarPassVendedor extends Component {
  static navigationOptions = {
    title: "Cambiar Contraseña",
    headerRight: (
      <View>
        <TouchableOpacity
          onPress={() => {
            Actions.MainVendedor();
            return;
            {
              type: ActionTypes.MAINVENDEDOR;
            }
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
      nombreLogeo: null,
      passUsuario: null,
      passNueva: null,
      passNueva2: null,
      isStorageLoaded: false
    };
  }

  doModificarPass() {
    let { nombreLogeo, passUsuario, passNueva, passNueva2 } = this.state;
    this.props.modificarPass(nombreLogeo, passUsuario, passNueva, passNueva2);

    setTimeout(() => this.focusin(), 600);
    //  setTimeout(() => Keyboard.dismiss(), 700);

    setTimeout(
      () =>
        this.props.campoError === "passwordVieja" ||
        this.props.campoError === "password" ||
        this.props.campoError === "password2"
          ? this.goScrollStart()
          : {},
      600
    );
  }

  async componentDidMount() {
    this.props.noErrores();
    await AsyncStorage.getItem("name").then(value => {
      this.setState({
        nombreLogeo: value,
        isStorageLoaded: true
      });
    });
  }

  focusin() {
    if (this.props.campoError === "passwordVieja") {
      //  alert("entra");
      this._passVieja.focus();
      //  setTimeout(() => this._inputNombre.focus(), 50);
    } else if (this.props.campoError === "password") {
      this._pass.focus();
      //  this._precio.focus();
    } else if (this.props.campoError === "password2") {
      this._pass2.focus();
      //  this._precio.focus();
    }
  }

  goScrollStart() {
    setTimeout(() => {
      this.refs.scroll.scrollTo({ x: 0, y: 0, animated: true });
    }, 50);
  }

  render() {
    let { hasError, isLoading, campoError } = this.props;
    let { isStorageLoaded } = this.state;
    if (!isStorageLoaded) {
      return <Loader loading={true} />;
    } else {
      if (hasError) {
        return (
          <View style={styles.container}>
            <ScrollView ref="scroll" keyboardShouldPersistTaps="always">
              <Loader loading={isLoading} />
              <Text style={styles.bigblack}>
                Cambie la contraseña de su cuenta:
              </Text>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <View style={{ width: "98%" }}>
                  <TextInput
                    ref={c => {
                      this._passVieja = c;
                    }}
                    placeholder={"Introduzca su contraseña actual"}
                    placeholderTextColor={"grey"}
                    returnKeyType={"next"}
                    autoCapitalize={"none"}
                    underlineColorAndroid={
                      campoError != "passwordVieja" ? "#79B700" : "red"
                    }
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={passUsuario => {
                      this.setState({ passUsuario });
                      if (this.props.campoError === "passwordVieja") {
                        this.props.noErrores();
                      }
                    }}
                  />
                </View>

                <View style={{ width: "98%" }}>
                  <TextInput
                    ref={c => {
                      this._pass = c;
                    }}
                    placeholder={"Introduzca una nueva contraseña"}
                    placeholderTextColor={"grey"}
                    returnKeyType={"next"}
                    autoCapitalize={"none"}
                    underlineColorAndroid={
                      campoError != "password" ? "#79B700" : "red"
                    }
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={passNueva => {
                      this.setState({ passNueva });
                      if (this.props.campoError === "password") {
                        this.props.noErrores();
                      }
                    }}
                  />
                </View>

                <View style={{ width: "98%" }}>
                  <TextInput
                    ref={c => {
                      this._pass2 = c;
                    }}
                    placeholder={"Repita la nueva contraseña"}
                    placeholderTextColor={"grey"}
                    returnKeyType={"next"}
                    autoCapitalize={"none"}
                    underlineColorAndroid={
                      campoError != "password2" ? "#79B700" : "red"
                    }
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={passNueva2 => {
                      this.setState({ passNueva2 });
                      if (this.props.campoError === "password2") {
                        this.props.noErrores();
                      }
                    }}
                  />
                </View>
              </View>
            </ScrollView>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  marginBottom: "1%",
                  width: "95%"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.doModificarPass();
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
                    <Text style={styles.textoBotones}>{"MODIFICAR"}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  marginTop: "1%",
                  width: "95%"
                }}
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
      } else {
        return (
          <View style={styles.container}>
            <ScrollView ref="scroll" keyboardShouldPersistTaps="always">
              <Loader loading={isLoading} />
              <Text style={styles.bigblack}>
                Cambie la contraseña de su cuenta:
              </Text>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <View style={{ width: "98%" }}>
                  <TextInput
                    ref={c => {
                      this._passVieja = c;
                    }}
                    placeholder={"Introduzca su contraseña actual"}
                    placeholderTextColor={"grey"}
                    returnKeyType={"next"}
                    autoCapitalize={"none"}
                    underlineColorAndroid={"#79B700"}
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={passUsuario => this.setState({ passUsuario })}
                  />
                </View>

                <View style={{ width: "98%" }}>
                  <TextInput
                    ref={c => {
                      this._pass = c;
                    }}
                    placeholder={"Introduzca una nueva contraseña"}
                    placeholderTextColor={"grey"}
                    returnKeyType={"next"}
                    autoCapitalize={"none"}
                    underlineColorAndroid={"#79B700"}
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={passNueva => this.setState({ passNueva })}
                  />
                </View>

                <View style={{ width: "98%" }}>
                  <TextInput
                    ref={c => {
                      this._pass2 = c;
                    }}
                    placeholder={"Repita la nueva contraseña"}
                    placeholderTextColor={"grey"}
                    returnKeyType={"next"}
                    autoCapitalize={"none"}
                    underlineColorAndroid={"#79B700"}
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={passNueva2 => this.setState({ passNueva2 })}
                  />
                </View>
              </View>
            </ScrollView>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  marginBottom: "1%",
                  width: "95%"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.doModificarPass();
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
                    <Text style={styles.textoBotones}>{"MODIFICAR"}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  marginTop: "1%",
                  width: "95%"
                }}
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
}

const mapStateToProps = state => {
  return {
    hasError: state.cambiarPassVendedor.hasError,
    isLoading: state.cambiarPassVendedor.isLoading,
    campoError: state.cambiarPassVendedor.campoError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    modificarPass: (nombreLogeo, passUsuario, passNueva, passNueva2) =>
      dispatch(
        CambiarPassVendedorActions.cambiarPassVendedor(
          nombreLogeo,
          passUsuario,
          passNueva,
          passNueva2
        )
      ),
    goMainVendedor: () => dispatch(MainVendedorActions.goPrincipalVendedor()),
    noErrores: () => dispatch(CambiarPassVendedorActions.noErrores())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CambiarPassVendedor);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  container2: {},

  input: {
    marginBottom: 8,
    fontSize: 16,
    marginRight: 5
  },

  button: {
    padding: 10,
    backgroundColor: "purple",
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 5,
    width: 200,
    height: 55
  },

  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center"
  },
  bigblack: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10
  },
  bigblack2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  image: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "#8E8E8E",
    borderWidth: 2
  },
  tinyblack: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 13,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5
  }
});
