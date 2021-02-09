import React, { Component } from 'react';

import { Segment, Image, Grid, Divider, Header } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';

class OuTeam extends Component {
    render() {
        return (
            <Segment basic id='our-team' className='p-0 m-0' style={{backgroundImage:'url('+base_resources+'/images/bg_trading.png)'}}>
                <Grid centered verticalAlign='middle' className='gradient-4 p-0 m-0'>
                	<Grid.Column computer='6' tablet='12' mobile='14' textAlign='left'>
                        <Segment basic className='p-0 animated scroll-animated' data-animation='fadeInRight' data-animation-delay-top='100' data-animation-delay-bottom='200'>
                    	    <Header as='h1' style={{fontSize:'3rem'}}>{ this.props.t('menu.our_team') }</Header>
                    	    <Divider className='divider-color-app'/>
                    	    <p>{ this.props.t('home.our_team_msg') }</p>
                        </Segment>
                	</Grid.Column>

                    <Grid.Column computer='6' only='computer' className='p-4 m-t-4' textAlign='center'>
                        <Segment basic className='p-0 animated scroll-animated' data-animation='fadeInDown' data-animation-delay-top='100' data-animation-delay-bottom='200'>
                            <Image src={base_resources+'/images/team.png'}/>
                            <a className='font-x-small' href="https://www.freepik.es/fotos-vectores-gratis/rompecabezas">Vector de Rompecabezas creado por stories - www.freepik.es</a>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </Segment>
        );
    }
}

export default withTranslation()(OuTeam);
