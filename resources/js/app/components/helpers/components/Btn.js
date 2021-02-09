import React, { Component } from 'react';

import { Button, Icon, Dropdown } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';

const props_exceptions = ['tReady', 't'];

const getProps = (props) => {
    let data = {};

    for(let key in props){
        if(!props_exceptions.includes(key)){
            data[key] = props[key];
        }
    }
    return data;
}

const Save = (props) => {                        
    return (
        <Button {...getProps(props)} primary labelPosition='right' icon><Icon name="save"/> {props.t('btn.save')}</Button>
    );
}

const Login = (props) => {
    return (
        <Button {...getProps(props)} primary labelPosition='right' icon><Icon name="sign-in alternate"/> {props.t('btn.login')}</Button>
    );
}

const Register = (props) => {                        
    return (
        <Button {...getProps(props)} primary labelPosition='right' icon><Icon name="sign-in"/> {props.t('btn.register')}</Button>
    );
}

const Logout = (props) => {                        
    return (
        <Button {...getProps(props)} primary labelPosition='right' icon><Icon name="sign-out"/> {props.t('btn.logout')}</Button>
    );
}

const Close = (props) => {
    return (
        <Button {...getProps(props)} labelPosition='left' icon><Icon name="remove"/> {props.t('btn.close')}</Button>
    );
}

const CloseOnlyIcon = (props) => {
    return (
        <Button {...getProps(props)} icon='remove'/>
    );
}

const Update = (props) => {
    return (
        <Button {...getProps(props)} primary labelPosition='left' icon><Icon name="pencil alternate"/> {props.t('btn.update')}</Button>
    );
}

const UpdateOnlyIcon = (props) => {
    return (
        <Button {...getProps(props)} primary icon="pencil alternate"/>
    );
}

const Delete = (props) => {
    return (
        <Button {...getProps(props)} negative labelPosition='left' icon><Icon name="trash alternate"/> {props.t('btn.delete')}</Button>
    );
}

const Add = (props) => {
    return (
        <Button {...getProps(props)} positive labelPosition='left' icon><Icon name="plus"/> {props.t('btn.add')}</Button>
    );
}

const Accept = (props) => {
    return (
        <Button {...getProps(props)} positive labelPosition='left' icon><Icon name="check"/> {props.t('btn.accept')}</Button>
    );
}

const Cancel = (props) => {
    return (
        <Button {...getProps(props)} labelPosition='left' icon><Icon name="remove"/> {props.t('btn.cancel')}</Button>
    );
}

const Yes = (props) => {
    return (
        <Button {...getProps(props)} positive labelPosition='left' icon><Icon name="check"/> {props.t('btn.yes')}</Button>
    );
}

const No = (props) => {
    return (
        <Button {...getProps(props)} labelPosition='left' icon><Icon name="remove"/> {props.t('btn.no')}</Button>
    );
}

const Lock = (props) => {
    return (
        <Button {...getProps(props)} color="orange" labelPosition='left' icon><Icon name="lock"/> {props.t('btn.lock')}</Button>
    );
}

const Unlock = (props) => {
    return (
        <Button {...getProps(props)} color="orange" labelPosition='left' icon><Icon name="lock open"/> {props.t('btn.unlock')}</Button>
    );
}

const LockOnlyIcon = (props) => {
    return (
        <Button {...getProps(props)} color="orange" icon="lock"/>
    );
}

const UnlockOnlyIcon = (props) => {
    return (
        <Button {...getProps(props)} color="orange" icon="lock open"/>
    );
}

const BitacoraIcon = (props) => {
    return (
        <Button {...getProps(props)} positive icon="list"/>
    );
}

const SettingsIcon = (props) => {
    return (
        <Button {...getProps(props)} primary icon="settings"/>
    );
}

const FilesIcon = (props) => {
    return (
        <Button {...getProps(props)} positive icon="file outline"/>
    );
}

const Send = (props) => {
    return (
        <Button {...getProps(props)} primary labelPosition='right' icon><Icon name="send"/> {props.t('btn.send')}</Button>
    );
}

const Next = (props) => {
    return (
        <Button {...getProps(props)} positive labelPosition='right' icon><Icon name="arrow right"/> {props.t('btn.next')}</Button>
    );
}

const Previous = (props) => {
    return (
        <Button {...getProps(props)} labelPosition='left' icon><Icon name="arrow left"/> {props.t('btn.previous')}</Button>
    );
}

const More = (props) => {
    return (
        <Button {...getProps(props)} primary labelPosition='right' icon><Icon name="eye"/> {props.t('btn.more')}</Button>
    );
}

const Return = (props) => {
    return (
        <Button {...getProps(props)} labelPosition='left' icon><Icon name="arrow left"/> {props.t('btn.return')}</Button>
    );
}

const Filters = (props) => {
    return (
        <Button {...getProps(props)} icon labelPosition='left' positive>
            <Icon name='filter' />
            {props.t('btn.filters')}
        </Button>
    );
}

