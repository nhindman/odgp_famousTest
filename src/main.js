define(function(require, exports, module) {
  // choose your test here
  var AppView = require('src/examples/views/Scrollview/AppView.js');
  var Engine = require('famous/core/Engine');
  var Utility = require('famous/utilities/Utility');
  var GymData = require('src/examples/data/GymData.js');

  var mainContext = Engine.createContext();

  Utility.loadURL(GymData(), initApp);

  function initApp(data) {

    data = GymData();

    var appView = new AppView({ data : data });

    mainContext.add(appView);
  }

});

