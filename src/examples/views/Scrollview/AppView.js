/*globals define*/
define(function(require, exports, module) {
  // choose your test here
  var View = require('famous/core/View');
  var Engine = require("famous/core/Engine");
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Scrollview = require("famous/views/Scrollview");
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var ContainerSurface = require('famous/surfaces/ContainerSurface');

  // var mainContext = Engine.createContext();

  function AppView() {

    View.apply(this, arguments)

    _createGymScrollview.call(this);
    _createPassSliderview.call(this);
    // _createGymDistanceView.call(this);
  }

  function _createGymScrollview() {
    var gymScrollview = new Scrollview();

    var gymScrollviewModifier = new StateModifier({
        origin: [0.5, 0]
    });

    var backModifier = new StateModifier({
      // positions the background behind the tab surface
      transform: Transform.behind
    });

    var surfaces = [];

    gymScrollview.sequenceFrom(surfaces);

    for (var i = 0, temp; i < this.options.data.length; i++) {
        temp = new Surface({
             content: this.options.data[i],
             size: [640, 150],
             properties: {
                 backgroundColor: "#22514E",
                 lineHeight: "200px",
                 textAlign: "center", 
                 color: "white",
                 fontSize: "20px",
                 zIndex: 1,
                 borderBottom: "1px solid #1C413D"
             }
        });

        temp.pipe(gymScrollview);
        surfaces.push(temp);
    }

    this.add(backModifier).add(gymScrollviewModifier).add(gymScrollview);
  }

  function _createPassSliderview() {

    var passSlider = new View({
      properties: {
        zIndex: 2
      }
    }); 

    var passSliderModifier = new StateModifier({
      origin: [0.5, 1]
    });

    var sizeModifier = new StateModifier({
      size: [640,150]
    });

    this.add(passSliderModifier).add(passSlider);

    var sizeNode = passSlider.add(sizeModifier);

    var background = new Surface({
      properties: {
        backgroundColor: "black"
      }
    })

    var backModifier = new StateModifier({
      // positions the background behind the circle surface
      transform: Transform.behind
    });

    sizeNode.add(backModifier).add(background);

    var oneDayCircle = new Surface({
      size: [40, 40],
      properties: {
        borderRadius: "80px", 
        zIndex: 3, 
        backgroundColor: "#969B98"
      }
    });

    var oneDayCircleOriginModifier = new StateModifier({
      origin: [0.15, 0.5]
    });

    var fourDayCircle = new Surface({
      size: [40, 40],
      properties: {
        borderRadius: "80px", 
        zIndex: 3, 
        backgroundColor: "#969B98"
      }
    });

    var fourDayCircleOriginModifier = new StateModifier({
      origin: [0.5, 0.5]
    });

    var oneMonthCircle = new Surface({
      size: [40, 40],
      properties: {
        borderRadius: "80px", 
        zIndex: 3, 
        backgroundColor: "#969B98"
      }
    });

    var oneMonthCircleOriginModifier = new StateModifier({
      origin: [0.85, 0.5]
    });

    sizeNode.add(oneDayCircleOriginModifier).add(oneDayCircle)
    sizeNode.add(fourDayCircleOriginModifier).add(fourDayCircle)
    sizeNode.add(oneMonthCircleOriginModifier).add(oneMonthCircle)

  };

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
    size: [640, 150],
    data: undefined
  }

    module.exports = AppView;
});

