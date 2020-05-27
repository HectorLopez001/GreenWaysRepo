import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import ModalDropdown from "react-native-modal-dropdown";
import AsyncStorage from '@react-native-community/async-storage';
import ImageLoad from "react-native-image-placeholder";

import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";

import DenunciaActions from "../actions/Denuncia";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;
const DEMO_OPTIONS_2 = [
  "CONTENIDO OFENSIVO",
  "CONTENIDO VIOLENTO",
  "CONTENIDO FUERA DE LUGAR",
  "OTRO"
];

class IntroDenuncia extends Component {
  static navigationOptions = {
    title: "Introducir denuncia",
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
      categoriaDenuncia: null,
      motivoDenuncia: null,
      buscador: null,
      isStorageLoaded: false
    };
  }

  focusin() {
    if (this.props.campoError === "motivoDenuncia") {
      this._inputMotivoDenuncia.focus();
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
  listaDesplegable(index, value) {
    this.setState({
      categoriaDenuncia: value
    });
  }

  /*_dropdown_6_onSelect(index, value) {
    this.setState({
      dropdown_6_icon_heart: !this.state.dropdown_6_icon_heart,
    })
  }
}*/

  guardarDenuncia() {
    let {
      nombreUsuario,
      nombreProducto,
      nombreComercio,
      categoriaDenuncia,
      motivoDenuncia,
      buscador
    } = this.state;
    this.props.guardarDenuncia(
      nombreUsuario,
      nombreProducto,
      nombreComercio,
      categoriaDenuncia,
      motivoDenuncia,
      buscador
    );
    setTimeout(() => this.focusin(), 600);

    setTimeout(
      () =>
        this.props.campoError === "motivoDenuncia" ||
        this.props.campoError === "categoriaDenuncia"
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
                    <Text style={styles.bigblack}>Completa la denuncia </Text>
                  </View>
                  <View>
                    <Text style={styles.bigblack}>
                      {this.state.nombreProducto == " "
                        ? "al comercio:"
                        : "al producto:"}
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

                <View>
                  <ModalDropdown
                    ref="dropdown_2"
                    onSelect={(index, value) => this.listaDesplegable(index, value)}
                    defaultValue={"Selecciona una categoría..."}
                    style={
                      campoError == "categoriaDenuncia"
                        ? styles.dropdown_2_error
                        : styles.dropdown_2
                    }
                    onDropdownWillShow={() => {
                      if (this.props.campoError === "categoriaDenuncia") {
                        this.props.noErrores();
                      }
                    }}
                    textStyle={styles.dropdown_2_text}
                    dropdownStyle={styles.dropdown_2_dropdown}
                    options={DEMO_OPTIONS_2}
                    // renderButtonText={rowData =>
                    //   this._dropdown_2_renderButtonText(rowData)
                    // }
                    renderRow={this._dropdown_2_renderRow.bind(this)}
                    renderSeparator={(
                      sectionID,
                      rowID,
                      adjacentRowHighlighted
                    ) =>
                      this._dropdown_2_renderSeparator(
                        sectionID,
                        rowID,
                        adjacentRowHighlighted
                      )
                    }
                  />
                </View>
                <TextInput
                  ref={c => {
                    this._inputMotivoDenuncia = c;
                  }}
                  placeholder={"Motivo de la denuncia"}
                  placeholderTextColor={"grey"}
                  returnKeyType={"next"}
                  autoCapitalize={"none"}
                  underlineColorAndroid={
                    campoError != "motivoDenuncia" ? "#79B700" : "red"
                  }
                  multiline={true}
                  style={styles.input}
                  onChangeText={motivoDenuncia => {
                    this.setState({ motivoDenuncia });
                    if (this.props.campoError === "motivoDenuncia") {
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
                    this.guardarDenuncia();
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
                    <Text style={styles.textoBotones}>{"DENUNCIA"}</Text>
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
            <ScrollView ref="scroll" keyboardShouldPersistTaps="always">
              <Loader loading={isLoading} />

              <View>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <Text style={styles.bigblack}>Completa la denuncia </Text>
                  </View>
                  <View>
                    <Text style={styles.bigblack}>
                      {this.state.nombreProducto == " "
                        ? "al comercio:"
                        : "al producto:"}
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

                <View>
                  <ModalDropdown
                    ref="dropdown_2"
                    onSelect={(index, value) => this.listaDesplegable(index, value)}
                    defaultValue={"Selecciona una categoría..."}
                    style={styles.dropdown_2}
                    textStyle={styles.dropdown_2_text}
                    dropdownStyle={styles.dropdown_2_dropdown}
                    options={DEMO_OPTIONS_2}
                    // renderButtonText={rowData =>
                    //   this._dropdown_2_renderButtonText(rowData)
                    // }
                    renderRow={this._dropdown_2_renderRow.bind(this)}
                    renderSeparator={(
                      sectionID,
                      rowID,
                      adjacentRowHighlighted
                    ) =>
                      this._dropdown_2_renderSeparator(
                        sectionID,
                        rowID,
                        adjacentRowHighlighted
                      )
                    }
                  />
                </View>

                <TextInput
                  ref={c => {
                    this._inputMotivoDenuncia = c;
                  }}
                  placeholder={"Motivo de la denuncia"}
                  placeholderTextColor={"grey"}
                  returnKeyType={"next"}
                  autoCapitalize={"none"}
                  multiline={true}
                  underlineColorAndroid={"#79B700"}
                  style={styles.input}
                  onChangeText={motivoDenuncia =>
                    this.setState({ motivoDenuncia })
                  }
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
                    this.guardarDenuncia();
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
                    <Text style={styles.textoBotones}>{"DENUNCIA"}</Text>
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

  // _dropdown_2_renderButtonText(rowData) {
  //   const { name } = rowData;
  //   return `${name}`;
  // }

  _dropdown_2_renderRow(rowData, rowID, highlighted) {
    let evenRow = rowID % 2;
    return (
        <View
          style={[
            styles.dropdown_2_row,
            { backgroundColor: evenRow ? "lemonchiffon" : "white" }
          ]}
        >
          <Text
            style={[
              styles.dropdown_2_row_text,
              highlighted && { color: "black" }
            ]}
          >
            {`${rowData}`}
          </Text>
        </View>
    );
  }

  _dropdown_2_renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    if (rowID == DEMO_OPTIONS_2.length - 1) return;
    let key = `spr_${rowID}`;
    return <View style={styles.dropdown_2_separator} key={key} />;
  }
}

const mapStateToProps = state => {
  return {
    hasError: state.denuncia.hasError,
    isLoading: state.denuncia.isLoading,
    campoError: state.denuncia.campoError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    guardarDenuncia: (
      nombreUsuario,
      nombreProducto,
      nombreComercio,
      categoriaDenuncia,
      motivoDenuncia,
      buscador
    ) =>
      dispatch(
        DenunciaActions.guardarDenuncia(
          nombreUsuario,
          nombreProducto,
          nombreComercio,
          categoriaDenuncia,
          motivoDenuncia,
          buscador
        )
      ),
    noErrores: () => dispatch(DenunciaActions.noErrores())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IntroDenuncia);

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
  input2: {
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
    marginTop: 10
  },
  tinyblack: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold"
  },
  bigblack2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10
  },
  row: {
    flex: 1,
    flexDirection: "row"
  },
  cell: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth
  },
  scrollView: {
    flex: 1
  },
  contentContainer: {
    height: 500,
    paddingVertical: 100,
    paddingLeft: 20
  },
  textButton: {
    color: "deepskyblue",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "deepskyblue",
    margin: 2
  },
  dropdown_1: {
    flex: 1,
    top: 32,
    left: 8
  },
  lineaBotones: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    height: winHeight * 0.06
    //marginTop: winHeight * 0.1
  },
  dropdown_2: {
    alignSelf: "center",
    width: winWidth * 0.68,
    marginTop: winHeight * 0.025,
    marginBottom: winHeight * 0.02,
    right: 8,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: "#79B700"
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  },
  dropdown_2_error: {
    alignSelf: "center",
    width: winWidth * 0.68,
    marginTop: winHeight * 0.025,
    marginBottom: winHeight * 0.02,
    right: 8,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: "red"
  },
  dropdown_2_text: {
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 17,
    color: "white",
    textAlign: "center",
    textAlignVertical: "center"
  },
  dropdown_2_dropdown: {
    width: winWidth * 0.68,
    height: winHeight * 0.21,
    borderColor: "#79B700",
    borderWidth: 2,
    borderRadius: 3
  },
  dropdown_2_row: {
    flexDirection: "row",
    height: winHeight * 0.05,
    alignItems: "center",
    justifyContent: "center"
  },
  dropdown_2_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    color: "navy",
    textAlignVertical: "center"
  },
  dropdown_2_separator: {
    height: 1,
    backgroundColor: "#79B700"
  },
  imgPlaceholder: {
    height: 65,
    resizeMode: "contain",
    marginTop: 30,
    marginBottom: 30
  }
});
