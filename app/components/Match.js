import React, { Component } from 'react';

import constants from '../../core/shared/constants';

export default class Match extends Component{

    constructor(props){
        super(props);
        this.state = {
            angle: 0,
            time: 0,
            answer: -1,
            displayed: false,
            counter: []
        };

        this.handleAccept = this.handleAccept.bind(this);
        this.handleDecline = this.handleDecline.bind(this);

        console.log("match create");
    }

    componentDidMount(){
        this.props.socket.on(constants.match.ENTER_MATCH, this.enterMatch.bind(this));

        this.props.socket.on(constants.match.CLOCK_TICK, this.majClock.bind(this));

        this.props.socket.on(constants.match.MAJ_COUNTER, this.majCounter.bind(this));

        this.props.socket.on(constants.match.LEAVE_MATCH, this.leaveMatch.bind(this));

        this.props.socket.on(constants.user.RESOLVE, this.resolve.bind(this));
    }

    componentWillUnmout(){
        this.props.socket.removeListener(constants.match.ENTER_MATCH, this.enterMatch);

        this.props.socket.removeListener(constants.match.CLOCK_TICK, this.majClock);

        this.props.socket.removeListener(constants.match.MAJ_COUNTER, this.majCounter);

        this.props.socket.removeListener(constants.match.LEAVE_MATCH, this.leaveMatch);
    }

    resolve(state){
        console.log("match resolve", state);
        if(state.state === constants.state.IN_MATCH){
            this.enterMatch();
            if(state.hasOwnProperty('answerMatch')){
                if(state.answerMatch === constants.match.ACCEPT_MATCH){
                    this.setState({ answer: 1 });
                }
                else if(state.answerMatch === constants.match.DECLINE_MATCH){
                    this.setState({ answer: 0 });
                }
            }
        }
        else{
            this.leaveMatch();
        }
    }

    enterMatch(){
        this.setState({ displayed: true });
    }

    leaveMatch(){
        this.setState({
            angle: 0,
            time: 0,
            answer: -1,
            displayed: false,
            counter: []
        });
    }

    majClock(tick){
        this.setState({angle: tick.angle, time: tick.time});
    }

    majCounter(counter){
        console.log("Match majCounter", counter);
        this.setState({counter: counter});
    }

    handleAccept(){
        this.props.socket.emit(constants.match.ACCEPT_MATCH);
        this.setState({ answer: 1 });
    }

    handleDecline(){
        this.props.socket.emit(constants.match.DECLINE_MATCH);
        this.setState({ answer: 0 });
    }

    render(){

        let value = parseFloat(this.state.time * 20);

        return (
            <div style={{display: this.state.displayed ? 'block' : 'none'}}>
                <div>{this.state.counter.map((e) => e ? 'OK' : 'NO')}</div>
                <progress value={value} max="100">{this.state.time} sec left</progress>
                <div>{this.state.time} seconds</div>
                {this.state.answer !== -1
                    ? (
                        <div>
                            {
                                this.state.answer === 1
                                ? 'Accepted'
                                : 'Declined'
                            }
                        </div>
                    )
                    : (
                        <div>
                            <button onClick={this.handleAccept}>Accept</button>
                            <button onClick={this.handleDecline}>Decline</button>
                        </div>
                    )
                }
            </div>
        )

    }

}