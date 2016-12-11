(function() {
  
  var WebServicePlugin = function() {
  
    var _collections;
    var utils = require("../lib/utils.js");
  
    var nodeServiceCall = function (self, url, callback) {
      var http = require("http");

      http.get(url, function (response) {
        var content = "";

        response.on("data", function (data) { content += data; });
        response.on("end", function () {
          var data = JSON.parse(content);
          var collection = null;

          if (utils.isArray(data)) {
            collection = data;
          } else {
            collection = new Array(data);
          }
        
          _collections.push(collection);

        // MJC 12/11/2016
        // We don't check if this is a valid function since
        // we check in the plugin method itself and that is the only method
        // that calls nodeServiceCall
          callback(self);
        });
      });
    };

    // eslint-disable-next-line no-unused-vars
    this.from = function(collections, args, storage) {
      var collection = null;
      var callback = null;

      if (args.length === 0) {
        return this;
      }

      if (args.length !== 2 || 
      !utils.isString(args[0]) ||
      !utils.isFunction(args[1])) {
        throw new Error("The WebServicePlugin requires two arguments");
      }
    
      _collections = collections;

      collection = args[0];
      callback = args[1];

      nodeServiceCall(this, collection, callback);

      return this;
    };
  
  };

  module.exports = WebServicePlugin;

})();
