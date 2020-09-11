import React, { Component } from "react";
import { connect } from "react-redux";
import AsyncStorage from '@react-native-community/async-storage';
import { HeaderBackButton } from 'react-navigation-stack';
import {
  StyleSheet,
  FlatList,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions
} from "react-native";

import GestionComerciosActions from "./../actions/GestionComercios";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class GestionCategorias2 extends Component {
  static navigationOptions = ({ navigation }) => {
    return{
      title: "Gestión de categorías",
      headerRight: (
        <View>
          <TouchableOpacity
            onPress={navigation.getParam('volverInicio')}
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
      ),
      headerLeft:(<HeaderBackButton onPress={navigation.getParam('volverGestionCategorias') }/>)
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      nombreComercio: null,
      idComercio: null,
      backgroundColor: new Animated.Value(0)
    };
  }

  volverInicio = () => {
    this.props.volverInicio();
  };

  volverGestionCategorias = () => {
    this.props.volverGestionCategorias();
  };

  activarLoader = (bool) => {
    this.props.activarLoader(bool);
  };

  async componentDidMount() {

    this.props.activarLoader(true);

    this.props.navigation.setParams({
      volverInicio: this.volverInicio,
      volverGestionCategorias: this.volverGestionCategorias
    });
    

    await AsyncStorage.getItem("comercioCategoria").then(value => {
      this.setState({
        idComercio: value
      });
    });

    await AsyncStorage.getItem("nombreComercioCategoria").then(value => {
      this.setState({
        nombreComercio: value
      });
    });


    fetch("https://thegreenways.es/listaCategorias.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idComercio: this.state.idComercio })
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson === "No Results Found")
        {
          this.activarLoader(false);
        }
        else
        {
          //PRIMERO CREAMOS UN ARRAY DE OBJETOS DE CATEGORIAS REVISABLES
          let categoriasRevisables = [];

          if(responseJson[0].categoriasComercioRevisables !== null && responseJson[0].categoriasComercioRevisables !== "")
          {
             categoriasRevisables = responseJson[0].categoriasComercioRevisables.split(",,,").sort();
          }

          let categoriasRevisablesEnObjetos = [];

          if(Object.entries(categoriasRevisables).length !== 0)
          {
            for (let i=0 ; i<categoriasRevisables.length ; i++)
            {

              if(categoriasRevisables[i].includes("---"))
              {
                categoriasRevisables[i] = categoriasRevisables[i].slice(categoriasRevisables[i].indexOf("---")+3);
              }

              categoriasRevisablesEnObjetos[i] = {
                  nombreCategoria: categoriasRevisables[i],
                  revisable: true
              };
            }
          }

          //DESPUES CREAMOS OTRO ARRAY, AHORA DE TODAS LAS CATEGORIAS (ELIMINAMOS LAS CATEGORIAS REVISABLES)
          let todasCategorias = [];
          
          if(responseJson[0].categoriasComercio !== null)
          {
            todasCategorias = responseJson[0].categoriasComercio.split(",,,");
          }

          for(let p=0 ; p<categoriasRevisables.length ; p++)
          {
            todasCategorias.splice(todasCategorias.indexOf( categoriasRevisables[p] ),1);
          }
          todasCategorias.sort();
 
          //CREAMOS UN ARRAY DE OBJETOS CON TODAS LAS CATEGORIAS
          let todasCategoriasEnObjetos = [];

          for(let u=0 ; u<todasCategorias.length ; u++)
          {
            todasCategoriasEnObjetos[u] = {
              nombreCategoria: todasCategorias[u],
              revisable: false
            };
          }

          //POR ULTIMO, UNIMOS LOS 2 ARRAYS DE OBJETOS CON LAS CATEGORIAS
          let categoriasFinal = categoriasRevisablesEnObjetos.concat(todasCategoriasEnObjetos);

          //ACTUALIZAMOS LAS CATEGORIAS EN EL ESTADO GLOBAL DE REDUX (Y PARAMOS EL LOADER)
          this.props.actualizarNumeroCategoriasRevisables(categoriasRevisablesEnObjetos.length)
          this.props.actualizarCategorias(categoriasFinal);
          this.activarLoader(false);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  cambioColor() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.backgroundColor, {
          delay: 0,
          duration: 2500,
          toValue: 1,
          isInteraction: false,
          useNativeDriver: false
        }),
        Animated.timing(this.state.backgroundColor, {
          delay: 0,
          duration: 2500,
          toValue: 0,
          isInteraction: false,
          useNativeDriver: false
        })
      ]),
      {
        iterations: 1000
      }
    ).start();
  }

  clickado(nombreCategoriaConIdComercio) {
    this.props.clickado(nombreCategoriaConIdComercio);
  }

  render() {

    this.cambioColor();

    var coloro = this.state.backgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(121, 183, 0, 0.15)", "rgba(121, 183, 0, 0.35)"]
    });

    let { clickCategorias, categoriasComercio, categoriasIsLoading } = this.props;
    if (categoriasIsLoading) {
      return <Loader loading={true} />;
    } else {
      return (
        <View style={styles.MainContainer}>
          <View style={styles.preContainer}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    "Ayuda",
                    "En ésta página puedes gestionar las categorías de un comercio particular.\n\nLas categorías que deben ser revisadas, si las hay, se muestran en la parte superior de la lista y su fila se resalta con un color distinto que las demás.\n\nPara revisar las categorias existen 2 posibilidades: Para revisarlas una a una, utilizar el botón habilitado en cada fila con un 'tick'. Asimismo, es posible dar por revisadas todas los categorías revisables de una sola vez, puedes pulsar sobre el botón 'Volver' y responder afirmativamente a la pregunta formulada.\n\nSi crees que es menester borrar este comercio, pulsa sobre el botón habilitado."
                  );
                }}
                style={{
                  paddingTop: winHeight * 0.01,
                  paddingBottom: winHeight * 0.01,
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

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: 1
            }}
          />

          <FlatList
            ref="listViewa"
            getItemLayout={(data, index) => ({
              length: winHeight * 0.2533,
              offset: winHeight * 0.2533 * index,
              index
            })}
            data={categoriasComercio.length === 0
              ? null 
              : categoriasComercio  
            }
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => categoriasComercio.length === 0
              ? null 
              : <View style={styles.separator}/>               
            }
            ListFooterComponent={() => categoriasComercio.length === 0
              ? null 
              : <View style={styles.listFooter}/>               
            }
            renderItem={({ item: rowData, index: rowNumber }) => (
                <Animated.View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: winHeight * 0.010,
                    marginBottom: winHeight * 0.010,
                    alignItems: "center",
                    height: winHeight * 0.12,
                    backgroundColor:
                    rowData.revisable &&
                    !clickCategorias.includes(rowData.nombreCategoria + this.state.idComercio)
                        ? coloro
                        : null
                  }}
                >
                  <View
                    style={rowData.revisable &&
                      !clickCategorias.includes(rowData.nombreCategoria + this.state.idComercio) ? styles.container1 : styles.container1SinTick}
                  >
                    <Text style={styles.rowViewContainer2}>
                      {rowData.nombreCategoria}
                    </Text>
                  </View>

                  <View
                    style={rowData.revisable &&
                      !clickCategorias.includes(rowData.nombreCategoria + this.state.idComercio)
                        ? styles.container2
                        : styles.container2SinTick
                    }
                  >                    
                    <View style={rowData.revisable &&
                        !clickCategorias.includes(rowData.nombreCategoria+this.state.idComercio) ? {} : {}}>
                      <TouchableOpacity
                        onPress={() =>
                          this.props.mensajeEliminar2(
                            this.state.idComercio,
                            rowData.nombreCategoria
                          )
                        }
                      >
                        <Image
                          style={{
                            height: winWidth * 0.147,
                            width: winWidth * 0.147,
                            resizeMode: "cover",
                           // marginRight: 8,
                            //marginTop: 8
                          }}
                          resizeMethod={"resize"}
                          source={require("GreenWaysProject/images/eliminar3.png")}
                        />
                      </TouchableOpacity>
                    </View>

                    <View
                      style={ rowData.revisable &&
                        !clickCategorias.includes(rowData.nombreCategoria+this.state.idComercio)
                          ? styles.mostrarTick
                          : styles.ocultarTick
                      }
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.props.categoriaRevisada(
                            rowData.nombreCategoria,
                            this.state.idComercio
                          ),
                          this.clickado(rowData.nombreCategoria + this.state.idComercio);
                        }}
                      >
                        <Image
                          style={styles.mostrarTickImagen}
                          resizeMethod={"resize"}
                          source={require("GreenWaysProject/images/tick2.png")}
                        />
                      </TouchableOpacity>
                    </View>

                  </View>
                </Animated.View>

            )}
          />

          <View style={styles.lineaBotones}>
            <View style={{ flex: 0.5 }}>
              <TouchableOpacity
                onPress={() =>
                  this.props.mensajeEliminar(this.state.nombreComercio)
                }
              >
                <View
                  style={{
                    height: winHeight * 0.08,
                    borderWidth: 1.5,
                    borderColor: "black",
                    borderRadius: 20,
                    backgroundColor: "#79B700",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "2%",
                    marginRight: "2%"
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Text style={styles.textoBotones}>
                      ELIMINAR
                      {"\n"}
                      COMERCIO
                    </Text>
                  </View>
                  <View>
                    <Image
                      style={{
                        height: winWidth * 0.13,
                        width: winWidth * 0.13,
                        resizeMode: "cover",
                        marginLeft: 10,
                        marginRight: 5
                      }}
                      resizeMethod={"resize"}
                      source={require("GreenWaysProject/images/eliminar3.png")}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{ flex: 0.5 }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.goGestionCategorias(this.props.numeroCategoriasRevisables, this.state.idComercio, this.state.nombreComercio);
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
                  <Text style={styles.textoBotones}>VOLVER</Text>
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
    categoriasIsLoading: state.gestionComercios.categoriasIsLoading,
    clickCategorias: state.gestionComercios.clickCategorias,
    categoriasComercio: state.gestionComercios.categoriasComercio,
    numeroCategoriasRevisables: state.gestionComercios.numeroCategoriasRevisables 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goGestionCategorias: (numeroCategoriasRevisables, idComercio, nombreComercio) =>
        dispatch(GestionComerciosActions.goGestionCategoriasBotonVolver(numeroCategoriasRevisables, idComercio, nombreComercio)),
    mensajeEliminar: (nombreComercio) => dispatch(GestionComerciosActions.mensajeEliminarComercioDesdeGestionCategoria(nombreComercio)),
    mensajeEliminar2: (idComercio, nombreCategoria) => dispatch(GestionComerciosActions.mensajeEliminarCategoria(idComercio, nombreCategoria)),
    revisadasCategorias: nombreComercio => dispatch(GestionComerciosActions.revisadasCategorias(nombreComercio)),
    categoriaRevisada: (nombreCategoria, idComercio) => dispatch(GestionComerciosActions.categoriaRevisada(nombreCategoria, idComercio)),
    clickado: nombreCategoriaConIdComercio => dispatch(GestionComerciosActions.clickadoCategoria(nombreCategoriaConIdComercio)),
    volverInicio: () => dispatch(GestionComerciosActions.volverInicio()),
    volverGestionCategorias: () => dispatch(GestionComerciosActions.goGestionCategorias()),
    actualizarCategorias: (categorias) => dispatch(GestionComerciosActions.actualizarCategorias(categorias)),
    activarLoader: (bool) => dispatch(GestionComerciosActions.categoriasIsLoading(bool)),
    actualizarNumeroCategoriasRevisables: (numeroCategoriasRevisables) => 
        dispatch(GestionComerciosActions.actualizarNumeroCategoriasRevisables(numeroCategoriasRevisables))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GestionCategorias2);

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    paddingLeft: winWidth * 0.025,
    paddingRight: winWidth * 0.025
  },
  preContainer: {
    flexDirection: "row",
    height: winHeight * 0.06
  },
  container1: {
    width: winWidth * 0.62,
    paddingLeft: winWidth * 0.02,
    height: winHeight * 0.21,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  container1SinTick: {
    width: winWidth * 0.775,
    paddingLeft: winWidth * 0.02,
    height: winHeight * 0.21,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  container2: {
    width: winWidth * 0.33,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: winWidth * 0.02
  },
  container2SinTick: {
    width: winWidth * 0.175,
    alignItems: "center"
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5
  },
  rowViewContainer2: {
    fontSize: 21,
    fontWeight: "bold",
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
  lineaBotones: {
    marginTop: "0.5%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: "1%"
  },
  mostrarTick: {
   // flex: 1
  },
  ocultarTick: {
    display: "none"
  },
  mostrarTickImagen: {
    width: winWidth * 0.14,
    height: winWidth * 0.14,
    resizeMode: "cover",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 100
  }
});
