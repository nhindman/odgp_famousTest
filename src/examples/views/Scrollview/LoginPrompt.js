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

    var RegisterView = require('examples/views/Scrollview/RegisterView');
    var WelcomeBackView = require('examples/views/Scrollview/WelcomeBackView');
    var CreditCardView = require('examples/views/Scrollview/CreditCardView');

    function LoginPrompt(options, data) {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);
        _createFooter.call(this);
        _createListeners.call(this);
    }

    LoginPrompt.prototype = Object.create(View.prototype);
    LoginPrompt.prototype.constructor = LoginPrompt;

    var windowWidth = window.innerWidth;

    LoginPrompt.DEFAULT_OPTIONS = {
        size: [windowWidth, undefined],
        data: undefined, 
        headerSize: 75, 
        footerSize: 100,
        posThreshold: window.innerHeight/2.2,
        velThreshold: 0.75,
        transition: {
          duration: 270
        },
        registerViewTransition:{
          duration:270
        },
        welcomeBackViewTransition:{
          duration:270  
        }, 
        creditCardViewTransition:{
          duration:270  
        },
    };

    function _createLayout(){
        this.layoutNode = new RenderNode();

        console.log("creating LAYOUT");
        this.layout = new HeaderFooterLayout({
          headerSize: this.options.headerSize,
          footerSize: this.options.footerSize
        });

        this.layoutModifier = new StateModifier({
            transform: Transform.translate(0, window.innerHeight-75, 21),
            size:[window.innerWidth, window.innerHeight]
            // transform: Transform.translate(0, 0, 0.1)
        });

        this.add(this.layoutModifier).add(this.layoutNode);
        this.layoutNode.add(this.layout);
    }

    //########### --- HEADER --- ############

    function _createHeader(){
        console.log("creating HEADER");
        this.headerBackground = new ContainerSurface({
            classes: ["login-prompt-header"],
            size: [undefined, 75], 
            properties: {
                backgroundColor: 'black',
                color: 'white'
            }
        });

        this.join = new Surface({
            classes: ["join-text"],
            content: '<div>Join</div>',
            size: [true, true], 
            properties: {
                fontColor: "white",
            }
        })

        this.joinMod = new StateModifier({
            origin: [0.5,0.5]
        })

        this.closeIcon = new Surface({
            content: '<img width="33" src="src/img/white-x.png"/>',
            size: [true, true]
        });

        this.closeIconModifier = new StateModifier({
            origin: [0.95,0.55]
        });

        this.headerBackground.add(this.closeIconModifier).add(this.closeIcon);
        this.headerBackground.add(this.joinMod).add(this.join);
        this.layout.header.add(this.headerMod).add(this.headerBackground);
        
        //click on closeIcon closes the longinprompt page
        this.closeIcon.on('click', function(){
            console.log("closing time", this.layout)
            this._eventOutput.emit('closeLogin')
        }.bind(this));    

    };

    //##################-- END OF HEADER ---#################

    //###################------BODY-----#####################
    function _createBody() {
        this.bodyBackground = new ContainerSurface({
            classes: ["login-prompt-body"],
            size: [undefined, undefined], 
            properties: {
                backgroundColor: 'black',
                color: 'white'
            }
        });

        this.loginMessage = new Surface({
            classes: ["login-prompt-message"], 
            size: [true, true], 
            content: '<div class="make-most">Make The Most Of Today</div>'+'<div class="log-in-prompt-line-2">We love that you wanna workout.</div>'+'<div class="log-in-prompt-line-3">Just one thing…tell us who you are first.</div>',
            properties: {
                backgroundColor: "black", 
                color: "white", 
                textAlign: "center"
            }
        });

        this.loginMessageMod = new StateModifier({
            origin: [0.5, 0.5]
        })

        this.bodyBackground.add(this.loginMessageMod).add(this.loginMessage);
        this.layout.content.add(this.bodyBackground);
    };


    //############## -- END OF BODY -- #######################

    //############## -- FOOTER w/ FB button etc -- ######################

    function _createFooter() {
        this.footerBackground = new ContainerSurface({
            classes: ["login-prompt-footer"],
            size: [undefined, this.options.footerSize], 
            properties: {
                backgroundColor: 'black',
                color: 'white'
            }
        });

        var footerBackgroundMod = new StateModifier({
            transform: Transform.translate(0, 0, 0)
        });

        this.buttonWidth = window.innerWidth - 20;
        this.buttonHeight = this.options.footerSize - 43;

        this.buttonSurface = new ContainerSurface({
            size: [this.buttonWidth, this.buttonHeight],
            classes: ["FB-button-surface"],
            properties: {
                backgroundColor: "#3b5998", 
                borderRadius: "5px", 
                color: "white", 
                textAlign: "center",
                lineHeight: this.buttonHeight +'px',
                zIndex: 36
            }
        });

        this.buttonMod = new Modifier({
            origin: [0.5, 0],
            transform: Transform.translate(0, 0, 55)
        });

        this.loginFacebook = new Surface({
            size: [true, true], 
            classes: ["FB-language"], 
            content: '<div>Login With Facebook</div>',
            properties: {
                textAlign: "center", 
                color: "white", 
                fontSize: "81%"
            }
        });

        this.loginFacebookMod = new StateModifier({
            origin: [0.5, 0.5], 
            transform: Transform.translate(0, 0, 56)
        });

        this.fbLogo = new Surface({
            size: [true, 35], 
            content: '<img width="30" src="src/img/FB-logo.png"/>',
        });

        this.fbLogoMod = new StateModifier({
            origin: [.1, .36], 
            transform: Transform.translate(0, 0, 56)
        });

        this.separator = new Surface({
            classes: ["separator"],
            size: [3, 11],
            properties: {
                backgroundColor: "white"
            }
        });

        this.separatorMod = new Modifier({
            origin: [0.5,0.82], 
            transform: Transform.translate(0, 0, 56)
        }); 

        this.register = new Surface({
            size: [true, true],
            content: '<span class="register_using">Register Using</span>'+'<span class="email"> Email</span>', 
            properties: {
                fontSize: "81%", 
                textAlign: "center"
            }
        });

        this.registerMod = new StateModifier({
            origin: [0.1, 0.88], 
            transform: Transform.translate(0,0,100)
        });

        this.alreadyMem = new Surface({
            classes: ["already-mem"],
            size: [true, true], 
            content: '<span class="register_using">Already A</span>'+'<span class="email"> Member</span>',
            properties: {
                fontSize: "81%", 
                textAlign: "center"
            }
        });

        this.alreadyMod = new StateModifier({
            origin: [0.9, 0.88], 
            transform: Transform.translate(0,0,100)
        });

        //adding to button surface and adding button to footer 
        this.buttonSurface.add(this.fbLogoMod).add(this.fbLogo);
        this.buttonSurface.add(this.loginFacebookMod).add(this.loginFacebook);
        this.footerBackground.add(this.registerMod).add(this.register);
        this.footerBackground.add(this.alreadyMod).add(this.alreadyMem);
        this.footerBackground.add(this.separatorMod).add(this.separator);
        this.footerBackground.add(this.buttonMod).add(this.buttonSurface);
        this.layout.footer.add(this.footerBackground);
    };

    //############## -- END OF FOOTER -- ######################

    function _createListeners() {

        this.register.on('click', function() {
            if (!this.registerView){
              this.createRegisterView();
            }
            this.registerViewMoveIn();
        }.bind(this));

        //####listens for events sent from register view###
        this._eventOutput.on('RegisterClose',function(){
            this.registerViewFadeOut();
            this._eventOutput.emit('closeLogin', {duration:0});
        }.bind(this));



        //listen: user closes credit card page    
        this._eventOutput.on('CreditClose',function(){
            this.creditCardViewFadeOut();
            this._eventOutput.emit('closeLogin', {duration:0});
        }.bind(this));

        this._eventOutput.on('RegisterBack',function(){
            this.registerViewMoveOut();
        }.bind(this));

        this._eventOutput.on('validated user from welcome back',function(){
            if (!this.creditCardView){
            this.createCreditCardView();
            }
            this.welcomeBackViewMoveLeft();
            this.creditCardViewMoveIn();

        }.bind(this));

        this._eventOutput.on('validated user from register',function(){
            if (!this.creditCardView){
            this.createCreditCardView();
            }
            this.registerViewMoveLeft();
            // this.welcomeBackViewMoveLeft();
            this.creditCardViewMoveIn();

        }.bind(this));
        //#######

        this.alreadyMem.on('click', function() {
            console.log("already mem clicked");
            if (!this.welcomeBackView){
              this.createWelcomeBackView();
            }
            this.welcomeBackViewMoveIn();
        }.bind(this));

        //####listens for events sent from welcome back view ####
        this._eventOutput.on('WelcomeClose',function(){
            this.welcomeBackViewFadeOut();
            this._eventOutput.emit('closeLogin', {duration:0});
        }.bind(this));

        this._eventOutput.on('WelcomeBack',function(){
            this.welcomeBackViewMoveOut();
        }.bind(this));
        //########

        //listen for user validation from register view or welcome back view
        // this._eventOutput.on('validated user',function(){
        //     // if (!this.creditCardView){
        //     this.createCreditCardView();
        //     // }
        //     this.creditCardViewMoveIn();
        // }.bind(this));

        //######

    }

    //functions for credit card view
    LoginPrompt.prototype.createCreditCardView = function(){
        this.creditCardView = new CreditCardView({
            size: [undefined, undefined]
        });
        this.creditCardView.pipe(this._eventOutput);
        this.creditCardViewMod = new StateModifier({
            transform: Transform.translate(window.innerWidth,0,100)
        });
        this.add(this.creditCardViewMod).add(this.creditCardView);   
    }

    LoginPrompt.prototype.creditCardViewMoveIn = function(){
        this.creditCardViewMod.setOpacity(1);
        this.creditCardViewMod.setTransform(Transform.translate(0,0,100), this.options.creditCardViewTransition);
    };

    LoginPrompt.prototype.creditCardViewFadeOut = function(){
        this.creditCardViewMod.setTransform(Transform.translate(0,-window.innerHeight,0));
        this.creditCardViewMod.setOpacity(0, this.options.creditCardViewTransition, this.creditCardViewMoveOut.bind(this));
    };
    LoginPrompt.prototype.creditCardViewFadeOut = function(){
        this.creditCardViewMod.setTransform(Transform.translate(0,-window.innerHeight,0),{duration:0},
            function(){
                this.creditCardViewMod.setOpacity(0, this.options.creditCardViewTransition, this.creditCardViewMoveOut.bind(this))
            }.bind(this)
        );
    };

    LoginPrompt.prototype.creditCardViewMoveOut = function(){
        this.creditCardViewMod.setTransform(Transform.translate(window.innerWidth,0,100), this.options.creditCardViewTransition);
    };

    //functions for register view

    LoginPrompt.prototype.createRegisterView = function(){
        this.registerView = new RegisterView({
            size: [undefined, undefined]
        });
        this.registerView.pipe(this._eventOutput);
        this.registerViewMod = new StateModifier({
            transform: Transform.translate(window.innerWidth,0,100)
        });
        this.add(this.registerViewMod).add(this.registerView);
    };

    LoginPrompt.prototype.registerViewMoveIn = function(){
        this.registerViewMod.setOpacity(1);
        this.registerViewMod.setTransform(Transform.translate(0,0,100), this.options.registerViewTransition);
    };

    LoginPrompt.prototype.registerViewFadeOut = function(){
        this.registerViewMod.setTransform(Transform.translate(0,-window.innerHeight,0));
        this.registerViewMod.setOpacity(0, this.options.registerViewTransition, this.registerViewMoveOut.bind(this));
    };
    LoginPrompt.prototype.registerViewFadeOut = function(){
        this.registerViewMod.setTransform(Transform.translate(0,-window.innerHeight,0),{duration:0},
            function(){
                this.registerViewMod.setOpacity(0, this.options.registerViewTransition, this.registerViewMoveOut.bind(this))
            }.bind(this)
        );
    };

    LoginPrompt.prototype.registerViewMoveOut = function(){
        this.registerViewMod.setTransform(Transform.translate(window.innerWidth,0,100), this.options.registerViewTransition);
    };

    LoginPrompt.prototype.registerViewMoveLeft = function(){
        this.registerViewMod.setTransform(Transform.translate(-window.innerWidth,0,100), this.options.registerViewTransition);
    }

    //welcome back view functions 

    LoginPrompt.prototype.createWelcomeBackView = function(){
        console.log("welcome back view created");
        this.welcomeBackView = new WelcomeBackView({
            size: [undefined, undefined]
        });
        this.welcomeBackView.pipe(this._eventOutput);
        this.welcomeBackViewMod = new StateModifier({
            transform: Transform.translate(window.innerWidth,0,100)
        });
        this.add(this.welcomeBackViewMod).add(this.welcomeBackView);
    };

    LoginPrompt.prototype.welcomeBackViewMoveIn = function(){
        console.log("welcome back view move in");
        this.welcomeBackViewMod.setOpacity(1);
        this.welcomeBackViewMod.setTransform(Transform.translate(0,0,100), this.options.welcomeBackViewTransition);
    };

    LoginPrompt.prototype.welcomeBackViewFadeOut = function(){
        console.log('welcomeBackViewFadeOut fired1')
        this.welcomeBackViewMod.setTransform(Transform.translate(0,-window.innerHeight,0));
        this.welcomeBackViewMod.setOpacity(0, this.options.welcomeBackViewTransition, this.welcomeBackViewMoveOut.bind(this));
    };
    LoginPrompt.prototype.welcomeBackViewFadeOut = function(){
        this.welcomeBackViewMod.setTransform(Transform.translate(0,-window.innerHeight,0),{duration:0},
            function(){
                this.welcomeBackViewMod.setOpacity(0, this.options.welcomeBackViewTransition, this.welcomeBackViewMoveOut.bind(this))
            }.bind(this)
        );
    };

    LoginPrompt.prototype.welcomeBackViewMoveOut = function(){
        this.welcomeBackViewMod.setTransform(Transform.translate(window.innerWidth,0,100), this.options.welcomeBackViewTransition);
    };

    LoginPrompt.prototype.welcomeBackViewMoveLeft = function(){
        this.welcomeBackViewMod.setTransform(Transform.translate(-window.innerWidth,0,100), this.options.welcomeBackViewTransition);
    }

    LoginPrompt.prototype.moveUp = function(){
        this.layoutModifier.setTransform(
            Transform.translate(0, -75, 21),
            this.options.transition
        )
    };

    LoginPrompt.prototype.moveDown = function(){
        this.layoutModifier.setTransform(
            Transform.translate(0, window.innerHeight - 75, 21),
            this.options.transition
        )
    };

    module.exports = LoginPrompt;
});