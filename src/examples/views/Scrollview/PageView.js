/*globals define*/
define(function(require, exports, module) {
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var View = require('famous/core/View');

  var GymData = require('src/examples/data/GymData.js');

  var GymListView = require('examples/views/Scrollview/GymListView');
  var GymListSliderView = require('examples/views/Scrollview/GymListSliderView');

  function PageView() {

    View.apply(this, arguments);
    //loads gym data from GymData.js and creates instance of GymListView
    _createGymListView.call(this);

    //creates instance of GymListSliderView
    _createGymListSliderView.call(this);

    //connects emitted events
    this.gymListSliderview.pipe(this.gymListView);

  }

  PageView.prototype = Object.create(View.prototype);
  PageView.prototype.constructor = PageView;

  function _createGymListView() {

    console.log("_createGymListView fires")

    data = GymData();

    this.gymListView = new GymListView({ data : data });

    this.gymListModifier = new Modifier({
      size: [320,700]
    });

    this._add(this.gymListModifier).add(this.gymListView);

  }

  function _createGymListSliderView() {

    console.log("_createGymListSliderview fires")

    this.gymListSliderview = new GymListSliderView();

    this.gymListSliderViewModifier = new Modifier();

    this._add(this.gymListSliderViewModifier).add(this.gymListSliderview);

  }

  module.exports = PageView;
    
});

