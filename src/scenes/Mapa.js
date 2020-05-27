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
  Button,
  StyleSheet,
  BackHandler,
  Platform,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions
} from "react-native";
//import LoginActions from "./../actions/Login";
import MainActions from "./../actions/Main";
//import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.01;

const initialRegion = {
  latitude: 43.055,
  longitude: -2.5166,
  latitudeDelta: 1.5,
  longitudeDelta: 1.5
};

class Mapa extends Component {
  map = null;

  static navigationOptions = {
    title: "Mapa de Tiendas",
    headerRight: (
      <View>
        <TouchableOpacity
          onPress={() => {
            Actions.Main();
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
    datas: null,
    filteredMarkers: [],
    markers: []
  };
  //  }

  setRegion(region) {
    if (this.state.ready) {
      this.setState({ region: region });
      setTimeout(() => this.map.animateToRegion(region), 50);
    }
  }

 async componentDidMount() {
    //  console.log("Component did mount");

    return fetch("https://thegreenways.es/listaComerciosRevisados.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(responseJson => {
        var numeroComercios = Object.keys(responseJson).length;
        for (i = 0; i < numeroComercios; i++) {
          this.state.markers.push(
            (marker = {
              latlng: {
                latitude: parseFloat(responseJson[i].latitud),
                longitude: parseFloat(responseJson[i].longitud)
              },
              title: responseJson[i].nombreComercio,
              subtitle: responseJson[i].localizacionComercio
            })
          );
        }

        // alert(responseJson[0].latitud);

        this.getCurrentPosition();
      })
      .catch(error => {
        console.error(error);
      });

    Keyboard.dismiss();

    this.getCurrentPosition();
  }

  getCurrentPosition() {
    try {
      Geolocation.getCurrentPosition(
        position => {
          const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          };
          console.log("latitude ::" + position.coords.latitude);
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
              Alert.alert(
                "",
                "Error al detectar tu locación, active la localización GPS."
              );
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
    //console.log("onRegionChange", region);
  };

  onRegionChangeComplete = region => {
    //  console.log("onRegionChangeComplete", region);
  };

  goComercio(nombreComercio) {
    AsyncStorage.setItem("comercio", nombreComercio);

    this.props.goComercio();
  }

  render() {
    const { region, markers } = this.state;
    const { children, renderMarker /*, markers*/ } = this.props;

    return (
      <View>
        <View style={{ height: "90%" }}>
          <MapView
            showsUserLocation
            ref={map => {
              this.map = map;
            }}
            annotations={markers}
            zoomControlEnabled={true}
            showsCompass={true}
            initialRegion={initialRegion}
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
          >
            {markers.map((marker,index) => (
              <Marker
                key={index}
                coordinate={marker.latlng}
                title={marker.title}
                description={marker.subtitle}
                onCalloutPress={() => this.goComercio(marker.title)}
              />
            ))}
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
    isLoading: state.login.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    //logout: () => dispatch(LoginActions.logout()),
    // comercios: () => dispatch(MainActions.goComercios()),
    goComercio: () => dispatch(MainActions.goComercioMapa())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mapa);

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
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5
  },
  container: { ...StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject }
});
