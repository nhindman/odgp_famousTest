define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    var Lightbox = require('famous/views/Lightbox');
    var ImageSurface = require("famous/surfaces/ImageSurface");
    var HeaderFooter = require('famous/views/HeaderFooterLayout');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');

    var OverviewFooter = require('examples/views/Scrollview/OverviewFooter');
    var ConfirmPurchase = require('examples/views/Scrollview/ConfirmPurchaseView');

  function SlideView(options, data) {
      View.apply(this, arguments);

      _createBackGround.call(this);

      _createLayout.call(this);
      _createHeader.call(this);
      _createBody.call(this);
      _createFooter.call(this);
      _setListeners.call(this);

    }

  SlideView.prototype = Object.create(View.prototype);
  SlideView.prototype.constructor = SlideView;

  SlideView.DEFAULT_OPTIONS = {
    size: [undefined, undefined],
    data: undefined, 
    headerSize: 75, 
    footerSize: 50
  }


  //########### --- MAIN LAYOUT --- ########
  function _createLayout() {
    this.layout = new HeaderFooter({
      headerSize: this.options.headerSize,
      footerSize: this.options.footerSize
    })

    this.layoutModifier = new StateModifier({
      align:[0,1],
      transform: Transform.translate(0, 0, 21)
      // transform: Transform.translate(0, 0, 0.1)
    });

    this.layoutBackground = new ContainerSurface({
          classes: ["slideview-container-surface"],
          size:[undefined, windowHeight],
          properties:{
              backgroundColor:'red'
      }

    })

    this.add(this.layoutModifier).add(this.layout);
    // this.layoutBackground.add(this.layout)
  }

  //########### --- MAIN LAYOUT END --- ########

  //########### --- HEADER --- ############

  function _createHeader() {
    this.backgroundSurface = new ContainerSurface({
      classes: ["overview-header"],
      properties: {
        backgroundColor: "black", 
        color: "white"
      }, 
      
    });

    this.backgroundMod = new Modifier({
      transform: Transform.translate(0,0,30)
    });

    this.arrowSurface = new Surface({
      size: [50, 30],
      properties: { 
        textAlign: "center",
        zIndex: 23
      },
      content: '<img width="22.5" src="src/img/goodback.png"/>'
    })

    this.arrowModifier = new Modifier({
      origin: [0, 0.65]
    })

    this.arrowSensor = new Surface({
      size: [50, true],
      properties: { 
        textAlign: "center",
        zIndex: "5"
      },
      content: '<img width="12.5" src="src/img/back_arrow.png"/>'
    })

    this.arrowSensorModifier = new Modifier({
      origin: [0.07, 0.65]
      // align: [0.5, 0.50]
    })

    this.overviewSurface = new Surface({
      properties: {
        backgroundColor: "black", 
        color: "white", 
        zIndex: 23
      }, 
      content: '<div class="overview">Overview</div>',
    });

    this.overviewModifier = new Modifier({
      size: [true, true],
      origin: [0.40, 0.37]
    })

    //emits slide click to DetailView
    this.arrowSurface.on('click', function() {
      this._eventOutput.emit('backButton-clicked');
    }.bind(this));

    this.backgroundModifier = new Modifier({
      size: [undefined, undefined],
      opacity: 0.00001,
      origin: [0, 0],
      align: [0,1],
      transform: Transform.translate(0, 0, 23)
    });

    this.layout.header.add(this.backgroundMod).add(this.backgroundSurface);
    this.backgroundSurface.add(this.overviewModifier).add(this.overviewSurface);    
    this.backgroundSurface.add(this.arrowModifier).add(this.arrowSurface);
  }

  //##################-- END OF HEADER ---#################

  var windowHeight = window.innerHeight
  var thirdWindowHeight = window.innerHeight / 2.5

  //###################------BODY-----#####################
  function _createBody() {
    console.log("price inside SlideView",this.options.data.price.content)
    this.bodySurface = new View({
      classes: ["content-surface"],
      size: [undefined, windowHeight],
      properties: {
        backgroundColor: "red",
        zIndex: 10
      }, 
      color: "white"
    });

    this.gymPhoto = new Surface({
      classes: ["gym-photo-surface"],
      content: '<img width="320" height="'+thirdWindowHeight+'" src="src/img/'+ this.options.data.photo.content + '"/>',
      properties: {
        zIndex: 10
      }
    })

    this.gymPhotoModifier = new Modifier({
      origin: [0, 0],
      transform: Transform.translate(0, 0, 10)
    });

    this.gymNameContainer = new ContainerSurface({
      classes: ["gym_name_details_container"],
      properties: {
        backgroundColor: "black"
      }
    })

    this.gymNameContainerModifier = new Modifier({
      size: [undefined, 63], 
      origin: [0.5, 1.245]
    })


    this.gymNameSurface = new Surface({
      classes: ["gym_name_details"],
      content: '<p id="gym_name_details">' + this.options.data.gymName.content + '</p>',
      properties: {
        fontSize: "2em"
      }
    })

    this.gymNameSurfaceModifier = new Modifier({
      size: [true, true],
      origin: [0.05, 0.9]
    })

    this.gymPassContainer = new ContainerSurface({
      classes: ["gym_pass_details_container"],
      properties: {
        backgroundColor: "black"
      }
    })

    this.gymPassModifier = new Modifier({
      size: [undefined, 63], 
      origin: [0, 1], 
      align: [0, 1.45]
    });

    this.gymPassIcon = new Surface({
      size: [true, true],
      content: '<img width="30" src="src/img/white_pass.png"/>'
    })

    //setting angle for gym pass icon
    var angle = -Math.PI/6;

    this.gymPassIconModifier = new Modifier({
      origin: [0.05, 0.72], 
      //rotating icon slightly
      transform: Transform.rotateZ(angle)
    })

    this.NumDaysSurface = new Surface({
      content: '<p class="num-days-details">1-Day Pass</p>', 
      properties: {
        color: "white"
      }
    });

    this.NumDaysModifier = new Modifier({
      size: [true, true], 
      origin: [0.2, 0.3]
    })

    this.gymPriceSurface = new Surface({
      content: this.options.data.price.content,
      properties: {
        color: "white", 
        fontSize: "30px"
      }
    });

    this.gymPriceModifier = new Modifier({
      size: [true, true], 
      origin: [0.8, 0.3]
    });

    this.gymDescr = new Surface({
      classes: ["gym-details-surface"],
      properties: {
        backgroundColor: "black"
      }
    });

    this.gymDescrModifier = new Modifier({
      size: [undefined, 100],
      origin: [0, 2.7]
    });
    
    this.layout.content.add(this.bodySurface);
    this.bodySurface.add(this.gymPhotoModifier).add(this.gymPhoto);
    this.bodySurface.add(this.gymNameContainerModifier).add(this.gymNameContainer);
    this.bodySurface.add(this.gymNameSurfaceModifier).add(this.gymNameSurface);
    this.bodySurface.add(this.gymPassModifier).add(this.gymPassContainer);
    // this.bodySurface.add(this.gymDescrModifier).add(this.gymDescr);
    // this.layout.content.add(this.gymPhotoModifier).add(this.gymPhoto);
    // this.layout.content.add(this.gymNameContainerModifier).add(this.gymNameContainer);
    // this.layout.content.add(this.gymNameSurfaceModifier).add(this.gymNameSurface);
    // this.layout.content.add(this.gymPassModifier).add(this.gymPassContainer);
    
    // this.layout.content.add(this.gymDescrModifier).add(this.gymDescr);

    //*****line with 1day gym pass *****
    this.gymPassContainer.add(this.gymPassIconModifier).add(this.gymPassIcon);
    this.gymPassContainer.add(this.NumDaysModifier).add(this.NumDaysSurface);
    this.gymPassContainer.add(this.gymPriceModifier).add(this.gymPriceSurface);

  }

  //############## -- END OF BODY -- #######################

  //############## -- FOOTER (in OverviewFooter.js) -- ######################

  function _createFooter(data) {
    this.footerSurface = new OverviewFooter({
      classes: ["footer-surface"],
      data: this.options.data
    }); 

    //this pipe enables clicks from overviewfooter.js to reach slideview.js
    this.footerSurface.pipe(this._eventOutput);

    this.footerModifier = new Modifier();

    this.layout.footer.add(this.footerModifier).add(this.footerSurface);

  }

  //############## -- FOOTER END -- ######################


//############## -- MAIN BACKGROUND SURFACE -- #######################
  function _createBackGround() {

      
  }

//############## -- MAIN BACKGROUND SURFACE END -- #######################

  function _setListeners() {

    //this receives clicks from overfooter
     this._eventOutput.on('buy-now-clicked', function(data){
        console.log("buy-now-clicked")
        this.confirmPurchaseView = new ConfirmPurchase({
            data: this.options.data
        });

        this.add(this.confirmPurchaseView);
        this.confirmPurchaseView.moveUp();
     }.bind(this));
  }

  SlideView.prototype.moveUp = function() {
      this.layoutModifier.setAlign(
        [0,-0.2],
        { duration : 270 }
      );
      // this.backgroundMod.setAlign(
      //   [0,-0.2],
      //   { duration : 270 }
      // );
  };

  SlideView.prototype.moveDown = function() {
      this.layoutModifier.setAlign(
        [0,1.5],
        { duration : 270 }
      );
      // this.backgroundMod.setAlign(
      //   [0,1.5],
      //   { duration : 270 }
      // );
  };

  module.exports = SlideView;
});