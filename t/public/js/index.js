var socket = io();
socket.on('hello', function (content) {
    alert(content);
})