import React, { Component } from 'react';

import { Segment, Image, Grid, Divider, Header } from 'semantic-ui-react';

import { withTranslation } from 'react-i18next';

class WhatIs extends Component {
    render() {
        return (
            <Segment basic id='what-is' className='animated scroll-animated' data-animation='fadeInUp' data-animation-delay-top='100' data-animation-delay-bottom='200'>
                <Grid centered verticalAlign='middle' className='m-t-2'>
                    <Grid.Column computer='5' tablet='8' mobile='12' className='p-4'>
                    	<Segment circular style={{backgroundColor:'#082E44'}} className='p-1 z-depth-5 external-waves floating'>
                            <Segment circular style={{backgroundColor:'#082E44'}} className='z-depth-5 external-waves'>
                            	<Image src={base_resources+'/images/logo_icon/logo_2_white.png'} className='floating_'/>
                        	</Segment>
                        </Segment>
                    </Grid.Column>

                    <Grid.Column computer='8'  tablet='12' mobile='14'>
                        <Header as='h1' style={{fontSize:'3rem'}}>{this.props.t('home.what_is')}</Header>
                        <Divider className='divider-color-app'/>
                        <p>
                        	{this.props.t('home.what_is_msg')}
                        </p>
                    </Grid.Column>
                </Grid>
            </Segment>
        );
    }
}

export default withTranslation()(WhatIs);
