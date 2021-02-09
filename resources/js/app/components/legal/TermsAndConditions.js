import React, { Component } from 'react';

import { Grid, Header, Segment } from 'semantic-ui-react';

import Information from '../Information';

class TermsAndConditions extends Component {

    constructor(props) {
        super(props);
    }

    render() {
    	let contract = <Grid centered>
    		<Grid.Column computer='12' tablet='14' mobile='15'>

    			<p className='justify'>Los siguientes Términos y Condiciones rigen el uso que <b>usted</b> (una persona natural o jurídica que en lo sucesivo será denominado, <b>"El Cliente"</b>) le de a este y los demás productos y/o servicios desarrollados por <b>TrSoft</b> (nombre utilizado para efectos comerciales y publicitarios de la persona natural Jose Luis Capote Mosquera Nit. 1061758953-0. En adelante denominado <b>"La Empresa"</b>). La empresa puede cambiar los Términos y Condiciones en cualquier momento, sin ninguna notificación, sólo publicando estos cambiós en los sistemas informáticos desarrollados. Al realizar el registro correspondiente en la página <a href='https://www.trsoft-company.com/register' target='_blank'>www.trsoft-company.com/register</a>, usted está de acuerdo y acepta los Términos y Condiciones dispuestos en este contenido. Si usted no está de acuerdo con estos Términos y Condiciones, no puede tener acceso a ninguno de los sistemas informáticos desarrollados por la empresa que requieran autenticación.</p>

    			<p className='justify'>El Cliente confirma tener 18 años o más, haber leído, comprendido y aceptado toda la información, las condiciones y los términos establecidos en este contenido, que incluyen información legal importante, y que están disponibles para su revisión y estudio por parte del público.</p>

    			<Header as='h3'>Capacidad de Celebración de Contratos</Header>
    			<p className='justify'>El cliente que acepte este acuerdo de términos y condiciones, debe ser legalmente apto para celebrar un contrato según lo permita su autonomía de la voluntad y las leyes que le sean aplicables. Refiérase entonces, el que quiera celebrar este contrato a la teoría general de celebración de contratos de la ley que aplica en su país.</p>
    			<p className='justify'>La empresa da por entendido que aquel cliente que acepte este acuerdo de términos y condiciones conoce previamente si está o no en capacidad de celebrar contratos a nombre de la persona que se determine como cliente. Quienes sean considerados incapaces absolutos o relativos o parciales deberán tener autorización de sus representantes legales para celebrar este contrato, y serán estos últimos considerados responsables de cualquier conducta de sus apoderados.</p>
    			
    			<Header as='h3'>Registro de clientes</Header>
    			<p className='justify'>La empresa se dedica al desarrollo y licenciamiento de sistemas informáticos que permiten realizar una gestión de las inversiones de sus clientes en los mercados financieros. Los clientes que accedan a estos servicios deberán registrar una cuenta y brindar la información solicitada en los formularios que se habilitan a la hora de registrar una cuenta. La empresa da por entendido que cualquier información ingresada en estos formularios es hecha bajo juramento y por lo tanto exonera a la empresa de poseer información falsa sobre cualquier cliente.</p>
    			
    			<Header as='h3'>Productos, licencias y comisiones</Header>
    			<p className='justify'>Como se ha mencionado anteriormente la empresa se dedica al desarrollo y licenciamiento de sistemas informáticos que permiten realizar una gestión de las inversiones de sus clientes en los mercados financieros, todas las operaciones realizadas por los sistemas de la empresa son establecidas con base en los conocimientos y experiencia de los traders de la empresa, bajo ningúna circunstancia se promete al cliente obtener ganancias de manera segura con ningúno de los servicios. La empresa establece que cada nuevo cliente tiene derecho a una licencia gratuita de cualquier servicio y de una duración indefinida, siempre y cuando las licencias gratuitas que se encuentren activas en el momento no superen los limites establecidos por la empresa. Las licencias gratuitas podrán ser usadas en la cuenta real o demo del broker del cliente, no generan cargos por comisiones y pueden ser adquiridas nuevamente si durante el uso de la licencia el cliente no obtuvo ganancias y no cuenta con una licencia paga.</p>
    			<p className='justify'>En ocaciones el broker no permite realizar operaciones en la cuenta de práctica y las ejecuta automáticamene en la cuenta real, siempre se recomienda realizar la primera operación con el importe mínimo posible con el fin de validar esta situación. La empresa no se hace responsable por las operciones que se hagan en cuenta real pero que debieron haber sido realizadas en práctica.</p>

    			<Segment basic className='p-r-0'>
    				<Header as='h3'>Producto TrSoft / Copy binary </Header>
    				<p className='justify'>Este es el primer servicio de la empresa, consiste en la ejecución de operaciones que se realizan con base en las decisiones tomadas por un trader profesional que se encuentra "detrás del telón" realizando las operaciones en tiempo real. Los traders profesionales determinan los horarios en los cuales realizarán las operaciones. Para utilizar este producto el cliente debe tener una licencia activa ya sea paga o gratuita y saldo disponible en su cuenta real o de práctica para realizar las operaciones.</p>
    				
    				<Header as='h3'>Licencias</Header>
    				<p className='justify'>Para utilzar cualquier producto de la empresa, el cliente debe contar con una licencia activa relacionada al proucto deseado, sin importar que sea una licencia paga o gratuita. El precio y las características de cada licencia son establecidos por la empresa y podrán ser cambiados por esta misma cuando considere conveniente, sin necesidad de notificación alguna a sus clientes. Los precios actuales siempre deben estar visibles en los detalles da cada producto.</p>
    				
    				<Header as='h3'>Comisiones</Header>
    				<p className='justify'>Todas las licencias generan comisiones que deben ser pagadas posteriormente a la expiración de la licencia o al llegar al límite de ganancias establecido por la empresa, sólo se generan comisiónes cuando se obtienen beneficios con una cuenta real. El porcentaje de comisión lo establece la empresa y esta misma puede cambiar dicho porcentaje cuando lo considere conveniente, sin necesidad de dar previo aviso a sus clientes; todos los cambios realizados a las comisiones serán aplicados únicamente en las nuevas compras realizadas por los clientes. El pago de las comisiones generadas por las licencias es obligatorio y de ello depende que el cliente pueda adquirir nuevas licencias o utilizar las actuales.</p>
    			</Segment>

    			<Header as='h3'>Medios de pago</Header>
    			<p className='justify'>Los pagos se realizan a través de la pasarela de pago PayU y la empresa podrá agregar o eliminar las pasarelas o medios de pago que desee y cuando lo desee. Una vez la transacción sea procesada y notificada por el medio o pasarela de pago, el sistema habilitará al cliente la licencia solicita, posterior a esto podrá continuar con el paso de activación de la licencia.</p>

    			<Header as='h3'>Derecho de retracto</Header>
    			<p className='justify'>La empresa está en la obligación de hacer valer el derecho de retracto del cliente según la ley colombiana en los términos del artículo 47 de la Ley 1480 de 2011, realizando la devolución total del dinero que la persona haya consignado como pago por la adquisición de una licencia. Dicho dinero debe ser regresado haciendo caso a la petición del cliente, siempre y cuando se cumpla con los siguientes requisitos.</p>
    			<ul>
    				<li>La licencia debe estar inactiva o activa sin operaciones relacionadas a ella.</li>
    				<li>Ejercer el derecho de retracto dentro de la oportunidad legal, es decir durante los cinco (5) días posteriores a la fecha de compra de la licencia.</li>
    				<li>La petición debe ser enviada desde la cuenta de correo electrónico registrada en el sistema, anexando nombre completo del cliente, numero de identificación, nombre del producto relacionado, nombre de la licencia adquirida y fecha y hora de la compra.</li>
    			</ul>

    			<Header as='h3'>Soporte</Header>
    			<p className='justify'>Es obligación de la empresa brindar canales de comunicación de respuesta rápida con el fin de ofrecer un servicio de soporte que resuelva las inquietudes y problemas de los clientes de manera ágil y efeciva.</p>

    			<Header as='h3'>Limitaciones</Header>
    			<p className='justify'>El cliente no podrá aplicar técnicas de ingeniería inversa, descompilar o desensamblar el software, ni realizar cualquier otra operación que tienda a descubrir el código fuente. La empresa autoriza el uso del software únicamenre bajo el uso de una licencia gratuita o paga, el cliente no podrá compartir con terceros y en tiempo real la información suministrada por los servicios de la empresa, ni hacer alteraciones al código ejecutado en el lado del cliente para intentar enviar información falsa al servidor. Cualquier distribución, publicación o explotación comercial o promocional de los sistemas informáticos de la empresa, o de cualquiera de los contenidos, códigos, datos o materiales pertenecientes a los productos mencionados, está estrictamente prohibida, a menos de que quien comete el hecho haya recibido el previo permiso expreso por escrito del personal autorizado de la empresa o de algún otro poseedor de derechos aplicable. El cliente comprende que faltar a lo dispuesto en esta cláusula es catalogado como intento de fraude y será sancionado con las medidas que la empresa considere pertinentes.</p>

    			<Header as='h3'>Inhabilitación de cuenta</Header>
    			<p className='justify'>La empresa podrá inhabilitar definitiva o temporalmente y de manera unilateral la cuenta de un cliente en los siguientes escenarios:</p>
    			<ul>
    				<li>En caso de que el cliente utilice los servicios o preductos prestados por la empresa para fines contrarios a los naturales, especialmente aquellos que contraríen derechos de propiedad intelectual de terceros y sobre todo de la empresa y de otros clientes;</li>
    				<li>En caso de que la empresa determine o tenga sospechas fundamentadas que el cliente está haciendo uso de su cuenta para la transmisión de información que estos términos y condiciones no le permiten compartir con terceros.</li>
    				<li>Cuando existan elementos que permitan inferir a la empresa que el cliente no cuenta con la edad mínima permitida para contratar los servicios de la empresa.</li>
    			</ul>

    			<Header as='h3'>Limitación de responsabilidad</Header>
    			<p className='justify'>La empresa no garantiza el servicio ininterrumpido, seguro y libre de errores ni la inmunidad contra el acceso no autorizado a los servidores que alojan los sistemas informáticos de la empresa, ni contra interrupciones causadas por daños, mal funcionamiento o fallas de hardware, software, comunicaciones o de sistemas en los equipos del Cliente y de los proveedores de la empresa.</p>
    			<p className='justify'>La prestación de servicios por parte de la empresa depende, entre otras cosas, de terceros y la empresa no asume ninguna responsabilidad por cualquier acción u omisión de terceros y no se responsabiliza por ningún daño y/o pérdida y/o gastos causados al Cliente o terceros como consecuencia de, y/o en relación con, las citadas acciones u omisiones.</p>
    			<p className='justify'>La empresa no asumirá ninguna responsabilidad por ningún daño de cualquier tipo causado al Cliente en circunstancias de fuerza mayor o durante cualquier acontecimiento en que la empresa no tenga control y que ha impactado en la accesibilidad a los servicios de la empresa.</p>
    			<p className='justify'>La empresa en ningún momento y bajo ninguna circunstancia recauda el capital de inversión del cliente, las operaciones que se realizan por medio de los servicios de la empresa son realizadas directamente desde el broker del cliente. Por lo cual, cualquier inconveniente, duda o reclamo que esté relacionado con el capital de inversión del cliente, debe ser manejado directamente con el broker de acuerdo a los términos y condiciones definidos por este.</p>

    			<Header as='h3'>Derechos de propiedad</Header>
    			<p className='justify'>La empresa es dueño único y exclusivo, de todos los derechos, título e intereses en y de todos los sistemas de información utilizados, de todo el contenido (incluyendo, por ejemplo, fotografías, ilustraciones, gráficos, otros medios visuales, videos, copias, textos, software, títulos, etc.), códigos, datos y materiales del mismo, el aspecto y el ambiente, el diseño y la organización de los productos y servicios y la compilación de los contenidos, códigos, datos y los materiales en los productos, incluyendo pero no limitado a, cualesquiera derechos de autor, derechos de marca, derechos de patente, derechos de base de datos, derechos morales y otras propiedades intelectuales y derechos patrimoniales del mismo. El uso de los sistemas informáticos de la empresa no le otorga al cliente propiedad de ninguno de los contenidos, códigos, datos o materiales a los que pueda acceder de forma libre o autenticada en los sistemas desarrollados por la empresa.</p>
    			
    			<Header as='h3'>Marcas comerciales</Header>
    			<p className='justify'>Las marcas comerciales, logos, marcas de servicios, marcas registradas (conjuntamente las "Marcas Comerciales") expuestas en los servicios de la empresa o en los contenidos disponibles en ellos son Marcas Comerciales de la empresa registradas y no registradas y otras, y no pueden ser usadas con respecto a productos y/o servicios que no estén relacionados, asociados o patrocinados por sus poseedores de derechos y que puedan causar confusión a los clientes, o de alguna manera que denigre o desacredite a sus poseedores de derechos. Todas las Marcas Comerciales que no sean de la empresa que aparezcan en los sistemas informáticos de la empresa, si las hubiera, son propiedad de sus respectivos dueños. Nada que esté contenido en los produtos de la empresa deberá ser interpretado como otorgando, por implicación, desestimación, o de otra manera, alguna licencia o derecho para usar alguna Marca Comercial expuesta en los servicios de la empresa sin el permiso escrito la misma o de terceros que puedan ser dueños de dicha Marca Comercial. El mal uso de las Marcas Comerciales expuestas en los servicios de la empresa está estrictamente prohibido.</p>
    			
    			<Header as='h3'>Licencia limitada</Header>
    			<p className='justify'>Usted puede acceder y ver el contenido de los sistemas de la empresa desde su computadora o desde cualquier otro dispositivo y, a menos de que se indique de otra manera en estos Términos y Condiciones o en los sistemas informáticos de la empresa, sacar copias o impresiones individuales del contenido de los sistemas de la empresa para su uso personal, interno únicamente. El uso de los productos o servicios que ofrece la empresa son sólo para su uso personal, no comercial.</p>
    			
    			<p className='text-right color-grey-text'><i>Última actualización: 06-04-2020</i></p>
    		</Grid.Column>
    	</Grid>

        return (
            <Information title='Términos y condiciones' content={contract}/>
        );
    }
}

export default TermsAndConditions;
