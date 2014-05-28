define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    var Lightbox = require('famous/views/Lightbox');

    var SlideView = require('examples/views/Scrollview/SlideView');


  function DetailView(data) {
    View.apply(this, arguments);
  };

  DetailView.prototype = Object.create(View.prototype);
  DetailView.prototype.constructor = DetailView;

  DetailView.DEFAULT_OPTIONS = {
        size: [undefined, undefined],
        data: undefined,
        lightboxOpts: {
            inOpacity: 1,
            outOpacity: 0,
            inOrigin: [0, 0],
            outOrigin: [0, 0],
            showOrigin: [0, 0],
            inTransform: Transform.translate(0, window.innerHeight, 0),
            outTransform: Transform.translate(0, window.innerHeight, 0),
            inTransition: { duration: 650},
            outTransition: { duration: 500}
        }
    };

  DetailView.prototype.createDetails = function(data) {
    this.slide = new SlideView({ data: data });
    this.slide.pipe(this._eventOutput);
    console.log("data inside DetailView", data);
    //receives slide-clicked from slide view
    this.slide.on('backButton-clicked', function() {
      this._eventOutput.emit('backButton-clicked');
    }.bind(this));
  
    this.ready = false;

    this.add(new Modifier({size: [undefined, window.innerHeight]})).add(this.slide);
    this.ready = true;
    this.slide.moveUp();
    this._eventOutput.emit('unPipeEventOutput');
    // this.lightbox.show(slide, function() {
        
    // }.bind(this)); 
    
  }

  DetailView.prototype.hideDetails = function() {
    this.slide.moveDown();
  }

  module.exports = DetailView;

});