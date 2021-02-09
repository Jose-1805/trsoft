import React, { Component } from 'react';
import { Segment, Message, Grid, Divider } from 'semantic-ui-react';
import { Btn, FullForm, GeneralMessage } from '../helpers/Helpers';
import { withTranslation, Trans } from 'react-i18next';

import { connect } from 'react-redux';
import { actLoginIq } from '../../redux/app/actions';
import { Link } from 'react-router-dom';
import config_routes from '../../config/routes';

class LoginIq extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fields:[],
            ButtonSubmit:Btn.Login,
            props_button_submit:{fluid:true},
            loading:false,
            show_msg_access_success_broker:false,
            errors:[]
        };

        this.setFields = this.setFields.bind(this);
    }

    componentDidMount() {
        this.setFields();   
    }

    componentWillReceiveProps(nextProps) {
        if('t' in nextProps){
            this.setFields();   
        }
    }

    setFields(){

        this.setState({
            fields:[
                {
                    field_type:"input",
                    field_props:{
                        name:"user",
                        type:"text",
                        id:"user",
                        label:this.props.t('setting.user_label'),
                        placeholder:this.props.t('setting.user_placeholder'),
                        required:true
                    }
                },
                {
                    field_type:"input",
                    field_props:{
                        name:"password",
                        type:"password",
                        id:"password",
                        label:this.props.t('setting.password_label'),
                        placeholder:this.props.t('setting.password_placeholder'),
                        required:true
                    }
                }
            ]
        })
    }

    render() {
        const { ButtonSubmit, show_msg_access_success_broker, props_button_submit, fields, loading, errors } = this.state;
        const { user } = this.props;
        return (
            <Segment basic loading={loading} className='p-0'>
            	<Grid divided verticalAlign = 'middle'>
            		<Grid.Column computer='9' tablet='16'>
            			{
            				user.ssid?<Message
	            				success
	            				icon='check circle'
	            				content={this.props.t('setting.broker_actived')}
	            			/>:<Segment>
    	            			<Message
    	            				warning
    	            				icon='warning'
    	            				content={this.props.t('setting.broker_inactived')}
    	            			/>
                                <Message
                                    content={<a className='font-sm' target='_blank' href='https://iqoption.com/es/register'>{this.props.t('setting.link_register_iqoption')}</a>}
                                />
                            </Segment>
	            		}
            			<Message
            				info
            				icon='certificate'
	            			content={this.props.t('setting.broker_secure_data')}
            			/>
            		</Grid.Column>

            		<Grid.Column computer='7' tablet='16'>
		                <FullForm 
		                    fields={fields} 
		                    ButtonSubmit={ButtonSubmit} 
		                    props_button_submit={props_button_submit} 
		                    content_before_submit={show_msg_access_success_broker?
		                    <Message
		                        icon='check circle'
		                        positive
		                        content={<Trans i18nKey="setting.access_success_broker">
                                        a <Link to={config_routes.service.path}>a</Link> a.
                                    </Trans>}
		                      />:<GeneralMessage error messages={errors} onDismiss={() => this.setState({errors:[]})}/>}
		                    onSubmit={(data) => {                                    
		                        this.setState({loading:true});

		                        this.props.loginIq(data).then((data) => {
		                            if(data == 'Unauthorized.'){
		                                alert(this.props.t('error_try_again'));
		                            }else{
		                                if(data.status == 200){
		                                    this.setState({
		                                        loading:false,
		                                        errors:[],
		                                        fields:[],
		                                        show_msg_access_success_broker:true
		                                    });

		                                    setTimeout(() => {
		                                    	this.setFields();
		                                    	this.setState({
		                                    		show_msg_access_success_broker:false	
		                                    	})
		                                    }, 45000)
		                                }else{
		                                    let new_errors = [];

		                                    for(let key in data.errors){
		                                        for(let i = 0; i < data.errors[key].length; i++){
		                                            new_errors.push(data.errors[key][i]);
		                                        }
		                                    }

		                                    this.setState({
		                                        loading:false,
		                                        errors:new_errors
		                                    });
		                                }
		                            }
		                        });
		                    }}
		                />
	                </Grid.Column>      
                    <Grid.Column computer='16'>
                        {
                            user.ssid?<Divider/>:''
                        }
                        
                        {
                            user.ssid?<Link to={config_routes.service.path}>{this.props.t('setting.link_service_msg')}</Link>:''
                        }
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
        loginIq:(data) => {
            return dispatch(actLoginIq(data))
        }
    };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(LoginIq));