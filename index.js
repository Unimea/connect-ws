function createWS(props, options) {
  options = options || {};
  var maxInterval = options.maxInterval || 5;
  var retry = 0;
  var client = createConnection();
  var onmessage = [];
  function createConnection() {
    var c = new WebSocket(props);
    var intervalId;
    c.onclose = function () {
      retry++;
      var gap = Math.min(maxInterval, retry);
      var interval = 1000 * gap;
      console.warn('Websocket connection was lost.');
      console.log('Retry(' + retry + ') websocket connection after ' + gap + ' seconds...\n');
      setTimeout(function() {
        clearInterval(intervalId);
        client = createConnection();
      }, interval);
      console.log(gap-- + 's');
      intervalId = setInterval(function() {
        console.log(gap-- + 's');
      }, 1000);
    }
    c.onopen = function () {
      retry = 0;
      clearInterval(intervalId);
      console.log('Websocket connection established.');
      c.onmessage = function (msg) {
        onmessage.forEach(fn => {
          fn.apply(client, arguments);
        });
      };
    };
    return c;
  }
  return {
    get send() {
      return function() {
        return client.send.apply(client, arguments);
      };
    },
    set onmessage(fn) {
      onmessage = [fn];
    },
    // Using 'onmessage' instead of 'addOnmessage'.
    get addOnmessage() {
      return function(fn) {
        onmessage.push(fn);
      }
    },
    get removeOnmessage() {
      return function(fn) {
        onmessage = onmessage.filter(s => {
          return s !== fn;
        });
      }
    }
  };
}

module.exports = createWS;
/* Example */
/*
var ws = createWS('ws://localhost:9999');

function send() {
  ws.send(document.getElementById('input').value);
}
ws.onmessage = function (msg) {
  document.getElementById('show').innerHTML += '<p>' + msg.data + '</p>';
};
var func = function() {
  console.log('message in');
};
ws.addOnmessage(func);
// ws.removeOnmessage(func);
*/
