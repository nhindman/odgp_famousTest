define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var RenderNode = require("famous/core/RenderNode");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Easing = require('famous/transitions/Easing');
    var Lightbox = require('famous/views/Lightbox');
    var ImageSurface = require("famous/surfaces/ImageSurface");
    var HeaderFooter = require('famous/views/HeaderFooterLayout');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Scrollview = require("famous/views/Scrollview");
    var ViewSequence = require('famous/core/ViewSequence');
    var GenericSync     = require('famous/inputs/GenericSync');
    var MouseSync       = require('famous/inputs/MouseSync');
    var TouchSync       = require('famous/inputs/TouchSync');
    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});
    var Transitionable  = require('famous/transitions/Transitionable');

    var OverviewFooter = require('examples/views/Scrollview/OverviewFooter');
    var ConfirmPurchase = require('examples/views/Scrollview/ConfirmPurchaseView');
//    var Triangle = require('examples/views/Scrollview/Triangle');

  function SlideView(options, data) {
      View.apply(this, arguments);
        window.bon= this
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
    footerSize: 63,
    posThreshold: window.innerHeight/2.2,
    velThreshold: 0.75,
    transition: {
      duration: 300,
      curve: 'easeOut'
    }
  };

  //########### --- MAIN LAYOUT --- ##########
  function _createLayout() {

    this.layoutNode = new RenderNode();

    this.slideViewBackground = new Surface({
        size:[undefined,window.innerHeight],
        properties:{
            backgroundColor:'red'
        }
    });

    this.layout = new HeaderFooter({
      headerSize: this.options.headerSize,
      footerSize: this.options.footerSize
    });

    this.layoutModifier = new StateModifier({
      transform: Transform.translate(0, window.innerHeight, 21)
      // transform: Transform.translate(0, 0, 0.1)
    });

    this.add(this.layoutModifier).add(this.layoutNode);
    this.layoutNode.add(this.layout);
    this.layoutNode.add(this.slideViewBackground)
  }

  //########### --- MAIN LAYOUT END --- ########

  //########### --- HEADER --- ############

  function _createHeader() {
    this.headerBackgroundSurface = new ContainerSurface({
      classes: ["overview-header"],
      size:[undefined,75],
      properties: {
        backgroundColor: "black", 
        color: "white"
      }
      
    });

    this.headerBackgroundSurfaceMod = new Modifier({
        transform:Transform.translate(0,0,40)
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
      }
    })

    this.arrowSensorModifier = new Modifier({
      origin: [0.07, 0.65]
      // align: [0.5, 0.50]
    })

    this.overviewSurface = new Surface({
      size: [true, true],
      properties: {
        backgroundColor: "black", 
        color: "white", 
        zIndex: 23
      }, 
      content: '<div class="overview">Overview</div>'
    });

    this.overviewModifier = new Modifier({
      origin: [0.5, 0.5]
    });

    //emits slide click to DetailView
    this.arrowSurface.on('click', function() {
      if (this.confirmPurchase){
        this.confirmPurchaseView.moveDown();
        this.confirmPurchase = false;
      } else {
        this.detailSequence.splice(0,this.detailSequence.length);
        this._eventOutput.emit('backButton-clicked');
      } 
    }.bind(this));


    this.layout.header.add(this.headerBackgroundSurfaceMod).add(this.headerBackgroundSurface);
    this.headerBackgroundSurface.add(this.overviewModifier).add(this.overviewSurface);
    this.headerBackgroundSurface.add(this.arrowModifier).add(this.arrowSurface);
  }

  //##################-- END OF HEADER ---#################

  var windowHeight = window.innerHeight;
  var thirdWindowHeight = window.innerHeight / 2.5;
  var gymDetailItemHeight = 63;
  var gymPassIconSize = 30;
  var gymPassIconPaddingLeft = 5;
  var gymPassIconPaddingRight = 15;
  var gymPassPriceSize = 55;
  var gymPassPricePaddingRight = 5;


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

    console.log("this.options.data.photo.content", this.options.data.photo.content);

    //######### -- SCROLLVIEW carousel of gym photos --- ############

    this.gymPhotosModifier = new Modifier({
      transform: Transform.translate(0, 0, 10)
    });

    this.gymPhotos = new Scrollview({
      classes: ["gym-photos-scrollview"],
      size: [undefined, thirdWindowHeight],
      direction: 0,
      margin: window.innerWidth,
      paginated: true
    });



    this.surfaces = [];

    this.viewSequence = new ViewSequence({
      array: this.surfaces,
      loop: true
    });

    this.gymPhotos.sequenceFrom(this.viewSequence)

    for (var i = 0; i < this.options.data.photo.content.length; i++) {

          this.addPhotoSurface('<img width="320" height="'+thirdWindowHeight+'" src="src/img/'+ this.options.data.photo.content[i] + '"/>');

    }

