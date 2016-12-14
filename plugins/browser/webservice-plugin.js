(function() {
  
  var WebServicePlugin = function() {

    // eslint-disable-next-line no-unused-vars
    this.from = function(collections, args, storage) {
      var utils = require("../../lib/utils.js");
      var xmlhttp = new XMLHttpRequest();
      
      var url = null;
      var callback = null;
      var self = this;

      if (args.length === 0) {
        return this;
      }

      if (args.length !== 2 || !utils.isString(args[0])) {
        throw new Error("The WebServicePlugin requires two arguments");
      }
    
      url = args[0];
      callback = args[1];

      var data = null;

      if (utils.isFunction(callback)) {
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.response.length === 0) {
            return;
          }

          data = JSON.parse(xmlhttp.response);

          if (!utils.isArray(data)) {
            data = new Array(data);
          }

          collections.push(data);

          callback(self);
        };
      }

      xmlhttp.open("GET", url, utils.isFunction(callback));
      xmlhttp.send();

      if (!utils.isFunction(callback)) {
        data = JSON.parse(xmlhttp.response);

        if (!utils.isArray(data)) {
          data = new Array(data);
        }

        collections.push(data);
      }

      return this;
    };
  };

  module.exports = WebServicePlugin;

})();
