define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var RenderNode = require("famous/core/RenderNode");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    var HeaderFooterLayout = require('famous/views/HeaderFooterLayout');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');

    
    function WelcomeBackView(options, data) {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);
        _createListeners.call(this);
    }

    WelcomeBackView.prototype = Object.create(View.prototype);
    WelcomeBackView.prototype.constructor = WelcomeBackView;

    var windowWidth = window.innerWidth;

    WelcomeBackView.DEFAULT_OPTIONS = {
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
            transform: Transform.translate(0, window.innerHeight-75, 21),
            size:[window.innerWidth, window.innerHeight]
        });

        this.add(this.layoutModifier).add(this.layoutNode);
        this.layoutNode.add(this.layout);
    }

    //########### --- HEADER --- ############

    function _createHeader(){
        this.headerBackground = new ContainerSurface({
            classes: ["welcomeback-header"],
            size: [undefined, 75], 
            properties: {
                backgroundColor: 'black',
                color: 'white'
            }
        });

        this.arrowSurface = new Surface({
          size: [50, 30],
          properties: { 
            textAlign: "center",
            zIndex: 23
          },
          content: '<img width="22.5" src="src/img/best-arrow.png"/>'
        });

        this.arrowModifier = new Modifier({
          origin: [0, 0.6]
        });

        this.arrowSensor = new Surface({
          size: [50, true],
          properties: { 
            textAlign: "center",
            zIndex: "5"
          }
        });

        this.arrowSensorModifier = new Modifier({
          origin: [0.07, 0.65]
          // align: [0.5, 0.50]
        });

        this.welcomeBack = new Surface({
            classes: ["join-text"],
            content: '<div>Welcome Back</div>',
            size: [true, true], 
            properties: {
                fontColor: "white",
            }
        });

        this.welcomeBackMod = new StateModifier({
            origin: [0.5,0.5]
        });

        this.closeIcon = new Surface({
            content: '<img width="33" src="src/img/white-x.png"/>',
            size: [true, true]
        });

        this.closeIconModifier = new StateModifier({
            origin: [0.937,0.66]
        });

        this.headerBackground.add(this.arrowModifier).add(this.arrowSurface);
        this.headerBackground.add(this.closeIconModifier).add(this.closeIcon);
        this.headerBackground.add(this.welcomeBackMod).add(this.welcomeBack);
        this.layout.header.add(this.headerMod).add(this.headerBackground);
        
        //click on closeIcon closes the welcomeback page
        this.closeIcon.on('click', function(){
            this._eventOutput.emit('WelcomeClose')
        }.bind(this));    

    };

    //##################-- END OF HEADER ---#################

    //###################------BODY-----#####################
    function _createBody() {
        this.bodyBackground = new ContainerSurface({
            classes: ["welcome-body"],
            size: [undefined, undefined], 
            properties: {
                backgroundColor: 'black',
                color: 'white'
            }
        });

        this.bodyBackgroundMod = new Modifier({
            transform: Transform.translate(0,0,60)
        })

        var circleWidth = window.innerWidth/5;
        var circleHeight = window.innerHeight/10;

        this.circle = new ContainerSurface({
            classes: ["welcome-circle"], 
            size: [circleWidth, circleWidth], 
            properties: {
                backgroundColor: "white", 
                borderRadius: "30px"
            }
        })

        this.circleMod = new Modifier({
            transform: Transform.translate(0,0,61), 
            origin: [0.5, 0]
        })

        var rectangleHeight = window.innerHeight/5.7;
        this.rectangle = new ContainerSurface({
            classes: ["welcome-rectangle"], 
            size: [undefined, rectangleHeight], 
            properties: {
                backgroundColor: "white"
            }
        })

        this.rectangleMod = new Modifier({
            transform: Transform.translate(0,0,61), 
            origin: [0.5, 0.3]
        })
        var emailandpwwidth = window.innerWidth/1.2
        this.email = new Surface({
            classes: ["email"],
            content: '<input class="email-input" placeholder="Email"></input>', 
            size: [emailandpwwidth, rectangleHeight/2.8], 
            properties: {
                backgroundColor: "white", 
                color: "black", 
                textAlign: "left"
            }   
        });



        this.emailMod = new Modifier({
            transform: Transform.translate(0,0,100000), 
            origin: [0.35, 0.175]
        })

        this.firstX = new Surface({
            content: '<img width="33" src="src/img/red-x.png"/>', 
            properties: {
                backgroundColor: 'white'
            }, 
            size: [50,50]
        })

        this.firstXMod = new Modifier({
            transform: Transform.translate(0,0,100001),
            origin: [0.99,0.08]
        })

        this.secondX = new Surface({
            content: '<img width="33" src="src/img/red-x.png"/>', 
            properties: {
                backgroundColor: 'white'
            },
            size: [50,46]
        })

        this.secondXMod = new Modifier({
            transform: Transform.translate(0,0,1000000),
            origin:[0.99,1]
        })

        this.password = new Surface({
            classes: ["password"],
            content: '<input class="password-input" placeholder="Password"></input>',
            size: [emailandpwwidth, rectangleHeight/2.8], 
            properties: {
                backgroundColor: "white", 
                color: "black", 
                textAlign: "left"
            }
        })

        this.passwordMod = new Modifier({
            transform: Transform.translate(0,0,100000), 
            origin: [0.35, .825]
        })

        this.separator = new Surface({
            classes: ["input-separator"], 
            size: [emailandpwwidth, .5], 
            properties: {
                backgroundColor: "rgb(201,201,201)" 
            }
        })

        this.separatorMod = new Modifier({
            transform: Transform.translate(0,0,100001),
            origin: [0.5, 0.5]
        })

        //#######-- sign up button --#######
        this.buttonWidth = window.innerWidth - (window.innerWidth/6.5);
        this.buttonHeight = window.innerHeight/12;

        this.buttonSurface = new Surface({
            size: [this.buttonWidth, this.buttonHeight],
            classes: ["signup-button-surface"],
            content: '<div>Sign In</div>',
            properties: {
                border: "solid 1px white", 
                borderRadius: "5px", 
                color: "white", 
                textAlign: "center",
                lineHeight: this.buttonHeight +'px',
            }
        });

        this.buttonMod = new Modifier({
            origin: [0.5, 0.52],
            transform: Transform.translate(0,0,100001)
        });

        this.buttonSurface.on('click', function(){
            console.log("user clicks register button");
            this._eventOutput.emit('validated user from welcome back');    
        }.bind(this));

        //TERMS AND CONDITIONS
        this.TCMessage = new Surface({
            classes: ["TC-message"], 
            size: [true, true], 
            content: '<div class="forgot-password"><u>Forgot Password?</u></div>',
            properties: {
                backgroundColor: "black", 
                color: "white", 
                textAlign: "center", 
                fontSize: "81%"
            }
        });

        this.TCMessageMod = new StateModifier({
            origin: [0.5, 0.63],
            transform: Transform.translate(0,0,100001)
        });

        this.arrowSurface.on('click', function() {
            console.log('arrow surface clicked')
            this._eventOutput.emit('WelcomeBack');
        }.bind(this));

        this.rectangle.add(this.emailMod).add(this.email);
        this.rectangle.add(this.firstXMod).add(this.firstX);
        this.rectangle.add(this.separatorMod).add(this.separator);
        this.rectangle.add(this.passwordMod).add(this.password);
        this.rectangle.add(this.secondXMod).add(this.secondX);
        this.bodyBackground.add(this.buttonMod).add(this.buttonSurface);
        this.bodyBackground.add(this.circleMod).add(this.circle);
        this.bodyBackground.add(this.rectangleMod).add(this.rectangle);
        this.bodyBackground.add(this.TCMessageMod).add(this.TCMessage);
        this.layout.content.add(this.bodyBackgroundMod).add(this.bodyBackground);
        
        //email validation is BROKEN NEEDS FIX HERE
        setTimeout(function (){
        console.log("timeout fires");
        $('.email-input').keydown(function (e){
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

   WelcomeBackView.prototype.moveUp = function(){
        this.layoutModifier.setTransform(
            Transform.translate(0, -75, 21),
            this.options.transition
        )
    };

    WelcomeBackView.prototype.moveDown = function(){
        this.layoutModifier.setTransform(
            Transform.translate(0, window.innerHeight - 75, 21),
            this.options.transition
        )
    };

    module.exports = WelcomeBackView;
});