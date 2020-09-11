import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
  isLogged: false,
  hasError: false,
  isLoading: false,
  isLoadingCategoria: false,
  categoria: "TODO",
  categoriaCatalogo: null,
  name: "",
  username: "",
  password: "",
  scroll: null,
  randomParaScroll: null,
  categoriasComercio: []
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {

    case ActionTypes.CATEGORIA_VENDEDOR:

      return Object.assign({}, state, {
        categoria: action.categoria
      });

    case ActionTypes.CATALOGO_VENDEDOR_HAS_ERROR:
      return Object.assign({}, state, {
        hasError: action.hasError
      });

    case ActionTypes.CATALOGO_VENDEDOR_IS_LOADING:
      return Object.assign({}, state, {
        isLoading: action.isLoading
      });

    case ActionTypes.CATEGORIA:
      return Object.assign({}, state, {
        categoria: action.categoria
      });

    case ActionTypes.CATEGORIA_IS_LOADING:
      return Object.assign({}, state, {
        isLoadingCategoria: action.isLoadingCategoria
      });

    case ActionTypes.CATEGORIA_CATEGORIA_CATALOGO:
        return Object.assign({}, state, {
          categoriaCatalogo: action.categoriaCatalogo
        });

    case ActionTypes.NO_CATEGORIA:
      return Object.assign({}, state, {
        categoria: ""
      });

    case ActionTypes.SCROLL_CATEGORIA_VENDEDOR:

      return {...state,
        scroll: action.scroll,
        randomParaScroll: Math.random()
      };

    case ActionTypes.ACTUALIZAR_CATEGORIAS_VENDEDOR:

      return Object.assign({}, state, {
        categoriasComercio: action.categorias
      });

    case ActionTypes.AGREGAR_CATEGORIA_VENDEDOR:

      // CREAMOS UNA COPIA DEL OBJETO ARRAY DEL ESTADO GLOBAL, LE AGREGAMOS LA NUEVA CATEGORIA Y POR ULTIMO LO ORDENAMOS ALFABETICAMENTE
      return {...state,
        categoriasComercio: [...state.categoriasComercio, action.categoriaNueva].sort()
      };

    case ActionTypes.MODIFICAR_CATEGORIA_VENDEDOR:  

      // QUITAMOS CON SPLICE LA CATEGORIA SUSTITUIDA (MUTAMOS EL OBJETO ORIGINAL DEL ESTADO GLOBAL DE REDUX,
      // AUNQUE LUEGO CREAMOS UNA COPIA DEL ARRAY ORIGINAL PARA GENERAR ASÍUN CAMBIO EN EL ESTADO GLOBAL)
      state.categoriasComercio.splice(state.categoriasComercio.indexOf( action.categoriaVieja ),1);

    return {...state,
      categoriasComercio: [...state.categoriasComercio, action.categoriaNueva].sort()
    };

    case ActionTypes.QUITAR_CATEGORIA_VENDEDOR:

      state.categoriasComercio.splice(state.categoriasComercio.indexOf( action.categoriaQuitar ),1);

      return {...state,
        categoriasComercio: [...state.categoriasComercio]
      };

    default:
      return state;
  }
};
