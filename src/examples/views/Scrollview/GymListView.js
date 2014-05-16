// *
//  * Scrollview
//  * ------------
//  *
//  * Scrollview is one of the core views in Famo.us. Scrollview
//  * will lay out a collection of renderables sequentially in 
//  * the specified direction, and will allow you to scroll 
//  * through them with mousewheel or touch events.
//  *
//  * In this example, we have a Scrollview that sequences over
//  * a collection of surfaces that vary in color
 
define(function(require, exports, module) {
    var Engine = require("famous/core/Engine");
    var Surface = require("famous/core/Surface");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ViewSwapper = require('famous/views/Lightbox');
    var Scrollview = require("famous/views/Scrollview");
    var GymData = require('src/examples/data/GymData.js');
    var RenderNode = require('famous/core/RenderNode')

    var GymListItem = require('./GymListViewItem')

    var GymListSliderView = require('./GymListSliderView')
  
    function GymListView() {

      View.apply(this, arguments)
      //call function that creates scroll view
      _createGymScrollview.call(this);
      // _setListeners.call(this)
    };

    GymListView.prototype = Object.create(View.prototype);
    GymListView.prototype.constructor = GymListView;

    GymListView.DEFAULT_OPTIONS = {
      size: [320, 125],
      data: undefined
    }

    //function that creates gym list scroll view
    function _createGymScrollview() {
      var gymScrollview = new Scrollview();

      var gymScrollviewModifier = new StateModifier({
          size: [320, 600],
          origin: [0.5, 0]
      });

      var backModifier = new StateModifier({
        // positions the background behind the tab surface
        transform: Transform.behind
      });

      var surfaces = [];

      gymScrollview.sequenceFrom(surfaces);

      data = GymData();

      for (var i = 0; i < this.options.data.gym_names.length; i++) {

          var gymItem = new GymListItem({ data : data }, undefined, i);

          gymItem.pipe(this._eventInput);
          this._eventInput.pipe(gymItem);

          gymItem.pipe(gymScrollview)
          surfaces.push(gymItem)
      }

      this.add(backModifier).add(gymScrollviewModifier).add(gymScrollview);
    }

    
    

    module.exports = GymListView;
});

