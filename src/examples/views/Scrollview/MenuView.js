define(function(require, exports, module) {
    var Surface         = require('famous/core/Surface');
    var Modifier        = require('famous/core/Modifier');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var Transform       = require('famous/core/Transform');
    var View            = require('famous/core/View');
    var Timer           = require('famous/utilities/Timer');

    var StripView       = require('examples/views/Scrollview/StripView');
    var GymStripView    = require('examples/views/Scrollview/GymStripView');
    var FeaturedView    = require('examples/views/Scrollview/FeaturedView');
    var TicketView      = require('examples/views/Scrollview/TicketView');
    var StripData       = require('src/examples/data/StripData.js');


    function MenuView() {
        View.apply(this, arguments);

        _createStripViews.call(this);
        _createTicketView.call(this);
        _setListeners.call(this);
    }

    MenuView.prototype = Object.create(View.prototype);
    MenuView.prototype.constructor = MenuView;

    MenuView.DEFAULT_OPTIONS = {
            stripData: {},
            angle: -0.2,
            stripWidth: 320,
            stripHeight: 54,
            topOffset: 37,
            stripOffset: 58,
            staggerDelay: 35,
            featureOffset: 280,
            transition: {
                duration: 400,
                curve: 'easeOut'
            }
    };

    function _createStripViews() {
        this.stripModifiers = [];
        var yOffset = this.options.topOffset;

        this.gymStripView = new GymStripView({
            classes: ["gym-strip-view"],
            iconUrl: 'src/img/dumbell5.png',
            title: 'gyms'
        });

        //listens for event outputs from GymStripView ('menutoggle')
        this._eventOutput.subscribe(this.gymStripView);

        var gymStripViewMod = new StateModifier({
            transform: Transform.translate(0, yOffset, -1)
        });

        this.stripModifiers.push(gymStripViewMod);
        this.add(gymStripViewMod).add(this.gymStripView);

        yOffset += this.options.stripOffset;

        for(var i = 0; i < this.options.stripData.length; i++) {
            console.log("loop fired", i)
            var stripView = new StripView({
                iconUrl: this.options.stripData[i].iconUrl,
                title: this.options.stripData[i].title
            });

            var stripModifier = new StateModifier({
                transform: Transform.translate(0, yOffset, -1)
            });

            this.stripModifiers.push(stripModifier);
            this.add(stripModifier).add(stripView);

            yOffset += this.options.stripOffset;
            
        }
    }

    function _createTicketView(){
        this.ticketView = new TicketView();
        this._eventInput.pipe(this.ticketView);
        var ticketViewMod = new Modifier({
            origin: [0,1],
            transform: Transform.translate((276 - 200)/2, -80,0)
        });
        this.add(ticketViewMod).add(this.ticketView)

        _setupTicketViewEvent.call(this);
    }

    function _setupTicketViewEvent(){
        this.ticketView.ticket.on('click', function(){
            console.log('click ticket');
            this._eventOutput.emit('menuToggle');
            this._eventOutput.emit('ticketToggle');
        }.bind(this));
    }

    function _setListeners(){
        this.gymStripView.on('click', function() {
            console.log("gym strip clicked!");
        }.bind(this));

        this._eventInput.on('menuToggle', function() {
          this._eventOutput.emit('menuToggle');
          this._eventOutput.emit('pass closed');
        }.bind(this));
    }

    MenuView.prototype.resetStrips = function() {
        for(var i = 0; i < this.stripModifiers.length; i++) {
            var initX = -this.options.stripWidth;
            var initY = this.options.topOffset
                + this.options.stripOffset * i
                + this.options.stripWidth * Math.tan(-this.options.angle);

            this.stripModifiers[i].setTransform(Transform.translate(initX, initY, -1));
        }
    };

    MenuView.prototype.animateStrips = function() {
        this.resetStrips();

        var transition = this.options.transition;
        var delay = this.options.staggerDelay;
        var stripOffset = this.options.stripOffset;
        var topOffset = this.options.topOffset;

        for(var i = 0; i < this.stripModifiers.length; i++) {
            Timer.setTimeout(function(i) {
                var yOffset = topOffset + stripOffset * i;

                this.stripModifiers[i].setTransform(
                    Transform.translate( 0, yOffset, 0), transition);
            }.bind(this, i), i * delay);
        }
    };

    module.exports = MenuView;
});
