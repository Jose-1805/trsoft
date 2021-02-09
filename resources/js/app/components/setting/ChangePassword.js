import React, { Component } from 'react';
import { Segment, Message } from 'semantic-ui-react';
import { Btn, FullForm, GeneralMessage } from '../helpers/Helpers';
import { withTranslation } from 'react-i18next';

import { connect } from 'react-redux';
import { actChangePassword } from '../../redux/app/actions';

class ChangePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fields:[],
            ButtonSubmit:Btn.Update,
            props_button_submit:{fluid:true},
            loading:false,
            show_msg_change_password_success:false,
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
                        name:"current_password",
                        min_length:8,
                        max_length:60,
                        type:"password",
                        id:"current_password",
                        label:this.props.t('setting.current_password_label'),
                        placeholder:this.props.t('setting.current_password_placeholder'),
                        required:true
                    }
                },
                {
                    field_type:"input",
                    field_props:{
                        name:"new_password",
                        min_length:8,
                        max_length:60,
                        type:"password",
                        id:"new_password",
                        label:this.props.t('setting.new_password_label'),
                        placeholder:this.props.t('setting.new_password_placeholder'),
                        required:true
                    }
                },
                {
                    field_type:"input",
                    field_props:{
                        name:"new_password_confirmation",
                        min_length:8,
                        max_length:60,
                        type:"password",
                        id:"new_password_confirmation",
                        label:this.props.t('setting.password_confirmation_label'),
                        placeholder:this.props.t('setting.password_confirmation_placeholder'),
                        required:true
                    }
                }
            ]
        })
    }

    render() {
        const { ButtonSubmit, show_msg_change_password_success, props_button_submit, fields, loading, errors } = this.state;
        return (
            <Segment basic loading={loading} className='p-0'>
                <FullForm 
                    fields={fields} 
                    ButtonSubmit={ButtonSubmit} 
                    props_button_submit={props_button_submit} 
                    content_before_submit={show_msg_change_password_success?
                    <Message
                        icon='check circle'
                        positive
                        content={this.props.t('setting.msg_change_password_success')}
                      />:<GeneralMessage error messages={errors} onDismiss={() => this.setState({errors:[]})}/>}
                    onSubmit={(data) => {                                    
                        this.setState({loading:true});

                        this.props.changePaswword(data).then((data) => {
                            if(data == 'Unauthorized.'){
                                alert(this.props.t('error_try_again'));
                            }else{
                                if(data.status == 200){
                                    this.setState({
                                        loading:false,
                                        errors:[],
                                        fields:[],
                                        show_msg_change_password_success:true,
                                        ButtonSubmit:Segment
                                    });

                                    setTimeout(() => {
                                    	this.setFields();
                                        this.setState({
                                            show_msg_change_password_success:false
                                        })
                                    }, 7000);
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
            </Segment>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
}

const mapDispatchToProps = (dispatch) => {
    return {
        changePaswword:(data) => {
            return dispatch(actChangePassword(data))
        }
    };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ChangePassword));