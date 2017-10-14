(function () {
'use strict';

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var arguments$1 = arguments;

	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments$1[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

//Supposedly faster for v8 than just Object.create(null)
function Raw(){}
Raw.prototype = (function (){
    //Maybe some old browser has risen from it's grave
    if(typeof Object.create !== 'function'){
        var temp = new Object();
        temp.__proto__ = null;
        return temp;
    }

    return Object.create(null);
})();

function rawObject(){
    var arguments$1 = arguments;

    var objects = [], len = arguments.length;
    while ( len-- ) { objects[ len ] = arguments$1[ len ]; }

    var raw = new Raw();
    objectAssign.apply(void 0, [ raw ].concat( objects ));
    return raw;
}

var toStr$2 = Object.prototype.toString;

var isArguments = function isArguments(value) {
	var str = toStr$2.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr$2.call(value.callee) === '[object Function]';
	}
	return isArgs;
};

// modified from https://github.com/es-shims/es5-shim
var has$1 = Object.prototype.hasOwnProperty;
var toStr$1 = Object.prototype.toString;
var slice = Array.prototype.slice;

var isEnumerable = Object.prototype.propertyIsEnumerable;
var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var excludedKeys = {
	$console: true,
	$external: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$innerHeight: true,
	$innerWidth: true,
	$outerHeight: true,
	$outerWidth: true,
	$pageXOffset: true,
	$pageYOffset: true,
	$parent: true,
	$scrollLeft: true,
	$scrollTop: true,
	$scrollX: true,
	$scrollY: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = (function () {
	/* global window */
	if (typeof window === 'undefined') { return false; }
	for (var k in window) {
		try {
			if (!excludedKeys['$' + k] && has$1.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}());
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr$1.call(object) === '[object Function]';
	var isArguments$$1 = isArguments(object);
	var isString = isObject && toStr$1.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments$$1) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has$1.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments$$1 && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has$1.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has$1.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArguments(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

var objectKeys = keysShim;

var hasOwn = Object.prototype.hasOwnProperty;
var toString = Object.prototype.toString;

var foreach = function forEach (obj, fn, ctx) {
    if (toString.call(fn) !== '[object Function]') {
        throw new TypeError('iterator must be a function');
    }
    var l = obj.length;
    if (l === +l) {
        for (var i = 0; i < l; i++) {
            fn.call(ctx, obj[i], i, obj);
        }
    } else {
        for (var k in obj) {
            if (hasOwn.call(obj, k)) {
                fn.call(ctx, obj[k], k, obj);
            }
        }
    }
};

var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';

var toStr = Object.prototype.toString;

var isFunction = function (fn) {
	return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
};

var arePropertyDescriptorsSupported = function () {
	var obj = {};
	try {
		Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
        /* eslint-disable no-unused-vars, no-restricted-syntax */
        for (var _ in obj) { return false; }
        /* eslint-enable no-unused-vars, no-restricted-syntax */
		return obj.x === obj;
	} catch (e) { /* this is IE 8. */
		return false;
	}
};
var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();

var defineProperty = function (object, name, value, predicate) {
	if (name in object && (!isFunction(predicate) || !predicate())) {
		return;
	}
	if (supportsDescriptors) {
		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: false,
			value: value,
			writable: true
		});
	} else {
		object[name] = value;
	}
};

var defineProperties = function (object, map) {
	var predicates = arguments.length > 2 ? arguments[2] : {};
	var props = objectKeys(map);
	if (hasSymbols) {
		props = props.concat(Object.getOwnPropertySymbols(map));
	}
	foreach(props, function (name) {
		defineProperty(object, name, map[name], predicates[name]);
	});
};

defineProperties.supportsDescriptors = !!supportsDescriptors;

var defineProperties_1 = defineProperties;

/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */

var implementation = function isNaN(value) {
	return value !== value;
};

var polyfill = function getPolyfill() {
	if (Number.isNaN && Number.isNaN(NaN) && !Number.isNaN('a')) {
		return Number.isNaN;
	}
	return implementation;
};

/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */

var shim = function shimNumberIsNaN() {
	var polyfill$$1 = polyfill();
	defineProperties_1(Number, { isNaN: polyfill$$1 }, { isNaN: function () { return Number.isNaN !== polyfill$$1; } });
	return polyfill$$1;
};

/* http://www.ecma-international.org/ecma-262/6.0/#sec-number.isnan */

defineProperties_1(implementation, {
	getPolyfill: polyfill,
	implementation: implementation,
	shim: shim
});

var isNan = implementation;

//See https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/nextElementSibling
var nextElementSibling = (function (){
    if(!("nextElementSibling" in document.documentElement)){
        return function (element){
            var e = element.nextSibling;
            while(e && 1 !== e.nodeType)
                { e = e.nextSibling; }
            return e;
        };
    }

    return function (element){
        return element.nextElementSibling;
    };
})();

//See https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/previousElementSibling
var previousElementSibling = (function (){
    if(!("previousElementSibling" in document.documentElement)){
        return function (element){
            var e = element.previousSibling;
            while(e && 1 !== e.nodeType)
                { e = e.previousSibling; }
            return e;
        };
    }

    return function (element){
        return element.previousElementSibling;
    };
})();

function isElement(input){
  return (input != null)
    && (typeof input === 'object')
    && (input.nodeType === Node.ELEMENT_NODE)
    && (typeof input.style === 'object')
    && (typeof input.ownerDocument === 'object');
}

var find = rawObject({
    next: nextElementSibling,
    prev: previousElementSibling
});

function match(isDirection, isEdge, element, range, traverse){
    var rect1 = getRect(element);
    var current = element;
    var near = find[traverse];
    var parent = element.parentNode;

    if(isEdge(rect1, range, parent)){
        return;
    }

    while(current = near(current)){
        var rect2 = getRect(current);

        if(isDirection(rect1, rect2, range)){
            if(!isVisible(current)){
                //This might be ok?
                return match(isDirection, isEdge, current, range, traverse);
            }
            return current;
        }
    }
}

//Some modules exist for this,
//but they do runtime exports (not static)
function isVisible(el){
    return el.offsetParent !== null
}

//If there are problems with getBoundingClientRect
//See https://github.com/webmodules/bounding-client-rect
function getRect(e){
    return e.getBoundingClientRect();
}

function isWest(rect1, rect2, range){
    var distance = rect1.left - rect2.right;
    if(distance > -1 && distance <= range){
        return vContained(rect1, rect2);
    }
    return false;
}

function isNorth(rect1, rect2, range){
    var distance = rect1.top - rect2.bottom;
    if(distance > -1 && distance <= range){
        return hContained(rect1, rect2);
    }
    return false;
}

function isEast(rect1, rect2, range){
    var distance = rect2.left - rect1.right;
    if(distance > -1 && distance <= range){
        return vContained(rect1, rect2);
    }
    return false;
}

function isSouth(rect1, rect2, range){
    var distance = rect2.top - rect1.bottom;
    if(distance > -1 && distance <= range){
        return hContained(rect1, rect2);
    }
    return false;
}

//(h) horizontal
//(v) vertical

function hContained(rect1, rect2){
    var c1 = hCenter(rect1);
    return rect2.left >= rect1.left && rect2.left <= c1
    || rect2.right <= rect1.right && rect2.right >= c1;
}

function vContained(rect1, rect2){
    var c1 = vCenter(rect1);
    return rect2.top >= rect1.top && rect2.top <= c1
    || rect2.bottom <= rect1.bottom && rect2.bottom >= c1;
}

function vCenter(rect){
    return rect.top + height(rect) / 2;
}

function hCenter(rect){
    return rect.left + width(rect) / 2;
}

function height(rect){
    return rect.bottom - rect.top;
}

function width(rect){
    return rect.right - rect.left;
}

function westEdge(rect, range, parent){
    var subject = document
        .elementFromPoint(rect.left - range, vCenter(rect));
    return !has(parent, subject);
}

function northEdge(rect, range, parent){
    var subject = document
        .elementFromPoint(hCenter(rect), rect.top - range);
    return !has(parent, subject);
}

function eastEdge(rect, range, parent){
    var subject = document
        .elementFromPoint(rect.right + range, vCenter(rect));
    return !has(parent, subject);
}

function southEdge(rect, range, parent){
    var subject = document
        .elementFromPoint(hCenter(rect), rect.bottom + range);
    return !has(parent, subject);
}

function has(parent, child){
    return child
    && (parent === child.parentNode || parent.contains(child));
}


//Visual testing
/*function point(x, y){
    let div = document.createElement('div');
    div.style.width = '4px';
    div.style.height = '4px';
    div.style.backgroundColor = 'red';
    div.style.position = 'absolute';
    div.style.top = (y - 2) + 'px';
    div.style.left = (x - 2) + 'px';
    document.body.appendChild(div);
}*/

var directions = rawObject({
    left: function left(element, range, traverse){
        if ( traverse === void 0 ) { traverse = 'prev'; }

        return match(isWest, westEdge, element, range, traverse);
    },
    up: function up(element, range, traverse){
        if ( traverse === void 0 ) { traverse = 'prev'; }

        return match(isNorth, northEdge, element, range, traverse);
    },
    right: function right(element, range, traverse){
        if ( traverse === void 0 ) { traverse = 'next'; }

        return match(isEast, eastEdge, element, range, traverse);
    },
    down: function down(element, range, traverse){
        if ( traverse === void 0 ) { traverse = 'next'; }

        return match(isSouth, southEdge, element, range, traverse);
    }
});

function step(element, direction, ref){
    if ( ref === void 0 ) { ref = {}; }
    var range = ref.range; if ( range === void 0 ) { range = 1; }
    var traverse = ref.traverse;


    if(!isElement(element)){
        throw new TypeError(("element is not a DOM element. Instead element is equal to " + element + "."))
    }

    if(directions[direction] === void 0){
        throw new TypeError(("direction should be up, down, left, or right. Instead direction is equal to " + direction + "."));
    }

    if([undefined, 'next', 'prev'].indexOf(traverse) === -1){
        throw new TypeError(("options.traverse should be \"next\", \"prev\", or undefined. Instead options.traverse is equal to " + traverse + "."));
    }

    if(isNan(range)){
        throw new TypeError(("options.range should be a number. Instead options.range is equal to " + range));
    }

    return directions[direction](element, range, traverse);
}

var vlist = document.querySelector('#vertical').children;
var hlist = document.querySelector('#horizontal').children;
var flist = document.querySelector('#flowing').children;

console.log('- vlist -');
loop(3, vlist[0], function (last){
    var down = step(last, 'down');
    console.log(down.innerHTML);
    return down;
});

loop(3, vlist[3], function (last){
    var up = step(last, 'up');
    console.log(up.innerHTML);
    return up;
});
console.log('- hlist -');
loop(3, hlist[0], function (last){
    var right = step(last, 'right');
    console.log(right && right.innerHTML);
    return right;
});

loop(3, hlist[3], function (last){
    var left = step(last, 'left');
    console.log(left.innerHTML);
    return left;
});

console.log('- flist -');

one(0, 'right');
one(0, 'down');
one(3, 'left');
one(3, 'up');
one(1, 'down');
one(1, 'left');
console.log('- edges -');
one(3, 'down');
one(1, 'right');

function loop(n, last, fn){
    try{
        for(var i=0; i<n; i++){
            last = fn(last);
        }
    }catch(e){ console.error(e); }
}

function one(index, direction, options){

    var el = step(flist[index], direction, options);
    console.log(direction, ' index ',index,'flowing ', flist[index], ' result ', el);
    //console.log(el)
    //console.log('arguments ',arguments)

    console.log(el && el.innerHTML);
}

}());
//# sourceMappingURL=code.js.map
