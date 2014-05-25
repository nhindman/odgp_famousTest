define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    var Lightbox = require('famous/views/Lightbox');
    var ImageSurface = require("famous/surfaces/ImageSurface");
    var HeaderFooter = require('famous/views/HeaderFooterLayout');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');

  function SlideView(options, data) {
      View.apply(this, arguments);

      _createLayout.call(this);
      _createHeader.call(this);
      _createBody.call(this);
    }

  SlideView.prototype = Object.create(View.prototype);
  SlideView.prototype.constructor = SlideView;

  SlideView.DEFAULT_OPTIONS = {
    size: [undefined, undefined],
    data: undefined, 
    headerSize: 75
  }

  function _createLayout() {
    this.layout = new HeaderFooter({
      headerSize: this.options.headerSize
    })

    this.layoutModifier = new StateModifier({
      align:[0,1],
      transform: Transform.translate(0, 0, 21)
      // transform: Transform.translate(0, 0, 0.1)
    });

    this.add(this.layoutModifier).add(this.layout);
  }

  function _createHeader() {
    this.backgroundSurface = new Surface({
      classes: ['slider'],
      properties: {
        backgroundColor: "black", 
        color: "white"
      }, 
      
    });

    this.arrowSurface = new Surface({
      size: [50, 30],
      properties: { 
        textAlign: "center",
        zIndex: "10"
      },
      content: '<img width="12.5" src="src/img/back_arrow.png"/>'
    })

    this.arrowModifier = new Modifier({
      origin: [0.07, 0.65]
      // align: [0.5, 0.50]
    })

    this.arrowSensor = new Surface({
      size: [50, true],
      properties: { 
        textAlign: "center",
        zIndex: "5"
      },
      content: '<img width="12.5" src="src/img/back_arrow.png"/>'
    })

    this.arrowSensorModifier = new Modifier({
      origin: [0.07, 0.65]
      // align: [0.5, 0.50]
    })

    this.overviewSurface = new Surface({
      properties: {
        backgroundColor: "black", 
        color: "white"
      }, 
      content: '<div class="overview">Overview</div>',
    });

    this.overviewModifier = new Modifier({
      size: [true, true],
      origin: [0.40, 0.37]
    })

    //emits slide click to DetailView
    this.arrowSurface.on('click', function() {
      this._eventOutput.emit('backButton-clicked');
    }.bind(this));

    this.backgroundModifier = new Modifier({
      size: [undefined, undefined],
      opacity: 0.00001,
      origin: [0, 0],
      align: [0,1],
      transform: Transform.translate(0, 0, 11)
    });

    this.layout.header.add(this.backgroundSurface);
    this.layout.header.add(this.overviewModifier).add(this.overviewSurface);    
    this.layout.header.add(this.arrowModifier).add(this.arrowSurface);
  }

  var windowHeight = window.innerHeight
  var thirdWindowHeight = window.innerHeight / 2.5
  function _createBody() {
    console.log("data inside SlideView",this.options.data)
    this.bodySurface = new Surface({
      size: [undefined, windowHeight],
      properties: {
        backgroundColor: "red",
      }, 
      color: "white"
    });

    this.gymPhoto = new Surface({
      content: '<img width="320" height="'+thirdWindowHeight+'" src="src/img/'+ this.options.data.photo.content + '"/>',
    })

    this.gymPhotoModifier = new Modifier({
      origin: [0, 0],
      transform: Transform.translate(0, 0, 30)
    });

    this.gymNameContainer = new ContainerSurface({
      classes: "gym_name_details_container",
      properties: {
        backgroundColor: "black"
      }
    })

    this.gymNameContainerModifier = new Modifier({
      size: [undefined, 70], 
      origin: [0.5, .9]
    })


    this.gymNameSurface = new Surface({
      classes: "gym_name_details",
      content: '<p id="gym_name_details">' + this.options.data.gymName.content + '</p>',
      properties: {
        fontSize: "2em"
      }
    })

    this.gymNameSurfaceModifier = new Modifier({
      size: [true, true],
      origin: [0.1, 0.713]
    })

    this.layout.content.add(this.bodySurface);
    this.layout.content.add(this.gymPhotoModifier).add(this.gymPhoto);
    this.layout.content.add(this.gymNameContainerModifier).add(this.gymNameContainer);
    this.layout.content.add(this.gymNameSurfaceModifier).add(this.gymNameSurface);
  }

  SlideView.prototype.moveUp = function() {
      this.layoutModifier.setAlign(
        [0,-0.2],
        { duration : 400 }
      );
  };

  SlideView.prototype.moveDown = function() {
      this.layoutModifier.setAlign(
        [0,1.5],
        { duration : 400 }
      );
  };

  module.exports = SlideView;
});