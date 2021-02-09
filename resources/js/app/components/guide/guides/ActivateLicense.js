import React, { Component } from 'react';

import { Segment, Header, Divider, List, Message} from 'semantic-ui-react';

import { withTranslation } from 'react-i18next';

class ActivateLicense extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Segment basic className='p-1' textAlign='left'>
                <Header as='h2'>{this.props.t('guide.active_license.title')}</Header>
                <Divider className='divider-color-app'/>
                <p>{this.props.t('guide.active_license.description')}</p>

                <Message info>
                    <Message.Header>{this.props.t('guide.note')}</Message.Header>
                    <p>{this.props.t('guide.active_license.note')}</p>
                </Message>

                <Header as='h3'>{this.props.t('guide.steps')}</Header>
                <List ordered>
                    <List.Item>{this.props.t('guide.active_license.step_1')}</List.Item>
                    <List.Item>{this.props.t('guide.active_license.step_2')}</List.Item>
                    <List.Item>{this.props.t('guide.active_license.step_3')}</List.Item>
                    <List.Item>{this.props.t('guide.active_license.step_4')}</List.Item>
                </List>
            </Segment>
        );
    }
}

export default withTranslation()(ActivateLicense);
