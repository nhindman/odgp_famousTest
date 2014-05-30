define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var RenderNode = require("famous/core/RenderNode");
    var View = require('famous/core/View');
    var Timer = require('famous/Utilities/Timer');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');

    
    function CreditCardView(options, data) {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);
        _createListeners.call(this);
    }

    CreditCardView.prototype = Object.create(View.prototype);
    CreditCardView.prototype.constructor = CreditCardView;

    var windowWidth = window.innerWidth;

    CreditCardView.DEFAULT_OPTIONS = {
        size: [windowWidth, undefined],
        data: undefined, 
        headerSize: 75,
        posThreshold: window.innerHeight/2.2,
        velThreshold: 0.75,
        transition: {
          duration: 270
        }
    };

    function _createLayout(){
        this.layoutNode = new RenderNode();

        this.layout = new HeaderFooterLayout({
          headerSize: this.options.headerSize
        });

        this.layoutModifier = new StateModifier({
            transform: Transform.translate(0, window.innerHeight-75, 81),
            size:[window.innerWidth, window.innerHeight]
        });

        this.add(this.layoutModifier).add(this.layoutNode);
        this.layoutNode.add(this.layout);
    }

    //########### --- HEADER --- ############

    function _createHeader(){
        this.headerBackground = new ContainerSurface({
            classes: ["creditcard-header"],
            size: [undefined, 75], 
            properties: {
                backgroundColor: 'black',
                color: 'white'
            }
        });

        this.closeSurface = new Surface({
          size: [50, 30],
          properties: { 
            textAlign: "center",
            zIndex: 23
          },
          content: '<div>Close</div>'
        });

        this.closeModifier = new Modifier({
          origin: [0, 0.5]
        });

        this.closeSensor = new Surface({
          size: [50, true],
          properties: { 
            textAlign: "center",
            zIndex: "5"
          }
        });

        this.closeSensorModifier = new Modifier({
          origin: [0.07, 0.65]
          // align: [0.5, 0.50]
        });

        this.creditCard = new Surface({
            classes: ["join-text"],
            content: '<div>Payment</div>',
            size: [true, true], 
            properties: {
                fontColor: "white",
            }
        });

        this.creditCardMod = new StateModifier({
            origin: [0.5,0.5]
        });

        this.OK = new Surface({
            content: '<div>Ok</div>',
            size: [true, true]
        });

        this.OKModifier = new StateModifier({
            origin: [0.937,0.5]
        });

        this.headerBackground.add(this.closeModifier).add(this.closeSurface);
        this.headerBackground.add(this.OKModifier).add(this.OK);
        this.headerBackground.add(this.creditCardMod).add(this.creditCard);
        this.layout.header.add(this.headerMod).add(this.headerBackground);
        
        //click on closeIcon closes the credit card page
        this.OK.on('click', function(){
            console.log("OK clicked");
            this.paymentSuccess();
            Timer.setTimeout(function(){
                this._eventOutput.emit('pass created');
                this.moveDown();
            }.bind(this),1000);

        }.bind(this));    

    };

    //##################-- END OF HEADER ---#################

    //###################------BODY-----#####################
    function _createBody() {
        this.bodyBackground = new ContainerSurface({
            classes: ["creditcard-body"],
            size: [undefined, undefined], 
            properties: {
                backgroundColor: 'black',
                color: 'white'
            }
        });

        this.bodyBackgroundMod = new Modifier({
            transform: Transform.translate(0,0,60)
        })

        var venmoWidth = window.innerWidth/1.2;
        var venmoHeight = window.innerHeight/11;

        this.venmo = new ContainerSurface({
            classes: ["creditcard-venmo"], 
            size: [venmoWidth, venmoHeight], 
            properties: {
                backgroundColor: "blue", 
                borderRadius: "2px"
            }
        })

        this.venmoMod = new Modifier({
            transform: Transform.translate(0,0,61), 
            origin: [0.5, 0]
        })

        var rectangleHeight = window.innerHeight/2.7;
        this.rectangle = new ContainerSurface({
            classes: ["creditcard-rectangle"], 
            size: [undefined, rectangleHeight], 
            properties: {
                backgroundColor: "white"
            }
        })

        this.rectangleMod = new Modifier({
            transform: Transform.translate(0,0,61), 
            origin: [0.5, 0.3]
        })
        var inputwidth = window.innerWidth/1.2
        this.cardName = new Surface({
            classes: ["card-name"],
            content: '<input class="email-input" placeholder="Card Holders Name"></input>', 
            size: [inputwidth, rectangleHeight/4.1], 
            properties: {
                backgroundColor: "white", 
                color: "black", 
                textAlign: "left"
            }   
        });

        this.cardNameMod = new Modifier({
            transform: Transform.translate(0,0,62), 
            origin: [0.38, 0.02]
        })

        this.firstX = new Surface({
            content: '<img width="33" src="src/img/red-x.png"/>', 
            properties: {
                backgroundColor: 'white'
            }, 
            size: [50,50]
        });

        this.firstXMod = new Modifier({
            transform: Transform.translate(0,0,70),
            origin: [0.99,0.08]
        });

        this.secondX = new Surface({
            content: '<img width="33" src="src/img/red-x.png"/>', 
            properties: {
                backgroundColor: 'white'
            },
            size: [50,46]
        });

        this.secondXMod = new Modifier({
            transform: Transform.translate(0,0,70),
            origin:[0.99,.40]
        });

        this.thirdX = new Surface({
            content: '<img width="33" src="src/img/red-x.png"/>', 
            properties: {
                backgroundColor: 'white'
            },
            size: [50,46]
        });

        this.thirdXMod = new Modifier({
            transform: Transform.translate(0,0,70),
            origin:[0.99,.71]
        });

        this.fourthX = new Surface({
            content: '<img width="33" src="src/img/red-x.png"/>', 
            properties: {
                backgroundColor: 'white'
            },
            size: [50,43]
        });

        this.fourthXMod = new Modifier({
            transform: Transform.translate(0,0,70),
            origin:[0.99,1]
        });

        this.cardNumber = new Surface({
            classes: ["card-number"],
            content: '<input class="password-input" placeholder="Credit Card Number"></input>',
            size: [inputwidth, rectangleHeight/2.8], 
            properties: {
                backgroundColor: "white", 
                color: "black", 
                textAlign: "left"
            }
        });

        this.cardNumberMod = new Modifier({
            transform: Transform.translate(0,0,62), 
            origin: [.38, .325]
        });

        this.expireLine = new Surface({
            classes: ["expire"],
            content: '<input class="expire-input" placeholder="Expires mm/yy"></input>'+'<img width="33" src="src/img/red-x.png"/>',
            size: [inputwidth/2, rectangleHeight/2.8], 
            properties: {
                backgroundColor: "white", 
                color: "black", 
                textAlign: "left"
            }
        });

        this.expireLineMod = new Modifier({
            transform: Transform.translate(0,0,62), 
            origin: [.38, .65]
        });

        this.cvvLine = new Surface({
            classes: ["cvv"],
            content: '<input class="cvv-input" placeholder="CVV"></input>',
            size: [inputwidth/2, rectangleHeight/2.8], 
            properties: {
                backgroundColor: "white", 
                color: "black", 
                textAlign: "left"
            }
        });

        this.cvvLineMod = new Modifier({
            transform: Transform.translate(0,0,62), 
            origin: [.68, .65]
        });

        this.countryLine = new Surface({
            classes: ["country"],
            content: '<div>United States</div>',
            size: [inputwidth/2, rectangleHeight/2.8], 
            properties: {
                backgroundColor: "white", 
                color: "black", 
                textAlign: "left"
            }
        });

        this.countryLineMod = new Modifier({
            transform: Transform.translate(0,0,62), 
            origin: [.38, 1]
        });

        this.zipLine = new Surface({
            classes: ["zipcode"],
            content: '<input class="zipcode-input" placeholder="Zip Code"></input>',
            size: [inputwidth/2, rectangleHeight/2.8], 
            properties: {
                backgroundColor: "white", 
                color: "black", 
                textAlign: "left"
            }
        });

        this.zipLineMod = new Modifier({
            transform: Transform.translate(0,0,62), 
            origin: [.68, 1]
        });

        this.separator = new Surface({
            classes: ["input-separator"], 
            size: [inputwidth, .5], 
            properties: {
                backgroundColor: "rgb(201,201,201)" 
            }
        });

        this.separatorMod = new Modifier({
            transform: Transform.translate(0,0,75),
            origin: [0.5, 0.25]
        });

        this.separator2 = new Surface({
            classes: ["input-separator"], 
            size: [inputwidth, .5], 
            properties: {
                backgroundColor: "rgb(201,201,201)" 
            }
        });

        this.separator2Mod = new Modifier({
            transform: Transform.translate(0,0,75),
            origin: [0.5, 0.50]
        });

        this.separator3 = new Surface({
            classes: ["input-separator"], 
            size: [inputwidth, .5], 
            properties: {
                backgroundColor: "rgb(201,201,201)" 
            }
        });

        this.separator3Mod = new Modifier({
            transform: Transform.translate(0,0,75),
            origin: [0.5, 0.75]
        });

        //#######-- sign up button --#######
        // this.buttonWidth = window.innerWidth - (window.innerWidth/6.5);
        // this.buttonHeight = window.innerHeight/12;

        // this.buttonSurface = new Surface({
        //     size: [this.buttonWidth, this.buttonHeight],
        //     classes: ["signup-button-surface"],
        //     content: '<div>Sign Up</div>',
        //     properties: {
        //         border: "solid 1px white", 
        //         borderRadius: "2px", 
        //         color: "white", 
        //         textAlign: "center",
        //         lineHeight: this.buttonHeight +'px',
        //     }
        // });

        // this.buttonMod = new Modifier({
        //     origin: [0.5, 0.52],
        //     transform: Transform.translate(0, 0, 55)
        // });

        //TERMS AND CONDITIONS
        this.VenmoMessage = new Surface({
            classes: ["TC-message"], 
            size: [true, true], 
            content: '<div class="T-and-C">Save card and email with Venmo for use in other apps and agree to User Terms.</div>',
            properties: {
                backgroundColor: "black", 
                color: "white", 
                textAlign: "center", 
                fontSize: "81%"
            }
        });

        this.VenmoMessageMod = new StateModifier({
            origin: [0.5, 0.63]
        });

        this.closeSurface.on('click', function() {
            console.log('close surface clicked');
            this._eventOutput.emit('CreditClose');
        }.bind(this));

        this.rectangle.add(this.cardNameMod).add(this.cardName);
        this.rectangle.add(this.firstXMod).add(this.firstX);
        this.rectangle.add(this.separatorMod).add(this.separator);
        this.rectangle.add(this.separator2Mod).add(this.separator2);
        this.rectangle.add(this.separator3Mod).add(this.separator3);
        this.rectangle.add(this.cardNumberMod).add(this.cardNumber);
        this.rectangle.add(this.expireLineMod).add(this.expireLine);
        this.rectangle.add(this.cvvLineMod).add(this.cvvLine);
        this.rectangle.add(this.countryLineMod).add(this.countryLine);
        this.rectangle.add(this.zipLineMod).add(this.zipLine);
        this.rectangle.add(this.secondXMod).add(this.secondX);
        this.rectangle.add(this.thirdXMod).add(this.thirdX);
        this.rectangle.add(this.fourthXMod).add(this.fourthX);
        this.bodyBackground.add(this.buttonMod).add(this.buttonSurface);
        this.bodyBackground.add(this.venmoMod).add(this.venmo);
        this.bodyBackground.add(this.rectangleMod).add(this.rectangle);
        this.bodyBackground.add(this.VenmoMessageMod).add(this.VenmoMessage);
        this.layout.content.add(this.bodyBackgroundMod).add(this.bodyBackground);
        
        //email validation is BROKEN NEEDS FIX HERE
        setTimeout(function (){
        console.log("timeout fires");
        $('.email-input').keypress(function (e){
            console.log("keypress fires!")
            var email = this.value;
          if(/^[a-zA-Z_][a-zA-Z0-9._\-+]*@([a-zA-Z0-9_\-]+.)+[a-zA-Z]+$/.test(email)){
            console.log('email is valid');
          }else{
            console.log('email is not valid');
          }
        });
        }, 0);


    };

    //############## -- END OF BODY -- #######################


    function _createListeners() {
    
    }

    //creates pay success module when OK is clicked
   CreditCardView.prototype.paymentSuccess = function() {

    var paymentSuccessWidth = window.innerWidth/2.5;
    var paymentSuccessHeight = window.innerHeight/3.6;

    this.paymentSuccessContainer = new Surface({
        classes: ["payment-success-container"],
        size: [paymentSuccessWidth,paymentSuccessHeight],
        properties: {
            backgroundColor: "blue"
        }
    });

    this.paymentSuccessContainerMod = new Modifier({
        origin: [0.5, 0.4], 
        transform: Transform.translate(0,0,85) 
    });

    this.layout.content.add(this.paymentSuccessContainerMod).add(this.paymentSuccessContainer)

   } 

   CreditCardView.prototype.moveUp = function(){
        this.layoutModifier.setTransform(
            Transform.translate(0, -75, 21),
            this.options.transition
        )
    };

    CreditCardView.prototype.moveDown = function(){
        this.layoutModifier.setTransform(
            Transform.translate(0, window.innerHeight - 75, 21),
            this.options.transition
        )
    };

    module.exports = CreditCardView;
});