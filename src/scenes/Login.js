import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
  Dimensions,
  Platform
} from "react-native";
import LoginActions from "./../actions/Login";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class Login extends Component {
  static navigationOptions = {
    title: "Bienvenido a GreenWays!",
    gesturesEnabled: false,
    headerLeft: null
  };
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      pass: null
    };
  }

  doLogin() {
    let { username, pass } = this.state;
    this.props.login(username, pass);
    setTimeout(() => this.focusin(), 600);
  }

  focusin() {
    if (this.props.campoError === "nombre") {
      //  alert("entra");
      this._inputNombre.focus();
      //  setTimeout(() => this._inputNombre.focus(), 50);
    } else if (this.props.campoError === "pass") {
      this._pass.focus();
      //  this._precio.focus();
    }
  }

  render() {
    let { hasError, campoError, isLoading } = this.props;
    if (hasError) {
      return (
        <View style={styles.container}>
          <Loader loading={isLoading} />
          <View>
            <View>
              <Text style={styles.bigblack}>
                Introduce tus datos para iniciar sesión
              </Text>
            </View>
            <View style={{ marginBottom: winHeight * 0.04 }}>
              <TextInput
                ref={c => {
                  this._inputNombre = c;
                }}
                placeholder={"Email o nombre de usuario"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={
                  campoError != "nombre" ? "#79B700" : "red"
                }
                style={styles.input}
                onChangeText={username => {
                  this.setState({ username });
                  if (this.props.campoError === "nombre") {
                    this.props.noErrores();
                  }
                }}
              />

              <TextInput
                ref={c => {
                  this._pass = c;
                }}
                placeholder={"Contraseña"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={campoError != "pass" ? "#79B700" : "red"}
                style={styles.input}
                secureTextEntry={true}
                onChangeText={pass => {
                  this.setState({ pass });
                  if (this.props.campoError === "pass") {
                    this.props.noErrores();
                  }
                }}
              />
            </View>
          </View>
          <View
            style={{
              marginBottom: winHeight * 0.315
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.doLogin();
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
                <Text style={styles.textoBotones}>{"INICIAR SESION"}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              //   height: winHeight * 0.1
              marginBottom: winHeight * 0.01
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.goRegister();
              }}
            >
              <View
                style={{
                  height: 55,
                  borderWidth: 1.5,
                  borderColor: "black",
                  borderRadius: 20,
                  backgroundColor: "green",
                  marginLeft: "2%",
                  marginRight: "2%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.textoBotones}>{"REGISTRARSE"}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={
              {
                //   height: winHeight * 0.1
              }
            }
          >
            <TouchableOpacity
              onPress={() => {
                this.props.goRegisterVendedor();
              }}
            >
              <View
                style={{
                  height: 55,
                  borderWidth: 1.5,
                  borderColor: "black",
                  borderRadius: 20,
                  backgroundColor: "green",
                  marginLeft: "2%",
                  marginRight: "2%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.textoBotones}>
                  {"REGISTRARSE COMO COMERCIANTE"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Loader loading={isLoading} />
          <View>
            <View>
              <Text style={styles.bigblack}>
                Introduce tus datos para iniciar sesión
              </Text>
            </View>
            <View style={{ marginBottom: winHeight * 0.04 }}>
              <TextInput
                ref={c => {
                  this._inputNombre = c;
                }}
                placeholder={"Email o nombre de usuario"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={"#79B700"}
                style={styles.input}
                onChangeText={username => this.setState({ username })}
              />

              <TextInput
                ref={c => {
                  this._pass = c;
                }}
                placeholder={"Contraseña"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={"#79B700"}
                style={styles.input}
                secureTextEntry={true}
                onChangeText={pass => this.setState({ pass })}
              />
            </View>
          </View>
          <View
            style={{
              marginBottom: winHeight * 0.315
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.doLogin();
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
                <Text style={styles.textoBotones}>{"INICIAR SESION"}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              //   height: winHeight * 0.1
              marginBottom: winHeight * 0.01
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.goRegister();
              }}
            >
              <View
                style={{
                  height: 55,
                  borderWidth: 1.5,
                  borderColor: "black",
                  borderRadius: 20,
                  backgroundColor: "green",
                  marginLeft: "2%",
                  marginRight: "2%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.textoBotones}>{"REGISTRARSE"}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={
              {
                //   height: winHeight * 0.1
              }
            }
          >
            <TouchableOpacity
              onPress={() => {
                this.props.goRegisterVendedor();
              }}
            >
              <View
                style={{
                  height: 55,
                  borderWidth: 1.5,
                  borderColor: "black",
                  borderRadius: 20,
                  backgroundColor: "green",
                  marginLeft: "2%",
                  marginRight: "2%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.textoBotones}>
                  {"REGISTRARSE COMO COMERCIANTE"}
                </Text>
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
    // isLogged: state.login.isLogged,
    hasError: state.login.hasError,
    isLoading: state.login.isLoading,
    campoError: state.login.campoError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (username, password) =>
      dispatch(LoginActions.login(username, password)),
    goRegister: () => dispatch(LoginActions.goRegister()),
    goRegisterVendedor: () => dispatch(LoginActions.goRegisterVendedor()),
    noErrores: () => dispatch(LoginActions.noErrores())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },

  input: {
    marginBottom: 8,
    marginRight: 5,
    fontSize: 16
  },

  button1: {
    padding: 10,
    backgroundColor: "#36ada4"
  },

  button2: {
    flex: 0.5,
    backgroundColor: "#e3aa1a"
  },

  bigblack: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  }
});
