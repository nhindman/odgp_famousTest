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
        this.WindowHeight = window.innerHeight;

        this.confirmPurchaseBackground = new Surface({
            classes: ["confirmPurchaseBackground"],
            size: [320, this.WindowHeight],
            content: this.options.data.price.content,
            properties: {
                backgroundColor: "black", 
                textAlign: "center", 
            }
        });
        this.confirmPurchaseMod = new StateModifier({
            opacity: 0.75,
            align: [0,1],
            transform: Transform.translate(0, 0, 41)
        });

        this.add(this.confirmPurchaseMod).add(this.confirmPurchaseBackground);
    
        this.confirmPurchaseBackground.on('click', function() {
            this.confirmPurchaseMod.setAlign(
                [0,1.5],
                { duration : 270 }
            );
            //send click on confirmpurchase background to button through slideview
            this._eventOutput.emit('confirmPurchaseBackground clicked')
        }.bind(this));
    }

    ConfirmPurchase.prototype.moveUp = function() {
      this.confirmPurchaseMod.setAlign(
        [0,-0.2]
        // { duration : 270 }
      );
      // this.backgroundMod.setAlign(
      //   [0,-0.2],
      //   { duration : 270 }
      // );
    };

    ConfirmPurchase.prototype.moveDown = function() {
      this.confirmPurchaseMod.setAlign(
        [0,1.5]
        // { duration : 270 }
      );
      // this.backgroundMod.setAlign(
      //   [0,1.5],
      //   { duration : 270 }
      // );
    };

    module.exports = ConfirmPurchase;
});