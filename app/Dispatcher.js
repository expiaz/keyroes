import React, { Component } from 'react';

import Chat from './components/Chat';
import Queue from './components/Queue';

import constants from '../core/shared/constants';
import Match from "./components/Match";


export default class Dispatcher extends Component{

    constructor(props){
        super(props);
        this.state = {
            state: constants.state.IN_HALL
        }
        this.bind();
    }

    bind(){
        this.props.socket.on(constants.hall.ENTER_HALL, function () {
            this.setState({state: constants.state.IN_HALL});
        }.bind(this));

        this.props.socket.on(constants.game.ENTER_GAME, function () {
            this.setState({state: constants.state.IN_GAME});
        }.bind(this));


    }

    getHallLayout(){
        return (
            <div>
                <Queue socket={this.props.socket} />
                <Match socket={this.props.socket}/>
                <Chat socket={this.props.socket} />
            </div>
        );
    }

    getGameLayout(){
        return <p>Game</p>;
    }


    render(){
        switch(this.state.state){
            case constants.state.IN_HALL:
                return this.getHallLayout();
            case constants.state.IN_GAME:
                return this.getGameLayout();
            default:
                return this.getHallLayout();
        }
    }

}