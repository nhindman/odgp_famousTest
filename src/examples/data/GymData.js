define(function(require, exports, module) {
  
  var GymData = function() {

    return {
      "gym_names": ["Blink Fitness", "Steel Gym", "NYSC", "Equinox", "Dolphin Fitness", "Planet Fitness", "David Barton", "YMCA", "", ""],
      "gym_latitudes": ["40.746952","40.743671","40.741308","40.739109","40.725786","40.746180", "40.741016","40.738087", "", ""],
      "gym_longitudes": ["-73.996951","-73.994694","-74.001087","-73.990193","-73.988867", "-73.993336", "-73.993938","-73.997902", "", ""],
      "gym_photos": ["gym_photo_dummy.png", "gym_dumm_2.jpg", "gym_dummy_3.jpg"],
      "one_day_price": ["$9", "$9", "$12", "$15", "$5", "$7", "$18", "$7", "", ""], 
      "four_day_price": ["$14", "$14", "$17", "$19", "$9", "$12", "$25", "$20", "", "", ""], 
      "one_month_price": ["$28", "$28", "$34", "$30", "$15", "$15", "$36", "$40", "", ""]
    }
  };

  module.exports = GymData;

});


