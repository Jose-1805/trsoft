import React, { Component } from 'react';

import { Btn } from '../../helpers/Helpers';
import { Segment, Header, Grid, Divider, Message, Icon } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';

import config_routes from '../../../config/routes';

class HowWork extends Component {
    render() {
        return (
            <Segment basic className='m-t-3' id='how-start'>
				<Grid centered>
					<Grid.Column computer='14' tablet='16'>
						<Header as='h1' textAlign='center' style={{fontSize:'3rem'}}>{this.props.t('menu.how_work')} <span className='color-green-text'>{this.props.t('home.too_easy')}</span></Header>
						<Divider className='divider-color-app'/>

						<Grid className='m-t-5'>
							<Grid.Column computer='4' tablet='8' mobile='16' textAlign='center'>
								<Segment basic className='p-0 animated scroll-animated' data-animation='fadeInLeft' data-animation-delay-top='100' data-animation-delay-bottom='200'>
									<Icon name='computer' size='huge' color='grey'/>
									<Header as='h3' className='uppercase'>1. { this.props.t('home.login') }</Header>
									<Divider className='divider-color-app'/>
									{ this.props.t('home.login_msg') }
									<p className='font-x-small m-t-1'><i><Icon name='clock outline' color='blue' /> Max. 4 Min.</i></p>
								</Segment>
							</Grid.Column>

							<Grid.Column computer='4' tablet='8' mobile='16' textAlign='center'>
								<Segment basic className='p-0 animated delay-0-5s scroll-animated' data-animation='fadeInLeft' data-animation-delay-top='100' data-animation-delay-bottom='200'>
									<Icon name='settings' size='huge' color='teal'/>
									<Header as='h3' className='uppercase'>2. { this.props.t('home.setting') }</Header>
									<Divider className='divider-color-app'/>
									{ this.props.t('home.setting_msg') }
									<p className='font-x-small m-t-1'><i><Icon name='clock outline' color='blue' /> Max. 6 Min.</i></p>
								</Segment>
							</Grid.Column>

							<Grid.Column computer='4' tablet='8' mobile='16' textAlign='center'>
								<Segment basic className='p-0 animated delay-1s scroll-animated' data-animation='fadeInLeft' data-animation-delay-top='100' data-animation-delay-bottom='200'>
									<Icon name='toggle on' size='huge' color='blue'/>
									<Header as='h3' className='uppercase'>3. { this.props.t('home.activate') }</Header>
									<Divider className='divider-color-app'/>
									{ this.props.t('home.activate_msg') }
									<p className='font-x-small m-t-1'><i><Icon name='clock outline' color='blue' /> Max. 1 Min.</i></p>
								</Segment>
							</Grid.Column>

							<Grid.Column computer='4' tablet='8' mobile='16' textAlign='center'>
								<Segment basic className='p-0 animated delay-1-5s scroll-animated' data-animation='fadeInLeft' data-animation-delay-top='100' data-animation-delay-bottom='200'>
									<Icon name='check circle' size='huge' color='green'/>
									<Header as='h3' className='uppercase'>4. { this.props.t('home.ready') }!!</Header>
									<Divider className='divider-color-app'/>
									{ this.props.t('home.ready_msg') }
								</Segment>
							</Grid.Column>
						</Grid>

						<Message info className='p-b-4 m-t-5'>
			                <Message.Content>
			                    <Message.Header>{this.props.t('home.doubts')}</Message.Header>
			                    {this.props.t('home.how_work_msg')}
			                    <Segment basic>
			                    	<Btn.Register positive floated='right' onClick={() => {
		                            	this.props.history.push(config_routes.register.path)
		                             }}/>
			                    </Segment>
			                </Message.Content>
			            </Message>
					</Grid.Column>
				</Grid>
            </Segment>
        );
    }
}

export default withTranslation()(HowWork);
