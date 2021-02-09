import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Routes from './Routes';
import axios from 'axios';
import { FullLoader } from './components/helpers/Helpers';
import { Provider } from 'react-redux';
import store from './redux/store';
import { Segment } from 'semantic-ui-react';
import './i18n/i18n';

export default class App extends Component {
    constructor(props)
    {
        super(props);

        //se interceptan todas las peticiones http realizadas
        axios.interceptors.response.use(function (response) {
            // Do something with response data
            return response;
          }, function (error) {
            //si el error retornado es de un usuario no autorizado
            //se cierra la sesión
            //if(error.response && error.response.status == 401)
                //store.dispatch(actLogout());
            
            return Promise.reject(error);            
          });
    }

    render() 
    {
        return (
            <Segment style={{padding:"0px"}} basic={true}>
                <Provider store={store}>
                    <Routes store={store}/>
                    <FullLoader/>
                </Provider>
            </Segment>
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
