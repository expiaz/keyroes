import React, { Component } from 'react';

import constants from '../../core/shared/constants';

export default class Queue extends Component{

    constructor(props){
        super(props);
        this.state = {
            subscribed: false
        };
        this.handleSubscribe = this.handleSubscribe.bind(this);
    }

    componentDidMount(){
        this.props.socket.on(constants.user.RESOLVE, this.resolve.bind(this));
    }

    componentWillUnmout(){
        this.props.socket.removeListener(constants.user.RESOLVE, this.resolve);
    }

    resolve(state){
        if(state.state === constants.state.IN_QUEUE){
            this.handleSubscribe();
        }
        else{
            this.setState({subscribed: false});
        }
    }

    handleSubscribe(){
        if(this.state.subscribed){
            this.props.socket.emit(constants.queue.LEAVE_QUEUE);
            this.setState({subscribed: false});
        }
        else{
            this.props.socket.emit(constants.queue.ENTER_QUEUE);
            this.setState({subscribed: true});
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