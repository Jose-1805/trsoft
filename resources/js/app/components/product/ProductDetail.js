import React, { Component, PropTypes } from 'react';
import { Segment, Header, Card, Grid, Statistic, Divider, Button, Icon, Message, Responsive, Confirm } from 'semantic-ui-react';

import { withTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import routes from '../../config/routes';
import params from '../../config/params';
import axios from 'axios';

import { FixedBottomContent, SyncUser } from '../helpers/Helpers';
import { connect } from 'react-redux';

import { actOpenFullLoader, actCloseFullLoader } from '../../redux/fullLoader/actions';
import { actAddNotification } from '../../redux/notifications/actions';

class ProductDetail extends Component {
    constructor(props) {
        super(props);

        this.itemLicense = this.itemLicense.bind(this);

        this.state = {
            show_licenses:false
        }
    }

    itemLicense(key, data, product_id){
        const { product, user } = this.props;
        return <Card key={key}>
            <Card.Content textAlign='center'>
                <Card.Header>
                    {data.name}
                </Card.Header>
                <Statistic color='green'>
                    <Statistic.Value>US $ {data.license_prices[0].price}</Statistic.Value>
                    <Statistic.Label>{data.duration == -1?this.props.t('service.unlimited_time'):this.props.t('service.license_durationWithCount', {count:data.duration})}</Statistic.Label>
                </Statistic>
                <Divider/>

                <Trans i18nKey="service.message_license">
                    <b>{{commission:data.commissions[0].value}}</b><b>{{performance:data.commissions[0].performance}}</b><b>{{max_profit:data.max_amount}}</b><b>{{investment_capital:data.max_amount * 100}}</b>
                </Trans>
            </Card.Content>
            <Card.Content extra>
                {data.duration > 0?(!user.active_copy_binary_with_payment && !user.paid_copy_binary && product.name == 'TrSoft/Copy Binary'?
                    <Link to={routes.service_buy.path_base+product_id+'/'+data.id}>
                        <Button icon labelPosition='left' positive fluid>
                            <Icon name='check circle' />
                            {this.props.t('service.buy')}
                        </Button>
                    </Link>:''):this.props.t('service.free_licence_msg')
                }
            </Card.Content>
        </Card>
    }

    render() {
        const { product, user } = this.props;
        const { show_licenses } = this.state;
        
        return (
            <Segment basic className='p-0'>
                <SyncUser/>
                <Card fluid>
                    <Card.Content>
                        <Grid verticalAlign='middle' className='bg-color-app'>
                            <Grid.Column computer='4' tablet='16'>
                                <Header as='h3' textAlign='center' className='color-white-text'>{product.name}</Header>
                            </Grid.Column>
                            <Grid.Column computer='12' tablet='16' className='color-white'>
                                <p>{this.props.t('service.description_copy_binary')}</p>
                                <Segment textAlign='right' basic className='p-0'>
                                    <Button
                                        primary
                                        icon='eye'
                                        labelPosition='left'
                                        content = {show_licenses?this.props.t('service.hide_licenses'):this.props.t('service.show_licenses')}
                                        onClick={() => this.setState({show_licenses:!show_licenses})}
                                    />
                                </Segment>
                            </Grid.Column>
                        </Grid>
                    </Card.Content>
                </Card>

                <Grid centered>
                    {(user.active_copy_binary_with_payment || user.paid_copy_binary) && product.name == 'TrSoft/Copy Binary'?
                        <Grid.Column computer='14'>
                            <Message
                                info
                                icon='warning circle'
                                header={this.props.t('service.paid_or_active')}
                                content={this.props.t('service.paid_or_active_msg')}
                            />
                        </Grid.Column>:''
                    }

                    {
                        show_licenses?
                        <Grid.Column computer='16' className='m-t-2'>
                            <Card.Group centered itemsPerRow='3' stackable doubling>
                                {
                                    _.map(product.licenses, (el, i) => {
                                        //if(el.state == 'Active' && el.duration != -1)
                                        return this.itemLicense(i, el, product.id);
                                    })
                                }
                            </Card.Group>
                        </Grid.Column>:''
                    }
                </Grid>
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

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ProductDetail));
