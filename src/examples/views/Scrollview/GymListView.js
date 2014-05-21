define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    
    var StateModifier = require('famous/modifiers/StateModifier');
    var Scrollview = require("famous/views/Scrollview");
    var GymData = require('src/examples/data/GymData.js');

    var GymListItem = require('examples/views/Scrollview/GymListItemView');
    var GymListLastItem = require('examples/views/Scrollview/GymListLastItem');
  
    function GymListView() {

      View.apply(this, arguments)
      //call function that creates scroll view
      _createGymScrollview.call(this);
      _setListeners.call(this);
      // _setListeners.call(this)
      // this._eventInput.pipe(this._eventOutput);
    };

    GymListView.prototype = Object.create(View.prototype);
    GymListView.prototype.constructor = GymListView;

    GymListView.DEFAULT_OPTIONS = {
      size: [undefined, 125],
      data: undefined
    }

    //function that creates gym list scroll view
    function _createGymScrollview() {

      var gymScrollview = new Scrollview();
      this.windowWidth = window.innerWidth
      var gymScrollviewModifier = new StateModifier({
          size: [this.windowWidth, 600],
          origin: [0, -1.4]
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

          this.gymItem = new GymListItem({ data : data }, undefined, i);

          this._eventInput.pipe(this.gymItem);

          this.gymItem.pipe(gymScrollview);

          this.gymItem.pipe(this._eventOutput);
          
          surfaces.push(this.gymItem)

          this.subscribe(this.gymItem);

          //trying to prevent need for extra tiles here
          // if (i == this.options.data.gym_names.length - 1) {
          //   console.log(i)
          //   console.log("reached the last one")
          //   var gymItem = new GymListLastItem({ 
          //     data: data 
          //   }, undefined, i);
          // }
      }

      this.add(backModifier).add(gymScrollviewModifier).add(gymScrollview);
    }

    function _setListeners() {
      this._eventInput.on('showDetails', function(data) {
        console.log("showDetails fired")
        console.log("HERE", data)
      }.bind(this));

      // gymItem.pipe(this._eventOutput);

    }

    module.exports = GymListView;
});

