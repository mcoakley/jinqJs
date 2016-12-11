(function() {

  var isEmpty = function (array) {
      return typeof array === "undefined" || array.length === 0;
    },
  
    isObject = function (obj) {
      var type = typeof obj;
      return obj !== null && (type === "object" || type === "function");
    },
  
    isString = function (str) {
      return str !== null && str.constructor === String;
    },
  
    hasProperty = function (obj, property) {
      return obj[property] !== undefined;
    },
  
    isFunction = function (func) {
      return typeof func === "function";
    },
  
    isNumber = function (value) {
      return typeof value === "number";
    },
  
    isArray = function (array) {
    // MJC 12/10/2016
    // Reordered the sequence for early exit. Moved !isString(array) to 
    // be first since both a string and an array can have the property
    // length you will always need at least two checks to determine if 
    // the item is a string or not. In this order we will exit one 
    // function call earlier if it is a string.
      return !isString(array) && hasProperty(array, "length") && 
      !isFunction(array);
    };
  
  module.exports.isEmpty = isEmpty;
  module.exports.isObject = isObject;
  module.exports.isString = isString;
  module.exports.hasProperty = hasProperty;
  module.exports.isFunction = isFunction;
  module.exports.isNumber = isNumber;
  module.exports.isArray = isArray;
  
})();
