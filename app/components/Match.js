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

        this.bind();

        this.handleAccept = this.handleAccept.bind(this);
        this.handleDecline = this.handleDecline.bind(this);
    }

    bind(){
        this.props.socket.on(constants.match.ENTER_MATCH, function () {
            this.setState({ displayed: true });
        }.bind(this));

        this.props.socket.on(constants.match.CLOCK_TICK, function (tick) {
            this.setState({angle: tick.angle, time: tick.time});
        }.bind(this));

        this.props.socket.on(constants.match.MAJ_COUNTER, function (counter) {
            this.setState({counter: counter});
        }.bind(this));

        this.props.socket.on(constants.match.LEAVE_MATCH, function (counter) {
            this.setState({
                angle: 0,
                time: 0,
                answer: -1,
                displayed: false,
                counter: []
            });
        }.bind(this));
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