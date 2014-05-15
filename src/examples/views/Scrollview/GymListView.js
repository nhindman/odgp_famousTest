// *
//  * Scrollview
//  * ------------
//  *
//  * Scrollview is one of the core views in Famo.us. Scrollview
//  * will lay out a collection of renderables sequentially in 
//  * the specified direction, and will allow you to scroll 
//  * through them with mousewheel or touch events.
//  *
//  * In this example, we have a Scrollview that sequences over
//  * a collection of surfaces that vary in color
 
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

    // var mainContext = Engine.createContext();

    // var GymListSliderView = require('./GymListSliderView')
  

    function GymListView() {
      View.apply(this, arguments)
      //call function that creates scroll view
      _createGymScrollview.call(this);
    };

    GymListView.prototype = Object.create(View.prototype);
    GymListView.prototype.constructor = GymListView;

    GymListView.DEFAULT_OPTIONS = {
      size: [360, 125],
      data: undefined
    }

    //function that creates gym list scroll view
    function _createGymScrollview() {
      var gymScrollview = new Scrollview();

      var gymScrollviewModifier = new StateModifier({
          size: [360, 600],
          origin: [0.5, 0]
      });

      var backModifier = new StateModifier({
        // positions the background behind the tab surface
        transform: Transform.behind
      });

      var surfaces = [];

      gymScrollview.sequenceFrom(surfaces);

      for (var i = 0, temp; i < this.options.data.length; i++) {
          temp = new Surface({ //turn into view 
               content: this.options.data[i],
               size: [360, 100],
               properties: {
                   backgroundColor: "#22514E",
                   lineHeight: "100px",
                   textAlign: "center", 
                   color: "white",
                   fontSize: "20px",
                   zIndex: 1,
                   borderBottom: "1px solid #1C413D"
               }
          });

          //where i'll create distance surfaces
          // price = new surface ({

          // })

          // var pricemodifier = new Modifier ({

          // })

          temp.pipe(gymScrollview);
          surfaces.push(temp);
      }

      this.add(backModifier).add(gymScrollviewModifier).add(gymScrollview);
    }

    //function that instantiates gym list slider view
    // function _createGymListSliderview() {
    //   this.gymListSliderView = new GymListSliderView();

    //   this._add(this.gymListSliderView);

    // }

    module.exports = GymListView;
});

