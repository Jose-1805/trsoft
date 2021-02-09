import React, { Component } from 'react';

import { Segment, Header, Divider, List, Image, Message } from 'semantic-ui-react';

import { withTranslation, Trans } from 'react-i18next';

class StartCopyBinary extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Segment basic className='p-1' textAlign='left'>
            	<Header as='h2'>{this.props.t('guide.start_copy_binary.title')}</Header>
                <Divider className='divider-color-app'/>
                <p>{this.props.t('guide.start_copy_binary.description')}</p>
                <List ordered className='p-1'>
                    <List.Item>{this.props.t('guide.start_copy_binary.req_1')}</List.Item>
                    <List.Item>
                        <Trans i18nKey='guide.start_copy_binary.req_2'>
                            a<a className='font-weight-bold' href='https://iqoption.com' target='_blank'>Iq</a>a
                        </Trans>
                    </List.Item>
                    <List.Item>{this.props.t('guide.start_copy_binary.req_3')}</List.Item>
                </List>
                <p>{this.props.t('guide.start_copy_binary.steps_text')}</p>
                <List ordered className='p-1'>
                    <List.Item className='m-t-2'>
                        <Trans i18nKey='guide.start_copy_binary.step_1'></Trans>
                        <Segment inverted className='m-t-1'>
                            <Image src={base_resources+'/images/guide/access_iqoption.png'} centered/>
                        </Segment>
                    </List.Item>
                    <List.Item className='m-t-2'>
                        <p><Trans i18nKey='guide.start_copy_binary.step_2'>
                        </Trans></p>

                        <Segment inverted className='m-t-1'>
                            <Image src={base_resources+'/images/guide/options.png'} centered/>
                        </Segment>

                        <List ordered className='p-1'>
                            <List.Item>    
                                <b>{this.props.t('service.state')}: </b>
                                {this.props.t('service.state_msg')}
                            </List.Item>    
                            <List.Item>                                
                                <b>{this.props.t('service.practice_account')}: </b>
                                {this.props.t('service.practice_account_msg')}
                            </List.Item>                                
                            <List.Item>                                
                                <b>{this.props.t('service.max_amount')}: </b>
                                {this.props.t('service.max_amount_msg')}
                            </List.Item>                                
                            <List.Item>                                
                                <b>{this.props.t('service.amount')}: </b>
                                {this.props.t('service.amount_msg')}
                            </List.Item>                                
                            <List.Item>                                
                                <b>{this.props.t('service.stop_loss')}: </b>
                                {this.props.t('service.stop_loss_msg')}
                            </List.Item>                                
                            <List.Item>                                
                                <b>{this.props.t('service.stop_loss_value')}: </b>
                                {this.props.t('service.stop_loss_value_msg')}
                            </List.Item>                                
                            <List.Item>                                
                                <b>{this.props.t('service.dynamic_stop_loss')}: </b>
                                {this.props.t('service.dynamic_stop_loss_msg')}
                            </List.Item>                                
                            <List.Item>                                
                                <b>{this.props.t('service.allow_increment')}: </b>
                                {this.props.t('service.allow_increment_msg')}
                            </List.Item>                                
                        </List>
                    </List.Item>
                </List>
            </Segment>
        );
    }
}

export default withTranslation()(StartCopyBinary);
