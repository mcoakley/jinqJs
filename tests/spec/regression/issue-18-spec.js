(function() {
  
  describe("issue #18 regression testing", function() {
  
    var specData = require("../spec-data.js");
    var jinqJs = require("../../../index.js");

  // Fix for bug 1.6.1 when a collection had a 0, a null was returned
    it("Check that internal collections are cleared.", function () {
      var result = new jinqJs()
      .from(specData.people1)
      .select();

      expect(result.length).toEqual(4);

      new jinqJs().delete().at();

      result = new jinqJs()
      .from([])
      .select();

      expect(result.length).toEqual(0);

      result = new jinqJs()
      .from(specData.people2)
      .select();

      expect(result.length).toEqual(3);
    });
    
  });

})();
