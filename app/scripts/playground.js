function redirectAuthGoogle() {
    window.location.replace('auth');
}

function redirectAuthGithub() {
    window.location.replace('authgh');
}

function redirectSignout() {
    window.location.replace("signout");
}

function createKey(type, success, error) {
    var xhr = $.ajax({url: 'user/key/' + type, type: 'POST', success: success});
    if (!_.isUndefined(error)) {
        xhr.error(error);
    }
}

function createQR(WSUrl) {
    createKey("ws", function (x) {glassSecret = x; $('#qr').html(Mustache.render('<div class="col-md-9"><pre>adb shell \"mkdir -p /sdcard/wearscript && echo \'{{url}}\' > /sdcard/wearscript/qr.txt\"</pre></div><img src="https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl={{url}}&chld=H|4&choe=UTF-8"\>', {url: WSUrl + '/ws/' + x}))}, function () {alert("Could not get ws.  Are you whitelisted on this server?  See the docs for details.")});
}

function connectWebsocket(WSUrl) {
    var url = WSUrl + "/ws";
    var websocket = new ReconnectingWebSocket(url);
    var ws = new WearScriptConnection(websocket, "playground", Math.floor(Math.random() * 100000));
    function subscription_cb() {
	if (!ws.exists('glass'))
            $(".scriptel").prop('disabled', true);
        else
            $(".scriptel").prop('disabled', false);
    }
    websocket.onopen = function () {
	subscription_cb();
	ws.subscribe('subscriptions', subscription_cb);
    }
    return ws;
}
