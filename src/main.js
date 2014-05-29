define(function(require, exports, module) {
  var AppView = require('src/examples/views/Scrollview/AppView.js');
  var Engine = require('famous/core/Engine');
  var GymData = require('src/examples/data/GymData.js');
  var Modifier = require('famous/core/Modifier');
  var Surface = require('famous/core/Surface');
  var EventHandler = require('famous/core/EventHandler');
  var Transform = require('famous/core/Transform');

  var mainContext = Engine.createContext();

  initApp(GymData());

  function initApp(data) {

    data = GymData();

    var options = {
        transition:{duration:450}
    }

    this._eventInput = new EventHandler();
    this._eventOutput = new EventHandler();
    EventHandler.setInputHandler(this, this._eventInput);
    EventHandler.setOutputHandler(this, this._eventOutput);

    var appViewMod = new Modifier();

    var appView = new AppView({ 
      data: data
    });
    appView._eventInput.pipe(this._eventOutput);

    var appViewBackground = new Surface({
      // size: (undefined, undefined),
      properties: {
        backgroundColor: "red"
      }
    });

    //LoginPrompt page events
    this._eventOutput.on('closeLogin',function(){
      console.log('close login main')
      moveDown()
    });
    this._eventOutput.on('userLogin',function(){
      console.log('user login main')
      moveUp()
    });

    //RegisterView events
    this._eventOutput.on('RegisterClose',function(){
      console.log('close register')
      moveDown()
    });
    this._eventOutput.on('RegisterOpen',function(){
      console.log('user login main')
      moveUp()
    });

    function moveUp(){
        console.log('moveup')
        appViewMod.setTransform(Transform.translate(0,-window.innerHeight,0), options.transition)
    }

    function moveDown(){
        console.log('movedown')
        appViewMod.setTransform(Transform.translate(0,0,0), options.transition)
    }

    mainContext.add(appViewMod).add(appView).add(appViewBackground);
  }

});

