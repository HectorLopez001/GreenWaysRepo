import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";

import MainVendedorActions from "./../actions/MainVendedor";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class VerFeedbacksComercioProductos extends Component {
  static navigationOptions = {
    title: "Valoraciones Obtenidas",
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

    };
  }

  render() {
    return (
      <View style={styles.container}>

        <View
          style={{
            width: winWidth * 0.9,
            marginBottom: winHeight * 0.03
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
                {"VER VALORACIONES COMERCIO"}
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
              this.props.goVerFeedbacksProductos();
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
                {"VER VALORACIONES PRODUCTOS"}
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
    // isLogged: state.login.isLogged,
    // hasError: state.register.hasError
    // isLoading: state.register.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // goComercios: () => dispatch(MainActions.goComercios()),
    // goCatalogoCliente: () => dispatch(MainActions.goCatalogoCliente())
    goVerFeedbacks: () => dispatch(MainVendedorActions.goVerFeedbacksComercio()),
    goVerFeedbacksProductos: () => dispatch(MainVendedorActions.goVerFeedbacksProductos()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerFeedbacksComercioProductos);

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
