import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
import AsyncStorage from '@react-native-community/async-storage';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  TextInput,
  Alert
} from "react-native";

import CatalogoActions from "../actions/Catalogo";
import Loader from "../components/Loader";
import { HeaderBackButton } from 'react-navigation-stack'

const winWidth = Dimensions.get("window").width;
const winHeight2 = Dimensions.get("window").height;
const winHeight = Dimensions.get("screen").height;

const ITEM_HEIGHT = winHeight * 0.1 + 2;


class CategoriasComercio extends Component {
  static navigationOptions = {
    title: "Gestionar categorías",
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
    ),
    headerLeft: (
			<HeaderBackButton
        onPress={() => {
              Actions.CategoriasYCatalogo();
          }}>
      </HeaderBackButton> 
		)
  };

  constructor(props) {
    super(props);

    this.state = {
      nombreUsuario: null,
      categoriaNueva: null,
      categoriaModificar: null,
      hayCategoriasComercioIniciales: null
    };
  }

  componentDidUpdate(prevProps)
  {   

    if(prevProps !== this.props)
    {
      if(prevProps.randomParaScroll !== this.props.randomParaScroll && this.props.scroll >= 2)
      {      
        setTimeout(() => {
          this.refs.flatList.scrollToIndex({
            animated: true,
            index: this.props.scroll -1
          });
        }, 50); 
      }   
    }
  }

  async componentDidMount() {

    this.props.activarLoader(true);

    await AsyncStorage.getItem("name").then(value => {
      this.setState({
        nombreUsuario: value
      });
    });

    return fetch("https://thegreenways.es/traerCategoriasComercio.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.nombreUsuario
      })
    })
      .then(response => response.json())
      .then(responseJson => {

        //Guardamos la celda de la BD que contiene todas las categorias del comercio
        let stringCategorias = responseJson[0].categoriasComercio;

        let arrayCategorias = [];

        if(stringCategorias !== null && stringCategorias !== "")
        {
          arrayCategorias = stringCategorias.split(",,,").sort();

          this.setState({
            hayCategoriasComercioIniciales: true
          });
        }
        else {
          this.setState({
            hayCategoriasComercioIniciales: false
          });
        }

        //Creamos un nuevo array de objetos el cual usaremos para construir el FlatList mas adelante

          this.props.actualizarCategorias(arrayCategorias);
          this.props.desplegarModificarComercio("");
          this.props.activarLoader(false);
      })
      .catch(error => {
        console.error(error);
      });
  }

  desplegar(categoriaComercio){

    this.props.desplegarModificarComercio(
      categoriaComercio,
    );

    //Esto es para poner el foco sobre el campo de texto
    if(categoriaComercio !== "")
    {
      setTimeout(() => (this._categoriaModificar.focus(),200));
    }
  }

  render() {
    let {categoriaCatalogo, categoriasComercio, isLoadingCategoria} = this.props;
    let {hayCategoriasComercioIniciales} = this.state
    if (isLoadingCategoria) {
      return <Loader loading={true} />;
    } else {
      return (
        <View style={styles.MainContainer}>
          <View>
            <View style={styles.preContainer}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      "Ayuda",
                      "En ésta página puedes ver la lista de comercios de GreenWays.\n\nEs posible alternar entre la vista rápida y la vista de detalles.\n\nPulsa sobre cada comercio para verlos en su página particular."
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

            <View
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1
              }}
            />

            <View style={
              this.props.categoriaCatalogo === "" 
                ? styles.containerInsertar 
                : {display: "none"}
            }>

              <View style={
                this.props.categoriaCatalogo === "" 
                ? {height: winHeight * 0.08, marginLeft: winWidth * 0.05} 
                : {display: "none"}
              }>
                <Text style={styles.bigblack}>
                  Introduce aquí una nueva categoría:
                </Text>
              </View>

              <View style={
                this.props.categoriaCatalogo === "" 
                ? {flexDirection:"row", height: winHeight * 0.11}
                : {display: "none"}
              }>

                <View style={this.props.categoriaCatalogo === "" 
                  ? {flex: 0.6,
                    justifyContent: "center",
                    backgroundColor: "#79B700",
                    marginLeft: winWidth * 0.05,
                    marginRight: winWidth * 0.02,
                    borderRadius: 15,
                    borderColor:"black",
                    borderWidth: 2,
                    height: winHeight * 0.08}
                  : {display: "none"}
                }>
                  <View style={this.props.categoriaCatalogo === "" 
                    ? {marginLeft: winWidth * 0.03,
                      marginRight: winWidth * 0.03,
                      backgroundColor: "white",
                      borderRadius: 15,
                      borderColor:"black",
                      borderWidth: 2,
                      height: winHeight * 0.06}
                    : {display: "none"}
                  }>
                    <TextInput
                      ref={c => {
                        this._categoriaNueva = c;
                      }}
                      placeholder={"Escribe aquí..."}
                      placeholderTextColor={"#282828"}
                      returnKeyType={"next"}
                      autoCapitalize={"none"}
                      style={styles.input}
                      onChangeText={categoriaNueva => this.setState({ categoriaNueva })}
                    />
                  </View>
                </View>

                <View
                  style={this.props.categoriaCatalogo === "" 
                  ? {flex: 0.4, marginRight: winWidth * 0.05}
                  : {display: "none"}
                }>
                  <TouchableOpacity
                    onPress={() => {
                      {
                        this.props.guardarCategoria(
                        this.state.categoriaNueva,
                        this.state.nombreUsuario
                      )
                    }
                    }}
                  >
                    <View
                      style={this.props.categoriaCatalogo === "" 
                      ? {height: winHeight * 0.08,
                        borderWidth: 2,
                        borderColor: "black",
                        borderRadius: 15,
                        backgroundColor: "#79B700",
                        marginLeft: "2%",
                        marginRight: "2%",
                        justifyContent: "center",
                        alignItems: "center"}
                      : {display: "none"}
                    }>
                      <Text style={styles.textoBotones}>GUARDAR</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

            </View>

            
            <View style={categoriaCatalogo === ""
                  ? styles.containerSection 
                  : styles.containerSection2
            }>

              <FlatList
                ref="flatList"
                getItemLayout={
                  (data, index) => ({
                  length: ITEM_HEIGHT,
                  offset: ITEM_HEIGHT * index,
                  index: index
                })}
                keyboardShouldPersistTaps="always"
                data={categoriasComercio.length === 0
                  ? null 
                  : categoriaCatalogo === "" 
                    ? categoriasComercio 
                    : categoriasComercio.filter(
                      element=>
                        element ===
                        categoriaCatalogo)
                  }
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent= {() => categoriasComercio.length === 0
                                               ? null 
                                               : <View style={styles.separator}/>               
                                        }
                ListFooterComponent={() => categoriasComercio.length === 0
                                           ? null 
                                           : categoriaCatalogo === "" 
                                             ? <View style={styles.listFooter}/> 
                                             : null                                             
                                    }
                renderItem={({ item: rowData, index: rowNumber }) => (
                  <View 
                    ref="itemView"
                    style={ categoriaCatalogo !== rowData ?
                           {marginRight: 20,
                           height: winHeight * 0.1} :
                           {}
                    }>

                      <View style={styles.container}>
                        <View style={categoriaCatalogo !== rowData
                           ? styles.container2 
                           : {display: "none"}
                         }>
                          <Text style={styles.rowViewContainer2}>
                            {rowData}
                          </Text>
                        </View>

                        <View style={
                                categoriaCatalogo !== rowData 
                                ? styles.container3
                                : styles.container3Derecha
                              }>                      
                        
                      
                          <View style={
                                categoriaCatalogo !== rowData 
                                ? {height: winHeight * 0.1}
                                : {display: "none"}
                              }>
                            <TouchableOpacity
                              onPress={() =>
                                this.desplegar(rowData)
                              }
                            >
                              <Image
                                style={{
                                  height: winHeight * 0.08,
                                  width: winHeight * 0.08,
                                  resizeMode: "cover",
                                  margin: winWidth * 0.02,
                                }}
                                resizeMethod={"resize"}
                                source={require("GreenWaysProject/images/modificar5.png")}
                              />
                            </TouchableOpacity>
                          </View>

                          <View style={
                                categoriaCatalogo === rowData 
                                ? {display: "none"}
                                : {height: winHeight * 0.1}
                              }>
                            <TouchableOpacity
                              onPress={() =>
                                this.props.mensajeEliminar(
                                  rowData,
                                  this.state.nombreUsuario
                                )
                              }
                            >
                              <Image
                                style={{
                                  height: winHeight * 0.08,
                                  width: winHeight * 0.08,
                                  resizeMode: "cover",
                                  margin: winWidth * 0.02
                                }}
                                resizeMethod={"resize"}
                                source={require("GreenWaysProject/images/eliminar3.png")}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>

                      <View style={
                         categoriaCatalogo === rowData
                         ? {
                           borderBottomWidth: 2,
                           borderBottomEndRadius: 10,
                           borderBottomStartRadius: 10,
                           borderTopWidth: 2,
                           borderTopEndRadius: 10,
                           borderTopStartRadius: 10,
                           borderLeftWidth: 2,
                           borderRightWidth: 2,
                           height: winHeight * 0.29,
                           marginTop: winHeight * 0.01,
                           marginBottom: 10}
                         : {display: "none"}
                      }>

                        <View style={{height: winHeight * 0.08, marginLeft: winWidth * 0.05}}>
                          <Text style={styles.bigblack}>
                            Modifica el nombre de la categoría:
                          </Text>
                        </View>

                        <View style={
                                categoriaCatalogo === rowData 
                                ? {height: winHeight * 0.19}
                                : {display: "none"}
                              }
                        >
                          <View style={
                                  categoriaCatalogo === rowData
                                  ? {justifyContent: "center",
                                     alignSelf: "center",
                                     backgroundColor: "#79B700",
                                     borderRadius: 15,
                                     borderColor:"black",
                                     borderWidth: 2,
                                     height: winHeight * 0.08,
                                     width: winWidth * 0.7}
                                  : {display:"none"}
                                }
                          >
                            <View style={
                              categoriaCatalogo === rowData
                              ? {justifyContent: "center",
                                 alignSelf: "center", 
                                 backgroundColor: "white",
                                 borderRadius: 15,
                                 borderColor:"black",
                                 borderWidth: 2,
                                 width: winWidth * 0.6,
                                 height: winHeight * 0.06}
                              : {display:"none"}
                            }>

                              {categoriaCatalogo !== "" ?<TextInput
                                ref={c => {
                                  this._categoriaModificar = c;
                                }}
                               keyboardType={Platform.OS === 'android' ? 'email-address' : 'ascii-capable'}
                               placeholder={"Escribe aquí..."}
                               placeholderTextColor={"#282828"}
                               returnKeyType={"next"}
                               autoCapitalize={"none"}
                               style={styles.input}
                               defaultValue={rowData !== null ? rowData : null}
                               onChangeText={categoriaModificar => this.setState({ categoriaModificar })}
                              /> : null}
                            </View>
                          </View>

                          <View style={
                                categoriaCatalogo === rowData 
                                ? {flexDirection: "row", height: winHeight * 0.09, marginTop: winHeight * 0.015, alignItems: "center", justifyContent: "center"}
                                : {display: "none"}
                              }>

                            <View
                              style={
                                categoriaCatalogo === rowData 
                                ? {flex: 0.4, marginRight: winWidth * 0.01}
                                : {display: "none"}
                              }
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  {this.props.modificarCategoria(
                                    rowData,
                                    this.state.categoriaModificar,
                                    this.state.nombreUsuario
                                  )}
                                }}
                              >
                                <View
                                  style={
                                    categoriaCatalogo === rowData 
                                    ? {height: winHeight * 0.08,
                                      borderWidth: 2,
                                      borderColor: "black",
                                      borderRadius: 15,
                                      backgroundColor: "#79B700",
                                      marginLeft: "2%",
                                      marginRight: "2%",
                                      justifyContent: "center",
                                      alignItems: "center"}
                                    : {display: "none"}
                                  }
                                >
                                  <Text style={styles.textoBotones}>GUARDAR</Text>
                                </View>
                              </TouchableOpacity>
                            </View>

                            <View
                              style={
                                categoriaCatalogo === rowData 
                                ? {flex: 0.4, marginLeft: winWidth * 0.01}
                                : {display: "none"}
                              }
                            >
                              <TouchableOpacity
                                onPress={() => {        
                               //   Keyboard.dismiss();                          
                                  this.desplegar(""); 
                                }}
                              >
                                <View
                                  style={
                                    categoriaCatalogo === rowData 
                                    ? {height: winHeight * 0.08,
                                      borderWidth: 2,
                                      borderColor: "black",
                                      borderRadius: 15,
                                      backgroundColor: "#79B700",
                                      marginLeft: "2%",
                                      marginRight: "2%",
                                      justifyContent: "center",
                                      alignItems: "center"}
                                    : {display: "none"}
                                  }
                                >
                                  <Text style={styles.textoBotones}>CANCELAR</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                    </View>
                  </View>
                )}
              />

              </View>
          </View>

          <View
            style={{
             marginTop: winHeight * 0.004,
             height: winHeight * 0.05,
             margin: 0
            }}
          >
            <TouchableOpacity
              onPress={() => {

                if(hayCategoriasComercioIniciales)
                {
                  if(categoriasComercio.length === 0)
                  {
                    Actions.CategoriasYCatalogo();
                  }
                  else{
                    Actions.pop()
                  }
                }
                else {
                  if(categoriasComercio.length > 0)
                  {
                    Actions.CategoriasYCatalogo();
                  }
                  else{
                    Actions.pop()
                  }
                }


              }}
            >
              <View
                style={{
                  height: 55,
                  borderWidth: 2,
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
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    categoriaCatalogo: state.catalogoVendedor.categoriaCatalogo,
    scroll: state.catalogoVendedor.scroll,
    randomParaScroll: state.catalogoVendedor.randomParaScroll,
    categoriasComercio: state.catalogoVendedor.categoriasComercio,
    isLoadingCategoria: state.catalogoVendedor.isLoadingCategoria
  };
};

