var t = require('tcomb-validation');
var _ = require('underscore');

var GestureRecognizerProtocol = require('../Protocols/GestureRecognizerProtocol');
var GestureRecognizerBase = require('../GestureRecognizerBase');

var PanGestureRecognizerProtocol = GestureRecognizerProtocol.extend( new t.struct({
}, 'PanGestureRecognizerProtocol'));

function PanGestureRecognizerFactory() {
    var shouldLogGesture = false;
    var logGestureContext = "PanGesture - ";
    var logGestureInfo = function(logString) {
        if(shouldLogGesture) {
            console.log(logGestureContext + logString);
        }
    }

    var _maxTouches = 1;
    var _minTouches = 1;
    var _state = "None";
    var MIN_DISTANCE_FOR_BEGAN = 5;

    function restart() {
        _state = "None";
    }

    var PanGestureRecognizerBase = {
        reset: function(){
            restart();
        },
        logDebugInfo: function(shouldLog) {
            shouldLogGesture = shouldLog;
        },
        touchesBegan: function(touches) {
            if(!touches && touches.length < _minTouches || touches.length > _maxTouches) {
                _state = "Failed";
                logGestureInfo('Touhes Began - Invalid number of Touches: ' + touches.length ? touches.length : 0 + ', state: ' + _state);
            }
            else {
                _state = "Possible";
                logGestureInfo('Gesture Began, state: ' + _state);
            }
            if(this.callback) {
                this.callback(this);
            }
        },
        touchesMoved: function(touches) {
            if(!touches && touches.length < _minTouches || touches.length > _maxTouches) {
                _state = "Failed";
                logGestureInfo('Touches Moved - Invalid number of Touches: ' + touches.length ? touches.length : 0 + ', state: ' + _state);
            }
            else {
                var touch = touches[0];
                var translation = touch.getMaxTranslation();
                var distanceMoved = Math.sqrt(translation.x * translation.x + translation.y + translation.y);
                if (touch.touchEndTime) {
                    if(_state == "Began" || _state == "Changed") {
                        _state = "Ended";
                    } else {
                        _state = "Failed";
                    }
                } else if ( distanceMoved < MIN_DISTANCE_FOR_BEGAN) {
                    _state = "Possible";
                } else if (_state == "Possible") {
                    _state = "Began";
                }
                else {
                    _state = "Changed";
                    logGestureInfo('Touches Moved, current translation: ' + JSON.stringify(touch.getCurrentTranslation(), null));
                }
            }

            if(this.callback) {
                this.callback(this);
            }
        },
        touchesEnded: function(touches) {
            _state = "Ended";
            logGestureInfo('Touches Ended and pan gesture is no longer active');

            if(this.callback) {
                this.callback(this);
            }
        },
        getState: function () {
            return _state;
        }
    };

    var panGestureImpl = _.extend(new GestureRecognizerBase(), PanGestureRecognizerBase);
    //panGestureImpl =  new PanGestureRecognizerProtocol(tapGestureImpl, true);
    return panGestureImpl;
}

module.exports = PanGestureRecognizerFactory;
