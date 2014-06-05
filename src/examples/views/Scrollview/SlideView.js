define(function(require, exports, module) {
    var Surface = require("famous/core/Surface");
    var CanvasSurface = require("famous/surfaces/CanvasSurface");
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
    var Group = require('famous/core/Group');
    var ViewSequence = require('famous/core/ViewSequence');
    var Timer = require('famous/utilities/Timer');
    var GenericSync     = require('famous/inputs/GenericSync');
    var MouseSync       = require('famous/inputs/MouseSync');
    var TouchSync       = require('famous/inputs/TouchSync');
    GenericSync.register({'mouse': MouseSync, 'touch': TouchSync});
    var Transitionable  = require('famous/transitions/Transitionable');

    var OverviewFooter = require('examples/views/Scrollview/OverviewFooter');
    var ConfirmPurchase = require('examples/views/Scrollview/ConfirmPurchaseView');
    var LoginPrompt = require('examples/views/Scrollview/LoginPrompt');
    var MyPass = require('examples/views/Scrollview/MyPass');
//    var Triangle = require('examples/views/Scrollview/Triangle');

  function SlideView(options, data) {
      View.apply(this, arguments);
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
    posThreshold: window.innerHeight-165,
    velThreshold: -0.000001,
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
            backgroundColor:'black'
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
      content: '<img width="22.5" src="src/img/best-arrow.png"/>'
    })

    this.arrowModifier = new Modifier({
      origin: [0, 0.6]
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
//        delete this.confirmPurchaseView;
        this._eventInput.emit('confirmPurchaseBackground clicked')
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
    console.log("data inside SlideView",$(this.options.data.gymName.getContent()).text().split(/[ ]+/).join('+'));
    this.bodySurface = new View({
      classes: ["content-surface"],
      size: [undefined, windowHeight],
      properties: {
        backgroundColor: "red",
        zIndex: 10
      }, 
      color: "white"
    });

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

    _setupPhotoAutoRotate.call(this);

    this.gymNameSurface = new Surface({
      size: [undefined, gymDetailItemHeight],
      classes: ["gym_name_details"],
      content: ['<div id="gym_name_details">',this.options.data.gymName.content,'</div>'].join(''),
      properties: {
        backgroundColor: 'black',
        fontSize: "2em",
        lineHeight: gymDetailItemHeight+'px'
      }
    })

    this.gymNameSurfaceModifier = new Modifier({
      transform: Transform.translate(window.innerWidth/17,thirdWindowHeight,0)
    })

    this.distanceSurface = new Surface({
      size: [true, true],
      classes: ["distance-surface"],
      content: '<span style="float: right;" class="distance-slideview">0.1mi</span>', 
      properties: {
        backgroundColor: 'black',
        fontSize: "85%",
        lineHeight: gymDetailItemHeight+'px'
      }
    });

    this.distanceMod = new Modifier({
      origin: [.939,0.655], 
      transform: Transform.translate(0,0,0)
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

    this.contentMod = new Modifier();
    this.contentNode = new RenderNode();
    this.layout.content.add(this.contentMod).add(this.contentNode);
    this.contentNode.add(this.gymPhotosModifier).add(this.gymPhotos);
    this.contentNode.add(this.gymNameSurfaceModifier).add(this.gymNameSurface);
    this.contentNode.add(this.distanceMod).add(this.distanceSurface);
    this.contentNode.add(this.gymPassModifier).add(this.gymPassContainer);

    //*****line with 1day gym pass *****
    // this.gymPassContainer.add(this.triangleMod).add(this.triangle);
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
        if (this.confirmPurchase) {
          if (!this.loginPrompt){
            this.loginPrompt = new LoginPrompt({
              size: [undefined, undefined]
            });
            this.loginPrompt.pipe(this._eventOutput);
            this.loginPromptMod = new Modifier({
              transform:Transform.translate(0,0,100)
            });
            this.add(this.loginPromptMod).add(this.loginPrompt);
          }
          this._eventOutput.emit('userLogin');
        } else {
          // console.log("buy-now-clicked")
          this.confirmPurchaseView = new ConfirmPurchase({
              data: this.options.data
          });

          this.add(this.confirmPurchaseView);
          this.confirmPurchaseView.moveUp();
          this.confirmPurchase = true;

          //pipe enable clicks from confirmpurchaseview.js to reach slideview.js
          this.confirmPurchaseView.pipe(this._eventOutput);
          this.slideDown();
        }
     }.bind(this));

     //receives click from confirmpurchase background and sends to overviewfooter
     this._eventOutput.on('confirmPurchaseBackground clicked', function(){
       this.confirmPurchase = false;
       delete this.confirmPurchaseView;
       this._eventInput.emit('confirmPurchaseBackground clicked')
     }.bind(this));

     this._eventOutput.on('pass created', function(){
      console.log("pass created")
      this.createPass();
      this.passMoveIn();
     }.bind(this));

     this._eventOutput.on('pass closed', function(){
      console.log("pass closed");
      this.passFadeOut();
      this.loginPromptMod.setTransform(Transform.translate(1000,1000,0));
//      this.detailView
     }.bind(this));

  }

  SlideView.prototype.moveUp = function() {
      this.layoutModifier.setTransform(
        Transform.translate(0,-75,21),
        { duration : 270 }
      );
  };

  SlideView.prototype.moveDown = function(transition) {
      this.layoutModifier.setTransform(
        Transform.translate(0, window.innerHeight, 21),
        transition || { duration : 270 }
      );
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
        margin: 10000,
        clipSize: 15 + window.innerHeight - this.options.headerSize - this.options.footerSize - (thirdWindowHeight+2*gymDetailItemHeight),
        direction:1 // 1 means Y direction
    });

      console.log('bon size', window.innerHeight - this.options.headerSize - this.options.footerSize - (thirdWindowHeight+2*gymDetailItemHeight))

    this.detailScrollviewPos = new Transitionable(thirdWindowHeight+2*gymDetailItemHeight);

    //Use this modifier to positioning the scollview
    this.detailScrollviewMod = new Modifier({
      transform: function() {
        return Transform.translate(0,thirdWindowHeight+2*gymDetailItemHeight-15, 31);
      }.bind(this)
    });
    this.layout.content.add(this.detailScrollviewMod).add(this.detailScrollview);

    this.detailSequence = [];

    this.triangle = new Surface({
      size: [15, 15],
      classes: ["triangle"],
      content: '<img width="20" src="src/img/gray-triangle.png"/>'
    });

    this.detailSequence.push(this.triangle);
    this.addOneDetailSurface([window.innerWidth,true],['<div style="background-color: rgb(236, 240, 241); height: 100%; font-size: 81%" class="hours"><span class="hours-today">Hours Today: 6:00 AM - 10:00PM</span>','<span style="float: right; color: green" class="open-or-closed">Open</span></div>'].join(''));
    // this.addOneDetailSurface([window.innerWidth,true],'<div style="background-color: #CFCFCF; height: 100%; font-size: 81%; box-shadow: rgba(0,0,0,.2); font-weight: bold"><div class="gym-detail1"><img src="src/img/black-dumbell.png"/><img style="padding-bottom: 7px; float: right" class="swimming-con" width="50" src="src/img/swimming.png"/><img style="padding-bottom: 7px; float: right" class="swimming-con" width="50" src="src/img/sauna.png"/></div>');
    this.addOneDetailSurface([window.innerWidth,true],'<div style="background-color: rgb(236, 240, 241); height: 100%; font-size: 81%; box-shadow: rgba(0,0,0,.2); font-weight: bold" class="gym-detail1">A no-B.S. weightlifters gym with loads of space and a friendly staff.</div>');
    var latitude = this.options.data.options.data.gym_latitudes[this.options.data.itemIndex];
    var longitude = this.options.data.options.data.gym_longitudes[this.options.data.itemIndex];
    var mapHeight = Math.round(window.innerHeight/3);
    this.addOneDetailSurface([window.innerWidth,true], '<div style="background-color: rgb(236, 240, 241); height: 100%; font-size: 81%" class="map-header">122 West 23rd Street, btn. 6th and 7th ave.</div>')
    
    //checks to see if user is on iphone
    var iPhoneFlag = false;
        if( navigator.userAgent.match(/iPhone|iPod/) ){
          iPhoneFlag = true;
        }
    //if user is on iphone deep link to google maps native app when google map is clicked    
    if(iPhoneFlag) {
        var googlemap_url = ['comgooglemaps://?center=',latitude,',',longitude,'&zoom=15&markers=color:red%7C',latitude,',',longitude,'&sensor=false'].join('');
        $("#map_link").attr("href", googlemap_url);
    }
    //map
    this.addMapSurface([window.innerWidth,true],['<a href="comgooglemaps://?center=',latitude,',',longitude,'&zoom=15&markers=color:red%7C',latitude,',',longitude,'&sensor=false" id="map_link">','<img id="map-wrapper" src="http://maps.googleapis.com/maps/api/staticmap?&zoom=15&size=',window.innerWidth,'x',mapHeight,'&maptype=roadmap&markers=color:red%7C',latitude,',',longitude,'&sensor=false"/>','</a>'].join(''));
    this.addOneDetailSurface([window.innerWidth,true], '<div style="background-color: rgb(236, 240, 241); height: 30px" class="map-footer"></div>')

    this.detailScrollview.sequenceFrom(this.detailSequence);

    _transitionWhenDetailViewDrag.call(this);

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
          this.detailScrollviewPos.set(Math.max(0, currentPosition + data.delta));
      }.bind(this));

      this.sync.on('end', (function(data) {
          // at the end of the drag event, the scrollview either go to the top or bottom of the layout.content
          var velocity = data.velocity;
          var position = data.clientY;
          if(position > this.options.posThreshold) {
              if(velocity < -this.options.velThreshold) {
                  this.stopScrolling(velocity);
              } else {
                  this.slideDown();
              }
          } else {
              if(velocity > -this.options.velThreshold) {
                  this.slideDown();
              } else {
                  this.stopScrolling(velocity);
              }
          }
      }).bind(this));
  }

  //fades surfaces as detail view is dragged over them
  function _transitionWhenDetailViewDrag(){

      this.contentMod.transformFrom(function(){
          var yPos = Math.max(0,(this.detailScrollviewPos.get() - thirdWindowHeight - 2*gymDetailItemHeight));
          return Transform.translate(0, yPos/2 ,10);
      }.bind(this));

      this.gymNameSurfaceModifier.opacityFrom(function(){
          var originPos = thirdWindowHeight + gymDetailItemHeight;
          var topPos =  thirdWindowHeight + 2*gymDetailItemHeight - (thirdWindowHeight + 2*gymDetailItemHeight - this.detailScrollviewPos.get());
          var move = (originPos - topPos);
          return 1-move/gymDetailItemHeight;
      }.bind(this));

      this.distanceMod.opacityFrom(function(){
          var originPos = thirdWindowHeight + gymDetailItemHeight;
          var topPos =  thirdWindowHeight + 2*gymDetailItemHeight - (thirdWindowHeight + 2*gymDetailItemHeight - this.detailScrollviewPos.get());
          var move = (originPos - topPos);
          return 1-move/gymDetailItemHeight;
      }.bind(this));

      this.gymPassModifier.opacityFrom(function(){
          var originPos = thirdWindowHeight + 2*gymDetailItemHeight;
          var move = (originPos - this.detailScrollviewPos.get());
          return 1-move/gymDetailItemHeight;
      }.bind(this));
  }

  function _setupPhotoAutoRotate(){
      this.photoAutoRotate();
      this.gymPhotos._eventInput.on('start', function(){
          if (this.autoRorateInterval) {
              Timer.clear(this.autoRorateInterval);
              this.autoRorateInterval = undefined;
          }
      }.bind(this));
      this.gymPhotos._eventInput.on('end', function(){
          if (this.autoRorateInterval) return;
          this.photoAutoRotate();
      }.bind(this))
  }

  SlideView.prototype.photoAutoRotate = function(){
      this.autoRorateInterval = Timer.setInterval(function() {
          this.gymPhotos._eventInput.emit('end',{velocity:-0.9})
      }.bind(this), 2000)
  };

  // Bon: Use this method to add detailSurface.
  SlideView.prototype.addOneDetailSurface = function(size,content){
      var detailSurface = new Surface({
          size:size,
          content: content
      });
      detailSurface.getSize = function(){
        return this._size
      };
      detailSurface.pipe(this.detailScrollview);  // pipe the detail surface to scrollview
      detailSurface.pipe(this.sync);   // make detail surface become draggable. In fact we are move the entire scrollview.
      this.detailSequence.push(detailSurface);  // the push method is pushing surface to detailScrollvew.
  };

  SlideView.prototype.addMapSurface = function(size,content){
      var mapSurface = new Surface({
          size:size,
          content: content
      });
      mapSurface.getSize = function(){
        return this._size
      };
      mapSurface.pipe(this.detailScrollview);  // pipe the detail surface to scrollview
      mapSurface.pipe(this.sync);   // make detail surface become draggable. In fact we are move the entire scrollview.
      this.detailSequence.push(mapSurface);  // the push method is pushing surface to detailScrollvew.
      
      //listens for click on map surface
      // mapSurface.on('click', function() {
      //   //direct to google maps
      //   console.log("map surface clicked");
        



      //   // location.href = "maps://maps.google.com/?center=40.765819,-73.975866&zoom=14&views=traffic";
      // });

  };



  SlideView.prototype.createPass = function(data){
    if (this.passView) return 
    this.passView = new MyPass({
      data: this.options.data
    });
    this.passViewMod = new StateModifier({
      transform: Transform.translate(0,-window.innerHeight,500)
    });

    this.add(this.passViewMod).add(this.passView);
    this.passView.pipe(this._eventOutput);
  }

  SlideView.prototype.passMoveIn = function(){
    this.passViewMod.setTransform(Transform.translate(0,0,500));
  }

  SlideView.prototype.passFadeOut = function(transition){
    this.passViewMod.setOpacity(0,transition || {duration: 300},function(){
      this.passViewMod.setTransform(Transform.translate(0,0,0))
    }.bind(this));
  }

  SlideView.prototype.slideUp = function(){
      console.log('up')

      this.detailScrollviewPos.set(0,this.options.transition)
  };

  SlideView.prototype.slideDown = function(){
      console.log('down')
      var d = event.target;
      do{
        if(d.id == 'map-canvas'){
          return;
        }
      }while(d == d.parentNode);
      this.detailScrollviewPos.set(thirdWindowHeight+2*gymDetailItemHeight,this.options.transition);
      this.detailScrollview.setVelocity(-1);
  };

  SlideView.prototype.stopScrolling = function(v){
      console.log('stopScrolling')
      this.detailScrollview._eventInput.emit('end',{velocity:v*0.12});
  };

  module.exports = SlideView;
});