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

    function ConfirmPurchase(options,data) {
        View.apply(this, arguments);

        _createConfirmPurchase.call(this);
    };

    ConfirmPurchase.prototype = Object.create(View.prototype);
    ConfirmPurchase.prototype.constructor = ConfirmPurchase;

    ConfirmPurchase.DEFAULT_OPTIONS = {
        data: undefined
    };

    function _createConfirmPurchase(data) {
        console.log("CONFIRM PURCHASE BEING CREATED", this.options.data);
        this.halfWindowHeight = window.innerHeight / 2;
        
        this.confirmPurchaseBackground = new Surface({
            classes: ["confirmPurchaseBackground"],
            size: [320, this.halfWindowHeight],
            content: this.options.data.price.content,
            properties: {
                backgroundColor: "black"
            }
        });
        this.confirmPurchaseMod = new StateModifier({
            align: [0,1],
            transform: Transform.translate(0, 0, 41)
        });

        this.add(this.confirmPurchaseMod).add(this.confirmPurchaseBackground);
    
        this.confirmPurchaseBackground.on('click', function() {
            console.log('confirmPurchaseBackground clicked')
            this.confirmPurchaseMod.setAlign(
                [0,1.5],
                { duration : 270 }
            );
        }.bind(this));
    }

    ConfirmPurchase.prototype.moveUp = function() {
      this.confirmPurchaseMod.setAlign(
        [0,-0.2],
        { duration : 270 }
      );
      // this.backgroundMod.setAlign(
      //   [0,-0.2],
      //   { duration : 270 }
      // );
    };

    ConfirmPurchase.moveDown = function() {
      this.confirmPurchaseMod.setAlign(
        [0,1.5],
        { duration : 270 }
      );
      // this.backgroundMod.setAlign(
      //   [0,1.5],
      //   { duration : 270 }
      // );
    };

    module.exports = ConfirmPurchase;
});