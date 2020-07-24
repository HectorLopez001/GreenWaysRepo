import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";
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

import MainActions from "./../actions/Main";
import Loader from "./../components/Loader";

const winWidth = Dimensions.get("window").width;
const winHeight = Dimensions.get("window").height;

class Comercios extends Component {
  static navigationOptions = {
    title: "Lista de Comercios",
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
      datas: null,
      isStorageLoaded: false,
      productosYaImportados: false
    };
  }
  GetItem(nombreComercio) {
    AsyncStorage.setItem("comercio", nombreComercio);
    AsyncStorage.setItem("sceneAnterior", "listaComercios");
    AsyncStorage.setItem("sceneComerciosAnterior", "listaComercios");
    Actions.PagComercio();
  }

  async componentDidMount() {

    await AsyncStorage.getItem("comerciosCliente").then(
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
            this.removeItemValue("comerciosCliente");
          }
          );        
        }
      }
    );

    if(!this.state.productosYaImportados)
    {
      return fetch("https://thegreenways.es/listaComerciosRevisados.php")
      .then(response => response.json())
      .then(responseJson => {

        if (responseJson !== "No Results Found") {
          this.setState({
              datas: responseJson,
              isStorageLoaded: true
            });
        } 
        else{
          this.setState({
              isStorageLoaded: true
            });
        }                
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

  render() {
    let { isStorageLoaded } = this.state;
    if (!isStorageLoaded) {
      return <Loader loading={true} />;
    } else {
      return (
        <View style={styles.MainContainer}>
          <View style={styles.preContainer}>
            <View style={{ flexDirection: "row" }}>
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
                {"Aún no existen comercios..."}
              </Text>
            </View>
          ) : null}

          <View style={ this.state.datas === null 
                ? { height: "80%" } 
                : { height: "87%" }}>
            <FlatList
              data={this.state.datas !== null ? this.state.datas : null}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={() => this.state.datas !== null ? <View style={styles.separator} /> : null}
              ListFooterComponent={() => this.state.datas !== null ? <View style={styles.listFooter}/> : null }
              renderItem={({ item: rowData, index: rowNumber }) => (
                <View>
                  <TouchableOpacity
                    onPress={() => this.GetItem(rowData.nombreComercio)}
                  >
                    <View style={styles.container}>
                      <View style={styles.container2}>
                        <Text style={styles.rowViewContainer2}>
                          {rowData.nombreComercio}
                        </Text>
                      </View>

                      <View style={styles.container3}>
                        <Text style={styles.rowViewContainer3}>
                          {rowData.localizacionComercio}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          <View style={styles.lineaBotones}>
            <View
              style={{
                width: "49%",
                marginRight: "1%"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.goComerciosDetalle(this.state.datas);
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
                  this.props.goPrincipal();
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
    isLogged: state.login.isLogged,
    hasError: state.register.hasError,
    isLoading: state.register.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    goComerciosDetalle: (comercios) => dispatch(MainActions.goComerciosDetalle(comercios)),
    goPrincipal: () => dispatch(MainActions.goPrincipal())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Comercios);

const styles = StyleSheet.create({
  MainContainer: {
    // Setting up View inside content in Vertically center.
    justifyContent: "center",
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  },
  preContainer: {
    flexDirection: "row",
    height: winHeight * 0.055
    // height: winHeight * 0.06
  },
  container: {
    flex: 1,
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5
  },
  container2: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 13
  },
  container3: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center"
  },
  rowViewContainer2: {
    fontSize: 20,
    paddingRight: 10,
    fontWeight: "bold",
    color: "black"
  },
  rowViewContainer3: {
    fontSize: 18,
    paddingRight: 10,
    color: "black"
  },
  button: {
    padding: 10,
    backgroundColor: "#36ada4"
  },
  listFooter: {
    height: StyleSheet.hairlineWidth + 1,
    backgroundColor: "#8E8E8E"
  },
  separator: {
    height: StyleSheet.hairlineWidth + 2,
    backgroundColor: "#8E8E8E"
  },
  lineaBotones: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "2%",
    height: winHeight * 0.08
    // height: winHeight * 0.08
  },
  textoBotones: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 5
  }
});
