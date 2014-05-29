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

    
    function RegisterView(options, data) {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);
        _createListeners.call(this);
    }

    RegisterView.prototype = Object.create(View.prototype);
    RegisterView.prototype.constructor = RegisterView;

    var windowWidth = window.innerWidth;

    RegisterView.DEFAULT_OPTIONS = {
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
            classes: ["register-header"],
            size: [undefined, 75], 
            properties: {
                backgroundColor: 'black',
                color: 'white'
            }
        });

        this.register = new Surface({
            classes: ["join-text"],
            content: '<div>Register</div>',
            size: [true, true], 
            properties: {
                fontColor: "white",
            }
        });

        this.registerMod = new StateModifier({
            origin: [0.5,0.5]
        });

        this.closeIcon = new Surface({
            content: '<img width="43" src="src/img/white-x.png"/>',
            size: [true, true]
        });

        this.closeIconModifier = new StateModifier({
            origin: [0.937,0.66]
        });

        this.headerBackground.add(this.closeIconModifier).add(this.closeIcon);
        this.headerBackground.add(this.registerMod).add(this.register);
        this.layout.header.add(this.headerMod).add(this.headerBackground);
        
        //click on closeIcon closes the register page
        this.closeIcon.on('click', function(){
            this._eventOutput.emit('RegisterClose')
        }.bind(this));    

    };

    //##################-- END OF HEADER ---#################

    //###################------BODY-----#####################
    function _createBody() {
        this.bodyBackground = new ContainerSurface({
            classes: ["register-body"],
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
            classes: ["register-circle"], 
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
            classes: ["register-rectangle"], 
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
            transform: Transform.translate(0,0,62), 
            origin: [0.35, 0.175]
        })

        this.firstX = new Surface({
            content: '<img width="43" src="src/img/red-x.png"/>', 
            properties: {
                backgroundColor: 'white'
            }, 
            size: [50,50]
        })

        this.firstXMod = new Modifier({
            transform: Transform.translate(0,0,70),
            origin: [0.965,0.08]
        })

        this.secondX = new Surface({
            content: '<img width="43" src="src/img/red-x.png"/>', 
            properties: {
                backgroundColor: 'white'
            },
            size: [50,46]
        })

        this.secondXMod = new Modifier({
            transform: Transform.translate(0,0,70),
            origin:[0.965,1]
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
            transform: Transform.translate(0,0,62), 
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
            transform: Transform.translate(0,0,5000),
            origin: [0.5, 0.5]
        })

        //#######-- sign up button --#######
        // this.buttonWidth = window.innerWidth - 20;
        // this.buttonHeight = 60;

        // this.buttonSurface = new ContainerSurface({
        //     size: [this.buttonWidth, this.buttonHeight],
        //     classes: ["signup-button-surface"],
        //     properties: {
        //         backgroundColor: "#3b5998", 
        //         borderRadius: "5px", 
        //         color: "white", 
        //         textAlign: "center",
        //         lineHeight: this.buttonHeight +'px',
        //         zIndex: 36
        //     }
        // });

        this.buttonMod = new Modifier({
            origin: [0.5, 0],
            transform: Transform.translate(0, 0, 55)
        });

        //TERMS AND CONDITIONS
        this.TCMessage = new Surface({
            classes: ["TC-message"], 
            size: [true, true], 
            content: '<div class="T-and-C">Find our T&Cs and Privacy Policy here</div>',
            properties: {
                backgroundColor: "black", 
                color: "white", 
                textAlign: "center"
            }
        });

        this.TCMessageMod = new StateModifier({
            origin: [0.5, 0.7]
        })

        this.rectangle.add(this.emailMod).add(this.email);
        this.rectangle.add(this.firstXMod).add(this.firstX);
        this.rectangle.add(this.separatorMod).add(this.separator);
        this.rectangle.add(this.passwordMod).add(this.password);
        this.rectangle.add(this.secondXMod).add(this.secondX);
        this.bodyBackground.add(this.circleMod).add(this.circle);
        this.bodyBackground.add(this.rectangleMod).add(this.rectangle);
        this.bodyBackground.add(this.TCMessageMod).add(this.TCMessage);
        this.layout.content.add(this.bodyBackgroundMod).add(this.bodyBackground);
        
        setTimeout(function (){
        // $('.email-input').keypress(function (e){
        //    var email = this.value;
        //     if(/^[a-zA-Z_][a-zA-Z0-9._\-+]*@([a-zA-Z0-9_\-]+.)+[a-zA-Z]+$/.test(email)){
                
        //         this.checkContainer = new Surface({
        //             size: [55, 55],
        //             properties: {
        //                 backgroundColor: "white"
        //             }
        //         });

        //         this.checkContainerMod = new Modifier({

        //         });

        //         this.check = new Surface({
        //             content: '<img width="50" src="src/img/check-mark.png"/>'
        //         });

        //         this.checkMod = new Modifier({

        //         });

        //     }else{
        //         console.log('email is not valid');
        //     }
        //     });
        }, 0);
    };

    //############## -- END OF BODY -- #######################


    function _createListeners() {
        // this.register.on('click', function() {
        //     this.registerView = new RegisterView({
        //         size: [undefined, undefined]
        //     });
        //     this.registerView.pipe(this._eventOutput);
        //     this.registerViewMod = new Modifier({
        //         transform: Transform.translate(0,0,100)
        //     });
        //     this.add(this.registerViewMod).add(this.registerView);
        //     this._eventOutput.emit('userRegister');
        // }.bind(this));
    }

   RegisterView.prototype.moveUp = function(){
        this.layoutModifier.setTransform(
            Transform.translate(0, -75, 21),
            this.options.transition
        )
    };

    RegisterView.prototype.moveDown = function(){
        this.layoutModifier.setTransform(
            Transform.translate(0, window.innerHeight - 75, 21),
            this.options.transition
        )
    };

    module.exports = RegisterView;
});