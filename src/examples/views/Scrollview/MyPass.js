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
        // console.log("data inside mypass.js", this.options.data)
        // console.log("# of days inside mypass.js", window.gymDays)
        // console.log('total price', $('.right-column').html())
        // console.log('total days', $('.total-passes').html())
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
            transform: Transform.translate(0, window.innerHeight-75, 500000),
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

        this.myPass = new Surface({
            classes: ["mypass-text"],
            content: '<div>My Pass</div>',
            size: [true, true], 
            properties: {
                fontColor: "white",
            }
        });

        this.myPassMod = new StateModifier({
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
        this.headerBackground.add(this.myPassMod).add(this.myPass);
        this.layout.header.add(this.headerMod).add(this.headerBackground);
        
        //click on closeIcon closes the welcomeback page
        this.closeIcon.on('click', function(){
            this._eventOutput.emit('pass closed')
        }.bind(this));

        this.hamburgerSurface.on('click', function(){
            console.log("this.options.data INSIDE HAMBURGER CLICK",this.options.data)
            this._eventOutput.emit('ticketPurchased', this.options.data, this.numPasses)
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

        this.gymName = new Surface({
            classes: ["gym-name-pass-header"], 
            size: [true, true], 
            content: ['<div class"gym-name-header-pass">'+ this.options.data.gymName.content +'</div>','<div class="num-days-header-pass">'+window.gymDays+' Pass</div>'].join(''),
            properties: {
                color: "black",
                fontSize: "22.4px"
            } 
        });

        this.gymNameMod = new StateModifier({
            origin: [.18, .078], 
            transform: Transform.translate(0,0,500)
        });

        this.rightArrow1 = new Surface({
            classes: ["rightArrow1"], 
            content: '<img width="30" src="src/img/right-arrow-black.png"/>', 
            size: [true, true] 
        });

        this.rightArrow1Mod = new StateModifier({
            origin: [.9, .1]
        });
        
        //make special code and # of pass same html string
        
        this.numPasses = $('.total-passes').html();
        this.passOrPasses = null;

        if ($('.total-passes').html() > 1){
            console.log('total passes is greater than 1!!!!!!!!!!');
            this.passOrPasses === 'Passes'
        } else {
            this.passOrPasses === 'Pass'
        }

        this.specialCode = new Surface({
            classes: ["specialCode"], 
            size: [246.5, true], 
            content: '<div class="special-code-pass">Special Code:D7558 <span class="pass-amount-pass">'+this.numPasses+' Pass</span></div>',
            properties: {
                color: "black", 
                fontSize: "78%"
            }
        });

        this.specialCodeMod = new StateModifier({
            origin: [.486,.2425]
        });

        this.circles = new Surface({
            classes: ["ticket-circles"], 
            size: [true, true], 
            content: '<img src="src/img/ticket-circles.png"/>'
        });

        this.circlesMod = new StateModifier({
            origin: [0.5,0.33]
        });

        //make username and price same html string
        this.username = new Surface({
            classes: ["username-pass"], 
            size: [246.5, true], 
            content: ['<div class="username-text-pass">NATE HINDMAN','<span class="total-price-pass">'+$('.right-column').html()+'</span></div>'].join(''),
            properties: {
                color: "black", 
                fontSize: "97%"
            }
        });

        //BONHELP: why is first origin so large
        this.usernameMod = new StateModifier({
            origin: [.486, .33]
        });

        this.gymNameAddress = new Surface({

        });

        this.gymNameAddressMod = new StateModifier({

        });

        this.rightArrow2 = new Surface({
            classes: ["rightArrow2"], 
            content: '<img width="30" src="src/img/right-arrow-black.png"/>', 
            size: [true, true],  
        });

        this.rightArrow2Mod = new StateModifier({
            origin: [.9, .505], 
            transform: Transform.translate(0,0,2000)
        });

        this.locationHeight = window.innerHeight/7;

        // var theGym = this.options.data.gymName.content.html();
        // debugger
        // var theGym = this.options.data.gymName.content.html();
        this.locationSurface = new Surface({
            classes: ["location-surface"], 
            size: [286, this.locationHeight],
            content: ['<div class="gym-name-pass">',this.options.data.gymName.content,'</div>'].join(''),
            properties: {
                backgroundColor: "rgb(245, 250, 232)", 
                color: "black",
                borderBottom: "1px solid rgb(206,207,193)", 
                borderTop: "1px solid rgb(206,207,193)", 
                textAlign: "left"
            }
        });

        this.locationSurfaceMod = new StateModifier({
            origin: [0.5, 0.5]
        });

        this.locationIcon = new Surface({
            classes: ["location-icon"],
            content: '<img width="30" class="location-icon-pass" src="src/img/location.png"/>',  
            size: [true, true]
        });

        this.locationIconMod = new StateModifier({
            origin: [0.09, .495]
        });

        this.bodyBackground.add(this.gymNameMod).add(this.gymName);
        this.bodyBackground.add(this.rightArrow1Mod).add(this.rightArrow1);
        this.bodyBackground.add(this.specialCodeMod).add(this.specialCode);
        this.bodyBackground.add(this.usernameMod).add(this.username);
        this.bodyBackground.add(this.locationSurfaceMod).add(this.locationSurface);
        this.bodyBackground.add(this.locationIconMod).add(this.locationIcon);
        this.bodyBackground.add(this.gymNameAddressMod).add(this.gymNameAddress);
        this.bodyBackground.add(this.rightArrow2Mod).add(this.rightArrow2);

        //#######-- use pass button --#######
        this.buttonWidth = window.innerWidth - (window.innerWidth/5);
        this.buttonHeight = window.innerHeight/12;

        this.buttonSurface = new Surface({
            size: [this.buttonWidth, this.buttonHeight],
            classes: ["use-pass-surface"],
            content: '<div>Use Pass</div>',
            properties: {
                backgroundColor: "black",
                border: "solid 1px white", 
                borderRadius: "5px", 
                color: "white", 
                textAlign: "center",
                lineHeight: this.buttonHeight +'px',
            }
        });

        this.buttonMod = new Modifier({
            origin: [0.5, 0.7],
            transform: Transform.translate(0, 0, 55)
        });

        //#######-- use pass button END --#######

       //#######-- HOW DO I GET IN? --#######
        var howGetInWidth = window.innerWidth/1.4

        this.howGetIn = new Surface({
            classes: ["howGetIn"], 
            size: [true, true], 
            content: '<div class="how-to-get-in">How Do I Get In?</div>',
            properties: { 
                color: "black", 
                textAlign: "center", 
                fontSize: "85%"
            }
        });

        this.howGetInMod = new StateModifier({
            origin: [0.5, 0.8]
        });

        this.howGetIn2 = new Surface({
            classes: ["howGetIn2"], 
            size: [true, true], 
            content: '<div class="how-to-get-in">Once you arrive, click Use Pass and</div>'+'<div class="how-to-get-in">show this screen to a front desk attendant.</div>',
            properties: {
                // backgroundColor: "rgb(214,217,204)", 
                color: "black", 
                textAlign: "center", 
                fontSize: "78%"
            }
        });

        this.howGetIn2Mod = new StateModifier({
            origin: [0.5, 0.88]
        });

        this.buttonSurface.on('click', function(){
            //change languge on button to 'pass used'   
        }.bind(this));



        this.bodyBackground.add(this.ticketBackgroundMod).add(this.ticketBackground);
        this.bodyBackground.add(this.circlesMod).add(this.circles);
        this.bodyBackground.add(this.buttonMod).add(this.buttonSurface);
        this.bodyBackground.add(this.howGetInMod).add(this.howGetIn);
        this.bodyBackground.add(this.howGetIn2Mod).add(this.howGetIn2);
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