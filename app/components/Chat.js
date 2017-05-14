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

        this.sync = this.sync.bind(this);
        this.newMessage = this.newMessage.bind(this);
        this.allMessages = this.allMessages.bind(this);
    }

    componentDidMount(){
        this.props.socket.on(constants.user.SYNCHRONIZE, this.sync);
        this.props.socket.on(constants.chat.NEW_MESSAGE, this.newMessage);
        this.props.socket.on(constants.chat.MAJ_MESSAGES, this.allMessages);

        this.props.socket.emit(constants.user.NEED_SYNC);
    }

    componentWillUnmount(){
        console.log('Chat unmount');

        console.log(this.props.socket.removeListener(constants.user.SYNCHRONIZE, this.sync));
        console.log(this.props.socket.removeListener(constants.chat.NEW_MESSAGE, this.newMessage));
        console.log(this.props.socket.removeListener(constants.chat.MAJ_MESSAGES, this.allMessages));

        console.log('chat finished unmouting');
    }

    sync(state){
        if(state.hasOwnProperty('chat')){
            this.allMessages(state.chat.messages);
        }
    }

    newMessage(message){
        this.setState({messages: [...this.state.messages, this.formatMessage(message)] });
    }

    allMessages(messages){
        this.setState({messages: messages.map((msg) => this.formatMessage(msg)) });
    }

    formatMessage(message){
        return <Message key={message.time + Array.from(message.username).reduce((e,i,g) => message.username.charCodeAt(i) + g, 0) + Array.from(message.message).reduce((e,i,g) => message.message.charCodeAt(i) + g, 0)}  user={message.username} type={message.type} content={message.message} time={message.time}/>;
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