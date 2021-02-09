import React, { Component, PropTypes } from 'react';

import { Link } from 'react-router-dom';
import routes from '../config/routes';
import params from '../config/params';
import { withTranslation } from 'react-i18next';

import { Segment, Grid, Header, Container, Image, Icon, Divider } from 'semantic-ui-react';

class Footer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
    	let year = new Date();
    	year = year.getFullYear();
        return (
            <Segment inverted className="p-0 color-blue-grey darken-4 m-t-5 no-border-radius no-border" style={{zIndex:1}}>
            	<Container className="p-l-2 p-r-2 p-t-3 p-b-1">
	            	<Grid divided inverted>
	            		<Grid.Column mobile={16} tablet={8} computer={7}>
	            			<Image src={base_resources+"/images/logo_icon/logo_md_white.png"} size="medium" centered/>
	            		</Grid.Column>

	            		<Grid.Column mobile={16} tablet={8} computer={5}>
	            			<Header as="h3" inverted>{this.props.t('contact')}</Header>
	            			<p><Icon name="mail"/> trsoft.company@gmail.com</p>
	            			<p><Icon name="whatsapp"/> 310 382 0239 / 311 798 9621</p>
	            		</Grid.Column>

	            		<Grid.Column mobile={16} tablet={8} computer={4}>
	            			<Header as="h3" inverted>{this.props.t('social_networks')}</Header>
	            			<p><a className='color-white-text' target='_blank' href='https://www.facebook.com/trsoftCompany'><Icon name='facebook square'/> Facebook</a></p>
	            			<p><a className='color-white-text' target='_blank' href='https://www.instagram.com/trsoft.company/'><Icon name='instagram'/> Instagram</a></p>
	            		</Grid.Column>	            		
	            	</Grid>
	            	<Segment textAlign='center' inverted basic className='m-t-3'>
	            		<Link style={{borderRight:'1px solid #3d7bb8'}} className='p-r-1 p-l-1' to={routes.terms_and_conditions.path}>Términos y Condiciones</Link>
	            		<Link style={{borderRight:'1px solid #3d7bb8'}} className='p-r-1 p-l-1' to={routes.privacy_policy.path}>Política de Privacidad</Link>
	            		<Link className='p-r-1 p-l-1' to={routes.cookies_policy.path}>Política de Cookies</Link>
	            	</Segment>
            	</Container>
            	<Segment inverted textAlign="center" className="no-border-radius" style={{backgroundColor:params.PRIMARY_COLOR}}>
            		&copy; {year}, TrSoft
            	</Segment>
            </Segment>
        );
    }
}

export default withTranslation()(Footer);