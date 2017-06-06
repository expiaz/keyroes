import React, { Component } from 'react';

import constants from '../../core/shared/constants';

import SpectateTile from './presentation/SpectateTile';

export default class SpectateManager extends Component{

    constructor(props){
        super(props);
        this.state = {
            games: []
        };

        this.sync = this.sync.bind(this);
    }

    componentDidMount(){
        this.props.socket.on(constants.user.SYNCHRONIZE, this.sync);

        this.props.socket.emit(constants.user.NEED_SYNC);
    }

    componentWillUnmount(){
        this.props.socket.removeListener(constants.user.SYNCHRONIZE, this.sync);
    }

    sync(state){
        /*
        state:{
            games: [
                {
                    players: [
                        {
                            score: int
                            username: string
                        }
                    ],
                    time: int
                },
                ...
            ]
        }
         */

        if(state.hasOwnProperty('games')){
            this.setState({games: state.games.map((e) => this.formatGameTile(e))});
        }
    }

    formatGameTile(game){
        console.log('format game tile');
        return <SpectateTile key={game.id} id={game.id} players={game.players}/>;
    }


    render(){

        return (
            <div className="spectate col-md-12">
                <h2>Actual Games : </h2>
                {this.state.games}
            </div>
        );

    }


}