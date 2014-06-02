define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var GymData = require('src/examples/data/GymData.js');
    var ContainerSurface = require('famous/surfaces/ContainerSurface')

    function GymListItem(options, data, index) {
        View.apply(this, arguments);

        var i = index;

        this.itemIndex = index;

        this.container = new ContainerSurface({
            size: [undefined, 100], 
            properties: {
              backgroundColor: 'red', 
              zIndex: 100000
            }
        });

        this.add(this.container);

        //base panel surface with gym name 
        this.mainSurface = new Surface({ 
           properties: {
               backgroundColor: "#40B376",
               zIndex: 1,
               borderBottom: "1px solid #3F9165"
           }
        });
        this.mainSurfaceModifier = new Modifier({
          size: [undefined, 100]
        })

        this.gymName = new Surface({
          content: '<div class="gym_name">' + this.options.data.gym_names[i] + '</div>',
          properties: {
            marginLeft: "14.7%",
            lineHeight: "100px",
            color: "white",
            fontSize: "20px",
            zIndex: 50000
          }
        })

        this.gymNameModifier = new Modifier({
          size: [undefined, 100]
        })

        //surface containing the price of each pass
        this.price = new Surface({ 
             content:'<div class="gym_price">' + this.options.data.one_day_price[i] + '</div>',
             size: [true, true],
             properties: {
                 color: "white",
                 // textAlign: "left",
                 marginLeft: "83.7%",
                 fontSize: "15px",
                 zIndex: 2
             }
        }); 

        //attaching photo data to gymlistitem
        this.photo = new Surface({
          // console.log("new image surface"),
          content: this.options.data.gym_photos
        })

        //creates modifier on price surface for click function to use when animating new prices in
        this.priceModifier = new Modifier({
            origin:[0,0.5],
          transform: Transform.translate(0, 0, 0)
        });

        //star image not being added because it disables scrolling
        this.star = new Surface({
          content: '<img width="23" src="src/img/star.png"/>',
          // size: [true, true],
          properties: {
            zIndex: 100
          }
        })

        this.container.add(this.mainSurfaceModifier).add(this.mainSurface);
        this.container.add(this.gymNameModifier).add(this.gymName)
        this.container.add(this.priceModifier).add(this.price);
        
        _setListeners.call(this);

        this.isPiping = false;
        this.onPipeEventOutput();
    };

    GymListItem.prototype = Object.create(View.prototype);
    GymListItem.prototype.constructor = GymListItem;

    GymListItem.DEFAULT_OPTIONS = {
      size: [320, 125],
      data: undefined
    }

    //this function listens for clicks on the slider (specifies reaction for 1day, 4day or 1month)
    function _setListeners() {
      this.on('click', function() {
        console.log(this.gymName.content)
        this._eventOutput.emit('showDetails', {data: this.gymName.content});
      });

      //receives clicks on 1 day stuff and changes price with transition
      window.gymDays = '1-Day';

      this._eventInput.on('1 day click', function() {
        window.gymDays = '1-Day';
        //changes actual price with setContent
        var myOneDayPrice = this.options.data.one_day_price[this.itemIndex];
        this.price.setContent(myOneDayPrice);

        //creates animation that moves a new price into the this.price surface
        this.priceModifier.setTransform(
         Transform.translate(100,0,0)
        );
        this.priceModifier.setTransform(
         Transform.translate(0,0,0),
         {duration : 300, curve : 'easeIn'}
        );

      }.bind(this));

      //receives clicks on 4day stuff and changes price with transition
      this._eventInput.on('4 day click', function() {
        window.gymDays = '4-Day';
        //changes actual price with setContent
        var myFourDayPrice = this.options.data.four_day_price[this.itemIndex];
        this.price.setContent(myFourDayPrice);

        //creates animation that moves a new price into the this.price surface
        this.priceModifier.setTransform(
         Transform.translate(100,0,0)
        );
        this.priceModifier.setTransform(
         Transform.translate(0,0,0),
         {duration : 300, curve : 'easeIn'}
        );

      }.bind(this));

      //receives clicks on 1month stuff and changes price with transition
      this._eventInput.on('1 month click', function() {
        window.gymDays = '1-Month'
        //changes actual price with setContent
        var myOneMonthPrice = this.options.data.one_month_price[this.itemIndex];
        this.price.setContent(myOneMonthPrice);

        //creates animation that moves a new price into the this.price surface
        this.priceModifier.setTransform(
         Transform.translate(100,0,0)
        );
        this.priceModifier.setTransform(
         Transform.translate(0,0,0),
         {duration : 300, curve : 'easeIn'}
        );

      }.bind(this));

      this._eventInput.on('pipeEventOutput',this.onPipeEventOutput.bind(this));
      this._eventInput.on('unPipeEventOutput',this.onUnPipeEventOutput.bind(this));

    };

    GymListItem.prototype.onPipeEventOutput = function(){
        if (this.isPiping == true) return;
        this.container.pipe(this._eventOutput);
        this.isPiping = true;
    };

    GymListItem.prototype.onUnPipeEventOutput = function(){
        if (this.isPiping == false) return;
        this.container.unpipe(this._eventOutput);
        this.isPiping = false;
    };

    module.exports = GymListItem;

});    

