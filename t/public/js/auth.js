(function ($) {

    var login,pwd;

    if(localStorage.k_login && localStorage.k_pwd) {
        login = localStorage.k_login;
        pwd = localStorage.k_pwd;

        $.ajax({
            url: '/auth',
            type: 'POST',
            data: 'login=' + login + '&password=' + pwd,
            success: logme
        });
    }

    $('form').on('submit',function (e) {
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
        if(data.success){
            if($('input[type=checkbox]').prop('checked')){
                localStorage.k_login = login;
                localStorage.k_pwd = pwd;
            }
            document.location.href = '/';
        }
        else document.getElementsByTagName('div')[0].innerHTML = data.message;
    }


})(window.$ || window.jQuery);