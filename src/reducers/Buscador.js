import * as ActionTypes from "../constants/ActionTypes";

const initialState = {
  isLogged: false,
  hasError: false,
  isLoading: false,
  mostrar: ""
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ActionTypes.BUSCADOR_HAS_ERROR:
      return { ...state, 
        hasError: action.hasError
      };
    case ActionTypes.BUSCADOR_IS_LOADING:
      return { ...state, 
        isLoading: action.isLoading
      };
    case ActionTypes.BUSCADOR:
      return {...state, 
        hasError: false
      };
    case ActionTypes.BUSCADOR_NO_MOSTRAR:
      return {...state, 
        mostrar: "no"
      };
    case ActionTypes.BUSCADOR_MOSTRAR:
      return { ...state,
        mostrar: "si"
      };
    /* case ActionTypes.BUSCADOR_NO_MOSTRAR:
      return Object.assign({}, state, {
        mostrar: "no"
      });*/

    default:
      return state;
  }
};
