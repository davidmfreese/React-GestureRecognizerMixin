var _ = require('underscore');

var Models = require('JSCoreGraphics').CoreGraphics.Geometry.DataTypes;
var Touch = require('./Touch');

var shouldLogGestureInfo = false;
var logContext = "ReactGestureRecognizerMixin";
var logGestureInfo = function(logString) {
    if(shouldLogGestureInfo) {
        console.log(logContext + ' - ' +logString);
    }
}

function ReactGestureRecognizerMixinFactory() {
    var ReactGestureRecognizerMixin = {
        componentWillMount: function() {

        },

        componentDidMount: function() {
            var node = this.getDOMNode();

            node.addEventListener('mousedown', this.gestureRecognizerOnMouseDown);
            window.addEventListener('mousemove', this.gestureRecognizerOnMouseMove);
            window.addEventListener('mouseup', this.gestureRecognizerOnMouseUp);

            node.addEventListener('touchstart', this.gestureRecognizerOnTouchStart);
            window.addEventListener('touchmove', this.gestureRecognizerOnTouchMove);
            window.addEventListener('touchend', this.gestureRecognizerOnTouchEnd);

            if(!this.shouldAllowTouchToBubble) {
                this.shouldAllowTouchToBubble = false;
            }

            if(this.logMixinDebugInfo) {
                shouldLogGestureInfo = this.logMixinDebugInfo;
            }
            logGestureInfo("componentDidMount");
        },

        componentWillUnmount: function() {
            var node = this.getDOMNode();

            node.removeEventListener('mousedown', this.gestureRecognizerOnMouseDown);
            window.removeEventListener('mousemove', this.gestureRecognizerOnMouseMove);
            window.removeEventListener('mouseup', this.gestureRecognizerOnMouseUp);

            node.removeEventListener('touchstart', this.gestureRecognizerOnTouchStart);
            window.removeEventListener('touchmove', this.gestureRecognizerOnTouchMove);
            window.removeEventListener('touchend', this.gestureRecognizerOnTouchEnd);

            logGestureInfo("componentWillUnmount");
        },

        addedLocalDelegate: false,

        //TODO: this should be called on each listening gesture to see if any will handle touch or delegated to mixins super
        shouldHandleGesture: function(e, isTouch) {
            if(isTouch) {
                return this.shouldHandleTouchGestures;
            } else {
                return this.shouldHandleMouseGestures;
            }
        },

        shouldPreventDefault: function() {
            return !this.shouldAllowTouchToBubble;
        },

        isAnyGestureCurrentlyActive: function() {
            var isActive = false;
            for(var i = 0; i < this.gestureRecognizers.length; i++) {
                if(this.gestureRecognizers[i].isActive()) {
                    isActive = true;
                    break;
                }
            }

            //logGestureInfo("isAnyGestureCurrentlyActive: " + isActive);
            return isActive;
        },

        resetRecognizers: function() {
            for(var i = 0; i < this.gestureRecognizers.length; i++) {
                this.gestureRecognizers[i].reset();
            }

            logGestureInfo("resetRecognizers");
        },

        onGestureStateChanged: function() {
            var anyActive = this.isAnyGestureCurrentlyActive();
            logGestureInfo("onGestureStateChanged.  anyActive: " + anyActive);
            if(!anyActive) {
                this.resetRecognizers();
            }
        },

        gestureRecognizerOnMouseDown: function(e) {
            if(this.shouldHandleGesture(e, false)) {
                var point = new Models.Point({x: e.pageX, y: e.pageY});
                var touch = new Touch(1, point, e.relatedTarget);
                this.gestureRecognizerOnGestureDown(touch, function(shouldPreventDefault) {
                    logGestureInfo("gestureRecognizerOnMouseDown.  ShouldPreventDefault: " + shouldPreventDefault);
                    if(shouldPreventDefault) {
                        e.preventDefault();
                    }
                });
            }
        },

        gestureRecognizerOnMouseMove: function(e) {
            if(this.shouldHandleGesture(e, false)  && this.isAnyGestureCurrentlyActive()) {
                var point = new Models.Point({x: e.pageX, y: e.pageY});
                var touch = new Touch(1, point, e.relatedTarget);
                this.gestureRecognizerOnGestureMove(touch, function(shouldPreventDefault) {
                    logGestureInfo("gestureRecognizerOnMouseMove.  ShouldPreventDefault: " + shouldPreventDefault);
                    if(shouldPreventDefault) {
                        e.preventDefault();
                    }
                });
            }
        },

        gestureRecognizerOnMouseUp: function(e) {
            if(this.shouldHandleGesture(e, false)) {
                var point = new Models.Point({x: e.pageX, y: e.pageY});
                var touch = new Touch(1, point, e.relatedTarget);
                this.gestureRecognizerOnGestureUp(touch, function(shouldPreventDefault) {
                    logGestureInfo("gestureRecognizerOnMouseUp.  ShouldPreventDefault: " + shouldPreventDefault);
                    if(shouldPreventDefault) {
                        e.preventDefault();
                    }
                });
            }
        },

        gestureRecognizerOnTouchStart: function(e) {
            if(this.shouldHandleGesture(e, true)) {
                var touches = [];
                for (var i = 0; i < e.changedTouches.length; i++) {
                    var point = new Models.Point({x: e.changedTouches[i].pageX, y: e.changedTouches[i].pageY});
                    var touch = new Touch(e.changedTouches[i].identifier, point, e.changedTouches[i].target);

                    touches.push(touch);
                }

                this.gestureRecognizerOnGestureDown(touches, function(shouldPreventDefault) {
                    logGestureInfo("gestureRecognizerOnTouchStart.  ShouldPreventDefault: " + shouldPreventDefault);
                    if(shouldPreventDefault) {
                        e.preventDefault();
                    }
                });
            }
        },

        gestureRecognizerOnTouchMove: function(e) {
            var touchOne = {
                pageX: e.touches && e.touches.length > 0 ? e.touches[0].pageX : "NA",
                pageY: e.touches && e.touches.length > 0 ? e.touches[0].pageY : "NA"
            };

            var changedTouchOne = {
                pageX: e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0].pageX : "NA",
                pageY: e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0].pageY : "NA"
            };
            logGestureInfo("gestureRecognizerOnTouchMove - touches: " + JSON.stringify(touchOne, null) + ", changedTouches: " + JSON.stringify(changedTouchOne, null));
            if(this.shouldHandleGesture(e, true) && this.isAnyGestureCurrentlyActive()) {
                var touches = [];
                for (var i = 0; i < e.changedTouches.length; i++) {
                    var point = new Models.Point({x: e.changedTouches[i].pageX, y: e.changedTouches[i].pageY});
                    var touch = new Touch(e.changedTouches[i].identifier, point, e.changedTouches[i].target);

                    touches.push(touch);
                }

                this.gestureRecognizerOnGestureMove(touches, function(shouldPreventDefault) {
                    logGestureInfo("gestureRecognizerOnTouchStart.  ShouldPreventDefault: " + shouldPreventDefault);
                    if(shouldPreventDefault) {
                        e.preventDefault();
                    }
                });
            }
        },

        gestureRecognizerOnTouchEnd: function(e) {
            if(this.shouldHandleGesture(e, true)) {
                var touches = [];
                for (var i = 0; i < e.changedTouches.length; i++) {
                    var point = new Models.Point({x: e.changedTouches[i].pageX, y: e.changedTouches[i].pageY});
                    var touch = new Touch(e.changedTouches[i].identifier, point, e.changedTouches[i].target);

                    touches.push(touch);
                }

                this.gestureRecognizerOnGestureUp(touches, function(shouldPreventDefault) {
                    logGestureInfo("gestureRecognizerOnTouchEnd.  ShouldPreventDefault: " + shouldPreventDefault);
                    if(shouldPreventDefault) {
                        e.preventDefault();
                    }
                });
            }
        },

        gestureRecognizerOnGestureDown: function(touches, shouldPreventDefaultCallback) {
            if(!this.addedLocalDelegate) {//hackety hack
                this.addedLocalDelegate = true;
                for(var i = 0; i < this.gestureRecognizers.length; i++) {
                    this.gestureRecognizers[i].stateFailedOrEndedCallback = this.onGestureStateChanged;
                }
            }
            if(!_.isArray(touches)) {
                touches = [touches];
            }

            for(var i = 0; i < this.gestureRecognizers.length; i++) {
                this.gestureRecognizers[i].onGestureDown(touches);
            }

            var anyActive = this.isAnyGestureCurrentlyActive();
            shouldPreventDefaultCallback(anyActive && this.shouldPreventDefault());

        },

        gestureRecognizerOnGestureMove: function(touches, shouldPreventDefaultCallback) {
            if (this.isAnyGestureCurrentlyActive()) {
                if (!_.isArray(touches)) {
                    touches = [touches];
                }

                for (var i = 0; i < this.gestureRecognizers.length; i++) {
                    this.gestureRecognizers[i].onGestureMove(touches);
                }

                var anyActive = this.isAnyGestureCurrentlyActive();
                shouldPreventDefaultCallback(anyActive && this.shouldPreventDefault());
            }
        },

        gestureRecognizerOnGestureUp: function(touches, shouldPreventDefaultCallback) {
            if (!_.isArray(touches)) {
                touches = [touches];
            }

            for (var i = 0; i < this.gestureRecognizers.length; i++) {
                this.gestureRecognizers[i].onGestureUp(touches);
            }

            var anyActive = this.isAnyGestureCurrentlyActive();
            if (!anyActive) {
                this.resetRecognizers();
            }

            shouldPreventDefaultCallback(anyActive && this.shouldPreventDefault());
        }
    };

    return ReactGestureRecognizerMixin;
}

module.exports = ReactGestureRecognizerMixinFactory;