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
            logTapGestureContext = 'TapGesture (' + _numTapsRequired + ' Taps) - ';
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
                clearTimeout(_setTimeoutForTouchesBeganId);
                _setTimeoutForTouchesBeganId = null;
                this.stateFailedOrEnded();
                return;
            }

            var totalTouches = this.getNumberOfTouches();
            if(_setTimeoutForTouchesBeganId) {
                clearTimeout(_setTimeoutForTouchesBeganId);
                _setTimeoutForTouchesBeganId = null;
            }

            if(totalTouches != _numberOfTouchesRequired) {
                _state = "Failed";
            }
            else if(touches && touches.length == _numberOfTouchesRequired) {
                _numberOfTaps++;
                if (_numberOfTaps <= _numTapsRequired) {
                    _state = "Possible";
                    logGestureInfo("state: " + _state);
                    var that = this;
                    _setTimeoutForTouchesBeganId = setTimeout(function(){
                        _state = "Failed";
                        logGestureInfo("state: " + _state);
                        that.stateFailedOrEnded();
                    }, MAX_TAP_DURATION)
                }
                else {
                    if(_setTimeoutForTouchesBeganId) {
                        clearTimeout(_setTimeoutForTouchesBeganId);
                        _setTimeoutForTouchesBeganId = null;
                    }
                    _state = "Failed";
                    logGestureInfo("state: " + _state);
                }
            } else {
                _state = "Failed";
                logGestureInfo("state: " + _state);
            }

            //See above.  For now only
            //if(this.callback) {
            //    this.callback(this);
            //}
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
                    _state = "Failed";
                    logGestureInfo("Touches Ended - Invalid Touch, state: " + _state);
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
            }
            else if(_numberOfTaps == _numTapsRequired && otherRecognizerFailed) {
                _state = "Began";
                logGestureInfo("Touches Ended - Valid Number of Taps... Need to make sure another tap doesn't come, state: " + _state);
                if(_setTimeoutForTouchesBeganId) {
                    clearTimeout(_setTimeoutForTouchesBeganId);
                    _setTimeoutForTouchesBeganId = null;
                }
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
                            that.callback(that);
                        }
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

                        if (otherRecognizerFailed) {
                            logGestureInfo("Touches Ended - Other GestureRecognizer failed in time: " + otherState);
                            _state = "Ended";
                        }
                        else {
                            logGestureInfo("Touches Ended - Other GestureRecognizer didn't fail in time: " + otherState);
                            _state = "Failed";
                        }

                        if(that.callback && _state == "Ended") {
                            that.callback(that);
                        }

                        that.stateFailedOrEnded();
                    }, MAX_TIME_BETWEEN_TAPS);
                }
            }
            else if(_numberOfTaps < _numTapsRequired) {
                _state = "Possible";
                logGestureInfo("Touches Ended - Not enough taps.  Needed: " + _numTapsRequired);
                var that = this;
                _setTimeoutForTouchesBeganId = setTimeout(function() {
                    logGestureInfo("Touches Ended - Didn't get enough taps.  Needed: " + _numTapsRequired + ", Had: " + _numberOfTaps);
                    if(_state == "Possible") {
                        _state = "Failed"; //Held touch too long
                        that.stateFailedOrEnded();
                    }
                }, MAX_TAP_DURATION);

            }
            else {
                _state = "Failed";
            }

            if(this.callback && _state == "Ended") {
                this.callback(this);
            }
            if(_state == "Possible") {
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
