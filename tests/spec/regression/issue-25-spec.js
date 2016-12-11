(function() {

describe("issue #25 regression testing", function() {

  var specData = require("../spec-data.js");
  var jinqJs = require("../../../index.js");

  it("tests the orderBy method when values are blank", function() {
    var data1 = [
      {
        Name: 'Tom', 
        Age: 'a', 
        Location: 'Port Jeff', 
        Sex: 'Male'
      }, {
        Name: 'Jen', 
        Age: '', 
        Location: 'Port Jeff', 
        Sex: 'Female'
      }, {
        Name: 'Tom', 
        Age: 'b', 
        Location: 'Port Jeff', 
        Sex: 'Male'
      }, {
        Name: 'Diana', 
        Age: '', 
        Location: 'Port Jeff', 
        Sex: 'Female'
      } 
    ];
    
    var result = new jinqJs()
      .from(data1)
      .orderBy([ 
        {
         field: 'Age', 
         sort: 'desc'
        }
      ])
      .select('Name', 'Age', 'Sex');
      
    console.log(result);
  });
  
});

})();
