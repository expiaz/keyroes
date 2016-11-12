var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var timer = require('timer.js');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/client_side_game.html');
});

Array.prototype.occ || (Array.prototype.occ = function(e,o,i) {
    i = i || 0;
    o = o || 0;
    return i<this.length?(this[i]==e?this.occ(e,++o,++i):this.occ(e,o,++i)):o;
});

Array.prototype.indexOfObj || (Array.prototype.indexOfObj = function(prop, value) {
    return this[this.map(function (e){return e.hasOwnProperty(prop) ? e[prop] : undefined;}).indexOf(value)]
});

Array.prototype.inArrayObj || (Array.prototype.inArrayObj = function(searchFor) {
    for(var index=0; index < this.length; index++){
        if (this[index].toLowerCase() === searchFor.toLowerCase())
            return index;
    }
    return -1;
});

var hashs = [];
function createHash(length_id) {
    var text, possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    do{
        text = "";
        for( var i=0; i < length_id; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
    }while(hashs.indexOf(text) != -1);
    hashs.push(text);
    return text;
}

function getTimestamp(){
    return (new Date().getHours()+':'+new Date().getMinutes());
}

var queue = [], matchs = [], messages = [], users = [], _l = [], keycodes = [91,92,93,94,95,96], font_family = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'] , font_size = ['10','12'];

function genLetter(){
    var l_code, l_color, l_bg;
    do{
        l_code = Math.floor(Math.random() * ( 26*2 )) + 65;
    }while(keycodes.indexOf(l_code)!=-1);

    var o1,o2,o3;
    do{
        o1 = Math.floor(Math.random() * ( 150 )) + 50;
        o2 = Math.floor(Math.random() * ( 150 )) + 50;
        o3 = Math.floor(Math.random() * ( 150 )) + 50;
    }while(o1 == o2 || o2 == o3 || o1 == o3);
    l_color = {
        r:o1,
        g:o2,
        b:o3
    };
    l_bg={
        r:255-o1,
        g:255-o2,
        b:255-o3
    }

    var l = {
        letter: String.fromCharCode(l_code),
        code: l_code,
        font: font_family[Math.floor(Math.random() * ( font_family.length ))],
        size: Math.floor(Math.random() * ( 50 )) + 20,
        color:l_color,
        bg:l_bg,
        italic: Math.floor(Math.random() * ( 100 )) > 50 ? 'italic' : 'normal',
        bold: (Math.floor(Math.random() * ( 4 )) + 3) * 100,
        x: Math.floor(Math.random() * ( 100 )) + 1,
        y: Math.floor(Math.random() * ( 100 )) + 1,
        done: false
    };
    _l[l.letter] = l;
    return l;
}

io.on('connection', function (socket) {

    socket.points = 0;

    socket.emit('genletter', gen());
    socket.on('keypressed',function (key, callback) {
        console.log(_l);
        console.log(key);
        if (_l[key.letter] && _l[key.letter].done === false){
            _l[key.letter].done = true;
            callback(++socket.points);
            socket.emit('genletter', gen());
        }
        else
            callback(socket.points > 0 ? --socket.points : socket.points);
    });
});


http.listen(3000);