(function() {
  
  var WebServicePlugin = function() {

    // eslint-disable-next-line no-unused-vars
    this.from = function(collections, args, storage) {
      var utils = require("../lib/utils.js");
      var http = require("http");

      var url = null;
      var callback = null;
      var self = this;

      if (args.length === 0) {
        return this;
      }

      if (args.length !== 2 || 
      !utils.isString(args[0]) ||
      !utils.isFunction(args[1])) {
        throw new Error("The WebServicePlugin requires two arguments");
      }
    
      url = args[0];
      callback = args[1];

      http.get(url, function (response) {
        var content = "";

        response.on("data", function (data) { 
          content += data; 
        });
        
        response.on("end", function () {
          var data = JSON.parse(content);

          if (!utils.isArray(data)) {
            data = new Array(data);
          }
          collections.push(data);

          // MJC 12/11/2016
          // We don't check if this is a valid function since
          // we check in the plugin method itself and that is the only method
          // that calls nodeServiceCall
          callback(self);
        });
      });
      return this;
    };
  };

  module.exports = WebServicePlugin;

})();
