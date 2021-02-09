import React, { Component } from 'react';

import { Segment, Header, Divider, List, Message} from 'semantic-ui-react';

import { withTranslation } from 'react-i18next';

class CheckPayCommission extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Segment basic className='p-1' textAlign='left'>
                <Header as='h2'>{this.props.t('guide.check_pay_commission.title')}</Header>
                <Divider className='divider-color-app'/>
                <p>{this.props.t('guide.check_pay_commission.description')}</p>

                <Message info>
                    <Message.Header>{this.props.t('guide.note')}</Message.Header>
                    <p>{this.props.t('guide.check_pay_commission.note')}</p>
                </Message>

                <Header as='h3'>{this.props.t('guide.steps')}</Header>
                <List ordered>
                    <List.Item>{this.props.t('guide.check_pay_commission.step_1')}</List.Item>
                    <List.Item>{this.props.t('guide.check_pay_commission.step_2')}</List.Item>
                    <List.Item>{this.props.t('guide.check_pay_commission.step_3')}</List.Item>
                    <List.Item>{this.props.t('guide.check_pay_commission.step_4')}</List.Item>
                    <List.Item>{this.props.t('guide.check_pay_commission.step_5')}</List.Item>
                    <List.Item>{this.props.t('guide.check_pay_commission.step_6')}</List.Item>
                </List>
                <Header as='h3'>{this.props.t('guide.check_pay_commission.another_way_to_pay')}</Header>
                <p>{this.props.t('guide.check_pay_commission.another_way_to_pay_msg')}</p>
            </Segment>
        );
    }
}

export default withTranslation()(CheckPayCommission);
