var greet = '<div>Hi {{name}} and {{greet}}</div>';

function parse(KEYWORD,content){
    switch(KEYWORD.toLowerCase()){
        case 'for':

            ;
    }
}

function render(tpl,vars){

    /*
     tpl = tpl.replace(/{{[a-z]+}}/gi,function(match){
     return vars[match.replace('{{','').replace('}}','')];
     }
     );
     */

    tpl.match(/<%[for|if][^%>]%>/)

    for(var v in vars){
        tpl =  tpl.replace('{{'+v+'}}',vars[v]);
    }



    return tpl;
}

