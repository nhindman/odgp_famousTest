define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    var Lightbox = require('famous/views/Lightbox');
    var ImageSurface = require("famous/surfaces/ImageSurface");
    var HeaderFooter = require('famous/views/HeaderFooterLayout');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');

    // var ConfirmPurchase = require('examples/views/Scrollview/ConfirmPurchaseView');

    function OverviewFooter(options, data) {
        View.apply(this, arguments);
        _createFooter.call(this);
        _setListeners.call(this);
    }

    OverviewFooter.prototype = Object.create(View.prototype);
    OverviewFooter.prototype.constructor = OverviewFooter;

    var windowWidth = window.innerWidth;
    
    OverviewFooter.DEFAULT_OPTIONS = {
        size: [windowWidth, 63], 
        data: undefined
    }

    function _createFooter() {
        var footerBackground = new View({
          classes: ["footer-background"]
        })

        this.footerModifier = new Modifier({ 
            origin: [0.5, -12.25],
            size: [windowWidth, 63], 
            transform: Transform.translate(0, 0, 43)
        })

        this.add(this.footerModifier).add(footerBackground);
    
        this.footerBackgroundColor = new ContainerSurface({
            classes: ["this.footerBackgroundTwo"],
            properties: {
                backgroundColor: "black", 
                zIndex: 35
            }
        })

        var footerBackgroundColorMod = new StateModifier({
            origin: [0,1], 
            transform: Transform.translate(0, 0, 43)
        });

        this.buttonSurface = new Surface({
            classes: ["button-surface"],
            content: "<p>Buy Now</p>",
            properties: {
                backgroundColor: "blue", 
                borderRadius: "5px", 
                color: "white", 
                textAlign: "center",
                paddingTop: "10px", 
                zIndex: 36
            }
        })

        this.buttonWidth = this.options.size[0] - 20
        this.buttonHeight = this.options.size[1] - 15
        
        this.buttonMod = new Modifier({
            origin: [0.5, 0.5],
            size: [this.buttonWidth, this.buttonHeight], 
            transform: Transform.translate(0, 0, 45)
        })

        this.footerBackgroundColor.add(this.buttonMod).add(this.buttonSurface);
        footerBackground.add(footerBackgroundColorMod).add(this.footerBackgroundColor);

    }

    function _setListeners() {
        this.buttonSurface.on('click', function(){
            this._eventOutput.emit('buy-now-clicked', {data: this.options.data})
            this.buttonSurface.setContent("<div>Confirm Purchase</div>")
        }.bind(this));

        this._eventInput.on('confirmPurchaseBackground clicked'), function() {
            console.log("confirmPurchaseBackground clicked");
            this.buttonSurface.setContent("<div>Buy Now</div>");
        }

    }

    module.exports = OverviewFooter;
});