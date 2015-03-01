var exports = {
    Delegates: {
        GestureRecognizerDelegate: require('./src/GestureRecognizer/Delegates/GestureRecognizerDelegate')
    },
    Enums: require('./src/GestureRecognizer/Enums/GestureRecognizerEnums'),
    Protocols: {
        GestureRecognizerProtocol: require('./src/GestureRecognizer/Protocols/GestureRecognizerProtocol'),
        TouchProtocol: require('./src/GestureRecognizer/Protocols/TouchProtocol')
    },
    Recognizers: {
        PanGestureRecognizer: require('./src/GestureRecognizer/Recognizers/PanGestureRecognizer'),
        TapGestureRecognizer: require('./src/GestureRecognizer/Recognizers/TapGestureRecognizer')
    },
    GestureRecognizerBase: require('./src/GestureRecognizer/GestureRecognizerBase'),
    GestureTouch: require('./src/GestureRecognizer/Touch'),
    GestureRecognizerMixin: require('./src/GestureRecognizer/GestureRecognizerMixin'),
    JSCoreGraphics: require('JSCoreGraphics')
};

module.exports = exports;

