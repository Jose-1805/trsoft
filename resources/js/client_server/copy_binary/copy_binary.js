//Servidor de TrSoft
//let server_url = 'https://www.app.trsoft-company.com/api/';
let server_url = 'https://trsoft-company.uc.r.appspot.com/api/';
//Usuarios con los que se realizan las operaciones
let users_copy_binary = {};
//Información de los usuarios consultada en el broker
let broker_users_data = {};
//Información de los activos disponibles para cada ususario
let broker_actives_data = {};
//Conexiones websocket de cada usuario al broker
let websockets = {};
//Identificadores de intervalo encargado de la sincronización de
//la información de los activos
let ids_interval = {};
//Operaciones realizadas por cada usuario. Se almacena cada entrada 
//cuando se envía y se elimina cuando se confirma que se ejecutó
let operations = {};
//Operaciones abiertas para casa usuario
let current_operations = {};

/**
 * Obtiene los usuarios que pueden conectarse para el producto copy binary
 */
function getUsersForCopyBinary(callback = null) {
    console.log('Obteniendo usuarios...');
	fetch(server_url+'clients-for-start-copy-binary', {method:'POST'}).then((res) => {
		if(res.status == 200){
			res.json().then((data) => {
				users_copy_binary = data;

                if(typeof callback == 'function')
                    callback();
			});
		}
	})
}

/**
 * Conecta los usuarios al websocket de IqOption
 */
function connectUsersToIqOption(callback = null) {
    console.log('Conectando usuarios a IqOption...');
	for(key in users_copy_binary){
		connectUserToIqOption(key);
	}	

    if(typeof callback == 'function')
        callback();
}

/**
 * Conecta un usuario al websocket de IqOption
 */
