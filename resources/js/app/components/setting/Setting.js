import React, { Component } from 'react';
import { Segment, Card, Grid, Image } from 'semantic-ui-react';
import ChangePassword from './ChangePassword';
import LoginIq from './LoginIq';
import { withTranslation } from 'react-i18next';

import { connect } from 'react-redux';

class Setting extends Component {
    render() {
        return (
            <Segment basic className='p-3'>
                <Grid centered>
                    {
                        this.props.user && this.props.user.is_client == 1?<Grid.Column computer='11'  tablet='9' mobile='16'>
                        <Card fluid className='p-b-1'>
                                <Card.Content className='bg-color-app'>
                                    <p className='color-white-text'><Image className='m-r-1' src='https://static.cdnpub.info/v5/static/images/iq.8e44582c6f29a00441224df8ddfa01d2.svg'/>{this.props.t('setting.access_to_iqoption')}</p>
                                </Card.Content>
                                <Card.Content className='p-t-2'>
                                    <Card.Description>
                                        <LoginIq/>
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Column>:''
                    }
                    <Grid.Column computer='5' tablet='7' mobile='16'>
                        <Card fluid>
                            <Card.Content className='bg-color-app'>
                                <p className='color-white-text'>{this.props.t('setting.change_password')}</p>
                            </Card.Content>
                            <Card.Content className='p-t-2'>
                                <Card.Description>
                                    <ChangePassword/>
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid>
            </Segment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user:state.app.user
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        changePaswword:(data) => {
            return dispatch(actChangePassword(data))
        }
    };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Setting));