//    this.gymPhotos = new Triangle({src:'src/img/', pics:this.options.data.photo.content});

    this.gymNameSurface = new Surface({
      size: [undefined, gymDetailItemHeight],
      classes: ["gym_name_details"],
      content: '<div id="gym_name_details">' + this.options.data.gymName.content + '</div>',
      properties: {
        backgroundColor: 'black',
        fontSize: "2em",
        lineHeight: gymDetailItemHeight+'px'
      }
    })

    this.gymNameSurfaceModifier = new Modifier({
      transform: Transform.translate(0,thirdWindowHeight,0)
    })

    this.gymPassContainer = new ContainerSurface({
      classes: ["gym_pass_details_container"],
      size: [window.innerWidth, gymDetailItemHeight],
      properties: {
        backgroundColor: "black"
      }
    })

    this.gymPassModifier = new Modifier({
      transform:Transform.translate(0,thirdWindowHeight+gymDetailItemHeight,0)
//      origin: [0, 1],
//      align: [0, 1.45]
    });

    this.gymPassIcon = new Surface({
      size:[gymPassIconSize,true],
      content: '<img width="'+gymPassIconSize+'" src="src/img/white_pass.png"/>'
    })

    //setting angle for gym pass icon
    var angle = -Math.PI/6;

    this.gymPassIconModifier = new Modifier({
      size:[gymPassIconSize,gymPassIconSize],
      //rotating icon slightly
      transform: Transform.thenMove(Transform.rotateZ(angle),[gymPassIconPaddingLeft,gymDetailItemHeight/2-8,0])
    })

    this.NumDaysSurface = new Surface({
      size: [window.innerWidth-gymPassIconPaddingLeft-gymPassIconSize-gymPassPriceSize-gymPassPricePaddingRight, gymDetailItemHeight],
      content: ['<div class="num-days-details">',window.gymDays,' Pass </div>'].join(''),
      properties: {
        color: "white",
        lineHeight: gymDetailItemHeight+'px'
      }
    });

    this.NumDaysModifier = new Modifier({
      origin: [0, 0.5],
      transform: Transform.translate(gymPassIconPaddingLeft+gymPassIconSize+gymPassIconPaddingRight,0,0)
    });

    this.gymPriceSurface = new Surface({
      size: [gymPassPriceSize, true],
      content: this.options.data.price.content,
      properties: {
        color: "white", 
        fontSize: "30px"
      }
    });

    this.gymPriceModifier = new Modifier({
      origin: [1,0.5],
      transform: Transform.translate(-gymPassPricePaddingRight,0,0)
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
    
//    this.layout.content.add(this.bodySurface);
    this.layout.content.add(this.gymPhotosModifier).add(this.gymPhotos);
//    this.bodySurface.add(this.gymNameContainerModifier).add(this.gymNameContainer);
    this.layout.content.add(this.gymNameSurfaceModifier).add(this.gymNameSurface);
    this.layout.content.add(this.gymPassModifier).add(this.gymPassContainer);
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

    this._createDetailView();

  }

  //############## -- END OF BODY -- #######################

  //############## -- FOOTER (in OverviewFooter.js) -- ######################

  function _createFooter(data) {
    this.footerSurface = new OverviewFooter({
      classes: ["footer-surface"],
      data: this.options.data,
      footerSize: this.options.footerSize
    }); 

    //pipe enables clicks from overviewfooter.js to reach slideview.js
    this.footerSurface.pipe(this._eventOutput);

    this._eventInput.pipe(this.footerSurface);

    this.footerModifier = new Modifier();

    this.layout.footer.add(this.footerModifier).add(this.footerSurface);

  }

  //############## -- FOOTER END -- ######################

  function _setListeners() {

    //this receives clicks from overfooter and creates confirmpurchase view
     this._eventOutput.on('buy-now-clicked', function(data){
        console.log("buy-now-clicked")
        this.confirmPurchaseView = new ConfirmPurchase({
            data: this.options.data
        });

        this.add(this.confirmPurchaseView);
        this.confirmPurchaseView.moveUp();
        this.confirmPurchase = true;

        //pipe enable clicks from confirmpurchaseview.js to reach slideview.js
        this.confirmPurchaseView.pipe(this._eventOutput);
     }.bind(this));

     //receives click from confirmpurchase background and sends to overviewfooter
     this._eventOutput.on('confirmPurchaseBackground clicked', function(){
       this.confirmPurchase = false;
       this._eventInput.emit('confirmPurchaseBackground clicked')
     }.bind(this));
  }

  SlideView.prototype.moveUp = function() {
      this.layoutModifier.setTransform(
        Transform.translate(0,-75,21),
        { duration : 270 }
      );
//      this.backgroundMod.setAlign(
//        [0,0],
//        { duration : 270 }
//      );
  };

  SlideView.prototype.moveDown = function() {
      this.layoutModifier.setTransform(
        Transform.translate(0, window.innerHeight, 21),
        { duration : 270 }
      );
//      this.backgroundMod.setAlign(
//        [0,1.5],
//        { duration : 270 }
//      );
  };


  //#### -- ADD PHOTOS TO GYMPHOTO SCROLLVIEW --- #####
  SlideView.prototype.addPhotoSurface = function(content){
      var photoSurface = new Surface({
        content: content
      });
      photoSurface.pipe(this.gymPhotos); // scrolling

      this.surfaces.push(photoSurface);
  };

  SlideView.prototype._createDetailView = function(){

    _detailViewDragEvent.call(this);

    this.detailScrollview = new Scrollview({
        edgePeriod: 500,
        direction:1 // 1 means Y direction
    });

    this.detailScrollviewPos = new Transitionable(thirdWindowHeight+2*gymDetailItemHeight);

    //Use this modifier to positioning the scollview
    this.detailScrollviewMod = new Modifier({
      transform: function() {
        return Transform.translate(0,this.detailScrollviewPos.get(), 31);
      }.bind(this)
    });
    this.layout.content.add(this.detailScrollviewMod).add(this.detailScrollview);

    this.detailSequence = [];

    this.addOneDetailSurface([undefined,1600],'<div style="background-color: yellow; height: 100%"><img src="http://ewf.sm/img/golds-gym-platinum-home-gym_12472_500.jpg" height="100%">slide up to see the detail</div>');
//    this.addOneDetailSurface([undefined,300],'<div style="background-color: yellow; height: 100%">slide up to see the detail</div>');
//    this.addOneDetailSurface([undefined,300],'<div style="background-color: yellow; height: 100%">slide up to see the detail</div>');

    this.detailScrollview.sequenceFrom(this.detailSequence);

  };

  function _detailViewDragEvent(){
      this.sync = new GenericSync(
          ['touch'],
          {direction : GenericSync.DIRECTION_Y}
      );
      this.sync.on('start', function(data) {
        this.startPos = data.clientY;
      }.bind(this));


      this.sync.on('update', function(data) {
          var currentPosition = this.detailScrollviewPos.get();
          if(currentPosition === 0 && data.velocity > 0) {
          }
          this.detailScrollviewPos.set(Math.max(0,Math.min(thirdWindowHeight+2*gymDetailItemHeight, currentPosition + data.delta/2)));
      }.bind(this));

      this.sync.on('end', (function(data) {
          // at the end of the drag event, the scrollview either go to the top or bottom of the layout.content
          var velocity = data.velocity;
          var position = data.clientY;
          if(position > this.options.posThreshold) {
              if(velocity < -this.options.velThreshold) {
                  this.slideUp();
              } else {
                  this.slideDown();
              }
          } else {
              if(velocity > this.options.velThreshold) {
                  this.slideDown();
              } else {
                  this.slideUp();
              }
          }
      }).bind(this));
  }

  // Bon: Use this method to add detailSurface.
  SlideView.prototype.addOneDetailSurface = function(size,content,className){
      var detailSurface = new Surface({
          size:size,
          content: content,
          classes: [className]
      });
      detailSurface.pipe(this.detailScrollview);  // pipe the detail surface to scrollview
      detailSurface.pipe(this.sync);   // make detail surface become draggable. In fact we are move the entire scrollview.
      this.detailSequence.push(detailSurface);  // the push method is pushing surface to detailScrollvew.
  };

  SlideView.prototype.slideUp = function(){
      console.log('up')
//      this.detailScrollviewPos.set(0,this.options.transition)
  };

  SlideView.prototype.slideDown = function(){
      console.log('down')
      this.detailScrollviewPos.set(thirdWindowHeight+2*gymDetailItemHeight,this.options.transition);
      this.detailScrollview.setVelocity(-1);
  };

  module.exports = SlideView;
});