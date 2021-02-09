import React, { Component } from 'react';

import { Segment, Header, Divider } from 'semantic-ui-react';

import { withTranslation } from 'react-i18next';

class General extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Segment basic className='p-1' textAlign='left'>
            	<Header as='h2'>{this.props.t('guide.general.title')}</Header>
            	<Divider className='divider-color-app'/>
            	<p>{this.props.t('guide.general.description')}</p>
            	
            	<Header as='h3'>{this.props.t('menu.performances')}</Header>
            	<p>{this.props.t('guide.general.description_performance')}</p>

            	<Header as='h3'>{this.props.t('menu.commissions')}</Header>
            	<p>{this.props.t('guide.general.description_commission')}</p>

            	<Header as='h3'>{this.props.t('menu.services')}</Header>
            	<p>{this.props.t('guide.general.description_service')}</p>

            	<Header as='h3'>{this.props.t('menu.licenses')}</Header>
            	<p>{this.props.t('guide.general.description_license')}</p>

                <Header as='h3'>{this.props.t('menu.settings')}</Header>
                <p>{this.props.t('guide.general.description_setting')}</p>
            </Segment>
        );
    }
}

export default withTranslation()(General);
