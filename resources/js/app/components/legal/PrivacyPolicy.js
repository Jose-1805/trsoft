import React, { Component } from 'react';

import { Grid, Header, Segment } from 'semantic-ui-react';

import Information from '../Information';

class PrivacyPolicy extends Component {

    constructor(props) {
        super(props);
    }

    render() {
    	let contract = <Grid centered>
    		<Grid.Column computer='12' tablet='14' mobile='15'>

    			<p className='justify'>TrSoft (nombre utilizado para efectos comerciales y publicitarios de la persona natural Jose Luis Capote Mosquera Nit. 1061758953-0. En adelante denominado <b>"La Empresa"</b>) respeta su privacidad y se compromete a proteger sus datos personales. Esta política de privacidad tiene le proporciona la información necesaria en relación a cómo recopilamos y procesamos los datos personales, al igual que en lo relativo al tratamiento que damos a sus datos personales cuando utilice nuestros porductos software, a efectos de informarle sobre sus derechos de privacidad y sobre cómo le protege la ley. En otras palabras, se refiere a la información sobre un Cliente (tal y como se define a continuación) el cual es una persona física y sobre cuya base se pueda identificar a dicho Cliente (lo cual se considerará de ahora en adelante como los datos) de conformidad con la legislación de protección de datos que sea aplicable y con la aplicación de las mejores prácticas posibles.</p>
    			<p className='justify'>Cuando recopilemos o procesemos sus datos, es importante que lea esta política de privacidad, así como cualquier otra política de privacidad que podamos proporcionar en determinados momentos, a efectos de que pueda conocer cómo, y para que utilizamos sus datos.</p>

    			<Header as='h3'>Uso de datos</Header>
    			<p className='justify'>Podemos recopilar, usar, almacenar y transferir diferentes tipos de datos sobre usted, los cuales hemos agrupado de la siguiente manera:</p>
    			<ul>
    				<li>Datos de identidad, los cuales incluyen nombre, apellido y número de documento de identificación personal, fecha de nacimiento y una fotografía.</li>
    				<li>Datos de contacto, los cuales incluyen la dirección de correo electrónico y el número de teléfono celular.</li>
    				<li>Los datos de transacciones incluyen los detalles pertinentes sobre los pagos de licencias y comisiones, al historial de las inversiones realizadas a través de la empresa, al historial de inversiones realizadas en el broker, a las ganancias, a los saldos, así como cualesquiera otras circunstancias que estén relacionadas con los servicios que haya utilizado a través de nuestro sistema.</li>
    				<li>Los datos técnicos incluyen la dirección del protocolo de internet (IP), sus datos de inicio de sesión, el tipo y la versión del navegador, la configuración y la ubicación de la zona horaria, el tipo y versiones de los complementos del navegador, el sistema operativo y la plataforma, datos de software de terceros utilizados para el correcto funcionamiento de nuestros sistemas, así como otras tecnologías en los dispositivos que use para acceder a los servicios de la empresa, al igual que lo relativo al uso que se da a las cookies que están almacenadas en su dispositivo.</li>
    				<li>Los datos del perfil incluyen los detalles correspondientes a la cuenta, el nombre de usuario y la contraseña, las transacciones que ha realizado, sus preferencias, sus comentarios y/o la información que hemos recibido a través de su interacción con los sistemas informáticos de la empresa.</li>
    				<li>Los datos de uso incluyen información con respecto a cómo utiliza el sitio web, los servicios, la fecha de registro y confirmación de correo correspondiente, el número de las quejas, el número de las solicitudes que ha presentado y el historial de la IP.</li>
    				<li>Los datos de marketing y comunicación incluyen sus preferencias en lo relativo a la publicidad que le enviamos, así como sus preferencias de comunicación.</li>
    				<li>Los datos de la ubicación incluyen los detalles con respecto a su ubicación real cuando interactúa con nuestros servicios (por ejemplo, el conjunto de parámetros que determinan la configuración regional de su interfaz, es decir, el país de residencia, la zona horaria y el idioma de la interfaz).</li>
    				<li>Los datos de audio incluyen las grabaciones de voz completas con respecto a las llamadas que recibe de nosotros o que usted nos hace. (lo anteriormente mencionado se denominará colectivamente como los datos personales)</li>
    			</ul>

    			<p className='justify'>Los datos agregados incluyen los datos estadísticos o demográficos en relación a cualquier propósito. Dichos datos pueden derivarse de sus datos, aunque por ley, podrían no ser considerados como datos personales, ya que no revelan su identidad directa o indirectamente. Un ejemplo de dichos datos agregados podría ser que agreguemos sus datos de uso para calcular el valor las utilidades generadas por la empresa en un rango de fechas. No obstante lo anterior, si la empresa combinase los datos agregados con otros datos, de forma tal que el resultado final pudiere de alguna manera identificar al sujeto de dichos datos, la tratará los ya mencionados datos combinados como aquellos datos que deberán ser tratados según las disposiciones que aquí se indican.</p>
    			<p className='justify'>El proceso de sus datos se lleva a cabo por la empresa de conformidad con las bases de la legalidad, la imparcialidad, y la transparencia, respetando siempre el propósito del proceso de los datos y el principio para la minimización de éstos, al igual que su precisión y su almacenamiento limitado, así como su integridad, confidencialidad y responsabilidad.</p>
    			<p className='justify'>El cliente reconoce que la empresa almacenará los datos relativos a la cuenta del cliente, así como en lo que respecta a las transacciones que estuvieren relacionadas, en caso de ocurrir una disputa entre el cliente y la compañía.</p>
    			<p className='justify'>El cliente será el responsable de actualizar cualquier información que se nos proporcione en caso de que ocurriese cualquier cambio. Aunque nos esforzaremos por mantener sus datos actualizados, así como en revisar e inspeccionar toda la información que nos haya proporcionado, es posible que no siempre podamos hacerlo sin su ayuda. El cliente reconoce que la empresa no tiene ni compromiso ni responsabilidad alguna con el cliente en lo que respecta a cualquier revisión o inspección de la información ya mencionada anteriormente.</p>

    			<Header as='h3'>¿Cómo se recolectan sus datos personales?</Header>
    			<p className='justify'>Los únicos mecanismos utilizados para la recolección de sus datos personales son el registro que usted realiza en <a href='https://www.trsoft-company.com/register' target='_blank'>www.trsoft-company.com/register</a>, la configuración de sus datos personales, datos de acceso y preferencias, los cuales puede realizar únicamene cuando a iniciado sesión en el sistema o cuando a solicita el restablecimiento de su contraseña de ingreso y los datos enviados de forma automática a nuestros sistema cada vez que utiliza cualquiera de nuestros servicios.</p>
    			<p className='justify'>Requerimos recopilar los datos anteriores a efectos de poder proporcionarle nuestros servicios de manera eficiente y poder cumplir en la actualidad con nuestras obligaciones legales y reguladoras.</p>
    			<p className='justify'>Si no proporciona los datos cuando se le soliciten, es posible que no podamos llevar a cabo el contrato que tengamos, o que intentemos celebrar con usted (por ejemplo, para proporcionarle nuestros servicios). En este caso, es posible que tengamos que cancelar un servicio que tenga con nosotros, no obstante le notificaremos si este fuere el caso en dicho momento. Es importante que la información que tengamos sobre usted sea precisa y actual. Por favor, manténganos informados si sus datos han cambiado durante el transcurso de su relación con nosotros.</p>
    			<p className='justify'>Tecnologías automáticas o interacciones. Al utilizar nuestros servicios, cuando su dispositivo nos transmita automáticamente sus características técnicas. Lugar (un conjunto de parámetros que determinan la configuración regional de su interfaz, es decir, el país de residencia, la zona horaria y el idioma de la interfaz) y que se utiliza a efectos de poder proporcionarle el mejor servicio posible dentro de nuestros sistemas informáticos. El uso de la información sobre su dirección IP, los archivos de las cookies, la información sobre el navegador y el sistema operativo que está utilizando, la fecha y la hora a la que ha accedido al sistema, así como a las direcciones de las páginas solicitadas, nos permitirá proporcionarle una funcionalidad óptima en nuestros sistemas informáticos, así como controlar su comportamiento a efectos de mejorar la eficiencia y la usabilidad de nuestros sistemas.</p>

    			<Header as='h3'>Retención de los datos</Header>
    			<p className='justify'>Almacenamos sus datos durante el tiempo que sea razonablemente necesario a efectos de cumplir con los fines para los cuales los recogimos, incluyendo los propósitos necesarios para poder cumplir con los requisitos legales, reguladores, fiscales, contables o con respecto a los requisitos de información. Podremos conservar sus datos personales durante un período más largo en caso de haber una queja, o bien si creemos razonablemente que existiere la posibilidad de que acontezca un litigio en lo relativo a nuestra relación con usted.</p>

    			<Header as='h3'>Seguridad de los datos</Header>
    			<p className='justify'>Hemos implementado las medidas de seguridad adecuadas a efectos de evitar que sus datos se pierdan accidentalmente, o bien a que se utilicen o se acceda a ellos de forma no autorizada, y a impedir igualmente que sean modificados o divulgados. Igualmente, hemos limitado el acceso a sus datos a aquellos empleados, agentes, contratistas y a otros terceros que tengan la necesidad comercial de conocerlos. Solo procesarán sus datos conforme a nuestras instrucciones, al igual que están obligados a cumplir su deber con respecto a la confidencialidad.</p>
    			<p className='justify'>Su ayuda siempre resultará valiosa a efectos de garantizar que sus datos se mantengan con la correspondiente seguridad. Al registrarse en <a href='https://www.trsoft-company.com/register' target='_blank'>www.trsoft-company.com/register</a>, se le pedirá al cliente que escriba una contraseña para que utilice en el futuro en cada inicio de sesión, así como para el uso de los demás sistemas informáticos de la empresa. A efectos de proteger la privacidad y las operaciones del cliente en los sistemas informáticos de la empresa, el uso compartido de los datos de registro (incluidos, entre otros, el correo electrónico y la contraseña) por parte del cliente, con otras personas o entidades comerciales, está estrictamente prohibido. La empresa no resultará responsable por ningún daño o pérdida causada al cliente debido al uso inapropiado (incluido el uso prohibido y sin protección) o por el almacenamiento de dicho correo electrónico y contraseña, incluido el uso realizado por un tercero, sea o no, conocido o autorizado por el cliente.</p>
    			<p className='justify'>Cualquier uso de los servicios de la empresa, con el correo electrónico y la contraseña del cliente, será responsabilidad exclusiva del cliente. La empresa no resultará responsable de dicho uso, incluida la validación, por la cual el cliente está realmente operando con su cuenta.</p>
    			<p className='justify'>El cliente está obligado a notificar de inmediato al servicio de atención al cliente de la compañía en relación a cualquier sospecha de uso no autorizado con respecto a su cuenta. Podrá ponerse en contacto con nosotros, en cualquier momento, a través las lineas de contacto publicadas en el sitio web de la empresa.</p>
    			<p className='justify'>El cifrado de sus datos proporciona un alto nivel de seguridad y privacidad para sus datos. Cuando introduzca sus datos en nuestro sitio web, utilizaremos tecnologías de cifrado para proteger sus datos durante la transmisión desde sus dispositivos hacia nuestros servidores.</p>

    			<Header as='h3'>Cambios a la política de privacidad</Header>
    			<p className='justify'>La empresa se reserva el derecho en el futuro, y a su propia discreción, de añadir, modificar o eliminar partes de esta Política de Privacidad, a efectos de poder garantizar que la información aquí presente sirva para proporcionar una información correspondiente y adecuada en lo que respecta a la recopilación y el proceso que aplicamos a sus datos.</p>
    			<p className='justify'>Esta política de privacidad podrá complementarse con otra información que se reciba por parte del la empresa, así como con otros términos y condiciones que sean aplicables al y que haya aceptado, como parte de su interacción con los servicios de la empresa.</p>
    			<p className='justify'>Le informaremos sobre de cualquier actualización de esta política de privacidad a través de un correo electrónico, mediante un aviso a través de su cuenta de usuario, en el sitio web y/o mediante cualquier otro método de comunicación que nos haya proporcionado. Sus comentarios y sus opiniones siempre son bienvenidas. Puede ponerse en contacto con nosotros en cualquier momento a través las lineas de contacto publicadas en el sitio web de la empresa.</p>
    			
    			<p className='text-right color-grey-text'><i>Última actualización: 06-04-2020</i></p>
    		</Grid.Column>
    	</Grid>

        return (
            <Information title='Política de privacidad' content={contract}/>
        );
    }
}

export default PrivacyPolicy;
