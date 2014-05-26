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


    function OverviewFooter() {
        View.apply(this, arguments);

        _createFooter.call(this);
    }

    OverviewFooter.prototype = Object.create(View.prototype);
    OverviewFooter.prototype.constructor = OverviewFooter;

    var windowWidth = window.innerWidth;
    OverviewFooter.DEFAULT_OPTIONS = {
        size: [windowWidth, 63]
    }

    function _createFooter() {
        var footerBackground = new View({
          classes: ["footer-background"]
        })

        this.footerModifier = new Modifier({ 
            origin: [0.5, -12.25],
            size: [windowWidth, 63]
        })

        this.add(this.footerModifier).add(footerBackground);
    
        this.footerBackgroundColor = new ContainerSurface({
            classes: ["this.footerBackgroundTwo"],
            properties: {
            backgroundColor: "black"
            }
        })

        var footerBackgroundColorMod = new StateModifier({
            origin: [0,1]
        });

        this.buttonSurface = new Surface({
            classes: ["button-surface"],
            content: "<p>Buy Now</p>",
            properties: {
                backgroundColor: "blue", 
                borderRadius: "5px", 
                color: "white", 
                textAlign: "center",
                paddingTop: "10px"
            }
        })

        this.buttonWidth = this.options.size[0] - 20
        this.buttonHeight = this.options.size[1] - 15

        console.log("this.buttonWidth", this.buttonWidth)
        
        this.buttonMod = new Modifier({
            origin: [0.5, 0.5],
            size: [this.buttonWidth, this.buttonHeight]
        })

        this.footerBackgroundColor.add(this.buttonMod).add(this.buttonSurface);
        footerBackground.add(footerBackgroundColorMod).add(this.footerBackgroundColor);

    }

    module.exports = OverviewFooter;
});