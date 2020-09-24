import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import {
  View,
  Text,
  Button,
  StyleSheet,
  BackHandler,
  Platform,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert
} from "react-native";
import LoginActions from "../actions/Login";
import MainVendedorActions from "../actions/MainVendedor";
import Loader from "../components/Loader";
import AsyncStorage from "@react-native-community/async-storage";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class CategoriasYCatalogo extends Component {
  static navigationOptions = {
    title: "Categorías/Catálogo",
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
      username: null,
      activarBotonCatalogo: false
    }
  }

  async componentDidMount()
  {

    await AsyncStorage.getItem("name").then(value => {
      this.setState({
        username: value
      });
    });
  
    return fetch("https://thegreenways.es/traerCategoriasComercio.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: this.state.username })
    })
    .then(response => response.json())
    .then(responseJson => {

      if(responseJson[0].categoriasComercio !== null)
      {
        this.setState({
          activarBotonCatalogo: true
        });
      }
    })
  }

  render() {
    let { hasError, isLogged, isLoading } = this.props;
    let {activarBotonCatalogo} = this.state
    return (
      <View style={styles.container}>
        <View style={styles.seccionPrincipal}>

          <View
            style={{
              width: winWidth * 0.9,
              marginBottom: winHeight * 0.03
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.goGestionCategoriasComercio();
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
                <Text style={styles.textoBotones}>{"GESTIONAR CATEGORÍAS"}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: winWidth * 0.9,
              marginBottom: winHeight * 0.03
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if(!activarBotonCatalogo)
                {
                  Alert.alert("Aviso", "Antes de introducir productos debes introducir alguna categoria para poder asignarla a tus productos.")
                }
                else
                {
                  this.props.goCatalogo();
                }
              }}
            >
              <View
                style={{
                  height: 55,
                  borderWidth: 1.5,
                  borderColor: "black",
                  borderRadius: 20,
                  backgroundColor: activarBotonCatalogo ? "#79B700" : "#778899",
                  marginLeft: "2%",
                  marginRight: "2%",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={styles.textoBotones}>{"GESTIÓNAR CATÁLOGO"}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{            
            width: winWidth * 0.9
          }}
        >
          <TouchableOpacity
            onPress={() => { 
                this.props.goPrincipal();
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
    );
  }
}

const mapStateToProps = state => {
  return {
    // isLogged: state.login.isLogged,
    // hasError: state.login.hasError,
    isLoading: state.login.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goCatalogo: () => dispatch(MainVendedorActions.goCatalogo()),
    goGestionCategoriasComercio: () => dispatch(MainVendedorActions.goGestionCategoriasComercio()),
    goPrincipal: () => dispatch(MainVendedorActions.goPrincipalVendedor()),
   // goModificarComercio: () => dispatch(MainVendedorActions.goModificarComercio()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoriasYCatalogo);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center"
  },
  button: {
    padding: 10,
    backgroundColor: "#36ada4"
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5
  },
  seccionPrincipal: {
    height: winHeight * 0.77,
    alignItems: "center",
    justifyContent: "center"
  }
});
