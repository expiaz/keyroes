import React, { Component } from 'react';

import constants from '../../core/shared/constants';

export default class Queue extends Component{

    constructor(props){
        super(props);
        this.state = {
            subscribed: 0
        };
        this.handleSubscribe = this.handleSubscribe.bind(this);
        this.sync = this.sync.bind(this);
        this.triggered = this.triggered.bind(this);
    }

    componentDidMount(){
        this.props.socket.on(constants.user.SYNCHRONIZE, this.sync);
        this.props.socket.on(constants.queue.TRIGGERED, this.triggered);

        this.props.socket.emit(constants.user.NEED_SYNC);
    }

    componentWillUnmount(){
        this.props.socket.removeListener(constants.user.SYNCHRONIZE, this.sync);
        this.props.socket.removeListener(constants.queue.TRIGGERED, this.triggered);
    }

    sync(state){
        if(state.state === constants.state.IN_QUEUE && state.hasOwnProperty('queue')){
            this.setState({subscribed: state.queue ? 1 : 0});
        }
        else if(state.state === constants.state.IN_MATCH && state.hasOwnProperty('match')){
            this.setState({subscribed: -1});
        }
        else{
            this.setState({subscribed: 0});
        }
    }

    triggered(){
        this.setState({
            subscribed: -1
        });
    }

    handleSubscribe(){
        if(this.state.subscribed){
            this.props.socket.emit(constants.queue.LEAVE_QUEUE);
            this.setState({subscribed: 0});
        }
        else{
            this.props.socket.emit(constants.queue.ENTER_QUEUE);
            this.setState({subscribed: 1});
        }
    }

    render(){

        if(this.state.subscribed === -1){
            return (
                <div>
                    Match Found
                </div>
            )
        }

        if(!! this.state.subscribed){
            return (
                <div>
                    Waiting for a match ...
                    <button onClick={this.handleSubscribe}>Leave queue</button>
                </div>
            )
        }

        return (
            <button onClick={this.handleSubscribe}>Join queue</button>
        )
    }

}