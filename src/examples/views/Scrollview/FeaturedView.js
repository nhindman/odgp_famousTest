define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');

    function FeaturedView() {
        View.apply(this, arguments);

        createBacking.call(this);
        createNoteworthy.call(this);
        createStaffPicks.call(this);
    }

    var createBacking = function() {
        var backSurface = new Surface({
            size: [120, 164],
            content: '<img width="120" src="src/img/friends.png"/>'
        });

        this._add(backSurface);
    };

    var createNoteworthy = function() {
        var surface = new Surface({
            // content: 'Noteworthy',
            properties: {
                color: 'black',
                fontSize: this.options.fontSize + 'px',
                textTransform: 'uppercase',
            }
        });

        var modifier = new Modifier({
            transform: Transform.thenMove(Transform.rotateZ(this.options.angle), [this.options.xOffset, 30, 0])
        });

        this._add(modifier).add(surface);
    };

    var createStaffPicks = function() {
        var surface = new Surface({
            // content: 'Timbrus staff picks',
            properties: {
                color: 'white',
                fontSize: this.options.fontSize + 'px',
                textTransform: 'uppercase',
            }
        });

        var modifier = new Modifier({
            transform: Transform.thenMove(Transform.rotateZ(this.options.angle), [this.options.xOffset, 67, 0])
        });

        this._add(modifier).add(surface);
    };

    FeaturedView.prototype = Object.create(View.prototype);
    FeaturedView.prototype.constructor = FeaturedView;

    FeaturedView.DEFAULT_OPTIONS = {
        angle: 0,
        xOffset: 15,
        fontSize: 22
    }

    module.exports = FeaturedView;
});
