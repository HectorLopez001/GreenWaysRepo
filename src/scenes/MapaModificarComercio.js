import React, { Component } from "react";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  Text,
  Keyboard,
  StyleSheet,
  Platform,
  Alert,
  TouchableOpacity,
  Dimensions
} from "react-native";

import ModificarComercioActions from "./../actions/ModificarComercio";

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

const initialRegion = {
  latitude: 43.055,
  longitude: -2.5166,
  latitudeDelta: 1.5,
  longitudeDelta: 1.5
};

class MapaModificarComercio extends Component {
  map = null;

  static navigationOptions = {
    title: "Localiza tu comercio"
  };

  //constructor(props) {
  // super(props);
  state = {
    region: {
      latitude: 43.055,
      longitude: -2.5166,
      latitudeDelta: 1.5,
      longitudeDelta: 1.5
    },
    ready: false,
    nombreLogeo: null,
    marker: null
  };
  //  }

  setRegion(region) {
    if (this.state.ready) {
      this.setState({ region: region });
      setTimeout(() => this.map.animateToRegion(region), 100);
    }
  }

  async componentDidMount() {

    Keyboard.dismiss();

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

        this.props.cambiarLocalizacion(parseFloat(responseJson[0].latitud), parseFloat(responseJson[0].longitud));
        this.getCurrentPosition();        
      })
      .catch(error => {
        console.error(error);
      });
  }

  cambiarPosicion(e)  {
    this.props.cambiarLocalizacion(e.coordinate.latitude, e.coordinate.longitude);
  }

  getCurrentPosition() {
    try {
      Geolocation.getCurrentPosition(
        position => {
          const region = {
            latitude:
              this.props.latitud !== null ? this.props.latitud : 0,
            longitude:
              this.props.longitud != null ? this.props.longitud : 0,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          };
          // console.log("latitude ::" + position.coords.latitude);
          this.setState({ ready: true });
          this.setRegion(region);
        },
        error => {
          //TODO: better design
          switch (error.code) {
            case 1:
              if (Platform.OS === "ios") {
                Alert.alert(
                  "",
                  "Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Privacidad - Localización"
                );
              } else {
                Alert.alert(
                  "",
                  "Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Apps - ExampleApp - Localización"
                );
              }
              break;
            default:
              Alert.alert("", "Error al detectar tu locación, active la localización GPS.");
          }
        }
      );
    } catch (e) {
      alert(e.message || "");
    }
  }

  onMapReady = e => {
    if (!this.state.ready) {
      this.setState({ ready: true });
    }
  };

  onRegionChange = region => {
    console.log("onRegionChange", region);
  };

  onRegionChangeComplete = region => {
    console.log("onRegionChangeComplete", region);
  };
  render() {
    const { region } = this.state;
    const { latitud, longitud } = this.props;

    return (
      <View>
        <View style={{ height: "90%" }}>
          <MapView
            showsUserLocation
            ref={map => {
              this.map = map;
            }}
            //data={markers}
            //annotations={marker}
            initialRegion={initialRegion}
            //  renderMarker={renderMarker}
            onMapReady={this.onMapReady}
            showsMyLocationButton={false}
            onRegionChange={this.onRegionChange}
            onRegionChangeComplete={this.onRegionChangeComplete}
            style={StyleSheet.absoluteFill}
            textStyle={{ color: "#bc8b00" }}
            containerStyle={{
              backgroundColor: "white",
              borderColor: "#BC8B00"
            }}
            onPress={e => {
              this.cambiarPosicion(e.nativeEvent);
            }}
          >
            {latitud != null && latitud != null ? (
              <Marker
                coordinate={{latitude: latitud, longitude: longitud}}
               // title={marker.title}
               // description={marker.subtitle}
                draggable
                onDragEnd={e => {
                  this.cambiarPosicion(e.nativeEvent);
                }}
              />
            ) : null}

          </MapView>
        </View>

        <View
          style={{
            marginTop: "0.5%",
            marginBottom: "1%"
          }}
        >
          <TouchableOpacity
            onPress={() => {
              Actions.pop();
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
    );
  }
}

const mapStateToProps = state => {
  return {
    isLogged: state.login.isLogged,
    hasError: state.login.hasError,
    isLoading: state.login.isLoading,
    latitud: state.modificarComercio.latitud,
    longitud: state.modificarComercio.longitud
  };
};

const mapDispatchToProps = dispatch => {
  return {
    cambiarLocalizacion : (latitud,longitud) => dispatch(ModificarComercioActions.cambioCoordenadas(latitud,longitud))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapaModificarComercio);

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    padding: 20
  },
  button: {
    padding: 10,
    backgroundColor: "#36ada4"
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  },
  container: { ...StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject }
});
