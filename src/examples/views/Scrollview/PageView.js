/*globals define*/
define(function(require, exports, module) {
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var View = require('famous/core/View');
  var FastClick = require('famous/inputs/FastClick');
  var HeaderFooter = require('famous/views/HeaderFooterLayout');
  var ImageSurface = require('famous/surfaces/ImageSurface');

  var GymData = require('src/examples/data/GymData.js');

  var GymListView = require('examples/views/Scrollview/GymListView');
  var GymListSliderView = require('examples/views/Scrollview/GymListSliderView');
  var GymListHeaderView = require('examples/views/Scrollview/GymListHeaderView');
  var DetailView = require('examples/views/Scrollview/DetailView')


  function PageView() {

    View.apply(this, arguments);
    //loads gym data from GymData.js and creates instance of GymListView
    _createGymListView.call(this);

    //creates instance of GymListSliderView
    _createGymListSliderView.call(this);

    //creates headerview where hamburger/city/map icon are
    _createGymListHeaderView.call(this);

    //connects emitted events
    this.gymListSliderview.pipe(this.gymListView);

    _createDetailView.call(this);

    this.subscribe(this.gymListView);

    _setListeners.call(this);
  }

  PageView.prototype = Object.create(View.prototype);
  PageView.prototype.constructor = PageView;

  function _createGymListView() {

    console.log("_createGymListView fires")

    data = GymData();

    this.gymListView = new GymListView({ data : data });
    
    this.gymListView.pipe(this._eventOutput);

    this.gymListModifier = new Modifier({
      // size: [320,700]
    });

    this._add(this.gymListModifier).add(this.gymListView);

  }

  function _createGymListSliderView() {

    console.log("_createGymListSliderview fires")

    this.gymListSliderview = new GymListSliderView(this);

    this.gymListSliderViewModifier = new Modifier();

    this._add(this.gymListSliderViewModifier).add(this.gymListSliderview);

  }

  function _createGymListHeaderView() {
    this.gymListHeaderView = new GymListHeaderView();

    this.gymListHeaderViewModifier = new Modifier();

    this.subscribe(this.gymListHeaderView);

    this._add(this.gymListHeaderViewModifier).add(this.gymListHeaderView); 
  }

  function _setListeners() {
    this._eventInput.on('menuToggle', function() {
      console.log("this fired")
      this._eventOutput.emit('menuToggle');
    }.bind(this));

    this._eventInput.on('showDetails', function(data) {
      console.log('showDetails in PageView fired');
      this._eventOutput.emit('showDetails', {data: data});
    }.bind(this));

    // this.bodySurface.pipe(this._eventOutput);
  }

  function _createDetailView() {
    this.detailView = new DetailView();
    this.subscribe(this.detailView);

  }

  module.exports = PageView;
    
});

