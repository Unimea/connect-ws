# connect-ws
Simple websocket connection in browser with retry.

## API ##
### createWS ### 
- @parameters
  + **props**: constructor 'WebSocket' may use.
  + **options.maxInterval**: max interval seconds of retry, default is 5.
- @return(object)
  + **[setter] send**: message to send.
  + **[setter] addListener**: add message listener.
  + **[setter] listener**: replace listener.
  + **[setter] deleteListener**: delete one listener.
  + **[getter] readyState**: connection state.

### createWS.debug ### 
set if print logs.
