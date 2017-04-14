var socket = io();
socket.on('hello', function (content) {
    alert(content);
})

socket.on('k-chat-receive_message', function (message) {
    alert(message.message);
})