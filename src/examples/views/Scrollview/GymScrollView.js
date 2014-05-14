// /**
//  * Copyright (c) 2014 Famous Industries, Inc.
//  * 
//  * Permission is hereby granted, free of charge, to any person obtaining a 
//  * copy of this software and associated documentation files (the "Software"), 
//  * to deal in the Software without restriction, including without limitation 
//  * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
//  * and/or sell copies of the Software, and to permit persons to whom the 
//  * Software is furnished to do so, subject to the following conditions:
//  * 
//  * The above copyright notice and this permission notice shall be included in 
//  * all copies or substantial portions of the Software.
//  * 
//  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
//  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
//  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
//  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
//  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
//  * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS 
//  * IN THE SOFTWARE.
//  *
//  * @license MIT
//  */


// *
//  * Scrollview
//  * ------------
//  *
//  * Scrollview is one of the core views in Famo.us. Scrollview
//  * will lay out a collection of renderables sequentially in 
//  * the specified direction, and will allow you to scroll 
//  * through them with mousewheel or touch events.
//  *
//  * In this example, we have a Scrollview that sequences over
//  * a collection of surfaces that vary in color
 
// define(function(require, exports, module) {
//     var Engine     = require("famous/core/Engine");
//     var Surface    = require("famous/core/Surface");
//     var View = require('famous/core/View');
//     var Transform = require('famous/core/Transform');
//     var StateModifier = require('famous/modifiers/StateModifier');
//     var ViewSwapper = require('famous/views/Lightbox');
//     var Scrollview = require("famous/views/Scrollview");
//     var GymData = require('src/examples/data/GymData.js');

//     var mainContext = Engine.createContext();

//     var scrollview = new Scrollview();

//     Scrollview.prototype = Object.create(View.prototype);
//     Scrollview.prototype.constructor = Scrollview;

//     Scrollview.DEFAULT_OPTIONS = {
//         data: ["Blink Fitness", "Steel Gym", "NYSC", "Equinox", "Dolphin Fitness", "Planet Fitness"]
//     }

//     var scrollviewModifier = new StateModifier({
//         origin: [0.5, 0]
//     })

//     var surfaces = [];

//     scrollview.sequenceFrom(surfaces);

//     console.log("DATA", scrollview.options.data)

//     for (var i = 0, temp; i < 6; i++) {
//         temp = new Surface({
//              content: scrollview.options.data,
//              size: [640, 150],
//              properties: {
//                  backgroundColor: "#22514E",
//                  lineHeight: "200px",
//                  textAlign: "center", 
//                  borderBottom: "1px solid #1C413D"
//              }
//         });

//         temp.pipe(scrollview);
//         surfaces.push(temp);
//     }

//     mainContext.add(scrollviewModifier).add(scrollview);
// });
