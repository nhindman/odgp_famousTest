/*globals define*/
define(function(require, exports, module) {
  // choose your test here
  var View = require('famous/core/View');
  var Engine = require("famous/core/Engine");
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Modifier = require('famous/core/Modifier');
  var Scrollview = require("famous/views/Scrollview");
  var Utility = require('famous/utilities/Utility');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var ContainerSurface = require('famous/surfaces/ContainerSurface');
  var Easing = require('famous/transitions/Easing');
  var GymData = require('src/examples/data/GymData.js');
  var EventHandler = require('famous/core/EventHandler');

  var GymListView = require('examples/views/Scrollview/GymListView');
  var GymListSliderView = require('examples/views/Scrollview/GymListSliderView');

  // var mainContext = Engine.createContext();

  function AppView() {

    View.apply(this, arguments)
    //loads gym data from GymData.js and creates instance of GymListView
    _createGymListview.call(this);
    //creates instance of GymListSliderView
    _createGymListSliderview.call(this);

    this.gymListSliderview.pipe(this.gymListview);

    // this.gymListSliderview.on('4 day sensor click', function(){
    //   this.gymListSliderview.trigger('custom name');
    // })

    // _setListeners.call(this)  
  }

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
    size: [640, 150],
    data: undefined
  }

  function _createGymListview() {
    data = GymData();

    console.log(data)
    this.gymListview = new GymListView({ data : data });

    this.gymListModifier = new Modifier();

    this._add(this.gymScrollModifier).add(this.gymListview);

  }

  function _createGymListSliderview() {

    console.log("_createGymListSliderview fires")

    this.gymListSliderview = new GymListSliderView();

    this.subscribe(this.gymListSliderview)

    this.gymListSliderViewModifier = new Modifier();

    this._add(this.gymListSliderViewModifier).add(this.gymListSliderview);

  }

  // function _setListeners() {
  //   this._eventInput.on('4 day sensor click', function() {
  //     console.log('4 day sensor click received in AppView.js')
  //     this._eventOutput.emit('4 day sensor click');
  //   }.bind(this));
  // }

  module.exports = AppView;
    
});

