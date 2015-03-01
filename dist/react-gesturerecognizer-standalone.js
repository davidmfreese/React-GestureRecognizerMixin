!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ReactGestureRecognizer=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{"./src/GestureRecognizer/Delegates/GestureRecognizerDelegate":17,"./src/GestureRecognizer/Enums/GestureRecognizerEnums":18,"./src/GestureRecognizer/GestureRecognizerBase":19,"./src/GestureRecognizer/GestureRecognizerMixin":20,"./src/GestureRecognizer/Protocols/GestureRecognizerProtocol":21,"./src/GestureRecognizer/Protocols/TouchProtocol":22,"./src/GestureRecognizer/Recognizers/PanGestureRecognizer":23,"./src/GestureRecognizer/Recognizers/TapGestureRecognizer":24,"./src/GestureRecognizer/Touch":25,"JSCoreGraphics":2}],2:[function(require,module,exports){
var CoreGraphics = {};
var Foundation = {};
var Kit = require('./src/Kit/Kit');

CoreGraphics.Geometry = require('./src/CoreGraphics/Geometry/Geometry');
CoreGraphics.Geometry.DataTypes = {
    Point: require('./src/CoreGraphics/Geometry/DataTypes/Point'),
    Size: require('./src/CoreGraphics/Geometry/DataTypes/Size'),
    Rect: require('./src/CoreGraphics/Geometry/DataTypes/Rect'),
    Vector: require('./src/CoreGraphics/Geometry/DataTypes/Vector')
};
CoreGraphics.Geometry.Constants = require('./src/CoreGraphics/Geometry/GeometryConstants');

Foundation.DataTypes = {
    IndexPath: require('./src/Foundation/DataTypes/IndexPath')
};

Kit.DataTypes = {
    IndexPath: require('./src/Kit/DataTypes/EdgeInsets')
};
Kit.KitConstants = {
    IndexPath: require('./src/Kit/KitConstants')
};

module.exports = {
    CoreGraphics: CoreGraphics,
    Foundation: Foundation,
    Kit: Kit
};
},{"./src/CoreGraphics/Geometry/DataTypes/Point":3,"./src/CoreGraphics/Geometry/DataTypes/Rect":4,"./src/CoreGraphics/Geometry/DataTypes/Size":5,"./src/CoreGraphics/Geometry/DataTypes/Vector":6,"./src/CoreGraphics/Geometry/Geometry":7,"./src/CoreGraphics/Geometry/GeometryConstants":8,"./src/Foundation/DataTypes/IndexPath":9,"./src/Kit/DataTypes/EdgeInsets":10,"./src/Kit/Kit":11,"./src/Kit/KitConstants":12}],3:[function(require,module,exports){
var t = require('tcomb-validation');

var Point = t.struct({
    x: t.Num,
    y: t.Num
}, 'Point');

module.exports = Point;
},{"tcomb-validation":13}],4:[function(require,module,exports){
var t = require('tcomb-validation');
var Size = require('./Size');
var Point = require('./Point');

var Rect = t.struct({
    origin: Point,
    size: Size
}, 'Frame');

module.exports = Rect;

},{"./Point":3,"./Size":5,"tcomb-validation":13}],5:[function(require,module,exports){
var t = require('tcomb-validation');

var Size = t.struct({
    height: t.Num,
    width: t.Num
}, 'Size', true);

//var SizeFuncs = t.struct({
//    isSizeZero: t.func(Size, t.Bool)
//});
//
//Size = Size.extend(SizeFuncs);
//
//Size.prototype.isSizeZero = function(size) {
//    return size.height = 0 && size.width == 0;
//}

module.exports = Size;

},{"tcomb-validation":13}],6:[function(require,module,exports){
var t = require('tcomb-validation');

var Vector = t.struct({
    dx: t.Num,
    dy: t.Num
}, 'Vector');

module.exports = Vector;
},{"tcomb-validation":13}],7:[function(require,module,exports){
var tcombValidate = require('tcomb-validation');

var Point = require('./DataTypes/Point');
var Size = require('./DataTypes/Size');
var Rect = require('./DataTypes/Rect');
var Vector = require('./DataTypes/Vector');
var Constants = require('./GeometryConstants');

var Geometry = {};

Geometry.shouldValidate = false;

Geometry.pointMake = function(x, y) {
    if(this.shouldValidate) { t.validate(x, t.Num); t.validate(y, t.Num);}
    return new Point({
        x: x,
        y: y
    });
};
Geometry.sizeMake = function(width, height) {
    if(this.shouldValidate) { t.validate(width, t.Num); t.validate(height, t.Num); }
    return new Size({
        width: width,
        height: height
    });
};
Geometry.rectMake = function(x, y, width, height) {
    return new Rect({
        origin: this.pointMake(x, y),
        size: this.sizeMake(width, height)
    });
};

Geometry.pointEqualToPoint = function(point1, point2) {
    if(this.shouldValidate) { Point.is(point1); Point.is(point2); }
    return point1.x == point2.x && point1.y == point2.y;
};
Geometry.sizeEqualToSize = function(size1, size2) {
    if(this.shouldValidate) { Size.is(size1); Size.is(size2); }
    return size1.width == size2.width && size1.height == size2.height;
};
Geometry.rectEqualToRect = function(rect1, rect2) {
    if(this.shouldValidate) { Rect.is(rect1); Rect.is(rect1); }
    return this.pointEqualToPoint(rect1.origin, rect2.orgin) && this.sizeEqualToSize(rect1.size, rect2.size);
};

Geometry.rectGetMinX = function(rect) {
    if(this.shouldValidate) { Rect.is(rect); }
    return rect.origin.x;
};
Geometry.rectGetMaxX = function(rect) {
    if(this.shouldValidate) { Rect.is(rect); }
    return rect.origin.x + rect.size.width;
};
Geometry.rectGetMinY = function(rect) {
    if(this.shouldValidate) { Rect.is(rect); }
    return rect.origin.y;
};
Geometry.rectGetMaxY = function(rect) {
    if(this.shouldValidate) { Rect.is(rect); }
    return rect.origin.y + rect.size.height;
};
Geometry.rectGetMidX = function(rect) {
    if(this.shouldValidate) { Rect.is(rect); }
    return this.rectGetMinX(rect) + rect.size.width/2;
};
Geometry.rectGetMidY = function(rect) {
    if(this.shouldValidate) { Rect.is(rect); }
    return this.rectGetMinY(rect) + rect.size.height/2;
};

Geometry.rectContainsPoint = function(rect, point) {
    if(this.shouldValidate) { Rect.is(rect); Point.is(point); }
    var minX = this.rectGetMinX(rect);
    var maxX = this.rectGetMaxX(rect);
    var minY = this.rectGetMinY(rect);
    var maxY = this.rectGetMaxY(rect);

    return !(point.x < minX || point.x > maxX || point.y < minY || point.y > maxY);
};
Geometry.rectContainsRect = function(rect, possibleInnerRect) {
    if(this.shouldValidate) { Rect.is(rect); Rect.is(possibleInnerRect); }
    var minX = this.rectGetMinX(possibleInnerRect);
    var maxX = this.rectGetMaxX(possibleInnerRect);
    var minY = this.rectGetMinY(possibleInnerRect);
    var maxY = this.rectGetMaxY(possibleInnerRect);

    var upperLeftPoint = possibleInnerRect.origin;
    var lowerLeftPoint = new Point({
        x: this.rectGetMaxX(possibleInnerRect),
        y: this.rectGetMaxY(possibleInnerRect)
    });

    return this.rectContainsPoint(rect, upperLeftPoint) && this.rectContainsPoint(rect, lowerLeftPoint);
};

Geometry.isPointZero = function(point) {
    if(this.shouldValidate) { Point.is(point); }
    return this.pointEqualToPoint(point, Constants.pointZero);
}
Geometry.isSizeZero = function(size) {
    if(this.shouldValidate) { Size.is(size); }
    return this.sizeEqualToSize(size, Constants.sizeZero);
}
Geometry.isRectZero = function(rect) {
    if(this.shouldValidate) { Rect.is(rect); }
    return this.rectEqualToRect(rect, Constants.rectZero);
};

//TODO: Should this include Contains?
Geometry.rectIntersectsRect = function(rect1, rect2) {
    var intersects =
        !(
            rect1.origin.x + rect1.size.width < rect2.origin.x
            || rect2.origin.x + rect2.size.width < rect1.origin.x
            || rect1.origin.y + rect1.size.height < rect2.origin.y
            || rect2.origin.y + rect2.size.height < rect1.origin.y
        );

    return intersects || this.rectContainsRect(rect2, rect1);
};

module.exports = Geometry;
},{"./DataTypes/Point":3,"./DataTypes/Rect":4,"./DataTypes/Size":5,"./DataTypes/Vector":6,"./GeometryConstants":8,"tcomb-validation":13}],8:[function(require,module,exports){
var Point = require('./DataTypes/Point');
var Size = require('./DataTypes/Size');
var Rect = require('./DataTypes/Rect');

var POINT_ZERO = new Point({x: 0, y: 0});
var SIZE_ZERO = new Size({height:0, width:0});
var RECT_ZERO = new Rect({
    origin: POINT_ZERO,
    size: SIZE_ZERO
});

var GeometryConstants = {};

GeometryConstants.pointZero = POINT_ZERO;

GeometryConstants.sizeZero = SIZE_ZERO;

GeometryConstants.rectZero = RECT_ZERO;

module.exports = GeometryConstants;
},{"./DataTypes/Point":3,"./DataTypes/Rect":4,"./DataTypes/Size":5}],9:[function(require,module,exports){
var t = require('tcomb-validation');

var IndexPath = t.struct({
    row: t.Num,
    section: t.maybe(t.Num)
}, 'IndexPath');

module.exports = IndexPath;


},{"tcomb-validation":13}],10:[function(require,module,exports){
var t = require('tcomb-validation');

var EdgeInsets = t.struct({
    "top": t.Num,
    "left": t.Num,
    "bottom": t.Num,
    "right": t.Num
}, 'EdgeInsets');

module.exports = EdgeInsets;


},{"tcomb-validation":13}],11:[function(require,module,exports){
var EdgeInsets = require('./DataTypes/EdgeInsets');
var Constants = require('./KitConstants');
var Kit = {};

Kit.edgeInsetsZero = Constants.INSETS_ZERO;

Kit.edgeInsetsMake = function(left, top, right, bottom) {
    return new EdgeInsets({
        left: left,
        top: top,
        right: right,
        bottom: bottom
    });
};

module.exports = Kit;
},{"./DataTypes/EdgeInsets":10,"./KitConstants":12}],12:[function(require,module,exports){
var EdgeInsets = require('./DataTypes/EdgeInsets');

var INSETS_ZERO = new EdgeInsets({top: 0, bottom: 0, left: 0, right: 0});

var KitConstants = {};
KitConstants.INSETS_ZERO = INSETS_ZERO;

module.exports = KitConstants;


},{"./DataTypes/EdgeInsets":10}],13:[function(require,module,exports){
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['tcomb'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('tcomb'));
  } else {
    root.t = factory(root.t);
  }
}(this, function (t) {

  'use strict';

  var Any = t.Any;
  var Obj = t.Obj;
  var Str = t.Str;
  var Arr = t.Arr;
  var struct = t.struct;
  var list = t.list;
  var format = t.util.format;

  //
  // domain model
  //

  var ValidationError = struct({
    message: Str,
    actual: Any,
    expected: t.Type,
    path: list(t.union([Str, t.Num]))
  }, 'ValidationError');

  function getDefaultMessage(actual, expected, path) {
    return format('%s is `%j` should be a `%s`', '/' + path.join('/'), actual, expected.meta.name);
  }

  ValidationError.of = function of(actual, expected, path) {
    return new ValidationError({
      message: getDefaultMessage(actual, expected, path),
      actual: actual,
      expected: expected,
      path: path
    });
  };

  var ValidationResult = struct({
    errors: list(ValidationError),
    value: Any
  }, 'ValidationResult');

  ValidationResult.prototype.isValid = function isValid() {
    return !(this.errors.length);
  };

  ValidationResult.prototype.firstError = function firstError() {
    return this.isValid() ? null : this.errors[0];
  };

  ValidationResult.prototype.toString = function toString() {
    return this.isValid() ?
      format('[ValidationResult, true, %j]', this.value) :
      format('[ValidationResult, false, (%s)]', this.errors.map(function errorToString(err) {
        return err.message;
      }).join(', '));
  };

  //
  // validate
  //

  function validate(x, type) {
    return new ValidationResult(recurse(x, type, []));
  }

  function recurse(x, type, path) {
    var kind = t.util.getKind(type);
    return validators[kind](x, type, path);
  }

  var validators = validate.validators = {};

  // irreducibles and enums
  validators.irreducible =
  validators.enums = function validateIrreducible(x, type, path) {
    return {
      value: x,
      errors: type.is(x) ? [] : [ValidationError.of(x, type, path)]
    };
  };

  validators.list = function validateList(x, type, path) {

    // x should be an array
    if (!Arr.is(x)) {
      return {value: x, errors: [ValidationError.of(x, type, path)]};
    }

    var ret = {value: [], errors: []};
    // every item should be of type `type.meta.type`
    for (var i = 0, len = x.length ; i < len ; i++ ) {
      var item = recurse(x[i], type.meta.type, path.concat(i));
      ret.value[i] = item.value;
      ret.errors = ret.errors.concat(item.errors);
    }
    return ret;
  };

  validators.subtype = function validateSubtype(x, type, path) {

    // x should be a valid inner type
    var ret = recurse(x, type.meta.type, path);
    if (ret.errors.length) {
      return ret;
    }

    // x should satisfy the predicate
    if (!type.meta.predicate(ret.value)) {
      ret.errors = [ValidationError.of(x, type, path)];
    }

    return ret;

  };

  validators.maybe = function validateMaybe(x, type, path) {
    return t.Nil.is(x) ?
      {value: null, errors: []} :
      recurse(x, type.meta.type, path);
  };

  validators.struct = function validateStruct(x, type, path) {

    // x should be an object
    if (!Obj.is(x)) {
      return {value: x, errors: [ValidationError.of(x, type, path)]};
    }

    // [optimization]
    if (type.is(x)) {
      return {value: x, errors: []};
    }

    var ret = {value: {}, errors: []};
    var props = type.meta.props;
    // every item should be of type `props[name]`
    for (var name in props) {
      if (props.hasOwnProperty(name)) {
        var prop = recurse(x[name], props[name], path.concat(name));
        ret.value[name] = prop.value;
        ret.errors = ret.errors.concat(prop.errors);
      }
    }
    if (!ret.errors.length) {
      ret.value = new type(ret.value);
    }
    return ret;
  };

  validators.tuple = function validateTuple(x, type, path) {

    var types = type.meta.types;
    var len = types.length;

    // x should be an array of at most `len` items
    if (!Arr.is(x) || x.length > len) {
      return {value: x, errors: [ValidationError.of(x, type, path)]};
    }

    var ret = {value: [], errors: []};
    // every item should be of type `types[i]`
    for (var i = 0 ; i < len ; i++ ) {
      var item = recurse(x[i], types[i], path.concat(i));
      ret.value[i] = item.value;
      ret.errors = ret.errors.concat(item.errors);
    }
    return ret;
  };

  validators.dict = function validateDict(x, type, path) {

    // x should be an object
    if (!Obj.is(x)) {
      return {value: x, errors: [ValidationError.of(x, type, path)]};
    }

    var ret = {value: {}, errors: []};
    // every key should be of type `domain`
    // every value should be of type `codomain`
    for (var k in x) {
      if (x.hasOwnProperty(k)) {
        path = path.concat(k);
        var key = recurse(k, type.meta.domain, path);
        var item = recurse(x[k], type.meta.codomain, path);
        ret.value[k] = item.value;
        ret.errors = ret.errors.concat(key.errors, item.errors);
      }
    }
    return ret;
  };

  validators.union = function validateUnion(x, type, path) {
    var ctor = type.dispatch(x);
    return t.Func.is(ctor)?
      recurse(x, ctor, path.concat(type.meta.types.indexOf(ctor))) :
      {value: x, errors: [ValidationError.of(x, type, path)]};
  };

  // exports
  t.util.mixin(t, {
    ValidationError: ValidationError,
    ValidationResult: ValidationResult,
    validate: validate
  });

  return t;

}));

},{"tcomb":14}],14:[function(require,module,exports){
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.t = factory();
  }
}(this, function () {

  'use strict';

  var failed = false;

  function onFail(message) {
    // start debugger only once
    if (!failed) {
      /*
        DEBUG HINT:
        if you are reading this, chances are that there is a bug in your system
        see the Call Stack to find out what's wrong..
      */
      /*jshint debug: true*/
      debugger;
    }
    failed = true;
    throw new Error(message);
  }

  var options = {
    onFail: onFail
  };

  function fail(message) {
    /*
      DEBUG HINT:
      if you are reading this, chances are that there is a bug in your system
      see the Call Stack to find out what's wrong..
    */
    options.onFail(message);
  }

  function assert(guard) {
    if (guard !== true) {
      var args = slice.call(arguments, 1);
      var message = args[0] ? format.apply(null, args) : 'assert failed';
      /*
        DEBUG HINT:
        if you are reading this, chances are that there is a bug in your system
        see the Call Stack to find out what's wrong..
      */
      fail(message);
    }
  }

  //
  // utils
  //

  var slice = Array.prototype.slice;

  function mixin(target, source, overwrite) {
    if (Nil.is(source)) {
      return target;
    }
    for (var k in source) {
      if (source.hasOwnProperty(k)) {
        if (overwrite !== true) {
          assert(!target.hasOwnProperty(k), 'Cannot overwrite property %s', k);
        }
        target[k] = source[k];
      }
    }
    return target;
  }

  function format() {
    var args = slice.call(arguments);
    var len = args.length;
    var i = 1;
    var message = args[0];

    function formatArgument(match, type) {
      if (match === '%%') { return '%'; }       // handle escaping %
      if (i >= len) { return match; }           // handle less arguments than placeholders
      var formatter = format.formatters[type];
      if (!formatter) { return match; }         // handle undefined formatters
      return formatter(args[i++]);
    }

    var str = message.replace(/%([a-z%])/g, formatArgument);
    if (i < len) {
      str += ' ' + args.slice(i).join(' ');     // handle more arguments than placeholders
    }
    return str;
  }

  function replacer(key, value) {
    if (typeof value === 'function') {
      return format('Func', value.name);
    }
    return value;
  }

  format.formatters = {
    s: function formatString(x) { return String(x); },
    j: function formatJSON(x) {
      try {
        return JSON.stringify(x, replacer);
      } catch (e) {
        return String(x);
      }
    }
  };

  function getName(type) {
    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `getName()`', type);
    return type.meta.name;
  }

  function getFunctionName(f) {
    assert(typeof f === 'function', 'Invalid argument `f` = `%s` supplied to `getFunctionName()`', f);
    return f.displayName || f.name || format('<function%s>', f.length);
  }

  function getKind(type) {
    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `geKind()`', type);
    return type.meta.kind;
  }

  function blockNew(x, type) {
    assert(!(x instanceof type), 'Operator `new` is forbidden for type `%s`', getName(type));
  }

  function shallowCopy(x) {
    return Arr.is(x) ? x.concat() : Obj.is(x) ? mixin({}, x) : x;
  }

  function update(instance, spec) {
    assert(Obj.is(spec));
    var value = shallowCopy(instance);
    for (var k in spec) {
      if (spec.hasOwnProperty(k)) {
        if (update.commands.hasOwnProperty(k)) {
          assert(Object.keys(spec).length === 1);
          return update.commands[k](spec[k], value);
        } else {
          value[k] = update(value[k], spec[k]);
        }
      }
    }
    return value;
  }

  update.commands = {
    '$apply': function $apply(f, value) {
      assert(Func.is(f));
      return f(value);
    },
    '$push': function $push(elements, arr) {
      assert(Arr.is(elements));
      assert(Arr.is(arr));
      return arr.concat(elements);
    },
    '$remove': function $remove(keys, obj) {
      assert(Arr.is(keys));
      assert(Obj.is(obj));
      for (var i = 0, len = keys.length ; i < len ; i++ ) {
        delete obj[keys[i]];
      }
      return obj;
    },
    '$set': function $set(value) {
      return value;
    },
    '$splice': function $splice(splices, arr) {
      assert(list(Arr).is(splices));
      assert(Arr.is(arr));
      return splices.reduce(function reducer(acc, splice) {
        acc.splice.apply(acc, splice);
        return acc;
      }, arr);
    },
    '$swap': function $swap(config, arr) {
      assert(Obj.is(config));
      assert(Num.is(config.from));
      assert(Num.is(config.to));
      assert(Arr.is(arr));
      var element = arr[config.to];
      arr[config.to] = arr[config.from];
      arr[config.from] = element;
      return arr;
    },
    '$unshift': function $unshift(elements, arr) {
      assert(Arr.is(elements));
      assert(Arr.is(arr));
      return elements.concat(arr);
    },
    '$merge': function (obj, value) {
      return mixin(mixin({}, value), obj, true);
    }
  };

  //
  // irreducibles
  //

  function irreducible(name, is) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a string
    assert(typeof name === 'string', 'Invalid argument `name` = `%s` supplied to `irreducible()`', name);

    // DEBUG HINT: if the debugger stops here, the second argument is not a function
    assert(typeof is === 'function', 'Invalid argument `is` = `%s` supplied to `irreducible()`', is);

    function Irreducible(value) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden
      blockNew(this, Irreducible);

      // DEBUG HINT: if the debugger stops here, the first argument is invalid
      // mouse over the `value` variable to see what's wrong. In `name` there is the name of the type
      assert(is(value), 'Invalid argument `value` = `%s` supplied to irreducible type `%s`', value, name);

      return value;
    }

    Irreducible.meta = {
      kind: 'irreducible',
      name: name
    };

    Irreducible.displayName = name;

    Irreducible.is = is;

    return Irreducible;
  }

  var Any = irreducible('Any', function isAny() {
    return true;
  });

  var Nil = irreducible('Nil', function isNil(x) {
    return x === null || x === void 0;
  });

  var Str = irreducible('Str', function isStr(x) {
    return typeof x === 'string';
  });

  var Num = irreducible('Num', function isNum(x) {
    return typeof x === 'number' && isFinite(x) && !isNaN(x);
  });

  var Bool = irreducible('Bool', function isBool(x) {
    return x === true || x === false;
  });

  var Arr = irreducible('Arr', function isArr(x) {
    return x instanceof Array;
  });

  var Obj = irreducible('Obj', function isObj(x) {
    return !Nil.is(x) && typeof x === 'object' && !Arr.is(x);
  });

  var Func = irreducible('Func', function isFunc(x) {
    return typeof x === 'function';
  });

  var Err = irreducible('Err', function isErr(x) {
    return x instanceof Error;
  });

  var Re = irreducible('Re', function isRe(x) {
    return x instanceof RegExp;
  });

  var Dat = irreducible('Dat', function isDat(x) {
    return x instanceof Date;
  });

  var Type = irreducible('Type', function isType(x) {
    return Func.is(x) && Obj.is(x.meta);
  });

  function struct(props, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a dict of types
    // mouse over the `props` variable to see what's wrong
    assert(dict(Str, Type).is(props), 'Invalid argument `props` = `%s` supplied to `struct` combinator', props);

    // DEBUG HINT: if the debugger stops here, the second argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `struct` combinator', name);

    // DEBUG HINT: always give a name to a type, the debug will be easier
    name = name || format('{%s}', Object.keys(props).map(function (prop) {
      return format('%s: %s', prop, getName(props[prop]));
    }).join(', '));

    function Struct(value, mut) {

      // makes Struct idempotent
      if (Struct.is(value)) {
        return value;
      }

      // DEBUG HINT: if the debugger stops here, the first argument is invalid
      // mouse over the `value` variable to see what's wrong. In `name` there is the name of the type
      assert(Obj.is(value), 'Invalid argument `value` = `%s` supplied to struct type `%s`', value, name);

      // makes `new` optional
      if (!(this instanceof Struct)) {
        return new Struct(value, mut);
      }

      for (var k in props) {
        if (props.hasOwnProperty(k)) {
          var expected = props[k];
          var actual = value[k];
          // DEBUG HINT: if the debugger stops here, the `actual` value supplied to the `expected` type is invalid
          // mouse over the `actual` and `expected` variables to see what's wrong
          this[k] = expected(actual, mut);
        }
      }

      if (mut !== true) {
        Object.freeze(this);
      }
    }

    Struct.meta = {
      kind: 'struct',
      props: props,
      name: name
    };

    Struct.displayName = name;

    Struct.is = function isStruct(x) {
      return x instanceof Struct;
    };

    Struct.update = function updateStruct(instance, spec, value) {
      return new Struct(update(instance, spec, value));
    };

    Struct.extend = function extendStruct(arr, name) {
      arr = [].concat(arr).map(function (x) {
        return Obj.is(x) ? x : x.meta.props;
      });
      arr.unshift(props);
      var ret = struct(arr.reduce(mixin, {}), name);
      mixin(ret.prototype, Struct.prototype); // prototypal inheritance
      return ret;
    };

    return Struct;
  }

  function union(types, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a list of types
    assert(list(Type).is(types), 'Invalid argument `types` = `%s` supplied to `union` combinator', types);

    var len = types.length;
    var defaultName = types.map(getName).join(' | ');

    // DEBUG HINT: if the debugger stops here, there are too few types (they must be at least two)
    assert(len >= 2, 'Invalid argument `types` = `%s` supplied to `union` combinator, provide at least two types', defaultName);

    // DEBUG HINT: if the debugger stops here, the second argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `union` combinator', name);

    name = name || defaultName;

    function Union(value, mut) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden
      blockNew(this, Union);

      // DEBUG HINT: if the debugger stops here, you must implement the `dispatch` static method for this type
      assert(Func.is(Union.dispatch), 'Unimplemented `dispatch()` function for union type `%s`', name);

      var type = Union.dispatch(value);

      // DEBUG HINT: if the debugger stops here, the `dispatch` static method returns no type
      assert(Type.is(type), 'The `dispatch()` function of union type `%s` returns no type constructor', name);

      // DEBUG HINT: if the debugger stops here, `value` can't be converted to `type`
      // mouse over the `value` and `type` variables to see what's wrong
      return type(value, mut);
    }

    Union.meta = {
      kind: 'union',
      types: types,
      name: name
    };

    Union.displayName = name;

    Union.is = function isUnion(x) {
      return types.some(function isType(type) {
        return type.is(x);
      });
    };

    // default dispatch implementation
    Union.dispatch = function dispatch(x) {
      for (var i = 0, len = types.length ; i < len ; i++ ) {
        if (types[i].is(x)) {
          return types[i];
        }
      }
    };

    return Union;
  }

  function maybe(type, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a type
    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `maybe` combinator', type);

    // makes the combinator idempotent and handle Any, Nil
    if (getKind(type) === 'maybe' || type === Any || type === Nil) {
      return type;
    }

    // DEBUG HINT: if the debugger stops here, the second argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(Nil.is(name) || Str.is(name), 'Invalid argument `name` = `%s` supplied to `maybe` combinator', name);

    name = name || ('?' + getName(type));

    function Maybe(value, mut) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden
      blockNew(this, Maybe);

      // DEBUG HINT: if the debugger stops here, `value` can't be converted to `type`
      // mouse over the `value` and `type` variables to see what's wrong
      return Nil.is(value) ? null : type(value, mut);
    }

    Maybe.meta = {
      kind: 'maybe',
      type: type,
      name: name
    };

    Maybe.displayName = name;

    Maybe.is = function isMaybe(x) {
      return Nil.is(x) || type.is(x);
    };

    return Maybe;
  }

  function enums(map, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a hash
    // mouse over the `map` variable to see what's wrong
    assert(Obj.is(map), 'Invalid argument `map` = `%s` supplied to `enums` combinator', map);

    // DEBUG HINT: if the debugger stops here, the second argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `enums` combinator', name);

    // cache enums
    var keys = Object.keys(map);

    name = name || keys.map(function (k) { return JSON.stringify(k); }).join(' | ');

    function Enums(value) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden
      blockNew(this, Enums);

      // DEBUG HINT: if the debugger stops here, the value is not one of the defined enums
      // mouse over the `value`, `name` and `keys` variables to see what's wrong
      assert(Enums.is(value), 'Invalid argument `value` = `%s` supplied to enums type `%s`, expected one of %j', value, name, keys);

      return value;
    }

    Enums.meta = {
      kind: 'enums',
      map: map,
      name: name
    };

    Enums.displayName = name;

    Enums.is = function isEnums(x) {
      return Str.is(x) && map.hasOwnProperty(x);
    };

    return Enums;
  }

  enums.of = function enumsOf(keys, name) {
    keys = Str.is(keys) ? keys.split(' ') : keys;
    var value = {};
    keys.forEach(function setEnum(k) {
      value[k] = k;
    });
    return enums(value, name);
  };

  function tuple(types, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a list of types
    assert(list(Type).is(types), 'Invalid argument `types` = `%s` supplied to `tuple` combinator', types);

    var len = types.length;

    // DEBUG HINT: if the debugger stops here, the second argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `tuple` combinator', name);

    name = name || format('[%s]', types.map(getName).join(', '));

    function Tuple(value, mut) {

      // DEBUG HINT: if the debugger stops here, the value is not one of the defined enums
      // mouse over the `value`, `name` and `len` variables to see what's wrong
      assert(Arr.is(value) && value.length === len, 'Invalid argument `value` = `%s` supplied to tuple type `%s`, expected an `Arr` of length `%s`', value, name, len);

      var frozen = (mut !== true);

      // makes Tuple idempotent
      if (Tuple.isTuple(value) && Object.isFrozen(value) === frozen) {
        return value;
      }

      var arr = [];
      for (var i = 0 ; i < len ; i++) {
        var expected = types[i];
        var actual = value[i];
        // DEBUG HINT: if the debugger stops here, the `actual` value supplied to the `expected` type is invalid
        // mouse over the `actual` and `expected` variables to see what's wrong
        arr.push(expected(actual, mut));
      }

      if (frozen) {
        Object.freeze(arr);
      }
      return arr;
    }

    Tuple.meta = {
      kind: 'tuple',
      types: types,
      length: len,
      name: name
    };

    Tuple.displayName = name;

    Tuple.isTuple = function isTuple(x) {
      return types.every(function isType(type, i) {
        return type.is(x[i]);
      });
    };

    Tuple.is = function isTuple(x) {
      return Arr.is(x) && x.length === len && Tuple.isTuple(x);
    };

    Tuple.update = function updateTuple(instance, spec, value) {
      return Tuple(update(instance, spec, value));
    };

    return Tuple;
  }

  function subtype(type, predicate, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a type
    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `subtype` combinator', type);

    // DEBUG HINT: if the debugger stops here, the second argument is not a function
    assert(Func.is(predicate), 'Invalid argument `predicate` = `%s` supplied to `subtype` combinator', predicate);

    // DEBUG HINT: if the debugger stops here, the third argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `subtype` combinator', name);

    // DEBUG HINT: always give a name to a type, the debug will be easier
    name = name || format('{%s | %s}', getName(type), getFunctionName(predicate));

    function Subtype(value, mut) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden
      blockNew(this, Subtype);

      // DEBUG HINT: if the debugger stops here, the value cannot be converted to the base type
      var x = type(value, mut);

      // DEBUG HINT: if the debugger stops here, the value is converted to the base type
      // but the predicate returns `false`
      assert(predicate(x), 'Invalid argument `value` = `%s` supplied to subtype type `%s`', value, name);
      return x;
    }

    Subtype.meta = {
      kind: 'subtype',
      type: type,
      predicate: predicate,
      name: name
    };

    Subtype.displayName = name;

    Subtype.is = function isSubtype(x) {
      return type.is(x) && predicate(x);
    };

    Subtype.update = function updateSubtype(instance, spec, value) {
      return Subtype(update(instance, spec, value));
    };

    return Subtype;
  }

  function list(type, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a type
    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `list` combinator', type);

    // DEBUG HINT: if the debugger stops here, the third argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `list` combinator', name);

    // DEBUG HINT: always give a name to a type, the debug will be easier
    name = name || format('Array<%s>', getName(type));

    function List(value, mut) {

      // DEBUG HINT: if the debugger stops here, you have used the `new` operator but it's forbidden

      // DEBUG HINT: if the debugger stops here, the value is not one of the defined enums
      // mouse over the `value` and `name` variables to see what's wrong
      assert(Arr.is(value), 'Invalid argument `value` = `%s` supplied to list type `%s`', value, name);

      var frozen = (mut !== true);

      // makes List idempotent
      if (List.isList(value) && Object.isFrozen(value) === frozen) {
        return value;
      }

      var arr = [];
      for (var i = 0, len = value.length ; i < len ; i++ ) {
        var actual = value[i];
        // DEBUG HINT: if the debugger stops here, the `actual` value supplied to the `type` type is invalid
        // mouse over the `actual` and `type` variables to see what's wrong
        arr.push(type(actual, mut));
      }

      if (frozen) {
        Object.freeze(arr);
      }
      return arr;
    }

    List.meta = {
      kind: 'list',
      type: type,
      name: name
    };

    List.displayName = name;

    List.isList = function isList(x) {
      return x.every(type.is);
    };

    List.is = function isList(x) {
      return Arr.is(x) && List.isList(x);
    };

    List.update = function updateList(instance, spec, value) {
      return List(update(instance, spec, value));
    };

    return List;
  }

  function dict(domain, codomain, name) {

    // DEBUG HINT: if the debugger stops here, the first argument is not a type
    assert(Type.is(domain), 'Invalid argument `domain` = `%s` supplied to `dict` combinator', domain);

    // DEBUG HINT: if the debugger stops here, the second argument is not a type
    assert(Type.is(codomain), 'Invalid argument `codomain` = `%s` supplied to `dict` combinator', codomain);

    // DEBUG HINT: if the debugger stops here, the third argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `dict` combinator', name);

    // DEBUG HINT: always give a name to a type, the debug will be easier
    name = name || format('{[key:%s]: %s}', getName(domain), getName(codomain));

    function Dict(value, mut) {

      // DEBUG HINT: if the debugger stops here, the value is not an object
      // mouse over the `value` and `name` variables to see what's wrong
      assert(Obj.is(value), 'Invalid argument `value` = `%s` supplied to dict type `%s`', value, name);

      var frozen = (mut !== true);

      // makes Dict idempotent
      if (Dict.isDict(value) && Object.isFrozen(value) === frozen) {
        return value;
      }

      var obj = {};
      for (var k in value) {
        if (value.hasOwnProperty(k)) {
          // DEBUG HINT: if the debugger stops here, the `k` value supplied to the `domain` type is invalid
          // mouse over the `k` and `domain` variables to see what's wrong
          k = domain(k);
          var actual = value[k];
          // DEBUG HINT: if the debugger stops here, the `actual` value supplied to the `codomain` type is invalid
          // mouse over the `actual` and `codomain` variables to see what's wrong
          obj[k] = codomain(actual, mut);
        }
      }

      if (frozen) {
        Object.freeze(obj);
      }
      return obj;
    }

    Dict.meta = {
      kind: 'dict',
      domain: domain,
      codomain: codomain,
      name: name
    };

    Dict.displayName = name;

    Dict.isDict = function isDict(x) {
      for (var k in x) {
        if (x.hasOwnProperty(k)) {
          if (!domain.is(k) || !codomain.is(x[k])) { return false; }
        }
      }
      return true;
    };

    Dict.is = function isDict(x) {
      return Obj.is(x) && Dict.isDict(x);
    };


    Dict.update = function updateDict(instance, spec, value) {
      return Dict(update(instance, spec, value));
    };

    return Dict;
  }

  function func(domain, codomain, name) {

    // handle handy syntax for unary functions
    domain = Arr.is(domain) ? domain : [domain];

    // DEBUG HINT: if the debugger stops here, the first argument is not a list of types
    assert(list(Type).is(domain), 'Invalid argument `domain` = `%s` supplied to `func` combinator', domain);

    // DEBUG HINT: if the debugger stops here, the second argument is not a type
    assert(Type.is(codomain), 'Invalid argument `codomain` = `%s` supplied to `func` combinator', codomain);

    // DEBUG HINT: if the debugger stops here, the third argument is not a string
    // mouse over the `name` variable to see what's wrong
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `func` combinator', name);

    // DEBUG HINT: always give a name to a type, the debug will be easier
    name = name || format('(%s) -> %s', domain.map(getName).join(', '), getName(codomain));

    // cache the domain length
    var domainLen = domain.length;

    function Func(value) {

      // automatically instrument the function if is not already instrumented
      if (!func.is(value)) {
        value = Func.of(value);
      }

      // DEBUG HINT: if the debugger stops here, the first argument is invalid
      // mouse over the `value` and `name` variables to see what's wrong
      assert(Func.is(value), 'Invalid argument `value` = `%s` supplied to func type `%s`', value, name);

      return value;
    }

    Func.meta = {
      kind: 'func',
      domain: domain,
      codomain: codomain,
      name: name
    };

    Func.displayName = name;

    Func.is = function isFunc(x) {
      return func.is(x) &&
        x.func.domain.length === domain.length &&
        x.func.domain.every(function isEqual(type, i) {
          return type === domain[i];
        }) &&
        x.func.codomain === codomain;
    };

    Func.of = function funcOf(f) {

      // DEBUG HINT: if the debugger stops here, f is not a function
      assert(typeof f === 'function');

      // makes Func.of idempotent
      if (Func.is(f)) {
        return f;
      }

      function fn() {

        var args = slice.call(arguments);
        var len = Math.min(args.length, domainLen);

        // DEBUG HINT: if the debugger stops here, you provided wrong arguments to the function
        // mouse over the `args` variable to see what's wrong
        args = tuple(domain.slice(0, len))(args);

        if (len === domainLen) {

          /* jshint validthis: true */
          var r = f.apply(this, args);

          // DEBUG HINT: if the debugger stops here, the return value of the function is invalid
          // mouse over the `r` variable to see what's wrong
          r = codomain(r);

          return r;

        } else {

          var curried = Function.prototype.bind.apply(f, [this].concat(args));
          var newdomain = func(domain.slice(len), codomain);
          return newdomain.of(curried);

        }

      }

      fn.func = {
        domain: domain,
        codomain: codomain,
        f: f
      };

      return fn;

    };

    return Func;

  }

  // returns true if x is an instrumented function
  func.is = function isFunc(f) {
    return Func.is(f) && Obj.is(f.func);
  };

  return {

    util: {
      format: format,
      getKind: getKind,
      getFunctionName: getFunctionName,
      getName: getName,
      mixin: mixin,
      slice: slice,
      shallowCopy: shallowCopy,
      update: update
    },

    options: options,
    assert: assert,
    fail: fail,

    Any: Any,
    Nil: Nil,
    Str: Str,
    Num: Num,
    Bool: Bool,
    Arr: Arr,
    Obj: Obj,
    Func: Func,
    Err: Err,
    Re: Re,
    Dat: Dat,
    Type: Type,

    irreducible: irreducible,
    struct: struct,
    enums: enums,
    union: union,
    maybe: maybe,
    tuple: tuple,
    subtype: subtype,
    list: list,
    dict: dict,
    func: func
  };
}));

},{}],15:[function(require,module,exports){
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.t = factory();
  }
}(this, function () {

  'use strict';

  function fail(message) {
    // start debugger only once
    if (!fail.failed) {
      /*jshint debug: true*/
      debugger;
    }
    fail.failed = true;
    throw new TypeError(message);
  }

  function assert(guard, message) {
    if (guard !== true) {
      message = message ? format.apply(null, slice.call(arguments, 1)) : 'assert failed';
      exports.fail(message);
    }
  }

  //
  // utils
  //

  var slice = Array.prototype.slice;

  function mixin(target, source, overwrite) {
    if (Nil.is(source)) { return target; }
    for (var k in source) {
      if (source.hasOwnProperty(k)) {
        if (overwrite !== true) {
          assert(!target.hasOwnProperty(k), 'Cannot overwrite property %s', k);
        }
        target[k] = source[k];
      }
    }
    return target;
  }

  function format() {
    var args = slice.call(arguments);
    var len = args.length;
    var i = 1;
    var message = args[0];

    function formatArgument(match, type) {
      if (match === '%%') { return '%'; }       // handle escaping %
      if (i >= len) { return match; }           // handle less arguments than placeholders
      var formatter = format.formatters[type];
      if (!formatter) { return match; }         // handle undefined formatters
      return formatter(args[i++]);
    }

    var str = message.replace(/%([a-z%])/g, formatArgument);
    if (i < len) {
      str += ' ' + args.slice(i).join(' ');     // handle more arguments than placeholders
    }
    return str;
  }

  function getFunctionName(f) {
    assert(typeof f === 'function', 'Invalid argument `f` = `%s` supplied to `getFunctionName()`', f);
    return f.displayName || f.name || format('<function%s>', f.length);
  }

  function replacer(key, value) {
    return Func.is(value) ? getFunctionName(value) : value;
  }

  format.formatters = {
    s: function (x) { return String(x); },
    j: function (x) {
      try { // handle circular references
        return JSON.stringify(x, replacer);
      } catch (e) {
        return String(x);
      }
    }
  };

  function getTypeName(type) {
    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `getTypeName()`', type);
    return type.meta.name;
  }

  function blockNew(x, type) {
    assert(!(x instanceof type), 'Operator `new` is forbidden for type `%s`', getTypeName(type));
  }

  function shallowCopy(x) {
    return Arr.is(x) ? x.concat() : Obj.is(x) ? mixin({}, x) : x;
  }

  function update(instance, spec) {
    assert(Obj.is(spec));
    var value = shallowCopy(instance);
    for (var k in spec) {
      if (spec.hasOwnProperty(k)) {
        if (update.commands.hasOwnProperty(k)) {
          assert(Object.keys(spec).length === 1);
          return update.commands[k](spec[k], value);
        } else {
          value[k] = update(value[k], spec[k]);
        }
      }
    }
    return value;
  }

  update.commands = {
    '$apply': function (f, value) {
      assert(Func.is(f));
      return f(value);
    },
    '$push': function (elements, arr) {
      assert(Arr.is(elements));
      assert(Arr.is(arr));
      return arr.concat(elements);
    },
    '$remove': function (keys, obj) {
      assert(Arr.is(keys));
      assert(Obj.is(obj));
      for (var i = 0, len = keys.length ; i < len ; i++ ) {
        delete obj[keys[i]];
      }
      return obj;
    },
    '$set': function (value) {
      return value;
    },
    '$splice': function (splices, arr) {
      assert(list(Arr).is(splices));
      assert(Arr.is(arr));
      return splices.reduce(function (acc, splice) {
        acc.splice.apply(acc, splice);
        return acc;
      }, arr);
    },
    '$swap': function (config, arr) {
      assert(Obj.is(config));
      assert(Num.is(config.from));
      assert(Num.is(config.to));
      assert(Arr.is(arr));
      var element = arr[config.to];
      arr[config.to] = arr[config.from];
      arr[config.from] = element;
      return arr;
    },
    '$unshift': function (elements, arr) {
      assert(Arr.is(elements));
      assert(Arr.is(arr));
      return elements.concat(arr);
    },
    '$merge': function (obj, value) {
      return mixin(mixin({}, value), obj, true);
    }
  };

  //
  // irreducibles
  //

  function irreducible(name, is) {

    assert(typeof name === 'string', 'Invalid argument `name` = `%s` supplied to `irreducible()`', name);
    assert(typeof is === 'function', 'Invalid argument `is` = `%s` supplied to `irreducible()`', is);

    function Irreducible(value) {
      blockNew(this, Irreducible);
      assert(is(value), 'Invalid argument `value` = `%s` supplied to irreducible type `%s`', value, name);
      return value;
    }

    Irreducible.meta = {
      kind: 'irreducible',
      name: name
    };

    Irreducible.displayName = name;

    Irreducible.is = is;

    return Irreducible;
  }

  var Any = irreducible('Any', function () {
    return true;
  });

  var Nil = irreducible('Nil', function (x) {
    return x === null || x === void 0;
  });

  var Str = irreducible('Str', function (x) {
    return typeof x === 'string';
  });

  var Num = irreducible('Num', function (x) {
    return typeof x === 'number' && isFinite(x) && !isNaN(x);
  });

  var Bool = irreducible('Bool', function (x) {
    return x === true || x === false;
  });

  var Arr = irreducible('Arr', function (x) {
    return x instanceof Array;
  });

  var Obj = irreducible('Obj', function (x) {
    return !Nil.is(x) && typeof x === 'object' && !Arr.is(x);
  });

  var Func = irreducible('Func', function (x) {
    return typeof x === 'function';
  });

  var Err = irreducible('Err', function (x) {
    return x instanceof Error;
  });

  var Re = irreducible('Re', function (x) {
    return x instanceof RegExp;
  });

  var Dat = irreducible('Dat', function (x) {
    return x instanceof Date;
  });

  var Type = irreducible('Type', function (x) {
    return Func.is(x) && Obj.is(x.meta);
  });

  function struct(props, name) {

    assert(dict(Str, Type).is(props), 'Invalid argument `props` = `%s` supplied to `struct` combinator', props);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `struct` combinator', name);
    name = name || format('{%s}', Object.keys(props).map(function (prop) {
      return format('%s: %s', prop, getTypeName(props[prop]));
    }).join(', '));

    function Struct(value, mut) {
      // makes Struct idempotent
      if (Struct.is(value)) {
        return value;
      }
      assert(Obj.is(value), 'Invalid argument `value` = `%s` supplied to struct type `%s`', value, name);
      // makes `new` optional
      if (!(this instanceof Struct)) {
        return new Struct(value, mut);
      }
      for (var k in props) {
        if (props.hasOwnProperty(k)) {
          var expected = props[k];
          var actual = value[k];
          this[k] = expected(actual, mut);
        }
      }
      if (mut !== true) {
        Object.freeze(this);
      }
    }

    Struct.meta = {
      kind: 'struct',
      props: props,
      name: name
    };

    Struct.displayName = name;

    Struct.is = function (x) {
      return x instanceof Struct;
    };

    Struct.update = function (instance, spec) {
      return new Struct(exports.update(instance, spec));
    };

    Struct.extend = function (arr, name) {
      arr = [].concat(arr).map(function (x) {
        return Obj.is(x) ? x : x.meta.props;
      });
      arr.unshift(props);
      var ret = struct(arr.reduce(mixin, {}), name);
      mixin(ret.prototype, Struct.prototype); // prototypal inheritance
      return ret;
    };

    return Struct;
  }

  function union(types, name) {

    assert(list(Type).is(types), 'Invalid argument `types` = `%s` supplied to `union` combinator', types);
    var len = types.length;
    var defaultName = types.map(getTypeName).join(' | ');
    assert(len >= 2, 'Invalid argument `types` = `%s` supplied to `union` combinator, provide at least two types', defaultName);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `union` combinator', name);
    name = name || defaultName;

    function Union(value, mut) {
      blockNew(this, Union);
      assert(Func.is(Union.dispatch), 'Unimplemented `dispatch()` function for union type `%s`', name);
      var type = Union.dispatch(value);
      assert(Type.is(type), 'The `dispatch()` function of union type `%s` returns no type constructor', name);
      return type(value, mut);
    }

    Union.meta = {
      kind: 'union',
      types: types,
      name: name
    };

    Union.displayName = name;

    Union.is = function (x) {
      return types.some(function (type) {
        return type.is(x);
      });
    };

    // default dispatch implementation
    Union.dispatch = function (x) {
      for (var i = 0 ; i < len ; i++ ) {
        if (types[i].is(x)) {
          return types[i];
        }
      }
    };

    return Union;
  }

  function maybe(type, name) {

    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `maybe` combinator', type);
    // makes the combinator idempotent and handle Any, Nil
    if (type.meta.kind === 'maybe' || type === Any || type === Nil) {
      return type;
    }
    assert(Nil.is(name) || Str.is(name), 'Invalid argument `name` = `%s` supplied to `maybe` combinator', name);
    name = name || ('?' + getTypeName(type));

    function Maybe(value, mut) {
      blockNew(this, Maybe);
      return Nil.is(value) ? null : type(value, mut);
    }

    Maybe.meta = {
      kind: 'maybe',
      type: type,
      name: name
    };

    Maybe.displayName = name;

    Maybe.is = function (x) {
      return Nil.is(x) || type.is(x);
    };

    return Maybe;
  }

  function enums(map, name) {

    assert(Obj.is(map), 'Invalid argument `map` = `%s` supplied to `enums` combinator', map);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `enums` combinator', name);
    var keys = Object.keys(map); // cache enums
    name = name || keys.map(function (k) { return JSON.stringify(k); }).join(' | ');

    function Enums(value) {
      blockNew(this, Enums);
      assert(Enums.is(value), 'Invalid argument `value` = `%s` supplied to enums type `%s`, expected one of %j', value, name, keys);
      return value;
    }

    Enums.meta = {
      kind: 'enums',
      map: map,
      name: name
    };

    Enums.displayName = name;

    Enums.is = function (x) {
      return Str.is(x) && map.hasOwnProperty(x);
    };

    return Enums;
  }

  enums.of = function (keys, name) {
    keys = Str.is(keys) ? keys.split(' ') : keys;
    var value = {};
    keys.forEach(function (k) {
      value[k] = k;
    });
    return enums(value, name);
  };

  function tuple(types, name) {

    assert(list(Type).is(types), 'Invalid argument `types` = `%s` supplied to `tuple` combinator', types);
    var len = types.length; // cache types length
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `tuple` combinator', name);
    name = name || format('[%s]', types.map(getTypeName).join(', '));

    function isTuple(x) {
      return types.every(function (type, i) {
        return type.is(x[i]);
      });
    }

    function Tuple(value, mut) {
      assert(Arr.is(value) && value.length === len, 'Invalid argument `value` = `%s` supplied to tuple type `%s`, expected an `Arr` of length `%s`', value, name, len);
      var frozen = (mut !== true);
      // makes Tuple idempotent
      if (isTuple(value) && Object.isFrozen(value) === frozen) {
        return value;
      }
      var arr = [];
      for (var i = 0 ; i < len ; i++) {
        var expected = types[i];
        var actual = value[i];
        arr.push(expected(actual, mut));
      }
      if (frozen) {
        Object.freeze(arr);
      }
      return arr;
    }

    Tuple.meta = {
      kind: 'tuple',
      types: types,
      length: len,
      name: name
    };

    Tuple.displayName = name;

    Tuple.is = function (x) {
      return Arr.is(x) && x.length === len && isTuple(x);
    };

    Tuple.update = function (instance, spec) {
      return Tuple(exports.update(instance, spec));
    };

    return Tuple;
  }

  function subtype(type, predicate, name) {

    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `subtype` combinator', type);
    assert(Func.is(predicate), 'Invalid argument `predicate` = `%s` supplied to `subtype` combinator', predicate);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `subtype` combinator', name);
    name = name || format('{%s | %s}', getTypeName(type), getFunctionName(predicate));

    function Subtype(value, mut) {
      blockNew(this, Subtype);
      var x = type(value, mut);
      assert(predicate(x), 'Invalid argument `value` = `%s` supplied to subtype type `%s`', value, name);
      return x;
    }

    Subtype.meta = {
      kind: 'subtype',
      type: type,
      predicate: predicate,
      name: name
    };

    Subtype.displayName = name;

    Subtype.is = function (x) {
      return type.is(x) && predicate(x);
    };

    Subtype.update = function (instance, spec) {
      return Subtype(exports.update(instance, spec));
    };

    return Subtype;
  }

  function list(type, name) {

    assert(Type.is(type), 'Invalid argument `type` = `%s` supplied to `list` combinator', type);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `list` combinator', name);
    name = name || format('Array<%s>', getTypeName(type));

    function isList(x) {
      return x.every(type.is);
    }

    function List(value, mut) {
      assert(Arr.is(value), 'Invalid argument `value` = `%s` supplied to list type `%s`', value, name);
      var frozen = (mut !== true);
      // makes List idempotent
      if (isList(value) && Object.isFrozen(value) === frozen) {
        return value;
      }
      var arr = [];
      for (var i = 0, len = value.length ; i < len ; i++ ) {
        var actual = value[i];
        arr.push(type(actual, mut));
      }
      if (frozen) {
        Object.freeze(arr);
      }
      return arr;
    }

    List.meta = {
      kind: 'list',
      type: type,
      name: name
    };

    List.displayName = name;

    List.is = function (x) {
      return Arr.is(x) && isList(x);
    };

    List.update = function (instance, spec) {
      return List(exports.update(instance, spec));
    };

    return List;
  }

  function dict(domain, codomain, name) {

    assert(Type.is(domain), 'Invalid argument `domain` = `%s` supplied to `dict` combinator', domain);
    assert(Type.is(codomain), 'Invalid argument `codomain` = `%s` supplied to `dict` combinator', codomain);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `dict` combinator', name);
    name = name || format('{[key:%s]: %s}', getTypeName(domain), getTypeName(codomain));

    function isDict(x) {
      for (var k in x) {
        if (x.hasOwnProperty(k)) {
          if (!domain.is(k) || !codomain.is(x[k])) { return false; }
        }
      }
      return true;
    }

    function Dict(value, mut) {
      assert(Obj.is(value), 'Invalid argument `value` = `%s` supplied to dict type `%s`', value, name);
      var frozen = (mut !== true);
      // makes Dict idempotent
      if (isDict(value) && Object.isFrozen(value) === frozen) {
        return value;
      }
      var obj = {};
      for (var k in value) {
        if (value.hasOwnProperty(k)) {
          k = domain(k);
          var actual = value[k];
          obj[k] = codomain(actual, mut);
        }
      }
      if (frozen) {
        Object.freeze(obj);
      }
      return obj;
    }

    Dict.meta = {
      kind: 'dict',
      domain: domain,
      codomain: codomain,
      name: name
    };

    Dict.displayName = name;

    Dict.is = function (x) {
      return Obj.is(x) && isDict(x);
    };

    Dict.update = function (instance, spec) {
      return Dict(exports.update(instance, spec));
    };

    return Dict;
  }

  function isInstrumented(f) {
    return Func.is(f) && Obj.is(f.type);
  }

  function func(domain, codomain, name) {

    // handle handy syntax for unary functions
    domain = Arr.is(domain) ? domain : [domain];
    assert(list(Type).is(domain), 'Invalid argument `domain` = `%s` supplied to `func` combinator', domain);
    assert(Type.is(codomain), 'Invalid argument `codomain` = `%s` supplied to `func` combinator', codomain);
    assert(maybe(Str).is(name), 'Invalid argument `name` = `%s` supplied to `func` combinator', name);
    name = name || format('(%s) => %s', domain.map(getTypeName).join(', '), getTypeName(codomain));
    var domainLen = domain.length; // cache the domain length

    function Func(value) {
      // automatically instrument the function
      if (!isInstrumented(value)) {
        return Func.of(value);
      }
      assert(Func.is(value), 'Invalid argument `value` = `%s` supplied to func type `%s`', value, name);
      return value;
    }

    Func.meta = {
      kind: 'func',
      domain: domain,
      codomain: codomain,
      name: name
    };

    Func.displayName = name;

    Func.is = function (x) {
      return isInstrumented(x) &&
        x.type.domain.length === domainLen &&
        x.type.domain.every(function (type, i) {
          return type === domain[i];
        }) &&
        x.type.codomain === codomain;
    };

    Func.of = function (f) {

      assert(typeof f === 'function');

      // makes Func.of idempotent
      if (Func.is(f)) {
        return f;
      }

      function fn() {
        var args = slice.call(arguments);
        var len = args.length;
        var argsType = tuple(domain.slice(0, len));
        args = argsType(args);
        if (len === domainLen) {
          /* jshint validthis: true */
          return codomain(f.apply(this, args));
        } else {
          var curried = Function.prototype.bind.apply(f, [this].concat(args));
          var newdomain = func(domain.slice(len), codomain);
          return newdomain.of(curried);
        }
      }

      fn.type = {
        domain: domain,
        codomain: codomain,
        f: f
      };

      fn.displayName = getFunctionName(f);

      return fn;

    };

    return Func;

  }

  var exports = {
    format: format,
    getFunctionName: getFunctionName,
    getTypeName: getTypeName,
    mixin: mixin,
    slice: slice,
    shallowCopy: shallowCopy,
    update: update,
    assert: assert,
    fail: fail,
    Any: Any,
    Nil: Nil,
    Str: Str,
    Num: Num,
    Bool: Bool,
    Arr: Arr,
    Obj: Obj,
    Func: Func,
    Err: Err,
    Re: Re,
    Dat: Dat,
    Type: Type,
    irreducible: irreducible,
    struct: struct,
    enums: enums,
    union: union,
    maybe: maybe,
    tuple: tuple,
    subtype: subtype,
    list: list,
    dict: dict,
    func: func
  };

  return exports;

}));

},{}],16:[function(require,module,exports){
//     Underscore.js 1.8.2
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.2';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var isArrayLike = function(collection) {
    var length = collection && collection.length;
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, target, fromIndex) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    return _.indexOf(obj, target, typeof fromIndex == 'number' && fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = input && input.length; i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (array == null) return [];
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, 'length').length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = list && list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    var i = 0, length = array && array.length;
    if (typeof isSorted == 'number') {
      i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
    } else if (isSorted && length) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (item !== item) {
      return _.findIndex(slice.call(array, i), _.isNaN);
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    var idx = array ? array.length : 0;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    if (item !== item) {
      return _.findLastIndex(slice.call(array, 0, idx), _.isNaN);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
    return -1;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = array != null && array.length;
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createIndexFinder(1);

  _.findLastIndex = createIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    
    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of 
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
  
  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],17:[function(require,module,exports){
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
},{"../Protocols/GestureRecognizerProtocol":21,"tcomb-validation":13}],18:[function(require,module,exports){
var t = require('tcomb');

var GestureRecognizerState = t.enums.of("None Possible Began Changed Ended Cancelled Failed ");

module.exports.GestureRecognizerState = GestureRecognizerState;




},{"tcomb":15}],19:[function(require,module,exports){
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




},{"./Delegates/GestureRecognizerDelegate":17,"./Protocols/GestureRecognizerProtocol":21,"tcomb-validation":13,"underscore":16}],20:[function(require,module,exports){
var _ = require('underscore');

var Models = require('JSCoreGraphics').CoreGraphics.Geometry.DataTypes;
var Touch = require('./Touch');

var shouldLogGestureInfo = false;
var logContext = "ReactGestureRecognizerMixin";
var logGestureInfo = function(logString) {
    if(shouldLogGestureInfo) {
        console.log(logContext + ' - ' +logString);
    }
}

var ReactGestureRecognizerMixin = {
    componentWillMount: function() {

    },

    componentDidMount: function() {
        var node = this.getDOMNode();

        node.addEventListener('mousedown', this.gestureRecognizerOnMouseDown);
        document.addEventListener('mousemove', this.gestureRecognizerOnMouseMove);
        document.addEventListener('mouseup', this.gestureRecognizerOnMouseUp);

        node.addEventListener('touchstart', this.gestureRecognizerOnTouchStart);
        document.addEventListener('touchmove', this.gestureRecognizerOnTouchMove);
        document.addEventListener('touchend', this.gestureRecognizerOnTouchEnd);

        if(this.logMixinDebugInfo) {
            shouldLogGestureInfo = this.logMixinDebugInfo;
        }
        logGestureInfo("componentDidMount");
    },

    componentWillUnmount: function() {
        var node = this.getDOMNode();

        node.removeEventListener('mousedown', this.gestureRecognizerOnMouseDown);
        document.removeEventListener('mousemove', this.gestureRecognizerOnMouseMove);
        document.removeEventListener('mouseup', this.gestureRecognizerOnMouseUp);

        node.removeEventListener('touchstart', this.gestureRecognizerOnTouchStart);
        document.removeEventListener('touchmove', this.gestureRecognizerOnTouchMove);
        document.removeEventListener('touchend', this.gestureRecognizerOnTouchEnd);

        logGestureInfo("componentWillUnmount");
    },

    addedLocalDelegate: false,

    //TODO: this should be called on each listening gesture to see if any will handle touch or delegated to mixins super
    shouldHandleGesture: function(e, isTouch) {
        if(isTouch) {
            return this.shouldHandleTouchGestures;
        } else {
            return this.shouldHandleMouseGestures;
        }
    },

    isAnyGestureCurrentlyActive: function() {
        var isActive = false;
        for(var i = 0; i < this.gestureRecognizers.length; i++) {
            if(this.gestureRecognizers[i].isActive()) {
                isActive = true;
                break;
            }
        }

        //logGestureInfo("isAnyGestureCurrentlyActive: " + isActive);
        return isActive;
    },

    resetRecognizers: function() {
        for(var i = 0; i < this.gestureRecognizers.length; i++) {
            this.gestureRecognizers[i].reset();
        }

        logGestureInfo("resetRecognizers");
    },

    onGestureStateChanged: function() {
        var anyActive = this.isAnyGestureCurrentlyActive();
        logGestureInfo("onGestureStateChanged.  anyActive: " + anyActive);
        if(!anyActive) {
            this.resetRecognizers();
        }
    },

    gestureRecognizerOnMouseDown: function(e) {
        if(this.shouldHandleGesture(e, false)) {
            var point = new Models.Point({x: e.pageX, y: e.pageY});
            var touch = new Touch(1, point, e.relatedTarget);
            this.gestureRecognizerOnGestureDown(touch, function(shouldPreventDefault) {
                logGestureInfo("gestureRecognizerOnMouseDown.  ShouldPreventDefault: " + shouldPreventDefault);
                if(shouldPreventDefault) {
                    e.preventDefault();
                }
            });
        }
    },

    gestureRecognizerOnMouseMove: function(e) {
        if(this.shouldHandleGesture(e, false)  && this.isAnyGestureCurrentlyActive()) {
            var point = new Models.Point({x: e.pageX, y: e.pageY});
            var touch = new Touch(1, point, e.relatedTarget);
            this.gestureRecognizerOnGestureMove(touch, function(shouldPreventDefault) {
                logGestureInfo("gestureRecognizerOnMouseMove.  ShouldPreventDefault: " + shouldPreventDefault);
                if(shouldPreventDefault) {
                    e.preventDefault();
                }
            });
        }
    },

    gestureRecognizerOnMouseUp: function(e) {
        if(this.shouldHandleGesture(e, false)) {
            var point = new Models.Point({x: e.pageX, y: e.pageY});
            var touch = new Touch(1, point, e.relatedTarget);
            this.gestureRecognizerOnGestureUp(touch, function(shouldPreventDefault) {
                logGestureInfo("gestureRecognizerOnMouseUp.  ShouldPreventDefault: " + shouldPreventDefault);
                if(shouldPreventDefault) {
                    e.preventDefault();
                }
            });
        }
    },

    gestureRecognizerOnTouchStart: function(e) {
        if(this.shouldHandleGesture(e, true)) {
            var touches = [];
            for (var i = 0; i < e.changedTouches.length; i++) {
                var point = new Models.Point({x: e.changedTouches[i].pageX, y: e.changedTouches[i].pageY});
                var touch = new Touch(e.changedTouches[i].identifier, point, e.changedTouches[i].target);

                touches.push(touch);
            }

            this.gestureRecognizerOnGestureDown(touches, function(shouldPreventDefault) {
                logGestureInfo("gestureRecognizerOnTouchStart.  ShouldPreventDefault: " + shouldPreventDefault);
                if(shouldPreventDefault) {
                    e.preventDefault();
                }
            });
        }
    },

    gestureRecognizerOnTouchMove: function(e) {
        var touchOne = {
            pageX: e.touches && e.touches.length > 0 ? e.touches[0].pageX : "NA",
            pageY: e.touches && e.touches.length > 0 ? e.touches[0].pageY : "NA"
        };

        var changedTouchOne = {
            pageX: e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0].pageX : "NA",
            pageY: e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches[0].pageY : "NA"
        };
        logGestureInfo("gestureRecognizerOnTouchMove - touches: " + JSON.stringify(touchOne, null) + ", changedTouches: " + JSON.stringify(changedTouchOne, null));
        if(this.shouldHandleGesture(e, true) && this.isAnyGestureCurrentlyActive()) {
            var touches = [];
            for (var i = 0; i < e.changedTouches.length; i++) {
                var point = new Models.Point({x: e.changedTouches[i].pageX, y: e.changedTouches[i].pageY});
                var touch = new Touch(e.changedTouches[i].identifier, point, e.changedTouches[i].target);

                touches.push(touch);
            }

            this.gestureRecognizerOnGestureMove(touches, function(shouldPreventDefault) {
                logGestureInfo("gestureRecognizerOnTouchStart.  ShouldPreventDefault: " + shouldPreventDefault);
                if(shouldPreventDefault) {
                    e.preventDefault();
                }
            });
        }
    },

    gestureRecognizerOnTouchEnd: function(e) {
        if(this.shouldHandleGesture(e, true)) {
            var touches = [];
            for (var i = 0; i < e.changedTouches.length; i++) {
                var point = new Models.Point({x: e.changedTouches[i].pageX, y: e.changedTouches[i].pageY});
                var touch = new Touch(e.changedTouches[i].identifier, point, e.changedTouches[i].target);

                touches.push(touch);
            }

            this.gestureRecognizerOnGestureUp(touches, function(shouldPreventDefault) {
                logGestureInfo("gestureRecognizerOnTouchEnd.  ShouldPreventDefault: " + shouldPreventDefault);
                if(shouldPreventDefault) {
                    e.preventDefault();
                }
            });
        }
    },

    gestureRecognizerOnGestureDown: function(touches, shouldPreventDefaultCallback) {
        if(!this.addedLocalDelegate) {//hackety hack
            this.addedLocalDelegate = true;
            for(var i = 0; i < this.gestureRecognizers.length; i++) {
                this.gestureRecognizers[i].stateFailedOrEndedCallback = this.onGestureStateChanged;
            }
        }
        if(!_.isArray(touches)) {
            touches = [touches];
        }

        for(var i = 0; i < this.gestureRecognizers.length; i++) {
            this.gestureRecognizers[i].onGestureDown(touches);
        }

        var anyActive = this.isAnyGestureCurrentlyActive();
        shouldPreventDefaultCallback(anyActive);

    },

    gestureRecognizerOnGestureMove: function(touches, shouldPreventDefaultCallback) {
        if (this.isAnyGestureCurrentlyActive()) {
            if (!_.isArray(touches)) {
                touches = [touches];
            }

            for (var i = 0; i < this.gestureRecognizers.length; i++) {
                this.gestureRecognizers[i].onGestureMove(touches);
            }

            var anyActive = this.isAnyGestureCurrentlyActive();
            shouldPreventDefaultCallback(anyActive);
        }
    },

    gestureRecognizerOnGestureUp: function(touches, shouldPreventDefaultCallback) {
        if (!_.isArray(touches)) {
            touches = [touches];
        }

        for (var i = 0; i < this.gestureRecognizers.length; i++) {
            this.gestureRecognizers[i].onGestureUp(touches);
        }

        var anyActive = this.isAnyGestureCurrentlyActive();
        if (!anyActive) {
            this.resetRecognizers();
        }

        shouldPreventDefaultCallback(anyActive);
    }
};

module.exports = ReactGestureRecognizerMixin;
},{"./Touch":25,"JSCoreGraphics":2,"underscore":16}],21:[function(require,module,exports){
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




},{"../Enums/GestureRecognizerEnums":18,"./TouchProtocol":22,"JSCoreGraphics":2,"tcomb-validation":13}],22:[function(require,module,exports){
var t = require('tcomb');
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

},{"JSCoreGraphics":2,"tcomb":15}],23:[function(require,module,exports){
var t = require('tcomb-validation');
var _ = require('underscore');

var GestureRecognizerProtocol = require('../Protocols/GestureRecognizerProtocol');
var GestureRecognizerBase = require('../GestureRecognizerBase');

var PanGestureRecognizerProtocol = GestureRecognizerProtocol.extend( new t.struct({
}, 'PanGestureRecognizerProtocol'));

function PanGestureRecognizerFactory() {
    var shouldLogGesture = false;
    var logGestureContext = "PanGesture - ";
    var logGestureInfo = function(logString) {
        if(shouldLogGesture) {
            console.log(logGestureContext + logString);
        }
    }

    var _maxTouches = 1;
    var _minTouches = 1;
    var _state = "None";
    var MIN_DISTANCE_FOR_BEGAN = 5;

    function restart() {
        _state = "None";
    }

    var PanGestureRecognizerBase = {
        reset: function(){
            restart();
        },
        logDebugInfo: function(shouldLog) {
            shouldLogGesture = shouldLog;
        },
        touchesBegan: function(touches) {
            if(!touches && touches.length < _minTouches || touches.length > _maxTouches) {
                _state = "Failed";
                logGestureInfo('Touhes Began - Invalid number of Touches: ' + touches.length ? touches.length : 0 + ', state: ' + _state);
            }
            else {
                _state = "Possible";
                logGestureInfo('Gesture Began, state: ' + _state);
            }
            if(this.callback) {
                this.callback(this);
            }
        },
        touchesMoved: function(touches) {
            if(!touches && touches.length < _minTouches || touches.length > _maxTouches) {
                _state = "Failed";
                logGestureInfo('Touches Moved - Invalid number of Touches: ' + touches.length ? touches.length : 0 + ', state: ' + _state);
            }
            else {
                var touch = touches[0];
                var translation = touch.getMaxTranslation();
                var distanceMoved = Math.sqrt(translation.x * translation.x + translation.y + translation.y);
                if (touch.touchEndTime) {
                    if(_state == "Began" || _state == "Changed") {
                        _state = "Ended";
                    } else {
                        _state = "Failed";
                    }
                } else if ( distanceMoved < MIN_DISTANCE_FOR_BEGAN) {
                    _state = "Possible";
                } else if (_state == "Possible") {
                    _state = "Began";
                }
                else {
                    _state = "Changed";
                    logGestureInfo('Touches Moved, current translation: ' + JSON.stringify(touch.getCurrentTranslation(), null));
                }
            }

            if(this.callback) {
                this.callback(this);
            }
        },
        touchesEnded: function(touches) {
            _state = "Ended";
            logGestureInfo('Touches Ended and pan gesture is no longer active');

            if(this.callback) {
                this.callback(this);
            }
        },
        getState: function () {
            return _state;
        }
    };

    var panGestureImpl = _.extend(new GestureRecognizerBase(), PanGestureRecognizerBase);
    //panGestureImpl =  new PanGestureRecognizerProtocol(tapGestureImpl, true);
    return panGestureImpl;
}

module.exports = PanGestureRecognizerFactory;

},{"../GestureRecognizerBase":19,"../Protocols/GestureRecognizerProtocol":21,"tcomb-validation":13,"underscore":16}],24:[function(require,module,exports){
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

},{"../GestureRecognizerBase":19,"../Protocols/GestureRecognizerProtocol":21,"tcomb-validation":13,"underscore":16}],25:[function(require,module,exports){
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

},{"./Protocols/TouchProtocol":22}]},{},[1])(1)
});


//# sourceMappingURL=react-gesturerecognizer-standalone.js.map