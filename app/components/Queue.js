import React, { Component } from 'react';

import constants from '../../core/shared/constants';

export default class Queue extends Component{

    constructor(props){
        super(props);
        this.state = {
            subscribed: false
        };
        this.bind();
        this.handleSubscribe = this.handleSubscribe.bind(this);
    }

    bind(){
        this.props.socket.on(constants.queue.ENTER_QUEUE_ACK, function () {
            this.setState({subscribed: true});
        }.bind(this));

        this.props.socket.on(constants.queue.LEAVE_QUEUE_ACK, function () {
            this.setState({subscribed: false});
        }.bind(this));
    }

    handleSubscribe(){
        if(this.state.subscribed){
            this.props.socket.emit(constants.queue.LEAVE_QUEUE);
        }
        else{
            this.props.socket.emit(constants.queue.ENTER_QUEUE);
        }
    }

    render(){
        if(this.state.subscribed){
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