import * as ActionTypes from '../constants/ActionTypes'

const initialState = {
    isLogged: false,
    hasError : false,
    isLoading: false,
    name: '',
    username: '',
    password: '',
    flicker: "MainAdmin"
};


export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type){

        case ActionTypes.MAINADMIN:
            return {...state, 
            //  flicker: action.flicker
        };

        case ActionTypes.GESTION_USUARIOS_REGISTRADOS:
            return{...state,
            //  flicker: action.flicker                  
        };

        case ActionTypes.GESTION_COMERCIOS:
            return {...state, 
            //  flicker: action.flicker
        };

        case ActionTypes.GESTION_PAG_COMERCIO:
            return {...state, 
            //  flicker: action.flicker
        };
        
        case ActionTypes.GESTION_DENUNCIAS:
            return {...state, 
            //  flicker: action.flicker
        };

        case ActionTypes.GESTION_CATALOGO_PRODUCTOS:
            return {...state, 
            //  flicker: action.flicker
        };

        case ActionTypes.CATALOGO_PRODUCTOS_ADMIN:
            return {...state, 
            //  flicker: action.flicker
        };

        case ActionTypes.GESTION_PERFILES_USUARIO:
            return {...state, 
            //  flicker: action.flicker
        };

        case ActionTypes.GESTION_FEEDBACKS:
            return {...state, 
            //  flicker: action.flicker
        };

        default:
            return state
    }
}


