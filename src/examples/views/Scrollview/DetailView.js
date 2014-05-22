define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    var Lightbox = require('famous/views/Lightbox');

    var SlideView = require('examples/views/Scrollview/SlideView');


  function DetailView() {
    View.apply(this, arguments);

    _createLightbox.call(this);
    // _setListeners.call(this);
  }

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
            inTransform: Transform.thenMove(Transform.rotateX(0.9), [0, -300, -300]),
            outTransform: Transform.thenMove(Transform.rotateZ(0.7), [0, window.innerHeight, -1000]),
            inTransition: { duration: 650, curve: 'easeOut' },
            outTransition: { duration: 500, curve: Easing.inCubic }
        }
    };

  function _createLightbox() {
      this.lightbox = new Lightbox(this.options.lightboxOpts);
      // this.detailView.pipe(this._eventInput);
      this.lightboxModifier = new StateModifier({
        size: this.options.size,
        origin: [0, 0]
      })

      this.add(this.lightboxModifier).add(this.lightbox);
  }

  DetailView.prototype.createDetails = function(gymItem) {
    console.log("data in DetailView", gymItem);
    var slide = new SlideView();
  
    this.ready = false;

    this.lightbox.show(slide, function() {
        this.ready = true;
        slide.fadeIn();
    }.bind(this)); 
    
  }

  // function _setListeners() {
  //    this._eventInput.on('showDetails', function(data) {
  //       _createDetails(data)
  //    });
  // }
  module.exports = DetailView;

});