import React, { Component, PropTypes } from 'react';

import { Image, Grid } from 'semantic-ui-react';

class Empty extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          	<Grid centered verticalAlign='middle' className='m-t-2'>  
          		<Grid.Column computer='7' tablet='8' mobile='14'>
          			<Image src={base_resources+'/images/empty.png'} />
          			<a className='font-x-small' target='blank' href="https://www.freepik.es/fotos-vectores-gratis/caja">Vector de Caja creado por stories - www.freepik.es</a>
          		</Grid.Column>
          		<Grid.Column computer='6' tablet='5' mobile='14'>
          			<p className='font-large font-weight-500'>{this.props.message}</p>
          		</Grid.Column>
          	</Grid>  
        );
    }
}

export default Empty;