const mapDispatchToProps = dispatch => {
  return {
    cambiarScroll: (numero) => dispatch(CatalogoActions.cambiarScroll(numero)), 
    desplegarModificarComercio: (categoria) => dispatch(CatalogoActions.desplegarModificarComercio(categoria)),
    guardarCategoria: (nuevaCategoria, nombreUsuario) => dispatch(CatalogoActions.guardarCategoria(nuevaCategoria, nombreUsuario)),
    modificarCategoria: (categoriaVieja, categoriaNueva, nombreUsuario) => dispatch(CatalogoActions.modificarCategoria(categoriaVieja, categoriaNueva, nombreUsuario)),
    mensajeEliminar: (categoria, nombreUsuario) => dispatch(CatalogoActions.mensajeEliminarCategoria(categoria, nombreUsuario)),
    actualizarCategorias: (categorias) => dispatch(CatalogoActions.actualizarCategorias(categorias)),
    activarLoader: (bool) => dispatch(CatalogoActions.categoriasIsLoading(bool))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoriasComercio);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
   // flex: 1,
    marginLeft: 10,
    marginRight: 10
  },
  preContainer: {
    flexDirection: "row",
    justifyContent:"flex-start",
    margin: 0,
    height: winHeight * 0.05
  },
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  containerSection: {
    height: winHeight * 0.495
  },
  containerSection2: {
    justifyContent: "flex-start",
    height: winHeight * 0.691,  
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    width: winWidth * 0.52,
    marginLeft: winWidth * 0.03
  },
  container3: {
    flexDirection: "row",
    width: winWidth * 0.41,
    alignItems: "center",
    justifyContent: "flex-end",
  //  width: winWidth * 0.5,
    marginRight: winWidth * 0.04
  
  },
  container3Derecha: {
    width: winWidth * 0.37,
    paddingRight: 300
  },
  containerInsertar: {
    borderBottomWidth: 2,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    borderTopWidth: 2,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    height: winHeight * 0.19,
    marginTop: 5
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5
  },
  listFooter: {
    height: 2,
    backgroundColor: "#8E8E8E"
  },
  separator: {
    height: 2,
    backgroundColor: "#8E8E8E"
  },
  containerFila: {
    flexDirection: "row"
  },
  rowViewContainer2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black"
  },
  bigblack: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20
  },
  input: {
    marginLeft: winWidth * 0.02
  }
  
});
