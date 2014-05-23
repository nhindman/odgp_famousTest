define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    var Lightbox = require('famous/views/Lightbox');

  function SlideView(options, data) {
      View.apply(this, arguments);

      _createSlide.call(this);
    }

  SlideView.prototype = Object.create(View.prototype);
  SlideView.prototype.constructor = SlideView;

  SlideView.DEFAULT_OPTIONS = {
    size: [true, true],
    data: undefined
  }

  function _createSlide() {
    console.log("data in slideview!!!", this.options.data)
    var background = new Surface({
      classes: ['slider'],
      content: this.options.data.gymName.content,
      properties: {
        backgroundColor: "black", 
        color: "white"
      }
    });

    //receives slide click and emits click to DetailView
    background.on('click', function() {
      this._eventOutput.emit('slide-clicked');
    }.bind(this));

    this.modifier = new Modifier({
      opacity: 0.00001,
      transform: Transform.translate(0, 0, 5)
    });

    this.add(this.modifier).add(background);
  }

  SlideView.prototype.fadeIn = function() {
      this.modifier.setOpacity(1, { duration: 1500, curve: 'easeIn' });
  };

  module.exports = SlideView;
});