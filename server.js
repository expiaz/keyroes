var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
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

function genLetter(){
    var keycodes = [91,92,93,94,95,96], font_family = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'];
    
    var l_code;
    do{
        l_code = Math.floor(Math.random() * ( 26*2 )) + 65;
    }while(keycodes.indexOf(l_code)!=-1);

    var o1,o2,o3;
    do{
        o1 = Math.floor(Math.random() * ( 150 )) + 50;
        o2 = Math.floor(Math.random() * ( 150 )) + 50;
        o3 = Math.floor(Math.random() * ( 150 )) + 50;
    }while(o1 == o2 || o2 == o3 || o1 == o3);
    
    return {
        letter: String.fromCharCode(l_code),
        code: l_code,
        font: font_family[Math.floor(Math.random() * ( font_family.length ))],
        size: Math.floor(Math.random() * ( 50 )) + 20,
        color:{
            r:o1,
            g:o2,
            b:o3
        },
        bg:{
            r:255-o1,
            g:255-o2,
            b:255-o3
        },
        italic: Math.floor(Math.random() * ( 100 )) > 50 ? 'italic' : 'normal',
        bold: (Math.floor(Math.random() * ( 4 )) + 3) * 100,
        x: Math.floor(Math.random() * ( 100 )) + 1,
        y: Math.floor(Math.random() * ( 100 )) + 1,
        done: false
    };
}

var queue = [], matchs = [], messages = [], users = [];

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
    socket.points = socket.hasOwnProperty('points') === true ? socket.points : null;


    socket.on('register', function (username, callback) {
        if(users.indexOf(socket.id) === -1){
            users.push(socket.id);
            socket.username = username;
            socket.state = 'WAITING';
            socket.join('all');
            callback(socket.id_user);
        }
        else
            return;
    });

    /**
     * MATCHMAKING
     */
    socket.on('mma', function () {
        if(users.indexOf(socket.id) === -1)
            return;

        if(socket.match != null) socket.leave(socket.match);
        socket.state = 'IN_QUEUE';
        socket.accepted = null;
        socket.match = null;
        socket.opp = null;

        queue.push(socket);

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
                    p1.points = 0;
                    p2.points = 0;
                    io.to(match_id).emit('game_start', p1.username, p2.username);
                    matchs.push({
                        id: match_id,
                        p1: p1,
                        p2: p2,
                        messages: [],
                        letters: []
                    });
                    var l = genLetter();
                    matchs.indexOfObj('id', match_id).letters.push(l);
                    io.to(match_id).emit('sendLetter',l);
                    io.to(match_id).emit('majPts',{p1:0, p2:0});
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
        if(users.indexOf(socket.id) === -1)
            return;

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

    socket.on('keypressed', function (key) {
        console.log(key);
        if(matchs.indexOfObj('id', socket.match) !== undefined) {
            console.log('ok')
            var match_infos = matchs.indexOfObj('id', socket.match);
            console.log(match_infos.letters.indexOfObj('done',false));
            if (match_infos.letters.indexOfObj('done',false) != -1 && match_infos.letters.indexOfObj('done',false).code === key.keycode){
                console.log('ok')
                match_infos.letters.indexOfObj('done',false).done = true;

                socket.id === match_infos.p1.id ? match_infos.p1.points++ : match_infos.p2.points++;
                console.log({p1:match_infos.p1.points, p2:match_infos.p2.points});
                var l = genLetter();
                match_infos.letters.push(l);
                io.to(match_infos.id).emit('sendLetter', l);
                io.to(match_infos.id).emit('majPts',{p1:match_infos.p1.points, p2:match_infos.p2.points});
            }
            else{
                socket.id === match_infos.p1.id ? (match_infos.p1.points > 0 ? --match_infos.p1.points : match_infos.p1.points) : (match_infos.p2.points > 0 ? --match_infos.p2.points : match_infos.p2.points);
                io.to(match_infos.id).emit('majPts',{p1:match_infos.p1.points, p2:match_infos.p2.points});
            }
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