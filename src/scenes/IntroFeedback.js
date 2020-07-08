import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import Stars from "react-native-stars";
import AsyncStorage from '@react-native-community/async-storage';
import ImageLoad from "react-native-image-placeholder";

import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";

import FeedbackActions from "../actions/Feedback";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class IntroFeedback extends Component {
  static navigationOptions = {
    title: "Introducir valoración",
    headerRight: (
      <View>
        <TouchableOpacity
          onPress={() => {
            Actions.Main();
            return;
          }}
          style={{ padding: winHeight * 0.015 }}
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
      nombreUsuario: null,
      nombreProducto: null,
      nombreComercio: null,
      pathImagen: null,
      nota: null,
      titulo: null,
      comentario: null,
      buscador: null,
      isStorageLoaded: false
    };
  }

  focusin() {
    if (this.props.campoError === "titulo") {
      this._inputTitulo.focus();
    } else if (this.props.campoError === "comentario") {
      this._inputComentario.focus();
    }
  }

  componentDidMount() {
    //this.props.noErrores();
    AsyncStorage.getItem("nombreProducto").then(value =>
      this.setState({ nombreProducto: value })
    );

    AsyncStorage.getItem("nombreComercio").then(value =>
      this.setState({ nombreComercio: value })
    );

    AsyncStorage.getItem("pathImagen").then(value =>
      this.setState({ pathImagen: value })
    );

    AsyncStorage.getItem("name").then(value =>
      this.setState({ nombreUsuario: value, isStorageLoaded: true })
    );

    AsyncStorage.getItem("buscador").then(value =>
      this.setState({ buscador: value })
    );
  }

  guardarFeedback() {
    let {
      nombreUsuario,
      nombreProducto,
      nombreComercio,
      nota,
      titulo,
      comentario,
      buscador
    } = this.state;
    this.props.guardarFeedback(
      nombreUsuario,
      nombreProducto,
      nombreComercio,
      nota,
      titulo,
      comentario,
      buscador
    );
    setTimeout(() => this.focusin(), 600);

    setTimeout(
      () =>
        this.props.campoError === "titulo" ||
        this.props.campoError === "comentario"
          ? this.goScrollStart()
          : {},
      600
    );

    /*setTimeout(
      () => (this.props.campoError === "password2" ? this.goScrollMid() : {}),
      650
    );
    */
  }

  /* goScrollEnd() {
    setTimeout(() => {
      this.refs.scroll.scrollToEnd({ animated: true });
    }, 50);
  }*/

  goScrollStart() {
    setTimeout(() => {
      this.refs.scroll.scrollTo({ x: 0, y: 500, animated: true });
    }, 50);
  }

  /*goScrollMid() {
    setTimeout(() => {
      this.refs.scroll.scrollTo({ x: 0, y: 100, animated: true });
    }, 50);
  } */

  render() {
    var Image_Http_URL = {
      uri: "https://thegreenways.es/" + this.state.pathImagen
    };

    let { hasError, isLoading, campoError } = this.props;
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
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <Text style={styles.bigblack}>Indica tu opinión </Text>
                  </View>
                  <View>
                    <Text style={styles.bigblack}>
                      {this.state.nombreProducto == " "
                        ? "sobre el comercio:"
                        : "sobre el producto:"}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginTop: 20,
                    marginBottom: 20,
                    borderWidth: 1.5
                  }}
                >
                  <View
                    style={{
                      height: winHeight * 0.22,
                      width: winWidth * 0.4,
                      marginRight: "1%"
                    }}
                  >
                    <ImageLoad
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        width: undefined,
                        height: undefined,
                        borderColor: "#8E8E8E",
                        borderWidth: 2,
                        marginBottom: 15,
                        marginTop: 15
                      }}
                      resizeMethod={"resize"}
                      source={Image_Http_URL}
                      placeholderSource={require("GreenWaysProject/images/time.png")}
                      isShowActivity={false}
                      placeholderStyle={styles.imgPlaceholder}
                    />
                  </View>

                  <View style={{ marginLeft: "1%", width: winWidth * 0.4 }}>
                    <Text style={styles.tinyblack}>
                      {this.state.nombreProducto != " "
                        ? this.state.nombreProducto
                        : this.state.nombreComercio}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    marginBottom: 20,
                    marginTop: 10
                  }}
                >
                  <Stars
                    default={2.5}
                    count={5}
                    half={true}
                    update={val => {
                      this.setState({ nota: val });
                    }}
                    starSize={
                      50
                    } /* must be set to the size of the custom component if in selection mode */
                    fullStar={require("./../../images/starFilled.png")}
                    emptyStar={require("./../../images/starEmpty.png")}
                    halfStar={require("./../../images/starHalf.png")}
                  />
                </View>
                <TextInput
                  ref={c => {
                    this._inputTitulo = c;
                  }}
                  placeholder={"Añade un título"}
                  placeholderTextColor={"grey"}
                  returnKeyType={"next"}
                  autoCapitalize={"none"}
                  underlineColorAndroid={
                    campoError != "titulo" ? "#79B700" : "red"
                  }
                  style={styles.input}
                  onChangeText={titulo => {
                    this.setState({ titulo });
                    if (this.props.campoError === "titulo") {
                      this.props.noErrores();
                    }
                  }}
                />
                <TextInput
                  ref={c => {
                    this._inputComentario = c;
                  }}
                  placeholder={"Comentario"}
                  placeholderTextColor={"grey"}
                  returnKeyType={"next"}
                  autoCapitalize={"none"}
                  numberOfLines={1}
                  multiline={true}
                  underlineColorAndroid={
                    campoError != "comentario" ? "#79B700" : "red"
                  }
                  style={styles.input2}
                  onChangeText={comentario => {
                    this.setState({ comentario });
                    if (this.props.campoError === "comentario") {
                      this.props.noErrores();
                    }
                  }}
                />
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
                    this.guardarFeedback();
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
                    <Text style={styles.textoBotones}>{"GUARDAR"}</Text>
                    <Text style={styles.textoBotones}>{"VALORACIÓN"}</Text>
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
              // style={{ marginBottom: winHeight * 0.2 }}
              //  style={{ height: winHeight * 0.1 }}
            >
              <Loader loading={isLoading} />

              <View style={{ marginBottom: winHeight * 0.2 }}>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <Text style={styles.bigblack}>Indica tu opinión </Text>
                  </View>
                  <View>
                    <Text style={styles.bigblack}>
                      {this.state.nombreProducto == " "
                        ? "sobre el comercio:"
                        : "sobre el producto:"}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginTop: 20,
                    marginBottom: 20,
                    borderWidth: 1.5
                  }}
                >
                  <View
                    style={{
                      height: winHeight * 0.22,
                      width: winWidth * 0.4,
                      marginRight: "1%"
                    }}
                  >
                    <ImageLoad
                      style={{
                        flex: 1,
                        alignSelf: "stretch",
                        width: undefined,
                        height: undefined,
                        borderColor: "#8E8E8E",
                        borderWidth: 2,
                        marginBottom: 15,
                        marginTop: 15
                      }}
                      resizeMethod={"resize"}
                      source={Image_Http_URL}
                      placeholderSource={require("GreenWaysProject/images/time.png")}
                      isShowActivity={false}
                      placeholderStyle={styles.imgPlaceholder}
                    />
                  </View>

                  <View style={{ marginLeft: "1%", width: winWidth * 0.4 }}>
                    <Text style={styles.tinyblack}>
                      {this.state.nombreProducto != " "
                        ? this.state.nombreProducto
                        : this.state.nombreComercio}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    marginBottom: 20,
                    marginTop: 10
                  }}
                >
                  <Stars
                    default={2.5}
                    count={5}
                    half={true}
                    update={val => {
                      this.setState({ nota: val });
                    }}
                    starSize={
                      50
                    } /* must be set to the size of the custom component if in selection mode */
                    fullStar={require("./../../images/starFilled.png")}
                    emptyStar={require("./../../images/starEmpty.png")}
                    halfStar={require("./../../images/starHalf.png")}
                  />
                </View>
                <TextInput
                  ref={c => {
                    this._inputTitulo = c;
                  }}
                  placeholder={"Añade un título"}
                  placeholderTextColor={"grey"}
                  returnKeyType={"next"}
                  autoCapitalize={"none"}
                  underlineColorAndroid={"#79B700"}
                  style={styles.input}
                  onChangeText={titulo => this.setState({ titulo })}
                />
                <TextInput
                  ref={c => {
                    this._inputComentario = c;
                  }}
                  placeholder={"Comentario"}
                  placeholderTextColor={"grey"}
                  returnKeyType={"next"}
                  autoCapitalize={"none"}
                  underlineColorAndroid={"#79B700"}
                  numberOfLines={1}
                  multiline={true}
                  style={styles.input2}
                  onChangeText={comentario => this.setState({ comentario })}
                />
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
                    this.guardarFeedback();
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
                    <Text style={styles.textoBotones}>{"GUARDAR"}</Text>
                    <Text style={styles.textoBotones}>{"VALORACIÓN"}</Text>
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
    hasError: state.feedback.hasError,
    isLoading: state.feedback.isLoading,
    campoError: state.feedback.campoError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    guardarFeedback: (
      nombreUsuario,
      nombreProducto,
      nombreComercio,
      nota,
      titulo,
      comentario,
      buscador
    ) =>
      dispatch(
        FeedbackActions.guardarFeedback(
          nombreUsuario,
          nombreProducto,
          nombreComercio,
          nota,
          titulo,
          comentario,
          buscador
        )
      ),
    noErrores: () => dispatch(FeedbackActions.noErrores())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntroFeedback);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
    // height: winHeight*0.3
  },
  input: {
    marginBottom: 8,
    fontSize: 16,
    marginRight: 5
  },
  input2: {
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
    marginTop: 10
  },
  tinyblack: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold"
  },
  lineaBotones: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: winHeight * 0.06
    //marginTop: winHeight * 0.1
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  },
  bigblack2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10
  },
  myStarStyle: {
    color: "yellow",
    backgroundColor: "transparent",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2
  },
  myEmptyStarStyle: {
    color: "white"
  },
    imgPlaceholder: {
    height: 65,
    resizeMode: "contain",
    marginTop: 30,
    marginBottom: 30
  },
});
