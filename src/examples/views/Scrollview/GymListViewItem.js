define(function(require, exports, module) {
    var Engine = require("famous/core/Engine");
    var Surface = require("famous/core/Surface");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ViewSwapper = require('famous/views/Lightbox');
    var Scrollview = require("famous/views/Scrollview");
    var GymData = require('src/examples/data/GymData.js');
    var RenderNode = require('famous/core/RenderNode')
    var ContainerSurface = require('famous/surfaces/ContainerSurface')

    function GymListItem(options, data, index) {
        View.apply(this, arguments);

        var i = index;

        this.itemId = index;
        console.log(this)

        console.log(this.itemId);

        this.container = new ContainerSurface({
            size: [320, 100]
        });
        this.add(this.container);

        //base panel with gym name 
        this.mainSurface = new Surface({ 
             content:'<div class="gym_name">' + this.options.data.gym_names[i] + '</div>',
             size: [320, 100],
             properties: {
                 backgroundColor: "#22514E",
                 lineHeight: "100px",
                 color: "white",
                 fontSize: "20px",
                 zIndex: 1,
                 borderBottom: "1px solid #1C413D"
             }
        });

        //surface containing the price of each pass
        this.price = new Surface({ 
             content:'<div class="gym_price">' + this.options.data.one_day_price[i] + '</div>',
             size: [true, true],
             properties: {
                 color: "white",
                 // textAlign: "left",
                 marginLeft: "255px",
                 marginTop: "45px",
                 fontSize: "15px",
                 zIndex: 2
             }
        });        

        this.priceModifier = new Modifier({
          transform: Transform.translate(100, 0, 0)
        });

        this.priceModifier.setTransform(
          Transform.translate(0,0,0),
          {duration : 500, curve : 'easeIn'}
        );

        this.container.add(this.mainSurface);
        this.container.add(this.priceModifier).add(this.price);
        
        _setListeners.call(this);

        this.mainSurface.pipe(this._eventInput);
        this._eventInput.pipe(this._eventOutput);

    };

    GymListItem.prototype = Object.create(View.prototype);
    GymListItem.prototype.constructor = GymListItem;

    GymListItem.DEFAULT_OPTIONS = {
      size: [320, 125],
      data: undefined
    }

    function _setListeners() { 
      // var i = index;
      this._eventInput.on('4 day sensor click', function() {
        console.log(this);
        console.log(this.itemId);
          // this.price.setContent('<div class="gym_name">' + this.options.data.four_day_price[i] + '</div>');
          console.log(this.price.getContent)
          for (var i = 0; i < this.options.data.gym_names.length; i++) {
            this.price.setContent(this.options.data.four_day_price[i]) ;
          }
          this.priceModifier = new Modifier({ 
           transform: Transform.translate(100, 0, 0)
          });

          this.priceModifier.setTransform(
           Transform.translate(0,0,0),
           {duration : 500, curve : 'easeIn'}
          );
        // }
      }.bind(this));
    };

    module.exports = GymListItem;

});    

