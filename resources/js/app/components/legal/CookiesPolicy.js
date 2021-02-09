import React, { Component } from 'react';

import { Grid, Header, Segment } from 'semantic-ui-react';

import Information from '../Information';

class CookiesPolicy extends Component {

    constructor(props) {
        super(props);
    }

    render() {
    	let contract = <Grid centered>
    		<Grid.Column computer='12' tablet='14' mobile='15'>
				<Header as='h3'>¿Qué son las Cookies?</Header>
    			<p className='justify'>Una cookie es un pequeño fichero de letras y cifras que se almacena en el navegador del usuario al acceder a determinadas páginas web.</p>
    			<p className='justify'>Las cookies pueden ser de “sesión” que se eliminaran al terminar la sesión con el sitio web, o “persistentes” que permanecerán en su ordenador durante un periodo de tiempo determinado definido por el responsable de la cookie.</p>
    			<p className='justify'>Asimismo las cookies pueden ser propias cuando se gestionen en el dominio al que accede el usuario para solicitar el servicio, o de terceros, que serán enviadas al equipo del usuario desde un dominio diferente a aquel al que accedió.</p>

				<Header as='h3'>¿Qué tipo de Cookies utiliza este sistema web?</Header>
    			<p className='justify'>Esta web almacena tanto cookies propias como de terceros con el objetivo de adaptar los contenidos a sus intereses y facilitar su navegación.</p>

				<Header as='h3'>Cookies propias</Header>
    			<p className='justify'><b>Cookies Técnicas:</b> Tienen el objetivo de controlar el tráfico y la comunicación correcta de datos, mantener la configuración, identificar sesiones de navegación (que los servidores reconozcan, a pesar de pasar de una página a otra, que se trata de la misma sesión de navegación de un usuario), acceder a partes de acceso restringido, utilizar elementos de seguridad durante la navegación. Sin ellas, la navegación no sería coherente.</p>
    			<p className='justify'><b>Cookies funcionales:</b> Son aquellas que registran información sobre opciones del usuario permitiendo adaptar el sitio web (prefencias de idioma, navegador a través del que se accede al servicio, configuración regional, etc.). Estas cookies son de sesión y persistentes.</p>

				<Header as='h3'>Cookies de terceros</Header>
    			<p className='justify word-break-all'>El presente sitio web recoge información estadística del usuario mediante el almacenamiento de cookies en el disco duro del visitante. Para recabar dicha información y someterla a un tratamiento estadístico para TrSoft, se utilizan los servicios de Google Analytics; ello implica que la recogida y almacenamiento de la indicada información (en adelante, los procedimientos) se realiza mediante “cookies” directamente entre el navegador del usuario y el servidor de Google Analytics. Cuando el usuario se conecte nuevamente con el presente website, el citado servidor reconocerá el número almacenado en “cookie”, según se ha indicado, suministrando la información anónima referida. Los procedimientos están gestionados y controlados exclusivamente por Google Analytics.Si desea conocer la declaración de privacidad y políticas de privacidad y cookies de Google Analytics puede hacerlo en esta dirección <a href='https://support.google.com/analytics/answer/6004245?hl=es' target='_blank'>https://support.google.com/analytics/answer/6004245?hl=es</a></p>
				
				<Header as='h3'>Cookies susceptibles de identificar al usuario</Header>
    			<p className='justify'>Esta página web utiliza cookies de análisis de terceros que guardan datos susceptibles de identificar al usuario, como pudiera ser la dirección IP del terminal del usuario que hace la visita.</p>
    			<p className='justify'>No obstante, en el caso de las cookies de este sitio web estos datos no se utilizan para identificar al usuario. Únicamente se almacenan de forma agregada y anónima, con el propósito de realizar análisis estrictamente estadísicos sobre el número de visitantes y los contenidos más visitados, y así mejorar el sitio web y aumentar la efectividad de su presencia online.</p>

				<Header as='h3'>¿Cómo puedo revocar el consentimiento para el uso de cookies? ¿cómo puedo desactivar las cookies?</Header>
    			<p className='justify'>El usuario puede en cualquier momento revocar el consentimiento para el uso de cookies mediante su desactivación o borrado, a través de las opciones de privacidad/seguridad de su navegador.</p>
    			<p className='justify'>Para más información, le recomendamos que consulte la ayuda que su navegador le ofrece para gestionar las cookies:</p>
    			<ul>
    				<li className='word-break-all'><b>Internet Explorer</b> (<a href='http://windows.microsoft.com/es-es/windows-vista/block-or-allow-cookies' target='_blank'>http://windows.microsoft.com/es-es/windows-vista/block-or-allow-cookies</a>)</li>
    				<li className='word-break-all'><b>Mozilla Firefox</b> (<a href='http://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-que-los-sitios-we' target='_blank'>http://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-que-los-sitios-we</a>)</li>
    				<li className='word-break-all'><b>Google Chrome</b> (<a href='https://support.google.com/chrome/answer/95647?hl=es' target='_blank'>https://support.google.com/chrome/answer/95647?hl=es</a>)</li>
    				<li className='word-break-all'><b>Safari</b> (<a href='http://support.apple.com/kb/HT1677?viewlocale=es_ES' target='_blank'>http://support.apple.com/kb/HT1677?viewlocale=es_ES</a>)</li>
    			</ul>
    			<p className='justify'>Si usted borra o desactiva las cookies, es posible que algunas funciones del presente sitio web no estén disponibles para su utilización o que su funcionamiento no sea óptimo.</p>

    			<p className='text-right color-grey-text'><i>Última actualización: 06-04-2020</i></p>
    		</Grid.Column>
    	</Grid>

        return (
            <Information title='Política de Cookies' content={contract}/>
        );
    }
}

export default CookiesPolicy;
