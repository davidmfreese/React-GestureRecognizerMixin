var t = require('tcomb-validation');

var GestureRecognizerProtocol = require('../Protocols/GestureRecognizerProtocol');

var GestureRecognizerDelegate = t.struct({
    gestureRecognizerShouldBegin: t.maybe(t.func(GestureRecognizerProtocol, t.Bool, 'gestureRecognizerShouldBegin')),
    gestureRecognizershouldReceiveTouch: t.maybe(t.func(GestureRecognizerProtocol, t.Bool, 'gestureRecognizershouldReceiveTouch'))
    //gestureRecognizershouldRecognizeSimultaneouslyWithGestureRecognizer: t.maybe(t.func([GestureRecognizerProtocol, GestureRecognizerProtocol], t.Bool)),
    //gestureRecognizershouldRequireFailureOfGestureRecognizer: t.maybe(t.func([GestureRecognizerProtocol, GestureRecognizerProtocol], t.Bool)),
    //gestureRecognizershouldBeRequiredToFailByGestureRecognizer: t.maybe(t.func([GestureRecognizerProtocol, GestureRecognizerProtocol], t.Bool))
}, 'GestureRecognizerDelegate');

module.exports = GestureRecognizerDelegate;