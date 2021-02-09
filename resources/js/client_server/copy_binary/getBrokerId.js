let data_print = [];
/**
 * Obtiene el id de un usuario en el broker con su SSID
 */
function getIdUserBroker(ssid, id) {

	(ws = new WebSocket("wss://iqoption.com/echo/websocket")).onopen = function(e) {
        ws.send('{"name":"ssid","msg":"'+ssid+'"}');     
    }
	    
    ws.onmessage = function(e) {
    	if(e.data){
            let data = JSON.parse(e.data);
            //Se reciben datos de los activos
            if(data.name == "profile"){//Se obtienen datos del usuario desde el broker
            	console.log('OK ', data);
            	data_print.push("UPDATE users SET broker_id = "+data.msg.user_id+" WHERE id = "+id+";");
            	ws.close();
            	delete ws;
            }
        }
    }

    ws.onerror = function(e) {
        console.log("ERROR CONECTANDO USUARIO", e)
    }
}

function printQueries(){
	for(i = 0;i < data_print.length;i++){
		console.log(data_print[i]);
	}
}

getIdUserBroker('d23a3139b4e73bea5080101a3e49cbbb', 92);
getIdUserBroker('95401f2032502d0006de2c0d8700900b', 93);
getIdUserBroker('7692cfc7298c849279bddfc1607a4baf', 94);
getIdUserBroker('a46316bbfe26e2a3aa0fa2972382a959', 95);
getIdUserBroker('5baad5dbb899b561b56dff1fef55e222', 105);
getIdUserBroker('dd5fae5693e59d84578a6267fe19448f', 106);
getIdUserBroker('64a85ef12f0df383a04351f99a3bb565', 108);
getIdUserBroker('c0f9c447bc09c957c615bec02eee5aed', 112);
getIdUserBroker('4256e1312a95d6230b165fcc3c25c196', 114);
getIdUserBroker('f8ad40de22258d39ad54d8b82ce47529', 116);
getIdUserBroker('cc095a3b20526b40c91ed9402c84f23d', 119);
getIdUserBroker('93d2616b2be5b949e032fed8cbd5af80', 121);
getIdUserBroker('eabfba48c2ba71b037dcb3f60e3473b9', 123);
getIdUserBroker('ddac2e5d262db66c6499a21dcf3c6d07', 124);

UPDATE users SET broker_id = 47421726 WHERE id = 92;
UPDATE users SET broker_id = 42421649 WHERE id = 93;
UPDATE users SET broker_id = 69000458 WHERE id = 94;
UPDATE users SET broker_id = 65695645 WHERE id = 95;
UPDATE users SET broker_id = 69370131 WHERE id = 105;
UPDATE users SET broker_id = 32490864 WHERE id = 106;
UPDATE users SET broker_id = 60406207 WHERE id = 108;
UPDATE users SET broker_id = 23302674 WHERE id = 112;
UPDATE users SET broker_id = 61496447 WHERE id = 114;
UPDATE users SET broker_id = 65790316 WHERE id = 116;
UPDATE users SET broker_id = 69690959 WHERE id = 119;
UPDATE users SET broker_id = 67438669 WHERE id = 121;
UPDATE users SET broker_id = 2251383 WHERE id = 123;
UPDATE users SET broker_id = 59030887 WHERE id = 124;