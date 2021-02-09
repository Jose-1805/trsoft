import React, { Component, PropTypes } from 'react';

import { Segment, Message, Grid, Responsive, Icon } from 'semantic-ui-react';
import { getCookie, Btn } from '../Helpers';

import config_routes from '../../../config/routes';

import { withTranslation, Trans } from 'react-i18next';

class CookiesPolicy extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	accept_cookies:getCookie('accept_cookies')
        }

        this.acceptCookie = this.acceptCookie.bind(this);
    }

    acceptCookie(){
    	let date_expire = new Date();

    	date_expire.setFullYear(date_expire.getFullYear() + 1);

    	document.cookie = "accept_cookies=1; expires="+date_expire+"; path=/;";

    	this.setState({
    		accept_cookies:1
    	})
    }

    render() {
    	if (this.state.accept_cookies)
    		return <div/>

        return (
            <Segment basic className='pos-fixed w-100' style={{bottom:0}}>
            	<Grid centered>
            		<Grid.Column computer='10' tablet='12' mobile='15'>
            			<Message icon info>
            			    <Responsive
            			        {...Responsive.onlyComputer} 
            			        as={Icon}
            			        name='info circle' 
            			    />
            			    <Message.Content>
            			        <Message.Header className='font-x-large m-b-1 p-t-1'>{this.props.t('cookies.cookie_usage_notice')}</Message.Header>
            			        
            			        <Trans i18nKey='cookies.msg'>
		                            This website uses its own or third party cookies. By continuing navigation you accept the use we make of them, according to our <a href={config_routes.cookies_policy.path} target='_blank'>Cookies Policy.</a> If you wish, you can modify your preferences in your browser.
		                        </Trans>

            			        <Btn.Accept floated='right' className='m-t-2' onClick={this.acceptCookie}/>
            			    </Message.Content>                            
            			</Message>
            		</Grid.Column>
            	</Grid>
            </Segment>
        );
    }
}

export default withTranslation()(CookiesPolicy);
