import React, { Component } from 'react';

import { Grid, Header, Image } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';

import config_routes from '../config/routes';

import { connect } from 'react-redux';

import { deleteCookie, Btn } from './helpers/Helpers';

class Welcome extends Component {

    constructor(props) {
        super(props);

        document.getElementsByTagName('body')[0].classList.add('gradient-1');

        this.startNow = this.startNow.bind(this);
        this.seeGuides = this.seeGuides.bind(this);
    }

    startNow(){
    	deleteCookie('welcome');
        window.location.href = config_routes.setting.path;
    }

    seeGuides(){
    	deleteCookie('welcome');
    	window.location.href = config_routes.guide.path;
    }

    render() {
        return (
        	<Grid centered>
        		<Grid.Column computer='10' tablet='12' mobile='15'>
		            <Header as='h1' textAlign='center' className='m-t-3 m-b-3 font-xx-large'>{this.props.t('welcome.title')}</Header>
		            <Image src={base_resources+'/images/logo_icon/logo_md.png'} size='large' centered/>
		            <p className='justify m-t-3'><b>{this.props.user.name.split(' ')[0]},</b> {this.props.t('welcome.message')}</p>
                    <p className='justify'>{this.props.t('welcome.message_2')}</p>
		            <p className='text-center m-t-2'>{this.props.t('welcome.question')}</p>
		            <Grid className='m-t-1'>
		            	<Grid.Column computer='8' mobile='16'>
		            		<Btn.StartNow fluid onClick={this.startNow} size='big'/>
		            	</Grid.Column>
		            	<Grid.Column computer='8' mobile='16'>
			            	<Btn.SeeGuides fluid onClick={this.seeGuides} size='big'/>
		            	</Grid.Column>
		            </Grid>
        		</Grid.Column>
        	</Grid>
        );
    }
}

const mapStateToProps = (state) => {
	return {
		user:state.app.user
	};
}

const mapDispatchToProps = (dispatch) => {
	return {};
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Welcome));
