describe("jinqJS Suite", function () {

  var specData = require("../spec-data.js");
  var jinqJs = require("../../../index.js");
  
/* ----------------------------------------------------------------------------
 *
 *  Start Tests
 *
 * ----------------------------------------------------------------------------
 */
 
  describe("Test jinqJs object", function() {
    
    it("can be instanciated", function() {
      var result = new jinqJs;
      
      expect(result).not.toBeNull();
    });
    
    it("can be instanciated with settings", function () {
      var result = new jinqJs({
        includeIdentity: false
      });
      
      expect(result).not.toBeNull();
    });
    
  });

  describe(".from()", function () {
    
    describe("conditions for early return and skipping data", function() {
    
      it("empty .from()", function() {
        var result = new jinqJs().from().select();
        
        expect(result).toEqual([]);
      });
      
      it(".from() with only a null argument", function() {
        var result = new jinqJs().from(null).select();
        
        expect(result).toEqual([]);
      });
      
      it("skipping a null argument", function() {
        var result = new jinqJs()
          .from(null, specData.people1)
          .select();
        
        expect(result.length).toEqual(4);
      });
      
      it("skipping an empty array argument", function() {
        var result = new jinqJs().from([], specData.people1).select();
        
        expect(result.length).toEqual(4);
      });
      
      it("skipping a function in the arguments, proper callback order", 
        function() {
          var result = new jinqJs()
          .from(specData.people1, function(self) { return self; })
          .select();
        
          expect(result.length).toEqual(4);
        });

      it("skipping a function in the arguments, improper callback order", 
        function() {
          var result = new jinqJs()
          .from(function(self) { return self; }, specData.people1)
          .select();
        
          expect(result.length).toEqual(4);
        });
        
      it("throws an error because of removed webservice signature", 
        function() {
          expect(function() {
            return new jinqJs()
            .from("http://www.example.com", function(self) { return self; })
            .select();
          }).toThrow(new Error("Web service calls no longer directly " +
          "supported. Use the fromWebService plugin for this type " + 
          "of call."));
        });
      
    });
    
    describe("Tests coverage for supporting methods", function() {
    
      // We use flattenCollection so we must ensure it is covered through 
      // .from
      
      it("Calls flattenCollection with 1 member", function() {
        var result = new jinqJs().from(specData.people1).select();
  
        expect(result.length).toEqual(4);
      });

      it("Calls flattenCollection with 2 members", function() {
        var result = new jinqJs()
          .from(specData.people1, specData.people2)
          .select();
  
        expect(result.length).toEqual(7);
      });

      it("Calls flattenCollection with 3 members", function() {
        var result = new jinqJs()
          .from(specData.people1, specData.people2, specData.people3)
          .select();
  
        expect(result.length).toEqual(8);
      });

      it("Calls flattenCollection with 4 members", function() {
        var result = new jinqJs()
          .from(specData.people1, specData.people2, specData.people3, 
            specData.people4)
          .select();
  
        expect(result.length).toEqual(9);
      });

      it("Calls flattenCollection with 5 members", function() {
        var result = new jinqJs()
          .from(specData.people1, specData.people2, specData.people3, 
            specData.people4, specData.people5)
          .select();
  
        expect(result.length).toEqual(10);
      });

      it("Calls flattenCollection with 6 members", function() {
        var result = new jinqJs()
          .from(specData.people1, specData.people2, specData.people3, 
            specData.people4, specData.people5, specData.people6)
          .select();
  
        expect(result.length).toEqual(11);
      });
      
      it("Call on with only from called", function() {
        var result = new jinqJs()
          .from(specData.people1, specData.people2)
          .on("Age")
          .select();
        
        expect(result).toEqual([]);
      });

      it("Call on with only from called", function() {
        var result = new jinqJs()
          .from(specData.people1)
          .on("Age")
          .select();
        
        expect(result.length).toEqual(4);
      });
      
    });

    it("sync", function () {
      var result = new jinqJs().from(specData.people1).select();

      expect(result.length).toEqual(4);
      expect(result[0].Age).toEqual(29);
      expect(result[3].Age).toEqual(11);
    });

    it("UNION All (Complex)", function () {
      var result = new jinqJs()
        .from(specData.people1, specData.people2, specData.people3)
        .select();

      expect(result.length).toEqual(8);
      expect(result[0].Age).toEqual(29);
      expect(result[4].Age).toEqual(23);
      expect(result[7].Age).toEqual(0);
    });

    it("UNION All (Simple)", function () {
      var result = new jinqJs()
        .from(specData.simpleAges1, specData.simpleAges2)
        .select();

      expect(result.length).toEqual(8);
      expect(result[0]).toEqual(29);
      expect(result[4]).toEqual(14);
    });
    
  });
  
  describe(".select()", function () {
    
    describe("conditions for early return and skipping data", function() {

      it("empty .select() = no arguments", function() {
        var result = new jinqJs().from(specData.people1).select();
        
        expect(result).toEqual(specData.people1);
      });
    
      it("empty .from() = no result", function() {
        var result = new jinqJs().from().select("Name", "Age");
        
        expect(result).toEqual([]);
      });
      
      it("empty .select()", function() {
        var result = new jinqJs().from(specData.people1).select();
        
        expect(result.length).toEqual(4);
      });
      
    });
    
    describe("different types of .select() signatures for coverage", 
      function() {
      
        it("Complex - Predicate Using row & index", function () {
          var data = JSON.parse(JSON.stringify(specData.people1));
        
          var result = new jinqJs().from(data)
          .select(function (row, index) {
            row.index = index + 1;
            return row;
          });
  
          expect(result.length).toEqual(4);
          expect(result[0].index).toEqual(1);
          expect(result[3].index).toEqual(4);
        });
  
        it("Complex - Multiple Specific String Columns", function () {
          var result = new jinqJs().from(specData.people1).select("Age", "Name");
  
          expect(result.length).toEqual(4);
          expect(result[0].Age).toEqual(29);
          expect(result[0].Name).toEqual("Tom");
          expect(result[0].Location).toBeUndefined();
        });
  
        it("Complex - Complex Array Object - Constant Column", function () {
          var data = JSON.parse(JSON.stringify(specData.people1));
        
          var result = new jinqJs().from(data)
          .select([
            {
              field: "Age" 
            }, {
              field: "Name" 
            }, {
              text: "IsHuman", value: true
            }
          ]);
  
          expect(result.length).toEqual(4);
          expect(result[0].Age).toEqual(29);
          expect(result[0].Name).toEqual("Tom");
          expect(result[0].Location).toBeUndefined();
          expect(result[0].IsHuman).toBeTruthy();
        });
  
        it("Complex - Complex Array Object - Calculated Column", function () {
          var data = JSON.parse(JSON.stringify(specData.people1));
        
          var result = new jinqJs().from(data)
          .select([
            {
              field: "Age" 
            }, {
              field: "Name" 
            }, {
              text: "IsHuman", 
              value: function (row) {
                row.IsHuman = true;
                return row;
              }
            }
          ]);
  
          expect(result.length).toEqual(4);
          expect(result[0].Age).toEqual(29);
          expect(result[0].Name).toEqual("Tom");
          expect(result[0].Location).toBeUndefined();
          expect(result[0].IsHuman).toBeTruthy();
        });
  
        it("Complex - Complex Array Object - Change field text", function () {
          var data = JSON.parse(JSON.stringify(specData.people1));
      
          var result = new jinqJs().from(data)
          .select([
            {
              field: "Age" 
            }, {
              field: "Name", 
              text: "Title"
            }
          ]);
  
          expect(result.length).toEqual(4);
          expect(result[0].Age).toEqual(29);
          expect(result[0].Name).toBeUndefined();
          expect(result[0].Title).toEqual("Tom");
        });
  
        it("Simple - Converting a string array to a collection", function () {
          var result = new jinqJs()
          .from(["Tom", "Jen", "Sandy"])
          .select([{
            text: "Name" 
          }]);
  
          expect(result.length).toEqual(3);
          expect(result[0].Name).toEqual("Tom");
        });
  
        it("Key/Value - Converting to collections using positional", 
        function () {
          var result = new jinqJs()
          .from([
            {
              "john": 28 
            }, {
              "bob": 34 
            }, {
              "joe": 4 
            }
          ])
          .select([
            {
              field: 0, 
              text: "Ages" 
            }
          ]);
  
          expect(result.length).toEqual(3);
          expect(result[0].Ages).toEqual(28);
        });

        it("presents a dataset with a zero for a value", function() {
          var result = new jinqJs()
          .from(specData.people3)
          .select("Name", "Age");
        
          expect(result.length).toEqual(1);
          expect(result[0].Age).toEqual(0);
        });
      
        it("presents a dataset with a null for a value", function() {
          var result = new jinqJs()
          .from(specData.people7)
          .select("Name", "Location");
        
          expect(result.length).toEqual(1);
          expect(result[0].Location).toBeNull();
        });
      
        it("turns on the includeIdentity setting", function() {
          var result = new jinqJs({
            includeIdentity: true 
          })
          .from(specData.people1)
          .select();
        
          expect(result.length).toEqual(4);
          expect(result[3].ID).toEqual(4);
        
          new jinqJs({
            includeIdentity: false 
          });
        });
      
        it("turns on the includeIdentity setting and ensures we receive an " +
        "empty results array", function() {
          var result = new jinqJs({
            includeIdentity: true 
          })
          .from()
          .select();
          
          expect(result).toEqual([]);
        
          new jinqJs({
            includeIdentity: false 
          });
        });

      });
    
  });
  
  describe(".update()", function() {
  
    it("force a duplicate update exception", function() {
      expect(function() {
        return new jinqJs().from(specData.people1)
          .update(function() { })
          .update();
      }).toThrow(new Error("A pending update operation exists!"));
    });
    
    it("force a delete operation exception", function() {
      expect(function() {
        return new jinqJs().from(specData.people1)
          .delete()
          .update();
      }).toThrow(new Error("A pending delete operation exists!"));
    });
    
    it("exit early - no predicate", function() {
      expect(function() {
        return new jinqJs().from(specData.people1)
          .update();
      }).toThrow(new Error("You must define a predicate for update()"));
    });
    
  });
  
  describe(".delete()", function() {
    
    it("force a duplicate delete exception", function() {
      expect(function() {
        return new jinqJs().from(specData.people1)
          .delete()
          .delete();
      }).toThrow(new Error("A pending delete operation exists!"));
    });

    it("force an update operation exception", function() {
      expect(function() {
        return new jinqJs().from(specData.people1)
          .update(function() { })
          .delete();
      }).toThrow(new Error("A pending update operation exists!"));
    });
    
  });
  
  describe(".at()", function() {
  
    it("exits early - no update or delete called", function() {
      var result = new jinqJs().from(specData.people1).at().select();
      
      expect(result.length).toEqual(4);
    });

    it("exits early - no results", function() {
      var result = new jinqJs().from()
        .update(function() { })
          .at()
        .select();
      
      expect(result).toEqual([]);
    });
    
  });

  describe(".update().at()", function () {
  
    it("Simple - In-Place Update .at() with no Parameters.", function () {
      var data = JSON.parse(JSON.stringify(specData.people1));

      new jinqJs()
        .from(data)
        .update(function (coll, index) { 
          coll[index].Location = "Port Jeff Sta."; 
        })
          .at();

      expect(data.length).toEqual(4);
      expect(data[0].Location).toEqual("Port Jeff Sta.");
      expect(data[1].Location).toEqual("Port Jeff Sta.");
      expect(data[2].Location).toEqual("Port Jeff Sta.");
      expect(data[3].Location).toEqual("Port Jeff Sta.");
    });

    it("Simple - Upate/Delete primitive types.", function () {
      var simple = [3, 5, 4, 1, 2, 8, 4];

      var data = new jinqJs()
        .from(simple)
        .distinct()
        .delete()
          .at(function (coll, index) { 
            return coll[index] <= 3; 
          })
        .orderBy([
          {
            sort: "asc"
          }
        ])
        .update(function (coll, index) { 
          coll[index] = coll[index] + 100; 
        })
          .at(function (coll, index) { 
            return index % 2 === 0;
          })
        .select();

      expect(data.length).toEqual(3);
      expect(data[0]).toEqual(104);
      expect(data[1]).toEqual(5);
      expect(data[2]).toEqual(108);
    });

    it("Simple - In-Place Update .at() with single string Parameter.", 
      function () {
        var data = JSON.parse(JSON.stringify(specData.people1));

        new jinqJs()
        .from(data)
        .update(function (coll, index) { 
          coll[index].Name = "Thomas";
        })
          .at("Name = Tom");

        expect(data.length).toEqual(4);
        expect(data[0].Name).toEqual("Thomas");
        expect(data[1].Name).toEqual("Jen");
        expect(data[2].Name).toEqual("Thomas");
        expect(data[3].Name).toEqual("Diana");
      });

    it("Simple - In-Place Update .at() with multiple string Parameters.", 
      function () {
        var data = JSON.parse(JSON.stringify(specData.people1));

        new jinqJs()
        .from(data)
        .update(function (coll, index) {
          coll[index].Name = "Thomas"; 
        })
          .at("Name = Tom", "Age = 29");

        expect(data.length).toEqual(4);
        expect(data[0].Name).toEqual("Thomas");
        expect(data[1].Name).toEqual("Jen");
        expect(data[2].Name).toEqual("Tom");
        expect(data[3].Name).toEqual("Diana");
      });

    it("Complex - Update with .at() predicate updating rows from a " +
      "join returning results.", 
      function () {
        var data = JSON.parse(JSON.stringify(specData.people1));
      
        var result = new jinqJs()
        .from(data)
        .join(specData.sexType)
          .on("Sex")
        .where("Age < 30")
        .update(function (coll, index) { 
          coll[index].Name = "Thomas";
        })
          .at(function (coll, index) { 
            return (index === 1 && coll[index].Age === 14);
          })
        .select();

        expect(result.length).toEqual(3);
        expect(result[0].Name).toEqual("Tom");
        expect(result[1].Name).toEqual("Thomas");
        expect(result[2].Name).toEqual("Diana");
      });

  });

  describe(".delete().at()", function () {
  
    it("Complex - with .at() empty", function() {
      var data = JSON.parse(JSON.stringify(specData.people1));
      
      var result = new jinqJs()
        .from(data)
        .delete()
        .at()
        .select();
        
      expect(result).toEqual([]);
    });

    it("Complex - with .at() with a single parameter.", function () {
      var data = JSON.parse(JSON.stringify(specData.people1));
      
      var result = new jinqJs()
        .from(data)
        .join(specData.sexType)
          .on("Sex")
        .where("Age < 30")
        .update(function (coll, index) { 
          coll[index].Name = "Thomas";
        })
          .at(function (coll, index) { 
            return (index === 1 && coll[index].Age === 14);
          })
        .delete()
          .at("Age = 11")
        .select();

      expect(result.length).toEqual(2);
      expect(result[0].Age).toEqual(29);
      expect(result[1].Age).toEqual(14);
    });
    
    it("Complex - Delete with .at() predicate updating rows from a " +
      "join returning results.",
      function () {
        var data = JSON.parse(JSON.stringify(specData.people1));
      
        var result = new jinqJs()
        .from(data)
        .join(specData.sexType)
          .on("Sex")
        .where("Age < 30")
        .delete()
          .at(function (coll, index) { 
            return (index === 1 && coll[index].Age === 14);
          })
        .select();

        expect(result.length).toEqual(2);
        expect(result[0].Name).toEqual("Tom");
        expect(result[1].Name).toEqual("Diana");
      });

  });

  describe(".concat()", function () {
  
    it("(Complex)", function () {
      var result = new jinqJs()
        .from(specData.people1)
        .concat(specData.people2, specData.people3)
        .select();

      expect(result.length).toEqual(8);
      expect(result[0].Age).toEqual(29);
      expect(result[4].Age).toEqual(23);
      expect(result[7].Age).toEqual(0);
    });

    it("(Simple)", function () {
      var result = new jinqJs()
        .from(specData.simpleAges1)
        .concat(specData.simpleAges2, [88, 99])
        .select();

      expect(result.length).toEqual(10);
      expect(result[0]).toEqual(29);
      expect(result[4]).toEqual(14);
      expect(result[8]).toEqual(88);
    });
    
  });
  
  describe(".union()", function () {
  
    it("exits early because there are no arguments", function() {
      // This test is for coverage
      var result = new jinqJs().from(specData.people1).union().select();
      
      expect(result.length).toEqual(4);
    });
    
    it("(Complex)", function () {
      var result = new jinqJs()
        .from(specData.people1)
        .union(specData.people2, specData.people3)
        .select();

      expect(result.length).toEqual(8);
      expect(result[0].Age).toEqual(29);
      expect(result[2].Age).toEqual(14);
      expect(result[4].Age).toEqual(23);
    });

    it("(Simple) Numbers", function () {
      var result = new jinqJs()
        .from(specData.simpleAges1)
        .union(specData.simpleAges2, [30, 50])
        .select();

      expect(result.length).toEqual(8);
      expect(result[0]).toEqual(29);
      expect(result[6]).toEqual(60);
      expect(result[7]).toEqual(50);
    });

    it("(Simple) Strings", function () {
      var result = new jinqJs()
        .from(["Tom", "Frank"])
        .union(["Bob", "Tom" ], ["Chris"])
        .select();

      expect(result.length).toEqual(4);
      expect(result[0]).toEqual("Tom");
      expect(result[3]).toEqual("Chris");
    });
    
  });

  describe(".join() and .on()", function () {
    
    it("exits early - no arguments", function() {
      var result = new jinqJs()
        .from(specData.people1)
        .union(specData.people2)
        .join()
        .select();

      expect(result.length).toEqual(7);
      expect(result[0].people).toBeUndefined();
    });
    
    it("nothing joined - predicate tried to be added", function() {
      var result = new jinqJs()
        .from(specData.people1)
        .union(specData.people2)
        .join(function() {
          return "I don't do anything...";
        })
        .select();

      expect(result.length).toEqual(7);
      expect(result[0].people).toBeUndefined();
    });
    
    it("(Complex - Single Collection)", function () {
      var result = new jinqJs()
        .from(specData.people1)
        .union(specData.people2)
        .join(specData.population)
          .on("Location")
        .select();

      expect(result.length).toEqual(1);
      expect(result[0].people).toEqual(123);
    });

    it("(Complex - Multiple Collections)", function () {
      var result = new jinqJs()
        .from(specData.people1)
        .union(specData.people2)
        .join(specData.population, specData.temps)
          .on("Location")
        .select();

      expect(result.length).toEqual(1);
      expect(result[0].people).toEqual(123);
      expect(result[0].temp).toEqual(85);
    });
    
  });

  describe(".on()", function () {
    
    it("exits early - no arguments", function() {
      var result = new jinqJs()
        .from(specData.people1)
        .join(specData.sexType)
          .on()
        .select();

      expect(result.length).toEqual(4);
    });
    
    it("exits early - no collections.func set", function() {
      var result = new jinqJs()
        .from()
        .on("Location")
        .select();

      expect(result).toEqual([]);
    });
    
    it("(Complex - Multiple Columns)", function () {
      var result = new jinqJs()
        .from(specData.people1)
        .union(specData.people2)
        .join(specData.sexType)
          .on("Location", "Sex")
        .select();

      expect(result.length).toEqual(1);
      expect(result[0].Title).toEqual("Its a boy!");
      expect(result[0].Age).toEqual(57);
    });

    it("(Complex - Predicate - inner join)", function () {
      var result = new jinqJs()
        .from(specData.people1, specData.people2)
        .join(specData.sexType)
          .on(function (left, right) {
            return left.Location === right.Location;
          })
        .select();

      // Multiple matches (Both are Male because its using the 
      // field from the left side collection)
      expect(result.length).toEqual(2);
      expect(result[0].Sex).toEqual("Male");
      expect(result[1].Sex).toEqual("Male");

      result = new jinqJs()
        .from(specData.people1, specData.people2)
        .join(specData.sexType)
          .on(function (left, right) {
            return left.Location === right.Location && 
              left.Sex === right.Sex;
          })
        .select();

      // Single match
      expect(result.length).toEqual(1);
      expect(result[0].Title).toEqual("Its a boy!");
      expect(result[0].Age).toEqual(57);
    });

    it("(Complex - Predicate - outer join)", function () {
      var result = new jinqJs()
        .from(specData.people1, specData.people2)
        .leftJoin(specData.sexType)
          .on(function (left, right) {
            return left.Location === right.Location && 
              left.Sex === right.Sex;
          })
        .select();

      expect(result.length).toEqual(7);

      result = new jinqJs()
        .from(specData.people2)
        .leftJoin(specData.sexType)
          .on(function (left, right) {
            return left.Location === right.Location && 
              left.Sex === right.Sex;
          })
        .select();

      expect(result.length).toEqual(3);
      expect(result[0].Age).toEqual(23);
      expect(result[2].Age).toEqual(57);
      expect(result[0].Title).toEqual("");
      expect(result[1].Title).toEqual("");
      expect(result[2].Title).toEqual("Its a boy!");
    });
    
  });

  describe(".leftJoin()", function () {

    it("Complex - Column", function () {
      var result = new jinqJs()
        .from(specData.people2)
        .leftJoin(specData.population)
          .on("Location")
        .select();
        
      expect(result.length).toEqual(3);

      result = new jinqJs()
        .from(result)
        .where("Location == Islip")
        .select();
        
      expect(result[0].people).toEqual(123);

      result = new jinqJs()
        .from(specData.people2)
        .leftJoin(specData.population)
          .on("Location")
        .select();
        
      result = new jinqJs()
        .from(result)
        .where("Location == Smithtown")
        .select();
        
      expect(result[0].people).toEqual("");
    });

    it("Complex - Multiple Collections", function () {
      var result = new jinqJs()
        .from(specData.people2)
        .leftJoin(specData.population, specData.temps)
          .on("Location")
        .select();

      expect(result.length).toEqual(3);
      expect(result[0].people).toEqual("");
      expect(result[2].people).toEqual(123);

      result = new jinqJs()
        .from(result)
        .where("Location == Islip")
        .select();
        
      expect(result[0].temp).toEqual(85);
      expect(result[0].people).toEqual(123);

      result = new jinqJs()
        .from(specData.people2)
        .leftJoin(specData.population, specData.temps)
          .on("Location")
        .select();

      result = new jinqJs()
        .from(result)
        .where("Location == Smithtown")
        .select();

      expect(result[0].temp).toEqual("");
      expect(result[0].people).toEqual("");
    });

    it("Complex - Multiple Columns", function () {
      var result = new jinqJs()
        .from(specData.people2)
        .leftJoin(specData.sexType)
          .on("Location", "Sex")
        .select();

      expect(result.length).toEqual(3);
      expect(result[0].Age).toEqual(23);
      expect(result[2].Age).toEqual(57);
      expect(result[0].Title).toEqual("");
      expect(result[1].Title).toEqual("");
      expect(result[2].Title).toEqual("Its a boy!");

      result = new jinqJs()
        .from(result)
        .where("Location == Islip")
        .select();
      
      expect(result[0].Title).toEqual("Its a boy!");

      result = new jinqJs()
        .from(specData.people2)
        .leftJoin(specData.sexType)
          .on("Location", "Sex")
        .select();
      
      result = new jinqJs()
        .from(result)
        .where("Location == Smithtown")
        .select();
        
      expect(result[0].Title).toEqual("");
    });
    
  });

  describe(".fullJoin()", function () {
    
    it("Complex - Single Column", function () {
      var result = new jinqJs()
        .from(specData.people2)
        .fullJoin(specData.population)
          .on("Location")
        .select();

      expect(result.length).toEqual(4);
      expect(result[0].people).toEqual("");
      expect(result[0].Location).toEqual("Port Jeff");
      expect(result[1].people).toEqual("");
      expect(result[2].people).toEqual(123);
      expect(result[2].Location).toEqual("Islip");
      expect(result[3].people).toEqual(332);
      expect(result[3].Location).toEqual("Melville");
      expect(result[3].Name).toBeNull();
    });

    it("Complex - Multiple Columns", function () {
      var result = new jinqJs()
        .from(specData.people2)
        .fullJoin(specData.sexType)
          .on("Sex", "Location")
        .select();

      expect(result.length).toEqual(4);
      expect(result[0].Title).toEqual("");
      expect(result[2].Title).toEqual("Its a boy!");
      expect(result[3].Title).toEqual("Its a girl!");
      expect(result[3].Location).toEqual("Islip");
      expect(result[3].Name).toBeNull();
    });
    
  });
  
  describe(".in()", function () {
    
    it("exits early - no arguments", function() {
      var result = new jinqJs()
        .from(specData.people1)
        .in()
        .select();
        
      expect(result.length).toEqual(4);
    });
    
    it("exits early - one argument of zero length array", function() {
      var result = new jinqJs()
        .from(specData.people1)
        .in([])
        .select();
        
      expect(result.length).toEqual(4);
    });
    
    it("exits early - one argument and no second argument", function() {
      expect(function() {
        return new jinqJs()
          .from(specData.people1)
          .in(specData.people8)
          .select();
      }).toThrow(new Error("Invalid field or missing field!"));
    });

    it("Complex - Complex to Complex (Single Column)", function () {
      var result = new jinqJs()
        .from(specData.people1)
        .in(specData.people8, "Name")
        .select();

      expect(result.length).toEqual(2);
    });

    it("Complex - Complex to Complex (Multiple Columns)", function () {
      var result = new jinqJs()
        .from(specData.people1)
        .in(specData.people8, "Name", "Age")
        .select();

      expect(result.length).toEqual(1);
    });

    it("Complex - Complex to Simple (Single Column)", function () {
      var result = new jinqJs()
        .from(specData.people1)
        .in(["Jen", "Diana"], "Name")
        .select();

      expect(result.length).toEqual(2);
    });

    it("Complex - Simple to Simple", function () {
      var result = new jinqJs()
        .from([1, 2, 3, 4])
        .in([3, 4, 5])
        .select();

      expect(result.length).toEqual(2);
    });

    describe(".not().in()", function () {
      
      it("Complex - Complex to Complex (Single Column)", function () {
        var result = new jinqJs()
          .from(specData.people1)
          .not().in(specData.people8, "Name")
          .select();

        expect(result.length).toEqual(2);
        expect(result[0].Age).toEqual(30);
        expect(result[1].Age).toEqual(11);
      });

      it("Complex - Complex to Complex (Multiple Columns)", function () {
        var result = new jinqJs()
          .from(specData.people1)
          .not().in(specData.people8, "Name", "Age")
          .select();

        expect(result.length).toEqual(3);
        expect(result[0].Age).toEqual(29);
        expect(result[1].Age).toEqual(30);
        expect(result[2].Age).toEqual(11);
      });

      it("Complex - Complex to Simple (Single Column)", function () {
        var result = new jinqJs()
          .from(specData.people1)
          .not().in(["Jen", "Tom"], "Name")
          .select();

        expect(result.length).toEqual(1);
        expect(result[0].Name).toEqual("Diana");
      });

      it("Complex - Simple to Simple", function () {
        var result = new jinqJs()
          .from([1, 2, 3, 4])
          .not().in([2, 3, 4, 5])
          .select();

        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(1);
      });
      
    });
    
  });

  describe(".where()", function () {
    
    it("exits early - no predicate defined", function() {
      var result = new jinqJs()
        .from(specData.people1)
        .where()
        .select();

      expect(result.length).toEqual(4);
    });
    
    it("throws an expression exception error", function() {
      expect(function() {
        return new jinqJs()
          .from(specData.people1)
          .where("Name Steve")
          .select();  
      }).toThrow(new Error("Invalid expression - must have four parts! (" +
        "Name Steve)"));
    });

    it("check all of the operators", function() {
      var result = new jinqJs().from(specData.people1)
        .where("Name == Steve").select();
        
      expect(result.length).toEqual(0);

      result = new jinqJs().from(specData.people1)
        .where("Name === Steve").select();
        
      expect(result.length).toEqual(0);
      
      result = new jinqJs().from(specData.people1)
        .where("Name != Steve").select();
        
      expect(result.length).toEqual(4);
      
      result = new jinqJs().from(specData.people1)
        .where("Name !== Steve").select();
        
      expect(result.length).toEqual(4);

      result = new jinqJs().from(specData.people1)
        .where("Age > 25").select();
        
      expect(result.length).toEqual(2);
      
      result = new jinqJs().from(specData.people1)
        .where("Age >= 29").select();
        
      expect(result.length).toEqual(2);
      
      result = new jinqJs().from(specData.people1)
        .where("Age < 25").select();
        
      expect(result.length).toEqual(2);
      
      result = new jinqJs().from(specData.people1)
        .where("Age <= 14").select();
        
      expect(result.length).toEqual(2);

      result = new jinqJs().from(specData.people1)
        .where("Name * n").select();
        
      expect(result.length).toEqual(2);
    });
    
    it("Complex - Multiple Simple Conditions", function () {
      var result = new jinqJs()
        .from(specData.people1)
        .where("Age < 20", "Sex === Male")
        .select();

      expect(result.length).toEqual(1);
      expect(result[0].Age).toEqual(14);
    });

    it("Complex - Multiple Simple Conditions With Spaces", function () {
      var result = new jinqJs()
        .from(specData.people1)
        .where("Age < 20", "Location === Port Jeff")
        .select();

      expect(result.length).toEqual(2);
      expect(result[0].Age).toEqual(14);
    });

    it("Complex - Predicate Using row & index", function () {
      var result = new jinqJs()
        .from(specData.people1)
        .where(function (row, index) { 
          return index === 1 && row.Name === "Jen"; 
        })
        .select();

      expect(result.length).toEqual(1);
      expect(result[0].Age).toEqual(30);
    });

    it("Simple - Predicate Using row & index", function () {
      var result = new jinqJs()
        .from([1, 2, 3, 4, 5, 6])
        .where(function (row, index) { // eslint-disable-line no-unused-vars
          return row % 2 === 0; 
        })
        .select();

      expect(result.length).toEqual(3);
      expect(result[0]).toEqual(2);
    });

    it("Simple - Simple Condition Using Contains", function () {
      var result = new jinqJs()
        .from(specData.people1)
        .where("Name * om")
        .select();

      expect(result.length).toEqual(2);
      expect(result[0].Name === "Tom" && result[1].Name === "Tom")
        .toBeTruthy();
    });

    it("Simple - Predicate Using row & index with the filter()", function () {
      var result = new jinqJs()
        .from([1, 2, 3, 4, 5, 6])
        .filter(function (row, index) { // eslint-disable-line no-unused-vars
          return row % 2 === 0;
        })
        .select();

      expect(result.length).toEqual(3);
      expect(result[0]).toEqual(2);
    });
    
  });

  describe(".groupBy()", function () {
    
    describe(".sum()", function () {
      
      it("Complex - Multiple Columns", function () {
        var result = new jinqJs()
          .from(specData.people1)
          .groupBy("Name", "Age")
            .sum("Age")
          .select();

        expect(result.length).toEqual(4);

        result = new jinqJs().from(result).where("Name == Tom").select();
        
        expect(result.length).toEqual(2);
        expect(result[0].Age === 29 && result[1].Age === 14).toBeTruthy();
      });

      it("Complex - Multiple Columns & Multiple Aggregate Columns", 
        function () {
          var result = new jinqJs()
          .from(specData.people2, specData.people3, specData.people4)
          .leftJoin(specData.population)
            .on("Location")
          .groupBy("Name", "Age")
            .sum("Age", "people")
          .select();

          expect(result.length).toEqual(5);

          result = new jinqJs().from(result).where("Name == Frank").select();
        
          expect(result.length).toEqual(2);
          expect(result[0].Age === 0 && 
          result[0].people === 332 && 
          result[1].Age === 67 && 
          result[1].people === 123)
        .toBeTruthy();
        });

      it("Complex - Single Columns & Multiple Aggregate Columns", function () {
        var result = new jinqJs()
          .from(specData.people2, specData.people3, specData.people4)
          .leftJoin(specData.population)
            .on("Location")
          .groupBy("Name")
            .sum("Age", "people")
          .select();

        expect(result.length).toEqual(4);

        result = new jinqJs().from(result).where("Name == Frank").select();
        
        expect(result.length).toEqual(1);
        expect(result[0].Age === 67 && result[0].people === 455).toBeTruthy();
      });

      it("Complex - Single Column", function () {
        var result = new jinqJs()
          .from(specData.people1)
          .groupBy("Name")
            .sum("Age")
          .select();

        expect(result.length).toEqual(3);

        result = new jinqJs().from(result).where("Name == Tom").select();
        
        expect(result.length).toEqual(1);
        expect(result[0].Age).toEqual(29 + 14);
      });

      it("Simple", function () {
        var result = new jinqJs().from([1, 2, 3, 4, 5]).sum().select();

        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(15);
      });
      
    });

    describe(".min()", function () {
      
      it("Complex - Multiple Columns", function () {
        var result = new jinqJs()
          .from(specData.people1)
          .groupBy("Name", "Age")
            .min("Age")
          .select();

        expect(result.length).toEqual(4);

        result = new jinqJs().from(result).where("Name == Tom").select();
        
        expect(result.length).toEqual(2);
        expect(result[0].Age === 29 && result[1].Age === 14).toBeTruthy();
      });

      it("Complex - Multiple Columns & Multiple Aggregate Columns", function () {
        var result = new jinqJs()
          .from(specData.people2, specData.people3, specData.people4)
          .leftJoin(specData.population)
            .on("Location")
          .groupBy("Name", "Age")
            .min("Age", "people")
          .select();

        expect(result.length).toEqual(5);

        result = new jinqJs().from(result).where("Name == Frank").select();
        
        expect(result.length).toEqual(2);
        expect(result[0].Age === 0 && 
          result[0].people === 332 && 
          result[1].Age === 67 && 
          result[1].people === 123)
        .toBeTruthy();
      });

      it("Complex - Single Columns & Multiple Aggregate Columns", function () {
        var result = new jinqJs()
          .from(specData.people2, specData.people3, specData.people4)
          .leftJoin(specData.population)
            .on("Location")
          .groupBy("Name")
            .min("Age", "people")
          .select();

        expect(result.length).toEqual(4);
        
        result = new jinqJs().from(result).where("Name == Frank").select();
        
        expect(result.length).toEqual(1);
        expect(result[0].Age === 0 && result[0].people === 123).toBeTruthy();
      });

      it("Complex - Single Column", function () {
        var result = new jinqJs()
          .from(specData.people1)
          .groupBy("Name")
            .min("Age")
          .select();

        expect(result.length).toEqual(3);

        result = new jinqJs().from(result).where("Name == Tom").select();
        
        expect(result.length).toEqual(1);
        expect(result[0].Age).toEqual(14);
      });

      it("Simple", function () {
        var result = new jinqJs().from([2, 1, 3, 4, 5]).min().select();

        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(1);
      });
      
    });

    describe(".max()", function () {
      
      it("Complex - Multiple Columns", function () {
        var result = new jinqJs()
          .from(specData.people1)
          .groupBy("Name", "Age")
            .max("Age")
          .select();

        expect(result.length).toEqual(4);

        result = new jinqJs().from(result).where("Name == Tom").select();
        
        expect(result.length).toEqual(2);
        expect(result[0].Age === 29 && result[1].Age === 14).toBeTruthy();
      });

      it("Complex - Multiple Columns & Multiple Aggregate Columns", 
        function () {
          var result = new jinqJs()
          .from(specData.people2, specData.people3, specData.people4)
          .leftJoin(specData.population).on("Location")
          .groupBy("Name", "Age")
            .max("Age", "people")
          .select();

          expect(result.length).toEqual(5);

          result = new jinqJs().from(result).where("Name == Frank").select();
        
          expect(result.length).toEqual(2);
          expect(result[0].Age === 0 && 
          result[0].people === 332 && 
          result[1].Age === 67 && 
          result[1].people === 123)
        .toBeTruthy();
        });

      it("Complex - Single Columns & Multiple Aggregate Columns", function () {
        var result = new jinqJs()
          .from(specData.people2, specData.people3, specData.people4)
          .leftJoin(specData.population)
            .on("Location")
          .groupBy("Name")
            .max("Age", "people")
          .select();

        expect(result.length).toEqual(4);

        result = new jinqJs().from(result).where("Name == Frank").select();
        
        expect(result.length).toEqual(1);
        expect(result[0].Age === 67 && result[0].people === 332).toBeTruthy();
      });

      it("Complex - Single Column", function () {
        var result = new jinqJs()
          .from(specData.people1)
          .groupBy("Name")
            .max("Age")
          .select();

        expect(result.length).toEqual(3);

        result = new jinqJs().from(result).where("Name == Tom").select();
        
        expect(result.length).toEqual(1);
        expect(result[0].Age).toEqual(29);
      });

      it("Simple", function () {
        var result = new jinqJs().from([2, 1, 3, 4, 5]).max().select();

        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(5);
      });
      
    });

    describe(".avg()", function () {
      
      it("Complex - Multiple Columns", function () {
        var result = new jinqJs()
          .from(specData.people1)
          .groupBy("Name", "Age")
            .avg("Age")
          .select();

        expect(result.length).toEqual(4);

        result = new jinqJs().from(result).where("Name == Tom").select();
        
        expect(result.length).toEqual(2);
        expect(result[0].Age === 29 && result[1].Age === 14).toBeTruthy();
      });

      it("Complex - Multiple Columns & Multiple Aggregate Columns", 
        function () {
          var result = new jinqJs()
          .from(specData.people2, specData.people3, specData.people4)
          .leftJoin(specData.population)
            .on("Location")
          .groupBy("Name", "Age")
            .avg("Age", "people")
          .select();

          expect(result.length).toEqual(5);

          result = new jinqJs().from(result).where("Name == Frank").select();
        
          expect(result.length).toEqual(2);
          expect(result[0].Age === 0 && 
          result[0].people === 332 && 
          result[1].Age === 67 && 
          result[1].people === 123)
        .toBeTruthy();
        });

      it("Complex - Single Columns & Multiple Aggregate Columns", function () {
        var result = new jinqJs()
          .from(specData.people2, specData.people3, specData.people4)
          .leftJoin(specData.population)
            .on("Location")
          .groupBy("Name")
            .avg("Age", "people")
          .select();

        expect(result.length).toEqual(4);

        result = new jinqJs().from(result).where("Name == Frank").select();

        expect(result.length).toEqual(1);
        expect(result[0].Age === 33.5 && 
          result[0].people === 227.5)
        .toBeTruthy();
      });

      it("Complex - Single Column", function () {
        var result = new jinqJs()
          .from(specData.people1)
          .groupBy("Name")
            .avg("Age")
          .select();

        expect(result.length).toEqual(3);

        result = new jinqJs().from(result).where("Name == Tom").select();
        
        expect(result.length).toEqual(1);
        expect(result[0].Age).toEqual(21.5);
      });

      it("Simple", function () {
        var result = new jinqJs().from([2, 1, 3, 4, 5]).avg().select();

        expect(result.length).toEqual(1);
        expect(result[0]).toEqual(3);
      });
      
    });

    describe(".count()", function () {
      
      it("Complex - Multiple Columns", function () {
        var result = new jinqJs()
          .from(specData.people1)
          .groupBy("Name", "Age")
            .count("Age")
          .select();

        expect(result.length).toEqual(4);

        result = new jinqJs().from(result).where("Name == Tom").select();
        
        expect(result.length).toEqual(2);
        expect(result[0].Age === 1 && result[1].Age === 1).toBeTruthy();
      });

      it("Complex - Multiple Columns & Multiple Aggregate Columns", 
        function () {
          var result = new jinqJs()
          .from(specData.people2, specData.people3, specData.people4)
          .leftJoin(specData.population)
            .on("Location")
          .groupBy("Name", "Age")
            .count("Age", "people")
          .select();

          expect(result.length).toEqual(5);

          result = new jinqJs().from(result).where("Name == Frank").select();
        
          expect(result.length).toEqual(2);
          expect(result[0].Age === 1 && 
          result[0].people === 1 && 
          result[1].Age === 1 && 
          result[1].people === 1)
        .toBeTruthy();
        });

      it("Complex - Single Columns & Multiple Aggregate Columns", function () {
        var result = new jinqJs()
          .from(specData.people2, specData.people3, specData.people4)
          .leftJoin(specData.population)
            .on("Location")
          .groupBy("Name")
            .count("Age", "people")
          .select();

        expect(result.length).toEqual(4);

        result = new jinqJs().from(result).where("Name == Frank").select();
        
        expect(result.length).toEqual(1);
        expect(result[0].Age === 2 && result[0].people === 2).toBeTruthy();
      });

      it("Complex - Single Column", function () {
        var result = new jinqJs()
          .from(specData.people1)
          .groupBy("Name")
            .count("Age")
          .select();

        expect(result.length).toEqual(3);

        result = new jinqJs().from(result).where("Name == Tom").select();
        
        expect(result.length).toEqual(1);
        expect(result[0].Age).toEqual(2);
      });
      
    });

    describe(".distinct()", function () {
      
      it("Complex - Single Column", function () {
        var result = new jinqJs()
          .from(specData.people1)
          .distinct("Location")
          .select();

        expect(result.length).toEqual(1);
      });

      it("Complex - Multiple Columns", function () {
        var result = new jinqJs()
          .from(specData.people1)
          .distinct("Name", "Location")
          .select();

        expect(result.length).toEqual(3);

        result = new jinqJs().from(result).where("Name == Tom").select();
        
        expect(result.length).toEqual(1);
      });

      it("Complex - Array of Columns", function () {
        var result = new jinqJs()
          .from(specData.people1)
          .distinct(["Name", "Location"])
          .select();

        expect(result.length).toEqual(3);

        result = new jinqJs().from(result).where("Name == Tom").select();
        
        expect(result.length).toEqual(1);
      });

      it("Simple", function () {
        var result = new jinqJs()
          .from([1, 2, 2, 3, 4, 3, 5])
          .distinct()
          .select();

        expect(result.length).toEqual(5);
        expect(result[0]).toEqual(1);
        expect(result[4]).toEqual(5);
      });
      
      it("Complex - Multiple Objects", function() {
        // Completely contrived example in order to achieve coverage
        var grp1 = {
            data: specData.people1
          },
          grp2 = {
            data: specData.people2
          },
          grp3 = grp1;
          
        var result = new jinqJs().from(grp1, grp2, grp3).distinct().select();
        
        expect(result.length).toEqual(2);
      });
      
    });
    
  });

  describe(".orderBy()", function () {
    
    it("Complex - Multiple Columns Simple", function () {
      var result = new jinqJs()
        .from(specData.people1)
        .orderBy("Name", "Age")
        .select();

      expect(result[0].Name === "Diana").toBeTruthy();
      expect(result[2].Name === "Tom" && result[2].Age === 14).toBeTruthy();
    });

    it("Complex - Multiple Columns Complex [field only]", function () {
      var result = new jinqJs()
        .from(specData.people1)
        .orderBy([
          {
            field: "Name"
          }, {
            field: "Age"
          }
        ])
        .select();

      expect(result[0].Name === "Diana").toBeTruthy();
      expect(result[2].Name === "Tom" && result[2].Age === 14).toBeTruthy();
    });

    it("Complex - Multiple Columns Complex [field by name & sort]", function () {
      var result = new jinqJs()
        .from(specData.people1)
        .orderBy([
          {
            field: "Name" 
          }, {
            field: "Age", sort: "desc" 
          }
        ])
        .select();

      expect(result[0].Name === "Diana").toBeTruthy();
      expect(result[2].Name === "Tom" && result[2].Age === 29).toBeTruthy();
    });

    it("Complex - Multiple Columns Complex [field by positional # & sort]", 
      function () {
        var result = new jinqJs()
        .from(specData.people1)
        .orderBy([
          {
            field: 0, sort: "asc" 
          }, {
            field: 1, sort: "desc" 
          }
        ])
        .select();

        expect(result[0].Name === "Diana").toBeTruthy();
        expect(result[2].Name === "Tom" && result[2].Age === 29).toBeTruthy();
      });

    it("Simple - Ascending Numbers", function () {
      var result = new jinqJs()
        .from([4, 2, 8, 1, 3])
        .orderBy([
          {
            sort: "asc" 
          }
        ])
        .select();

      expect(result[0] === 1 && result[4] === 8).toBeTruthy();
    });

    it("Simple - Descending String", function () {
      var result = new jinqJs()
        .from(["Anna", "Zillow", "Mike"])
        .orderBy([
          {
            sort: "desc" 
          }
        ])
        .select();

      expect(result[0] === "Zillow" && result[2] === "Anna").toBeTruthy();
    });
    
  });

  describe(".identity()", function () {
    
    it("Complex - No Column", function () {
      var result = new jinqJs()
        .from(specData.people1, specData.people2)
        .identity()
        .select();

      expect(result.length).toEqual(7);
      expect(result[0].ID).toEqual(1);
      expect(result[6].ID).toEqual(7);
    });

    it("Complex - With Column", function () {
      var result = new jinqJs()
        .from(specData.people1, specData.people2)
        .identity("Row")
        .select();

      expect(result.length).toEqual(7);
      expect(result[0].Row).toEqual(1);
      expect(result[6].Row).toEqual(7);
    });

    it("Simple - No Column", function () {
      var result = new jinqJs()
        .from(specData.simpleAges1, specData.simpleAges2)
        .identity()
        .select();

      expect(result.length).toEqual(8);
      expect(result[0].ID).toEqual(1);
      expect(result[7].ID).toEqual(8);
    });

    it("Simple - With Column", function () {
      var result = new jinqJs()
        .from(specData.simpleAges1, specData.simpleAges2)
        .identity("Row")
        .select();

      expect(result.length).toEqual(8);
      expect(result[0].Row).toEqual(1);
      expect(result[7].Row).toEqual(8);
    });

    it("Global Identity Setting", function () {
      new jinqJs({
        includeIdentity: true 
      });

      var result = new jinqJs()
        .from(specData.simpleAges1, specData.simpleAges2)
        .select();

      expect(result.length).toEqual(8);
      expect(result[0].ID).toEqual(1);
      expect(result[7].ID).toEqual(8);

      new jinqJs({
        includeIdentity: false 
      });
    });
    
  });

  describe(".skip()", function () {
    
    it("exits early - no arguments", function() {
      var result = new jinqJs().from(specData.people1).skip().select();

      expect(result.length).toEqual(4);
    });
    
    it("Complex - Fixed Number", function () {
      var result = new jinqJs().from(specData.people1).skip(3).select();

      expect(result.length).toEqual(1);
      expect(result[0].Age).toEqual(11);
    });

    it("Complex - Percent", function () {
      var result = new jinqJs().from(specData.people1).skip(0.25).select();

      expect(result.length).toEqual(3);
      expect(result[0].Age).toEqual(30);
      expect(result[2].Age).toEqual(11);
    });

    it("Simple - Fixed Number", function () {
      var result = new jinqJs()
        .from(["Tom", "Jen", "Diana", "Sandy"])
        .skip(2)
        .select();

      expect(result.length).toEqual(2);
      expect(result[0]).toEqual("Diana");
      expect(result[1]).toEqual("Sandy");
    });

    it("Simple - Percent", function () {
      var result = new jinqJs()
        .from(["Tom", "Jen", "Diana", "Sandy"])
        .skip(0.75)
        .select();

      expect(result.length).toEqual(1);
      expect(result[0]).toEqual("Sandy");
    });
    
  });

  describe(".top()", function () {
    
    it("Complex - Fixed Number", function () {
      var result = new jinqJs().from(specData.people1).top(2).select();

      expect(result.length).toEqual(2);
      expect(result[0].Age).toEqual(29);
      expect(result[1].Age).toEqual(30);
    });

    it("Complex - Percent", function () {
      var result = new jinqJs().from(specData.people1).top(0.75).select();

      expect(result.length).toEqual(3);
      expect(result[0].Age).toEqual(29);
      expect(result[2].Age).toEqual(14);
    });

    it("Simple - Fixed Number", function () {
      var result = new jinqJs()
        .from(["Tom", "Jen", "Diana", "Sandy"])
        .top(2)
        .select();

      expect(result.length).toEqual(2);
      expect(result[0]).toEqual("Tom");
      expect(result[1]).toEqual("Jen");
    });

    it("Simple - Percent", function () {
      var result = new jinqJs()
        .from(["Tom", "Jen", "Diana", "Sandy"])
        .top(0.75)
        .select();

      expect(result.length).toEqual(3);
      expect(result[0]).toEqual("Tom");
      expect(result[2]).toEqual("Diana");
    });
    
  });

  describe(".bottom()", function () {
    
    it("Complex - Fixed Number", function () {
      var result = new jinqJs().from(specData.people1).bottom(2).select();

      expect(result.length).toEqual(2);
      expect(result[0].Age).toEqual(14);
      expect(result[1].Age).toEqual(11);
    });

    it("Complex - Percent", function () {
      var result = new jinqJs().from(specData.people1).bottom(0.75).select();

      expect(result.length).toEqual(3);
      expect(result[0].Age).toEqual(30);
      expect(result[2].Age).toEqual(11);
    });

    it("Simple - Fixed Number", function () {
      var result = new jinqJs()
        .from(["Tom", "Jen", "Diana", "Sandy"])
        .bottom(2)
        .select();

      expect(result.length).toEqual(2);
      expect(result[0]).toEqual("Diana");
      expect(result[1]).toEqual("Sandy");
    });

    it("Simple - Percent", function () {
      var result = new jinqJs()
        .from([8, 4, 2, 7])
        .bottom(0.75)
        .select();

      expect(result.length).toEqual(3);
      expect(result[0]).toEqual(4);
      expect(result[2]).toEqual(7);
    });
    
  });

  describe("Extensibility", function () {
    
    it("throws an exception for invalid pluginType", function() {
      // eslint-disable-next-line no-unused-vars
      jinqJs.addPlugin("theSillyTest", function(collection, args, storage) {
        return this;
      }, "silly");
        
      expect(function() {
        return new jinqJs().from(specData.people1).theSillyTest().select();
      }).toThrow(new Error("Illegal plugin type (silly)"));
    });
    
    it("Plugin - Chaining", function () {
      jinqJs.addPlugin("overTheHill", function (result) {
        "use strict";

        for (var i = result.length - 1; i > -1; i--) {
          if (result[i].Age < 40) { result.splice(i, 1); }
        }

        // Must return this when chaining functions.
        return this;
      });

      var result = new jinqJs().from(specData.people2).overTheHill().select();
      
      expect(result.length).toEqual(1);
      expect(result[0].Age).toEqual(57);
    });

    it("Plugin - Parameters, Storage", function () {
      
      jinqJs.addPlugin("selectCustom", function (result, args, store) {
        "use strict";

        store.timesCalled = store.timesCalled || 0;
        store.timesCalled++;

        if (store.timesCalled === 1) {
          result.push({
            Name: args[0],
            TimesCalled: store.timesCalled
          });
        } else {
          result[result.length - 1].TimesCalled = store.timesCalled;
        }

        // Return array when ending with the jinqJs chain.
        return result;
      });

      var jinq = new jinqJs().from(specData.people2);
      var result = jinq.selectCustom("Sample");

      expect(result.length).toEqual(4);
      expect(result[3].Name).toEqual("Sample");
      expect(result[3].TimesCalled).toEqual(1);

      result = jinq.selectCustom("Sample");
      expect(result.length).toEqual(4);
      expect(result[3].Name).toEqual("Sample");
      expect(result[3].TimesCalled).toEqual(2);
    });
  });

/*
  describe("angular service", function () {
    var service;

    beforeEach(module("angular-jinqjs"), function () {});

    beforeEach(inject(function (_$jinqJs_) {
      service = _$jinqJs_;
    }));

    it("should have $jinqJs service be defined", function () {
      expect(service).toBeDefined();
    });

    it("$jinqJs service", function () {
      var result = service
                            .from(specData.people2)
                            .select();

      expect(result.length).toEqual(3);
      expect(result[0].Name).toEqual("Tom");
    });
  
    
  });
*/

});
