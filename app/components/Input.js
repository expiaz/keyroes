import React, { Component } from 'react';

export default class Input extends Component{

    constructor(props){
        super(props);
        this.state = {
            content: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        document.addEventListener('keypress', this.handleKeySubmit.bind(this));
    }

    handleKeySubmit(e){
        let k = e.which || e.keyCode;
        if(k === 13){ // ENTER KEY
            this.handleSubmit();
        }
    }

    componentWillUnmount(){
        document.removeEventListener('keypress', this.handleKeySubmit);
    }

    handleSubmit(){
        if(this.state.content.length > 0 && this.state.content.length <= 50)
            this.props.submitHook(this.state.content);
        this.setState({content: ''});
    }

    handleChange(e){
        this.setState({content: e.target.value});
    }

    render(){
        return(
            <div>
                <input type="text" onChange={this.handleChange} value={this.state.content}/>
                <button onClick={this.handleSubmit}>{this.props.text}</button>
            </div>
        );
    }


}