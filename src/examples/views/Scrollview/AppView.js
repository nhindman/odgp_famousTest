/*globals define*/
define(function(require, exports, module) {
  // choose your test here
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var View = require('famous/core/View');
  var GenericSync     = require('famous/inputs/GenericSync');
  var Transitionable  = require('famous/transitions/Transitionable');

  var PageView = require('examples/views/Scrollview/PageView');
  var GymData = require('src/examples/data/GymData.js');
  // var MenuView = require('examples/views/Scrollview/MenuView');

  // var GymListView = require('examples/views/Scrollview/GymListView');
  // var GymListSliderView = require('examples/views/Scrollview/GymListSliderView');

  function AppView() {

    View.apply(this, arguments);

    _createPageView.call(this);
    //connects emitted events 
    // this.gymListSliderview.pipe(this.gymListview);

  };

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
    size: [640, 150],
    data: undefined
  };

  function _createPageView() {
    data = GymData();

    this.pageView = new PageView({ data : data });
    // this.pageModifier = new Modifier();
    // this.add(this.pageView)

    this._add(this.pageModifier).add(this.pageView)

  };

  module.exports = AppView;
    
});

