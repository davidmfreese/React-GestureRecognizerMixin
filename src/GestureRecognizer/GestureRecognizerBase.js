var t = require('tcomb-validation');
var _ = require('underscore');

var GestureRecognizerProtocol = require('./Protocols/GestureRecognizerProtocol');
var GestureRecognizerDelegate = require('./Delegates/GestureRecognizerDelegate');

function GestureRecognizerBaseFactory() {
    var state = "None";
    var touches = [];
    var enabled = false;
    var allTouchesEnded = true;
    function getTouch(identifier) {
        for(var i = 0; i < touches.length; i++) {
            if(touches[i].identifier == identifier) {
                return touches[i];
            }
        }
        return null;
    };

    var defaultDelegate = new GestureRecognizerDelegate({
        gestureRecognizerShouldBegin: function(gestureRecognizer) {
            return true;
        },
        gestureRecognizershouldReceiveTouch: function(gestureRecognizer) {
            return true;
        }
    }, true); //mutable

    var GestureRecognizerBase = {
        targetView: null,
        callback: null,
        requiredGestureRecognizerToFail: null,
        delegate: defaultDelegate,
        stateFailedOrEndedCallback: null,
        getState: function () {
            return state;
        },
        getView: function () {
            return this.targetView;
        },
        isEnabled: function () {
            return enabled;
        },
        setEnabled: function (isEnabled) {
            enabled = isEnabled;
        },
        getNumberOfTouches: function () {
            return touches.length;
        },
        locationOfTouch: function (touchNum) {
            return touches[touchNum].lastLocation;
        },
        addTargetForCallback: function (targetView, callback) {
            this.targetView = targetView;
            this.callback = callback;
        },
        getTouches: function () {
            return touches;
        },
        onGestureDown: function (newTouches) {
            var pureTouches = [];
            if (allTouchesEnded) {
                touches = [];
            }
            allTouchesEnded = false;
            for (var i = 0; i < newTouches.length; i++) {
                var touch = getTouch(newTouches[i].identifier);
                if (!touch) {
                    var touch = newTouches[i];
                    touches.push(touch);
                }

                pureTouches.push(touch);
            }

            if(this.touchesBegan && this.isActive() || this.getState() == "None") {
                this.touchesBegan(pureTouches);
            }
        },
        onGestureMove: function (movedTouches) {
            var pureTouches = [];
            if (allTouchesEnded) {
                return;
            }
            for (var i = 0; i < movedTouches.length; i++) {
                var touch = getTouch(movedTouches[i].identifier);
                touch.onMoved(movedTouches[i].startLocation);
                pureTouches.push(touch);
            }

            var state = this.getState();
            if(this.touchesMoved  && this.isActive()) {
                this.touchesMoved(pureTouches);
            }
        },
        onGestureUp: function (endedTouches) {
            var pureTouches = [];
            for (var i = 0; i < endedTouches.length; i++) {
                var touch = getTouch(endedTouches[i].identifier);
                touch.onEnded(endedTouches[i].startLocation);
                pureTouches.push(touch);
            }

            allTouchesEnded = true;
            for (var i = 0; i < touches.length; i++) {
                if (!touches[i].touchEndTime) {
                    allTouchesEnded = false;
                }
            }

            var state = this.getState();
            if(this.touchesEnded && this.isActive()) {
                this.touchesEnded(pureTouches);
            }
        },
        setGestureRecognizerDelegate: function(gestureRecognizerDelegate) {
            var completeDelegate = _.defaults({}, gestureRecognizerDelegate, defaultDelegate); //this way no need to check if delegate responds to method exists
            this.delegate = completeDelegate;
        },
        setRequiresGestureRecognizerToFail: function(gestureRecognizer) {
            this.requiredGestureRecognizerToFail = gestureRecognizer;
        },
        isActive: function() {
            var currentState = this.getState();
            return currentState == "Possible" || currentState == "Began" || currentState == "Changed";

        },
        stateFailedOrEnded: function() {
            if(this.stateFailedOrEndedCallback) {
                this.stateFailedOrEndedCallback();
            }
        },
        logDebugInfo: function(shouldLog) {

        }
    };

    //console.log("IsGestureRecognizerBase a GestureRecognizerProtocol:" +GestureRecognizerProtocol.is(GestureRecognizerBase));
    return GestureRecognizerBase;
}

module.exports = GestureRecognizerBaseFactory;



