import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import ModalDropdown from "react-native-modal-dropdown";
import AsyncStorage from '@react-native-community/async-storage';
import ImageLoad from "react-native-image-placeholder";

import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";

import CatalogoClientesActions from "./../actions/CatalogoClientes";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;
const DEMO_OPTIONS_2 = [
  "TODO",
  "ACEITES Y CONDIMENTOS",
  "APERITIVOS",
  "ARROCES Y LEGUMBRES",
  "BEBIDAS",
  "CEREALES Y SEMILLAS",
  "CONSERVAS",
  "DESAYUNO Y MERIENDA",
  "CEREALES Y SEMILLAS",
  "PASTAS, SOPAS, CREMAS Y HARINAS"
];

class CatalogoClientes extends Component {
  static navigationOptions = {
    title: "Catálogo de Productos",
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

  constructor(props) {
    super(props);

    this.state = {
      dataSource: null,
      nombreComercio: null,
      datas: null,
      sceneComerciosAnterior: null,
      isStorageLoaded: false,
      productosYaImportados: false
    };
  }

  GetItem(nombreProducto, categoria) {
    AsyncStorage.setItem("sceneCatalogoAnterior", "noFast");

    AsyncStorage.setItem(
      "categoriaCompradorSeleccionada",
      categoria
    );

    AsyncStorage.setItem("producto", nombreProducto);
    Actions.PagProducto();
  }

  async componentDidMount() {
    await AsyncStorage.getItem("comercio").then(value => {
      this.setState({
        nombreComercio: value
      });
    });

    await AsyncStorage.getItem("categoriaCompradorSeleccionadaFinal").then(
      value => {
        if (value !== null) {
          this.props.cambiarCategoria(value);
        }
      }
    );

    await AsyncStorage.getItem("sceneComerciosAnterior").then(value => {
      this.setState({
        sceneComerciosAnterior: value
      });
    });


    await AsyncStorage.getItem("productosComercioCliente").then(
      value => {
        if(value !== null)
        {
          this.setState({
            datas: JSON.parse(value),
            //PRODUCTOS CARGADOS
            isStorageLoaded: true,
            productosYaImportados: true
          },
          function(){
            this.removeItemValue("productosComercioCliente");
          }
          );        
        }
      }
    );

    AsyncStorage.setItem("sceneAnterior", "catalogo");


    //SI VENIMOS DESDE CATALOGO Y YA DISPONEMOS DE LOS PRODUCTOS ()
    if (this.state.productosYaImportados === true) {
      AsyncStorage.setItem("categoriaCompradorSeleccionadaFinal", "TODO");
    }
    else{

      return fetch("https://thegreenways.es/listaProductosRevisados.php", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombreComercio: this.state.nombreComercio })
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson === "No Results Found") {
  
            this.setState({
                isStorageLoaded: true
              });
          } else {
  
            this.setState({
                datas: responseJson,
                isStorageLoaded: true
              });
          }  
          AsyncStorage.setItem("categoriaCompradorSeleccionadaFinal", "TODO");
        })
        .catch(error => {
          console.error(error);
        });      
    }
  }

  async removeItemValue(key) {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch(exception) {
        return false;
    }
}

  noProductosEnCategoria() {
    return (this.state.datas !== null && this.state.datas.filter(
      element =>
        element.categoriaProducto === this.props.categoria
      ).length === 0 && this.props.categoria !== "TODO")
  }

  listaDesplegable(index, value) {
    this.props.cambiarCategoria(value);
    this.goScrollStart();
  }

  goScrollStart() {
    if (this.state.datas !== null && this.state.datas.filter(
          element =>
            element.categoriaProducto === this.props.categoria
        ).length > 0) {

      this.refs.listViewa.scrollToIndex({
        animated: false,
        index: 0
      });
    }
  }

  render() {
    let { isStorageLoaded } = this.state;
    let { categoria } = this.props;
    if (!isStorageLoaded) {
      return <Loader loading={true} />;
    } else {
      return (
        <View style={styles.MainContainer}>
          <View style={styles.preContainer}>
            <View style={{ flexDirection: "row", flex: 0.5 }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Ayuda",
                      "En ésta página puedes ver el catálogo de productos de un comercio.\n\nEs posible alternar entre la vista rápida y la vista de detalles.\n\nPulsa sobre cada producto para verlos en su página particular."
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

            {this.state.datas !== null ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-end",
                  flex: 0.5
                }}
              >
                <ModalDropdown
                  ref="dropdown_2"
                  onSelect={(index, value) => this.listaDesplegable(index, value)}
                  defaultValue={
                    categoria === "TODO"
                      ? "FILTRAR CATEGORÍA"
                      : categoria
                  }
                  style={styles.dropdown_2}
                  textStyle={styles.dropdown_2_text}
                  dropdownStyle={styles.dropdown_2_dropdown}
                  options={DEMO_OPTIONS_2}
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
            ) : null}
          </View>

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1
            }}
          />

          {this.state.datas === null ? (
            <View
              style={{
                marginTop: winHeight * 0.02,
                marginLeft: winWidth * 0.01
              }}
            >
              <Text style={{ fontSize: 17, color: "black" }}>
                {"No hay productos en éste comercio..."}
              </Text>
            </View>
          ) : null}

          {this.noProductosEnCategoria() ? (
            <View
              style={
                this.noProductosEnCategoria()
                  ? { marginTop: winHeight * 0.02, marginLeft: winWidth * 0.01 }
                  : { marginTop: 0 }
              }
            >
              <Text style={{ fontSize: 17, color: "black" }}>
                No existen productos en esta categoría.
              </Text>
            </View>
          ) : null}

            <FlatList
              ref="listViewa"
              data={
                categoria === "TODO" &&
                this.state.datas !== null
                  ? this.state.datas
                  : this.state.datas !== null 
                  ? this.state.datas.filter(
                      element =>
                        element.categoriaProducto ===
                        categoria
                    )
                  : null
              }
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() =>
                (categoria === "TODO" &&
                this.state.datas !== null) || (this.state.datas !== null && (this.state.datas.filter(
                  element =>
                    element.categoriaProducto ===
                    categoria
                ).length > 0)) ? (
                  <View style={styles.separator} />
                ) : null
              }
              ListFooterComponent={() =>
                (categoria === "TODO" &&
                this.state.datas !== null) || (this.state.datas !== null && (this.state.datas.filter(
                  element =>
                    element.categoriaProducto ===
                    categoria
                ).length > 0)) ? (
                  <View style={styles.listFooter} />
                ) : null
              }
              renderItem={({ item: rowData, index: rowNumber }) =>
                categoria === rowData.categoriaProducto ||
                categoria === "TODO" ? (
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        this.GetItem(
                          rowData.nombreProducto,
                          categoria
                        )
                      }
                    >
                      <View style={styles.container}>
                        <View style={styles.container2}>
                          <Text style={styles.rowViewContainer2}>
                            {rowData.nombreProducto}
                          </Text>
                          <Text style={styles.rowViewContainer3}>
                            {rowData.precio}
                          </Text>
                          <Text style={styles.rowViewContainer}>
                            {rowData.descripcionProducto}
                          </Text>
                        </View>

                        <ImageLoad
                          resizeMethod={"resize"}
                          style={styles.img}
                          source={{
                            uri:
                              "https://thegreenways.es/" + rowData.imagenProducto
                          }}
                          placeholderSource={require("GreenWaysProject/images/time.png")}
                          isShowActivity={false}
                          placeholderStyle={styles.imgPlaceholder}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : null
              }
            />
          {/* </View> */}

          <View
              style={{
              height: winHeight * 0.165
            }}>
            <View style={styles.lineaBotones}>
              <View
                style={{
                  width: "49%",
                  marginRight: "1%"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.goCatalogoClientesFast(
                      categoria,
                      this.state.datas
                    );
                  }}
                >
                  <View
                    style={{
                      height: winHeight * 0.08,
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
                    <Text style={styles.textoBotones}>{"VISTA RAPIDA"}</Text>
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
                    if (
                      this.state.sceneComerciosAnterior ===
                      "listaComerciosDetalle"
                    ) {
                      Actions.popTo("ComerciosDetalle");
                    } else {
                      if (
                        this.state.sceneComerciosAnterior === "listaComercios"
                      ) {
                        Actions.popTo("Comercios");
                      }
                    }
                  }}
                >
                  <View
                    style={{
                      height: winHeight * 0.08,
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
                    <Text style={styles.textoBotones}>{"LISTA"}</Text>
                    <Text style={styles.textoBotones}>{"COMERCIOS"}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={
                {
                  //   height: winHeight * 0.1
                }
              }
            >
              <TouchableOpacity
                onPress={() => {
                  AsyncStorage.setItem("sceneAnterior", "catalogo");

                  this.props.goPaginaComercio();
                }}
              >
                <View
                  style={{
                    height: winHeight * 0.08,
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
                    {"VOLVER PÁGINA COMERCIO"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
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
    if (rowID === DEMO_OPTIONS_2.length - 1) return;
    let key = `spr_${rowID}`;
    return <View style={styles.dropdown_2_separator} key={key} />;
  }
}

const mapStateToProps = state => {
  return {
    categoria: state.catalogoClientes.categoria
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goPaginaComercio: () =>
      dispatch(CatalogoClientesActions.goPaginaComercio()),
    goCatalogoClientesFast: (categoria, productos) =>
      dispatch(
        CatalogoClientesActions.goCatalogoClienteFast(categoria, productos)
      ),
    cambiarCategoria: stringCategoria =>
      dispatch(CatalogoClientesActions.cambiarCategoria(stringCategoria))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogoClientes);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    flex: 1,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  },
  preContainer: {
    flexDirection: "row",
    margin: 0
  },

  container: {
    flex: 1,
    marginTop: 10,
    flexDirection: "row"
  },
  container2: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  img: {
    flex: 0.5,
    height: 150,
    resizeMode: "cover",
    marginBottom: 10,
    borderColor: "#8E8E8E",
    borderWidth: 2,
    marginRight: 7
  },
  imgPlaceholder: {
    height: 65,
    resizeMode: "contain",
    marginTop: 30,
    marginBottom: 30
  },
  rowViewContainer: {
    fontSize: 17,
    paddingRight: 10,
    flex: 1,
    color: "black"
  },
  rowViewContainer2: {
    fontSize: 22,
    paddingRight: 10,
    fontWeight: "bold",
    flex: 1,
    color: "black"
  },
  rowViewContainer3: {
    fontSize: 20,
    paddingRight: 10,
    flex: 1,
    color: "black"
  },
  button: {
    padding: 10,
    backgroundColor: "#36ada4"
  },
  listFooter: {
    borderBottomColor: "#8E8E8E",
    borderBottomWidth: 2
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth + 2,
    backgroundColor: "#8E8E8E"
  },
  lineaBotones: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "2%"
    // height: winHeight * 0.09
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
  dropdown_1: {
    flex: 1,
    top: 32,
    left: 8
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
  dropdown_2: {
    justifyContent: "center",
    alignItems: "center",
    width: winWidth * 0.43,
    height: winHeight * 0.045,
    //marginTop: winHeight * 0.025,
    // marginBottom: winHeight * 0.02,
    //right: 8,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: "#79B700"
  },
  dropdown_2_error: {
    alignItems: "center",
    width: winWidth * 0.4,
    //  marginTop: winHeight * 0.025,
    // marginBottom: winHeight * 0.02,
    // right: 8,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: "red"
  },
  dropdown_2_text: {
    width: winWidth * 0.43,
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 14,
    color: "white",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold"
  },
  dropdown_2_dropdown: {
    justifyContent: "center",
    // alignItems: "center",
    width: winWidth * 0.43,
    height: winHeight * 0.21,
    left: winWidth * 0.544,
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
    fontSize: 12,
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
  }
});
