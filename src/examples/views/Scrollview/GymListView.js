define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    
    var StateModifier = require('famous/modifiers/StateModifier');
    var Scrollview = require("famous/views/Scrollview");
    var GymData = require('src/examples/data/GymData.js');

    var GymListItem = require('examples/views/Scrollview/GymListItemView');
  
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
          origin: [0, 0]
      });

      var backModifier = new StateModifier({
        // positions the background behind the tab surface
        transform: Transform.behind
      });

      var surfaces = [];

      gymScrollview.sequenceFrom(surfaces);

      data = GymData();

      //loop that creates each panel of the gym scrollview
      for (var i = 0; i < this.options.data.gym_names.length; i++) {

          var gymItem = new GymListItem({ data : data }, undefined, i);

          this._eventInput.pipe(gymItem);

          gymItem.pipe(gymScrollview)
          surfaces.push(gymItem)
      }

      this.add(backModifier).add(gymScrollviewModifier).add(gymScrollview);
    }

    module.exports = GymListView;
});

