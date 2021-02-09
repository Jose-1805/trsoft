import React, { Component } from 'react';

import Menu from './components/Menu';
import Footer from '../Footer';
import WhatIs from './components/WhatIs';
import UseWithoutMoney from './components/UseWithoutMoney';
import HowWork from './components/HowWork';
import OurTeam from './components/OurTeam';
import { Segment, Image, Grid, Header, Message, Divider, Icon, Modal } from 'semantic-ui-react';
import { Btn } from '../helpers/Helpers';
import { withTranslation, Trans } from 'react-i18next';

import config_routes from '../../config/routes';

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='p-0 w-100'>
                <Segment className='pos-fixed p-0 m-0 w-100'>
                    <Image src={base_resources+'/images/background_1.jpg'} style={{width: '100%'}}/>
                </Segment>

                <Menu/>        

                <Segment className='p-0 m-b-0 m-t-0' basic>
                    <Grid id='slider-app' className='gradient-3 m-b-0 w-100 p-0 m-0' centered verticalAlign='middle'>

                        <Grid.Column computer='6' tablet='5' className='p-t-8 p-b-5' only='computer tablet'>
                            <Image src={base_resources+'/images/working_.png'} size='medium' centered className='floating'/>
                        </Grid.Column>

                        <Grid.Column computer='8' tablet='9' className='p-t-8 p-b-5' only='computer tablet'>
                            <Header style={{fontSize:'2.5rem'}} inverted as='p'>{this.props.t('home.msg_slider')}</Header>
                            <p style={{color:'white', fontSize:'1.2rem'}}>{this.props.t('home.msg_slider_2')}</p>
                            <Btn.Login size='big' onClick={() => {
                            	this.props.history.push(config_routes.login.path)
                             }}/>
                            <Btn.Register size='big' className='m-l-1' positive onClick={() => {
                            	this.props.history.push(config_routes.register.path)
                             }}/>
                        </Grid.Column>

                        <Grid.Column tablet='9' mobile='16' className='p-t-8 p-b-5' only='mobile' textAlign='center'>
                            <Header style={{fontSize:'2.5rem'}} inverted textAlign='center' as='p'>{this.props.t('home.msg_slider')}</Header>
                            <p className='text-center' style={{color:'white', fontSize:'1.2rem'}}>{this.props.t('home.msg_slider_2')}</p>
                            
                                <Btn.Login fluid onClick={() => {
		                        	this.props.history.push(config_routes.login.path)
		                         }}/>
                                <Btn.Register fluid className='m-t-1' positive onClick={() => {
	                            	this.props.history.push(config_routes.register.path)
	                             }}/>
                            
                        </Grid.Column>

                        <Grid.Column computer='16'>
                            <Segment basic textAlign='right'>
                                <a style={{color:'white'}} className='font-x-small' href="https://www.freepik.es/fotos/negocios">Foto de Negocios creado por rawpixel.com - www.freepik.es</a> --  <a style={{color:'white'}} className='font-x-small' href="https://www.freepik.es/fotos-vectores-gratis/fondo">Vector de Fondo creado por katemangostar - www.freepik.es</a>
                            </Segment>
                        </Grid.Column>
                    </Grid>
                   

                    <Segment className='m-t-0 p-0 no-border'>
                        <Grid>
                            <Grid.Column computer='5' tablet='8' mobile='16' className='pos-fixed' style={{zIndex:1, bottom:'1rem', left:'1rem'}}>
                                
                                <Modal className='m-b-8' trigger={
                                    <Message icon className='m-b-0 cursor_pointer color-green darken-2 z-depth-1 hoverable color-white-text animated delay-4s flipInY'>
                                        <Icon name='gift'/>
                                        <Message.Content>
                                            <Trans i18nKey='home.free_license_short_msg'>
                                                a<b>a</b>a<b>a</b>
                                            </Trans>
                                        </Message.Content>
                                    </Message>
                                }
                                basic size='small'>
                                    <Segment inverted className='p-0'>
                                        <Segment inverted className='color-green darken-2'>
                                            <Header icon='gift' content={this.props.t('home.free_license')} />
                                        </Segment>
                                        <Segment inverted>
                                            <Modal.Content>
                                              <p className='font-medium'>{this.props.t('home.free_license_msg')}</p>
                                              <ol>
                                                <li className='font-medium'>{this.props.t('home.free_license_conditions.cond_1')}</li>
                                                <li className='font-medium'>{this.props.t('home.free_license_conditions.cond_2')}</li>
                                                <li className='font-medium'>{this.props.t('home.free_license_conditions.cond_3')}</li>
                                              </ol>
                                              <p className='font-medium'>{this.props.t('home.free_license_msg_2')}</p>
                                              <p className='font-medium'>{this.props.t('home.communication_channels_msg')}</p>

                                                <Segment  inverted basic>
                                                    <span className='font-medium'><Icon name="mail"/>contacto@trsoft-company.com</span><br/>
                                                    <span className='font-medium'><Icon name="whatsapp"/> 311 798 9621</span><br/>
                                                    <a className='font-medium' href='https://m.me/trsoftCompany' target='_blank' rel="noopener noreferrer"><Icon name="facebook messenger"/> Messenger</a>
                                                </Segment>
                                            </Modal.Content>
                                            <Divider/>
                                            <Modal.Actions>
                                                <Segment basic textAlign='right'>
                                                    <Btn.Register className='m-l-1' positive onClick={() => {
						                            	this.props.history.push(config_routes.register.path)
						                             }}/>
                                                </Segment>
                                            </Modal.Actions>
                                        </Segment>
                                    </Segment>
                                </Modal>
                            </Grid.Column>
                        </Grid>

                        <WhatIs/>
                        <HowWork history={this.props.history}/>
                        <UseWithoutMoney/>
                        <OurTeam/>

                        <Segment textAlign='left' className='p-2 m-t-0 m-l-0 m-r-0' style={{backgroundColor:'#ffefd2', marginBottom:'-5rem'}}>
                            <p className='uppercase'><b>{ this.props.t('home.warning') }</b></p>
                            <p>{ this.props.t('home.warning_msg') }</p>
                        </Segment>
                        <Footer/>
                    </Segment>
                </Segment>  
            </div>
        );
    }
}

export default withTranslation()(Home);
