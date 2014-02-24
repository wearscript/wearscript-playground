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
    function onopen(event) {
        console.log('opened');
	ws.subscribe('subscriptions', subscription_cb);
        ws.subscribe('log', log_cb);
        ws.subscribe('urlopen', urlopen_cb);
	subscription_cb();
    }
    var ws = new WearScriptConnection(websocket, "playground", Math.floor(Math.random() * 100000), onopen);
    ws.subscribeTestHandler();
    function subscription_cb() {
	glassConnectedCallback(ws.exists('glass'));
        // TODO(brandyn): Only do this once, then provide a button to refresh
    }
    function log_cb(channel, message) {
        console.log(channel + ': ' + message);
        // TODO(brandyn): Have a notification that a log message was sent
    }
    function gist_modify_cb(channel, gists) {
        HACK_GIST_MODIFIED = gists;
        console.log('Gist modified');
    }
    function gist_get_cb(channel, gist) {
        window.HACK_GIST = gist;
        console.log(channel + ': ' + gist);
    }
    function urlopen_cb(channel, url) {
        window.open(url);
    }
    return ws;
}

function runScriptOnGlass(ws, script) {
    ws.publish('glass', 'script', {'glass.html': script});
}

function runLambdaOnGlass(ws, script) {
    ws.publish('glass', 'lambda', script);
}

window.HACK_runEditorScriptOnGlass = function() {
    runScriptOnGlass(HACK_WS, window.HACK_EDITOR.getSession().getValue());
}


window.HACK_runLambdaOnGlass = function(line) {
    runLambdaOnGlass(HACK_WS, line);
}

function gistGet(ws, gistid, callback) {
    ws.subscribe(ws.channel(ws.groupDevice, 'gistGet'), callback);
    ws.publish('gist', 'get', ws.channel(ws.groupDevice, 'gistGet'), gistid);
}

function gistModify(ws, gistid, fileName, content, callback) {
    var c = ws.channel(ws.groupDevice, 'gistModify');
    ws.subscribe(c, callback);
    var files = {};
    files[fileName] = {content: content};
    ws.publish('gist', 'modify', c, gistid, undefined, files);
}

function gistCreate(ws, secret, description, fileName, content, callback) {
    var c = ws.channel(ws.groupDevice, 'gistCreate');
    ws.subscribe(c, callback);
    var files = {};
    files[fileName] = {content: content};
    ws.publish('gist', 'create', c, secret, description, files);
}
