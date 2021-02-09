import React, {Component} from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

import params from './config/params';
import types from './redux/app/const'
import store from './redux/store';
import { Grid, Segment, Dimmer, Loader } from 'semantic-ui-react';
import config_routes from './config/routes';

/*----------  Componentes del sistema  ----------*/

import Home from './components/home/Home';
import Login from './components/auth/login/Login';
import Register from './components/auth/register/Register';

import Performance from './components/performance/Performance';

import Commission from './components/commission/Commission';

import Product from './components/product/Product';
import Buy from './components/product/Buy';
import ProcessPayment from './components/ProcessPayment';

import License from './components/license/License';
import Setting from './components/setting/Setting';
import Communication from './components/communication/Communication';
import Guide from './components/guide/Guide';

import EmailVerification from './components/EmailVerification';
import TermsAndConditions from './components/legal/TermsAndConditions';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import CookiesPolicy from './components/legal/CookiesPolicy';

import { SetLang, Notifications, getCookie, CookiesPolicy as CookiesPolicyComponent } from './components/helpers/Helpers';
import Menu from './components/menu/Menu';
import Footer from './components/Footer';
import Welcome from './components/Welcome';
import E404 from './components/errors/E404';

/*----------  Componentes del sistema  ----------*/

const redirect_no_auth = config_routes.login.path;//donde redireccionar cuando acceda a url
                                //que requiera autenticación y no esta autenticado
const redirect_auth = config_routes.performance.path;//donde redirecciona cuando acceda a url que requiera que
                        //no este autenticado, pero si esta autenticado
                        //
const redirect_auth_client = config_routes.performance.path;
const redirect_auth_trader = config_routes.setting.path;
const redirect_auth_client_server = config_routes.setting.path;

/**
 * Crea una ruta admitida solo para usuarios logueados
 * @param  {Component}  options.component: Component   Componente que se debe renderizar si el usuario está autenticado
 * @param  {object}     options.rest                   Contiene todos los atributos enviados
 * @return {Component}                                 Si el usuario está autenticado retorna el componente enviado
 *                                                     de lo contrario redirecciona a la ruta almacenada en redirect_no_auth
 */
const AuthRoute = ({component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render={
                (props) =>{
                    if(store.getState().app.user_auth == true){
                        //Si no se ha verificado el email se redirecciona a la vista de verificación de código
                        if(store.getState().app.user.is_client == 1 && !store.getState().app.user.email_verified_at && props.location.pathname != config_routes.email_verification.path){
                            return <Redirect to={config_routes.email_verification.path} />
                        }
                        //Si ya se ha verificado el email y está en la vista de verificacion de código
                        else if(store.getState().app.user.email_verified_at && props.location.pathname == config_routes.email_verification.path){
                            return <Redirect to={{pathname: redirect_no_auth, state: {from: props.location}}} />
                        }

                        //Si hay orden de mostrar la vista de bienvenida pero no se ha presentado 
                        //y esta en una vista diferente a la de bienvenida
                        if(store.getState().app.user.is_client == 1 && getCookie('welcome') == 1 && props.location.pathname != config_routes.welcome.path){
                            return <Redirect to={config_routes.welcome.path} />
                        //Si no hay orden de mostrar la vista de bienvenida y está en la vista de bienvenida
                        }else if(getCookie('welcome') != 1 && props.location.pathname == config_routes.welcome.path){
                            return <Redirect to={{pathname: redirect_no_auth, state: {from: props.location}}} />
                        }

                        return rest.userType?
                                (store.getState().app.user['is_'+rest.userType] === 1?<Component {...props} />:<Redirect to={{pathname: redirect_no_auth, state: {from: props.location}}} />)
                                :<Component {...props} />
                    }else{
                        return <Redirect to={{pathname: redirect_no_auth, state: {from: props.location}}} />
                    }
                }
            }
        />
    )
}

/**
 * Crea una ruta admitida solo para usuarios que no están logueados
 * @param  {Component}  options.component: Component   Componente que se debe renderizar si el usuario no está autenticado
 * @param  {object}     options.rest                   Contiene todos los atributos enviados
 * @return {Component}                                 Si el usuario no está autenticado retorna el componente enviado
 *                                                     de lo contrario redirecciona a la ruta almacenada en redirect_auth
 */
const GuestRoute = ({component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render={
                (props) => {
                    /* Si no esta autenticado abre el componente, sino redirecciona */                    
                    return !store.getState().app.user_auth
                    ? <Component {...props} />
                    : <Redirect to={{
                        pathname: store.getState().app.user.is_client == 1?redirect_auth_client:(store.getState().app.user.is_trader == 1?redirect_auth_trader:(store.getState().app.user.is_client_server == 1?redirect_auth_client_server:redirect_auth)), 
                        state: {from: props.location}
                    }} />
                }
            }
        />
    )
}

