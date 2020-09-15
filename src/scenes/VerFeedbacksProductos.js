import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import Stars from "react-native-stars";
import AsyncStorage from '@react-native-community/async-storage';
import ModalDropdown from "react-native-modal-dropdown";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert
} from "react-native";

import MainVendedorActions from "./../actions/MainVendedor";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;


class VerFeedbacksProductos extends Component {
  static navigationOptions = {
    title: "Valoraciones de Productos",
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
      nombreUsuario: null,
      datas: null,
      datas2: null,
      notaMedia: null,
      isStorageLoaded: false,
      categorias: null
    };
  }

  async componentDidMount() {
    await AsyncStorage.getItem("name").then(value => {
      this.setState({
        nombreUsuario: value
      });
    });

    await AsyncStorage.getItem("categoriaProductoFeedback").then(value => {
      if(value === null)
      {
        this.props.cambiarCategoria("TODO");
      }
    });

    return fetch("https://thegreenways.es/traerCategoriasComercio.php", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: this.state.nombreUsuario })
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson !== "No Results Found") {
            this.setState({
              categorias: responseJson[0].categoriasComercio
            });

        return fetch(
          "https://thegreenways.es/listaFeedbacksProductosComerciante.php",
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              nombreUsuario: this.state.nombreUsuario
            })
          }
        )
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson == "No Results Found") {
              // this.setState({
              //    // notaMedia: 0,
              //   //  isStorageLoaded: true
              //   });

                return fetch(
                  "https://thegreenways.es/listaProductosRevisadosFeedbacksVendedor.php",
                  {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                      nombreUsuario: this.state.nombreUsuario
                    })
                  }
                )
                  .then(response => response.json())
                  .then(responseJson2 => {

                    this.setState({
                        datas2: responseJson2,
                        isStorageLoaded: true
                      }); 
                  })
            } else {

              // Creamos un nuevo array con las valoraciones obtenidas. En este nuevo array, NO existe mas de un feedback para un mismo producto ya que lo que queremos 
              // es calcular la nota media para cada producto.

              //Necesitamos estos arrays intermedios (auxiliares)
              let datasProcesado = [];
              let totalAcumulado = [];
              let contador = [];
              let categorias = [];

              for (let [key, value] of Object.entries(responseJson)) {

                if(datasProcesado[value.nombreProducto] !== undefined)
                {              
                  contador[value.nombreProducto] += 1;
                  totalAcumulado[value.nombreProducto] +=  parseFloat(value.nota);
                  datasProcesado[value.nombreProducto] = totalAcumulado[value.nombreProducto]/parseFloat(contador[value.nombreProducto]);        
                }
                else{
                  contador[value.nombreProducto] = 1;
                  datasProcesado[value.nombreProducto] = parseFloat(value.nota);
                  totalAcumulado[value.nombreProducto] = parseFloat(value.nota);
                  categorias[value.nombreProducto] = value.categoriaProducto;
                }
              }

              let datasNuevo = [];
              let contador2 = 0

              for(entrada in datasProcesado)
              {
                let nuevo = {
                  nombreProducto: entrada,
                  nota: datasProcesado[entrada],
                  categoriaProducto: categorias[entrada]
                };

                datasNuevo[contador2] = nuevo;
                contador2 += 1;
              }

              this.setState(
                {
                  datas: datasNuevo,
              //    isStorageLoaded: true
                }
              );

              return fetch(
                "https://thegreenways.es/listaProductosRevisadosFeedbacksVendedor.php",
                {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    nombreUsuario: this.state.nombreUsuario
                  })
                }
              )
                .then(response => response.json())
                .then(responseJson2 => {


                  for (let i=0 ; i<responseJson2.length ; i++)
                  {
                    for(let u=0 ; u<this.state.datas.length ; u++)
                    {
                      if(responseJson2[i].nombreProducto === this.state.datas[u].nombreProducto)
                      {
                        responseJson2.splice(i,1);
                      }
                    }
                  }

                  this.setState(
                    {
                      datas2: responseJson2,
                      isStorageLoaded: true
                    }
                  );
                })
            }
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


  // "categoria" finalmente no es utilizado ya que en este caso es suficiente con saber si ha sido cambiado el item 
  // de AsyncStorage "categoriaProductoFeedback" (se hace remove del item justo antes de entrar a esta pantalla).
  GetItem(nombreProducto, nota, categoria)
  {

    if(nota !== undefined)
    {
      AsyncStorage.setItem("nombreProducto", nombreProducto);
      AsyncStorage.setItem("categoriaProductoFeedback", "cambiada");
      this.props.goVerFeedbacksProducto();
    }
    else{
      Alert.alert("Aviso", "Este producto aún no dispone de valoraciones de clientes.")
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

  noProductosEnCategoria() {
    return (this.state.datas !== null && this.state.datas2 !== null && this.state.datas.concat(this.state.datas2).filter(
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

    //alert(this.state.datas + "\n" + this.state.datas2);
    if (!isStorageLoaded) {
      return <Loader loading={true} />;
    } else {
      return (
        <View style={styles.MainContainer}>
          <View style={styles.preContainer}>
            <View style={{ flexDirection: "row", flex: 0.5}}>
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
                      "En ésta página puedes ver la nota media de todos los productos del catálogo de tu comercio.\n\nPulsa sobre un producto para poder ver todas las valoraciones de ese producto en particular."
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
                height: "80.5%",
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
                  ? {height: "80%", marginTop: winHeight * 0.02, marginLeft: winWidth * 0.01 }
                  : {height: "80%", marginTop: 0 }
              }
            >
              <Text style={{ fontSize: 17, color: "black" }}>
                No existen productos en esta categoría.
              </Text>
            </View>
          ) : null}

          {this.noProductosEnCategoria() ? null : (
            <View style={this.noProductosEnCategoria() ? null : {height: "82.28%"}}>
            <FlatList
              ref="listViewa"
              data={
                this.state.datas === null && this.state.datas2 === null
                  ? null
                  : this.state.datas === null && this.state.datas2 !== null && categoria === "TODO" 
                    ? this.state.datas2 
                    : this.state.datas === null && this.state.datas2 !== null && categoria !== "TODO" 
                      ? this.state.datas2.filter(
                        element =>
                          element.categoriaProducto ===
                          categoria
                      )
                      : this.state.datas !== null && this.state.datas2 === null && categoria === "TODO"
                        ? this.state.datas
                        : this.state.datas !== null && this.state.datas2 === null && categoria !== "TODO"
                          ? this.state.datas.filter(
                            element =>
                              element.categoriaProducto ===
                              categoria
                          )
                          : this.state.datas !== null && this.state.datas2 !== null && categoria === "TODO"
                            ? this.state.datas.concat(this.state.datas2)
                            : this.state.datas !== null && this.state.datas2 !== null && categoria !== "TODO"
                              ? this.state.datas.concat(this.state.datas2).filter(
                                  element =>
                                    element.categoriaProducto ===
                                    categoria
                                  )
                              : null
              }
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() =>
                (categoria === "TODO" &&
                (this.state.datas !== null || this.state.datas2 !== null)) || ((this.state.datas !== null || this.state.datas2 !== null) && (this.state.datas.concat(this.state.datas2).filter(
                  element =>
                    element.categoriaProducto ===
                    categoria
                ).length > 0)) ? (
                  <View style={styles.separator} />
                ) : null
              }
              ListFooterComponent={() =>
                (categoria === "TODO" &&
                (this.state.datas !== null || this.state.datas2 !== null)) || ((this.state.datas !== null || this.state.datas2 !== null) && (this.state.datas.concat(this.state.datas2).filter(
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
                        rowData.nota,
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
                        <View style={rowData.nota !== undefined ? null : {display: "none"} }>
                          <Stars
                            default={rowData.nota !== undefined ? parseFloat(rowData.nota): null}
                            display={rowData.nota !== undefined ? parseFloat(rowData.nota): null}
                          // backingColor={"#EEEEEE"}
                            count={5}
                            half={true}
                            disabled={true}
                            starSize={
                              22
                            } /* must be set to the size of the custom component if in selection mode */
                            fullStar={require("./../../images/starFilled.png")}
                            emptyStar={require("./../../images/starEmpty.png")}
                            halfStar={require("./../../images/starHalf.png")}
                          />
                        </View>
                        <View>
                          <Text style={rowData.nota !== undefined ? styles.rowViewContainer3 : styles.rowViewContainer3Margin}>
                            {rowData.nota !== undefined ? " ("+rowData.nota + " de 5)": "(No hay valoraciones)"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : null
              }
            />
             </View>)}

          <View
            style={{
              height: winHeight * 0.1
            }}
          >
            <View>
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


const mapStateToProps = state => {
  return {
    // isLogged: state.login.isLogged,
    // hasError: state.register.hasError
    // isLoading: state.register.isLoading
    categoria: state.mainVendedor.categoria
  };
};

const mapDispatchToProps = dispatch => {
  return {
   goVerFeedbacksProducto: () => dispatch(MainVendedorActions.goVerFeedbacksProducto()),
   cambiarCategoria: stringCategoria =>
   dispatch(MainVendedorActions.cambiarCategoria(stringCategoria))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerFeedbacksProductos);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    // height: winHeight,
    marginLeft: 10,
    marginRight: 10
  },
  preContainer: {
    flexDirection: "row"
    // height: winHeight * 0.06
  },
  container: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 20
  },
  container2: {
    //marginLeft: winWidth * 0.02,
    flex: 0.5,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  container3: {
    flex: 0.5,
    //flexDirection: "row",
   // marginLeft: winWidth * 0.02,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  containerDerecha: {
    marginLeft: winWidth * 0.2,
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1
  },
  container4: {
    marginTop: 8,
    marginBottom: 8
  },
  button: {
    padding: 10,
    backgroundColor: "#36ada4"
  },
  rowViewContainer1: {
    fontSize: 16,
    color: "black"
  },
  rowViewContainer2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black"
  },
  rowViewContainer3: {
    fontSize: 18,
    color: "black"
  },
  rowViewContainer3Margin: {
    fontSize: 18,
    color: "black",
    marginTop: 11,
    marginBottom: 11
  },
  rowViewContainer4: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black"
  },
  rowViewContainer6: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black"
  },
  rowViewContainer5: {
    fontSize: 20,
    color: "black"
  },
  separator: {
    height: StyleSheet.hairlineWidth + 2,
    backgroundColor: "#8E8E8E"
  },
  listFooter: {
    height: StyleSheet.hairlineWidth + 2,
    backgroundColor: "#8E8E8E"
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white"
  },
  imgPlaceholder: {
    height: 65,
    resizeMode: "contain",
    marginTop: 30,
    marginBottom: 30
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
});
