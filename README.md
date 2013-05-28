Express + Emitter = Express + SSE + Emitter = ExpreSSEmitter

Use with Express library to enable endpoints for html5 EventSource elements.

Example Usage:

  var app = require("express")
    , sseEndpoint = require("expressemitter");
  
  //browser-side: var sseSource = new EventSource("/sse");
  app.use("/sse", sseEndpoint, function(req, res) {
  
    /*...*/
  
    res.sendEvent("message", "some data");
    //browser-side: sseSource.addEventListener("message", function(msg){alert(msg);}, false);
  
    /*...*/
  
    res.sendEvent("showDialogAt", {x: 3, y: 4});
    /*browser-side: sseSource.addEventListener("showDialogAt", function(pos) {dialog.showAt(JSON.parse(pos));}, false);
  
    /*...*/
  
    res.sendEvent("end"); //notify client of end of stream, some browsers will reconnect if not explicitly closed
    /*browser-side: sseSource.addEventListener("end", function() {sseSource.close();}, false);
  
    res.end(); //close the response stream
  });