import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import ModalDropdown from "react-native-modal-dropdown";
import AsyncStorage from '@react-native-community/async-storage';

import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";

import CatalogoClientesActions from "./../actions/CatalogoClientes";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;


class CatalogoClientesFast extends Component {
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
      productosYaImportados: false,
      categorias: null
    };
  }
  GetItem(nombreProducto, categoria) {
    AsyncStorage.setItem("sceneCatalogoAnterior", "fast");

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


    await AsyncStorage.getItem("categoriasComercioCliente").then(
      value => {
        if(value !== null)
        {
          this.setState({
            categorias: value
          },
          function(){
          // alert(value)
            this.removeItemValue("categoriasComercioCliente");
          });
        }
      }
    );

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

    if (this.state.productosYaImportados === true) {
      AsyncStorage.setItem("categoriaCompradorSeleccionadaFinal", "TODO");
    }
    else{

      return fetch("https://thegreenways.es/traerCategoriasComercioParaCliente.php", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombreComercio: this.state.nombreComercio })
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson !== "No Results Found") {

            this.setState({
              categorias: responseJson[0].categoriasComercio
            });
            

        fetch("https://thegreenways.es/listaProductosRevisados.php", {
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
        else{
          this.setState({
            isStorageLoaded: true
          });
        }
      })
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
    this.goScrollStart();
    this.props.cambiarCategoria(value);
  }

  goScrollStart() {
    if (this.state.datas !== null && this.state.datas.filter(
          element =>
            element.categoriaProducto === this.props.categoria
        ).length > 0){

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
                  dropdownStyle={[styles.dropdown_2_dropdown, {
                    height: this.state.categorias.split(",,,").length >= 3 ? winHeight * 0.21 : (this.state.categorias.split(",,,").length + 1) * winHeight * 0.053
                  }]}
                  options={["TODO"].concat(this.state.categorias.split(",,,").sort())}
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
                      </View>
                      <View style={styles.container3}>
                        <Text style={styles.rowViewContainer3}>
                          {rowData.precio}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : null
              }
            />

          <View
            style={{
              height: winHeight * 0.165
            }}
          >
            <View style={styles.lineaBotones}>
              <View
                style={{
                  width: "49%",
                  marginRight: "1%"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.goCatalogoClientes(
                      categoria,
                      this.state.datas,
                      this.state.categorias
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
                    <Text style={styles.textoBotones}>{"VISTA DETALLES"}</Text>
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
    if (rowID === this.state.categorias.split(",,,").length - 1) return;
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
    goCatalogoClientes: (categoriaSeleccionada, productos, categorias) =>
      dispatch(
        CatalogoClientesActions.goCatalogoCliente(categoriaSeleccionada, productos, categorias)
      ),
    cambiarCategoria: stringCategoria =>
      dispatch(CatalogoClientesActions.cambiarCategoria(stringCategoria))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogoClientesFast);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    flex: 1,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  },
  preContainer: {
    flexDirection: "row"
    // height: winHeight * 0.06
  },
  container: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: "row"
  },
  container2: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  container3: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 13
  },
  rowViewContainer2: {
    fontSize: 20,
    paddingRight: 10,
    fontWeight: "bold",
    color: "black"
  },
  rowViewContainer3: {
    fontSize: 20,
    paddingRight: 10,
    color: "black"
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth + 2,
    backgroundColor: "#8E8E8E"
  },
  listFooter: {
    height: StyleSheet.hairlineWidth + 2,
    backgroundColor: "#8E8E8E"
  },
  button: {
    padding: 10,
    backgroundColor: "#36ada4"
  },
  lineaBotones: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "2%"
    //  height: winHeight * 0.09
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
