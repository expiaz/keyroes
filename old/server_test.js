var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index_test.html');
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

var queue = [], matchs = [], messages = [];

io.on('connection', function(socket) {
    //socket.id_user = socket.id_user || createHash(9);
    //socket.username = socket.username || '0';

    // override socket object

    socket.accepted = socket.hasOwnProperty('accepted') === true ? socket.accepted : null;
    socket.state = socket.hasOwnProperty('state') === true ? socket.state : null;
    socket.match = socket.hasOwnProperty('match') === true ? socket.match : null;
    socket.opp = socket.hasOwnProperty('opp') === true ? socket.opp : null;
    socket.id_user = socket.hasOwnProperty('id_user') === true ? socket.id_user : createHash(9);
    socket.username = socket.hasOwnProperty('username') === true ? socket.username : null;
    socket.player_number = socket.hasOwnProperty('player_number') === true ? socket.player_number : null;


    /**
     * MATCHMAKING
     */
    socket.on('mma', function (username, callback) {
        socket.username = username;
        if(socket.match != null) socket.leave(socket.match);
        socket.state = 'IN_QUEUE';
        socket.accepted = null;
        socket.match = null;
        socket.opp = null;

        socket.join('all');

        queue.push(socket);

        callback(socket.id_user);

        while(queue.length % 2 === 0 && queue.length >= 2){
            var p1 = queue[0], p2 = queue[1];
            queue.splice(0,2);

            var match_id = createHash(5);
            p1.player_number = 1;
            p2.player_number = 2;

            /*
            p1.accepted = null;
            p2.accepted = null;
            */
            p1.state = 'MATCHED';
            p2.state = 'MATCHED';

            p1.opp = p2;
            p2.opp = p1;

            p1.emit('matched', match_id, function(accepted){
                p1.accepted = accepted;
                console.log(p1.accepted === true ? 'p1 accepted' : 'p1 declined');
                if(p2.accepted !== null){
                    console.log('begin from p1');
                    begin();
                }
            });
            p2.emit('matched',match_id, function(accepted){
                p2.accepted = accepted;
                console.log(p2.accepted === true ? 'p2 accepted' : 'p2 declined');
                if(p1.accepted !== null){
                    console.log('begin from p2');
                    begin();
                }
            });
            function begin(){
                console.log('begin called');
                if(p1.accepted === true && p2.accepted === true){
                    console.log('p1 et p2 ok');
                    p1.leave('all');
                    p2.leave('all');
                    p1.join(match_id);
                    p2.join(match_id);
                    p1.match = match_id;
                    p2.match = match_id;
                    p1.state = 'IN_GAME';
                    p2.state = 'IN_GAME';
                    io.to(match_id).emit('game_start', p1.username, p2.username);
                    matchs.push({
                        id: match_id,
                        p1: p1,
                        p2: p2,
                        messages: []
                    });
                }
                else if(p1.accepted === true && p2.accepted === false){
                    p1.emit('decline');
                    p1.state = 'WAITING';
                    p2.state = 'WAITING';
                    console.log('emit decline to p1');
                }
                else if(p1.accepted === false && p2.accepted === true){
                    p2.emit('decline');
                    p1.state = 'WAITING';
                    p2.state = 'WAITING';
                    console.log('emit decline to p2');
                }
                else if(p1.accepted === false && p2.accepted === false){
                    p1.state = 'WAITING';
                    p2.state = 'WAITING';
                    console.log('both p1 & p2 declined');
                }
            }
        }
    });

    socket.on('message', function (content){
        if(matchs.indexOfObj('id', socket.match) === undefined){
            //msg to basic room
            console.log('to basic');
            messages.push({
                username: socket.username,
                message: content,
                timestamp: getTimestamp()
            });
            io.to('all').emit('newMessage', messages);
        }
        else{
            var match_infos = matchs.indexOfObj('id', socket.match);
            console.log('to '+socket.match);
            match_infos.messages.push({
                username: socket.username,
                message: content,
                timestamp: getTimestamp()
            });
            io.to(socket.match).emit('newMessage', match_infos.messages);
        }
    });


    socket.on('disconnect', function () {

        switch(socket.state){
            case 'WAITING':
                messages.push({
                    username: socket.username,
                    message: 'leaved the chat',
                    timestamp: getTimestamp()
                });
                io.emit('newMessage', messages);
                break;
            case 'IN_QUEUE':
                if(queue.indexOfObj('id', socket.id) !== undefined)
                    queue.splice(queue.indexOf(queue.indexOfObj('id', socket.id)),1);
                messages.push({
                    username: socket.username,
                    message: 'leaved the chat',
                    timestamp: getTimestamp()
                });
                io.emit('newMessage', messages);
                break;
            case 'MATCHED':
                socket.opp.emit('leave', socket.username);
                socket.opp.state = 'WAITING';
                messages.push({
                    username: socket.username,
                    message: 'leaved the chat',
                    timestamp: getTimestamp()
                });
                io.emit('newMessage', messages);
                break;
            case 'IN_GAME':
                if(matchs.indexOfObj('id', socket.match) !== undefined){
                    var match_infos = matchs.indexOfObj('id', socket.match);
                    match_infos.messages.push({
                        username: socket.username,
                        message: 'leaved the chat',
                        timestamp: getTimestamp()
                    });
                    io.to(socket.match).emit('newMessage', match_infos.messages);
                    switch(socket.player_number){
                        case 1:
                            match_infos.p2.leave(match_infos.id);
                            match_infos.p2.join('all');
                            match_infos.p2.match = null;
                            match_infos.p2.state = 'WAITING';
                            match_infos.p2.emit('leave', match_infos.p1.username);
                            break;
                        case 2:
                            match_infos.p1.leave(match_infos.id);
                            match_infos.p1.join('all');
                            match_infos.p1.match = null;
                            match_infos.p1.state = 'WAITING';
                            match_infos.p1.emit('leave', match_infos.p2.username);
                            break;
                        default:
                            break;
                    }
                    matchs.splice(matchs.indexOf(match_infos),1);
                }
                break;
        }
    });

    /*users.forEach(function (element, index, array) {
        console.log(element.id);
        console.log(element.id_user);
    });*/
});

http.listen(3000);