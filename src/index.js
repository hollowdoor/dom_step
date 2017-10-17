import rawObject from 'raw-object';
import localNaN from 'is-nan';
import isElement from './lib/iselement.js';
import has from './lib/has_child.js';
import { getRect, height, width } from './lib/rect.js';
import isVisible from './lib/is_visible.js';
import point from './lib/point.js';

function result(directions, el, direction){
    return isVisible(el)
    ? el
    : directions[direction](el);
}

function getSibling(element, x, y){
    let el = document.elementFromPoint(x, y);
    let parent = el, i=0, limit = 5;
    if(!el) return;
    for(let i=0; i<limit; i++){
        el = parent;
        if(!el) return;
        parent = el.parentNode;
        if(parent === element.parentNode){
            return el;
        }
    }
}

const directions = rawObject({
    left(element, range, wrap = 0){
        let rect = getRect(element);
        let x = rect.left - range,
            y = rect.top + (height(rect) / 2);

        let el = getSibling(element, x, y);
        if(el){
            return result(this, el, 'left');
        }

        if(wrap){
            let prect = getRect(element.parentNode);
            x = prect.right - wrap;
            let el = getSibling(element, x, y);
            if(el){
                return result(this, el, 'left');
            }
        }
    },
    up(element, range, wrap = 0){
        let rect = getRect(element);
        let x = rect.left + (width(rect) / 2),
            y = rect.top - range;

        let el = getSibling(element, x, y);
        if(el){
            return result(this, el, 'up');
        }

        if(wrap){
            let prect = getRect(element.parentNode);
            y = prect.bottom - wrap;
            let el = getSibling(element, x, y);
            if(el){
                return result(this, el, 'up');
            }
        }
    },
    right(element, range, wrap = 0){
        let rect = getRect(element);
        let x = rect.right + range,
            y = rect.top + (height(rect) / 2);

        let el = getSibling(element, x, y);
        if(el){
            return result(this, el, 'right');
        }

        if(wrap){
            let prect = getRect(element.parentNode);
            x = prect.left + wrap;

            let el = getSibling(element, x, y);
            if(el){
                return result(this, el, 'right');
            }
        }
    },
    down(element, range, wrap = 0){
        let rect = getRect(element);
        let x = rect.left + (width(rect) / 2),
            y = rect.bottom + range;

        let el = getSibling(element, x, y);
        if(el){
            return result(this, el, 'down');
        }

        if(wrap){
            let prect = getRect(element.parentNode);
            y = prect.top + wrap;

            let el = getSibling(element, x, y);
            if(el){
                return result(this, el, 'down');
            }
        }
    }
});

export default function step(element, direction, {
    range = 1,
    wrap = 0
} = {}){

    if(!isElement(element)){
        throw new TypeError(`element is not a DOM element. Instead element is equal to ${element}.`)
    }

    if(directions[direction] === void 0){
        throw new TypeError(`direction should be up, down, left, or right. Instead direction is equal to ${direction}.`);
    }

    if(localNaN(range)){
        throw new TypeError(`options.range should be a number. Instead options.range is equal to ${range}`);
    }

    return directions[direction](element, range, wrap);
}
