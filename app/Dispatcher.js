import React, { Component } from 'react';

import Chat from './components/Chat';
import Queue from './components/Queue';

import constants from '../core/shared/constants';
import Match from "./components/Match";
import SpectateManager from "./components/SpectateManager";


export default class Dispatcher extends Component{

    constructor(props){
        super(props);
        this.state = {
            state: constants.state.IN_HALL
        }

        this.enterHall = this.enterHall.bind(this);
        this.enterGame = this.enterGame.bind(this);
        this.sync = this.sync.bind(this);
    }

    componentDidMount(){
        this.props.socket.on(constants.hall.ENTER_HALL, this.enterHall);
        this.props.socket.on(constants.game.ENTER_GAME, this.enterGame);
        this.props.socket.on(constants.user.SYNCHRONIZE, this.sync);

        this.props.socket.emit(constants.user.NEED_SYNC);
    }

    componentWillUnmount(){
        this.props.socket.removeListener(constants.hall.ENTER_HALL, this.enterHall);
        this.props.socket.removeListener(constants.game.ENTER_GAME, this.enterGame);
        this.props.socket.removeListener(constants.user.SYNCHRONIZE, this.sync);
    }

    sync(state){

        console.log("SYNC", state);

        if(state.state === constants.state.IN_GAME) {
            return this.enterGame();
        }
        this.enterHall();
    }

    enterHall(){
        this.setState({state: constants.state.IN_HALL});
    }

    enterGame(){
        this.setState({state: constants.state.IN_GAME});
    }

    getHallLayout(){
        return (
            <div className="container">
                <Match socket={this.props.socket}/>
                <div className="col-md-8">
                    <SpectateManager socket={this.props.socket}/>
                    <Queue socket={this.props.socket} />
                </div>
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