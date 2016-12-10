var WebServicePlugin = function() {
  
  var _collections;
  
  var isString = function (str) {
    return str !== null && str.constructor === String;
  },

  isFunction = function (func) {
    return typeof func === "function";
  },
  
  hasProperty = function (obj, property) {
    return obj[property] !== undefined;
  },

  isArray = function (array) {
    return hasProperty(array, "length") && 
      !isString(array) && !isFunction(array);
  },

  isNode = function () {
      return typeof module !== "undefined" && 
        typeof module.exports !== "undefined";
    },
    
  nodeServiceCall = function (self, url, callback) {
    var http = require("http");

    http.get(url, function (response) {
      var content = "";

      response.on("data", function (data) { content += data; });
      response.on("end", function () {
        var data = JSON.parse(content);
        var collection = null;

        if (isArray(data)) {
          collection = data;
        } else {
          collection = new Array(data);
        }

        _collections.push(collection);

        if (isFunction(callback)) {
          callback(self);
        }
      });
    });
  },

  browserServiceCall = function (self, url, callback) {
    var xmlhttp = new XMLHttpRequest();
    var collection = null;

    if (isFunction(callback)) {
      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.response.length === 0) {
          return;
        }

        var response = JSON.parse(xmlhttp.response);

        if (isArray(response)) {
          collection = response;
        } else {
          collection = new Array(response);
        }

        _collections.push(collection);

        callback(self);
      };
    }

    xmlhttp.open("GET", url, isFunction(callback));
    xmlhttp.send();

    if (!isFunction(callback)) {
      var response = JSON.parse(xmlhttp.response);

      if (isArray(response)) { 
        collection = response; 
      } else { 
        collection = new Array(response);
      }

      _collections.push(collection);
    }
  };
  
  this.from = function(collections, args, storage) {
    var collection = null;
    var callback = null;

    if (args.length === 0) {
      return this;
    }
    
    _collections = collections;

    if (args.length === 2 && isFunction(args[1])) {
      collection = args[0];
      callback = args[1];

      if (isString(collection)) {
        if (!isNode()) { 
          browserServiceCall(this, collection, callback);
        } else {
          nodeServiceCall(this, collection, callback);
        }
      }
      
      collections.push(collection);
    } else {
      throw new Error("The WebServicePlugin requires two arguments");
    }
    
    return this;
  };
  
};

module.exports = WebServicePlugin;
