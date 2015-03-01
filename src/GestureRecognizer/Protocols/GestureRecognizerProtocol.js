var t = require('tcomb-validation');

var Geometry = require('JSCoreGraphics').CoreGraphics.Geometry;
var TouchProtocol = require('./TouchProtocol');
var GestureRecognizerState = require('../Enums/GestureRecognizerEnums').GestureRecognizerState;

var GestureRecognizerProtocol = t.struct({
    targetView: t.Any,
    callback: t.Any,
    requiredGestureRecognizerToFail: t.maybe(t.Any),
    delegate: t.maybe(t.Any),
    getState: t.func(t.Nil, GestureRecognizerState, 'getState'),
    getView: t.func(t.Nil, t.Any, 'getView'),
    isEnabled: t.func(t.Nil, t.Str, 'isEnabled'),
    setEnabled: t.func(t.Bool, t.Nil, 'setEnabled'),
    getNumberOfTouches: t.func(t.Nil, t.Num, 'getNumberOfTouches'),
    locationOfTouch: t.func(t.Num, Geometry.DataTypes.Point, 'locationOfTouch'),
    addTargetForCallback: t.func([t.Any, t.Func], t.Any, 'addTargetForCallback'),
    getTouches: t.func(t.Any, t.Arr, 'getTouches'),
    onGestureDown: t.func(t.Arr, t.Nil, 'onGestureDown'),
    onGestureUp: t.func(t.Arr, t.Nil, 'onGestureUp'),
    onGestureMove: t.func(t.Arr, t.Nil, 'onGestureMove'),
    setGestureRecognizerDelegate: t.func(t.Obj, t.Nil, 'setGestureRecognizerDelegate'),
    setRequiresGestureRecognizerToFail: t.func(t.Obj, t.Nil, 'setRequiresGestureRecognizerToFail'),
    isActive: t.func(t.Nil, t.Bool, 'isActive'),
    stateFailedOrEndedCallback: t.maybe(t.func(t.Any, t.Any, 'stateFailedOrEndedCallback')),
    stateFailedOrEnded: t.func(t.Nil, t.Nil, 'stateFailedOrEnded'),

    //To be implemented by subclass
    touchesBegan: t.maybe(t.func(t.list(TouchProtocol), t.Nil, 'touchesBegan')),
    touchesMoved: t.maybe(t.func(t.list(TouchProtocol), t.Nil, 'touchesMoved')),
    touchesEnded: t.maybe(t.func(t.list(TouchProtocol), t.Nil, 'touchesEnded')),
    touchesCancelled: t.maybe(t.func(t.list(TouchProtocol), t.Nil, 'touchesCancelled')),
    reset: t.maybe(t.func(t.Nil, t.Nil, 'reset')),
    logDebugInfo: t.maybe(t.func(t.Bool, t.Nil, 'shouldLogDebugInfo'))
});

module.exports= GestureRecognizerProtocol;



