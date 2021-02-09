import React, { Component, PropTypes } from 'react';
import { Segment, Header, Grid, Divider, Card, Checkbox, Icon, Popup, Message } from 'semantic-ui-react';
import { Btn, FullForm } from '../helpers/Helpers';
import axios from 'axios';
import params from '../../config/params';
import config_routes from '../../config/routes';
import ProductDetail from './ProductDetail';
import { withTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

import { actSyncUser } from '../../redux/app/actions';
import { actAddNotification } from '../../redux/notifications/actions';
import { connect } from 'react-redux';

class Product extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products:null,

            fields:[],
            ButtonSubmit:Btn.Update,
            props_button_submit:{fluid:true},

            fields_stop_loss:[],
            ButtonSubmitStopLoss:Btn.Update,
            props_button_submit_stop_loss:{fluid:true}
        };

        this.setFields = this.setFields.bind(this);
        this.setFieldsStopLoss = this.setFieldsStopLoss.bind(this);

        this.loadProducts = this.loadProducts.bind(this);
        this.setSetting = this.setSetting.bind(this);
    }

    componentDidMount() {
        this.loadProducts();
        this.setFields();   
        this.setFieldsStopLoss();   
    }

    componentWillReceiveProps(nextProps) {
        if('t' in nextProps){
            this.setFields();   
            this.setFieldsStopLoss();   
        }
    }

    setFields(){
        this.setState({
            fields:[
                {
                    field_type:"input",
                    field_props:{
                        name:"amount",
                        type:"text",
                        max:this.props.user.product_settings?this.props.user.product_settings[0].max_amount:1,
                        min:1,
                        id:"amount",
                        label:this.props.t('service.new_amount_label'),
                        placeholder:this.props.t('service.new_amount_placeholder'),
                        required:true,
                        numericPositive:true,
                        noRenderFails:true,
                        inverted:true
                    }
                }
            ]
        })
    }

    setFieldsStopLoss(){
        this.setState({
            fields_stop_loss:[
                {
                    field_type:"input",
                    field_props:{
                        name:"stop_loss_value",
                        type:"text",
                        min:1,
                        id:"stop_loss_value",
                        label:this.props.t('service.stop_loss_value_label'),
                        placeholder:this.props.t('service.stop_loss_value_placeholder'),
                        required:true,
                        numericPositive:true,
                        noRenderFails:true,
                        inverted:true
                    }
                }
            ]
        })
    }

    loadProducts(){ 
        axios.post(params.URL_API+'service/list')
        .then((response) => {
            this.setState({products:response.data});
        })
    }

    setSetting(data){ 
        axios.post(params.URL_API+'service/set-setting-copy-binary', data)
        .then((response) => {
            this.props.syncUser();

            //Si se está activando el servicio
            if(data.item == 'is_active' && data.value == 1){
                this.props.showNotification({
                    header:this.props.t('service.active_service_header'),
                    message:this.props.t('service.active_service_msg'),
                    showButtonClose:true,
                    closeIn:15
                })
            }else if(data.item == 'is_active' && data.value == -1){
                this.props.showNotification({
                    header:this.props.t('service.inactive_service_header'),
                    message:this.props.t('service.inactive_service_msg'),
                    showButtonClose:true,
                    closeIn:15
                })
            }else{
                this.props.showNotification({
                    message:this.props.t('service.set_setting_success_msg'),
                    showButtonClose:true,
                    closeIn:3
                })
            }
        })
        .catch((error) => {
            this.props.showNotification({
                message:this.props.t('service.set_setting_error_msg'),
                showButtonClose:true,
                closeIn:7
            })
        });

    }

    render() {
        const { products, fields, props_button_submit, ButtonSubmit, fields_stop_loss, props_button_submit_stop_loss, ButtonSubmitStopLoss } = this.state;
        const { user } = this.props;
        let render_products = <Segment/>;
        if(products && products.length){
            render_products = _.map(products, (el, i) => {
                return <Segment key={i} basic className='p-0 m-t-2'><ProductDetail product={products[0]}/></Segment>
            })
        }

        let my_products = '';
        if(user.product_settings && user.product_settings.length){
            my_products = <Segment basic className='p-0'>
                {
                    !user.ssid?<Message
                        warning
                        icon='warning'
                        content={
                            <Trans i18nKey='service.service_ssid_msg'>
                                aa<Link to={config_routes.setting.path}>aa</Link>aa
                            </Trans>
                        }
                    />:''
                }
                {
                    _.map(user.product_settings, (el, i) => {
                        return <Card key={i} fluid className='p-1 hoverable'>
                            <Card.Content>
                                <Grid divided textAlign='center' verticalAlign='middle'>
                                    <Grid.Column computer='4' tablet='12' mobile='16'>
                                        <b>{el.product.name}</b>
                                    </Grid.Column>
                                    <Grid.Column computer='12' tablet='12' mobile='16'>
                                        <Grid verticalAlign='middle' divided className='p-0'>
                                            <Grid.Column computer='4' tablet='4' mobile='8'>
                                                <Popup inverted wide position='top center' content={this.props.t('service.state_msg')} trigger={<Icon name='question circle' className='float-right font-small'/>}/>
                                                <Segment basic className='p-0' disabled={user.commissions_pending_payment_value?true:(user.ssid?false:true)}>
                                                    <p className='font-x-small'>{this.props.t('service.state')}</p>
                                                    <Checkbox disabled={user.commissions_pending_payment_value?true:(user.ssid?false:true)} toggle checked={el.is_active == 1?true:false} onChange={(e, {checked}) => this.setSetting({item:'is_active', value:checked?1:-1})}/>
                                                </Segment>
                                            </Grid.Column>
                                            <Grid.Column computer='4' tablet='4' mobile='8'>
                                                <Popup inverted wide position='top center' content={this.props.t('service.practice_account_msg')} trigger={<Icon name='question circle' className='float-right font-small'/>}/>
                                                <Segment basic className='p-0'>
                                                    <p className='font-x-small'>{this.props.t('service.practice_account')}</p>
                                                    <Checkbox toggle checked={el.use_practice_account == 1?true:false} onChange={(e, {checked}) => this.setSetting({item:'use_practice_account', value:checked?1:-1})}/>
                                                </Segment>
                                            </Grid.Column>
                                            <Grid.Column computer='4' tablet='4' mobile='8'>
                                                <Popup inverted wide position='top center' content={this.props.t('service.max_amount_msg')} trigger={<Icon name='question circle' className='float-right font-small'/>}/>
                                                <Segment basic className='p-0'>
                                                    <p className='font-x-small'>{this.props.t('service.max_amount')}</p>
                                                    <p>$ {el.amount * (el.allow_increment == 1?5:1)}</p>
                                                </Segment>
                                            </Grid.Column>
                                            <Grid.Column computer='4' tablet='4' mobile='8'>
                                                <Popup inverted wide position='top center' content={this.props.t('service.amount_msg')} trigger={<Icon name='question circle' className='float-right font-small'/>}/>
                                                <Segment basic className='p-0'>
                                                    <p className='font-x-small'>{this.props.t('service.amount')}</p>
                                                    <Popup inverted wide position='bottom center' trigger={<p>$ {el.amount} <Icon name='pencil alternate' color='blue'/></p>} hoverable>
                                                        <Segment basic className='p-0 m-t-1 m-b-1'>
                                                            <FullForm 
                                                                fields={fields} 
                                                                ButtonSubmit={ButtonSubmit} 
                                                                props_button_submit={props_button_submit} 
                                                                content_before_submit={<p className='font-x-small color-white-text'>Min: 1 - Max: {el.max_amount}</p>}
                                                                onSubmit={(data) => {
                                                                    this.setSetting({item:'amount', value:data.amount});
                                                                }}
                                                                inverted
                                                            />
                                                        </Segment>
                                                    </Popup>
                                                </Segment>
                                            </Grid.Column>
                                        </Grid>
                                        
                                        <Divider/>
                                        
                                        <Grid verticalAlign='middle' divided className='p-0'>
                                            <Grid.Column computer='4' tablet='4' mobile='8'>
                                                <Popup inverted wide position='top center' content={this.props.t('service.stop_loss_msg')} trigger={<Icon name='question circle' className='float-right font-small'/>}/>
                                                <Segment basic className='p-0'>
                                                    <p className='font-x-small'>{this.props.t('service.stop_loss')}</p>
                                                    <Checkbox toggle checked={el.stop_loss == 1?true:false} onChange={(e, {checked}) => this.setSetting({item:'stop_loss', value:checked?1:-1})}/>
                                                </Segment>
                                            </Grid.Column>
                                            <Grid.Column computer='4' tablet='4' mobile='8'>
                                                <Popup inverted wide position='top center' content={this.props.t('service.stop_loss_value_msg', {recommended:((el.amount * (el.allow_increment == 1?5:1)) * 5)})} trigger={<Icon name='question circle' className='float-right font-small'/>}/>
                                                <Segment basic className='p-0' disabled={el.stop_loss == -1?true:false}>
                                                    <p className={'font-x-small '+((el.stop_loss == 1 && (!el.stop_loss_value || (el.stop_loss_value < ((el.amount * (el.allow_increment == 1?5:1)) * 5))))?'color-white-text color-orange font-weight-bold':'')}>{this.props.t('service.stop_loss_value')}</p>
                                                    {
                                                        el.stop_loss == -1?<p>$ {el.stop_loss_value?el.stop_loss_value:0}</p>
                                                        :<Popup inverted wide position='bottom center' trigger={<p>$ {el.stop_loss_value?el.stop_loss_value:0} <Icon name='pencil alternate' color='blue'/></p>} hoverable>
                                                            <Segment basic className='p-0 m-t-1 m-b-1'>
                                                                <FullForm 
                                                                    fields={fields_stop_loss} 
                                                                    ButtonSubmit={ButtonSubmitStopLoss} 
                                                                    props_button_submit={props_button_submit_stop_loss}
                                                                    content_before_submit={<p className='font-x-small color-white-text'>{this.props.t('service.stop_loss_recommended')+': US $ '+((el.amount * (el.allow_increment == 1?5:1)) * 5)}</p>}
                                                                    onSubmit={(data) => {
                                                                        this.setSetting({item:'stop_loss_value', value:data.stop_loss_value});
                                                                    }}
                                                                    inverted
                                                                />
                                                            </Segment>
                                                        </Popup>
                                                    }
                                                </Segment>
                                            </Grid.Column>
                                            <Grid.Column computer='4' tablet='4' mobile='8'>
                                                <Popup inverted wide position='top center' content={this.props.t('service.dynamic_stop_loss_msg')} trigger={<Icon name='question circle' className='float-right font-small'/>}/>
                                                <Segment basic className='p-0' disabled={el.stop_loss == -1?true:false}>
                                                    <p className='font-x-small'>{this.props.t('service.dynamic_stop_loss')}</p>
                                                    <Checkbox disabled={el.stop_loss == -1?true:false} toggle checked={el.dynamic_stop_loss == 1?true:false} onChange={(e, {checked}) => this.setSetting({item:'dynamic_stop_loss', value:checked?1:-1})}/>
                                                </Segment>
                                            </Grid.Column>
                                            <Grid.Column computer='4' tablet='4' mobile='8'>
                                                <Popup inverted wide position='top center' content={this.props.t('service.allow_increment_msg')} trigger={<Icon name='question circle' className='float-right font-small'/>}/>
                                                <Segment basic className='p-0'>
                                                    <p className='font-x-small'>{this.props.t('service.allow_increment')}</p>
                                                    <Checkbox toggle checked={el.allow_increment == 1?true:false} onChange={(e, {checked}) => this.setSetting({item:'allow_increment', value:checked?1:-1})}/>
                                                </Segment>
                                            </Grid.Column>
                                            <Grid.Column computer='16' textAlign='left'>
                                                <Message
                                                    info
                                                    icon='info circle'
                                                    content={this.props.t('service.service_msg')}
                                                />
                                            </Grid.Column>
                                        </Grid>
                                    </Grid.Column>
                                </Grid>
                            </Card.Content>
                        </Card>
                    })
                }
                </Segment>
            }

        return (
            <Segment basic className='p-1'>
                <Header as='h1' textAlign='center'>
                    {this.props.t('service.my_services')}
                </Header>
                <Divider className='divider-color-app m-b-1'/>
                {
                    my_products
                }

                <Divider horizontal className='m-t-3'>
                    <Header as='h2'>
                        {this.props.t('service.all_services')}
                    </Header>
                </Divider>
                {render_products}
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
        showNotification:(data) => {
            dispatch(actAddNotification(data));
        },
        syncUser:() => {
            return dispatch(actSyncUser());
        },
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Product));
