var TouchProtocol = require('./Protocols/TouchProtocol');

function touchFactory(identifier, touchLocation, target) {
    var now = Date.now();
    var touch = new TouchProtocol({
        identifier: identifier.toString(),
        target: target,
        startLocation: touchLocation,
        lastLocation: touchLocation,
        touchStartTime: now,
        touchLastMoveTime: now,
        touchEndTime: null,
        minX: touchLocation.x,
        maxX: touchLocation.x,
        minY: touchLocation.y,
        maxY: touchLocation.y
    }, true);//Mutable

    return touch;
}
module.exports = touchFactory;
