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

      //creates hamburger icon container
      this.hamburgerSurfaceContainer = new ContainerSurface({
        size: [80, undefined]
      })

      this.hamburgerContainerModifier = new Modifier({
        origin: [0, 0.5],
      }) 

      //creates hamburger icon
      this.hamburgerSurface = new Surface({
        size: [true, true],
        content: '<img width="20" src="src/img/menu-icon.png"/>'
      });

      //creates hamburger icon modifier
      this.hamburgerModifier = new Modifier({
        origin: [0.5, 0.5]
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
        origin: [0.43,0.45]
      })

      this.downArrow = new Surface({
        size: [true, true], 
        content: '<img class="header-down-arrow" width="20" src="src/img/down-arrow.png"/>'
      });

      this.arrowModifier = new Modifier({
        origin: [0.6,0.55]
      });

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
        origin: [0.89,0.48]
      })

      //adds header background to headerview
      this._add(backgroundSurface);
      //adds hamburger icon to headerview
      backgroundSurface.add(this.hamburgerContainerModifier).add(this.hamburgerSurfaceContainer);
      // adds city name to headerview
      backgroundSurface.add(this.cityModifier).add(this.citySurface);
      backgroundSurface.add(this.arrowModifier).add(this.downArrow);
      // adds map icon to headerview
      backgroundSurface.add(this.mapModifier).add(this.mapSurface);
      //adds hamburger surface to hamburger surface container
      this.hamburgerSurfaceContainer.add(this.hamburgerModifier).add(this.hamburgerSurface);
    }

    function _setListeners() {
      this.hamburgerSurface.on('click', function(e) {
          if(e.detail != null) return false;
          this._eventOutput.emit('menuToggle');
      }.bind(this));

      this.hamburgerSurfaceContainer.on('click', function(e) {
          if(e.detail != null) return false;
          this._eventOutput.emit('menuToggle');
      }.bind(this));

    }

    module.exports = GymListHeaderView;
});