import React, { Component } from "react";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import AsyncStorage from '@react-native-community/async-storage';
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

import MainVendedorActions from "./../actions/MainVendedor";
import ModificarComercioActions from "./../actions/ModificarComercio";
import Loader from "./../components/Loader";

import ImagePicker from "react-native-image-picker";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

const options = {
  title: "Selecciona una imagen.",
  takePhotoButtontitle: "Toma una foto",
  chooseFrinLibraryButtonTitle: "Selección desde galería",
  quality: 1
};

class ModificarComercio extends Component {
  static navigationOptions = {
    title: "Modificar Comercio",
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
      nombreLogeo: null,
      nombreComercio: null,
      descripcionComercio: null,
      direccionComercio: null,
      imageSource: null,
      data: null,
      path: null,
      isStorageLoaded: false
    };
  }

  focusin() {
    if (this.props.campoError === "nombreComercio") {
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

  doModificarVendedor() {
    let {
      nombreLogeo,
      idComercio,
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

    this.props.modificarVendedor(
      nombreLogeo,
      idComercio,
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
        this.props.campoError === "nombreComercio" ||
        this.props.campoError === "descripcionComercio" ||
        this.props.campoError === "direccionComercio"
          ? this.goScrollStart()
          : {},
      600
    );
  }

  selectPhoto() {
    Keyboard.dismiss();

    ImagePicker.showImagePicker(options, response => {
    //  console.log("Response = ", response);

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

  async componentDidMount() {
    this.props.noErrores();
    await AsyncStorage.getItem("name").then(value =>
      this.setState({ nombreLogeo: value })
    );

    return fetch("https://thegreenways.es/pagComercioModificar.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombreLogeo: this.state.nombreLogeo })
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            isStorageLoaded: true,
            idComercio: responseJson[0].idComercio,
            nombreComercio: responseJson[0].nombreComercio,
            descripcionComercio: responseJson[0].descripcionComercio,
            direccionComercio: responseJson[0].localizacionComercio,
            imageSource: {
              uri: "https://thegreenways.es/" + responseJson[0].imagenComercio
            }
          },
          function() {
            this.props.cambiarLocalizacion(parseFloat(responseJson[0].latitud), parseFloat(responseJson[0].longitud));
            setTimeout(() => this.map.animateToRegion({
              latitude: parseFloat(responseJson[0].latitud),
              longitude: parseFloat(responseJson[0].longitud),
              latitudeDelta: 0.003,
              longitudeDelta: 0.003
            }), 1000);
          }
        );        
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentDidUpdate(prevprops) {

    if(prevprops !== this.props)
    {
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
  }

  render() {
    let { hasError, isLoading, campoError, latitud, longitud } = this.props;
    let { isStorageLoaded } = this.state;
    if (!isStorageLoaded) {
      return <Loader loading={true} />;
    } else {
      if (hasError) {
        return (
          <View style={styles.container}>
            <ScrollView ref="scroll" keyboardShouldPersistTaps="always">
              <Loader loading={isLoading} />
              <View>
                <Text style={styles.bigblack1}>
                  Introduzca los nuevos datos del comercio
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "26%" }}>
                    <Text style={styles.tinyblack}>Nombre:</Text>
                  </View>
                  <View style={{ width: "74%" }}>
                    <TextInput
                      ref={c => {
                        this._nombreComercio = c;
                      }}
                      placeholder={"Nombre del comercio"}
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
                      defaultValue={this.state.nombreComercio}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: "26%",
                      justifyContent: "center",
                      marginBottom: 30
                    }}
                  >
                    <Text style={styles.tinyblack}>Descripción:</Text>
                  </View>
                  <View style={{ width: "74%" }}>
                    <TextInput
                      ref={c => {
                        this._descripcionComercio = c;
                      }}
                      placeholder={
                        "Descripción del comercio [180 caracteres max.]"
                      }
                      placeholderTextColor={"grey"}
                      returnKeyType={"next"}
                      autoCapitalize={"none"}
                      underlineColorAndroid={
                        campoError !== "descripcionComercio" ? "#79B700" : "red"
                      }
                      style={styles.input}
                      multiline={true}
                      numberOfLines={2}
                      onChangeText={descripcionComercio => {
                        this.setState({ descripcionComercio });
                        if (this.props.campoError === "descripcionComercio") {
                          this.props.noErrores();
                        }
                      }}
                      defaultValue={this.state.descripcionComercio}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: "26%",
                      justifyContent: "center",
                      marginBottom: 30
                    }}
                  >
                    <Text style={styles.tinyblack}>Dirección:</Text>
                  </View>
                  <View style={{ width: "74%" }}>
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
                </View>
              </View>

              <Text />

              <View>
              <Text style={styles.bigblack}>Sitúe de nuevo su comercio en el mapa:</Text>
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
                  Introduzca una nueva imagen del comercio
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
                      width: winWidth * 0.48,
                      height: winWidth * 0.48
                    }}
                  >
                    <Image
                      style={styles.image}
                      source={
                        this.state.imageSource !== null
                          ? this.state.imageSource
                          : null
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
                    this.doModificarVendedor();
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
                    <Text style={styles.textoBotones}>{"COMERCIO"}</Text>
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
                    this.props.goMainVendedor();
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
                <Text style={styles.bigblack1}>
                  Introduzca los nuevos datos del comercio
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "26%" }}>
                    <Text style={styles.tinyblack}>Nombre:</Text>
                  </View>
                  <View style={{ width: "74%" }}>
                    <TextInput
                      ref={c => {
                        this._nombreComercio = c;
                      }}
                      placeholder={"Nombre del comercio"}
                      placeholderTextColor={"grey"}
                      returnKeyType={"next"}
                      autoCapitalize={"none"}
                      underlineColorAndroid={"#79B700"}
                      style={styles.input}
                      onChangeText={nombreComercio =>
                        this.setState({ nombreComercio })
                      }
                      defaultValue={this.state.nombreComercio}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: "26%",
                      justifyContent: "center",
                      marginBottom: 30
                    }}
                  >
                    <Text style={styles.tinyblack}>Descripción:</Text>
                  </View>
                  <View style={{ width: "74%" }}>
                    <TextInput
                      ref={c => {
                        this._descripcionComercio = c;
                      }}
                      placeholder={
                        "Descripción del comercio [180 caracteres max.]"
                      }
                      placeholderTextColor={"grey"}
                      returnKeyType={"next"}
                      autoCapitalize={"none"}
                      underlineColorAndroid={"#79B700"}
                      style={styles.input}
                      multiline={true}
                      numberOfLines={2}
                      onChangeText={descripcionComercio =>
                        this.setState({ descripcionComercio })
                      }
                      defaultValue={this.state.descripcionComercio}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      width: "26%",
                      justifyContent: "center",
                      marginBottom: 30
                    }}
                  >
                    <Text style={styles.tinyblack}>Dirección:</Text>
                  </View>
                  <View style={{ width: "74%" }}>
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
                      defaultValue={this.state.direccionComercio}
                    />
                  </View>
                </View>
              </View>

              <View>
              <Text style={styles.bigblack}>Sitúe de nuevo su comercio en el mapa:</Text>
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
                  Introduzca una nueva imagen del comercio
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
                      width: winWidth * 0.48,
                      height: winWidth * 0.48
                    }}
                  >
                    <Image
                      style={styles.image}
                      source={
                        this.state.imageSource !== null
                          ? this.state.imageSource
                          : null
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
                    this.doModificarVendedor();
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
                    <Text style={styles.textoBotones}>{"COMERCIO"}</Text>
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
                    this.props.goMainVendedor();
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
  //  hasError: state.modificarComercio.hasError,
    isLoading: state.modificarComercio.isLoading,
    campoError: state.modificarComercio.campoError,
    latitud: state.modificarComercio.latitud,
    longitud: state.modificarComercio.longitud,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    modificarVendedor: (
      nombreLogeo,
      idComercio,
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
        ModificarComercioActions.modificarComercio(
          nombreLogeo,
          idComercio,
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
    noErrores: () => dispatch(ModificarComercioActions.noErrores()),
    goMainVendedor: () => dispatch(MainVendedorActions.goPrincipalVendedor()),
    goMapa: () => dispatch(ModificarComercioActions.goMapa()),
    cambiarLocalizacion: (latitud,longitud) => dispatch(ModificarComercioActions.cambioCoordenadas(latitud,longitud))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModificarComercio);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  container2: {},

  input: {
    marginBottom: 8,
    fontSize: 16,
    marginRight: 5,
    marginLeft: 10
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
  bigblack1: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 15,
    marginBottom: 10
  },
  bigblack2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start"
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
  tinyblack: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 13,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center"
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
