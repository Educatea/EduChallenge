
// Defaults to sessionStorage for storing the Facebook token
//openFB.init({appId: '804318116309818'});

//  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
  openFB.init({appId: '804318116309818', tokenStore: window.localStorage});

function login() {
    $.blockUI({ css: {
        border: 'none',
        padding: '15px',
        backgroundColor: '#000',
        '-webkit-border-radius': '10px',
        '-moz-border-radius': '10px',
        opacity: .5,
        color: '#fff'
    } });
    openFB.login(
        function(response) {
            if(response.status === 'connected') {
                localStorage['fb_token'] = response.authResponse.token;
                openFB.api({
                    path: '/me',
                    success: function(data) {
                        img = { 'square': 'http://graph.facebook.com/' + data.id + '/picture?type=square', 'small': 'http://graph.facebook.com/' + data.id + '/picture?type=small', 'normal': 'http://graph.facebook.com/' + data.id + '/picture?type=normal', 'large': 'http://graph.facebook.com/' + data.id + '/picture?type=large' };
                        current_user = { 'id': data.id,'token': localStorage['fb_token'], 'name': data.name,'img': img };
                        localStorage['current_user'] = JSON.stringify(current_user);

                        var url = "http://educatea.com.ar/api/v1/challenge/";
                        $.ajax({
                            type: "GET",
                            url: url,
                            success: function(data){
                                if(data.status == "402"){
                                    var url = "http://educatea.com.ar/api/v1/challenge/players";
                                    $.ajax({
                                        dataType: "json",
                                        data: { uid: JSON.parse(localStorage['current_user']).id, name: JSON.parse(localStorage['current_user']).name, oauth_token: JSON.parse(localStorage['current_user']).token },
                                        type: "POST",
                                        url: url,
                                        success: function(data){
                                            done();
                                            window.location.href = "main.html";
                                        },
                                        error: error,
                                        timeout: timeout
                                    });
                                }else{
                                    done();
                                    window.location.href = "main.html";
                                }
                            },
                            error: error,
                            timeout: timeout,
                            headers: {
                                "Authorization": "Basic " + btoa(JSON.parse(localStorage['current_user']).id + ":" + JSON.parse(localStorage['current_user']).token)
                            }
                        });
                    },
                    error: errorHandler});
            } else {
                done();
                alert('Facebook login failed: ' + response.error);
            }
        }, {scope: 'email,read_stream,publish_stream'});
}

function getInfo() {
    openFB.api({
        path: '/me',
        success: function(data) {
            document.getElementById("userName").innerHTML = data.name;
            document.getElementById("userPic").src = 'http://graph.facebook.com/' + data.id + '/picture?type=small';
            done();
        },
        error: errorHandler});
}

function share() {
    openFB.api({
        method: 'POST',
        path: '/me/feed',
        params: {
            message: document.getElementById('Message').value || 'Testing Facebook APIs'
        },
        success: function() {
            alert('the item was posted on Facebook');
        },
        error: errorHandler});
}

function revoke() {
    openFB.revokePermissions(
        function() {
            alert('Permissions revoked');
        },
        errorHandler);
}

function logout() {
    openFB.logout(
        function() {
            localStorage.removeItem('fb_token');
            localStorage.removeItem('current_user');
            window.location.href = "login.html";
        },
        errorHandler);
}

function errorHandler(error) {
    alert(error.message);
}