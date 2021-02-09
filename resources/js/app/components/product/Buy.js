import React, { Component } from 'react';

import axios from 'axios';
import params from '../../config/params';
import routes from '../../config/routes';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Segment, Grid, Header, Message, Statistic, Divider } from 'semantic-ui-react';
import { withTranslation, Trans } from 'react-i18next';
import { Btn } from '../helpers/Helpers';
{/**/}
import { actOpenFullLoader, actCloseFullLoader } from '../../redux/fullLoader/actions';
import { actAddNotification } from '../../redux/notifications/actions';

class Buy extends Component {

    constructor(props) {
        super(props);

        this.state = {
        	loading:true,
        	product:null,
            sid:false,
            load_sid:true,
            pay_by:null
        }

        this.payBySkrill = this.payBySkrill.bind(this);
        this.payByPayU = this.payByPayU.bind(this);
    }

    componentDidMount() {
        //Descarga la información del servicio
     	axios.get(params.URL_API+'service/'+this.props.match.params.product+'/'+this.props.match.params.license)
     	.then((response) => {
            //Si el usuario ya tiene el servicio activo con una licencia paga
            if(response.data.name == 'TrSoft/Copy Binary' && (this.props.user.active_copy_binary_with_payment || this.props.user.paid_copy_binary))
                this.props.history.push('/');

     		this.setState({product: response.data, loading:false});
     	})
    }

    payBySkrill(){
        this.setState({pay_by:'skrill'});

        //Descarga el sid para la compra
        axios.post(params.URL_API+'service/pay-sid', {license: this.props.match.params.license})
        .then((response) => {
            this.setState({
                sid: response.data.sid,
                load_sid: response.data.sid?false:true
            });
        })
    }

    payByPayU(){
        this.props.openFullLoader(this.props.t('loading')+' ...');
        this.setState({pay_by:'pay_u'});
        window.location.href = params.URL_API+'service/payu-request/'+this.props.match.params.license;
    }

    render() {
    	const { loading, product, sid, load_sid, pay_by } = this.state;
        const { user } = this.props;
        let data_render = <Segment/>

        if(product){
            let src_iframe = '';
            if(sid)
                src_iframe = 'https://pay.skrill.com/?sid='+sid;


    		data_render = <Grid centered divided className='m-t-2'>
            		<Grid.Column computer="8" tablet="16" mobile="16">
            			<Header as='h2' className='fontLogo_'>{this.props.t('service.buy_')+' '+product.name}</Header>
                        {
                            user.full_commissions_pending_payment_value?
                            <Message
                                icon='dollar'
                                info
                                header={this.props.t('commission.commissions_pending_payment')}
                                content={<Trans i18nKey='commission.commissions_pending_payment_msg_2'>
                                    a<b>{{value:user.full_commissions_pending_payment_value}}</b>a
                                </Trans>}
                            />:''
                        }
            			<p>{this.props.t('service.description_copy_binary')}</p>
            			<p><b>{this.props.t('service.license')}: </b>{product.license.name}</p>
            			<p><b>{this.props.t('service.duration')}: </b>{this.props.i18n.t('service.license_durationWithCount', {count:product.license.duration})}</p>
            			<p>
            				<b>{this.props.t('service.commission')}: </b>
	            			<Trans i18nKey="service.message_license">
			                    <b>{{commission:product.license.commissions[0].value}}</b><b>{{performance:product.license.commissions[0].performance}}</b><b>{{max_profit:product.license.max_amount}}</b><b>{{investment_capital:(product.license.max_amount * 100)}}</b>
			                </Trans>
		                </p>
            			<p><b>{this.props.t('service.note')}: </b>{this.props.i18n.t('service.note_msg')}</p>
            		</Grid.Column>
            		<Grid.Column computer="6" tablet="16" mobile="16" textAlign="center">
                        <Segment className='bg-color-app'>
                            <Header className='color-white-text'>TOTAL</Header>
                        </Segment>
                        <Segment>
                            <Statistic color='green' size='large'>
                                <Statistic.Value><span className='font-xx-large font-weight-bold'>US $</span> {(user.full_commissions_pending_payment_value + product.license.license_prices[0].price)}</Statistic.Value>
                            </Statistic>
                        </Segment>

                        <Btn.PayU disabled={pay_by != null} fluid size='big' onClick={this.payByPayU}/>
                        {/*<Btn.PaySkrill disabled={pay_by != null} fluid size='big' className='m-t-1' onClick={this.payBySkrill}/>*/}
                        {pay_by == 'skrill'?
                			<Segment loading={load_sid} basic className='p-0'>
                                <iframe id="inlineFrameExample"
                                    title="Inline Frame Example"
                                    width="100%"
                                    height="746"
                                    frameBorder="0"
                                    src={src_iframe}>
                                </iframe>
                            </Segment>:''
                        }
            		</Grid.Column>
            	</Grid>
    	}

        return (
            <Segment loading={loading} basic className='p-1'>
            	{ data_render }
            </Segment>
        );
    }
}

const mapStateToProps = (state) => {
	return {
        user:state.app.user
    }
}

const mapDispatchToProps = (dispatch) => {
	return {
		openFullLoader:(message) => {
			dispatch(actOpenFullLoader(message));
		},
		closeFullLoader:() => {
			dispatch(actCloseFullLoader());
		},
		showNotification:(data) => {
			dispatch(actAddNotification(data));
		}
	}
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Buy));
