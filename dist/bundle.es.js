import nextElementSibling from 'dom-next-element-sibling';
import previousElementSibling from 'dom-previous-element-sibling';
import rawObject from 'raw-object';
import localNaN from 'is-nan';

//traverser

var find = rawObject({
    next: nextElementSibling,
    prev: previousElementSibling
});

var directions = rawObject({
    left: function left(element, range, traverse){
        if ( traverse === void 0 ) traverse = 'prev';

        var near = find[traverse];
        var current = near(element);
        var ref = getRects(element, current);
        var rect1 = ref[0];
        var rect2 = ref[1];

        if(isWest(rect1, rect2, range)){
            return current;
        }

        while(current = near(current)){
            var ref$1 = getRects(current);
            var rect2$1 = ref$1[0];
            if(isWest(rect1, rect2$1, range)){
                return current;
            }
        }
    },
    up: function up(element, range, traverse){
        if ( traverse === void 0 ) traverse = 'prev';

        var near = find[traverse];
        var current = near(element);
        var ref = getRects(element, current);
        var rect1 = ref[0];
        var rect2 = ref[1];

        if(isNorth(rect1, rect2, range)){
            return current;
        }

        while(current = near(current)){
            var ref$1 = getRects(current);
            var rect2$1 = ref$1[0];
            if(isNorth(rect1, rect2$1, range)){
                return current;
            }
        }
    },
    right: function right(element, range, traverse){
        if ( traverse === void 0 ) traverse = 'next';

        var near = find[traverse];
        var current = near(element);
        var ref = getRects(element, current);
        var rect1 = ref[0];
        var rect2 = ref[1];

        if(isEast(rect1, rect2, range)){
            return current;
        }

        while(current = near(current)){
            var ref$1 = getRects(current);
            var rect2$1 = ref$1[0];
            if(isEast(rect1, rect2$1, range)){
                return current;
            }
        }
    },
    down: function down(element, range, traverse){
        if ( traverse === void 0 ) traverse = 'next';

        var near = find[traverse];
        var current = near(element);
        var ref = getRects(element, current);
        var rect1 = ref[0];
        var rect2 = ref[1];

        if(isSouth(rect1, rect2, range)){
            return current;
        }

        while(current = near(current)){
            var ref$1 = getRects(current);
            var rect2$1 = ref$1[0];
            if(isSouth(rect1, rect2$1, range)){
                return current;
            }
        }
    }
});

function step(element, direction, ref){
    if ( ref === void 0 ) ref = {};
    var range = ref.range; if ( range === void 0 ) range = 1;
    var traverse = ref.traverse;

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

function isWest(rect1, rect2, range){
    if(rect1.left - rect2.right <= range){
        return hReachable(rect1, rect2);
    }
    return false;
}

function isNorth(rect1, rect2, range){
    if(rect1.top - rect2.bottom <= range){
        return vReachable(rect1, rect2);
    }
    return false;
}

function isEast(rect1, rect2, range){
    if(rect2.left - rect1.right <= range){
        return hReachable(rect1, rect2);
    }
    return false;
}

function isSouth(rect1, rect2, range){
    if(rect2.top - rect1.bottom <= range){
        return vReachable(rect1, rect2);
    }
    return false;
}

//(h) horizontal
//(v) vertical

function hReachable(rect1, rect2, range){
    var c = hCenter(rect1);
    return rect2.bottom > c || rect2.top < c;
    //return (rect2.top <= rect1.top && rect2.bottom > rect1.top);
}

function vReachable(rect1, rect2){
    var c = vCenter(rect1);
    return rect2.right > c || rect2.left < c;
    //return (rect2.left <= rect1.left && rect2.right > rect1.left);
}

function vCenter(rect){
    return rect.bottom - rect.top / 2;
}

function hCenter(rect){
    return rect.right - rect.left / 2;
}

function getRects(){
    var elements = [], len = arguments.length;
    while ( len-- ) elements[ len ] = arguments[ len ];

    return elements.map(getRect);
}

function getRect(e){
    return e.getBoundingClientRect();
}

export default step;
//# sourceMappingURL=bundle.es.js.map
