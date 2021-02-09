import React, { Component, PropTypes } from 'react';
import { Segment, Header, Image } from 'semantic-ui-react';
import { withTranslation } from 'react-i18next';

class WorkingOnThis extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Segment basic textAlign='center' className='m-t-2'>
                <Image src={base_resources+'/images/working.png'} size='big' centered/>
                <a className='font-x-small' target='blank' href='https://www.freepik.es/fotos-vectores-gratis/acuarela'>Vector de Acuarela creado por freepik - www.freepik.es</a>
                <Header as='h1'>{this.props.t('working_on_this')}</Header>
            </Segment>
        );
    }
}

export default withTranslation()(WorkingOnThis);
