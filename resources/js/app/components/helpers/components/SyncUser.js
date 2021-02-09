import React, { Component } from 'react';

import { connect } from 'react-redux';
import { actSyncUser } from '../../../redux/app/actions';
import { Button } from 'semantic-ui-react';

class SyncUser extends Component {

    constructor(props) {
        super(props);
        this.props.sync();
    }

    render() {
    	if('button' in this.props)
	        return (
	     		<Button icon='sync' onClick={this.props.sync}/>
	        );

	    return <div/>
    }
}

const mapStateToProps = (state) => {
	return {}
}

const mapDispacthToProps = (dispatch) => {
	return {
		sync:() => {
			return dispatch(actSyncUser());
		}
	}
}

export default connect(mapStateToProps, mapDispacthToProps)(SyncUser);
