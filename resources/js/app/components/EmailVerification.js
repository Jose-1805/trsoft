import React, { Component } from 'react';

import { Grid, Header, Image, Segment } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';

import config_routes from '../config/routes';
import params from '../config/params';

import axios from 'axios';

import { connect } from 'react-redux';

import { Btn, FullForm, GeneralMessage } from './helpers/Helpers';
import { actSyncUser } from '../redux/app/actions';
import { actAddNotification } from '../redux/notifications/actions';
import { actOpenFullLoader, actCloseFullLoader } from '../redux/fullLoader/actions';

class EmailVerification extends Component {

    constructor(props) {
        super(props);

        //document.getElementsByTagName('body')[0].classList.add('gradient-1');

        this.state = {
        	fields:[],
            ButtonSubmit:Btn.Send,
        	props_button_submit:{fluid:true, size:'big'},
            loading:false,
            errors:[]
        };

        this.setFields = this.setFields.bind(this);
        this.resendCode = this.resendCode.bind(this);
    }

    componentDidMount() {
        this.setFields();

        setTimeout(() => {
			this.props.showNotification({
	            header:this.props.t('help'),
	            message:this.props.t('help_msg'),
	            showButtonClose:true
	        });    
        }, 20000)    
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
        				name:"verification_code",
        				placeholder:this.props.t("email_verification.verification_code_placeholder"),
	        			integer:true,
	        			min_length:6,
	        			max_length:6,
	        			type:"password",
	        			id:"verification_code",
	        			label:this.props.t("email_verification.verification_code_label"),
	        			required:true
	        		}
        		}
        	]
        })
    }

    resendCode(){
    	this.props.openFullLoader(this.props.t('email_verification.sending')+'...')
    	axios.get(params.URL_API+'resend-verification-code/email').then(() => {
    		this.props.showNotification({
                message:this.props.t('email_verification.resend_msg'),
                showButtonClose:true,
                closeIn:15
            });
            this.props.closeFullLoader();
    	});
    }

    render() {
    	const { fields, ButtonSubmit, props_button_submit, loading, errors } = this.state;
        return (
        	<Segment loading={loading} basic>
	        	<Grid centered>
	        		<Grid.Column computer='6' tablet='12' mobile='15'>
	        			<Grid verticalAlign='middle' centered className='m-t-2'>
	        				<Grid.Column computer='16' tablet='14'>
			            		<Header as='h1' textAlign='center' className='font-xx-large'>{this.props.t('email_verification.title')}</Header>
	        				</Grid.Column>
	        				<Grid.Column computer='10'>
			            		<Image src={base_resources+'/images/logo_icon/logo_md.png'} centered/>
	        				</Grid.Column>
	        			</Grid>

			            <p className='justify m-t-2 m-b-3'>{this.props.t('email_verification.msg')}</p>
			            
			            <FullForm 
	            			fields={fields} 
	            			ButtonSubmit={ButtonSubmit} 
	            			props_button_submit={props_button_submit} 
	            			content_before_submit={<GeneralMessage error messages={errors} onDismiss={() => this.setState({errors:[]})}/>}
	            			onSubmit={(data) => {
	            				this.setState({loading:true});

	            				axios.post(params.URL_API+'validate-code/email', data)
	            				.then((response) => {
	            					document.cookie = 'welcome=1; path=/;';
	            					this.props.syncUser().then(() => {
	            						this.setState({loading:false});
	            					});
	            				}, (error) => {
	            					let data = error.response.data;
	            					let new_errors = [];

					                for(let key in data.errors){
					                     new_errors.push(this.props.t('email_verification.errors.'+data.errors[key]));
					                }

					                this.setState({
					                    loading:false,
					                    errors:new_errors
					                });
	            				})
	            			}}
	            		/>
	            		<Segment textAlign='center' basic>
	            			<a href='#!' onClick={this.resendCode}>{this.props.t('email_verification.resend_code')}</a>
	            		</Segment>
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
		syncUser:() => {
			return dispatch(actSyncUser());
		},
		showNotification:(data) => {
            dispatch(actAddNotification(data));
        },
        openFullLoader:(message) => {
            dispatch(actOpenFullLoader(message));
        },
        closeFullLoader:() => {
            dispatch(actCloseFullLoader());
        }
	};
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(EmailVerification));
