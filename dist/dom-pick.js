var domPick = (function () {
'use strict';

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

var directions = rawObject({
    left: function left(element){
        var current = previousElementSibling(element);
        var ref = getRects(element, current);
        var rect1 = ref[0];
        var rect2 = ref[1];

        if(isWest(rect1, rect2)){
            return current;
        }

        while(current = previousElementSibling(current)){
            var ref$1 = getRects(current);
            var rect2$1 = ref$1[0];
            if(isWest(rect1, rect2$1)){
                return current;
            }
        }

        /*if(rect2.right <= rect1.left){
            if(rect2.top <= rect1.top){
                return current;
            }
        }

        while(current = previousElementSibling(current)){
            let [rect2] = getRects(current);
            if(rect2.right <= rect1.left){
                if(rect2.top <= rect1.top){
                    return current;
                }
            }
        }*/
    },
    up: function up(element){


        var current = previousElementSibling(element);
        var ref = getRects(element, current);
        var rect1 = ref[0];
        var rect2 = ref[1];

        if(isNorth(rect1, rect2)){
            return current;
        }

        while(current = previousElementSibling(current)){
            var ref$1 = getRects(current);
            var rect2$1 = ref$1[0];
            if(isNorth(rect1, rect2$1)){
                return current;
            }
        }
    },
    right: function right(element){

        var current = nextElementSibling(element);
        var ref = getRects(element, current);
        var rect1 = ref[0];
        var rect2 = ref[1];

        if(isEast(rect1, rect2)){
            return current;
        }

        while(current = nextElementSibling(current)){
            var ref$1 = getRects(current);
            var rect2$1 = ref$1[0];
            if(isEast(rect1, rect2$1)){
                return current;
            }
        }
    },
    down: function down(element){

        var current = nextElementSibling(element);
        var ref = getRects(element, current);
        var rect1 = ref[0];
        var rect2 = ref[1];

        if(isSouth(rect1, rect2)){
            return current;
        }

        while(current = nextElementSibling(current)){
            var ref$1 = getRects(current);
            var rect2$1 = ref$1[0];
            if(isSouth(rect1, rect2$1)){
                return current;
            }
        }
    }
});

function domPick(element, direction, range){
    if ( range === void 0 ) range = 0;

    return directions[direction](element, range);
}

function getRects(){
    var elements = [], len = arguments.length;
    while ( len-- ) elements[ len ] = arguments[ len ];

    return elements.map(function (el){ return el.getBoundingClientRect(); });
}

function isNorth(rect1, rect2){
    if(rect2.bottom <= rect1.top){
        return vReachable(rect1, rect2);
    }
    return false;
}

function isSouth(rect1, rect2){
    if(rect2.top >= rect1.bottom){
        return vReachable(rect1, rect2);
    }
    return false;
}

function vReachable(rect1, rect2){
    return (rect2.left <= rect1.left && rect2.right > rect1.left);
}

function isEast(rect1, rect2){
    if(rect2.left >= rect1.right){
        return hReachable(rect1, rect2);
    }
    return false;
}

function isWest(rect1, rect2){
    if(rect2.right <= rect1.left){
        return hReachable(rect1, rect2);
    }
    return false;
}

function hReachable(rect1, rect2){
    return (rect2.top <= rect1.top && rect2.bottom > rect1.top);
}

return domPick;

}());
//# sourceMappingURL=dom-pick.js.map
