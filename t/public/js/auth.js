$(document).ready(function () {

    var login,pwd;

    if((login = localStorage.k_login) && (pwd = localStorage.k_pwd))
        $.ajax({
            url:'/auth',
            type: 'POST',
            data: 'login='+login+'&password='+pwd,
            success:logme
        });

    $('input[type=submit]').on('click',function (e) {
        e.preventDefault();
        login = $('input[name=login]').val();
        pwd = $('input[name=password]').val();
        $.ajax({
            url:'/auth',
            type: 'POST',
            data: 'login='+login+'&password='+pwd,
            success:logme
        });
    });

    function logme(data,status){
        console.log(data);
        if(data.success == false)
            $('.error').html(data.message).show();
        else{
            localStorage.k_login = login;
            localStorage.k_pwd = pwd;
            document.location.href = '/';
        }

    }
});