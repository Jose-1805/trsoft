//const wsHost = "127.0.0.1";
//const wsHost = "www.app.trsoft-company.com";
const wsHost = "trsoft-company.uc.r.appspot.com/";
//const wsHost = "192.168.43.190";

//Dominio de coneccion a servidor
//const domain_server = "http://"+wsHost+":8000";
const domain_server = "https://"+wsHost;

const wsPort = 6001;
//Websocket de conección a servidor
let echo = null;

/**
* Conexión a websocket de servidor
*/
function connectToTrsoft(){        
    console.log('Conectando a TrSoft...');
    echo = new window.Echo({
        broadcaster: 'pusher',
        key: '6a8a1ffa04842c0d4e84117c26fa5ffc',
        //cluster: process.env.MIX_PUSHER_APP_CLUSTER,

        wsHost: wsHost,
        wsPort: wsPort,
        wssHost: wsHost,
        wssPort: wsPort,

        disableStats: true,
        enabledTransports: ['ws', 'wss'],
        encrypted: true,

        authEndpoint:domain_server+'/broadcasting/auth'
    });


    echo.private('binary-copy').subscription.bind('pusher:subscription_succeeded', () => {
        console.log('TrSoft', 'Suscrito a TrSoft COPY BINARY');
    });

    echo.private('binary-copy').subscription.bind('pusher:subscription_error', (status) => {
        console.log('TrSoft', 'Error suscribiendose a TrSoft COPY BINARY');
    });

    echo.connector.pusher.connection.bind('state_change', function(states) {
        //console.log("STATE CHANGE::", states);
    })

    echo.connector.pusher.connection.bind('error', function(err) {
        console.log('TrSoft', 'ERROR CONECTANDO', err);
    })

    echo.connector.pusher.connection.bind('connected', function() {
        console.log('TrSoft', 'Conectado a TrSoft COPY BINARY');
    })

    echo.connector.pusher.connection.bind('disconnected', function() {
        console.log('TrSoft', 'Desconectado de TrSoft COPY BINARY');
    })  

    echo.private('binary-copy')
    .listenForWhisper('startOption', (data) => {
        startOperation(data);
    })
    .listen('EventsCopyBinary', (data) => {
        switch (data.event){
            //Si la cuenta de un usuario ha generado una comisión
            case 'commission_generated':
                console.log('TrSoft', 'Comisión generada para: '+data.data.user_id);
                disconnectUserConnectedToIqoption(data.data.user_id);
                break;
            //Cuando la configuración del proucto de un usuario es actualizada
            case 'updated_user_settings':
                let settings = data.data;
                //Si el producto sigue activo
                if(settings.is_active == 1){
                    users_copy_binary[settings.user_id] = settings;
                    //Se establece la conexión al websocket si es necesario
                    connectUserToIqOption(settings.user_id);
                }else{
                    console.log('TrSoft', 'Usuario desconectado por configuración o vencimiento de licencia con comisión: '+settings.user_id);
                    disconnectUserConnectedToIqoption(settings.user_id);
                }
                break;
            //Si la cuenta de un usuario alcanzó el stop loss
            case 'stop_loss_reached':
                console.log('TrSoft', 'Stop loss alcanzado para: '+data.data.user_id);
                disconnectUserConnectedToIqoption(data.data.user_id);
                break;
        }
    });        
}

function closeTrSoftConnection(){
    if(echo)
        echo.disconnect();
}
