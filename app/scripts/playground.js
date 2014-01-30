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

function createQR(WSUrl, success, error) {
    createKey("ws", function (secret) {success("https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=" + WSUrl + "/ws/" + secret + "&chld=H|4&choe=UTF-8")}, error);
}

function connectWebsocket(WSUrl, glassConnectedCallback) {
    var url = WSUrl + "/ws";
    var websocket = new ReconnectingWebSocket(url);
    var ws = new WearScriptConnection(websocket, "playground", Math.floor(Math.random() * 100000));
    function subscription_cb() {
	glassConnectedCallback(ws.exists('glass'));
    }
    websocket.onopen = function () {
	subscription_cb();
	ws.subscribe('subscriptions', subscription_cb);
    }
    return ws;
}
