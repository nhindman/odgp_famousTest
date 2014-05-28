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

    function LoginPrompt(options, data) {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);
        _createFooter.call(this);
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
          duration: 300,
          curve: 'easeOut'
        }
    };

    function _createLayout(){
        this.layoutNode = new RenderNode();

        console.log("creating LAYOUT");
        this.layout = new HeaderFooterLayout({
          headerSize: this.options.headerSize,
          footerSize: this.options.footerSize
        });

        this.layoutModifier = new StateModifier({
            transform: Transform.translate(0, -75, 21),
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
            content: '<img width="15.5" src="src/img/white-x.png"/>',
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
            this.layoutModifier.setTransform(
              Transform.translate(0, window.innerHeight, 21),
              { duration : 270 }
            );
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

    //############## -- FOOTER -- ######################

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
            transform: Transform.translate(0, 0, 43)
        });

        this.buttonWidth = window.innerWidth - 20;
        this.buttonHeight = this.options.footerSize - 65;

        this.buttonSurface = new ContainerSurface({
            size: [this.buttonWidth, this.buttonHeight],
            classes: ["FB-button-surface"],
            // content: "<div>Buy Now</div>",
            properties: {
                backgroundColor: "blue", 
                borderRadius: "5px", 
                color: "white", 
                textAlign: "center",
                lineHeight: this.buttonHeight +'px',
                zIndex: 36
            }
        });

        this.buttonMod = new Modifier({
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 5500)
        });

        this.footerBackground.add(this.buttonMod).add(this.buttonSurface);
        this.layout.footer.add(this.footerBackground);
    };

    //############## -- END OF FOOTER -- ######################

    module.exports = LoginPrompt;
});