function connectUserToIqOption(key) {
	//Si no se encuentra conectado
	if(!websockets[key]){
		websockets[key] = null;

		(websockets[key] = new WebSocket("wss://iqoption.com/echo/websocket")).onopen = function(e) {
	        websockets[e.target.user_id].send('{"name":"ssid","msg":"'+users_copy_binary[e.target.user_id].ssid+'"}');
	        fetch(server_url+"start-trading/"+e.target.user_id);
	        //Cada 15 segundos se sincronizan los datos 
	        //de los activos disponibles para el usuario
        	ids_interval[e.target.user_id] = setInterval(() => {
        		if(websockets[e.target.user_id]){
	        		requestSyncDataBroker(e.target.user_id);
	        	}else{
	        		//Si no existe el websocket pero 
	        		//si hay un identificador de intervalo
	        		if(ids_interval[e.target.user_id]){
	        			clearInterval(ids_interval[e.target.user_id]);
	        			delete ids_interval[e.target.user_id];
	        		}
	        	}
        	}, 15000);	        
	    }

        //Se relaciona el websocket con el usuario
        websockets[key].user_id = key;
		    
	    websockets[key].onmessage = function(e) {
        	if(e.data){
                let data = JSON.parse(e.data);
                //Se reciben datos de los activos
                if(data.name == 'api_option_init_all_result'){
                    if(data.msg.isSuccessful){
                        let actives = {};
                        //Se recorren todos los activos turbo
                        for(var i in data.msg.result.turbo.actives){
                            //Si el activo esta habilitado
                            if(data.msg.result.turbo.actives[i].enabled){
                                //Se agrega el activo
                                actives[data.msg.result.turbo.actives[i].id] = {
                                    id: data.msg.result.turbo.actives[i].id,
                                    image: data.msg.result.turbo.actives[i].image,
                                    description: data.msg.result.turbo.actives[i].description,
                                    enabled: data.msg.result.turbo.actives[i].enabled,
                                    option:{
                                        profit:data.msg.result.turbo.actives[i].option.profit
                                        //bet_close_time:data.msg.result.turbo.actives[i].option.bet_close_time,
                                    }
                                }
                            }
                        }

                       	broker_actives_data[e.target.user_id] = actives;
                    }
                }else if(data.name == "profile"){//Se obtienen datos del usuario desde el broker
                	data_user = data.msg;
                	for(key in data_user.balances){
                		//Cuenta real
                		if(data_user.balances[key].type == 1){
                			data_user.balance_real_id = data_user.balances[key].id;
                		}
                		else if(data_user.balances[key].type == 4){
                			data_user.balance_practice_id = data_user.balances[key].id;
                		}
                	}
                    broker_users_data[e.target.user_id] = data_user;
                }else if(data.name == "socket-option-opened"){//Una operación se inició
                    //Si existen operaciones registradas para el usuario
                    if(operations[e.target.user_id]){
                        let data_server = null;
                        let index_data = null;
                        let data_operation = null;

                        //Se recorren todas las operaciones registradas para el usuario
                        for(var i = 0; i < operations[e.target.user_id].length; i++){
                            //Si la operación del indice actual corresponde
                            //a la operación de los datos de evento enviados
                            if(
                                //Mismo activo
                                operations[e.target.user_id][i].active_id == data.msg.active_id
                                //Misma fecha de expiración
                                && operations[e.target.user_id][i].expiration_time == data.msg.expired
                                //Misma dirección
                                && (
                                    (
                                        operations[e.target.user_id][i].direction == 1
                                        && data.msg.dir == 'call'
                                    )
                                    || (
                                        operations[e.target.user_id][i].direction == -1
                                        && data.msg.dir == 'put'
                                    )
                                )
                            ){
                                data_server = operations[e.target.user_id][i];
                                data_operation = {
                                    amount: operations[e.target.user_id][i].amount,
                                    profit_percentage: operations[e.target.user_id][i].profit_percentage,
                                };
                                //Se almcena el indice para eliminar el elemento más adelante
                                index_data = i;
                                break;
                            }
                        }

                        //Si se encontró la operación en el la lista de operaciones del usuario
                        if(data_server){
                            data_server.user_id = e.target.user_id;
                            data_server.option_broker_id = data.msg.id;
                            data_operation.option_broker_id = data.msg.id;
                            data_server.expiration_time = data_server.expiration_time_utc;

                            //Se envían los datos al servidor
                            fetch(server_url+"option-client", {
                                method: 'POST',
                                body: JSON.stringify(data_server),
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                },
                            })

                            if(!current_operations[e.target.user_id]){
                            	current_operations[e.target.user_id] = [];
                            }
                   			//Se agrega la operación a la lista de operaciones actuales
                            current_operations[e.target.user_id].push(data_operation);

                            //Se borra el registro de operations debido a que solo se utiliza
                            //para identificar cuando una nueva operación ha sido realizada enviada
                            //desde el computador actual. Así si llega una nueva operación identica
                            //a la actual no se tiene en cuenta porque ya ha sido eliminada del registro
                            operations[e.target.user_id].splice(index_data,1);
                        }
                    }
                }else if(data.name == "socket-option-closed"){//Una operación ha cerrado
                    //Datos para enviar al servidor
                    let params_server = {
                        user_id: e.target.user_id,
                        option_broker_id: data.msg.id,
                        result: data.msg.win == 'loose'?-1:(data.msg.win == 'win'?1:0),
                        is_demo:data.msg.is_demo?1:-1
                    }

                    //Se envían los datos al servidor
                    fetch(server_url+"update-option-client", {
                        method: 'POST',
                        body: JSON.stringify(params_server),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                    });   

                    //Se busca la operación en las operaciones actuales
                    if(current_operations[e.target.user_id]){
                        //Se recorren todas las operaciones actuales
                        for(var i = 0; i < current_operations[e.target.user_id].length; i++){
                            if(current_operations[e.target.user_id][i].option_broker_id == data.msg.id){
                                current_operations[e.target.user_id].splice(i,1);                                
                                break;
                            }
                        }
                    }         
                }else if(data.name = "option-rejected" && data.msg.reason == "no_money"){
                    console.log('Session closed due to insufficient balance in your account --- '+e.target.user_id);
                }else if(data.name != "timeSync" && data.name != "heartbeat"){
                    //console.log(data.name, data);
                }
            }
	    }

	    websockets[key].onerror = function(e) {
	        console.log("ERROR CONECTANDO USUARIO: "+ e.target.user_id)
	    }
	}
}

/**
 * Desconecta a un usuario del websocket
 */
function disconnectUserConnectedToIqoption(user_id) {
	//Si se encuentra conectado
	if(websockets[user_id]){
		websockets[user_id].close();

        setTimeout(function(){
            delete websockets[user_id];
            delete broker_users_data[user_id];
            delete broker_actives_data[user_id];
            delete users_copy_binary[user_id];
            fetch(server_url+"stop-trading/"+user_id);  
        }, 2000);
	}
}