const Activate = (props) => {
    return (
        <Button {...getProps(props)} icon labelPosition='left' positive>
            <Icon name='check' />
            {props.t('btn.activate')}
        </Button>
    );
}

const Pay = (props) => {
    return (
        <Button {...getProps(props)} icon labelPosition='left' positive>
            <Icon name='payment' />
            {props.t('btn.pay')}
        </Button>
    );
}

const PayU = (props) => {
    return (
        <Button {...getProps(props)} primary icon labelPosition='left' style={{backgroundColor:'#A6C307'}}>
            <Icon name='payment' inverted/>
            {props.t('btn.pay_u')}
        </Button>
    );

    /*return <Dropdown
        {...getProps(props)}
        text={props.t('btn.pay_u')}
        labeled
        button
        icon='payment'
        className='icon big'
        style={{backgroundColor:'#A6C307', color:'#fff', textAlign:'center'}}
      >
        <Dropdown.Menu>
            <Dropdown.Header icon='world' content={props.t('btn.select_your_country')} />
            <Dropdown.Divider />
            <Dropdown.Item text='Argentina' flag='ar' value="ARG" onClick={(e, data) => {'onLabelClick' in props?props.onLabelClick(e, data):null}}/>
            <Dropdown.Item text='Chile' flag='cl' value="CHI" onClick={(e, data) => {'onLabelClick' in props?props.onLabelClick(e, data):null}}/>
            <Dropdown.Item text='Colombia' flag='co' value="COL" onClick={(e, data) => {'onLabelClick' in props?props.onLabelClick(e, data):null}}/>
            <Dropdown.Item text='México' flag='mx' value="MEX" onClick={(e, data) => {'onLabelClick' in props?props.onLabelClick(e, data):null}}/>
            <Dropdown.Item text='Panamá' flag='pa' value="PAN" onClick={(e, data) => {'onLabelClick' in props?props.onLabelClick(e, data):null}}/>
            <Dropdown.Item text='Perú' flag='pe' value="PER" onClick={(e, data) => {'onLabelClick' in props?props.onLabelClick(e, data):null}}/>
            <Dropdown.Item text='Brasil' flag='br' value="BRA" onClick={(e, data) => {'onLabelClick' in props?props.onLabelClick(e, data):null}}/>
        </Dropdown.Menu>
      </Dropdown>*/
}

const PaySkrill = (props) => {
    return (
        <Button {...getProps(props)} primary icon labelPosition='left' style={{backgroundColor:'#811e68'}}>
            <Icon name='payment' inverted/>
            {props.t('btn.pay_skrill')}
        </Button>
    );
}

const StartNow = (props) => {
    return (
        <Button {...getProps(props)} icon labelPosition='left' positive>
            <Icon name='play' />
            {props.t('btn.start_now')}
        </Button>
    );
}

const SeeGuides = (props) => {
    return (
        <Button {...getProps(props)} icon labelPosition='right' primary>
            <Icon name='file text' />
            {props.t('btn.see_guides')}
        </Button>
    );
}

class Btn extends Component {
    static Save = withTranslation()(Save);
    static Close = withTranslation()(Close);
    static CloseOnlyIcon = withTranslation()(CloseOnlyIcon);
    static Update = withTranslation()(Update);
    static Delete = withTranslation()(Delete);
    static Add = withTranslation()(Add);
    static Accept = withTranslation()(Accept);
    static Cancel = withTranslation()(Cancel);
    static Yes = withTranslation()(Yes);
    static No = withTranslation()(No);
    static UpdateOnlyIcon = withTranslation()(UpdateOnlyIcon);
    static Lock = withTranslation()(Lock);
    static Unlock = withTranslation()(Unlock);
    static LockOnlyIcon = withTranslation()(LockOnlyIcon);
    static UnlockOnlyIcon = withTranslation()(UnlockOnlyIcon);
    static Send = withTranslation()(Send);
    static Next = withTranslation()(Next);
    static Previous = withTranslation()(Previous);
    static More = withTranslation()(More);
    static Return = withTranslation()(Return);
    static BitacoraIcon = withTranslation()(BitacoraIcon);
    static SettingsIcon = withTranslation()(SettingsIcon);
    static FilesIcon = withTranslation()(FilesIcon);
    static Login = withTranslation()(Login);
    static Logout = withTranslation()(Logout);
    static Register = withTranslation()(Register);
    static Filters = withTranslation()(Filters);
    static Activate = withTranslation()(Activate);
    static Pay = withTranslation()(Pay);
    static PayU = withTranslation()(PayU);
    static PaySkrill = withTranslation()(PaySkrill);
    static StartNow = withTranslation()(StartNow);
    static SeeGuides = withTranslation()(SeeGuides);

    render() {
        return (
          	<Button {...this.props}>
            	{
            		this.props.value?
            			this.props.value:
            			(
            				this.props.children?
            					this.props.children:
            					"Botón"
        				)	
        		}
            </Button>  
        );
    }
}

export default Btn;
