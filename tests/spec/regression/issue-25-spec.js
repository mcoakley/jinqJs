(function() {

  describe("issue #25 regression testing", function() {

    var jinqJs = require("../../../index.js");

    it("tests the orderBy method when values are blank", function() {
      var data1 = [
        {
          Name: "Tom", Age: "a", Location: "Port Jeff", Sex: "Male" 
        }, 
        {
          Name: "Jen", Age: "", Location: "Port Jeff", Sex: "Female" 
        }, 
        {
          Name: "Tom", Age: "b", Location: "Port Jeff", Sex: "Male" 
        }, 
        {
          Name: "Diana", Age: "", Location: "Port Jeff", Sex: "Female" 
        } 
      ];
    
      var validData = [ 
        {
          Name: "Tom", Age: "b", Sex: "Male" 
        },
        {
          Name: "Tom", Age: "a", Sex: "Male" 
        },
        {
          Name: "Jen", Age: null, Sex: "Female" 
        },
        {
          Name: "Diana", Age: null, Sex: "Female" 
        } 
      ];

      var result = new jinqJs()
      .from(data1)
      .orderBy([ 
        {
          field: "Age", 
          sort: "desc"
        }
      ])
      .select("Name", "Age", "Sex");
  
    /*
    With the bug in issue #25 the following is the output prior to the fix.
    Notice the Age column has two null values mixed in with valid data.
    (Ignore that Age is set to text values.)

    [ { Name: 'Tom', Age: 'a', Sex: 'Male' },
    { Name: 'Jen', Age: null, Sex: 'Female' },
    { Name: 'Tom', Age: 'b', Sex: 'Male' },
    { Name: 'Diana', Age: null, Sex: 'Female' } ]
    
    The correct order with the fix for issue #25
    
    [ { Name: 'Tom', Age: 'b', Sex: 'Male' },
    { Name: 'Tom', Age: 'a', Sex: 'Male' },
    { Name: 'Jen', Age: null, Sex: 'Female' },
    { Name: 'Diana', Age: null, Sex: 'Female' } ]
    */

      expect(result).toEqual(validData);
    });
  
  });

})();
