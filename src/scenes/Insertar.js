import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import ModalDropdown from "react-native-modal-dropdown";
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Keyboard,
  Dimensions
} from "react-native";

import InsertarActions from "./../actions/Insertar";
import MainVendedorActions from "./../actions/MainVendedor";
import Loader from "./../components/Loader";

import ImagePicker from "react-native-image-picker";
import RadioButton from "radio-button-react-native";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

const options = {
  title: "Selecciona una imagen (imagen vertical con el producto centrado)",
  takePhotoButtontitle: "Toma una foto",
  chooseFrinLibraryButtonTitle: "Selección desde galería",
  quality: 1
};

class Insertar extends Component {
  static navigationOptions = {
    title: "Insertar Productos",
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
      nombre: null,
      descripcion: null,
      categoria: null,
      precio: null,
      value: 0,
      username: null,
      imageSource: null,
      data: null,
      categoriaVendedorSeleccionada: null,
      isStorageLoaded: false,
      categorias: null
    };
  }

  async componentDidMount() {
    this.props.noErrores();
    await AsyncStorage.getItem("name").then(value =>
      this.setState({ username: value })
    );

    await AsyncStorage.getItem("categoriaVendedorSeleccionada").then(value =>
      this.setState({ categoriaVendedorSeleccionada: value })
    );

    await AsyncStorage.getItem("catalogo").then(value =>
      this.setState({ catalogo: value })
    );

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
        if (responseJson !== "No Results Found") {

          this.setState({
            categorias: responseJson[0].categoriasComercio,
            isStorageLoaded: true
          });

        }
        else{

          this.setState({
            isStorageLoaded: true
          });

        }
      })
  }

  listaDesplegable(index, value) {
    this.setState({
      categoria: value
    });
  }

  focusin() {
    if (this.props.campoError === "nombre") {
      //  alert("entra");
      this._inputNombre.focus();
      //  setTimeout(() => this._inputNombre.focus(), 50);
    } else if (this.props.campoError === "precio") {
      this._precio.focus();
      //  this._precio.focus();
    } else if (this.props.campoError === "descripcion") {
      this._descripcion.focus();
      //  this._precio.focus();
    }
  }

  handleOnPress(value) {
    this.setState({ value: value });
  }

  doInsert() {
    let {
      nombre,
      descripcion,
      categoria,
      precio,
      value,
      username,
      imageSource,
      data,
      categoriaVendedorSeleccionada
    } = this.state;

    //  alert(this.state.categoriaVendedorSeleccionada);

    this.props.insertar(
      nombre,
      descripcion,
      categoria,
      precio,
      value,
      username,
      imageSource,
      data,
      categoriaVendedorSeleccionada
    );
    setTimeout(() => this.focusin(), 600);
    //  setTimeout(() => Keyboard.dismiss(), 700);

    setTimeout(
      () =>
        this.props.campoError === "nombre" ||
        this.props.campoError === "descripcion" ||
        this.props.campoError === "precio"
          ? this.goScrollStart()
          : {},
      600
    );

    setTimeout(
      () => (this.props.campoError === "categoria" ? this.goScrollMid() : {}),
      600
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
          data: response.data,
          catalogo: null
        });

        this.goScrollEnd();
      }
    });
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

  goScrollEnd() {
    setTimeout(() => {
      this.refs.scroll.scrollToEnd({ animated: true });
    }, 50);
  }

  render() {
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

              <Text style={styles.bigblack}>
                Introduzca los datos del producto:
              </Text>

              <TextInput
                ref={c => {
                  this._inputNombre = c;
                }}
                placeholder={"Nombre del producto"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={
                  campoError != "nombre" ? "#79B700" : "red"
                }
                style={styles.input}
                onChangeText={nombre => {
                  this.setState({ nombre });
                  if (this.props.campoError === "nombre") {
                    this.props.noErrores();
                  }
                }}
                //  onBlur={() => this.props.noErrores()}
              />
              <TextInput
                ref={c => {
                  this._descripcion = c;
                }}
                multiline={true}
                placeholder={"Descripcion del producto [Max. 60 caracteres]"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={
                  campoError != "descripcion" ? "#79B700" : "red"
                }
                style={styles.input}
                onChangeText={descripcion => {
                  this.setState({ descripcion });
                  if (this.props.campoError === "descripcion") {
                    this.props.noErrores();
                  }
                }}
                //  onBlur={() => this.props.noErrores()}
              />
              <TextInput
                ref={c => {
                  this._precio = c;
                }}
                placeholder={"Precio del producto en Euros (Ej: 3,95 )"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={
                  campoError != "precio" ? "#79B700" : "red"
                }
                style={styles.input}
                onChangeText={precio => {
                  this.setState({ precio });
                  if (this.props.campoError === "precio") {
                    this.props.noErrores();
                  }
                }}
                //  onBlur={() => this.props.noErrores()}
              />

              <View style={styles.container3}>
                <RadioButton
                  currentValue={this.state.value}
                  value={0}
                  onPress={this.handleOnPress.bind(this)}
                  outerCircleColor="gray"
                  outerCircleSize={24}
                  outerCircleWidth={2}
                  innerCircleColor="#79B700"
                  innerCircleSize={12}
                >
                  <Text style={styles.radio}>Unidad</Text>
                </RadioButton>

                <RadioButton
                  currentValue={this.state.value}
                  value={1}
                  onPress={this.handleOnPress.bind(this)}
                  outerCircleColor="gray"
                  outerCircleSize={24}
                  outerCircleWidth={2}
                  innerCircleColor="#79B700"
                  innerCircleSize={12}
                >
                  <Text style={styles.radio}>€ / Kilo</Text>
                </RadioButton>
              </View>

              <View>
                <ModalDropdown
                  ref="dropdown_2"
                  onSelect={(index, value) => this.listaDesplegable(index, value)}
                  defaultValue={"Selecciona una categoría..."}
                  style={
                    campoError == "categoria"
                      ? styles.dropdown_2_error
                      : styles.dropdown_2
                  }
                  onDropdownWillShow={() => {
                    if (this.props.campoError === "categoria") {
                      this.props.noErrores();
                    }
                  }}
                  textStyle={styles.dropdown_2_text}
                  dropdownStyle={[styles.dropdown_2_dropdown, {
                    height: this.state.categorias.split(",,,").length >= 4 ? winHeight * 0.21 : this.state.categorias.split(",,,").length * winHeight * 0.053
                  }]}
                  options={this.state.categorias.split(",,,").sort()}
                  renderRow={this._dropdown_2_renderRow.bind(this)}
                  renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>
                    this._dropdown_2_renderSeparator(
                      sectionID,
                      rowID,
                      adjacentRowHighlighted
                    )
                  }
                />
              </View>

              <View style={styles.container2}>
                <Text style={styles.bigblack2}>
                  Introduzca imagen del producto (Opcional)
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
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center"
                      }}
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
                      width: "60%"
                    }}
                  >
                    <Image
                      style={styles.image}
                      source={
                        this.state.imageSource != null
                          ? this.state.imageSource
                          : require("GreenWaysProject/images/producti3.jpg")
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
                    this.doInsert();
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
                    <Text style={styles.textoBotones}>{"INSERTAR"}</Text>
                    <Text style={styles.textoBotones}>{"PRODUCTO"}</Text>
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

              <Text style={styles.bigblack}>
                Introduzca los datos del producto:
              </Text>

              <TextInput
                ref={c => {
                  this._inputNombre = c;
                }}
                placeholder={"Nombre del producto"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={"#79B700"}
                style={styles.input}
                onChangeText={nombre => this.setState({ nombre })}
              />
              <TextInput
                ref={c => {
                  this._descripcion = c;
                }}
                placeholder={"Descripcion del producto [Max. 60 caracteres]"}
                multiline={true}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={"#79B700"}
                style={styles.input}
                onChangeText={descripcion => this.setState({ descripcion })}
              />
              <TextInput
                ref={c => {
                  this._precio = c;
                }}
                placeholder={"Precio del producto en Euros (Ej: 3,95 )"}
                placeholderTextColor={"grey"}
                returnKeyType={"next"}
                autoCapitalize={"none"}
                underlineColorAndroid={"#79B700"}
                style={styles.input}
                onChangeText={precio => this.setState({ precio })}
              />

              <View style={styles.container3}>
                <RadioButton
                  currentValue={this.state.value}
                  value={0}
                  onPress={this.handleOnPress.bind(this)}
                  outerCircleColor="gray"
                  outerCircleSize={24}
                  outerCircleWidth={2}
                  innerCircleColor="#79B700"
                  innerCircleSize={12}
                >
                  <Text style={styles.radio}>Unidad</Text>
                </RadioButton>

                <RadioButton
                  currentValue={this.state.value}
                  value={1}
                  onPress={this.handleOnPress.bind(this)}
                  outerCircleColor="gray"
                  outerCircleSize={24}
                  outerCircleWidth={2}
                  innerCircleColor="#79B700"
                  innerCircleSize={12}
                >
                  <Text style={styles.radio}>€ / Kilo</Text>
                </RadioButton>
              </View>

              <View>
                <ModalDropdown
                  ref="dropdown_2"
                  onSelect={(index, value) => this.listaDesplegable(index, value)}
                  defaultValue={"Selecciona una categoría..."}
                  style={styles.dropdown_2}
                  textStyle={styles.dropdown_2_text}
                  dropdownStyle={[styles.dropdown_2_dropdown, {
                    height: this.state.categorias.split(",,,").length >= 4 ? winHeight * 0.21 : this.state.categorias.split(",,,").length * winHeight * 0.053
                  }]}
                  options={this.state.categorias.split(",,,").sort()}
                  renderRow={this._dropdown_2_renderRow.bind(this)}
                  renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>
                    this._dropdown_2_renderSeparator(
                      sectionID,
                      rowID,
                      adjacentRowHighlighted
                    )
                  }
                />
              </View>

              <View style={styles.container2}>
                <Text style={styles.bigblack2}>
                  Introduzca imagen del producto (Opcional)
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
                      width: "40%",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center"
                      }}
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
                      width: "60%"
                    }}
                  >
                    <Image
                      style={styles.image}
                      source={
                        this.state.imageSource != null
                          ? this.state.imageSource
                          : require("GreenWaysProject/images/producti3.jpg")
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
                    this.doInsert();
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
                    <Text style={styles.textoBotones}>{"INSERTAR"}</Text>
                    <Text style={styles.textoBotones}>{"PRODUCTO"}</Text>
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
    if (rowID == this.state.categorias.split(",,,").length - 1) return;
    let key = `spr_${rowID}`;
    return <View style={styles.dropdown_2_separator} key={key} />;
  }
}

