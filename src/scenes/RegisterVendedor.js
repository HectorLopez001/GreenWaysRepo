import React, { Component } from "react";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { connect } from "react-redux";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  Dimensions
} from "react-native";

import RegisterActionsVendedor from "./../actions/RegisterVendedor";
import Loader from "./../components/Loader";

import ImagePicker from "react-native-image-picker";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

const options = {
  title: "Selecciona una imagen (En vertical y con el comercio centrado)",
  takePhotoButtontitle: "Toma una foto",
  chooseFrinLibraryButtonTitle: "Selección desde galería",
  quality: 1
};

class RegisterVendedor extends Component {

  static navigationOptions = {
    title: "Registro de Vendedor"
  };

  constructor(props) {
    super(props);

    this.state = {
      username: null,
      email: null,
      password: null,
      password2: null,
      nombreComercio: null,
      descripcionComercio: null,
      direccionComercio: null,
      imageSource: null,
      data: null,
      path: null
    };
  }

  componentDidMount() {

     this.props.cambiarLocalizacion(null, null);
   }

  componentDidUpdate() {

    let region = {
      latitude: this.props.latitud,
      longitude: this.props.longitud,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003
    };

    this.props.cambiarLocalizacion(this.props.latitud, this.props.longitud);

    if(this.props.latitud !== null)
    {
      setTimeout(() => this.map.animateToRegion(region), 100);
    }

  }


  // onMapReady = e => {
  //   if (!this.state.ready) {
  //     this.setState({ ready: true });
  //   }
  // };

  // onRegionChange = region => {
  //   console.log("onRegionChange", region);
  // };

