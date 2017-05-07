import React, { Component } from 'react';

import constants from '../../core/shared/constants';

import Message from './functionnals/Message';
import Input from './Input';

export default class Chat extends Component{

    constructor(props){
        super(props);
        this.state = {
            messages: []
        };
        this.bind();
        this.handleSubmitMessage = this.handleSubmitMessage.bind(this);
    }

    bind(){
        this.props.socket.on(constants.chat.NEW_MESSAGE, function (message) {
            let m = this.state.messages.slice();
            m.push(this.formatMessage(message));
            this.setState({messages: m});
        }.bind(this));

        this.props.socket.on(constants.chat.MAJ_MESSAGES, function (messages) {
             this.setState({messages: messages.map(function (msg) {
                return this.formatMessage(msg);
            }.bind(this))});
        }.bind(this));
    }

    formatMessage(message){
        return <Message key={message.time}  user={message.username} type={message.type} content={message.message} time={message.time}/>;
    }

    handleSubmitMessage(content){
        this.props.socket.emit(constants.user.SEND_MESSAGE, content);
    }

    render(){
        console.log(this.state.messages);
        return (
            <div>
                <div>
                    {this.state.messages}
                </div>
                <Input submitHook={this.handleSubmitMessage} text="envoyer"/>
            </div>
        )
    }

}