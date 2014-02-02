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

function wearScriptConnectionFactory(websocket, glassConnectedCallback) {
    var ws = new WearScriptConnection(websocket, "playground", Math.floor(Math.random() * 100000));
    function subscription_cb() {
	glassConnectedCallback(ws.exists('glass'));
        // TODO(brandyn): Only do this once, then provide a button to refresh
        gistList(ws);
    }
    function log_cb(channel, message) {
        console.log(channel + ': ' + message);
        // TODO(brandyn): Have a notification that a log message was sent
    }
    function sensors_cb(channel, message) {
        console.log(channel + ': ' + message);
        // TODO(brandyn): Have a notification that sensors are coming in message was sent
    }
    function image_cb(channel, timestamp, message) {
        console.log(channel + ': ' + message.slice(0, 15));
        // TODO(brandyn): Have a notification that an image is coming in message was sent
    }
    function gist_list_cb(channel, gists) {
        HACK_GISTS = gists;
        //angular.element($('.container').children[0]).scope();
        console.log(channel + ': ' + gists);
    }
    function gist_get_cb(channel, gist) {
        HACK_GIST = gist;
        console.log(channel + ': ' + gist);
    }
    function urlopen_cb(channel, url) {
        window.open(url);
    }
    websocket.onopen = function () {
	subscription_cb();
	ws.subscribe('subscriptions', subscription_cb);
        ws.subscribe('sensors', sensors_cb);
        ws.subscribe('image', image_cb);
        ws.subscribe('log', log_cb);
        ws.subscribe('urlopen', urlopen_cb);
        ws.subscribe(ws.channel(ws.groupDevice, 'gistList'), gist_list_cb);
        ws.subscribe(ws.channel(ws.groupDevice, 'gistGet'), gist_get_cb);
    }
    return ws;
}

function runScriptOnGlass(ws, script) {
    ws.publish('glass', 'script', {'glass.html': script});
}

function runLambdaOnGlass(ws, script) {
    ws.publish('glass', 'lambda', script);
}

function HACK_runEditorScriptOnGlass() {
    runScriptOnGlass(HACK_WS, HACK_EDITOR.getSession().getValue());
}


function HACK_runLambdaOnGlass(line) {
    runLambdaOnGlass(HACK_WS, line);
}

function gistList(ws) {
    ws.publish('gist', 'list', ws.channel(ws.groupDevice, 'gistList'));
}

function gistGet(ws, gistid) {
    ws.publish('gist', 'get', ws.channel(ws.groupDevice, 'gistGet'), gistid);
}
