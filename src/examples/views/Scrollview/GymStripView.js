define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');
    var ImageSurface    = require('famous/surfaces/ImageSurface');


    function GymStripView() {
        View.apply(this, arguments);

        _createBackground.call(this);
        _createIcon.call(this);
        _createTitle.call(this);
        _setListeners.call(this);
    }

    GymStripView.prototype = Object.create(View.prototype);
    GymStripView.prototype.constructor = GymStripView;

    GymStripView.DEFAULT_OPTIONS = {
        width: 320,
        height: 55,
        angle: -0.2,
        iconSize: 32,
        iconUrl: 'src/img/friends.png',
        title: 'Famo.us',
        fontSize: 26,
    };

    function _createBackground() {
        console.log("createBacking fired")

        this.backgroundSurface = new Surface({
            classes: ["gym-strip-view-background"],
            size: [this.options.width, this.options.height],
            properties: {
                backgroundColor: 'black', 
                boxShadow: '0 0 1px black'
            }
        });

        var rotateModifier = new StateModifier({
            transform: Transform.rotateZ(this.options.angle)
        });

        var skewModifier = new StateModifier({
            transform: Transform.skew(0, 0, this.options.angle)
        });

        this.add(rotateModifier).add(skewModifier).add(this.backgroundSurface);
    }

    function _createIcon() {
        var iconSurface = new ImageSurface({
            size: [this.options.iconSize, this.options.iconSize],
            content : this.options.iconUrl,
            pointerEvents : 'none'
        });

        var iconModifier = new StateModifier({
            transform: Transform.translate(24, 2, 0)
        });

        this.add(iconModifier).add(iconSurface);
    }

    function _createTitle() {
        var titleSurface = new Surface({
            size: [true, true],
            content: this.options.title,
            properties: {
                color: 'white',
                fontFamily: 'AvenirNextCondensed-DemiBold',
                fontSize: this.options.fontSize + 'px',
                textTransform: 'uppercase',
                pointerEvents : 'none'
            }
        });

        var titleModifier = new StateModifier({
            transform: Transform.thenMove(Transform.rotateZ(this.options.angle), [75, -5, 0])
        });

        this.add(titleModifier).add(titleSurface);
    }

    function _setListeners() {
        this.backgroundSurface.on('click', function() {
          console.log("gym background surface clicked");
          this._eventOutput.emit('menuToggle');
          this._eventOutput.emit('pass closed');
      }.bind(this));
    }

    module.exports = GymStripView;
});

