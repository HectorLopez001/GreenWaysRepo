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
  Dimensions
} from "react-native";
import LoginActions from "./../actions/Login";
import MainVendedorActions from "./../actions/MainVendedor";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class MainVendedor extends Component {
  static navigationOptions = {
    title: "Página Principal Comerciante",
    gesturesEnabled: false,
    headerLeft: null,
    headerRight: (
      <View>
        <TouchableOpacity
          onPress={() => {
            Actions.PerfilVendedor();
          }}
          style={{ padding: 10 }}
        >
          <Image
            style={{
              height: 50,
              width: 50,
              resizeMode: "cover"
            }}
            resizeMethod={"resize"}
            source={require("GreenWaysProject/images/perfil.png")}
          />
        </TouchableOpacity>
      </View>
    )
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    /*  setTimeout(() => {
      this.props.isLoading == true ? this.terminarLoader() : null;
    }, 3000);*/
  }

  terminarLoader() {
    this.props.terminarLoader();
  }

  render() {
    let { hasError, isLogged, isLoading } = this.props;
    return (
      <View style={styles.container}>
        <Loader loading={isLoading} />

        <View
          style={{
            width: winWidth * 0.9,
            marginBottom: winHeight * 0.03
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.goModificarComercio();
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
              <Text style={styles.textoBotones}>
                {"MODIFICAR DATOS COMERCIO"}
              </Text>
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
              this.props.goCatalogo();
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
              <Text style={styles.textoBotones}>{"GESTIÓN DEL CATÁLOGO"}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: winWidth * 0.9,
            marginBottom: winHeight * 0.2
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.goVerFeedbacks();
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
              <Text style={styles.textoBotones}>
                {"VER VALORACIONES OBTENIDAS"}
              </Text>
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
    logout: () => dispatch(LoginActions.logout()),
    goCatalogo: () => dispatch(MainVendedorActions.goCatalogo()),
    goModificarComercio: () =>
      dispatch(MainVendedorActions.goModificarComercio()),
    goVerFeedbacks: () => dispatch(MainVendedorActions.goVerFeedbacks()),
    terminarLoader: () => dispatch(MainVendedorActions.terminarLoader())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainVendedor);

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
  }
});
