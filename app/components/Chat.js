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
        this.handleSubmitMessage = this.handleSubmitMessage.bind(this);
    }

    componentDidMount(){
        this.props.socket.on(constants.chat.NEW_MESSAGE, this.newMessage.bind(this));
        this.props.socket.on(constants.chat.MAJ_MESSAGES, this.allMessages.bind(this));
    }

    componentWillUnmount(){
        this.props.socket.removeListener(constants.chat.NEW_MESSAGE, this.newMessage);
        this.props.socket.removeListener(constants.chat.MAJ_MESSAGES, this.allMessages);
    }

    newMessage(message){
        this.setState({messages: [...this.state.messages, this.formatMessage(message)] });
    }

    allMessages(messages){
        this.setState({messages: messages.map((msg) => this.formatMessage(msg)) });
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