var socket = io();

socket.on('k-chat-receive_message', function (message) {
    alert(message.message);
})