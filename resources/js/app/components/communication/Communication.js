import React, { Component, PropTypes } from 'react';
import { Segment } from 'semantic-ui-react';
import WorkingOnThis from '../WorkingOnThis';
import { withTranslation } from 'react-i18next';

class Communication extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Segment basic textAlign='center'>
                <WorkingOnThis/>
            </Segment>
        );
    }
}

export default withTranslation()(Communication);
