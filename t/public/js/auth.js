$(document).ready(function () {

    var login,pwd;

    $('form').on('submit',function (e) {
        e.preventDefault();
        login = $('input[name=login]').val();
        pwd = $('input[name=password]').val();
        console.log('post');
        $.ajax({
            url:'/auth',
            type: 'POST',
            data: 'login='+login+'&password='+pwd
        });
    });


});