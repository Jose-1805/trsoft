import types from './const';
import axios from 'axios';

import params from '../../config/params';

/**
 * Acción para loguear un usuario
 * @param  {object}         data Objeto con las credenciales del usuario
 * @return {null/object}         Si se loguea correctamente despacha la acción 
 *                               de login para actualizar los valores del store
 *                               en los datos de autenticación. De lo contrario
 *                               retorna el error obtenido del servidor para que pueda
 *                               ser manejado en el componente que llamo a la acción
 */
const actLogin = (data) => {
    return dispatch => {
        return axios.post(params.URL+'/login',data)
        .then((response) => {
            dispatch({
                    type:types.LOGIN,
                    user:response.data.user
                });
        })
        .catch((error) => {
            return error.response.data;
        });
    }
}

/**
 * Acción para cerrar la sesión de un usuario con llamado a sevidor
 */
const actLogout = (reload = false) => {
    return dispatch => {
        return axios.post(params.URL+'/logout')
        .then((response) => {
            setTimeout(() => {
                //se despacha la acción para cambiar los valores de los datos de estado
                //de autenticación en el store
                dispatch({
                    type:types.LOGOUT
                });

                if(reload)
                    window.location.reload();
            }, 100);
        })
        .catch((error) => {
            console.log(error.response);
        });
    }
}

/**
 * Acción para registrar un usuario
 * @param  {object}         data Objeto con los datos del usuario
 * @return {null/object}         Si se registra correctamente despacha la acción 
 *                               de login para actualizar los valores del store
 *                               en los datos de autenticación. De lo contrario
 *                               retorna el error obtenido del servidor para que pueda
 *                               ser manejado en el componente que llamo a la acción
 */
const actRegister = (data) => {
    return dispatch => {
        return axios.post(params.URL+'/register',data)
        .then((response) => {
            grecaptcha.execute(params.GOOGLE_API_KEY, {action:'register'}).then((token) => {
                if(token){
                    if(typeof fbq === 'function') {
                        fbq('track', 'CompleteRegistration');
                    }
                    document.cookie = 'welcome=1; path=/;';
                    return dispatch(actLogin({username:data.email, password:data.password, token_recaptcha:token}));
                }
            });
        })
        .catch((error) => {
            return error.response.data;
        });
    }
}

/**
 * Acción para cambiar la contraseña de usuario
 * @param  {object}         data Objeto con los datos cambio de contrasela
 */
const actChangePassword = (data) => {
    return dispatch => {
        return axios.post(params.URL+'/change-password',data)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error.response.data;
        });
    }
}

/**
 * Acción para cambiar la contraseña de usuario
 * @param  {object}         data Objeto con los datos cambio de contrasela
 */
const actLoginIq = (data) => {
    return dispatch => {
        return axios.post(params.URL+'/login-iq',data)
        .then((response) => {
            dispatch(actSyncUser());
            return response;
        })
        .catch((error) => {
            return error.response.data;
        });
    }
}

/**
 * Acción para sincronizar los datos del usuario con los datos del servidor
 */
const actSyncUser = () => {
 return dispatch => {
     return axios.get(params.URL+'/user')
     .then((response) => {
         return dispatch({
            type:types.SYNC_USER,
            user:response.data
         });
     })
     .catch((error) => {
         return error.response.data;
     });
 }
}

export {actLogin, actLogout, actRegister, actChangePassword, actSyncUser, actLoginIq};