  // onRegionChangeComplete = region => {
  //   console.log("onRegionChangeComplete", region);
  // };


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
    } else if (this.props.campoError === "nombreComercio") {
      this._nombreComercio.focus();
      //  this._precio.focus();
    } else if (this.props.campoError === "descripcionComercio") {
      this._descripcionComercio.focus();
      //  this._precio.focus();
    } else if (this.props.campoError === "direccionComercio") {
      this._direccionComercio.focus();
      //  this._precio.focus();
    }
  }

  doRegisterVendedor() {
    let {
      username,
      email,
      password,
      password2,
      nombreComercio,
      descripcionComercio,
      direccionComercio,
      imageSource,
      data,
      path
    } = this.state;

    let {
      latitud,
      longitud
    } = this.props;

    this.props.registerVendedor(
      username,
      email,
      password,
      password2,
      nombreComercio,
      descripcionComercio,
      direccionComercio,
      latitud,
      longitud,
      imageSource,
      data,
      path
    );
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
      () =>
        this.props.campoError === "password2" ||
        this.props.campoError === "nombreComercio" ||
        this.props.campoError === "descripcionComercio"
          ? this.goScrollMid()
          : {},
      650
    );

    setTimeout(
      () =>
        this.props.campoError === "latitud" ||
        this.props.campoError === "direccionComercio"
          ? this.goScrollMapa()
          : {},
      700
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
      this.refs.scroll.scrollTo({ x: 0, y: 200, animated: true });
    }, 50);
  }

  goScrollMapa() {
    setTimeout(() => {
      this.refs.scroll.scrollTo({ x: 0, y: 430, animated: true });
    }, 50);
  }



  render() {
    //const { latitud, longitud } = this.buildValuesFromProps();
    //const {latitud, longitud} = this.props;

    let { hasError, isLoading, campoError, latitud, longitud  } = this.props;
    if (hasError) {
      return (
        <View style={styles.container}>
          <ScrollView ref="scroll" keyboardShouldPersistTaps="always">
            <Loader loading={isLoading} />
            <View>
              <Text style={styles.bigblack}>
                Introduzca los datos del vendedor:
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
                  campoError !== "nombre" ? "#79B700" : "red"
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
                  campoError !== "email" ? "#79B700" : "red"
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
                  campoError !== "password" ? "#79B700" : "red"
                }
                style={styles.input}
                secureTextEntry={true}
                onChangeText={password => {
                  this.setState({ password });
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
                  campoError !== "password2" ? "#79B700" : "red"
                }
                style={styles.input}
                secureTextEntry={true}
                onChangeText={password2 => {
                  this.setState({ password2 });
                  if (this.props.campoError === "password2") {
                    this.props.noErrores();
                  }
                }}
              />

              <Text style={styles.bigblack}>
                Introduzca los datos del comercio:
              </Text>

              <TextInput
                ref={c => {
                  this._nombreComercio = c;
                }}
                placeholder={"Nombre del Comercio"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={
                  campoError !== "nombreComercio" ? "#79B700" : "red"
                }
                style={styles.input}
                onChangeText={nombreComercio => {
                  this.setState({ nombreComercio });
                  if (this.props.campoError === "nombreComercio") {
                    this.props.noErrores();
                  }
                }}
              />
              <TextInput
                ref={c => {
                  this._descripcionComercio = c;
                }}
                placeholder={"Descripción del Comercio [180 caracteres max.]"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={
                  campoError !== "descripcionComercio" ? "#79B700" : "red"
                }
                style={styles.input}
                multiline={true}
                onChangeText={descripcionComercio => {
                  this.setState({ descripcionComercio });
                  if (this.props.campoError === "descripcionComercio") {
                    this.props.noErrores();
                  }
                }}
              />
              <TextInput
                ref={c => {
                  this._direccionComercio = c;
                }}
                placeholder={"Dirección del Comercio"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={
                  campoError !== "direccionComercio" ? "#79B700" : "red"
                }
                style={styles.input}
                onChangeText={direccionComercio => {
                  this.setState({ direccionComercio });
                  if (this.props.campoError === "direccionComercio") {
                    this.props.noErrores();
                  }
                }}
              />
            </View>

            <View>
              <Text style={styles.bigblack}>Sitúe su comercio en el mapa:</Text>
              <View style={latitud === null ? styles.containerMapa : styles.containerMapa2}>
                <View
                  style={{
                    marginRight: 10, 
                    width: winWidth * 0.422,
                    justifyContent: "center",
                    alignItems: "center"
                  }}

                  style={latitud === null ? styles.containerIconoMapa : styles.containerIconoMapa2}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.props.goMapa();
                    }}
                  >
                    <Image
                      style={{
                        height: 100,
                        width: 100,
                        resizeMode: "cover",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 20
                      }}
                      resizeMethod={"resize"}
                      source={require("GreenWaysProject/images/iconoMapa2.png")}
                    />
                  </TouchableOpacity>
                </View>

                {latitud !== null ?
                  <View style={{height: winWidth * 0.48, width: winWidth * 0.48, borderWidth: 2, borderColor: "black", marginTop: 20}}>  
                    <MapView
                      ref={map => {
                        this.map = map;
                      }}
                      initialRegion={{
                        latitude: this.props.latitud,
                        longitude: this.props.longitud,
                        latitudeDelta: 0.003,
                        longitudeDelta: 0.003
                      }}
                      onMapReady={this.onMapReady}
                      showsMyLocationButton={false}
                      scrollEnabled={false}
                      zoomEnabled={false}
                      style={StyleSheet.absoluteFill}
                      textStyle={{ color: "#bc8b00" }}
                      containerStyle={{
                        backgroundColor: "white",
                        borderColor: "#BC8B00"
                      }}
                    >
                      <Marker
                        coordinate={{latitude: latitud, longitude: longitud}}
                      />
                    </MapView>
                  </View>
                : null}
              </View>
            </View>

            <Text />

            <View style={styles.container2}>
              <Text style={styles.bigblack2}>
                Introduzca imagen del comercio (Opcional)
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
                    marginRight: 10, 
                    width: winWidth * 0.422,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={this.selectPhoto.bind(this)}
                  >
                    <Image
                      style={{
                        height: 80,
                        width: 80,
                        resizeMode: "cover",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 20,
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
                    width: winWidth * 0.48,
                    height: winWidth * 0.48
                  }}
                >
                  <Image
                    style={styles.image}
                    source={
                      this.state.imageSource !== null
                        ? this.state.imageSource
                        : require("GreenWaysProject/images/comercio10.jpg")
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
                  this.doRegisterVendedor();
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
                Introduzca los datos del vendedor:
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
                onChangeText={password => this.setState({ password })}
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
                onChangeText={password2 => this.setState({ password2 })}
              />

              <Text style={styles.bigblack}>
                Introduzca los datos del comercio:
              </Text>

              <TextInput
                ref={c => {
                  this._nombreComercio = c;
                }}
                placeholder={"Nombre del Comercio"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={"#79B700"}
                style={styles.input}
                onChangeText={nombreComercio =>
                  this.setState({ nombreComercio })
                }
              />
              <TextInput
                ref={c => {
                  this._descripcionComercio = c;
                }}
                placeholder={"Descripción del Comercio [180 caracteres]"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={"#79B700"}
                style={styles.input}
                multiline={true}
                onChangeText={descripcionComercio =>
                  this.setState({ descripcionComercio })
                }
              />
              <TextInput
                ref={c => {
                  this._direccionComercio = c;
                }}
                placeholder={"Dirección del Comercio"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={"#79B700"}
                style={styles.input}
                onChangeText={direccionComercio =>
                  this.setState({ direccionComercio })
                }
              />
            </View>

            <Text />

            <View>
              <Text style={styles.bigblack}>Sitúe su comercio en el mapa:</Text>
              <View style={latitud === null ? styles.containerMapa : styles.containerMapa2}>
                <View
                  style={{
                  //  width: "40%",
                   // flex: 0.4,
                    marginRight: 10, 
                    width: winWidth * 0.422,
                    justifyContent: "center",
                    alignItems: "center"
                  }}

                  style={latitud === null ? styles.containerIconoMapa : styles.containerIconoMapa2}
                >
                  <TouchableOpacity
                    // style={{
                    //   justifyContent: "center",
                    //   alignItems: "center"
                    // }}
                    onPress={() => {
                      this.props.goMapa();
                    }}
                  >
                    <Image
                      style={{
                        height: 100,
                        width: 100,
                        resizeMode: "cover",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 20
                      }}
                      resizeMethod={"resize"}
                      source={require("GreenWaysProject/images/iconoMapa2.png")}
                    />
                  </TouchableOpacity>
                </View>

                {latitud !== null ?
                  <View style={{height: winWidth * 0.48, width: winWidth * 0.48, borderWidth: 2, borderColor: "black", marginTop: 20}}>  
                    <MapView
                      ref={map => {
                        this.map = map;
                      }}
                      initialRegion={{
                        latitude: this.props.latitud,
                        longitude: this.props.longitud,
                        latitudeDelta: 0.003,
                        longitudeDelta: 0.003
                      }}
                      onMapReady={this.onMapReady}
                      showsMyLocationButton={false}
                      scrollEnabled={false}
                      zoomEnabled={false}
                      style={StyleSheet.absoluteFill}
                      textStyle={{ color: "#bc8b00" }}
                      containerStyle={{
                        backgroundColor: "white",
                        borderColor: "#BC8B00"
                      }}
                    >
                      <Marker
                        coordinate={{latitude: latitud, longitude: longitud}}
                      />
                    </MapView>
                  </View>
                : null}
              </View>
            </View>

            <Text />

            <View style={styles.container2}>
              <Text style={styles.bigblack2}>
                Introduzca imagen del comercio (Opcional)
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
                    marginRight: 10, 
                    width: winWidth * 0.422,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <TouchableOpacity
                    onPress={this.selectPhoto.bind(this)}
                  >
                    <Image
                      style={{
                        height: 80,
                        width: 80,
                        resizeMode: "cover",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 20,
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
                    width: winWidth * 0.48,
                    height: winWidth * 0.48
                  }}
                >
                  <Image
                    style={styles.image}
                    source={
                      this.state.imageSource !== null
                        ? this.state.imageSource
                        : require("GreenWaysProject/images/comercio10.jpg")
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
                  this.doRegisterVendedor();
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
    campoError: state.register.campoError,
    latitud: state.register.latitud,
    longitud: state.register.longitud
  };
};

const mapDispatchToProps = dispatch => {
  return {
    registerVendedor: (
      username,
      email,
      password,
      password2,
      nombreComercio,
      descripcionComercio,
      direccionComercio,
      latitud,
      longitud,
      imageSource,
      data,
      path
    ) =>
      dispatch(
        RegisterActionsVendedor.registerVendedor(
          username,
          email,
          password,
          password2,
          nombreComercio,
          descripcionComercio,
          direccionComercio,
          latitud,
          longitud,
          imageSource,
          data,
          path
        )
      ),
    noErrores: () => dispatch(RegisterActionsVendedor.noErrores()),
    goLogin: () => dispatch(RegisterActionsVendedor.goLogin()),
    goMapa: () => dispatch(RegisterActionsVendedor.goMapa()),
    cambiarLocalizacion: (latitud,longitud) => dispatch(RegisterActionsVendedor.cambioCoordenadas(latitud,longitud))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterVendedor);

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
    marginTop: 22
  },
  bigblack2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 22,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10
  },
  image: {
    width: winWidth * 0.48,
    height: winWidth * 0.48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
    borderColor: "black",
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
    height: winHeight * 0.06,
    marginTop: winHeight * 0.01
  },
  containerMapa: {

  },
  containerMapa2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  containerIconoMapa: {
    marginRight: 10, 
  //  width: winWidth * 0.422,
    justifyContent: "center",
    alignItems: "center"
  },
  containerIconoMapa2: {
    marginRight: 10, 
    width: winWidth * 0.422,
    justifyContent: "center",
    alignItems: "center"
  }
});
