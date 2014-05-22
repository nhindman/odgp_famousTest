define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    var Lightbox = require('famous/views/Lightbox');

    function SlideView() {
      View.apply(this, arguments);

      _createSlide.call(this);
    }

  SlideView.prototype = Object.create(View.prototype);
  SlideView.prototype.constructor = SlideView;

    function _createSlide() {
      var background = new Surface({
        content: "hello"
      });

      this.modifier = new Modifier({
        opacity: 0
      });

      this.add(this.modifier).add(background);
    }

    SlideView.prototype.fadeIn = function() {
        this.modifier.setOpacity(1, { duration: 1500, curve: 'easeIn' });
    };

    module.exports = SlideView;
});