const mapStateToProps = state => {
  return {
    hasError: state.insertar.hasError,
    isLoading: state.insertar.isLoading,
    campoError: state.insertar.campoError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    insertar: (
      nombre,
      descripcion,
      categoria,
      precio,
      value,
      username,
      imageSource,
      data,
      categoriaVendedorSeleccionada
    ) =>
      dispatch(
        InsertarActions.insertar(
          nombre,
          descripcion,
          categoria,
          precio,
          value,
          username,
          imageSource,
          data,
          categoriaVendedorSeleccionada
        )
      ),
    noErrores: () => dispatch(InsertarActions.noErrores()),
    goCatalogo: () => dispatch(MainVendedorActions.goCatalogo()),
    goCatalogoDetalle: () => dispatch(MainVendedorActions.goCatalogoDetalle()),
    goPrincipalVendedor: () =>
      dispatch(MainVendedorActions.goPrincipalVendedor())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Insertar);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  container2: {},
  container3: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: winHeight * 0.02
  },
  input: {
    //  borderColor: "#36ada4",
    //  borderWidth: 1,
    justifyContent: "center",
    fontSize: 16,
    marginRight: 5,
    marginBottom: 8
  },
  input2: {
    borderColor: "red",
    borderWidth: 1,
    justifyContent: "center",
    fontSize: 16,
    marginRight: 5,
    marginBottom: 8
  },
  button: {
    padding: 10,
    borderRadius: 10
  },
  text: {
    color: "white",
    fontSize: 18,
    textAlign: "center"
  },
  bigblack: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20
  },
  radio: {
    fontSize: 16
  },
  bigblack2: {
    color: "black",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 30,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    borderColor: "#8E8E8E",
    borderWidth: 2
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
  }
});
