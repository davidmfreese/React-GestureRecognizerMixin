# React-GestureRecognizerMixin
[React-GestureRecognizerMixin](https://github.com/davidmfreese/React-GestureRecognizerMixin) brings UIGestureRecognizer to the web and React.  React Mixin that lets you do simple gesture recognization easily (Pan and Tap recognizers exist) or create your own custom recognizers.

A [PanGestureRecognizer](https://github.com/davidmfreese/React-GestureRecognizerMixin/blob/master/src/GestureRecognizer/Recognizers/PanGestureRecognizer.js) and a [TapGestureRecognizer](https://github.com/davidmfreese/React-GestureRecognizerMixin/blob/master/src/GestureRecognizer/Recognizers/TapGestureRecognizer.js) have been implemented.  The core React component is [GestureRecognizerMixin](https://github.com/davidmfreese/React-GestureRecognizerMixin/blob/master/src/GestureRecognizer/GestureRecognizerMixin.js).

#### Examples:
* [Multi-Gesture Recongization](http://rawgit.com/davidmfreese/React-GestureRecognizerMixin/master/examples/gestureRecognizer-PanAndTap/Example.html)
  * Pan Gesture - Drag the square at will
  * Tap Gesture (1 tap) - Tap the square once and no more and the rectangle will grow
  * Tap Gesture (4 taps) - Tap the square four times in succession and the rectangle will grow

**WARNING** - This project was created to support [React-CollectionView](https://github.com/davidmfreese/React-CollectionView) so there can/will be many breaking changes in the short term.