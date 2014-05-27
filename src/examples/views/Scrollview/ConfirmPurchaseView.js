define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var View = require('famous/core/View');
    var RenderNode = require('famous/core/RenderNode');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    var Lightbox = require('famous/views/Lightbox');
    var ImageSurface = require("famous/surfaces/ImageSurface");
    var HeaderFooter = require('famous/views/HeaderFooterLayout');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Scrollview = require("famous/views/Scrollview");

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

        var thirdWindowWidth = window.innerWidth / 2.18;

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
            origin: [0.04, 0.28]
        });
        
        //####-- dial setting # of passes --####
        this.passSetter = new ContainerSurface({
            size: [thirdWindowWidth, this.confirmPurchaseContainer.getSize()[1]/2.8],
            properties: {
                backgroundColor: "blue"
            }
        });

        this.passSetterMod = new StateModifier({
            classses: ["passSetter"],
            origin: [0.05, 0.58]
        });

        this.plusSquare = new Surface({
            classes: ['this.plusSquare'],
            content: '<img class="plus-icon" width="17px" src="src/img/plus-sign-white.png"/>',
            size: [this.passSetter.getSize()[0]/3.5, this.passSetter.getSize()[1]/2.5], 
            properties: {
                backgroundColor: "purple", 
                borderRadius: "3px",
                textAlign:'center'
            }
        });

        this.plusSquareMod = new StateModifier({
            origin: [0.1, 0.1]
        });

        this.minusSquare = new Surface({
            classes: ['this.minusSquare'],
            content: '<img class="minus-icon" width="11px" src="src/img/minus-sign-white.png"/>',
            size: [this.passSetter.getSize()[0]/3.5, this.passSetter.getSize()[1]/2.5], 
            properties: {
                backgroundColor: "purple", 
                borderRadius: "3px", 
                textAlign: "center"
            }
        });

        this.minusSquareMod = new StateModifier({
            origin: [0.1, 0.9]
        });

        //adding plusSquare and minusSquare to passSetter ContainerSurface 
        this.passSetter.add( this.plusSquareMod).add(this.plusSquare);
        this.passSetter.add(this.minusSquareMod).add(this.minusSquare);

        this.passScroll = new Scrollview({
            classes: ["pass-scroll"],
            size: [this.passSetter.getSize()[0]/2, this.passSetter.getSize()[1] - 10]
        });
        
        this.passScrollMod = new Modifier({
            origin: [1, .5]
        })
        this.surfaces = [];

        this.passScroll.sequenceFrom(this.surfaces);

        for (var i = 0; i < 11; i++) {
            var number = new Surface({
                content: '<div class="number">'+i+'</div>'
            }) 
            // number.pipe(this.passScroll);
            this.surfaces.push(number);
        }

        //adding scrollview (passScroll) to passSetter
        this.passSetter.add(this.passScrollMod).add(this.passScroll);   

        //###--- totalContainer --- ####
        this.totalContainer = new Surface({
            size: [thirdWindowWidth, this.confirmPurchaseContainer.getSize()[1]/2.8],
            classes: ["totalContainer"],
            content: ['<table class="totals_table">',
                '<tr>',  
                    '<td>1','<span class="at-sign">@<span></td>',
                    '<td class="right-column">Column 2</td>',
                '</tr>',
                '<tr>',  
                    '<td>Subtotal</td>',
                    '<td class="right-column">Column 2</td>',
                '</tr>',
                '<tr>', 
                    '<td>Rewards</td>',
                    '<td class="right-column">Column 2</td>',
                '</tr>',
                '<tr>',  
                    '<td><strong>Total</strong></td>',
                    '<td class="right-column">Column 2</td>',
                '</tr>',
            '</table>'].join(''), 
            properties: {
                backgroundColor: "blue", 
                color: "white", 
                textAlign: "left", 
                fontSize: "12px"
            }
        });

        this.totalPriceNode = new RenderNode();
        this.totalPriceNodeMod = new StateModifier({
            origin: [0.95, 0.58],
            Transform:Transform.translate(0,0,100)
        });

        this.confirmPurchaseContainer.add(this.totalPriceNodeMod).add(this.totalPriceNode);

        var miniPassAngle = -Math.PI/6;

        this.miniPass = new Surface({
            size: [true, true],
            classes: ["mini-pass"],
            content: '<img class="mini-pass" src="src/img/white_pass.png"/>'
        })

        this.miniPassMod = new StateModifier({
            transform: Transform.thenMove(Transform.rotateZ(angle),[-115, -51.5]),
            // origin: [0.5, 0.5]
        })

        //adding passSetter & totalContainer to confirmPurchase container
        this.confirmPurchaseContainer.add(this.passSetterMod).add(this.passSetter);
        // this.confirmPurchaseContainer.add(this.totalContainerMod).add(this.totalContainer);
        //adding howManyPasses surface to confirmPurchase container
        this.confirmPurchaseContainer.add(this.howManyPassesMod).add(this.howManyPasses);
        //adding mini pass icon to total container
        this.totalPriceNode.add(this.totalContainer);
        this.totalPriceNode.add(this.miniPassMod).add(this.miniPass);
    }

    ConfirmPurchase.prototype.moveUp = function() {
      this.confirmPurchaseMod.setAlign(
        [0,-0.2]
        // { duration : 270 }
      );
      this.confirmPurchaseContainerMod.setAlign(
        [0,0.33],
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