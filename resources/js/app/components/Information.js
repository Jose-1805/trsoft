import React, { Component } from 'react';

import { Segment, Header, Image, Grid, Divider } from 'semantic-ui-react';

class Information extends Component {

    constructor(props) {
        super(props);

        
        this.state = {
        	marginTop:0
        }

        this.setHeightHeader = this.setHeightHeader.bind(this);

        window.onresize = () => {
        	this.setHeightHeader();	
        }

        window.onload = () => {
        	this.setHeightHeader();
        }

        this.setHeightHeader();
    }

    setHeightHeader(){
        let height = document.getElementById('header-information');
        if(height)
	    	this.setState({
	    		marginTop:height.offsetHeight
	    	})
    }

    render() {
    	const { marginTop } = this.state;

        return (
            <Segment basic className='p-0 m-0'>
            	<Segment id='header-information' className='pos-fixed w-100 p-1 z-depth-1' style={{top:0, zIndex:1}}>
	            	<Grid centered verticalAlign='middle'>
	            		<Grid.Column computer='3' tablet='4' mobile='10'>
	        	          	<Image src={base_resources+'/images/logo_icon/logo_xs.png'} centered/>
	            		</Grid.Column>

	            		<Grid.Column computer='5' tablet='8' only='computer tablet'>
	        	          	{
		        	         	'title' in this.props && <Header as='h1' className='p-l-2' style={{borderLeft:'1px solid #b6b6b6'}}>
		        	         		{this.props.title}
		        	         	</Header>
		        	         }
	            		</Grid.Column>

	            		<Grid.Column mobile='15' only='mobile'>
	        	          	{
		        	         	'title' in this.props && <Header as='h1' textAlign='center'>
		        	         		{this.props.title}
		        	         	</Header>
		        	         }
	            		</Grid.Column>
	            	</Grid>
            	</Segment>

            	<Segment basic style={{marginTop}}>
	        	    {'content' in this.props && this.props.content}
	            </Segment>
            </Segment>
        );
    }
}

export default Information;
