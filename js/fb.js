
// Defaults to sessionStorage for storing the Facebook token
//openFB.init({appId: '804318116309818'});

//  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
  openFB.init({appId: '804318116309818', tokenStore: window.localStorage});

function login() {
    openFB.login(
        function(response) {
            if(response.status === 'connected') {
                localStorage['fb_token'] = response.authResponse.token;
                window.location.href = "main.html";
            } else {
                alert('Facebook login failed: ' + response.error);
            }
        }, {scope: 'email,read_stream,publish_stream'});
}

function getInfo() {
    openFB.api({
        path: '/me',
        success: function(data) {
            console.log(JSON.stringify(data));
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
            window.location.href = "login.html";
        },
        errorHandler);
}

function errorHandler(error) {
    alert(error.message);
}