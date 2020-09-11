import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
  isLogged: false,
  hasError: false,
  categoriasIsLoading: false,
  categoriasComercio: [],
  click: [],
  clickCategorias: [],
  numeroCategoriasRevisables: 0
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {


    case ActionTypes.ACTUALIZAR_CATEGORIAS_ADMIN:

      return Object.assign({}, state, {
        categoriasComercio: action.categorias
      });

    case ActionTypes.FILA_CLICKADA:

      return {...state, 
        click: [...state.click, action.click]
      };  

    case ActionTypes.FILA_CLICKADA_CATEGORIA:

      return {...state, 
        numeroCategoriasRevisables: state.numeroCategoriasRevisables -1,
        clickCategorias: [...state.clickCategorias, action.categoriaClickada]
      };   

    case ActionTypes.ACTUALIZAR_NUMERO_CATEGORIAS_REVISABLES:

      return {...state, 
        numeroCategoriasRevisables: action.numCategoriasRevisables
      }; 

    case ActionTypes.CATEGORIA_ADMIN_IS_LOADING:

     // alert(action.isLoadingCategoria);

      return {...state, 
        categoriasIsLoading: action.isLoadingCategoria
      };

    case ActionTypes.QUITAR_CATEGORIA_ADMIN:

      //BUSCAMOS EL INDICE DEL ARRAY DE CATEGORIAS DONDE SE ENCUENTRA EL ATRIBUTO "nombreCategoria" 
      //CON LA CATEGORIA A QUITAR
      
      let index;
      let numeroCategoriasRevisablesAux = state.numeroCategoriasRevisables;
      for(let i = 0; i < state.categoriasComercio.length; i += 1) {
        if(state.categoriasComercio[i]["nombreCategoria"] === action.categoriaQuitar) {
            index = i;
            if(state.categoriasComercio[i]["revisable"] === true)
            {
              numeroCategoriasRevisablesAux = numeroCategoriasRevisablesAux- 1;
            }
        }
      }

      state.categoriasComercio.splice(index,1);
   
      return {...state,
        categoriasComercio: [...state.categoriasComercio],
        numeroCategoriasRevisables: numeroCategoriasRevisablesAux
      };

    case ActionTypes.REEMPLAZAR_CATEGORIA_ADMIN:

      for(let i = 0; i < state.categoriasComercio.length; i += 1) {
        if(state.categoriasComercio[i]["nombreCategoria"] === action.categoriaNueva) {
            state.categoriasComercio[i]["nombreCategoria"] = action.categoriaVieja;
            state.categoriasComercio[i]["revisable"] = false;
        }
      }

      return {...state,
        categoriasComercio: [...state.categoriasComercio],
        numeroCategoriasRevisables: state.numeroCategoriasRevisables -1
      };

    case ActionTypes.CATEGORIA_REVISADA:

      for (let r=0 ; r<state.categoriasComercio.length ; r++)
      {
        if(state.categoriasComercio[r].nombreCategoria === action.categoria)
        {
          state.categoriasComercio[r].revisable === false;
        }  
      }

      return {...state,
        categoriasComercio: [...state.categoriasComercio ]
      };


    /*  case ActionTypes.FILA_CLICKADA2:
      return Object.assign({}, ...state, {
        // click: action.click
        click2: [...state.click2, action.click2]
      });*/

    /* case ActionTypes.NO_ERROR:
      return Object.assign({}, state, {
        campoError: ""
      });
      
      */

    default:
      return state;
  }
};
