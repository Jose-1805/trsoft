import React, { Component, PropTypes } from 'react';

import { Segment, Statistic, Grid, Card, Header, Divider, Modal } from 'semantic-ui-react';
import { Btn, GeneralMessage, DateFunc } from '../helpers/Helpers';
import Empty from '../Empty';

import { connect } from 'react-redux';
import { actOpenFullLoader, actCloseFullLoader } from '../../redux/fullLoader/actions';
import { actAddNotification } from '../../redux/notifications/actions';

import axios from 'axios';
import params from '../../config/params';

import { withTranslation } from 'react-i18next';

class Commission extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list:null,
            upcoming:null,
            commission:null,
            sid:null
        }

        this.loadUpcoming = this.loadUpcoming.bind(this);
        this.loadList = this.loadList.bind(this);
        this.startPaymentSkrill = this.startPaymentSkrill.bind(this);
        this.startPaymentPayu = this.startPaymentPayu.bind(this);
    }

    componentDidMount() {   
        this.loadUpcoming();
        this.loadList();
    }

    loadUpcoming(){
        axios.get(params.URL_API+'commission/upcoming')
        .then((response) => {
            this.setState({upcoming:response.data});
        })   
    }

    loadList(){
        axios.get(params.URL_API+'commission/list')
        .then((response) => {
            this.setState({list:response.data});
        })   
    }

    startPaymentSkrill(id){
        this.props.openFullLoader(this.props.t('commission.init_payment')+'...');
        //Descarga el sid para la compra
        axios.post(params.URL_API+'commission/pay-sid', {commission: id})
        .then((response) => {
            this.props.closeFullLoader();
            this.setState({
                sid: response.data.sid
            });
        });
    }

    startPaymentPayu(id){
        this.props.openFullLoader(this.props.t('commission.init_payment')+'...');
        window.location.href = params.URL_API+'commission/payu-request/'+id;
    }

    render() {
        const { list, upcoming, sid } = this.state;

        let src_iframe = '';
        if(sid)
            src_iframe = 'https://pay.skrill.com/?sid='+sid;

        let data_render_upcoming = <GeneralMessage info messages={[this.props.t('commission.empty_upcoming')]}/>

        if(upcoming && upcoming.length){
            data_render_upcoming = <Card.Group itemsPerRow='1' stackable doubling className='m-t-1'>
                {
                    _.map(upcoming, (el, i) => {
                        return <Card key={i}>
                                    <Card.Content>
                                        <Grid divided>
                                            <Grid.Column computer="9">
                                                <Header as='h4'>{el.commission.license.product.name}</Header>   
                                                <p><b>{this.props.t('commission.license')}: </b>{el.commission.license.name}</p>
                                                <p><b>{this.props.t('commission.commission')}: </b>{el.commission.value}%</p>
                                                <p><b>{this.props.t('license.generates_commission_every')}:</b> US $ {el.commission.performance}</p>
                                            </Grid.Column>
                                            <Grid.Column computer="7">
                                                    <Grid centered>
                                                        <Segment compact basic className='m-0'>
                                                                <Statistic color={el.commission_data.performance > 0?'green':(el.commission_data.performance < 0)?'red':'grey'} size='tiny'>
                                                                    <Statistic.Value><span className='font-small font-weight-bold'>US $</span> {el.commission_data.performance}</Statistic.Value>
                                                                    <Statistic.Label>{this.props.t('commission.current_performance')}</Statistic.Label>
                                                                </Statistic>
                                                        </Segment>

                                                        <Segment compact basic className='m-0'>
                                                                <Statistic color='grey' size='tiny'>
                                                                    <Statistic.Value><span className='font-small font-weight-bold'>US $</span> {el.commission_data.commission}</Statistic.Value>
                                                                    <Statistic.Label>{this.props.t('commission.current_commission')}</Statistic.Label>
                                                                </Statistic>
                                                        </Segment>
                                                    </Grid>
                                            </Grid.Column>
                                        </Grid>
                                    </Card.Content>

                                    <Card.Content extra>
                                          {this.props.t('commission.msg_uncoming')}
                                    </Card.Content>
                                </Card>
                    })
                }
            </Card.Group>
        }

        let data_render_list = <Empty message={this.props.t('commission.empty')}/>

        if(list && list.length){
            data_render_list = <Card.Group itemsPerRow='2' stackable doubling>
                {   
                    _.map(list, (el, i) => {
                        return <Card key={i}>
                                    <Card.Content>
                                        <Grid divided>
                                            <Grid.Column computer="9">
                                                <Header as='h4'>{el.user_license.commission.license.product.name}</Header>   
                                                <p><b>{this.props.t('commission.license')}: </b>{el.user_license.commission.license.name}</p>
                                                <p><b>{this.props.t('commission.commission')}: </b>{el.user_license.commission.value}%</p>
                                            </Grid.Column>
                                            <Grid.Column computer="7">
                                                    <Grid centered>
                                                        <Segment compact basic className='m-0'>
                                                                <Statistic color={el.performance > 0?'green':(el.performance < 0)?'red':'grey'} size='tiny'>
                                                                    <Statistic.Value><span className='font-small font-weight-bold'>US $</span> {el.performance}</Statistic.Value>
                                                                    <Statistic.Label>{this.props.t('commission.performance')}</Statistic.Label>
                                                                </Statistic>
                                                        </Segment>

                                                        <Segment compact basic className='m-0'>
                                                                <Statistic color='grey' size='tiny'>
                                                                    <Statistic.Value><span className='font-small font-weight-bold'>US $</span> {el.value}</Statistic.Value>
                                                                    <Statistic.Label>{this.props.t('commission.commission')}</Statistic.Label>
                                                                </Statistic>
                                                        </Segment>
                                                    </Grid>
                                            </Grid.Column>
                                        </Grid>
                                    </Card.Content>

                                    <Card.Content extra>
                                        {
                                            el.value == 0
                                            ?this.props.t('commission.commissions_not_generated')
                                            :(
                                                el.value > 0 && el.state == 'paid'?(this.props.t('commission.commissions_paid')+' '+DateFunc.dateCurrentTimeZone(el.payment_date).toLocaleString())
                                                :<Segment basic className='p-0' textAlign='right'>
                                                    <Grid centered>
                                                        <Grid.Column computer='8' tablet='8' mobile='16'>
                                                            {/*<Btn.PaySkrill fluid className='text-right' onClick={() => this.startPaymentSkrill(el.id)}/>*/}
                                                        </Grid.Column>
                                                        <Grid.Column computer='8' tablet='8' mobile='16'>
                                                            <Btn.PayU fluid className='text-right' onClick={() => this.startPaymentPayu(el.id)}/>
                                                        </Grid.Column>
                                                    </Grid>
                                                </Segment>
                                            )
                                        }
                                    </Card.Content>
                                </Card>
                    })
                }
            </Card.Group>
        }

        return (
            <Segment basic className='p-1'>
                <Grid divided>
                    <Grid.Column className='m-t-1' computer='5' tablet='16'>
                        <Header as='h3' textAlign='center'>{this.props.t('commission.upcoming_commissions')}</Header>
                        {data_render_upcoming}
                    </Grid.Column>
                    <Grid.Column computer='11' tablet='16'>
                        <Header as='h1'>{this.props.t('commission.title')}</Header>
                        <Divider className='divider-color-app m-b-1'/>
                        {data_render_list}
                    </Grid.Column>
                </Grid>

                <Modal open={src_iframe?true:false} basic size='small'>
                    <Modal.Content>
                        {
                            src_iframe?<iframe id="inlineFrameExample"
                                title="Inline Frame Example"
                                width="100%"
                                height="746"
                                frameBorder="0"
                                src={src_iframe}></iframe>:''
                        }
                    </Modal.Content>
                  </Modal>
            </Segment>
        );
    }
}



const mapStateToProps = (state) => {
    return {}
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

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Commission));
