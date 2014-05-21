/*globals define*/
define(function(require, exports, module) {
  // choose your test here
  var Surface         = require('famous/core/Surface');
  var StateModifier   = require('famous/modifiers/StateModifier');
  var Modifier       = require('famous/core/Modifier');
  var Transform       = require('famous/core/Transform');
  var View            = require('famous/core/View');
  var GenericSync     = require('famous/inputs/GenericSync');
  var MouseSync       = require('famous/inputs/MouseSync');
  var TouchSync       = require('famous/inputs/TouchSync');
  GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});
  var Transitionable  = require('famous/transitions/Transitionable');
  var Easing          = require('famous/transitions/Easing');

  var PageView        = require('examples/views/Scrollview/PageView');
  var GymData         = require('src/examples/data/GymData.js');
  var StripData       = require('src/examples/data/StripData.js');
  var MenuView        = require('examples/views/Scrollview/MenuView');

  // var GymListView = require('examples/views/Scrollview/GymListView');
  // var GymListSliderView = require('examples/views/Scrollview/GymListSliderView');

  function AppView() {

    View.apply(this, arguments);

    this.menuToggle = false;
    // create transitionable with initial value of 0
    this.pageViewPos = new Transitionable(0);

    _createPageView.call(this);
    _createMenuView.call(this);

    _setListeners.call(this);
    _handleSwipe.call(this);

  };

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
    openPosition: 276,
    transition: {
      duration: 300, 
      curve: 'easeOut'
    }, 
    posThreshold: 138,
    velThreshold: 0.75,
    data: undefined
  };

  function _createPageView() {
    data = GymData();

    this.pageView = new PageView({ 
      data: data
    });

    this.pageModifier = new Modifier({
      transform: function() {
        return Transform.translate(this.pageViewPos.get(), 0, 0);
      }.bind(this)
    });

    this._add(this.pageModifier).add(this.pageView);
  };

  function _createMenuView() {
    this.menuView = new MenuView({ stripData: StripData });
    var menuModifier = new StateModifier({
      transform: Transform.translate(0,0,-1)
    });

    this.add(menuModifier).add(this.menuView);
  }

  function _setListeners() {
    this.pageView.on('menuToggle', this.toggleMenu.bind(this));
  }

  function _handleSwipe() {
    var sync = new GenericSync(
      ['mouse', 'touch'],
      {direction : GenericSync.DIRECTION_X}
    );

    this.pageView.pipe(sync);

    sync.on('update', function(data) {
        var currentPosition = this.pageViewPos.get();
        this.pageViewPos.set(Math.max(0, currentPosition + data.delta));
    }.bind(this));
  }

  AppView.prototype.toggleMenu = function() {
    if(this.menuToggle) {
        this.slideLeft();
    } else {
        this.slideRight();
        this.menuView.animateStrips();
    }
  };

  AppView.prototype.slideLeft = function() {
      this.pageViewPos.set(0, this.options.transition, function() {
          this.menuToggle = false;
      }.bind(this));
  };

  AppView.prototype.slideRight = function() {
      this.pageViewPos.set(this.options.openPosition, this.options.transition, function() {
          this.menuToggle = true;
      }.bind(this));
  };

  module.exports = AppView;
    
});

