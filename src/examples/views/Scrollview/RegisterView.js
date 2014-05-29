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
            content: '<img width="15.5" src="src/img/white-x.png"/>',
            size: [true, true]
        });

        this.closeIconModifier = new StateModifier({
            origin: [0.95,0.55]
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

        var rectangleHeight = window.innerHeight/5.9;
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

        this.email = new Surface({
            classes: ["password"], 
            size: [undefined, rectangleHeight], 
            properties: {
                backgroundColor: "white"
            }
        })

        this.emailMod = new Modifier({
            transform: Transform.translate(0,0,61), 
            origin: [0.5, 0.3]
        })

        this.password = new ContainerSurface({
            classes: ["register-rectangle"], 
            size: [undefined, rectangleHeight], 
            properties: {
                backgroundColor: "white"
            }
        })

        this.passwordMod = new Modifier({
            transform: Transform.translate(0,0,61), 
            origin: [0.5, 0.3]
        })


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

        this.bodyBackground.add(this.circleMod).add(this.circle);
        this.bodyBackground.add(this.rectangleMod).add(this.rectangle);
        this.bodyBackground.add(this.TCMessageMod).add(this.TCMessage);
        this.layout.content.add(this.bodyBackgroundMod).add(this.bodyBackground);
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