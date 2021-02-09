import React, { Component } from 'react';
import { Segment, Grid, Header, Image } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';
import params from '../config/params';
import config_routes from '../config/routes';

class Fullscreen extends Component {

    constructor(props) {
        super(props);

        let header_logo = document.getElementById('header_logo');

        this.state = {
            maxHeight: window.innerHeight,
            heightHeader: header_logo?header_logo.offsetHeight:0
        }

        window.onresize = () => {
            let header_logo = document.getElementById('header_logo');

            this.setState({
                maxHeight:window.innerHeight,
                heightHeader: header_logo?header_logo.offsetHeight:0
            });
        }

        window.onload = () => {
            let header_logo = document.getElementById('header_logo');

            this.setState({
                maxHeight:window.innerHeight,
                heightHeader: header_logo?header_logo.offsetHeight:0
            });
        }
    }

    render() {
        const { maxHeight, heightHeader } = this.state;

        return (
            <Segment basic className='p-0'>
            	<Grid className='p-0 m-0 pos-fixed w-100 h-100' style={{backgroundColor:params.PRIMARY_COLOR}} centered>
            		<Grid.Row className='p-0'>
	                	<Grid.Column computer={9} tablet={8} only='computer tablet' style={{height:'100%', backgroundColor:'#fafafa', display: 'flex', alignItems: 'center'}}>
                            <Segment basic style={{margin:'0 auto'}}>
    	                		<Image src={base_resources+"/images/logo_icon/logo_lg.png"} size='medium' centered className={'history' in this.props?'cursor_pointer':''} onClick={() => {
                                    if('history' in this.props){
                                        this.props.history.push(config_routes.home.path)
                                    }
                                }}/>
                                <Grid centered style={{paddingTop:'2rem'}}>
                                    <p style={{textAlign:'center', maxWidth: '400px'}}>{this.props.t('message_full_screen')}</p>
                                </Grid>
                            </Segment>
	                	</Grid.Column>

                        <Grid.Column id='header_logo' mobile={14} only='mobile' className='p-1'>
                            <Image src={base_resources+"/images/logo_icon/logo_md_white.png"} size='medium' centered className={'history' in this.props?'cursor_pointer':''} onClick={() => {
                                if('history' in this.props){
                                    this.props.history.push(config_routes.home.path)
                                }
                            }}/>
                        </Grid.Column>

	                	<Grid.Column computer={7} tablet={8} mobile={14} verticalAlign="middle" style={{overflowY:'auto', maxHeight:(maxHeight - heightHeader)+'px'}}>
	                		{this.props.content}
	                	</Grid.Column>
            		</Grid.Row>
            	</Grid>
            </Segment>
        );
    }
}

export default withTranslation()(Fullscreen);
