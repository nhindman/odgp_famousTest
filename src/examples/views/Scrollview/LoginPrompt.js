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
        _createBackGround.call(this);
        _createBody.call(this);
        _createFooter.call(this);
    }

    LoginPrompt.prototype = Object.create(View.prototype);
    LoginPrompt.prototype.constructor = LoginPrompt;

    LoginPrompt.DEFAULT_OPTIONS = {
        size: [undefined, undefined],
        data: undefined, 
        headerSize: 75, 
        footerSize: 175,
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
            transform: Transform.translate(0, window.innerHeight, 21)
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
            content: '<div>Join</div>', 
            properties: {
                backgroundColor: 'black',
                color: 'white'
            }
        });

        this.closeIcon = new Surface({
            content: '<img width="22.5" src="src/img/white-x.png"/>', 
            origin: [1,0.2],
            size: [true, true]
        });

        this.headerBackground.add(this.closeIcon);
        this.headerMod = new StateModifier({
            transform: Transform.translate(0, 0, 50000)
        });
        this.layout.header.add(this.headerMod).add(this.headerBackground);
    };

    //##################-- END OF HEADER ---#################

    //###################------BODY-----#####################
    function _createBody() {
        this.bodyBackground = new ContainerSurface({
            classes: ["login-prompt-body"],
            size: [undefined, undefined], 
            properties: {
                backgroundColor: 'green',
                color: 'white'
            }
        });

        this.loginMessage = new Surface({
            classes: ["login-prompt-message"], 
            size: [true, true], 
            properties: {
                backgroundColor: "blue"
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

    };

    //############## -- FOOTER -- ######################

    function _createBackGround() {

      this.background = new Surface({
          size:[undefined,undefined],
          properties:{
              backgroundColor:'#40B376'
          }
      });
      this.backgroundMod = new Modifier({
          transform: Transform.translate(0,0,20)
      });

      this.add(this.backgroundMod).add(this.background);
    };

    module.exports = LoginPrompt;
});