import React, { Component } from "react";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import Geolocation from '@react-native-community/geolocation';
import RegisterActionsVendedor from "./../actions/RegisterVendedor";
import {
  View,
  Text,
  Button,
  Keyboard,
  StyleSheet,
  BackHandler,
  Platform,
  Image,
  Alert,
  TouchableOpacity,
  Dimensions
} from "react-native";
//import LoginActions from "./../actions/Login";
//import MainActions from "./../actions/Main";
//import Loader from "./../components/Loader";

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

class MapaRegistroVendedor extends Component {
  map = null;

  static navigationOptions = {
    title: "Localiza tu comercio"
  };

  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 43.055,
        longitude: -2.5166,
        latitudeDelta: 1.5,
        longitudeDelta: 1.5
      },
      ready: false,
      marker: null,
      latitudTemporal: null,
      longitudTemporal: null
    };
  }

  componentDidMount() {
    Keyboard.dismiss();
    this.getCurrentPosition();
  }

  setRegion(region) {
    if (this.state.ready) {
      this.setState({ region: region });
      setTimeout(() => this.map.animateToRegion(region), 100);
    }
  }

  fijarPosicion(){
    this.props.cambiarLocalizacion(this.state.latitudTemporal, this.state.longitudTemporal);
  }

  cambiarPosicion(e) {
    this.state.latitudTemporal = e.coordinate.latitude;
    this.state.longitudTemporal = e.coordinate.longitude;

    this.props.reRender(Math.random());
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
       //   console.log("latitude ::" + position.coords.latitude);
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
   // const { region, marker } = this.state;
    const { latitudTemporal, longitudTemporal } = this.state
    const { actualizar } = this.props;
    return (
      <View>
          <View style={{ flexDirection: "row", height: winHeight * 0.055 }}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Ayuda",
                    "Aquí puedes especificar en el mapa la localización de tu comercio para que los clientes sepan donde encontrarlo. Para ello, selecciona la posicion de tu comercio tocando sobre el mapa en el lugar deseado.\n\nPara facilitar esta tarea y lograr una posición mas precisa, puedes mover, girar e inclinar el mapa además de poder ampliar/alejar el zoom de este utilizando para ello 2 dedos como en un mapa típico de Google Maps."
                  );
                }}
                style={{
                  paddingTop: 7,
                  paddingBottom: 7,
                  paddingLeft: 10,
                  paddingRight: 10
                }}
              >
                <Image
                  style={{
                    height: 26,
                    width: 26,
                    resizeMode: "cover"
                  }}
                  resizeMethod={"resize"}
                  source={require("GreenWaysProject/images/info8.png")}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{ justifyContent: "center", alignItems: "flex-start" }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: 18
                }}
              >
                Ayuda
              </Text>
            </View>
          </View>
        {/* SEPARADOR */}
        <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1
            }}
          />
        <View style={{ height : winHeight * 0.74 }}>
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
            {latitudTemporal != null && longitudTemporal != null ? (
              <Marker
                coordinate={{latitude: latitudTemporal, longitude: longitudTemporal}}
               // title={marker.title}
               // description={marker.subtitle}
                draggable
                onDragEnd={e => {
                  this.cambiarPosicion(e.nativeEvent);
                }}
              />
            ) : null}

            {/*markers.map(renderMarker)*/}

            {/*(children && children) || null*/}
          </MapView>
        </View>

        <View style={{flexDirection: "row"}}>
          <View
            style={{
              marginTop: "0.5%",
              marginBottom: "1%",
              flex: 0.5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.fijarPosicion();
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
                <Text style={styles.textoBotones}>ACEPTAR</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: "0.5%",
              marginBottom: "1%",
              flex: 0.5
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
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLogged: state.login.isLogged,
    hasError: state.login.hasError,
    isLoading: state.login.isLoading,
    actualizar: state.register.actualizar    
  };
};

const mapDispatchToProps = dispatch => {
  return {
    cambiarLocalizacion : (latitud,longitud) => dispatch(RegisterActionsVendedor.cambioCoordenadas(latitud,longitud)),
    reRender: (random) => dispatch(RegisterActionsVendedor.reRender(random))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapaRegistroVendedor);

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
