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
    }

    componentDidMount(){
        this.props.socket.on(constants.hall.ENTER_HALL, this.enterHall.bind(this));
        this.props.socket.on(constants.game.ENTER_GAME, this.enterGame.bind(this));
        this.props.socket.on(constants.user.RESOLVE, this.resolve.bind(this));
    }

    componentWillUnmout(){
        this.props.socket.removeListener(constants.hall.ENTER_HALL, this.enterHall);
        this.props.socket.removeListener(constants.game.ENTER_GAME, this.enterGame);
        this.props.socket.removeListener(constants.user.RESOLVE, this.resolve);
    }

    resolve(state){
        if(state.state === constants.state.IN_GAME) {
            this.enterGame();
        }
    }

    enterHall(){
        this.setState({state: constants.state.IN_HALL});
    }

    enterGame(){
        this.setState({state: constants.state.IN_GAME});
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