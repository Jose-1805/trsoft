import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Dropdown, Segment } from 'semantic-ui-react'


class SetLang extends Component {
    constructor(props) {
        super(props);

        this.changeLang = this.changeLang.bind(this);
        this.getCookieLang = this.getCookieLang.bind(this);
    }

    componentDidMount() {
        const current_lang = this.getCookieLang();
        if(current_lang){
            setTimeout(() => {
                this.changeLang(current_lang);
            }, 10);
        }
    }

    getCookieLang() {
        var name = "lang=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return false;
    }

    changeLang(lang){
        this.props.i18n.changeLanguage(lang);

        let date = new Date();
        date.setFullYear(date.getFullYear() + 2);

        document.cookie = "lang="+lang+"; expires="+date.toUTCString()+"; path=/";
    }

    render() {
    	const languageOptions = [
    		{ key: 'english', text: 'EN', value: 'en', image: { avatar: true, src: base_resources+'/images/english.png' }},
    		{ key: 'spanish', text: 'ES', value: 'es', image: { avatar: true, src: base_resources+'/images/spanish.png' } }
    	];

        return (
        	<Segment basic inverted basic compact style={{position:'fixed', zIndex: 2, right: 0, bottom: 0}}>
        		<Dropdown
				    pointing="right"
				    className='icon primary'
				    icon='world'
				    options={languageOptions}
				    onChange={(e, data) => {
                        this.changeLang(data.value);
				    }}
				 />
        	</Segment>
        );
    }
}

export default withTranslation()(SetLang);
