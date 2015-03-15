var Script = function () {
//    tool tips
    $('.tooltips').tooltip();
//    popovers
    $('.popovers').popover();
//    bxslider
    $('.bxslider').show();
    $('.bxslider').bxSlider({
        minSlides: 4,
        maxSlides: 4,
        slideWidth: 276,
        slideMargin: 20
    });
}();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function reload(){
    location.reload();
}

function error(){
    $('#container').empty().css("text-align", "center");
    html = "<img src='img/sad.png' width='120px'><br><br><h4>Parece que tenemos un problema en el servidor!</h4><br><br><button class='btn btn-primary' id='reload' onclick='reload()'>Reload <i class='fa fa-refresh'></i></button>";
    $(html).appendTo('#container');
    done();
}

function timeout(){
    $('#container').empty().css("text-align", "center");
    html = "<img src='img/sad.png' width='120px'><br><br><h4>Parece que no hay conexión a internet!</h4><br><br><button class='btn btn-primary' id='reload' onclick='reload()'>Reload <i class='fa fa-refresh'></i></button>";
    $(html).appendTo('#container');
    done();
}

function done(){
    $.unblockUI();
}

function auth(email, pass){
    var url = "http://educatea.com.ar/api/v1/";
    $.ajax({
        type: "GET",
        url: url,
        success: function(data){
            if(data.status == 200){
                localStorage['email'] = email;
                localStorage['pass'] = pass;
                localStorage['id'] = 1;
                if(data.user.user_role_id == "1"){
                    localStorage['user_role'] = "Teacher";
                }else{
                    localStorage['user_role'] = "Student";
                }
                localStorage['logged_in'] = true;
            }else{
                localStorage['logged_in'] = false;
            }
        },
        error: error,
        timeout: timeout,
        headers: {
            "Authorization": "Basic " + btoa(email + ":" + pass)
        }
    });
}

function log_out(){
    localStorage.removeItem('email');
    localStorage.removeItem('pass');
    localStorage.removeItem('id');
    localStorage.removeItem('user_role');
    localStorage['logged_in'] = false;
    window.location.href = "index.html";
}

function is_logged_in(){
    if(localStorage['logged_in'] == 'true'){
        return true;
    }else{
        return false;
    }
}
