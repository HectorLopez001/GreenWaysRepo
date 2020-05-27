import * as ActionTypes from '../constants/ActionTypes';
import { Actions } from 'react-native-router-flux';

/*const isLogged = (bool) => {
    return {
        type: ActionTypes.IS_LOGGED,
        isLogged: bool
    }
};  */

const catalogoHasError = (bool) => {
    return    {
        type: ActionTypes.CATALOGO_HAS_ERROR,
        hasError: bool
    }
};

const catalogoIsLoading = (bool) => {
    return    {
        type: ActionTypes.CATALOGO_IS_LOADING,
        isLoading: bool
    }
};

const setAsyncStorage = () => {

};

const goInsertar = () => {
    Actions.Insertar();
    return    {
        type: ActionTypes.INSERTAR
    }
};

const goEliminar = () => {
    Actions.Eliminar();
    return    {
        type: ActionTypes.ELIMINAR
    }
};

const goCatalogo = () => {
    Actions.Catalogo();
    return    {
        type: ActionTypes.CATALOGO
    }
};

const goPrincipal = () => {
    Actions.MainVendedor();
    return    {
        type: ActionTypes.MAINVENDEDOR
    }
};

export default {
    catalogoHasError,
    catalogoIsLoading,
    goInsertar,
    goEliminar,
    goCatalogo,
    goPrincipal,
}
