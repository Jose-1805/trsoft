import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { actLogout } from '../../redux/app/actions';

import { Menu as MenuSemantic, Header, Divider, Segment, Icon, Button, Responsive } from 'semantic-ui-react';
import { Btn, PendingPayment } from '../helpers/Helpers';
import { withTranslation } from 'react-i18next';
import config_routes from '../../config/routes';
import params from '../../config/params';

class Menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	activeItem:"home",
        	max_height_options:0
        }

    	this.handleItemClick = (e, { path, name_item }) => {
    		this.setState({ activeItem: name_item });
    		this.props.navigate(path);
    		let menu = document.getElementById('menu-app');
    		if(menu)
            	menu.classList.remove('active');
    	}

    	this.calculateMeasurements = this.calculateMeasurements.bind(this);

    	window.onresize = () => {
    		this.calculateMeasurements();
    	}

    	window.onload = () => {
    		this.setState({
    			activeItem:window.location.pathname.split('/')[1]
    		})
    	}
    }

    componentDidMount() {
        this.calculateMeasurements();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
			activeItem:window.location.pathname.split('/')[1]
		})
    }

    calculateMeasurements(){
    	this.setState({
    		max_height_options: window.innerHeight - 260
    	})
    }

    render() {
    	const { activeItem, max_height_options } = this.state;

    	let home = "";
    	let products = "";
    	let licenses = "";
    	let settings = "";
    	let commissions = "";
    	let communication = "";
    	let logout = "";
    	let guides = "";

    	if(this.props.app.user_auth){
    		if(this.props.app.user.is_client == 1){
				home = <MenuSemantic.Item
			        	name={this.props.t('menu.performances')}
			        	name_item='performance'
			        	path={config_routes.performance.path}
			        	icon='line graph'
			        	active={activeItem === 'performance'}
			        	onClick={this.handleItemClick}
		        	/>

				products = <MenuSemantic.Item
			        	name={this.props.t('menu.services')}
			        	name_item='service'
			        	path={config_routes.service.path}
			        	icon='suitcase'
			        	active={activeItem === 'service'}
			        	onClick={this.handleItemClick}
		        	/>

				commissions = <MenuSemantic.Item
			        	name={this.props.t('menu.commissions')}
			        	name_item='commission'
			        	path={config_routes.commission.path}
			        	icon='percent'
			        	active={activeItem === 'commission'}
			        	onClick={this.handleItemClick}
		        	/>

				communication = /*<MenuSemantic.Item
			        	name='communication'
			        	content={this.props.t('menu.communication')}
			        	name_item='communication'
			        	path={config_routes.communication.path}
			        	icon='talk'
			        	active={activeItem === 'communication'}
			        	onClick={this.handleItemClick}
		        	/>*/"";

				licenses = <MenuSemantic.Item
			        	name={this.props.t('menu.licenses')}
			        	name_item='license'
			        	path={config_routes.license.path}
			        	icon='certificate'
			        	active={activeItem === 'license'}
			        	onClick={this.handleItemClick}
		        	/>

		        guides = <MenuSemantic.Item
			        	content={this.props.t('menu.guides')}
			        	name_item='guide'
			        	path={config_routes.guide.path}
			        	icon='file text'
			        	active={activeItem === 'guide'}
			        	onClick={this.handleItemClick}
		        	/>
	        }

	        settings = <MenuSemantic.Item
		        	content={this.props.t('menu.settings')}
		        	name_item='setting'
		        	path={config_routes.setting.path}
		        	icon='settings'
		        	active={activeItem === 'setting'}
		        	onClick={this.handleItemClick}
	        	/>

	        logout = <Btn.Logout fluid onClick={this.props.logout} style={{bottom: '0px', position: 'absolute',marginLeft:'-15px'}}/>
    	}

        return (
        	<Segment id='menu-app' className="container-menu gradient-2" style={{zIndex:100}}>
        		<Responsive
                    {...Responsive.onlyMobile} 
                    as={Button}
                    icon='bars' 
                    className='pos-fixed btn-show-menu'
                    style={{top:'1rem', left:'1rem'}}
                    onClick={() => {
                    	let menu = document.getElementById('menu-app');
                    	menu.classList.add('active');
                    }}
                />

                <Responsive
                    {...Responsive.onlyMobile} 
                    as={Icon}
                    name='arrow left'
                    size='big'
                    inverted
                    className='btn-hide-menu cursor_pointer'
                    onClick={() => {
                    	let menu = document.getElementById('menu-app');
                    	menu.classList.remove('active');
                    }}
                />

        		<Segment style={{borderRadius:'5px', marginBottom:'0px', backgroundColor:params.PRIMARY_COLOR}}>
		        		<Header as='h1' style={{color:'#fff', fontSize: '3.5rem'}} textAlign="center" content="TrSoft" className="fontLogo"/>
        		</Segment>
        		<Segment style={{borderRadius:'5px', marginTop:'2px', backgroundColor:params.PRIMARY_COLOR}}>
		        		<Header as='h5' style={{color:'#fff'}} textAlign="center" icon="user circle" content={this.props.app.user.name}/>
        		</Segment>

	        	<MenuSemantic pointing vertical fluid inverted style={{backgroundColor:params.PRIMARY_COLOR}}>
		        	<div style={{overflowY: 'auto', maxHeight: max_height_options+'px', overflowX: 'hidden'}}>
						<Divider horizontal inverted>
							<Header as='h5' inverted>
							    <Icon name='bar chart' />
							    {this.props.t('menu.trading')}
							</Header>
						</Divider>
						{home}	        	
						{products}	        	
						{commissions}       	
						{licenses}
						<Divider horizontal inverted>
							<Header as='h5' inverted>
							    <Icon name='computer' />
							    {this.props.t('menu.system')}
							</Header>
						</Divider>
						{settings}
						{guides}
						{communication}
		        	</div>
	        	</MenuSemantic>
				{logout}       	
				<PendingPayment/>
        	</Segment>
        );
    }
}

const mapStateToProps = (state) => {
	return {
		app:state.app
	}
}

const mapDisptachToProps = (dispatch, {history}) => {
	return {
		navigate:(path) => {
			history.push(path);
		},
		logout:() => {
			dispatch(actLogout());
		}
	}
}

export default withTranslation()(withRouter(connect(mapStateToProps, mapDisptachToProps)(Menu)));
