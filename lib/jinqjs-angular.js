(function() {

angular
  .module('angular-jinqjs', [])
  .service('$jinqJs', function() {
    var jinqJs = require("./jinqjs.js");
    
    return new jinqJs(); 
  })
  .service("$jinqJs-webservice-plugin", function() {
    var WebServicePlugin = require("../plugins/webservice-plugin.js");
    
    return new WebServicePlugin();
  });

})();
