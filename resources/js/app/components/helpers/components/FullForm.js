import React, { Component, PropTypes } from 'react';

import { Form, Checkbox } from 'semantic-ui-react';
import { Valid } from '../Helpers';

class FullForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	field_values:{},
        	field_validations:{},

        	form_is_valid:false,
        	error:[],
        	fields:'fields' in props?props.fields:[],
        	ButtonSubmit:'ButtonSubmit' in props?props.ButtonSubmit:null,
        	props_button_submit:'props_button_submit' in props?props.props_button_submit:null,
        	loading:'loading' in props?props.loading:false
        }

        this.getInputField = this.getInputField.bind(this);
        this.getCheckboxField = this.getCheckboxField.bind(this);
        this.startForm = this.startForm.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onTrueValid = this.onTrueValid.bind(this);
        this.onFalseValid = this.onFalseValid.bind(this);
    }

    componentDidMount(){
        setTimeout(() => {
            this.startForm();
        }, 100);
    }

    componentWillReceiveProps(nextProps) {
        if('fields' in nextProps){

            this.setState({
                oading:'loading' in nextProps?nextProps.loading:false,
                fields:nextProps.fields,
            });
        }
    }

    /*==============================================
    =            Manejadores de eventos            =
    ==============================================*/    

    /**
     * Función para mantener actualizados y sincronizados los datos del form y el store
     * @param  {event}  e               evento que se produjo
     * @param  {String} options.name    Name del campo que produjo el evento
     */
    handleInputChange(e, {name}){
        //si es un checkbox se toma como valor el estado de checked
        //de lo contrario se toma el valor del campo
        let value = (e.target.type == 'checkbox')?e.target.checked:e.target.value;
        let values = this.state.field_values;
        values[name] = value;
        this.setState({ field_values:  values});
    }


    /*=====  Fin de Manejadores de eventos  ======*/


    /*=========================================================
    =            Estado de validaciòn de formulario            =
    =========================================================*/    

    setFormIsValid(){
        setTimeout(() => {

        	let last_form_is_valid = this.state.form_is_valid;

            let is_valid = true;

            _.map(this.state.field_validations, (value, key) => {
                if(!value)is_valid = false;
            });

            this.setState({
                form_is_valid:is_valid
            });

            if(is_valid != last_form_is_valid){
            	if('onFormIsValidChange' in this.props && typeof this.props.onFormIsValidChange == 'function'){
            		this.props.onFormIsValidChange(is_valid, this.state.field_values);
            	}
            }  
        }, 10)
    }

    onTrueValid({name}){
        this.setState((oldState, props) => {
            return {
                field_validations:Object.assign({},oldState.field_validations,{[name]:true})
            }
        });

        this.setFormIsValid();
    }

    onFalseValid({name}){
        this.setState((oldState, props) => {
            return {
                field_validations:Object.assign({},oldState.field_validations,{[name]:false})
            }
        });

        this.setFormIsValid();
    }

    /*=====  Fin de estado de validaciòn de formulario  ======*/

    startForm(){
    	let values = {};
    	let validations = {};

    	_.map(this.state.fields, (el, i) => {
    		values[el.field_props.name] = el.field_props.value?el.field_props.value:"";
    		validations[el.field_props.name] = (
    			el.field_props.required
    			|| el.field_props.min
			)?false:true;
    	})

    	this.setState({
    		field_values:values,
    		field_validations:validations
    	}, () => {
            this.setFormIsValid();
        })

    }

    getInputField(field_props, key){
    	return <Valid.Input
    		key={key}
    		{...field_props}
    		onTrueValid={this.onTrueValid} 
            onFalseValid={this.onFalseValid} 
            onChange={this.handleInputChange} 
    	/>
    }

    getCheckboxField(props, key){
    	return <Form.Field 
    		key={key}
    		{...props} 
    		control={Checkbox}
            inline
    		onChange={(e, data) => {
                this.handleInputChange(e, data);
                if(e.target.required && !e.target.checked){
                    this.onFalseValid(data);
                }else{
                    this.onTrueValid(data);
                }
            }}
    	/>
    }

    render() {
    	const {fields, loading, form_is_valid, ButtonSubmit, props_button_submit} = this.state;
        return (
        	<Form loading={loading?loading:false} inverted={'inverted' in this.props?this.props.inverted:false}>
            	{
            		_.map(fields, (el, i) => {
            			if(el.field_type == 'input')
		        			return this.getInputField(el.field_props, i);
            			else if(el.field_type == 'checkbox')
		        			return this.getCheckboxField(el.field_props, i);
		        	})
		        }

                {
                    'content_before_submit' in this.props?
                    this.props.content_before_submit:''
                }
		        <ButtonSubmit 
		        	{...props_button_submit}
		        	disabled={!fields.length?true:(form_is_valid?false:true)} 
		        	onClick={() => {
		        		if('onSubmit' in this.props && typeof this.props.onSubmit == 'function'){
		            		this.props.onSubmit(this.state.field_values);
		            	}
		        	}}
		        	/>
        	</Form>
        );
    }
}

export default FullForm;
