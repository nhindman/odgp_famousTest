/*globals define*/
define(function(require, exports, module) {
  var Surface = require('famous/core/Surface');
  var Modifier = require('famous/core/Modifier');
  var Transform = require('famous/core/Transform');
  var View = require('famous/core/View');
  // var FastClick = require('famous/inputs/FastClick');
  var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var Lightbox = require('famous/views/Lightbox');
    
  var GymData = require('src/examples/data/GymData.js');

  var GymListView = require('examples/views/Scrollview/GymListView');
  var GymListSliderView = require('examples/views/Scrollview/GymListSliderView');
  var GymListHeaderView = require('examples/views/Scrollview/GymListHeaderView');
  var DetailView = require('examples/views/Scrollview/DetailView')


  function PageView() {

    View.apply(this, arguments);

    // Bon: Make a blackground to cover the strip view.
    _createBackGround.call(this);

    // Bon: create HeaderFooterLayout.
    _createLayout.call(this);

    // Bon: create a mask.
    _createMask.call(this);

    //loads gym data from GymData.js and creates instance of GymListView
    _createGymListView.call(this);

    //creates Grey slider thingy
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

  function _createLayout(){
    this.layout = new HeaderFooterLayout({
      headerSize: 75,
      footerSize: 100
    });
    this.add(this.layout);
  }

  //mask covers pageview when it's minimized
  function _createMask(){
    this.mask = new Surface();
    this.maskMod = new Modifier({
      transform: Transform.translate(0,0,-999)
    });
    this.mask.pipe(this._eventOutput);
    this.layout.content.add(this.maskMod).add(this.mask);
    
    this.mask.on('click', function() {
       this._eventOutput.emit('menuToggle');
    }.bind(this));
  }

  function _createGymListView() {

    console.log("_createGymListView fires")

    data = GymData();

    this.gymListView = new GymListView({ data : data });
    
    this.gymListView.pipe(this._eventOutput);

    this.gymListModifier = new Modifier({
      // size: [320,700]
    });

    this.layout.content.add(this.gymListModifier).add(this.gymListView);

  }

  function _createGymListSliderView() {

    console.log("_createGymListSliderview fires")

    this.gymListSliderview = new GymListSliderView(this);

    this.gymListSliderViewModifier = new Modifier();

    this.layout.footer.add(this.gymListSliderViewModifier).add(this.gymListSliderview);

    this.gymListSliderview.passSliderbackground.pipe(this._eventOutput);

  }

  function _createBackGround() {

      this.background = new Surface({
          size:[undefined,undefined],
          properties:{
              backgroundColor:'#40B376'
          }
      });
      this.backgroundMod = new Modifier({
          transform: Transform.translate(0,0,-0.01)
      });

      this.add(this.backgroundMod).add(this.background);
  }

  function _createGymListHeaderView() {
    this.gymListHeaderView = new GymListHeaderView();

    this.gymListHeaderViewModifier = new Modifier();

    this._eventOutput.subscribe(this.gymListHeaderView);

//    this.gymListHeaderView.pipe(this._eventOutput);

    this.layout.header.add(this.gymListHeaderViewModifier).add(this.gymListHeaderView);
  }

  function _setListeners() {
    this._eventInput.on('menuToggle', function() {
      this._eventOutput.emit('menuToggle');
    }.bind(this));

    this._eventInput.on('pass closed', function() {
      console.log("pass closed received in page view");
      this._eventOutput.emit('pass closed emit from pageview');
    }.bind(this));

    //emits event that shows gym overview page when gym list item clicked
    this._eventInput.on('showDetails', function(data) {
      this._eventOutput.emit('showDetails', {data: data});
    }.bind(this));

    //creates transparent mask over scrollview when menu view minimized
    this._eventInput.on('setMask',function(){
        this.maskMod.setTransform(Transform.translate(0,0,10));
    }.bind(this));
    this._eventInput.on('removeMask',function(){
        this.maskMod.setTransform(Transform.translate(0,0,-999));
    }.bind(this));

//    this.bodySurface.pipe(this._eventOutput);
  }

  //create view that gym overview slides get appended when gym list item is clicked 
  function _createDetailView() {
    this.detailView = new DetailView();
    this.subscribe(this.detailView);
  }

  module.exports = PageView;
    
});

