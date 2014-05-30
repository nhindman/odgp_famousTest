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

    
    function MyPass(options, data) {
        View.apply(this, arguments);

        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);
        _createListeners.call(this);
    }

    MyPass.prototype = Object.create(View.prototype);
    MyPass.prototype.constructor = MyPass;

    var windowWidth = window.innerWidth;

    MyPass.DEFAULT_OPTIONS = {
        size: [windowWidth, undefined],
        data: undefined, 
        headerSize: 55,
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
            transform: Transform.translate(0, window.innerHeight-75, 2100),
            size:[window.innerWidth, window.innerHeight]
        });

        this.add(this.layoutModifier).add(this.layoutNode);
        this.layoutNode.add(this.layout);
    }

    //########### --- HEADER --- ############

    function _createHeader(){
        this.headerBackground = new ContainerSurface({
            classes: ["mypass-header"],
            size: [undefined, 55], 
            properties: {
                backgroundColor: 'rgb(214,217,204)',
                color: 'black'
                // borderBottom: 'solid 1px black'
            }
        });

        this.hamburgerSurface = new Surface({
          size: [true, true],
          properties: { 
            textAlign: "center",
            zIndex: 23
          },
          content: '<img width="18.5" src="src/img/good-hamburger.png"/>'
        });

        this.hamburgerModifier = new Modifier({
          origin: [.06, 0.695]
        });

        this.hamburgerSensor = new Surface({
          size: [50, true],
          properties: { 
            textAlign: "center",
            zIndex: "5"
          }
        });

        this.hamburgerSensorModifier = new Modifier({
          origin: [0.07, 0.65]
          // align: [0.5, 0.50]
        });

        this.welcomeBack = new Surface({
            classes: ["mypass-text"],
            content: '<div>My Pass</div>',
            size: [true, true], 
            properties: {
                fontColor: "white",
            }
        });

        this.welcomeBackMod = new StateModifier({
            origin: [0.5,0.5]
        });

        this.closeIcon = new Surface({
            content: '<img width="33" src="src/img/black-x.png"/>',
            size: [true, true]
        });

        this.closeIconModifier = new StateModifier({
            origin: [0.967,0.71]
        });

        this.headerBackground.add(this.hamburgerModifier).add(this.hamburgerSurface);
        this.headerBackground.add(this.closeIconModifier).add(this.closeIcon);
        this.headerBackground.add(this.welcomeBackMod).add(this.welcomeBack);
        this.layout.header.add(this.headerMod).add(this.headerBackground);
        
        //click on closeIcon closes the welcomeback page
        this.closeIcon.on('click', function(){
            this._eventOutput.emit('pass closed')
        }.bind(this));

        this.hamburgerSurface.on('click', function(){
            this._eventOutput.emit('ticketPurchased')
        }.bind(this));

    };

    //##################-- END OF HEADER ---#################

    //###################------BODY-----#####################
    function _createBody() {
        this.bodyBackground = new ContainerSurface({
            classes: ["mypass-body"],
            size: [undefined, undefined], 
            properties: {
                backgroundColor: 'rgb(214,217,204)',
                color: 'white'
            }
        });

        this.bodyBackgroundMod = new Modifier({
            transform: Transform.translate(0,0,60)
        });

        this.ticketBackground = new Surface({
            classes: ["ticket-background"], 
            size: [true, undefined], 
            content: '<img src="src/img/ticket-background.png"/>', 
        });

        this.ticketBackgroundMod = new StateModifier({
            origin: [0.5,0.5]
        });

        this.circles = new Surface({
            classes: ["ticket-circles"], 
            size: [true, true], 
            content: '<img src="src/img/ticket-circles.png"/>'
        });

        this.circlesMod = new StateModifier({
            origin: [0.5,0.3]
        });

        this.bodyBackground.add(this.circlesMod).add(this.circles);
        this.bodyBackground.add(this.ticketBackgroundMod).add(this.ticketBackground);
        this.layout.content.add(this.bodyBackgroundMod).add(this.bodyBackground);

    };

    //############## -- END OF BODY -- #######################


    function _createListeners() {

    }

   MyPass.prototype.moveUp = function(){
        this.layoutModifier.setTransform(
            Transform.translate(0, -75, 21),
            this.options.transition
        )
    };

    MyPass.prototype.moveDown = function(){
        this.layoutModifier.setTransform(
            Transform.translate(0, window.innerHeight - 75, 21),
            this.options.transition
        )
    };

    module.exports = MyPass;
});