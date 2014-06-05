define(function(require, exports, module) {
  var Surface         = require('famous/core/Surface');
  var RenderNode         = require('famous/core/RenderNode');
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
      window.app =this
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

    this.pageView.pipe(this._eventInput);
    this._eventOutput.pipe(this.pageView);
    this._eventInput.on('click', function() {
      console.log('click in app')
    });

    this.pageModifier = new Modifier({
      transform: function() {
        return Transform.translate(this.pageViewPos.get(), 0, 0);
      }.bind(this)
    });

    this.pageNode = new RenderNode();
    this.pageViewMask = new Surface({
      properties:{
        backgroundColor: 'rgba(0,0,0,0.5)'
      }
    });
    this.pageViewMaskMod = new Modifier({
      transform: Transform.translate(0,0,-4)
    });

    this.add(this.pageModifier).add(this.pageNode);
    this.pageNode.add(this.pageView);
    this.pageNode.add(this.pageViewMaskMod).add(this.pageViewMask);
  };

  function _createMenuView() {
    this.menuView = new MenuView({ stripData: StripData });
    var menuModifier = new StateModifier({
      transform: Transform.translate(0,0,-1)
    });
    this.menuView.pipe(this._eventInput);
    this.add(menuModifier).add(this.menuView);
  }

  function _setListeners() {
    this._eventInput.on('ticketToggle', function(){
        this._eventInput.emit('menuToggle');
        this._eventOutput.emit('ticketToggle');
    }.bind(this));
    this._eventInput.on('pass closed', function(){
      console.log("pass closed received in appview");
      this.pageViewMaskMod.setTransform(Transform.translate(0,0,-4));
      this._eventOutput.emit('pass closed');
      this.passDisappear();
//      this.pageView.gymli
    }.bind(this));
    this._eventInput.on('menuToggle', this.toggleMenu.bind(this));
    this._eventInput.on('ticketPurchased',function(data, numPasses){
      console.log("DATA RECEIVED IN APPVIEW",data, numPasses)
      console.log('ticketPurchased appView')
      this._eventInput.emit('menuToggle');
      this.menuView.ticketView._eventInput.emit('printTicket', data, numPasses);
      this.pageViewMaskMod.setTransform(Transform.translate(0,0,10));
    }.bind(this));
    this.pageViewMask.on('click',function(){
      this._eventInput.emit('menuToggle');
      this.pageViewMaskMod.setTransform(Transform.translate(0,0,-4));
    }.bind(this));
    this._eventOutput.on('ticketToggle', function(){
      this.pageViewMaskMod.setTransform(Transform.translate(0,0,-4));
      this.pageView.gymListView.detail.slide.passViewMod.setTransform(Transform.translate(0,-window.innerHeight,0));
      this.pageView.gymListView.detail.slide.passViewMod.setOpacity(1);
    }.bind(this));
  }

  function _handleSwipe() {
    var sync = new GenericSync(
      ['mouse', 'touch'],
      {direction : GenericSync.DIRECTION_X}
    );

    this._eventInput.pipe(sync);

    sync.on('update', function(data) {
        var currentPosition = this.pageViewPos.get();
        if(currentPosition === 0 && data.velocity > 0) {
            this.menuView.animateStrips();
    }

        this.pageViewPos.set(Math.max(0, Math.min(window.innerWidth-10,currentPosition + data.delta)));
    }.bind(this));

    sync.on('end', (function(data) {
        var velocity = data.velocity;
        var position = this.pageViewPos.get();

        if(this.pageViewPos.get() > this.options.posThreshold) {
            if(velocity < -this.options.velThreshold) {
                this.slideLeft();
            } else {
                this.slideRight();
            }
        } else {
            if(velocity > this.options.velThreshold) {
                this.slideRight();
            } else {
                this.slideLeft();
            }
        }
    }).bind(this));

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
      this._eventOutput.emit('removeMask');
  };

  AppView.prototype.slideRight = function() {
      this.pageViewPos.set(this.options.openPosition, this.options.transition, function() {
          this.menuToggle = true;
      }.bind(this));
      this._eventOutput.emit('setMask');
  };

  AppView.prototype.passDisappear = function(){
      if (this.pageView.gymListView && this.pageView.gymListView.detail && this.pageView.gymListView.detail.slide)
      this.pageView.gymListView.detail.slide.passViewMod.setTransform(Transform.translate(0,0,0));
  };

  module.exports = AppView;
    
});

