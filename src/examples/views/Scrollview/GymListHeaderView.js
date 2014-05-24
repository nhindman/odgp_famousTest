define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');

    var GymData = require('src/examples/data/GymData.js');
    var ContainerSurface = require('famous/surfaces/ContainerSurface')

    function GymListHeaderView() {
      View.apply(this, arguments);

      _createHeader.call(this);
      _setListeners.call(this);
    }

    GymListHeaderView.prototype = Object.create(View.prototype);
    GymListHeaderView.prototype.constructor = GymListHeaderView;


    function _createHeader() {
      //creates backround color / background surface
      var backgroundSurface = new ContainerSurface({
        size: [undefined, 75],
        properties: {
          backgroundColor: 'black', 
          zIndex: 10
        }
      });

      backgroundSurface.pipe(this._eventOutput);

      //creates hamburger icon
      this.hamburgerSurface = new Surface({
        size: [true, true], 
        content: '<img width="20" src="src/img/menu-icon.png"/>', 
        properties: {
          marginLeft: "9.7%",
          zIndex: 500
        }
      })

      //sets position of hamburger icon
      this.hamburgerModifier = new Modifier({
        origin: [0, 0.5]
      });

      //adds city name to header
      this.citySurface = new Surface({ 
        size: [true, true],
        content: '<div class="city_name">New York</div>', 
        properties: {
          color: "white", 
          zIndex: 1000000
        }
      })

      //sets position of city
      this.cityModifier = new Modifier({
        origin: [0.5,0.47]
      })

      // adds map icon to header
      this.mapSurface = new Surface({ 
        size: [true, true],
        content: '<img width="20" src="src/img/map-marker-48.png"/>', 
        properties: { 
          zIndex: 1000000
        }
      })

      // sets position of map icon
      this.mapModifier = new Modifier({
        origin: [0.89,0.5]
      })

      //adds header background to headerview
      this._add(backgroundSurface);
      //adds hamburger icon to headerview
      backgroundSurface.add(this.hamburgerModifier).add(this.hamburgerSurface);
      // adds city name to headerview
      backgroundSurface.add(this.cityModifier).add(this.citySurface);
      // adds map icon to headerview
      backgroundSurface.add(this.mapModifier).add(this.mapSurface);
    }

    function _setListeners() {
      this.hamburgerSurface.on('click', function() {
          this._eventOutput.emit('menuToggle');
      }.bind(this));

      // this.pipe(this._eventOutput);

    }

    module.exports = GymListHeaderView;
});