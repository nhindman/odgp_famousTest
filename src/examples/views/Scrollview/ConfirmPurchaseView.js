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
        this.halfWindowHeight = window.innerHeight / 2;

        this.confirmPurchaseBackground = new ContainerSurface({
            classes: ["confirmPurchaseBackground"],
            size: [320, this.WindowHeight],
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

        this.confirmPurchaseContainer = new ContainerSurface({
            classes: ["confirmPurchaseContainer"],
            size: [undefined, this.halfWindowHeight],
            properties: {
                backgroundColor: "purple", 
                color: "white",
            }
        });

        this.confirmPurchaseContainerMod = new StateModifier({
            opacity: 1,
            align: [0,1], 
            transform: Transform.translate(0,0,54)
        });

        this.gymPassIcon = new Surface({
            size: [true, true],
            classes: ["gymPassIcon-confirmPurchase"],
            content: '<img width="102.5" src="src/img/white_pass.png"/>'
        });

        //setting angle for gym pass icon
        var angle = +Math.PI * 5/4;

        this.gymPassIconMod = new StateModifier({ 
            transform: Transform.thenMove(Transform.rotateZ(angle),[window.innerWidth/2, window.innerHeight/5.1])
        });

        // num of days inside gym pass icon
        this.numDays = new Surface({
            size: [true, true], 
            content: ['<div>',window.gymDays,'</div>'].join(''), 
            properties: {
                color: "black",
                fontSize: "14px"
            }
        });

        // setting angle for num of days inside gym pass icon
        var numDaysAngle = +Math.PI * 1/5;
        this.numDaysMod = new StateModifier({
            origin: [0.57, 0.1],
            transform: Transform.rotateZ(numDaysAngle)
        })

        this.add(this.confirmPurchaseContainerMod).add(this.confirmPurchaseContainer);
        this.confirmPurchaseContainer.add(this.gymPassIconMod).add(this.gymPassIcon);
        this.confirmPurchaseContainer.add(this.numDaysMod).add(this.numDays);

        this.confirmPurchaseBackground.on('click', function() {
            this.confirmPurchaseMod.setAlign(
                [0,1.5]
                // { duration : 270 }
            );
            this.confirmPurchaseContainerMod.setAlign(
                [0,1.5],
                { duration : 270 }
            )
            //send click on confirmpurchase background to button through slideview
            this._eventOutput.emit('confirmPurchaseBackground clicked')
        }.bind(this));

        var thirdWindowWidth = window.innerWidth / 2.5;

        //how many passes container
        this.howManyPasses = new Surface({
            size: [true, true],
            content: '<div>How many passes?</div>',
            properties: {
                color: "white", 
                fontSize: "14px"
            }
        });

        this.howManyPassesMod = new StateModifier({
            origin: [0.105, 0.28]
        });
        
        //container with dial setting # of passes
        this.passSetter = new ContainerSurface({
            size: [thirdWindowWidth, this.confirmPurchaseContainer.getSize()[1]/2.8],
            properties: {
                backgroundColor: "blue"
            }
        });

        this.passSetterMod = new StateModifier({
            classses: ["passSetter"],
            origin: [0.11, 0.58]
        });

        //totalContainer
        this.totalContainer = new ContainerSurface({
            size: [thirdWindowWidth, this.confirmPurchaseContainer.getSize()[1]/2.8],
            properties: {
                backgroundColor: "blue"
            }
        });

        this.totalContainerMod = new StateModifier({
            classes: ["totalContainer"],
            origin: [0.89, 0.58]
        });

        //adding passSetter & totalContainer to confirmPurchase container
        this.confirmPurchaseContainer.add(this.passSetterMod).add(this.passSetter);
        this.confirmPurchaseContainer.add(this.totalContainerMod).add(this.totalContainer);
        //adding howManyPasses surface to confirmPurchase container
        this.confirmPurchaseContainer.add(this.howManyPassesMod).add(this.howManyPasses);
    }

    ConfirmPurchase.prototype.moveUp = function() {
      this.confirmPurchaseMod.setAlign(
        [0,-0.2]
        // { duration : 270 }
      );
      this.confirmPurchaseContainerMod.setAlign(
        [0,0.5],
        { duration : 270 }
      );
    };

    ConfirmPurchase.prototype.moveDown = function() {
      this.confirmPurchaseMod.setAlign(
        [0,1.5]
        // { duration : 270 }
      );
      this.confirmPurchaseContainerMod.setAlign(
        [0,1.5],
        { duration : 270 }
      );
    };

    module.exports = ConfirmPurchase;
});