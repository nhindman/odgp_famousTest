define(function(require, exports, module) {
    var View = require('famous/core/View');
    var RenderNode = require('famous/core/RenderNode');
    var Surface = require('famous/core/Surface');
    var Group = require('famous/core/Group');
    var ContainerSurface = require('famous/Surfaces/ContainerSurface');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transitionable   = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');

    Transitionable.registerMethod('spring', SpringTransition);

    function TicketView() {

        window.ticket = this
        window.TT = Transform
        View.apply(this, arguments);

        this.ticketViewNode = new RenderNode();
        this.ticketViewSize = new Modifier({
            size:this.options.ticketViewSize
        });
        this.add(this.ticketViewSize).add(this.ticketViewNode);

        _createTicketExit.call(this);
        _createContainer.call(this);
        _createTicket.call(this);
        _setupTicketEvent.call(this);
    }

    TicketView.prototype = Object.create(View.prototype);
    TicketView.prototype.constructor = TicketView;

    TicketView.DEFAULT_OPTIONS = {
        ticketViewSize: [200,70],
        ticketExitSize: [200,6],
        containerSize: [220, 110],
        ticketSize: [190,100],
        ticketPadding: 5,
        angle: -0.5
    };

    function _createTicketExit(){
        var ticketExit = new Surface({
            size: this.options.ticketExitSize,
            properties:{
                borderRadius:'3px',
                backgroundColor: 'black'
            }
        });
        var ticketExitMod = new Modifier();
        this.ticketViewNode.add(ticketExitMod).add(ticketExit);
    }

    function _createContainer(){
        this.container = new ContainerSurface({
            size: this.options.containerSize,
            properties: {
                overflow:'hidden'
            }
        });
        this.containerMod = new Modifier({
            transform: Transform.translate((this.options.ticketExitSize[0] - this.options.containerSize[0]) / 2,this.options.ticketExitSize[1]/2,0)
        });
        this.ticketViewNode.add(this.containerMod).add(this.container);
    }

    function _createTicket(){
        var ticketGroup = new Group({
            size:this.options.containerSize
        });
        ticketGroup.context.setPerspective(500);

        this.container.add(ticketGroup);

        this.ticketBackground = new Surface({
            size: this.options.ticketSize,
            properties:{
                backgroundColor:'blue'
            }
        });

        this.ticket = new Surface({
            size: [this.options.ticketSize[0] - this.options.ticketPadding * 2,this.options.ticketSize[1] - this.options.ticketPadding],
            content: '<div>my ticket</div>',
            properties:{
                backgroundColor:'yellow'
            }
        });
        this.ticketMod = new Modifier({
            transform: Transform.translate(0,0,0),
            opacity:0.2
        });

        this.ticketNode = new RenderNode();
        this.ticketNode.add(this.ticketMod).add(this.ticket);
        this.ticketNode.add(this.ticketBackground);

        this.ticketNodeMod = new StateModifier({
            origin:[0.5,0],
            transform: Transform.translate(0,-this.options.ticketSize[1],0)
        });

        this.rootMod = new StateModifier({
            origin:[0.5,0.5]
        });
        ticketGroup.add(this.rootMod).add(this.ticketNodeMod).add(this.ticketNode);

    }

    function _setupTicketEvent(){
        this._eventInput.on('printTicket', function(){
            var time = 400;
            this.ticketNodeMod.setTransform(Transform.translate(0,-this.options.ticketSize[1]*3/4,0),{duration:time},function(){
                this.ticketNodeMod.setTransform(Transform.translate(0,-this.options.ticketSize[1]*3/4,0),{duration:time},function(){
                    this.ticketNodeMod.setTransform(Transform.translate(0,-this.options.ticketSize[1]*2/4,0),{duration:time},function(){
                        this.ticketNodeMod.setTransform(Transform.translate(0,-this.options.ticketSize[1]*2/4,0),{duration:time},function(){
                            this.ticketNodeMod.setTransform(Transform.translate(0,-this.options.ticketSize[1]/4,0),{duration:time},function(){
                                this.ticketNodeMod.setTransform(Transform.translate(0,-this.options.ticketSize[1]/4,0),{duration:time},function(){
                                    this.ticketNodeMod.setTransform(Transform.translate(0,0,0),{duration:time},function(){
                                        this.fadeIn();this.shake()
                                    }.bind(this))
                                }.bind(this))
                            }.bind(this))
                        }.bind(this))
                    }.bind(this))
                }.bind(this))
            }.bind(this))


        }.bind(this));
    }

    TicketView.prototype.fadeIn = function() {
        this.ticketMod.setOpacity(1, { duration: 1500 });
    };

    TicketView.prototype.shake = function() {
        this.rootMod.halt();

        // rotates the slide view back along the top edge
        this.rootMod.setTransform(
            Transform.rotateX(this.options.angle),
            { duration: 200, curve: 'easeOut' },
            function(){}.bind(this)
        );
        this.rootMod.setTransform(
            Transform.identity,
            { method: 'spring', period: 600, dampingRatio: 0.15 }
        )
    };

    TicketView.prototype.resetTicket = function() {
        this.rootMod.halt();
        this.ticketMod.setOpacity(0.2);
        this.ticketNodeMod.setTransform(Transform.translate(0,-this.options.ticketSize[1],0))
    };

    module.exports = TicketView;
});