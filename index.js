module.exports = function createWS(props, options) {
  options = options || {};
  var maxInterval = options.maxInterval || 5;
  var retry = 0;
  var client = createConnection();
  var onmessage = [];
  function createConnection() {
    var c = new WebSocket(props);
    var intervalId;
    var send = c.send;
    c.send = notReady;
    c.onclose = function () {
      retry++;
      var gap = Math.min(maxInterval, retry);
      var interval = 1000 * gap;
      warn('Websocket connection was lost.');
      log('Retry(' + retry + ') websocket connection after ' + gap + ' seconds...\n');
      setTimeout(function() {
        clearInterval(intervalId);
        client = createConnection();
      }, interval);
      log(gap-- + 's');
      intervalId = setInterval(function() {
        log(gap-- + 's');
      }, 1000);
    }
    c.onopen = function () {
      retry = 0;
      clearInterval(intervalId);
      log('Websocket connection established.');
      c.onmessage = function (msg) {
        onmessage.forEach(fn => {
          fn.apply(client, arguments);
        });
      };
      c.send = send;
    };
    return c;
  }

  var x = {};

  Object.defineProperties(x, {
    send: {
      set: function(v) {
        client.send(v);
      }
    },
    listener: {
      set: function(fn) {
        onmessage = [fn];
      }
    },
    addListener: {
      set: function(fn) {
        onmessage.push(fn);
      }
    },
    deleteListener: {
      set: function(fn) {
        onmessage = onmessage.filter(s => {
          return s !== fn;
        });
      }
    },
    readyState: {
      get: function() {
        return client.readyState;
      }
    }
  });

  return x;
}

function warn() {
  if (module.exports.debug) {
    console.warn.apply(console, arguments);
  }
}

function log() {
  if (module.exports.debug) {
    console.log.apply(console, arguments);
  }
}

function WebSocket() {}
WebSocket.prototype.send = notSupport;

try {
  WebSocket = window.WebSocket || module.exports.WebSocket;
} catch (e) {
}

function notSupport() {
  warn('Not Support WebSocket In Your Browser.');
}

function notReady() {
  warn('Invalid sending message before connection is ready.');
}
