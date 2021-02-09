import React, { Component } from 'react';

import { Segment, Grid } from 'semantic-ui-react';
import { Btn } from '../Helpers';

class FixedBottomContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
        	content:''
        }
    }

    componentWillMount() {
        this.setState({
        	content:this.props.content
        })
    }

    render() {
    	const { content } = this.state;

    	if(!content)return <div/>

        return (
            <Segment basic className='pos-fixed w-100 p-b-2 p-t-2 z-depth-3' style={{bottom:0, zIndex:100, backgroundColor:'rgba(255,255,255,.98)', left:0}}>
				<Segment basic textAlign='right' className='p-0' style={{marginBottom:'-40px'}}>
            		<Btn.CloseOnlyIcon size='mini' onClick={() => this.setState({content:''})}/>
				</Segment>            	
            	<Grid centered>
            		<Grid.Column computer='14' tablet='12' mobile='15'>
            			{content}
            		</Grid.Column>
            	</Grid>
            </Segment>
        );
    }
}

export default FixedBottomContent;
