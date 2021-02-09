import React, { Component } from 'react';

import { Segment, Grid, Header } from 'semantic-ui-react';

import { withTranslation } from 'react-i18next';

class UseWithoutMoney extends Component {
    render() {
        return (
            <Segment basic id='use_without_money' className='m-0'>
                <Grid centered verticalAlign='middle' className='color-blue-grey darken-4'>
                	<Grid.Column computer='8'  tablet='8' only='computer' textAlign='center' className='bg-color-app p-t-10 p-b-10'>
                        <Grid centered>
                            <Grid.Column computer='6'>
                        	    <Header as='h1'  style={{fontSize:'4rem'}} className='color-white-text uppercase animated scroll-animated' data-animation='pulse' data-animation-delay-top='100' data-animation-delay-bottom='200'>
                                    {this.props.t('menu.use_without_money')}
                                </Header>
                            </Grid.Column>
                        </Grid>
                	</Grid.Column>

                    <Grid.Column mobile='16' only='mobile' textAlign='center' className='bg-color-app p-t-1 p-b-1'>
                        <Header as='h1' className='color-white-text uppercase'>
                            {this.props.t('menu.use_without_money')}
                        </Header>
                    </Grid.Column>

                    <Grid.Column computer='8' tablet='8' mobile='16' textAlign='left' className='p-2'>
                        <Segment basic className='p-0 animated scroll-animated' data-animation='pulse' data-animation-delay-top='100' data-animation-delay-bottom='200'>
                            <p className='color-white-text'>{this.props.t('home.use_without_money')}</p>
                            <p className='color-white-text'>{this.props.t('home.use_without_money_2')}</p>
                        </Segment>                    
                    </Grid.Column>
                </Grid>
            </Segment>
        );
    }
}

export default withTranslation()(UseWithoutMoney);
