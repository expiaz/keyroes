import React, { Component } from 'react';
import constants from '../../core/shared/constants';

import Queue from './Queue';
import Match from './Match';

class MmaManager extends Component{

    constructor(props){
        super(props);

        this.state = {
            state: constants.state.IN_HALL
        }

    }

    componentDidMount(){

    }

}