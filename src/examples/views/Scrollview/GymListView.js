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
    var GymListLastItem = require('examples/views/Scrollview/GymListLastItem');
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
      
      // this.detail.on('slide-clicked', this.detail.hideLightBox.bind(this.detail));

      //receives back clicks and calls hideDetails in the DetailView which calls moveDown in the SlideView which removes the details from the page 
      this.detail.on('backButton-clicked', function(){
        this._eventInput.emit('pipeEventOutput');
        this.detail.hideDetails();
      }.bind(this));

      this.detail.on('unPipeEventOutput', function(){
        this._eventInput.emit('unPipeEventOutput');
      }.bind(this));

      //loop that creates each panel of the gym scrollview
      for (var i = 0; i < this.options.data.gym_names.length; i++) {

          gymItem = new GymListItem({ data : data }, undefined, i);

          this._eventInput.pipe(gymItem);

          this._setItemSyncEvent(gymItem);

          gymItem.pipe(this.gymScrollview);

          gymItem.pipe(this._eventOutput);
          
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

