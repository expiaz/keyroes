import $ from 'jquery';

var socket = io();
var user = {};


function getChar(event) {
    if (event.which == null) {
        return String.fromCharCode(event.keyCode) // IE
    } else if (event.which!=0 && event.charCode!=0) {
        return String.fromCharCode(event.which)   // the rest
    } else {
        return null // special key
    }
}

socket.on('majPts', function (points) {
    $('.j1_points').html(points.p1);
    $('.j2_points').html(points.p2);
});

socket.on('sendLetter',function (letter) {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        w = w.innerWidth || e.clientWidth || g.clientWidth,
        h = w.innerHeight|| e.clientHeight|| g.clientHeight;

    h = Math.floor(h*0.75);

    $('#game').css('height', h + 'px');
    $('#game').css('width', w + 'px');
    $('#game').css('background-color','rgba('+letter.bg.r+','+letter.bg.g+','+letter.bg.b+',0.5)');
    var y = (h - (20+letter.size))*(letter.y/100);
    y = Math.floor(y);
    var x = (w - (20+letter.size/2))*(letter.x /100);
    x = Math.floor(x);
    //console.log('x: '+x+' , y: ('+h+'-('+(20+letter.size)+'))*('+(letter.y/100)+');');
    $('#game').html('<span id="'+letter.code+'-'+letter.letter+'" style="color: rgb('+letter.color.r+','+letter.color.g+','+letter.color.b+');font-size:'+letter.size+'px;font-family:'+letter.font+';font-style:'+letter.italic+';font-weight:'+letter.bold+';position:absolute;top:'+y+'px;left:'+x+'px;">'+letter.letter+'</span>')

});

$('input[name=keycode]').keypress(function (e) {
    $(this).val(getChar(e));
    socket.emit('keypressed',{letter: getChar(e), code: e.keyCode || e.which});
});

$('#register').submit(function (e) {
    e.preventDefault();
    $(this).fadeOut();
    user.username = $('input[name=username]').val();
    socket.emit('register', user.username, function(id){
        $('#username').append(user.username).show();
        $('#join_queue').show();
        user.id = id;
        socket.emit('message', 'joined the chat');
        $('#message').show();
    });
})

$('#join_queue').click(function (e) {
    $(this).fadeOut();
    $('#infos').html('currently in queue ...');
    socket.emit('mma');
});

$('#message').submit(function (e) {
    console.log('msg send');
    e.preventDefault();
    if($('input[name=message]').val() !== '' || $('input[name=message]').val() !== ' '){
        socket.emit('message', $('input[name=message]').val());
    }
    $('input[name=message]').val(' ');
});

socket.on('newMessage', function (messages) {
    console.log('msg re');
    $('#chat').html(' ');
    messages.forEach(function (element, index, array) {
        $('#chat').append('<span><strong>'+element.username+'</strong> : '+element.message+' <i>('+element.timestamp+')</i><br/></span>');
    });
});

socket.on('matched', function (match_id, callback) {


    $('#infos').html('game matched !');
    user.match = match_id;
    $('#join_match').fadeIn();
    $('#decline_match').fadeIn();

    var beginning = 5000;
    var ecoule = 0;
    var hasTimedOut = false;
    $('#timer').show();
    var timer = setInterval(function () {
        ecoule += 100;
        if(beginning-ecoule <= 0 && hasTimedOut === false){
            callback(false);
            clearInterval(timer);
            hasTimedOut = true;
            $('#infos').html('you\'ve declined the match');
            $('#timer').hide();
            $('#join_match').fadeOut();
            $('#decline_match').fadeOut();
            $('#join_queue').fadeIn();
        }
        else{
            $('#timer').html('remaining time :'+(beginning-ecoule));
        }
    }, 100);

    $('#join_match').click(function (e) {
        if(hasTimedOut === false){
            callback(true);
            hasTimedOut = true;
            clearInterval(timer);
            $('#infos').html('you\'ve accepted the match');
            $(this).fadeOut();
            $('#timer').hide();
            $('#decline_match').fadeOut();
        }
    });

    $('#decline_match').click(function (e) {
        if(hasTimedOut === false){
            callback(false);
            hasTimedOut = true;
            clearInterval(timer);
            $('#infos').html('you\'ve declined the match');
            $(this).fadeOut();
            $('#timer').hide();
            $('#join_match').fadeOut();
            $('#join_queue').fadeIn();
        }
    });
});

socket.on('decline', function(){
    $('#infos').html('Opponent declined');
    $('input[name=username]').val(user.username).hide();
    $('#username').html(user.username);
    $('#join_queue').fadeIn();
});

socket.on('game_start', function (p1_username, p2_username) {
    $('#infos').html(p1_username+' versus '+p2_username);
    $('#game').show();
    $('#chat').html(' ');
    $('#j1').html(p1_username);
    $('#j2').html(p2_username);
    $('.p_infos').show();
});

socket.on('leave', function (opp_username) {
    $('#game').hide();
    $('.p_infos').hide();
    $('#infos').html(opp_username+' leaved');
    $('#join_queue').fadeIn();
});