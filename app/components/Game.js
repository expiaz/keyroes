import React, { Component } from 'react';

import constants from '../../core/shared/constants';

export default class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [],
            scores: [],
            time: null,
            letter: null
        };

        this.sync = this.sync.bind(this);
        this.majScore = this.majScore.bind(this);
        this.majHistory = this.majHistory.bind(this);
        this.newLetter = this.newLetter.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
        this.clockTick = this.clockTick.bind(this);
    }

    componentDidMount() {
        this.props.socket.on(constants.user.SYNCHRONIZE, this.sync);
        this.props.socket.on(constants.game.NEXT_LETTER, this.newLetter);
        this.props.socket.on(constants.game.MAJ_HISTORY, this.majHistory);
        this.props.socket.on(constants.game.MAJ_POINTS, this.majScore);
        this.props.socket.on(constants.game.CLOCK_TICK, this.clockTick);

        window.addEventListener('keypress', this.handleKeypress)

        this.props.socket.emit(constants.user.NEED_SYNC);
    }

    componentWillUnmount() {
        this.props.socket.removeListener(constants.user.SYNCHRONIZE, this.sync);
        this.props.socket.removeListener(constants.game.NEXT_LETTER, this.newLetter);
        this.props.socket.removeListener(constants.game.MAJ_HISTORY, this.majHistory);
        this.props.socket.removeListener(constants.game.MAJ_POINTS, this.majScore);
        this.props.socket.removeListener(constants.game.CLOCK_TICK, this.clockTick);

        window.removeEventListener('keypress', this.handleKeypress)
    }

    sync(state) {
        if (state.hasOwnProperty('game')) {
            this.majHistory(state.game.history);
            this.majScore(state.game.scores);
        }
    }

    isValid(code){
        return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
    }

    handleKeypress(e){
        const keycode = e.which || e.keycode

        console.log(keycode, this.isValid(keycode))

        if(! this.isValid(keycode)) return;

        this.props.socket.emit(constants.user.KEYPRESS, keycode);
    }

    newLetter(letter){
        this.setState(actualState => ({
            letter
        }))
    }

    clockTick(time){
        this.setState(actualState => ({
            time
        }))
    }


    /*
    history schema :
    [
         {
             user: string,
             valid: bool,
             code: int
         }
     ]
     */
    majHistory(history){
        this.setState(actualState => ({
            history
        }))
    }


    /*
     scores schema:
     [
         {
             username: string,
             score: int,
             streak: int
         }
     ]
     */
    majScore(score){
        console.log('majScore', score)
        this.setState(actualState => ({
            scores: score
        }))
    }

    render(){

        let timeValue = parseInt(this.state.time !== null ? this.state.time.time : 60),
            letterStyle = {};

        if(this.state.letter !== null){
            letterStyle = {
                left: this.state.letter.x + '%',
                top: this.state.letter.y + '%',
                color: this.state.letter.color
            }
        }

        console.log(this.state)

        return (
            <div className="game container">
                <header className="scores row">
                    {this.state.scores.map((score, i) => <div key={i} className="col-md-2">
                        <h4>{score.username}</h4>
                        <span><strong>{score.score}</strong> <small>x{score.streak}</small></span>
                    </div>)}
                    <div className="timer">
                        {timeValue}
                        <progress min="0" max="60" value={timeValue}>{timeValue}</progress>
                    </div>
                </header>
                <div className="row">
                    <div className="gameboard col-md-8">
                        {this.state.letter !== null && <div className="letter-tile" style={letterStyle}>{String.fromCharCode(this.state.letter.code)}</div>}
                    </div>
                    <div className="history col-md-4">
                        {this.state.history.map((entry, i) => <div key={i} className="col-md-12 entry">
                            {entry.user} : <span className="entry-letter" style={{color: entry.valid ? 'green' : 'red'}}>{String.fromCharCode(entry.code)}</span>
                        </div>)}
                    </div>
                </div>
            </div>
        )
    }

}