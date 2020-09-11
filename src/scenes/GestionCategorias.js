import React, { Component } from "react";
import { connect } from "react-redux";
import { HeaderBackButton } from 'react-navigation-stack';
import AsyncStorage from '@react-native-community/async-storage';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  FlatList,
  Alert
} from "react-native";

import GestionComerciosActions from "./../actions/GestionComercios";
import Loader from "./../components/Loader";
import { Actions } from "react-native-router-flux";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class GestionCategorias extends Component {
  static navigationOptions = ({ navigation }) => {
    return{
      title: "Categorías revisables en comercios",
      headerRight: (
        <View>
          <TouchableOpacity
            onPress={navigation.getParam('volverInicio')}
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
      headerLeft:(<HeaderBackButton onPress={navigation.getParam('volverGestionComercios') }/>)
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      backgroundColor: new Animated.Value(0),
      datas: null,
      coordenadaListView: null,
      datas: null,
      clicsPantallaActual: false,
      isStorageLoaded: false
    };
  }

  volverInicio = () => {
    this.props.volverInicio();
  };

  volverGestionComercios = () => {
    this.props.volverGestionComercios();
  };

  async componentDidMount() {

    this.props.navigation.setParams({
      volverInicio: this.volverInicio,
      volverGestionComercios: this.volverGestionComercios
    });

    await AsyncStorage.getItem("filaInicioGestionCategoriasFinal").then(value => {
      this.setState({
        coordenadaListView: value
      });
    });

    return fetch("https://thegreenways.es/listaComerciosCategoriasRevisables.php", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson === "No Results Found")
        {
          if (
            this.state.coordenadaListView === "0" ||
            this.state.coordenadaListView === null
          ) {

            this.setState({
              coordenadaListView: 1,
              isStorageLoaded: true
            });
          }
          else
          {
            this.setState({
              isStorageLoaded: true
            });
          }
        }
        else
        {
          if (
            this.state.coordenadaListView === "0" ||
            this.state.coordenadaListView === null
          ) {

            this.setState({
              datas: responseJson,
              coordenadaListView: 1,
              isStorageLoaded: true
            });
          }
          else
          {
            this.setState({
              datas: responseJson,
              isStorageLoaded: true
            });
          }

          setTimeout(() => {
            this.refs.listViewa.scrollToIndex({
              animated: true,
              index: parseInt(this.state.coordenadaListView) - 1
            });
          }, 50);

          //Reseteamos filaInicio a 0 para que cuando volvamos a recargar la página no vuelva a una posicion indicada anteriormente.
          AsyncStorage.setItem(
            "filaInicioGestionCategoriasFinal",
            (0).toString()
          );          
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

  // clickado(comercio) {
  //   this.props.clickado(comercio);

  //   if(this.state.clicsPantallaActual === false){
            
  //     this.setState ({
  //       clicsPantallaActual: true
  //     }); 
  //   }
  // }


  GetItem(idComercio, nombreComercio, rowNumber) {
    //Alert.alert(idComercio);
    AsyncStorage.setItem("comercioCategoria", idComercio);
    AsyncStorage.setItem("nombreComercioCategoria", nombreComercio);
    //AsyncStorage.setItem("sceneAnterior", "listaComercios");
   // AsyncStorage.setItem("filaInicioPagComercio", rowNumber.toString());
    //AsyncStorage.setItem("sceneComerciosAnterior", "listaComercios");
    Actions.GestionCategorias2();
  }

  render() {

    this.cambioColor();

    var coloro = this.state.backgroundColor.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(121, 183, 0, 0.15)", "rgba(121, 183, 0, 0.35)"]
    });

    let { isStorageLoaded } = this.state;
    let { click, flicker } = this.props;
    if (!isStorageLoaded) {
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
                    "En ésta página puedes ver los comercios que tienen categorías revisables (resaltadas en verde). Seleccione un comercio para poder ver/revisar sus categorías."
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
              length: 71,
              offset: 71 * index,
              index
            })}
            // initialNumToRender={this.state.datas.length}
            data={this.state.datas}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={() => <View style={styles.listFooter} />}
            renderItem={({ item: rowData, index: rowNumber }) => (
              <TouchableOpacity
                onPress={() => {
                 // this.clickado(rowData.categoria);
                  this.GetItem(rowData.idComercio, rowData.nombreComercio, rowNumber);
                }}
              >
                <Animated.View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    paddingTop: 15,
                    paddingBottom: 15,
                    marginTop: 5,
                    marginBottom: 5,
                    backgroundColor:
                      rowData.categoriasComercioRevisables !== null && rowData.categoriasComercioRevisables !== ""
                      //&& !click.includes(rowData.nombreComercio) //&& flicker === "GestionPagComercio"
                        ? coloro
                        : null
                  }}
                >
                  <View style={styles.container1}>
                    <Text style={styles.rowViewContainer2}>
                      {rowData.nombreComercio}
                    </Text>
                  </View>

                </Animated.View>
              </TouchableOpacity>
            )}
          />

            <View
            style={{
              marginTop: "0.5%",
              marginBottom: "1%"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.props.goGestionComercios();
              }}
            >
              <View
                style={{
                  height: winHeight * 0.08,
                  borderWidth: 2,
                  borderColor: "black",
                  borderRadius: 20,
                  backgroundColor: "#79B700",
                  marginLeft: "2%",
                  marginRight: "2%",
                  //marginTop: winHeight * 0.007,
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
    // isLogged: state.login.isLogged,
    // hasError: state.register.hasError,
    // isLoading: state.register.isLoading,
    // flicker: state.mainAdmin.flicker
    click: state.gestionComercios2.click,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goGestionComercios: () =>
      dispatch(GestionComerciosActions.goGestionComercios2()),
    volverInicio: () =>
      dispatch(GestionComerciosActions.volverInicio()),
    volverGestionComercios: () =>
      dispatch(GestionComerciosActions.goGestionComercios2())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GestionCategorias);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    flex: 1,
    marginLeft: 10,
    marginRight: 10
  },
  preContainer: {
    flexDirection: "row",
    //margin: 0,
    height: winHeight * 0.06
  },
  container1: {
    
   // flex: 0.425,
   justifyContent: "center",
   alignItems: "flex-start"
  },
  rowViewContainer2: {
    fontSize: 21,
    marginLeft: 10,
    fontWeight: "bold",
    color: "black",
    justifyContent: "center",
    alignItems: "center"
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
  textoBotones: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5
  }
});
