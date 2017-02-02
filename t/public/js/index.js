var socket = io();
document.getElementsByTagName('button')[0].addEventListener('click',function (e) {
    socket.emit('trigger');
});
socket.on('click',function (views) {
    document.getElementsByTagName('div')[0].innerHTML = views;
});