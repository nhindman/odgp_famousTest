define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    var Lightbox = require('famous/views/Lightbox');

    var HeaderFooter = require('famous/views/HeaderFooterLayout');

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
//      align:[0,1],
      transform: Transform.translate(0, window.innerHeight, 21)
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

    //emits slide click to DetailView
    this.backgroundSurface.on('click', function() {
      this._eventOutput.emit('backButton-clicked');
    }.bind(this));

    this.backgroundModifier = new Modifier({
      opacity: 0.00001,
      origin: [0, 0],
      align: [0,1],
      transform: Transform.translate(0, 0, 11)
    });

    this.layout.header.add(this.backgroundSurface);    
  }

  function _createBody() {
    this.bodySurface = new Surface({
      size: [undefined, 1000],
      content: this.options.data.gymName.content,
      properties: {
        backgroundColor: "red",
      }, 
      color: "white"
    });

    this.bodyModifier = new Modifier({
      opacity: 0.00001,
      origin: [0, 0],
      align: [0,1],
      transform: Transform.translate(0, 0, 11)
    });

    this.layout.content.add(this.bodySurface);
  }

  SlideView.prototype.moveUp = function() {
      this.layoutModifier.setTransform(
        Transform.translate(0,-75,21), // 75 is the headerSize
        { duration : 400 }
      );
  };

  SlideView.prototype.moveDown = function() {
      this.layoutModifier.setTransform(
        Transform.translate(0,window.innerHeight,21),
        { duration : 400 }
      );
  };

  module.exports = SlideView;
});