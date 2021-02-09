import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import routes from '../../../config/routes';

import { Segment, Message } from 'semantic-ui-react';

import { FixedBottomContent, SyncUser } from '../Helpers';
import { connect } from 'react-redux';

import { withTranslation, Trans } from 'react-i18next';

class PendingPayment extends Component {

    constructor(props) {
        super(props);
    }

    render() {
    	const { user } = this.props;
    	if(!user)return <div/>

        return <Segment basic className='p-0'>
        		<SyncUser/>
        		{
    		        user.commissions_pending_payment_value > 0?<FixedBottomContent content={
    		            <Message
    		                warning
    		                icon='warning circle'
    		                header={this.props.t('commission.commissions_pending_payment')}
    		                content={<Trans i18nKey='commission.commissions_pending_payment_msg'>
    		                		<b>{{balance:user.commissions_pending_payment_value}}</b><b></b><Link to={routes.service.path}></Link><Link to={routes.commission.path}></Link>
    		                	</Trans>}
    		            />
    		        }/>:''
    		    }
        	</Segment>
    }
}

const mapStateToProps = (state) => {
    return {
        user:state.app.user,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(PendingPayment));
