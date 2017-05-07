var socket = io();

socket.on('k-chat-receive_message', function (message) {
    alert(message.message);
});

document.addEventListener('keypress', function (e) {
    socket.emit('k-game-keypress', e.which || e.keyCode);
}.bind(this));

var b = document.getElementsByClassName('queue'),
    $queueSub = b[0],
    $queueUnsub = b[1];

$queueSub.addEventListener('click', function (e) {
    e.preventDefault();
    socket.emit('k-queue-subs');
}.bind(this));

$queueUnsub.addEventListener('click', function (e) {
    e.preventDefault();
    socket.emit('k-queue-unsubs');
}.bind(this));