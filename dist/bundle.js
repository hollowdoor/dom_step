'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var rawObject = _interopDefault(require('raw-object'));
var localNaN = _interopDefault(require('is-nan'));
var nextElementSibling = _interopDefault(require('dom-next-element-sibling'));
var previousElementSibling = _interopDefault(require('dom-previous-element-sibling'));

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
            return current;
        }
    }
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
    var subject = document.elementFromPoint(
        rect.left - range, rect.top + (height(rect) / 2));
    return subject && parent !== subject.parentNode;
}

function northEdge(rect, range, parent){
    var subject = document.elementFromPoint(
        rect.left + (width(rect) / 2), rect.top - range);
    return subject && parent !== subject.parentNode;
}

function eastEdge(rect, range, parent){
    var subject = document.elementFromPoint(
        rect.right + range, rect.top + (height(rect) / 2));
    return subject && parent !== subject.parentNode;
}

function southEdge(rect, range, parent){
    var subject = document.elementFromPoint(
        rect.left + (width(rect) / 2), rect.bottom + range);
    return subject && parent !== subject.parentNode;
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
        if ( traverse === void 0 ) traverse = 'prev';

        return match(isWest, westEdge, element, range, traverse);
    },
    up: function up(element, range, traverse){
        if ( traverse === void 0 ) traverse = 'prev';

        return match(isNorth, northEdge, element, range, traverse);
    },
    right: function right(element, range, traverse){
        if ( traverse === void 0 ) traverse = 'next';

        return match(isEast, eastEdge, element, range, traverse);
    },
    down: function down(element, range, traverse){
        if ( traverse === void 0 ) traverse = 'next';

        return match(isSouth, southEdge, element, range, traverse);
    }
});

function step(element, direction, ref){
    if ( ref === void 0 ) ref = {};
    var range = ref.range; if ( range === void 0 ) range = 1;
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

    if(localNaN(range)){
        throw new TypeError(("options.range should be a number. Instead options.range is equal to " + range));
    }

    return directions[direction](element, range, traverse);
}

module.exports = step;
//# sourceMappingURL=bundle.js.map
