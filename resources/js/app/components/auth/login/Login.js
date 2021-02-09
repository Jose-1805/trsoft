import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { actLogin } from '../../../redux/app/actions';

import { Segment, Grid } from 'semantic-ui-react';
import { FullForm, Btn, GeneralMessage } from '../../helpers/Helpers';
import Fullscreen from '../../Fullscreen';
import { withTranslation, Trans } from 'react-i18next';

import config_routes from '../../../config/routes';
import params from '../../../config/params';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	fields:[],
            ButtonSubmit:Btn.Login,
        	props_button_submit:{fluid:true},
            loading:true,
            token_recaptcha:null,
            errors:[]
        };

        this.loadTokenCaptcha = this.loadTokenCaptcha.bind(this);
        this.setFields = this.setFields.bind(this);
    }

    componentDidMount() {
        this.loadTokenCaptcha();
        this.setFields();
    }

    loadTokenCaptcha(){
        this.setState({
            loading:true
        });

        grecaptcha.execute(params.GOOGLE_API_KEY, {action: 'login'}).then((token) => {
            if(token){
                this.setState({
                    token_recaptcha:token,
                    loading:false
                });
            }else{
                alert('Error');
            }
        });
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
        				name:"username",
	        			email:true,
	        			type:"text",
	        			id:"username",
	        			label:this.props.t("auth.username_label"),
	        			required:true
	        		}
        		},
        		{
        			field_type:"input",
        			field_props:{
	        			name:"password",
	        			min_length:8,
	        			max_length:60,
	        			type:"password",
	        			id:"password",
	        			label:this.props.t("auth.password_label"),
	        			required:true
	        		}
        		},
        		{
        			field_type:"checkbox",
        			field_props:{
	        			name:"remember",
	        			id:"remember",
	        			label:this.props.t("auth.remember_label")
	        		}
        		}
        	]
        })
    }

    render() {
    	const { t } = this.props;
    	const {ButtonSubmit, props_button_submit, fields, loading, errors} = this.state;

    	let login_render = <Segment loading={loading} basic>
                    <Grid centered>
    					<Grid.Column computer={10} tablet={12} mobile={15}>
	                		<FullForm 
	                			fields={fields} 
	                			ButtonSubmit={ButtonSubmit} 
	                			props_button_submit={props_button_submit} 
                                content_before_submit={<GeneralMessage error messages={errors} onDismiss={() => this.setState({errors:[]})}/>}
	                			onSubmit={(data) => {
	                				this.setState({loading:true});
                                    
                                    data.token_recaptcha = this.state.token_recaptcha;

	                				this.props.login(data).then(() => {
                                        this.loadTokenCaptcha();
	                					this.setState({
	                						errors:[() => t('auth.login_error')]
	                					});
	                				});
	                			}}
                                inverted
	                		/>
                      	
	                        <Segment basic inverted>
		                        <Trans i18nKey="auth.register_msg">
							      	If you do not have a user account, <Link to={config_routes.register.path}>click here</Link> to register.
							    </Trans>
	                        </Segment>
    					</Grid.Column>
                    </Grid>
                    </Segment>
        return (
        	<Fullscreen content={login_render} history={this.props.history}/>	
        );
    }
}	

const mapStateToProps = (state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {
		login: (data) => {
			return dispatch(actLogin(data))
		}
	}
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Login));
