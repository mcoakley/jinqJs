
describe("WebServicePlugin Tests", function() {

  var jinqJs = require("../../../index.js");
  var specData = require("../spec-data.js");
  var WebServicePlugin = require("../../../plugins/webservice-plugin.js");
  var nock = require("nock");

  var weatherData = {
    "coord": {
      "lon": -73.07,
      "lat": 40.95
    },
    "weather": [
      {
        "id": 800,
        "main": "Clear",
        "description": "clear sky",
        "icon": "01d"
      }
    ],
    "base": "stations",
    "main": {
      "temp": 277.15,
      "pressure": 1032,
      "humidity": 56,
      "temp_min": 274.15,
      "temp_max": 279.15
    },
    "visibility": 16093,
    "wind": {
      "speed": 4.6,
      "deg": 20
    },
    "clouds": {
      "all": 1 
    },
    "dt": 1478523180,
    "sys": {
      "type": 1,
      "id": 620,
      "message": 0.1682,
      "country": "US",
      "sunrise": 1478518280,
      "sunset": 1478554810
    },
    "id": 5132013,
    "name": "Port Jefferson",
    "cod": 200
  };

  var weatherSvcHost = "http://api.openweathermap.org", 
    weatherSvcPath = "/data/2.5/weather",
    weatherSvcParams = {
      "q": "port%20jefferson,ny" 
    },
    weatherSvcParamsUrlEncoded = "q=port%20jefferson,ny",
    weatherSvcUrl = weatherSvcHost + weatherSvcPath + 
      "?" + weatherSvcParamsUrlEncoded;
      
  var dummySvcHost = "http://www.example.com",
    dummySvcPath = "/SendArray",
    dummySvcUrl = dummySvcHost + dummySvcPath;
    
  var wsp = null;
  
  beforeEach(function() {
    wsp = new WebServicePlugin();
    jinqJs.addPlugin("fromWebService", wsp.from, "from");
    
    nock(weatherSvcHost, {
      "encodedQueryParams":true
    })
      .get(weatherSvcPath)
      .query(weatherSvcParams)
      .reply(200, weatherData);
      
    nock(dummySvcHost)
      .get(dummySvcPath)
      .reply(200, specData.people1);
  });
  
  it("exits early - no arguments", function() {
    var result = new jinqJs().fromWebService();
    
    expect(result).toBeDefined();
  });

  it("throws exception - wrong arguments", function() {
    expect(function() {
      return new jinqJs().fromWebService("Hello");  
    }).toThrow(new Error("The WebServicePlugin requires two arguments"));
  });
  
  it("gets data from mock weather service", function(done) {
    new jinqJs()
      .fromWebService(weatherSvcUrl, function (self) {
        var resultAsync = self.flattenFromData().select();
  
        expect(resultAsync.length).toEqual(1);
        expect(resultAsync[0].coord.lat).toEqual(40.95);
        done();
      });
  });
  
  it("gets data from mock dummy service", function(done) {
    new jinqJs()
      .fromWebService(dummySvcUrl, function (self) {
        var resultAsync = self.flattenFromData().select();
  
        expect(resultAsync.length).toEqual(4);
        done();
      });
    
  });

});
