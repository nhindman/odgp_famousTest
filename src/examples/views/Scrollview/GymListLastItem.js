define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var GymData = require('src/examples/data/GymData.js');
    var ContainerSurface = require('famous/surfaces/ContainerSurface')

    function GymListLastItem(options, data, index) {
        View.apply(this, arguments);

        var i = index;

        this.itemIndex = index;

        this.lastcontainer = new ContainerSurface({
            size: [undefined, 500], 
            properties: {
              backgroundColor: 'red', 
              zIndex: 100000
            }
        });
        this.add(this.lastcontainer);

        //base panel surface with gym name 
        this.mainSurface = new Surface({ 
           properties: {
               backgroundColor: "#40B376",
               zIndex: 10000,
               marginTop: "200px",
               borderBottom: "500px solid red"
           }
        });

        this.mainSurfaceModifier = new Modifier({
          size: [undefined, 500]
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
          size: [500, 500]
        })

        //surface containing the price of each pass
        this.price = new Surface({ 
             content:'<div class="gym_price">' + this.options.data.one_day_price[i] + '</div>',
             size: [true, 500],
             properties: {
                 color: "white",
                 marginLeft: "83.7%",
                 marginTop: "45px",
                 fontSize: "15px",
                 zIndex: 2
             }
        }); 

        //creates modifier on price surface for click function to use when animating new prices in
        this.priceModifier = new Modifier({
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

        this.lastcontainer.add(this.mainSurfaceModifier).add(this.mainSurface);
        this.lastcontainer.add(this.gymNameModifier).add(this.gymName)
        this.lastcontainer.add(this.priceModifier).add(this.price);
        
        _setListeners.call(this);

        this.gymName.pipe(this._eventInput);
        this.mainSurface.pipe(this._eventInput);
        this._eventInput.pipe(this._eventOutput);

    };

    GymListLastItem.prototype = Object.create(View.prototype);
    GymListLastItem.prototype.constructor = GymListLastItem;

    GymListLastItem.DEFAULT_OPTIONS = {
      size: [500, 125],
      data: undefined
    }

    //this function listens for clicks on the slider (specifies reaction for 1day, 4day or 1month)
    function _setListeners() { 
      //receives clicks on 1 day stuff and changes price with transition
      this._eventInput.on('1 day click', function() { 
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

    };

    module.exports = GymListLastItem;

});    

