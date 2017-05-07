import ReactDOM from 'react-dom';
import React from 'react';

import Dispatcher from './Dispatcher';

var socket = io();

ReactDOM.render(<Dispatcher socket={socket} />, document.getElementById('app'));