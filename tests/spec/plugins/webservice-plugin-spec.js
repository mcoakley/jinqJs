var jinqJs = require("../../../lib/jinqjs.js");
var WebServicePlugin = require("../../../plugins/webservice-plugin.js");

describe("WebServicePlugin Tests", function() {

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

  var weatherSvc = "http://api.openweathermap.org/data/2.5/weather?" +
    "q=port%20jefferson,ny";
    
  var wsp = null;
  
  beforeEach(function() {
    wsp = new WebServicePlugin();
    jinqJs.addPlugin("fromWebService", wsp.from, "from");
  });
  
  it('async', function (done) {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    
    new jinqJs().fromWebService(weatherSvc, function (self) {
      var resultAsync = self.select();

      console.log(resultAsync);
      expect(resultAsync.length).toEqual(1);
      expect(resultAsync[0].coord.lat).toEqual(40.95);
      done();
    });
  });

});
