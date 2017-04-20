# ws-connection
Simple websocket connection in browser with retry.

## API ##
### createWS ### 
- @parameters
  + **props**: constructor 'WebSocket' may use.
  + **options.maxInterval**: max interval seconds of retry, default is 5.
- @return(object)
  + **send()**: the same as WebSocket.prototype.send
  + **onmessage()**: the same as WebSocket.prototype.onmessage
