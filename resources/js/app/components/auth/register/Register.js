import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { actRegister } from '../../../redux/app/actions';

import { Segment, Grid } from 'semantic-ui-react';
import { FullForm, Btn, GeneralMessage } from '../../helpers/Helpers';
import Fullscreen from '../../Fullscreen';
import config_routes from '../../../config/routes';
import params from '../../../config/params';

import { withTranslation, Trans } from 'react-i18next';

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fields:[],
            ButtonSubmit:Btn.Register,
            props_button_submit:{fluid:true},
            loading:true,
            token_recaptcha:null,
            errors:[]
        };

        this.setFields = this.setFields.bind(this);
        this.loadTokenCaptcha = this.loadTokenCaptcha.bind(this);
    }

    componentDidMount() {
        this.loadTokenCaptcha();
        this.setFields();
    }

    loadTokenCaptcha(){
        this.setState({
            loading:true
        });
        grecaptcha.execute(params.GOOGLE_API_KEY, {action:'register'}).then((token) => {
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
        let max_date = new Date();
        max_date.setFullYear(max_date.getFullYear() - 18);
        max_date = (max_date.toJSON().split('T')[0]).split('-');
        max_date = max_date[0]+'-'+max_date[1]+'-'+max_date[2];

        this.setState({
            fields:[
                {
                    field_type:"input",
                    field_props:{
                        name:"name",
                        type:"text",
                        id:"name_",
                        label:this.props.t('auth.name_label'),
                        required:true,
                        inverted:true
                    }
                },
                {
                    field_type:"input",
                    field_props:{
                        name:"email",
                        email:true,
                        type:"text",
                        id:"email",
                        label:this.props.t('auth.email_label'),
                        required:true,
                        inverted:true
                    }
                },
                {
                    field_type:"input",
                    field_props:{
                        name:"cell_phone_number",
                        type:"text",
                        integer:true,
                        id:"cell_phone_number",
                        label:this.props.t('auth.cell_phone_number_label'),
                        required:true,
                        inverted:true
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
                        label:this.props.t('auth.password_label'),
                        required:true,
                        inverted:true
                    }
                },
                {
                    field_type:"input",
                    field_props:{
                        name:"password_confirmation",
                        min_length:8,
                        max_length:60,
                        type:"password",
                        id:"password_confirmation",
                        label:this.props.t('auth.password_confirmation_label'),
                        required:true,
                        inverted:true
                    }
                },
                {
                    field_type:"checkbox",
                    field_props:{
                        name:"check_t&c",
                        type:"checkbox",
                        id:"check_t&c",
                        label:<label htmlFor='check_t&c'><Trans i18nKey='auth.t_c_msg'>
                            I confirm that I am 18 years or older and that I have read and accept the <a href={config_routes.terms_and_conditions.path} target='_blank'>TrSoft Terms and Conditions</a>, as well as the <a href={config_routes.privacy_policy.path} target='_blank'>Privacy Policy.</a>
                        </Trans></label>,
                        required:true,
                    }
                }
            ]
        })
    }

    render() {
        const {ButtonSubmit, props_button_submit, fields, loading, errors} = this.state;

        let register_render = <Segment loading={loading} basic className='p-0 m-0'>
                    <Grid centered>
                        <Grid.Column computer={10} tablet={12} mobile={15} className='p-t-5 p-b-5'>
                            <FullForm 
                                fields={fields} 
                                ButtonSubmit={ButtonSubmit} 
                                props_button_submit={props_button_submit} 
                                content_before_submit={<GeneralMessage error messages={errors} onDismiss={() => this.setState({errors:[]})}/>}
                                onSubmit={(data) => {
                                    data.token_recaptcha = this.state.token_recaptcha;
                                    
                                    this.setState({loading:true});

                                    this.props.register(data).then((data) => {
                                        this.loadTokenCaptcha();
                                        if(data == 'Unauthorized.'){
                                            alert(this.props.t('error_try_again'));
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
                                    });
                                }}
                                inverted
                            />
                        
                            <Segment basic inverted>
                                <Trans i18nKey="auth.login_msg">
                                    If you already have a user account, <Link to={config_routes.login.path}>click here</Link> to access the system.
                                </Trans>
                            </Segment>
                        </Grid.Column>
                    </Grid>
                </Segment>
        return (
            <Fullscreen content={register_render} history={this.props.history}/>    
        );
    }
}   

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {
        register: (data) => {
            return dispatch(actRegister(data))
        }
    }
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Register));