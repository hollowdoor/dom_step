import rawObject from 'raw-object';
import localNaN from 'is-nan';

function isElement(input){
  return (input != null)
    && (typeof input === 'object')
    && (input.nodeType === Node.ELEMENT_NODE)
    && (typeof input.style === 'object')
    && (typeof input.ownerDocument === 'object');
}

//If there are problems with getBoundingClientRect
//See https://github.com/webmodules/bounding-client-rect
function getRect(e){
    return e.getBoundingClientRect();
}

function height(rect){
    return rect.bottom - rect.top;
}

function width(rect){
    return rect.right - rect.left;
}

//Some modules exist for this,
//but they do runtime exports (not static)
function isVisible(el){
    return el.offsetParent !== null
}

function result(directions, el, direction){
    return isVisible(el)
    ? el
    : directions[direction](el);
}

function getSibling(element, x, y){
    var el = document.elementFromPoint(x, y);
    var parent = el, i=0, limit = 5;
    if(!el) { return; }
    for(var i$1=0; i$1<limit; i$1++){
        el = parent;
        if(!el) { return; }
        parent = el.parentNode;
        if(parent === element.parentNode){
            return el;
        }
    }
}

var directions = rawObject({
    left: function left(element, range, wrap){
        if ( wrap === void 0 ) wrap = 0;

        var rect = getRect(element);
        var x = rect.left - range,
            y = rect.top + (height(rect) / 2);

        var el = getSibling(element, x, y);
        if(el){
            return result(this, el, 'left');
        }

        if(wrap){
            var prect = getRect(element.parentNode);
            x = prect.right - wrap;
            var el$1 = getSibling(element, x, y);
            if(el$1){
                return result(this, el$1, 'left');
            }
        }
    },
    up: function up(element, range, wrap){
        if ( wrap === void 0 ) wrap = 0;

        var rect = getRect(element);
        var x = rect.left + (width(rect) / 2),
            y = rect.top - range;

        var el = getSibling(element, x, y);
        if(el){
            return result(this, el, 'up');
        }

        if(wrap){
            var prect = getRect(element.parentNode);
            y = prect.bottom - wrap;
            var el$1 = getSibling(element, x, y);
            if(el$1){
                return result(this, el$1, 'up');
            }
        }
    },
    right: function right(element, range, wrap){
        if ( wrap === void 0 ) wrap = 0;

        var rect = getRect(element);
        var x = rect.right + range,
            y = rect.top + (height(rect) / 2);

        var el = getSibling(element, x, y);
        if(el){
            return result(this, el, 'right');
        }

        if(wrap){
            var prect = getRect(element.parentNode);
            x = prect.left + wrap;

            var el$1 = getSibling(element, x, y);
            if(el$1){
                return result(this, el$1, 'right');
            }
        }
    },
    down: function down(element, range, wrap){
        if ( wrap === void 0 ) wrap = 0;

        var rect = getRect(element);
        var x = rect.left + (width(rect) / 2),
            y = rect.bottom + range;

        var el = getSibling(element, x, y);
        if(el){
            return result(this, el, 'down');
        }

        if(wrap){
            var prect = getRect(element.parentNode);
            y = prect.top + wrap;

            var el$1 = getSibling(element, x, y);
            if(el$1){
                return result(this, el$1, 'down');
            }
        }
    }
});

function step(element, direction, ref){
    if ( ref === void 0 ) ref = {};
    var range = ref.range; if ( range === void 0 ) range = 1;
    var wrap = ref.wrap; if ( wrap === void 0 ) wrap = 0;


    if(!isElement(element)){
        throw new TypeError(("element is not a DOM element. Instead element is equal to " + element + "."))
    }

    if(directions[direction] === void 0){
        throw new TypeError(("direction should be up, down, left, or right. Instead direction is equal to " + direction + "."));
    }

    if(localNaN(range)){
        throw new TypeError(("options.range should be a number. Instead options.range is equal to " + range));
    }

    return directions[direction](element, range, wrap);
}

export default step;
//# sourceMappingURL=bundle.es.js.map
