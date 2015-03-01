var gestureRecognizer = ReactGestureRecognizer;

var PanGestureRecognizer = gestureRecognizer.Recognizers.PanGestureRecognizer;
var TapGestureRecognizer = gestureRecognizer.Recognizers.TapGestureRecognizer;
var GestureRecognizerMixin = gestureRecognizer.GestureRecognizerMixin;
var GeometryModels = gestureRecognizer.JSCoreGraphics.CoreGraphics.Geometry.DataTypes;

var DragAndTappable = React.createClass({
    mixins: [GestureRecognizerMixin],
    scrollPositionOnMouseDown: undefined,
    getInitialState: function() {
        return {
            top: 0,
            left: 0,
            isExpanded: false,
            isDoubleExpanded: false
        }
    },
    componentWillMount: function() {
        this.gestureRecognizers = [];
    },
    componentDidMount: function() {
        var tapGesture = TapGestureRecognizer();
        tapGesture.addTargetForCallback(this.getDOMNode(), this.handleTapGesture);
        this.gestureRecognizers.push(tapGesture);

        var quadrupleTapGesture = TapGestureRecognizer();
        quadrupleTapGesture.addTargetForCallback(this.getDOMNode(), this.handleTapGesture);
        quadrupleTapGesture.setNumberTapsRequired(4);
        this.gestureRecognizers.push(quadrupleTapGesture);

        //When conflicting Gestures exist you can require that another fails prior
        tapGesture.setRequiresGestureRecognizerToFail(quadrupleTapGesture);

        var panGesture = PanGestureRecognizer();
        panGesture.addTargetForCallback(this.getDOMNode(), this.handlePanGesture);
        this.gestureRecognizers.push(panGesture);

        this.shouldHandleTouchGestures = true;
        this.shouldHandleMouseGestures = true;

        tapGesture.logDebugInfo(true); //comment to hide gesture debug info
        quadrupleTapGesture.logDebugInfo(true); //comment to hide gesture debug info
        panGesture.logDebugInfo(true);  //comment to hide gesture debug info
    },
    render: function() {
        var dragAndTapStyle = {
            height: 75,
            width: 75,
            "background-color": "yellow",
            position: "absolute",
            top: this.state.top,
            left: this.state.left
        };

        if(this.state.isExpanded && !this.state.isDoubleExpanded) {
            dragAndTapStyle.height = 150;
            dragAndTapStyle.width = 150;
        } else if (this.state.isDoubleExpanded) {
            dragAndTapStyle.height = 225;
            dragAndTapStyle.width = 225;
        }

        return React.createElement('div', {style: dragAndTapStyle, ref: "dragAndTap"});
    },
    handlePanGesture: function(gestureRecognizer) {
        var state = gestureRecognizer.getState();
        var touches = gestureRecognizer.getTouches();
        //var domElement = gestureRecognizer.getView(); //TODO: Is it safe to use the DOMElement from the original gesture
        var domElement = this.refs["dragAndTap"].getDOMNode();

        if(!touches || touches.length != 1) {
            return;
        }
        var touch = touches[0];
        var translation = touch.getCurrentTranslation();
        if(touches && touches.length == 1) {
            if (state == "Began") {
                this.scrollPositionOnMouseDown = new GeometryModels.Point({
                    x: domElement.offsetLeft,
                    y: domElement.offsetTop
                });
            } else if(state == "Changed" && this.scrollPositionOnMouseDown) {
                var velocity = touch.getVelocity();
                var x = this.scrollPositionOnMouseDown.x + translation.x;
                var y = this.scrollPositionOnMouseDown.y + translation.y;
                this.setState({
                    top: y,
                    left: x
                });
            } else if(state == "Ended") {
                //NO OP
            } else {
                this.scrollPositionOnMouseDown = undefined;
            }
        }

    },
    handleTapGesture: function(gestureRecognizer) {
        var state = gestureRecognizer.getState();
        if(state == "Ended") {
            var isExpanded = gestureRecognizer.getNumberOfTaps() == 1;
            var isDoubleExpanded = gestureRecognizer.getNumberOfTaps() == 4;
            if(isExpanded) {
                this.setState({
                    isExpanded: !this.state.isExpanded,
                    isDoubleExpanded: this.state.isDoubleExpanded
                });
            } else if (isDoubleExpanded) {
                this.setState({
                    isExpanded: this.state.isExpanded,
                    isDoubleExpanded: !this.state.isDoubleExpanded
                });
            } else {
                this.setState({
                    isExpanded: false,
                    isDoubleExpanded: false
                });
            }
        }
    }
});

var containerStyle = {
    height: window.innerHeight,
    width: window.innerWidth
};

var Container = React.createElement('div', {style: containerStyle}, React.createElement(DragAndTappable));
React.render(Container, document.getElementById('reactContainer'));