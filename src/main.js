define(function(require, exports, module) {
  var AppView = require('src/examples/views/Scrollview/AppView.js');
  var Engine = require('famous/core/Engine');
  var GymData = require('src/examples/data/GymData.js');

  var mainContext = Engine.createContext();

  initApp(GymData());

  function initApp(data) {

    data = GymData();

    var appView = new AppView({ data : data });

    mainContext.add(appView);
  }

});

