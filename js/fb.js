
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
                alert('Gonna build the object!');
                build_current_user();
                alert('Wooohoo! Finished making the object! '+ JSON.parse(localStorage['current_user']));
                done();
                window.location.href = "main.html";
            } else {
                done();
                alert('Facebook login failed: ' + response.error);
            }
        }, {scope: 'email,read_stream,publish_stream'});
}

function build_current_user(){
    alert('Building current_user object..');
    openFB.api({
        path: '/me',
        success: function(data) {
            alert('Got the data! '+data.name);
            alert('I have the token: '+localStorage['fb_token']);
            alert('I have the id: '+ data.id);
            alert('I have the name: '+ data.name);
            img = 'http://graph.facebook.com/' + data.id + '/picture?type=small';
            alert('I have the img: '+ img);
            current_user = { 'id': data.id,'token': localStorage['fb_token'], 'name': data.name,'img': img };
            alert('I created the object: '+current_user);
            alert('Saving to localStorage..');
            localStorage['current_user'] = JSON.stringify(current_user);
            alert('saved!');
            return true;
        },
        error: errorHandler});
}

function getInfo() {
    openFB.api({
        path: '/me',
        success: function(data) {
            alert(JSON.stringify(data));
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