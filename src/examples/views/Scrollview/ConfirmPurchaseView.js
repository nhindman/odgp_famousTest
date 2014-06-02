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
    var SequentialLayout = require('famous/views/SequentialLayout');
    var Transitionable  = require('famous/transitions/Transitionable');

    var SpringTransition = require('famous/transitions/SpringTransition');
    Transitionable.registerMethod('spring', SpringTransition);

    function ConfirmPurchase(options,data) {
        View.apply(this, arguments);

        _createConfirmPurchase.call(this);
    
    };

    ConfirmPurchase.prototype = Object.create(View.prototype);
    ConfirmPurchase.prototype.constructor = ConfirmPurchase;

    ConfirmPurchase.DEFAULT_OPTIONS = {
        data: undefined, 
        lightboxOpts: {
            // inOrigin: [0.2,0.8],
            showOrigin: [0.32,0.555],
            inTransform: Transform.translate(0, 300, 0),
            outTransform: Transform.translate(0, -50, 0),
            inTransition: { duration: 500, curve: Easing.outBack },
            outTransition: { duration: 350, curve: Easing.inQuad }
        },
        numberSize: [38,65],
        transition: {
            method: 'spring',
            period: 300,
            dampingRatio: 0.5
        },
    };

    function _createConfirmPurchase(data) {
        console.log("CONFIRM PURCHASE BEING CREATED", this.options.data.price.content);
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

        // ##### ---- removes confirmPurchase module when tinted background (confirmPurchaseBackground) is clicked -- ####
        this.confirmPurchaseBackground.on('click', function() {
            this.confirmPurchaseMod.setAlign(
                [0,1.5]
            );
            this.confirmPurchaseContainerMod.setAlign(
                [0,1.5],
                { duration : 270 }
            )
            //send click on confirmpurchase background to button through slideview
            this._eventOutput.emit('confirmPurchaseBackground clicked')
        }.bind(this));

        var thirdWindowWidth = window.innerWidth / 2.18;

        //##### -- # of passes TEXT --- ###########
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
        
        //####-- BOX with DIAL setting # of passes --####
        this.passSetter = new ContainerSurface({
            size: [thirdWindowWidth, this.confirmPurchaseContainer.getSize()[1]/2.8],
            properties: {
                backgroundColor: "blue",
                overflow: "hidden",
                borderRadius: "10px"
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

        //###### adding plusSquare and minusSquare to passSetter ContainerSurface #######
        this.passSetter.add( this.plusSquareMod).add(this.plusSquare);
        this.passSetter.add(this.minusSquareMod).add(this.minusSquare);
    

        //### -- LIGHTBOX STUFF FOR INCREMENTING PASS TOTAL -- ###
        
        this.numberLayout = new SequentialLayout({
            direction: 1
        });

        this.numberLayoutPos = new Transitionable(0);
        this.numberLayoutMod = new Modifier({
            size:[window.innerWidth, this.options.numberSize[1]*100],
            align: [0.55, 0.18],
            transform: function(){
                return Transform.translate(0,this.numberLayoutPos.get(),0)
            }.bind(this)
        });

        this.passSetter.add(this.numberLayoutMod).add(this.numberLayout);
        this.slides = [];

        this.currentIndex = 0;
    
        var priceString = '"'+this.options.data.price.content+'"'
        var m = priceString.match(/\d+/g);

        var price = m.pop();

        this.maxNumber = 10;

        for (var i = 1; i < this.maxNumber; i++) {
            var number = new Surface({
                content: '<div class="number">'+i+'</div>', 
                size: this.options.numberSize,
                properties: { 
                    color: "purple", 
                    textAlign: "center", 
                    fontSize: "55px",
                    lineHeight: this.options.numberSize[1] + 'px',
                    borderTop: "solid black "+ (i%2) +"px",
                    borderBottom: "solid black "+ (i%2) +"px",
                }
            });
            this.slides.push(number);
        }

        this.numberLayout.sequenceFrom(this.slides);
        //click listener on plus sign
        // console.log("this.currentIndex", this.currentIndex);
        this.plusSquare.on('click', function(){
            this.currentIndex = Math.min(this.maxNumber-2,this.currentIndex+1);
            this.moveNumber();
            $('.right-column').html('$'+price * (this.currentIndex+1) +'.00');
            $('.total-passes').html(this.currentIndex+1);
        }.bind(this));

        // click listener on minus sign
        this.minusSquare.on('click', function(){
            this.currentIndex = Math.max(0,this.currentIndex-1);
            this.moveNumber();
            $('.right-column').html('$'+price * (this.currentIndex+1)+'.00');
            $('.total-passes').html(this.currentIndex+1);
            // }
        }.bind(this));

        //show slide
//        var slide = this.slides[this.currentIndex];
//        this.lightbox.show(slide);
        
        //####-- END OF LIGHTBOX -- ######

        //###--- Language inside totalContainer --- ####
        this.totalContainer = new Surface({
            size: [thirdWindowWidth, this.confirmPurchaseContainer.getSize()[1]/2.8],
            classes: ["totalContainer"],
            content: ['<table class="totals_table">',
                '<tr>',  
                    '<td class="left-column">1','<span class="at-sign">@<span></td>',
                    '<td class="right-column">','$'+price * (this.currentIndex+1)+'.00','</td>',
                '</tr>',
                '<tr>',  
                    '<td class="left-column">Subtotal</td>',
                    '<td class="right-column">','$'+price * (this.currentIndex+1)+'.00','</td>',
                '</tr>',
                '<tr>', 
                    '<td class="left-column">Rewards</td>',
                    '<td class="right-column-rewards">$0.00</td>',
                '</tr>',
                '<tr>',  
                    '<td class="left-column"><strong>Total</strong></td>',
                    '<td class="right-column">','$'+price * (this.currentIndex+1)+'.00','</td>',
                '</tr>',
            '</table>', '<div class="total-passes">'+(this.currentIndex+1)+'</div>'].join(''), 
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
            transform: Transform.thenMove(Transform.rotateZ(angle),[-109, -51.5]),
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
      );
      this.confirmPurchaseContainerMod.setAlign(
        [0,0.33],
        { duration : 270 }
      );
    };

    ConfirmPurchase.prototype.moveDown = function(transition) {
      this.confirmPurchaseMod.setAlign(
        [0,1.5]
      );
      this.confirmPurchaseContainerMod.setAlign(
        [0,1.5],
        transition || { duration : 270 }
      );
    };

    ConfirmPurchase.prototype.moveNumber = function(){
        this.numberLayoutPos.set(-this.currentIndex * this.options.numberSize[1], this.options.transition)
    }

    module.exports = ConfirmPurchase;
});