/**
 * Crea una ruta que es admitida para cualquier usuario
 * @param  {Component}  options.component: Component  Componente a renderizar
 * @param  {object}     options.rest       Contiene todos los atributos enviados
 * @return {Component}                     Retorna el componente enviado
 */
const FreeRoute = ({component: Component, ...rest}) => {
    return (
        <Route
            {...rest}
            render={
                (props) => {
                    return  <Component {...props} />
                }
            }
        />
    )
}

class Routes extends Component 
{
    constructor(props)
    {
        super(props);

        //se almacena el valor del estado de app en el estado local
        //para saber cuando se inicia o cierra sesión y restringir o habilitar el acceso a las rutas
        this.state = {
            app:props.store.getState().app,
            session_state_identified:false
        }

        //cuando se inicie o cierre la sesion se actualiza el state local con el store
        props.store.subscribe(() => {
            this.setState((oldState, props) => {
                return {
                    app:props.store.getState().app
                }
            })
        });

        this.syncUserAuth = this.syncUserAuth.bind(this);
    }

    componentDidMount() {
        this.syncUserAuth();
    }

    /**
     * Valida si se puede realizar una petición a una url con autenticción
     * si se obtiene una respuesta entonces existe un usuario logueado y se asigna
     */
    syncUserAuth(){
        axios.get(params.URL+'/user')
        .then((response) => {
            store.dispatch({
                type:types.LOGIN,
                user:response.data
            });

            this.setState({session_state_identified:true});
        })
        .catch((error) => {
            store.dispatch({
                type:types.LOGOUT
            });
            this.setState({session_state_identified:true});
            //console.log(error.response.data);
        });
    }
    
    render ()
    {
        const { app, session_state_identified } = this.state;

        if(session_state_identified){

            let menu = "";

            const switch_options = <Switch>
                            <GuestRoute exact path={config_routes.home.path} component={Home} />
                            <GuestRoute exact path={config_routes.login.path} component={Login} />
                            <GuestRoute exact path={config_routes.register.path} component={Register} />

                            <AuthRoute userType='client' exact path={config_routes.welcome.path} component={Welcome} />
                            <AuthRoute userType='client' exact path={config_routes.guide.path} component={Guide} />
                            <AuthRoute exact path={config_routes.email_verification.path} component={EmailVerification} />

                            <AuthRoute userType='client' exact path={config_routes.performance.path} component={Performance} />
                            <AuthRoute userType='client' exact path={config_routes.commission.path} component={Commission} />
                            <AuthRoute userType='client' exact path={config_routes.service.path} component={Product} /> 
                            <AuthRoute userType='client' exact path={config_routes.service_buy.path} component={Buy} /> 
                            <AuthRoute userType='client' exact path={config_routes.process_payment.path} component={ProcessPayment} /> 
                            <AuthRoute userType='client' exact path={config_routes.license.path} component={License} /> 
                            <AuthRoute exact path={config_routes.setting.path} component={Setting} /> 
                            <AuthRoute userType='client' exact path={config_routes.communication.path} component={Communication} /> 
                            
                            <FreeRoute exact path={config_routes.terms_and_conditions.path} component={TermsAndConditions} /> 
                            <FreeRoute exact path={config_routes.privacy_policy.path} component={PrivacyPolicy} /> 
                            <FreeRoute exact path={config_routes.cookies_policy.path} component={CookiesPolicy} /> 

                            <FreeRoute component={E404} />
                        </Switch>;

            let switch_element = <div>
                            {switch_options}
                    </div>
            //Si el usuario está autenticado y no es la vista de bienvenida y el usuario ya validó el correo
            if((app.user_auth && !getCookie('welcome') && store.getState().app.user.email_verified_at) 
                || (app.user && (app.user.is_trader == 1 || app.user.is_client_server == 1))){
                menu =  <Menu/>

                switch_element = <div className="content-with-menu">
                            {switch_options}
                            <Footer/>
                    </div>
            }

            return <BrowserRouter>
                    {menu}
                    {switch_element}
                    <SetLang/>
                    <Notifications/>
                    <CookiesPolicyComponent/>
            </BrowserRouter>;  
        }else{
            return (
                <Segment>
                    <Dimmer active inverted basic="true" style={{position:'fixed', width:'100%', height:'100%'}}>
                        <Loader inverted>Loading</Loader>
                    </Dimmer>
                </Segment>
            )
        }
    }
}

export default Routes;
