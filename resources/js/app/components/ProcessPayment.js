import React, { Component, PropTypes } from 'react';

import routes from '../config/routes';

import { Link } from 'react-router-dom';

import { Segment, Grid, Header, Icon } from 'semantic-ui-react';
import { withTranslation, Trans } from 'react-i18next';

class ProcessPayment extends Component {
    constructor(props) {
        super(props);

        let transaction_state = new URLSearchParams(window.location.search).get('lapTransactionState');
        //El estado será APPROVED cuando se procesa con éxito en PayU
        if(transaction_state != 'APPROVED'){
        	//En la aprobación de Skrill se envía un parametro transaction_id
        	transaction_state = new URLSearchParams(window.location.search).get('transaction_id');
        	
        	if(!transaction_state)
	        	this.props.history.push(routes.service.path);
        }
    }

    render() {
    	let msg = '';

    	switch (this.props.match.params.type) {
    	 	case 'license':
    	 		msg = <Header as='h1' textAlign='center' className='m-t-3'>
	            			<Trans i18nKey='service.msg_successful_purchase'>
							Your purchase was successfully processed, to activate your license <Link to={routes.license.path}>go to licenses</Link> and activate it manually.
							</Trans>
            			</Header>
    	 		break;
    	 	case 'commission':
    	 		msg = <Header as='h1' textAlign='center' className='m-t-3'>
	            			<Trans i18nKey='commission.msg_successful_payment'>
							The commission payment was successfully processed, to purchase a new license <Link to={routes.service.path}>go to the products</Link> and select the product and license you want.
							</Trans>
            			</Header>
    	 		break;
    	 	default:
    	 		break;
    	 }

        return (
            <Grid centered className='p-2 m-t-4'>
            	<Grid.Column computer='8' tablet='10' mobile='14'>
            		<Segment basic className='p-0' textAlign='center'>
            			<Icon name='check circle' size='massive' color='blue'/>
            			{msg}
					</Segment>
            	</Grid.Column>
            </Grid>
        );
    }
}
export default withTranslation()(ProcessPayment);
