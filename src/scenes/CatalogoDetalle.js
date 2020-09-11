import React, { Component } from "react";
import { connect } from "react-redux";
import ModalDropdown from "react-native-modal-dropdown";
import AsyncStorage from '@react-native-community/async-storage';
import ImageLoad from "react-native-image-placeholder";
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
import CatalogoActions from "./../actions/Catalogo";
import Loader from "./../components/Loader";

import { Actions } from "react-native-router-flux";

{/* <script src="http://localhost:8097"></script>  */}

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

class CatalogoDetalle extends Component {
  static navigationOptions = {
    title: "Catálogo de Productos",
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
      dataSource: null,
      nombreUsuario: null,
      coordenadaListView: null,
      datas: null,
      isStorageLoaded: false,   
      productosYaImportados: false   
    };
  }

  GetItem(nombreProducto, rowNumber, categoria) {
    AsyncStorage.setItem("producto", nombreProducto);
    AsyncStorage.setItem("filaInicioCatalogoVendedor", rowNumber.toString());
    AsyncStorage.setItem("categoriaVendedorSeleccionada", categoria);
    AsyncStorage.setItem("catalogo", "detalle");
    Actions.PagProductoVendedor();
  }

  async componentDidMount() {
    await AsyncStorage.getItem("name").then(value => {
      this.setState({
        nombreUsuario: value
      });
    });

    await AsyncStorage.getItem("categoriaVendedorSeleccionadaFinal").then(
      value => {
        if (value !== null) {
          this.props.cambiarCategoria(value);
        }
      }
    );

    await AsyncStorage.getItem("filaInicioCatalogoVendedorFinal").then(
      value => {
        this.setState({
          coordenadaListView: value
        });
      }
    );

    await AsyncStorage.getItem("productosComercio").then(
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
            this.removeItemValue("productosComercio");
          }
          );        
        }
      }
    );

    //SI VENIMOS DESDE CATALOGO Y YA DISPONEMOS DE LOS PRODUCTOS ()
    if (this.state.productosYaImportados === true) {

      if (this.state.coordenadaListView === 0)
      {
          this.setState({
            coordenadaListView: 1
          })
      }
      else if (this.state.coordenadaListView >= 2)
      {
        setTimeout(() => {
          if (this.state.datas != null) {
            this.refs.listViewa.scrollToIndex({
              animated: true,
              index: parseInt(this.state.coordenadaListView) - 1
            });
          }
        }, 50);
      }
  
      //Reseteamos filaInicio a 0 para que cuando volvamos a recargar la página no vuelva a una posicion indicada anteriormente.
      AsyncStorage.setItem(
        "filaInicioCatalogoVendedorFinal",
        (0).toString()
      );

      //  AsyncStorage.setItem("categoriaVendedorSeleccionadaFinal", "TODO");
    }
    else{
    //SI VENIMOS DESDE LA PANTALLA DE INSERTAR/MODIFICAR
    fetch("https://thegreenways.es/listaProductosVendedor.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nombreUsuario: this.state.nombreUsuario })
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson === "No Results Found") {

          if (this.state.coordenadaListView === 0)
          {
              this.setState({
                coordenadaListView: 1
              })
          }

          this.setState(
          {
            isStorageLoaded: true
          },
          function() {}
          );
        } else {
          this.setState({
            datas: responseJson,
          })

          //Evitamos "Index Out of Range"
          if (this.state.coordenadaListView === 0) {
            this.setState({
              coordenadaListView: 1
            });
          }

          if (this.state.coordenadaListView >= 2)
          {
            this.setState({
                isStorageLoaded: true
              },
              function() {
                setTimeout(() => {
                  // if (this.state.datas != null) {
                    this.refs.listViewa.scrollToIndex({
                      animated: true,
                      index: parseInt(this.state.coordenadaListView) - 1
                    });
                //  }
                }, 50);

                //Reseteamos filaInicio a 0 para que cuando volvamos a recargar la página no vuelva a una posicion indicada anteriormente.
                AsyncStorage.setItem(
                  "filaInicioCatalogoVendedorFinal",
                  (0).toString()
                );
              }
            );
          } else {
            this.setState(
              {
                isStorageLoaded: true
              },
              function() {
                //Reseteamos filaInicio a 0 para que cuando volvamos a recargar la página no vuelva a una posicion indicada anteriormente.
                AsyncStorage.setItem(
                  "filaInicioCatalogoVendedorFinal",
                  (0).toString()
                );
              }
            );
          }
        }
        //Reseteamos
        AsyncStorage.setItem("categoriaVendedorSeleccionadaFinal", "TODO");
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
      ).length == 0 && this.props.categoria !== "TODO")
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
              <View>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Ayuda",
                      "En ésta página puedes insertar, borrar y modificar los productos de tu catálogo, para ello pulsa sobre el botón y los iconos habilitados.\n\nEs posible alternar entre la vista rápida y la vista de detalles.\n\nPuedes pulsar sobre cada producto para verlos en su página particular."
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

          {/* SI NO EXISTEN PRODUCTOS EN EL COMERCIO */}
          {this.state.datas === null ? (
            <View
              style={{
                marginTop: winHeight * 0.02,
                marginLeft: winWidth * 0.01
              }}
            >
              <Text style={{ fontSize: 17, color: "black" }}>
                {"Introduce tus artículos en esta pantalla."}
              </Text>
            </View>
          ) : null}

          {/* SI EXISTEN PRODUCTOS EN EL COMERCIO, PERO NO EXISTEN EN LA CATEGORIA*/}
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
            getItemLayout={(data, index) => ({
              length: 182,
              offset: 182 * index,
              index
            })}
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
              this.state.datas !== null) || (this.state.datas.filter(
                element =>
                  element.categoriaProducto ===
                  categoria
              ).length > 0)
                ? (
                <View style={styles.separator} />
              ) : null
            }
            ListFooterComponent={() =>
              (categoria === "TODO" &&
              this.state.datas !== null) || (this.state.datas !== null &&(this.state.datas.filter(
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
                        rowNumber,
                        categoria
                      )
                    }
                  >
                    <View style={styles.container}>
                      <View style={styles.container1}>
                        <Text style={styles.rowViewContainer2}>
                          {rowData.nombreProducto}
                        </Text>

                        <Text style={styles.rowViewContainer3}>
                          {rowData.precio}
                        </Text>

                        <Text style={styles.rowViewContainer4}>
                          {rowData.descripcionProducto}
                        </Text>
                      </View>

                      <View style={styles.container3}>
                        <ImageLoad
                          style={{
                            height: winWidth * 0.37,
                            width: winWidth * 0.37,
                            resizeMode: "cover",
                            borderColor: "#8E8E8E",
                            borderWidth: 2
                          }}
                          resizeMethod={"resize"}
                          source={{
                            uri:
                              "https://thegreenways.es/" + rowData.imagenProducto
                          }}
                          placeholderSource={require("GreenWaysProject/images/time.png")}
                          isShowActivity={false}
                          placeholderStyle={styles.imgPlaceholder}
                        />
                      </View>

                      <View style={styles.container2}>
                        <View>
                          <TouchableOpacity
                            onPress={() =>
                              this.props.modificarDetalle(
                                rowData.nombreProducto,
                                this.state.nombreUsuario,
                                rowNumber,
                                categoria
                              )
                            }
                          >
                            <Image
                              style={{
                                height: 60,
                                width: 60,
                                resizeMode: "cover",
                                margin: 10
                              }}
                              resizeMethod={"resize"}
                              source={require("GreenWaysProject/images/modificar5.png")}
                            />
                          </TouchableOpacity>
                        </View>

                        <View>
                          <TouchableOpacity
                            onPress={() =>
                              this.props.mensajeEliminar(
                                rowData.nombreProducto,
                                this.state.nombreUsuario,
                                rowNumber,
                                categoria
                              )
                            }
                          >
                            <Image
                              style={{
                                height: 60,
                                width: 60,
                                resizeMode: "cover",
                                margin: 10,
                                marginLeft: 15
                              }}
                              resizeMethod={"resize"}
                              source={require("GreenWaysProject/images/eliminar3.png")}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null
            }
          />

          <View>
            <View style={styles.lineaBotones}>
              <View
                style={{
                  width: "49%",
                  marginRight: "1%"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.props.goCatalogo(
                      categoria,
                      this.state.datas
                      );
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
                    <Text style={styles.textoBotones}>{"VISTA RÁPIDA"}</Text>
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
                    this.props.goGestionarCategoriasCatalogo();
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

            <View
              style={{
                //   width: "95%",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  width: "98%"
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    AsyncStorage.setItem("catalogo", "detalle");
                    this.props.goInsertar(categoria);
                  }}
                >
                  <View
                    style={{
                      height: 55,
                      borderWidth: 1.5,
                      borderColor: "black",
                      borderRadius: 20,
                      backgroundColor: "#79B700",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text style={styles.textoBotones}>
                      {"INSERTAR NUEVO PRODUCTO"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
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
    categoria: state.catalogoVendedor.categoria
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goInsertar: categoriaSeleccionada =>
      dispatch(CatalogoActions.goInsertar(categoriaSeleccionada)),
    goGestionarCategoriasCatalogo: () =>
      dispatch(CatalogoActions.goGestionarCategoriasCatalogo()),
    goCatalogo: (categoriaSeleccionada, productos) =>
      dispatch(CatalogoActions.goCatalogo(categoriaSeleccionada, productos)),
    cambiarCategoria: stringCategoria =>
      dispatch(CatalogoActions.cambiarCategoria(stringCategoria)),
    mensajeEliminar: (
      nombreProducto,
      nombreUsuario,
      rowNumber,
      categoriaSeleccionada
    ) =>
      dispatch(
        CatalogoActions.mensajeEliminar(
          nombreProducto,
          nombreUsuario,
          rowNumber,
          categoriaSeleccionada
        )
      ),
    modificarDetalle: (
      nombreProducto,
      nombreUsuario,
      rowNumber,
      categoriaSeleccionada
    ) =>
      dispatch(
        CatalogoActions.modificarDetalle(
          nombreProducto,
          nombreUsuario,
          rowNumber,
          categoriaSeleccionada
        )
      )
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatalogoDetalle);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5
  },
  preContainer: {
    flexDirection: "row",
    margin: 0
  },
  container: {
    flex: 1,
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 10
  },
  container1: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center"
  },
  container3: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center"
  },

  container2: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center"
  },
  rowViewContainer2: {
    fontSize: 21,
    fontWeight: "bold",
    color: "black",
    flex: 1
  },
  rowViewContainer3: {
    fontSize: 19,
    flex: 1,
    color: "black"
  },
  rowViewContainer4: {
    fontSize: 17,
    flex: 1,
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
  lineaBotones: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "2%"
  },
  dropdown_2: {
    justifyContent: "center",
    alignItems: "center",
    width: winWidth * 0.43,
    height: winHeight * 0.045,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: "#79B700"
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
    color: "white",
    marginLeft: 5
  },
  imgPlaceholder: {
    height: 65,
    resizeMode: "contain",
    marginTop: 30,
    marginBottom: 30
  },
});
