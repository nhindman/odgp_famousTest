define(function(require, exports, module) {
    var Engine = require("famous/core/Engine");
    var Surface = require("famous/core/Surface");
    var View = require('famous/core/View');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var ViewSwapper = require('famous/views/Lightbox');
    var Scrollview = require("famous/views/Scrollview");
    var GymData = require('src/examples/data/GymData.js');
    var Easing = require('famous/transitions/Easing');
    var EventHandler = require('famous/core/EventHandler');
  
    function GymListSliderView() {

      console.log("GymListSliderView fires")

      View.apply(this, arguments);
      //call function that creates pass slider 
      _createPassSliderview.call(this);
      _setListeners.call(this);
    };

    GymListSliderView.prototype = Object.create(View.prototype);
    GymListSliderView.prototype.constructor = GymListSliderView;
  
    GymListSliderView.DEFAULT_OPTIONS = {
      size: [320, 120],
      data: undefined
    }

    //click function on pass circles/sensors to update prices
    function _setListeners() {
      //click functions on 1day sensor, circle and textcontainer
      this.oneDaySensor.on('click', function() {
        this._eventOutput.emit('1 day click');
        }.bind(this));
      this.oneDayCircle.on('click', function() {
        this._eventOutput.emit('1 day click');
        }.bind(this));
      this.oneDayTextContainer.on('click', function() {
        this._eventOutput.emit('1 day click');
        }.bind(this));

      //click functions on 4day sensor, circle and textcontainer
      this.fourDaySensor.on('click', function() {
        this._eventOutput.emit('4 day click');
        }.bind(this));
      this.fourDayCircle.on('click', function() {
        this._eventOutput.emit('4 day click');
        }.bind(this));
      this.fourDayTextContainer.on('click', function() {
        this._eventOutput.emit('4 day click');
        }.bind(this));

      //click functions on 1month sensor, circle and textcontainer
      this.oneMonthSensor.on('click', function() {
        this._eventOutput.emit('1 month click');
        }.bind(this));
      this.oneMonthCircle.on('click', function() {
        this._eventOutput.emit('1 month click');
        }.bind(this));
      this.oneMonthTextContainer.on('click', function() {
        this._eventOutput.emit('1 month click');
        }.bind(this));

    }

    //big function below creates and handles slider surface
    //on the bottom of gym search results list
    function _createPassSliderview() {

      console.log("_createPassSliderview fired")
      var passSlider = new View({
        properties: {
          zIndex: 2
        }
      }); 

      var passSliderModifier = new StateModifier({
        origin: [0.5, 0.92]
      });

      var sizeModifier = new StateModifier({
        size: [320, 100]
      });

      this.add(passSliderModifier).add(passSlider);

      var sizeNode = passSlider.add(sizeModifier);

      this.passSliderbackground = new Surface({
        properties: {
          backgroundColor: "#CDCED3"
        }
      })

      var backModifier = new StateModifier({
        // positions the background behind the circle surface
        transform: Transform.behind
      });

      sizeNode.add(backModifier).add(this.passSliderbackground);

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
        size: [55, 55]
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
        size: [50, 50], 
        origin: [0.5, 0.5]
      })

      //adding pass selector background to main slider parent
      passSelectorBaseNode.add(passSelectorBaseBackground);
      passSelectorBaseNode.add(passSelectorFrontBackgroundModifier).add(passSelectorFrontBackground);

      //creating hidden square behind 1day circle to detect clicks
      this.oneDaySensor = new Surface ({
        size: [75, 100], 
        properties: {
          backgroundColor: "#CDCED3", 
          zIndex: 10
        } 
      });

      var oneDaySensorModifier = new StateModifier({
        origin: [0.1, 0.65]
      });

      //creating hidden square behind 4day circle to detect clicks
      this.fourDaySensor = new Surface ({
        size: [75, 100], 
        properties: {
          backgroundColor: "#CDCED3", 
          zIndex: 10
        } 
      });

      var fourDaySensorModifier = new StateModifier({
        origin: [0.5, 0.65]
      });

      //creating hidden square behind 1month circle to detect clicks
      this.oneMonthSensor = new Surface ({
        size: [75, 100], 
        properties: {
          backgroundColor: "#CDCED3", 
          zIndex: 10
        } 
      });

      var oneMonthSensorModifier = new StateModifier({
        origin: [0.91, 0.65]
      });

      //click function on 1day sensor 
      this.oneDaySensor.on('click', function(){
        passSelectorBaseOriginModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneDayTextContainerModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        fourDayTextContainerModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneMonthTextContainerModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
      });

      //creating 1day circle
      this.oneDayCircle  = new Surface({
        size: [25, 25],
        properties: {
          borderRadius: "80px", 
          zIndex: 15, 
          backgroundColor: "#969B98"
        }
      });

      var oneDayCircleOriginModifier = new StateModifier({
        origin: [0.15, 0.55]
      });

      //click function on 1day circle
      this.oneDayCircle.on('click', function(){
        passSelectorBaseOriginModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneDayTextContainerModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        fourDayTextContainerModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneMonthTextContainerModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
      });

      //click function on 4day sensor for selector 
      this.fourDaySensor.on('click', function(){
        passSelectorBaseOriginModifier.setTransform(
          Transform.translate(103, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneDayTextContainerModifier.setTransform(
          Transform.translate(0, 9, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        fourDayTextContainerModifier.setTransform(
          Transform.translate(0, -11, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneMonthTextContainerModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
      });

      //creating 4day circle
      this.fourDayCircle = new Surface({
        size: [25, 25],
        properties: {
          borderRadius: "80px", 
          zIndex: 15, 
          backgroundColor: "#969B98"
        }
      });

      var fourDayCircleOriginModifier = new StateModifier({
        origin: [0.5, 0.55]
      });

      //click function on 4day circle for selector
      this.fourDayCircle.on('click', function(){
        passSelectorBaseOriginModifier.setTransform(
          Transform.translate(103, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneDayTextContainerModifier.setTransform(
          Transform.translate(0, 9, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        fourDayTextContainerModifier.setTransform(
          Transform.translate(0, -11, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneMonthTextContainerModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
      });

      //click function on 1month sensor 
      this.oneMonthSensor.on('click', function(){
        passSelectorBaseOriginModifier.setTransform(
          Transform.translate(206, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneDayTextContainerModifier.setTransform(
          Transform.translate(0, 9, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        fourDayTextContainerModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneMonthTextContainerModifier.setTransform(
          Transform.translate(0, -10, 0), 
          { duration : 300, curve: 'easeIn' }
          );
      });

      //creating 1month circle
      this.oneMonthCircle = new Surface({
        size: [25, 25],
        properties: {
          borderRadius: "80px", 
          zIndex: 15, 
          backgroundColor: "#969B98"
        }
      });

      var oneMonthCircleOriginModifier = new StateModifier({
        origin: [0.85, 0.55]
      });

      //click function on 1month circle
      this.oneMonthCircle.on('click', function(){
        passSelectorBaseOriginModifier.setTransform(
          Transform.translate(206, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneDayTextContainerModifier.setTransform(
          Transform.translate(0, 9, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        fourDayTextContainerModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneMonthTextContainerModifier.setTransform(
          Transform.translate(0, -10, 0), 
          { duration : 300, curve: 'easeIn' }
          );
      });

      //creating container for 1day text
      this.oneDayTextContainer = new Surface({
        size: [60, 0],
        content: "<br>1-Day</br>", 
        properties: {
          color: "black",
          fontSize: "15px",
          backgroundColor: "#CDCED3", 
          zIndex: 12, 
          // textAlign: "center"
        }
      });

      //setting position of 1day text container
      var oneDayTextContainerModifier = new StateModifier({
        origin: [0.14, -0.23],
      });

      //click function on 1day text container 
      this.oneDayTextContainer.on('click', function(){
        passSelectorBaseOriginModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneDayTextContainerModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        fourDayTextContainerModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneMonthTextContainerModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
      });

      //creating 4day text container
      this.fourDayTextContainer = new Surface({
        size: [60, 0],
        content: "<br>4-Day</br>", 
        properties: {
          color: "black",
          fontSize: "15px",
          backgroundColor: "#CDCED3", 
          zIndex: 12
        }
      })

      //setting position of 4day text container
      var fourDayTextContainerModifier = new StateModifier({
        origin: [0.53, -0.14],
      });

      //click function on 4day text container
      this.fourDayTextContainer.on('click', function(){
        passSelectorBaseOriginModifier.setTransform(
          Transform.translate(103, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneDayTextContainerModifier.setTransform(
          Transform.translate(0, 9, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        fourDayTextContainerModifier.setTransform(
          Transform.translate(0, -11, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneMonthTextContainerModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
      });

      //creating 1-month text container
      this.oneMonthTextContainer = new Surface({
        size: [85, 0],
        content: "<br>1-Month</br>", 
        properties: {
          color: "black",
          fontSize: "15px",
          backgroundColor: "#CDCED3", 
          zIndex: 12
        }
      });

      //setting position of 1month text container
      var oneMonthTextContainerModifier = new StateModifier({
        origin: [0.985, -0.15],
      });

      //click function on 1month text container
      this.oneMonthTextContainer.on('click', function(){
        passSelectorBaseOriginModifier.setTransform(
          Transform.translate(206, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneDayTextContainerModifier.setTransform(
          Transform.translate(0, 9, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        fourDayTextContainerModifier.setTransform(
          Transform.translate(0, 0, 0), 
          { duration : 300, curve: 'easeIn' }
          );
        oneMonthTextContainerModifier.setTransform(
          Transform.translate(0, -10, 0), 
          { duration : 300, curve: 'easeIn' }
          );
      });    

      //adding sensors to sizeNode
      sizeNode.add(oneDaySensorModifier).add(this.oneDaySensor);
      sizeNode.add(fourDaySensorModifier).add(this.fourDaySensor);
      sizeNode.add(oneMonthSensorModifier).add(this.oneMonthSensor);

      //adding circles to sizeNode
      sizeNode.add(oneDayCircleOriginModifier).add(this.oneDayCircle)
      sizeNode.add(fourDayCircleOriginModifier).add(this.fourDayCircle)
      sizeNode.add(oneMonthCircleOriginModifier).add(this.oneMonthCircle)

      //adding text containers to sizeNode
      sizeNode.add(oneDayTextContainerModifier).add(this.oneDayTextContainer);
      sizeNode.add(fourDayTextContainerModifier).add(this.fourDayTextContainer);
      sizeNode.add(oneMonthTextContainerModifier).add(this.oneMonthTextContainer);

    };

    module.exports = GymListSliderView;
});

