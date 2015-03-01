var t = require('tcomb-validation');
var _ = require('underscore');

var GestureRecognizerBase = require('../GestureRecognizerBase');
var GestureRecognizerProtocol = require('../Protocols/GestureRecognizerProtocol');

var TapGestureRecognizerProtocol = GestureRecognizerProtocol.extend( new t.struct({
    setNumberTapsRequired: t.func(t.Num, t.Nil, 'setNumberTapsRequired'),
    getNumberOfTaps: t.func(t.Nil, t.Num, 'getNumberTaps')
}, 'TapGestureRecognizerProtocol'));

//TAP GESTURE IS DESCRETE EVENT... should we call callback Action with anything unless tap is successful??
function TapGestureRecognizerFactory() {
    var shouldLogGesture = false;
    var logGestureContext = "TapGesture (1 Tap) - ";
    var logGestureInfo = function(logString) {
        if(shouldLogGesture) {
            console.log(logGestureContext + logString);
        }
    }

    var _numTapsRequired = 1; //TODO: implement if/when needed
    var _numberOfTouchesRequired = 1;
    var _state = "None";

    var MAX_DISTANCE = 5;//total pixels
    var MAX_TAP_DURATION = 150;// milliseconds
    var MAX_TIME_BETWEEN_TAPS = 350;

    var _numberOfTaps = 0;
    var _setTimeoutForTouchesBeganId = null;
    var _setTimeoutForTouchesEndedId = null;

    function restart() {
        _state = "None";
        _numberOfTaps = 0;
        if(_setTimeoutForTouchesBeganId) {
            clearTimeout(_setTimeoutForTouchesBeganId);
        }
        if(_setTimeoutForTouchesEndedId) {
            clearTimeout(_setTimeoutForTouchesEndedId);
        }
        _setTimeoutForTouchesBeganId = null;
        _setTimeoutForTouchesEndedId = null;
    }

    function isTouchValid(touch) {
        var maxTranslation = touch.getMaxTranslation();
        var distanceMoved = Math.sqrt(maxTranslation.x * maxTranslation.x + maxTranslation.y + maxTranslation.y);
        var touchDuration = touch.getTouchDuration();
        return distanceMoved <= MAX_DISTANCE && touchDuration <= MAX_TAP_DURATION;
    }

    var TapGestureRecognizer = {
        setNumberTapsRequired: function(numTapsRequired) {
            _numTapsRequired = numTapsRequired;
            logGestureContext = 'TapGesture (' + _numTapsRequired + ' Taps) - ';
            logGestureInfo("setNumberTapsRequired: " + _numTapsRequired);
        },
        getNumberOfTaps: function() {
            return _numberOfTaps;
        },
        logDebugInfo: function(shouldLog) {
            shouldLogGesture = shouldLog;
        },
        reset: function() {
            logGestureInfo("Tap Gesture Recognizer - reset");
            restart();
        },
        touchesBegan: function(touches) {
            if(!this.isActive() && _state != "None") {
                return;
            }

            if(_setTimeoutForTouchesBeganId && _state == "Began") { //When this happens we had correct number of touches but got one extra
                _state = "Failed";
                logGestureInfo("Touches Began - Too many taps. Number of taps required: " + _numTapsRequired + ", state: " + _state);
                clearTimeout(_setTimeoutForTouchesBeganId);
                _setTimeoutForTouchesBeganId = null;
                this.stateFailedOrEnded();
                return;
            }

            if(_setTimeoutForTouchesBeganId) { //We were waiting for another touch and we got it
                clearTimeout(_setTimeoutForTouchesBeganId);
                _setTimeoutForTouchesBeganId = null;
            }

            var totalTouches = this.getNumberOfTouches();
            if(totalTouches != _numberOfTouchesRequired) {
                _state = "Failed";
                logGestureInfo("Touches Began - Number of touches invalid. Number of Touches required: " + _numberOfTouchesRequired + ", actual: " + totalTouches + ", state: " + _state);
            }
            else {
                _numberOfTaps++;
                if (_numberOfTaps <= _numTapsRequired) {
                    _state = "Possible";
                    logGestureInfo("Touches Began - state: " + _state);
                    var that = this;
                    _setTimeoutForTouchesBeganId = setTimeout(function(){
                        _state = "Failed";
                        logGestureInfo("Touches Began - Touch Lasted Too Long. state: " + _state);
                        that.stateFailedOrEnded();
                    }, MAX_TAP_DURATION)
                }
                else if (_numberOfTaps > _numTapsRequired) {
                    _state = "Failed";
                    logGestureInfo("Touches Began - Too many taps: " + _state);
                }
            }

            if(!this.isActive()) {
                this.stateFailedOrEnded();
            }
        },
        touchesMoved: function(touches) {
            if(this.isActive()) {
                var totalTouches = this.getNumberOfTouches();
                if(totalTouches != _numberOfTouchesRequired) {
                    _state = "Failed";
                    logGestureInfo("Touches Moved - Invalid Number of Touches. State: " + _state);
                }
                else {
                    var touchesValid = true;
                    for(var i = 0; i < touches.length; i++) {
                        if(!isTouchValid(touches[i])) {
                            touchesValid = false;
                            _state = "Failed";
                            logGestureInfo("Touches Moved - Invalid Touch. State: " + _state);
                            break;
                        }
                    }
                }
            }

            if(_state == "Failed") {
                this.stateFailedOrEnded();
            }
        },
        touchesEnded: function(touches) {
            if(_setTimeoutForTouchesBeganId) {
                clearTimeout(_setTimeoutForTouchesBeganId);
                _setTimeoutForTouchesBeganId = null;
            }

            if(!this.isActive()) {
                return;
            }

            var touchesValid = true;
            for(var i = 0; i < touches.length; i++) {
                if(!isTouchValid(touches[i])) {
                    touchesValid = false;
                    break;
                }
            }

            var otherRecognizerFailed = true;
            if(this.requiredGestureRecognizerToFail) {
                var otherState = this.requiredGestureRecognizerToFail.getState();
                logGestureInfo("Touches Ended - Other GestureRecognizer state: " + otherState);
                otherRecognizerFailed = otherState == "Failed" || otherState == "None";
            }

            if(!touchesValid) {
                _state = "Failed";
                logGestureInfo("Touches Ended - Invalid Touche(s). State: " + _state);
            }
            else if(_numberOfTaps == _numTapsRequired && otherRecognizerFailed) {
                _state = "Began";
                logGestureInfo("Touches Ended - Valid Number of Taps... Make sure another tap doesn't come, State: " + _state);
                if(_setTimeoutForTouchesEndedId) {
                    clearTimeout(_setTimeoutForTouchesEndedId);
                    _setTimeoutForTouchesEndedId = null;
                }

                var that = this;
                _setTimeoutForTouchesBeganId = setTimeout(function() {
                    _setTimeoutForTouchesBeganId = null;
                    if(_state == 'Began') {
                        _state = 'Ended';
                        if(that.callback && _state == "Ended") {
                            logGestureInfo("Touches Ended - RECOGNIZED");
                            that.callback(that);
                        }
                        that.stateFailedOrEnded();
                    }
                }, MAX_TIME_BETWEEN_TAPS)

            }
            else if(_numberOfTaps == _numTapsRequired) {
                if(_state != "Failed") {
                    _state = "Possible";
                    var that = this;

                    logGestureInfo("Touches Ended - Other Recognizer Hasn't Failed, state: " + _state);
                    _setTimeoutForTouchesEndedId = setTimeout(function () {
                        _setTimeoutForTouchesEndedId = null;
                        var otherState = that.requiredGestureRecognizerToFail.getState();
                        otherRecognizerFailed = otherState == "Failed" || otherState == "None";

                        if(_numberOfTaps != _numTapsRequired) {
                            logGestureInfo("Touches Ended - Other GestureRecognizer failed in time but too many taps. Needed: " + _numTapsRequired + ", Had: " + _numberOfTaps + ", State: " + _state);
                        }
                        else if (otherRecognizerFailed) {
                            logGestureInfo("Touches Ended - Other GestureRecognizer failed in time. Other Recognizer State:  " + otherState);
                            _state = "Ended";
                        }
                        else {
                            logGestureInfo("Touches Ended - Other GestureRecognizer didn't fail in time. Other Recognizer State: " + otherState);
                            _state = "Failed";
                        }

                        if(that.callback && _state == "Ended") {
                            that.callback(that);
                        }
                        that.stateFailedOrEnded();
                    }, MAX_TIME_BETWEEN_TAPS + 50);
                }
            }
            else if(_numberOfTaps < _numTapsRequired) {
                _state = "Possible";
                logGestureInfo("Touches Ended - Not enough taps Yet. Need: " + _numTapsRequired + ", Have: " + _numberOfTaps + ", State: " + _state);
                var that = this;
                _setTimeoutForTouchesBeganId = setTimeout(function() {
                    if(_state == "Possible") {
                        _state = "Failed"; //Held touch too long
                    }
                    logGestureInfo("Touches Ended - Didn't get enough taps.  Needed: " + _numTapsRequired + ", Had: " + _numberOfTaps + ", State: " + _state);
                    that.stateFailedOrEnded();
                }, MAX_TIME_BETWEEN_TAPS);

            }
            else {
                _state = "Failed";
            }

            if(this.callback && _state == "Ended") {
                logGestureInfo("Touches Ended - RECOGNIZED");
                this.callback(this);
            }
            if(!this.isActive()) {
                this.stateFailedOrEnded();
            }
        },
        getState: function () {
            return _state;
        }
    };

    var tapGestureImpl = _.extend(new GestureRecognizerBase(), TapGestureRecognizer);
    return tapGestureImpl;
}

module.exports = TapGestureRecognizerFactory;
