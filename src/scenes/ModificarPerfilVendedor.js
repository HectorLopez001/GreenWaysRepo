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
import ModificarPerfilVendedorActions from "./../actions/ModificarPerfilVendedor";
import Loader from "./../components/Loader";

class ModificarPerfilVendedor extends Component {
  static navigationOptions = {
    title: "Modificar Perfil",
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
      idUsuario: null,
      nombreUsuario: null,
      passUsuario: null,
      emailUsuario: null,
      path: null,
      datosCambiados: "no",
      isStorageLoaded: false
    };
  }

  focusin() {
    if (this.props.campoError === "nombre") {
      //  alert("entra");
      this._inputNombre.focus();
      //  setTimeout(() => this._inputNombre.focus(), 50);
    } else if (this.props.campoError === "email") {
      this._email.focus();
      //  this._precio.focus();
    } else if (this.props.campoError === "password") {
      this._pass.focus();
      //  this._precio.focus();
    }
  }

  doModificarPerfilVendedor() {
    let {
      nombreLogeo,
      idUsuario,
      nombreUsuario,
      passUsuario,
      emailUsuario,
      datosCambiados
    } = this.state;
    this.props.modificarPerfilVendedor(
      nombreLogeo,
      idUsuario,
      nombreUsuario,
      passUsuario,
      emailUsuario,
      datosCambiados
    );

    setTimeout(() => this.focusin(), 600);
    //  setTimeout(() => Keyboard.dismiss(), 700);

    setTimeout(
      () =>
        this.props.campoError === "nombre" ||
        this.props.campoError === "email" ||
        this.props.campoError === "password"
          ? this.goScrollStart()
          : {},
      600
    );
  }

  goScrollStart() {
    setTimeout(() => {
      this.refs.scroll.scrollTo({ x: 0, y: 0, animated: true });
    }, 50);
  }

  async componentDidMount() {
    this.props.noErrores();
    await AsyncStorage.getItem("name").then(value => {
      this.setState({
        nombreLogeo: value
      });
    });

    return fetch("https://thegreenways.es/pagPerfilVendedor.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombreUsuario: this.state.nombreLogeo })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            //     isLoading: false,
            isStorageLoaded: true,
            idUsuario: responseJson[0].idVendedor,
            nombreUsuario: responseJson[0].name,
            emailUsuario: responseJson[0].email
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
    let { hasError, campoError, isLoading } = this.props;
    let { isStorageLoaded } = this.state;
    if (!isStorageLoaded) {
      return <Loader loading={true} />;
    } else {
      if (hasError) {
        return (
          <View style={styles.container}>
            <ScrollView
              ref="scroll"
              keyboardShouldPersistTaps="always"
              style={{ marginRight: 5 }}
            >
              <Loader loading={isLoading} />
              <View>
                <Text style={styles.bigblack}>
                  Introduzca unos nuevos datos de usuario
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "26%" }}>
                    <Text style={styles.tinyblack}>Nombre:</Text>
                  </View>
                  <View style={{ width: "74%" }}>
                    <TextInput
                      ref={c => {
                        this._inputNombre = c;
                      }}
                      placeholder={"Nombre de usuario"}
                      placeholderTextColor={"grey"}
                      returnKeyType={"next"}
                      autoCapitalize={"none"}
                      underlineColorAndroid={
                        campoError != "nombre" ? "#79B700" : "red"
                      }
                      style={styles.input}
                      onChangeText={nombreUsuario => {
                        // alert(this.state.datosCambiados);
                        if (this.state.datosCambiados == "no") {
                          this.setState({
                            datosCambiados: "si",
                            nombreUsuario: nombreUsuario
                          });
                          if (this.props.campoError === "nombre") {
                            this.props.noErrores();
                          }
                        } else {
                          this.setState({ nombreUsuario: nombreUsuario });
                          if (this.props.campoError === "nombre") {
                            this.props.noErrores();
                          }
                        }
                      }}
                      defaultValue={this.state.nombreUsuario}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "26%" }}>
                    <Text style={styles.tinyblack}>Email:</Text>
                  </View>
                  <View style={{ width: "74%" }}>
                    <TextInput
                      ref={c => {
                        this._email = c;
                      }}
                      placeholder={"Email"}
                      placeholderTextColor={"grey"}
                      returnKeyType={"next"}
                      autoCapitalize={"none"}
                      underlineColorAndroid={
                        campoError != "email" ? "#79B700" : "red"
                      }
                      style={styles.input}
                      onChangeText={emailUsuario => {
                        if (this.state.datosCambiados == "no") {
                          this.setState({
                            datosCambiados: "si",
                            emailUsuario: emailUsuario
                          });
                          if (this.props.campoError === "email") {
                            this.props.noErrores();
                          }
                        } else {
                          this.setState({ emailUsuario: emailUsuario });
                          if (this.props.campoError === "email") {
                            this.props.noErrores();
                          }
                        }
                      }}
                      defaultValue={this.state.emailUsuario}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "26%" }}>
                    <Text style={styles.tinyblack}>Verificar Contraseña:</Text>
                  </View>
                  <View style={{ width: "74%" }}>
                    <TextInput
                      ref={c => {
                        this._pass = c;
                      }}
                      placeholder={"Introduzca su contraseña actual"}
                      placeholderTextColor={"grey"}
                      returnKeyType={"next"}
                      autoCapitalize={"none"}
                      underlineColorAndroid={
                        campoError != "password" ? "#79B700" : "red"
                      }
                      style={styles.input}
                      secureTextEntry={true}
                      onChangeText={passUsuario => {
                        this.setState({ passUsuario });
                        if (this.props.campoError === "password") {
                          this.props.noErrores();
                        }
                      }}
                    />
                  </View>
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
                    this.doModificarPerfilVendedor();
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
            <ScrollView
              ref="scroll"
              keyboardShouldPersistTaps="always"
              style={{ marginRight: 5 }}
            >
              <Loader loading={isLoading} />
              <View>
                <Text style={styles.bigblack}>
                  Introduzca unos nuevos datos de usuario
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "26%" }}>
                    <Text style={styles.tinyblack}>Nombre:</Text>
                  </View>
                  <View style={{ width: "74%" }}>
                    <TextInput
                      ref={c => {
                        this._inputNombre = c;
                      }}
                      placeholder={"Nombre de usuario"}
                      placeholderTextColor={"grey"}
                      returnKeyType={"next"}
                      autoCapitalize={"none"}
                      underlineColorAndroid={"#79B700"}
                      style={styles.input}
                      onChangeText={nombreUsuario => {
                        // alert(this.state.datosCambiados);
                        if (this.state.datosCambiados == "no") {
                          this.setState({
                            datosCambiados: "si",
                            nombreUsuario: nombreUsuario
                          });
                        } else {
                          this.setState({ nombreUsuario: nombreUsuario });
                        }
                      }}
                      defaultValue={this.state.nombreUsuario}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "26%" }}>
                    <Text style={styles.tinyblack}>Email:</Text>
                  </View>
                  <View style={{ width: "74%" }}>
                    <TextInput
                      ref={c => {
                        this._email = c;
                      }}
                      placeholder={"Email"}
                      placeholderTextColor={"grey"}
                      returnKeyType={"next"}
                      autoCapitalize={"none"}
                      underlineColorAndroid={"#79B700"}
                      style={styles.input}
                      onChangeText={emailUsuario => {
                        if (this.state.datosCambiados == "no") {
                          this.setState({
                            datosCambiados: "si",
                            emailUsuario: emailUsuario
                          });
                        } else {
                          this.setState({ emailUsuario: emailUsuario });
                        }
                      }}
                      defaultValue={this.state.emailUsuario}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "26%" }}>
                    <Text style={styles.tinyblack}>Verificar Contraseña:</Text>
                  </View>
                  <View style={{ width: "74%" }}>
                    <TextInput
                      ref={c => {
                        this._pass = c;
                      }}
                      placeholder={"Introduzca su contraseña actual"}
                      placeholderTextColor={"grey"}
                      returnKeyType={"next"}
                      autoCapitalize={"none"}
                      underlineColorAndroid={"#79B700"}
                      style={styles.input}
                      secureTextEntry={true}
                      onChangeText={passUsuario =>
                        this.setState({ passUsuario })
                      }
                    />
                  </View>
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
                    this.doModificarPerfilVendedor();
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
    hasError: state.modificarPerfilVendedor.hasError,
    isLoading: state.modificarPerfilVendedor.isLoading,
    campoError: state.modificarPerfilVendedor.campoError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    modificarPerfilVendedor: (
      nombreLogeo,
      idUsuario,
      nombreUsuario,
      passUsuario,
      emailUsuario,
      datosCambiados
    ) =>
      dispatch(
        ModificarPerfilVendedorActions.modificarPerfilVendedor(
          nombreLogeo,
          idUsuario,
          nombreUsuario,
          passUsuario,
          emailUsuario,
          datosCambiados
        )
      ),
    noErrores: () => dispatch(ModificarPerfilVendedorActions.noErrores()),
    goMainVendedor: () => dispatch(MainVendedorActions.goPrincipalVendedor())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModificarPerfilVendedor);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  container2: {},

  input: {
    marginBottom: 8,
    marginLeft: 10,
    marginRight: 5,
    fontSize: 16
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
  tinyblack: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 13,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center"
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
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5
  }
});
