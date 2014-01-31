function WearScriptConnection(ws, group, device) {
    this.ws = ws;
    this.group = group;
    this.device = device;
    this.groupDevice = group + ':' + device;
    this._channelsInternal = {};
    this.deviceToChannels = {};
    this._externalChannels = {};

    this.exists = function (channel) {
	return channel == 'subscriptions' || this._exists(channel, this._externalChannels);
    }

    this.channelsInternal = function() {
	return this._keys(this._channelsInternal);
    }

    this.channelsExternal = function() {
	return this.deviceToChannels;
    }

    this.receive = function (event) {
	a = event;
	console.log('here:' + event)
        var reader = new FileReader();
        reader.addEventListener("loadend", function () {
            var data = msgpack.unpack(reader.result);
	    if (data[0] == 'subscriptions') {
		this.deviceToChannels[data[1]] = data[2];
		var externalChannels = [];
		for (var key in this.deviceToChannels) {
		    var value = this.deviceToChannels[key];
		    for (var i = 0; i < value.length; i++) {
			externalChannels[value[i]] = true;
		    }
		}
		this._externalChannels = externalChannels;
	    }
	    var match = this._exists(data[0], this._channelsInternal);
            if (match) {
		match.apply(null, data);
            }
	}.bind(this));
        reader.readAsBinaryString(event.data);
    }
    ws.onmessage = this.receive.bind(this);

    this._exists = function (channel, container) {
	var channelCur = '';
	var parts = channel.split(':');
	var match;
	for (var i = 0; i < parts.length; i++) {
	    if (container.hasOwnProperty(channelCur))
		match = container[channelCur];
	    if (!i) {
		channelCur += parts[i];
	    } else {
		channelCur += ':' + parts[i];
	    }
	}
	if (container.hasOwnProperty(channelCur))
	    match = container[channelCur];
	return match;
    }
    this.channel = function () {
	return Array.prototype.slice.call(arguments).join(':');
    }

    this.subchannel = function () {
	return self.groupDevice + ':' + Array.prototype.slice.call(arguments).join(':')
    }

    this.ackchannel = function (channel) {
	return channel + ':ACK';
    }

    this._keys = function (obj) {
	var keys = [];
	for (var key in obj) if (obj.hasOwnProperty(key)) keys.push(key);
	return keys;
    }
    
    this.subscribe = function (channel, callback) {
	if (!this._channelsInternal.hasOwnProperty(channel)) {
	    this._channelsInternal[channel] = callback;
	    this.publish('subscriptions', this.groupDevice, this._keys(this._channelsInternal));
	} else {
	    this._channelsInternal[channel] = callback;
	}
	return this;
    }

    this.unsubscribe = function (channel) {
	if (this._channelsInternal.hasOwnProperty(channel)) {
	    delete this._channelsInternal[channel]
	    this.publish('subscriptions', this.groupDevice, this._keys(this._channelsInternal));
	}
	return this;
    }

    this.publish = function () {
	if (!this.exists(arguments[0])) {
	    return this;
	}
	
	this.send.apply(this, arguments);
	return this;
    }

    this.send = function () {
	var data_enc = msgpack.pack(Array.prototype.slice.call(arguments));
	var data_out = new Uint8Array(data_enc.length);
	var i;
	for (i = 0; i < data_enc.length; i++) {
            data_out[i] = data_enc[i];
	}
	this.ws.send(data_out);
    }
}