/**
 * Desconecta a todos los usuarios conectados al websocket de iq option
 */
function disconnectUsersConnectedToIqoption() {
	for(key in websockets){
		disconnectUserConnectedToIqoption(key);
	}	
}

/**
 * Solicita información de los activos para sincronizarlos 
 * con los datos almacenados localmente
 */
function requestSyncDataBroker(user_id){
    if(websockets[user_id]){
        websockets[user_id].send('{"msg":"","name":"api_option_init_all"}');
    }
}

function startOperation(data) {
	for(key in websockets){
		if(broker_actives_data[key]){
			let active = broker_actives_data[key][data.active_id];
			//Existe el activo seleccionado por el trader
			if(active && active.enabled){
			    let profit_percent = 100 - active.option.profit.commission;
			    let amount_send = parseFloat(users_copy_binary[key].amount);
			    //Si permite el inncremento del importe
			    if(users_copy_binary[key].allow_increment == 1){
			        amount_send *= parseFloat(data.increase);
			    }

                stop_loss_reached = false;
                if(users_copy_binary[key].stop_loss == 1){
                    //Limite de perdida, inicialmente se es (stop_loss_value * -1)
                    //para establecer el limite de un stop loss no dinamico
                    limit_balance = (users_copy_binary[key].stop_loss_value?users_copy_binary[key].stop_loss_value:0) * -1;

                    //Si el stop loss es dinamico se corre el limite actual
                    //hasta estar al limite del valor más alto alcanzado en el saldo
                    if(users_copy_binary[key].dynamic_stop_loss == 1)
                        limit_balance += users_copy_binary[key].higher_balance;


                    //El stop loss es sobrepasado con la operación actual
                    if((users_copy_binary[key].current_balance - amount_send) < limit_balance)
                        stop_loss_reached = true;

                    //Si el stop loss es sobrepasado con la operación actual pero el valor
                    //de la operación se puede reducir 
                    if(stop_loss_reached && data.increase > 1){
                        amount_send = parseFloat(users_copy_binary[key].amount);
                        //El stop loss NO sobrepasado con la operación minima
                        if((users_copy_binary[key].current_balance - amount_send) >= limit_balance)
                            stop_loss_reached = false;
                    }
                }

                if(!stop_loss_reached){
    			  	//SI el usuario no tiene operaciones abiertas
    			    if(!current_operations[key] || (current_operations[key] && current_operations[key].length == 0)){
    			        websockets[key].send('{"name":"sendMessage","msg":{"name":"binary-options.open-option","version":"1.0","body":{"user_balance_id":'+broker_users_data[key][users_copy_binary[key].use_practice_account == 1?'balance_practice_id':'balance_real_id']+',"active_id":'+active.id+',"option_type_id":3,"direction":"'+data.direction+'","expired":'+data.expiration+',"refund_value":0,"price":'+amount_send+',"value":0,"profit_percent":'+profit_percent+'}}}');

    			        let params_server = {
    			            active_id: active.id,
    			            active_name: active.description.split('.')[1],
    			            active_image: "https://static.cdnpub.info/files"+active.image,
    			            expiration_time: data.expiration,
    			            expiration_time_utc: data.expiration_utc,
    			            direction:data.direction == 'call'?1:-1,
    			            amount:amount_send,
    			            profit_percentage:profit_percent,
    			            trader:data.trader
    			        }

    			        if(!operations[key]){
    			        	operations[key] = [];
    			        }

    			        operations[key].push(params_server);
    			    }
                }else{
                    //Si se alcanza el stop loss, la conexión se cierra para el usuario
                    console.log('Stop loss alcanzado para: '+key);
                    disconnectUserConnectedToIqoption(key);
                }
			} 
		}
	}
}

function startSession(){
    console.log('Iniciando la sesión...');
    getUsersForCopyBinary(() => {
        connectUsersToIqOption(() => {
            connectToTrsoft();
        })
    })   
}

function endSession() {
    console.log('Finalizando sesión...');
    disconnectUsersConnectedToIqoption();
    closeTrSoftConnection();
    console.log('Sesión finalizada')
}