import React, { Component } from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  Dimensions
} from "react-native";

import RegisterActions from "./../actions/Register";
import Loader from "./../components/Loader";

import ImagePicker from "react-native-image-picker";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

const options = {
  title: "Selecciona una imagen (En vertical y con el objetivo centrado)",
  takePhotoButtontitle: "Toma una foto",
  chooseFrinLibraryButtonTitle: "Selección desde galería",
  quality: 1
};

class Register extends Component {
  static navigationOptions = {
    title: "Registro"
  };

  constructor(props) {
    super(props);

    this.state = {
      username: null,
      email: null,
      pass: null,
      pass2: null,
      imageSource: null,
      data: null
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
    } else if (this.props.campoError === "password2") {
      this._pass2.focus();
      //  this._precio.focus();
    }
  }

  doRegister() {
    let { username, email, pass, pass2, imageSource, data } = this.state;
    this.props.register(username, email, pass, pass2, imageSource, data);
    setTimeout(() => this.focusin(), 600);

    setTimeout(
      () =>
        this.props.campoError === "nombre" ||
        this.props.campoError === "email" ||
        this.props.campoError === "password"
          ? this.goScrollStart()
          : {},
      600
    );

    setTimeout(
      () => (this.props.campoError === "password2" ? this.goScrollMid() : {}),
      650
    );
  }

  selectPhoto() {
    Keyboard.dismiss();

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          imageSource: source,
          data: response.data
        });

        this.goScrollEnd();
      }
    });
  }

  goScrollEnd() {
    setTimeout(() => {
      this.refs.scroll.scrollToEnd({ animated: true });
    }, 50);
  }

  goScrollStart() {
    setTimeout(() => {
      this.refs.scroll.scrollTo({ x: 0, y: 0, animated: true });
    }, 50);
  }

  goScrollMid() {
    setTimeout(() => {
      this.refs.scroll.scrollTo({ x: 0, y: 100, animated: true });
    }, 50);
  }

  render() {
    let { hasError, isLoading, campoError } = this.props;
    if (hasError) {
      return (
        <View style={styles.container}>
          <ScrollView ref="scroll" keyboardShouldPersistTaps="always">
            <Loader loading={isLoading} />
            <View>
              <Text style={styles.bigblack}>
                Introduzca los datos del usuario:
              </Text>

              <TextInput
                ref={c => {
                  this._inputNombre = c;
                }}
                placeholder={"Nombre de Usuario"}
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
                onChangeText={email => {
                  this.setState({ email });
                  if (this.props.campoError === "email") {
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
                underlineColorAndroid={
                  campoError != "password" ? "#79B700" : "red"
                }
                style={styles.input}
                secureTextEntry={true}
                onChangeText={pass => {
                  this.setState({ pass });
                  if (this.props.campoError === "password") {
                    this.props.noErrores();
                  }
                }}
              />
              <TextInput
                ref={c => {
                  this._pass2 = c;
                }}
                placeholder={"Repetir Contraseña"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={
                  campoError != "password2" ? "#79B700" : "red"
                }
                style={styles.input}
                secureTextEntry={true}
                onChangeText={pass2 => {
                  this.setState({ pass2 });
                  if (this.props.campoError === "password2") {
                    this.props.noErrores();
                  }
                }}
              />
            </View>

            <View>
              <Text style={styles.bigblack2}>
                Introduzca imagen de avatár (Opcional)
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: "40%",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                    onPress={this.selectPhoto.bind(this)}
                  >
                    <Image
                      style={{
                        height: 80,
                        width: 80,
                        resizeMode: "cover",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 20,
                        marginBottom: 40
                      }}
                      resizeMethod={"resize"}
                      source={require("GreenWaysProject/images/upload3.png")}
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "60%"
                  }}
                >
                  <Image
                    style={styles.image}
                    source={
                      this.state.imageSource != null
                        ? this.state.imageSource
                        : {
                            uri:
                              "https://thegreenways.es/upload/images/no_perfilaa.png"
                          }
                    }
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.lineaBotones}>
            <View
              style={{
                width: "49%",
                marginRight: "1%"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.doRegister();
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
                  <Text style={styles.textoBotones}>{"REGISTRARSE"}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: "49%",
                marginLeft: "1%"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.goLogin();
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
            <View>
              <Text style={styles.bigblack}>
                Introduzca los datos del usuario:
              </Text>

              <TextInput
                ref={c => {
                  this._inputNombre = c;
                }}
                placeholder={"Nombre de Usuario"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={"#79B700"}
                style={styles.input}
                onChangeText={username => this.setState({ username })}
              />
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
                onChangeText={email => this.setState({ email })}
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
              <TextInput
                ref={c => {
                  this._pass2 = c;
                }}
                placeholder={"Repetir Contraseña"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={"#79B700"}
                style={styles.input}
                secureTextEntry={true}
                onChangeText={pass2 => this.setState({ pass2 })}
              />
            </View>

            <View>
              <Text style={styles.bigblack2}>
                Introduzca imagen de avatár (Opcional)
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    width: "40%",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                    onPress={this.selectPhoto.bind(this)}
                  >
                    <Image
                      style={{
                        height: 80,
                        width: 80,
                        resizeMode: "cover",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 20,
                        marginBottom: 40
                      }}
                      resizeMethod={"resize"}
                      source={require("GreenWaysProject/images/upload3.png")}
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "60%"
                  }}
                >
                  <Image
                    style={styles.image}
                    source={
                      this.state.imageSource != null
                        ? this.state.imageSource
                        : {
                            uri:
                              "https://thegreenways.es/upload/images/no_perfilaa.png"
                          }
                    }
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.lineaBotones}>
            <View
              style={{
                width: "49%",
                marginRight: "1%"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.doRegister();
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
                  <Text style={styles.textoBotones}>{"REGISTRARSE"}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: "49%",
                marginLeft: "1%"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.goLogin();
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
    hasError: state.register.hasError,
    isLoading: state.register.isLoading,
    campoError: state.register.campoError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    register: (username, email, password, password2, imageSource, data) =>
      dispatch(
        RegisterActions.register(
          username,
          email,
          password,
          password2,
          imageSource,
          data
        )
      ),
    noErrores: () => dispatch(RegisterActions.noErrores()),
    goLogin: () => dispatch(RegisterActions.goLogin())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },

  input: {
    marginBottom: 8,
    fontSize: 16,
    marginRight: 5
  },
  button: {
    padding: 10,
    backgroundColor: "red"
  },
  bigblack: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 20
  },
  bigblack2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10
  },
  image: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
    borderColor: "#8E8E8E",
    borderWidth: 2
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  },
  lineaBotones: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignItems: "center",
    height: winHeight * 0.06,
    marginTop: winHeight * 0.01
  }
});
