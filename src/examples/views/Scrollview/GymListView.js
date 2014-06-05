define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var GenericSync     = require('famous/inputs/GenericSync');
    var MouseSync       = require('famous/inputs/MouseSync');
    var TouchSync       = require('famous/inputs/TouchSync');
    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});
    var StateModifier = require('famous/modifiers/StateModifier');
    var Scrollview = require("famous/views/Scrollview");
    var GymData = require('src/examples/data/GymData.js');

    var GymListItem = require('examples/views/Scrollview/GymListItemView');
    var DetailView = require('examples/views/Scrollview/DetailView');
    function GymListView() {

      View.apply(this, arguments)
      //call function that creates scroll view
      _createGymScrollview.call(this);
      _setListeners.call(this);

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

      this.gymScrollview = new Scrollview();
      this.windowWidth = window.innerWidth
      var gymScrollviewModifier = new StateModifier({
          size: [this.windowWidth, 600]
          // transform: Transform.translate(0,0,9.3)
      });

      var backModifier = new StateModifier({
        // positions the background behind the tab surface
        transform: Transform.behind
      });

      var surfaces = [];

      this.gymScrollview.sequenceFrom(surfaces);

      //calls GymData() to make gym data accessible to Gym items
      data = GymData();
      this.detail = new DetailView();
      var gymItem = null;

      //receives back clicks and calls hideDetails in the DetailView which calls moveDown in the SlideView which removes the details from the page 
      this.detail.on('backButton-clicked', function(){
        this._eventInput.emit('pipeEventOutput');
        this.detail.hideDetails();
      }.bind(this));

      this.detail.on('unPipeEventOutput', function(){
        this._eventInput.emit('unPipeEventOutput');
      }.bind(this));

      this.detail.on('closeLogin', function(transition){
        this._eventOutput.emit('closeLogin',transition);
      }.bind(this));
      this.detail.on('userLogin', function(){
        this._eventOutput.emit('userLogin');
      }.bind(this));
      this.detail.on('ticketPurchased', function(data, numPasses){
        console.log("data inside gymlistview", data, numPasses)
        this.detail.slide.confirmPurchaseView.moveDown({duration:0});
        this.detail.slide.moveDown({duration:0});
        this._eventOutput.emit('ticketPurchased', data, numPasses);
        this._eventInput.emit('pipeEventOutput');

      }.bind(this));

      this.detail.on('pass closed', function(){
        this.detail.slide.confirmPurchaseView.moveDown({duration:0});
        this.detail.slide.moveDown({duration:0});
        this._eventOutput.emit('pass closed');
        this._eventInput.emit('pipeEventOutput');
      }.bind(this));

      this.detail.on('pass closed emit from pageview', function(){
        console.log("pass closed emit from pageview received in GYMLIST VIEW")
        this.detail.slide.confirmPurchaseView.moveDown({duration:0});
        this.detail.slide.moveDown({duration:0});
        this._eventOutput.emit('pass closed');
        this._eventInput.emit('pipeEventOutput');
      }.bind(this));

      this._eventInput.on('ticketToggle',function(){
        console.log('gymlist ticketTggloe')
      }.bind(this));

      //loop that creates each panel of the gym scrollview
      for (var i = 0; i < this.options.data.gym_names.length; i++) {

          gymItem = new GymListItem({ data : data }, undefined, i);

          this._eventInput.pipe(gymItem);

          this._setItemSyncEvent(gymItem);

          gymItem.pipe(this.gymScrollview); // scrolling

          gymItem.pipe(this._eventOutput); // dragging
          
          surfaces.push(gymItem);

          //click function to fire detail view

          gymItem.on('click',this.detail.createDetails.bind(this.detail, gymItem));

      }

      this.add(backModifier).add(gymScrollviewModifier).add(this.gymScrollview);
      this.add(this.detail);
    }

    function _setListeners() {
      this._eventInput.on('showDetails', function(data) {
        this._eventOutput.emit('showDetails', {data: data});
      }.bind(this));


    }

    // Bon: enable either the scroll event in scrollview or the menu drag event.
    GymListView.prototype._setItemSyncEvent = function(item){
        var sync = new GenericSync(
            ['touch', 'mouse']
        );

        item.pipe(sync);

        sync.on('update', function(data) {
            if (!this.syncDirection){
                if (Math.abs(data.velocity[0])>Math.abs(data.velocity[1])){
                    item.unpipe(this.gymScrollview);
                } else {
                    item.unpipe(this._eventOutput);
                }
                this.syncDirection = true;
            }
        }.bind(this));

        sync.on('end', (function() {
            this.syncDirection = undefined;
            item.pipe(this._eventOutput);
            item.pipe(this.gymScrollview);
        }).bind(this));
    };

    module.exports = GymListView;
});

