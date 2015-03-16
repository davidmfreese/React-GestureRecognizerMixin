var t = require('tcomb-validation');
var Models = require('JSCoreGraphics').CoreGraphics.Geometry.DataTypes;

var magnitude = function(x, y) {
    return Math.sqrt(x * x + y * y);
};

var TouchProtocol = t.struct({
    identifier: t.Str,
    target: t.Any,
    startLocation: Models.Point,
    lastLocation: Models.Point,
    touchStartTime: t.Num,
    touchLastMoveTime: t.Num,
    touchEndTime: t.maybe(t.Num),
    maxX: t.Num,
    maxY: t.Num,
    minX: t.Num,
    minY: t.Num
}, 'TouchProtocol');

TouchProtocol.prototype.getTouchDuration = function() {
    return Date.now() - this.touchStartTime;
};

TouchProtocol.prototype.getVelocity = function() {
    var velocity = {
        x: 0,
        y: 0,
        magnitude: 0
    };

    if (this.lastLocation && this.touchLastMoveTime) {
        var deltaX = this.lastLocation.x - this.startLocation.x;
        var deltaY = this.lastLocation.y - this.startLocation.y;
        var deltaT = this.touchLastMoveTime - this.touchStartTime;
        velocity.x = deltaX / deltaT;
        velocity.y = deltaY / deltaT;
        velocity.magnitude = magnitude(deltaX, deltaY);
    }

    return velocity;
};

TouchProtocol.prototype.onMoved = function(newLocation) {
    if(!newLocation) {
        return;
    }
    this.lastLocation = newLocation;
    this.touchLastMoveTime = Date.now();

    if(newLocation.x > this.maxX) {
        this.maxX = newLocation.x;
    }
    if(newLocation.x < this.minX) {
        this.minX = newLocation.x;
    }
    if(newLocation.y > this.maxY) {
        this.maxY = newLocation.y;
    }
    if(newLocation.y < this.minY) {
        this.minY = newLocation.y;
    }
};

TouchProtocol.prototype.onEnded = function(endLocation) {
    this.lastLocation = endLocation;
    this.touchEndTime = Date.now();
};

TouchProtocol.prototype.getCurrentTranslation = function() {
    var deltaX = this.lastLocation.x - this.startLocation.x;
    var deltaY = this.lastLocation.y - this.startLocation.y;

    return new Models.Point({
        x: deltaX,
        y: deltaY
    });
};

//This isn't really correct but... ehh for now
TouchProtocol.prototype.getMaxTranslation = function() {
    var maxXDistance = Math.max(Math.abs(this.minX - this.startLocation.x), Math.abs(this.maxX - this.startLocation.x));
    var maxYDistance = Math.max(Math.abs(this.minY - this.startLocation.y), Math.abs(this.maxY - this.startLocation.y));

    return new Models.Point({
        x: maxXDistance,
        y: maxYDistance
    });
};

module.exports = TouchProtocol;
