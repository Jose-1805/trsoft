import React, { Component, PropTypes } from 'react';

import { Segment, Card, Header, Divider, Confirm } from 'semantic-ui-react';
import { Btn, GeneralMessage, DateFunc } from '../helpers/Helpers';

import axios from 'axios';
import params from '../../config/params';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { actOpenFullLoader, actCloseFullLoader } from '../../redux/fullLoader/actions';
import { actAddNotification } from '../../redux/notifications/actions';

import WorkingOnThis from '../WorkingOnThis';
import Empty from '../Empty';
import { withTranslation, Trans } from 'react-i18next';

class License extends Component {
    constructor(props) {
        super(props);

        this.state = {
            licenses:null,
            loading:true,
            active_services:{},
            open_confirm:false,
            user_license:null,
            has_outstanding_commissions:true
        }

        this.loadLicenses = this.loadLicenses.bind(this);
        this.setActiveServices = this.setActiveServices.bind(this);
        this.openConfirmActive = this.openConfirmActive.bind(this);
        this.activateLicense = this.activateLicense.bind(this);
    }

    componentDidMount() {
        this.loadLicenses();
    }

    /**
     * Carga las licencias del usuario desde el servidor
     */
    loadLicenses(){
        this.setState({
            licenses:null,
            loading:true,
            active_services:{},
            open_confirm:false,
            user_license:null
        })

        axios.get(params.URL_API+'license/list')
        .then((response) => {
            this.setState({licenses: response.data, loading:false}, this.setActiveServices);
        })

        axios.get(params.URL_API+'commission/list/true')
        .then((response) => {
            this.setState({has_outstanding_commissions:response.data.length?true:false});
        })
    }

    /**
     * Identifica cuales servicios tiene activos el usuario
     */
    setActiveServices(){
        let active_services = {};

        _.map(this.state.licenses, (el, i) => {
            if(el.state == 'Active'){
                active_services[el.commission.license.product.id] = true;
            }
        })

        this.setState({active_services});
    }

    /**
     * Solicita al servidor la activación de una licencia
     */
    activateLicense(){
        this.setState({
            open_confirm:false
        })

        this.props.openFullLoader(this.props.t('license.activating')+'...')

        axios.post(params.URL_API+'license/activate', {
            user_license:this.state.user_license
        }).then((response) => {

            this.props.closeFullLoader();
            this.props.showNotification({
                header:this.props.t('license.successful_activation'),
                message:this.props.t('license.msg_successful_activation'),
                showButtonClose:true,
                closeIn:15
            });
            this.loadLicenses();

        }, (error) => {
            if(error.response.status == 422){
                this.props.closeFullLoader();

                this.props.showNotification({
                    header:this.props.t('license.activation_error'),
                    message:this.props.t('license.errors.'+error.response.data.error[0]),
                    showButtonClose:true,
                    closeIn:15
                });
            }
        })
    }

    openConfirmActive(id){
        this.setState({
            open_confirm:true,
            user_license:id
        })
    }

    render() {
        const { loading, licenses, open_confirm, has_outstanding_commissions } = this.state;
        const { user } = this.props;

        let data_render = <Segment/>

        if(licenses){
            if(licenses.length){
                data_render = <Segment basic className='m-0 p-0'>

                <Header as='h1' textAlign='center'>{this.props.t('license.title')}</Header>
                <Divider className='divider-color-app m-b-1'/>
                <Card.Group itemsPerRow="3" stackable doubling>
                {   
                    _.map(licenses, (el, i) => { 
                        return <Card key={i}>
                                <Card.Content>
                                    <Card.Header>
                                        {el.commission.license.product.name+' - '+el.commission.license.name}
                                    </Card.Header>

                                    <Card.Header className='m-t-1'><b>{this.props.t('license.state')}:</b> <b className={el.state == 'Active'?'color-green-text':(el.state == 'Inactive'?'color-red-text':'')}>{this.props.t('license.'+el.state)}</b></Card.Header>
                                    {
                                        el.free_trial?
                                        <Card.Description><b>{this.props.t('service.free_licence')}</b></Card.Description>
                                        :<Card.Description><b>{this.props.t('license.duration')}:</b> {el.commission.license.duration == -1?'∞':this.props.t('license.durationWithCount', {count:el.commission.license.duration})}</Card.Description>
                                    }
                                    <Card.Description><b>{this.props.t('license.date_purchase')}:</b> {DateFunc.dateCurrentTimeZone(el.created_at).toLocaleString()}</Card.Description>
                                    <Card.Description><b>{this.props.t('license.activation_date')}:</b> {el.state != 'Paid'?DateFunc.dateCurrentTimeZone(el.activation_date).toLocaleString():'------'}</Card.Description>
                                    <Card.Description><b>{this.props.t('license.expiration_date')}:</b> {el.state != 'Paid'?(el.commission.license.duration == -1?'∞':DateFunc.dateCurrentTimeZone(el.expiration_date).toLocaleString()):'------'}</Card.Description>
                                    <Card.Description><b>{this.props.t('license.generates_commission_every')}:</b> US $ {el.commission.performance}</Card.Description>
                                    <Card.Header className='m-t-1'><b>{this.props.t('license.price')}:</b> $ {el.license_price.price}</Card.Header>
                                    <Card.Header><b>{this.props.t('license.commission')}:</b> {el.commission.value}%</Card.Header>
                                </Card.Content>
                                {   
                                    //No tiene comisiones pendientes de pago, la licencia está paga
                                    // y no hay un servicio activo a traves de una licencia paga para el mismo servicio
                                    (!has_outstanding_commissions && el.state == 'Paid' && (el.commission.license.product.name == 'TrSoft/Copy Binary' && !user.active_copy_binary_with_payment))?
                                        <Card.Content extra>
                                            <Btn.Activate fluid onClick={() => this.openConfirmActive(el.id)}/>
                                        </Card.Content>
                                        //Si no riene comisiones pendientes de pago y está paga
                                    :(!has_outstanding_commissions && el.state == 'Paid')?<Card.Content extra>
                                            {this.props.t('license.activate_after')}
                                        </Card.Content>:''
                                }
                            </Card>
                    })
                }
                </Card.Group>

                <Confirm
                  open={open_confirm}
                  content={this.props.t('license.msg_activate_license')}
                  cancelButton={this.props.t('license.cancel')}
                  confirmButton={this.props.t('license.activate')}
                  onCancel={() => this.setState({open_confirm:false})}
                  onConfirm={this.activateLicense}
                />

                </Segment>
            }else{
                data_render = <Empty message={this.props.t('license.empty')} />
            }
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

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(License));
