(function expressemitter_index_js() {

  var isInteger = RegExp.prototype.test.bind(/^\d+$/);

  Array.clone = function clone(arrayLikeObj) {
    var a = [];
    Object.keys(arrayLikeObj).filter(isInteger).forEach(function(i) {
      a[i] = arrayLikeObj[i];
    });
    return a;
  };

  Function.curry = function curry(/*arg0, arg1, ..., argN-1*/) {
    var fn = this, curriedArgs = Array.clone(arguments);
    return function curriedFn(/*argN, argN+1, ...*/) {
      return fn.apply(this, curriedArgs.concat(Array.clone(arguments)));
    };
  };

  this.exports = function SSEmitter() {
    return function ssemitter(request, response, nextHandler) {
      var nextEventId = 0
        , statusCode = 200
        , headers = {
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
          "Content-Type": "text/event-stream",
          "Trailer": "Content-Type"
        };
      (request.connection || request.socket).setTimeout(Infinity);
      response.writeHead(statusCode, headers);

      response.sendEvent = function sendEvent(ev, arg) {
        var sseMessage = ["event: "+ev, "id: "+nextEventId++]
          , args = Array.clone(arguments).slice(1);
        if (args.length) {
          sseMessage.push.apply(sseMessage, args.map(function(line) {
            return "data: "+(typeof line==="object"?JSON.stringify(line):line);
          }));
        }
        else {
          sseMessage.push("data");
        }
        sseMessage = sseMessage.concat(["", ""]).join("\n");
        this.write(sseMessage);
        this.flush(); // using compression so need to flush to actually send the data
      };

      var ogEnd = response.end;
      response.end = function end() {
        this.statusCode = statusCode = 404;
        this.addTrailers(headers = {"Content-Type": "application/x-empty"});
        ogEnd.apply(this, arguments);
      };

      nextHandler();
    };
  };
}).apply(module, [].map(require));
