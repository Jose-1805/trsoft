import React, { Component } from 'react';

import { Segment, Grid, Header, List } from 'semantic-ui-react';

import General from './guides/General';
import ActivateLicense from './guides/ActivateLicense';
import BuyLicense from './guides/BuyLicense';
import CheckPayCommission from './guides/CheckPayCommission';
import StartCopyBinary from './guides/StartCopyBinary';

import { withTranslation } from 'react-i18next';
import params from '../../config/params';

class Guide extends Component {

    constructor(props) {
        super(props);

        this.state = {
            maxHeight: window.innerHeight,
            current_guide:<General/>
        }

        window.onresize = () => {
            this.setState({
                maxHeight:window.innerHeight
            });
        }
    }

    render() {
        const { maxHeight, current_guide } = this.state;

        return (
            <Segment basic className='p-0'>
                <Grid centered className='p-0 m-0' style={{backgroundColor:params.SECONDARY_COLOR}}>
                    <Grid.Row className='p-0' only='computer tablet'>
                        <Grid.Column computer={4} tablet={6} mobile={16} className='p-0 h-100'>
                            <Segment inverted basic className='p-0 m-0'>
                                <List as='ul' divided inverted relaxed className='p-t-2'>
                                    <List.Item className='cursor_pointer hoverable-opacity' onClick={() => this.setState({current_guide: <General/>})}>{this.props.t('guide.general.item')}</List.Item>
                                    <List.Item className='cursor_pointer hoverable-opacity' onClick={() => this.setState({current_guide: <BuyLicense/>})}>{this.props.t('guide.buy_license.item')}</List.Item>
                                    <List.Item className='cursor_pointer hoverable-opacity' onClick={() => this.setState({current_guide: <ActivateLicense/>})}>{this.props.t('guide.active_license.item')}</List.Item>
                                    <List.Item className='cursor_pointer hoverable-opacity' onClick={() => this.setState({current_guide: <StartCopyBinary/>})}>{this.props.t('guide.start_copy_binary.item')}</List.Item>
                                    <List.Item className='cursor_pointer hoverable-opacity' onClick={() => this.setState({current_guide: <CheckPayCommission/>})}>{this.props.t('guide.check_pay_commission.item')}</List.Item>
                                </List>
                            </Segment>
                        </Grid.Column>

                        <Grid.Column computer={12} tablet={10} mobile={16} verticalAlign="middle" style={{overflowY:'auto', minHeight:maxHeight+'px', maxHeight:maxHeight+'px', backgroundColor:'#fafafa'}}>
                            {current_guide}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className='p-0' only='mobile'>
                        <Grid.Column computer={4} tablet={6} mobile={16} className='p-0'>
                            <Segment inverted basic className='p-0 m-0'>
                                <List as='ul' divided inverted relaxed className='p-t-4 p-b-2'>
                                    <List.Item className='cursor_pointer hoverable-opacity' onClick={() => this.setState({current_guide: <General/>})}>{this.props.t('guide.general.item')}</List.Item>
                                    <List.Item className='cursor_pointer hoverable-opacity' onClick={() => this.setState({current_guide: <BuyLicense/>})}>{this.props.t('guide.buy_license.item')}</List.Item>
                                    <List.Item className='cursor_pointer hoverable-opacity' onClick={() => this.setState({current_guide: <ActivateLicense/>})}>{this.props.t('guide.active_license.item')}</List.Item>
                                    <List.Item className='cursor_pointer hoverable-opacity' onClick={() => this.setState({current_guide: <StartCopyBinary/>})}>{this.props.t('guide.start_copy_binary.item')}</List.Item>
                                    <List.Item className='cursor_pointer hoverable-opacity' onClick={() => this.setState({current_guide: <CheckPayCommission/>})}>{this.props.t('guide.check_pay_commission.item')}</List.Item>
                                </List>
                            </Segment>
                        </Grid.Column>

                        <Grid.Column computer={12} tablet={10} mobile={16} style={{overflowY:'auto', backgroundColor:'#fafafa'}}>
                            {current_guide}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }
}

export default withTranslation()(Guide);
