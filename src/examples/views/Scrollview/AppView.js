/*globals define*/
define(function(require, exports, module) {
  // choose your test here
  var View = require('famous/core/View');
  var Engine = require("famous/core/Engine");
  var Surface = require('famous/core/Surface');
  var Transform = require('famous/core/Transform');
  var StateModifier = require('famous/modifiers/StateModifier');
  var Scrollview = require("famous/views/Scrollview");
  var ImageSurface = require('famous/surfaces/ImageSurface');
  var ContainerSurface = require('famous/surfaces/ContainerSurface');
  var Easing = require('famous/transitions/Easing');

  // var mainContext = Engine.createContext();

  function AppView() {

    View.apply(this, arguments)

    _createGymScrollview.call(this);
    _createPassSliderview.call(this);
    // _createGymDistanceView.call(this);
  }

  function _createGymScrollview() {
    var gymScrollview = new Scrollview();

    var gymScrollviewModifier = new StateModifier({
        origin: [0.5, 0]
    });

    var backModifier = new StateModifier({
      // positions the background behind the tab surface
      transform: Transform.behind
    });

    var surfaces = [];

    gymScrollview.sequenceFrom(surfaces);

    for (var i = 0, temp; i < this.options.data.length; i++) {
        temp = new Surface({
             content: this.options.data[i],
             size: [640, 150],
             properties: {
                 backgroundColor: "#22514E",
                 lineHeight: "200px",
                 textAlign: "center", 
                 color: "white",
                 fontSize: "20px",
                 zIndex: 1,
                 borderBottom: "1px solid #1C413D"
             }
        });

        temp.pipe(gymScrollview);
        surfaces.push(temp);
    }

    this.add(backModifier).add(gymScrollviewModifier).add(gymScrollview);
  }

  function _createPassSliderview() {

    var passSlider = new View({
      properties: {
        zIndex: 2
      }
    }); 

    var passSliderModifier = new StateModifier({
      origin: [0.5, 1]
    });

    var sizeModifier = new StateModifier({
      size: [640,150]
    });

    this.add(passSliderModifier).add(passSlider);

    var sizeNode = passSlider.add(sizeModifier);

    var passSliderbackground = new Surface({
      properties: {
        backgroundColor: "#CDCED3"
      }
    })

    var backModifier = new StateModifier({
      // positions the background behind the circle surface
      transform: Transform.behind
    });

    sizeNode.add(backModifier).add(passSliderbackground);

    //selector base
    var passSelectorBase = new View({ 
      properties: {
        zIndex: 4
      }
    })

    //positioning within sizenode
    var passSelectorBaseOriginModifier = new StateModifier({
      origin: [0.11, 0.5]
    })

    var passSelectorBaseSizeModifier = new StateModifier({
      size: [90, 90]
    })

    //adding selector base to sizenode
    sizeNode.add(passSelectorBaseOriginModifier).add(passSelectorBase)

    //setting size of selector base
    var passSelectorBaseNode = passSelectorBase.add(passSelectorBaseSizeModifier)

    //adding background color to selector base
    var passSelectorBaseBackground = new Surface ({
      properties: {
        borderRadius: "80px",
        backgroundColor: "#969B98", 
        boxShadow: '0 10px 15px -5px rgba(0, 0, 0, 0.5)', 
        zIndex: 16
      }
    })

    //adding background color to selector front
    var passSelectorFrontBackground = new Surface ({
      properties: {
        borderRadius: "80px", 
        zIndex: 20,
        backgroundImage: "-webkit-radial-gradient(center, circle farthest-corner, #CDCED3 0%, #ACB0AF 100%)",
        border: "solid 1px rgba(0, 0, 0, 0.5)"
      }
    })

    var passSelectorFrontBackgroundModifier = new StateModifier({
      size: [80, 80], 
      origin: [0.5, 0.5]
    })

    //adding pass selector background to main slider parent
    passSelectorBaseNode.add(passSelectorBaseBackground);
    passSelectorBaseNode.add(passSelectorFrontBackgroundModifier).add(passSelectorFrontBackground);

    //creating hidden square behind 1day circle to detect clicks
    var oneDaySensor = new Surface ({
      size: [150, 150], 
      properties: {
        backgroundColor: "#CDCED3", 
        zIndex: 10
      } 
    });

    var oneDaySensorModifier = new StateModifier({
      origin: [0.1, 0.5]
    });

    //creating hidden square behind 4day circle to detect clicks
    var fourDaySensor = new Surface ({
      size: [150, 150], 
      properties: {
        backgroundColor: "#CDCED3", 
        zIndex: 10
      } 
    });

    var fourDaySensorModifier = new StateModifier({
      origin: [0.5, 0.5]
    });

    //creating hidden square behind 1month circle to detect clicks
    var oneMonthSensor = new Surface ({
      size: [150, 150], 
      properties: {
        backgroundColor: "#CDCED3", 
        zIndex: 10
      } 
    });

    var oneMonthSensorModifier = new StateModifier({
      origin: [0.93, 0.5]
    });

    //click function on 1day sensor 
    oneDaySensor.on('click', function(){
      passSelectorBaseOriginModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneDayTextContainerModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      fourDayTextContainerModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneMonthTextContainerModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
    });

    //creating 1day circle
    var oneDayCircle = new Surface({
      size: [25, 25],
      properties: {
        borderRadius: "80px", 
        zIndex: 15, 
        backgroundColor: "#969B98"
      }
    });

    var oneDayCircleOriginModifier = new StateModifier({
      origin: [0.15, 0.5]
    });

    //click function on 1day circle
    oneDayCircle.on('click', function(){
      passSelectorBaseOriginModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneDayTextContainerModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      fourDayTextContainerModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneMonthTextContainerModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
    });

    //click function on 4day sensor for selector 
    fourDaySensor.on('click', function(){
      passSelectorBaseOriginModifier.setTransform(
        Transform.translate(213, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneDayTextContainerModifier.setTransform(
        Transform.translate(0, 23, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      fourDayTextContainerModifier.setTransform(
        Transform.translate(0, -23, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneMonthTextContainerModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
    });

    //creating 4day circle
    var fourDayCircle = new Surface({
      size: [25, 25],
      properties: {
        borderRadius: "80px", 
        zIndex: 15, 
        backgroundColor: "#969B98"
      }
    });

    var fourDayCircleOriginModifier = new StateModifier({
      origin: [0.5, 0.5]
    });

    //click function on 4day circle for selector
    fourDayCircle.on('click', function(){
      passSelectorBaseOriginModifier.setTransform(
        Transform.translate(213, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneDayTextContainerModifier.setTransform(
        Transform.translate(0, 23, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      fourDayTextContainerModifier.setTransform(
        Transform.translate(0, -23, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneMonthTextContainerModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
    });

    //click function on 1month sensor 
    oneMonthSensor.on('click', function(){
      passSelectorBaseOriginModifier.setTransform(
        Transform.translate(425, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneDayTextContainerModifier.setTransform(
        Transform.translate(0, 23, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      fourDayTextContainerModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneMonthTextContainerModifier.setTransform(
        Transform.translate(0, -23, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
    });

    //creating 1month circle
    var oneMonthCircle = new Surface({
      size: [25, 25],
      properties: {
        borderRadius: "80px", 
        zIndex: 15, 
        backgroundColor: "#969B98"
      }
    });

    var oneMonthCircleOriginModifier = new StateModifier({
      origin: [0.85, 0.5]
    });

    //click function on 1month circle
    oneMonthCircle.on('click', function(){
      passSelectorBaseOriginModifier.setTransform(
        Transform.translate(425, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneDayTextContainerModifier.setTransform(
        Transform.translate(0, 23, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      fourDayTextContainerModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneMonthTextContainerModifier.setTransform(
        Transform.translate(0, -23, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
    });

    //creating container for 1day text
    var oneDayTextContainer = new Surface({
      size: [60, 0],
      content: "<br>1-Day</br>", 
      properties: {
        color: "black",
        fontSize: "22px",
        backgroundColor: "#CDCED3", 
        zIndex: 12, 
        // textAlign: "center"
      }
    });

    //setting position of 1day text container
    var oneDayTextContainerModifier = new StateModifier({
      origin: [0.13, -0.15],
    });

    //click function on 1day text container 
    oneDayTextContainer.on('click', function(){
      passSelectorBaseOriginModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneDayTextContainerModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      fourDayTextContainerModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneMonthTextContainerModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
    });

    //creating 4day text container
    var fourDayTextContainer = new Surface({
      size: [60, 0],
      content: "<br>4-Day</br>", 
      properties: {
        color: "black",
        fontSize: "22px",
        backgroundColor: "#CDCED3", 
        zIndex: 12
      }
    })

    //setting position of 4day text container
    var fourDayTextContainerModifier = new StateModifier({
      origin: [0.50, 0],
    });

    //click function on 4day text container
    fourDayTextContainer.on('click', function(){
      passSelectorBaseOriginModifier.setTransform(
        Transform.translate(213, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneDayTextContainerModifier.setTransform(
        Transform.translate(0, 23, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      fourDayTextContainerModifier.setTransform(
        Transform.translate(0, -23, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneMonthTextContainerModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
    });

    //creating 1-month text container
    var oneMonthTextContainer = new Surface({
      size: [85, 0],
      content: "<br>1-Month</br>", 
      properties: {
        color: "black",
        fontSize: "22px",
        backgroundColor: "#CDCED3", 
        zIndex: 12
      }
    });

    //setting position of 1month text container
    var oneMonthTextContainerModifier = new StateModifier({
      origin: [0.88, 0],
    });

    //click function on 1month text container
    oneMonthTextContainer.on('click', function(){
      passSelectorBaseOriginModifier.setTransform(
        Transform.translate(425, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneDayTextContainerModifier.setTransform(
        Transform.translate(0, 23, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      fourDayTextContainerModifier.setTransform(
        Transform.translate(0, 0, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
      oneMonthTextContainerModifier.setTransform(
        Transform.translate(0, -23, 0), 
        { duration : 500, curve: Easing.inExpo }
        );
    });    

    //adding sensors to sizeNode
    sizeNode.add(oneDaySensorModifier).add(oneDaySensor);
    sizeNode.add(fourDaySensorModifier).add(fourDaySensor);
    sizeNode.add(oneMonthSensorModifier).add(oneMonthSensor);

    //adding circles to sizeNode
    sizeNode.add(oneDayCircleOriginModifier).add(oneDayCircle)
    sizeNode.add(fourDayCircleOriginModifier).add(fourDayCircle)
    sizeNode.add(oneMonthCircleOriginModifier).add(oneMonthCircle)

    //adding text containers to sizeNode
    sizeNode.add(oneDayTextContainerModifier).add(oneDayTextContainer);
    sizeNode.add(fourDayTextContainerModifier).add(fourDayTextContainer);
    sizeNode.add(oneMonthTextContainerModifier).add(oneMonthTextContainer);

  };

  AppView.prototype = Object.create(View.prototype);
  AppView.prototype.constructor = AppView;

  AppView.DEFAULT_OPTIONS = {
    size: [640, 150],
    data: undefined
  }

    module.exports = AppView;
});

