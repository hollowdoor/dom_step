import nextElementSibling from 'dom-next-element-sibling';
import previousElementSibling from 'dom-previous-element-sibling';
import rawObject from 'raw-object';
import localNaN from 'is-nan';
//traverser

const find = rawObject({
    next: nextElementSibling,
    prev: previousElementSibling
});

const directions = rawObject({
    left(element, range, traverse = 'prev'){
        let near = find[traverse];
        let current = near(element);
        let [rect1, rect2] = getRects(element, current);

        if(isWest(rect1, rect2, range)){
            return current;
        }

        while(current = near(current)){
            let [rect2] = getRects(current);
            if(isWest(rect1, rect2, range)){
                return current;
            }
        }
    },
    up(element, range, traverse = 'prev'){
        let near = find[traverse];
        let current = near(element);
        let [rect1, rect2] = getRects(element, current);

        if(isNorth(rect1, rect2, range)){
            return current;
        }

        while(current = near(current)){
            let [rect2] = getRects(current);
            if(isNorth(rect1, rect2, range)){
                return current;
            }
        }
    },
    right(element, range, traverse = 'next'){
        let near = find[traverse];
        let current = near(element);
        let [rect1, rect2] = getRects(element, current);

        if(isEast(rect1, rect2, range)){
            return current;
        }

        while(current = near(current)){
            let [rect2] = getRects(current);
            if(isEast(rect1, rect2, range)){
                return current;
            }
        }
    },
    down(element, range, traverse = 'next'){
        let near = find[traverse];
        let current = near(element);
        let [rect1, rect2] = getRects(element, current);

        if(isSouth(rect1, rect2, range)){
            return current;
        }

        while(current = near(current)){
            let [rect2] = getRects(current);
            if(isSouth(rect1, rect2, range)){
                return current;
            }
        }
    }
});

export default function step(element, direction, {
    range = 1,
    traverse
} = {}){
    if(directions[direction] === void 0){
        throw new TypeError(`direction should be up, down, left, or right. Instead direction is equal to ${direction}.`);
    }

    if([undefined, 'next', 'prev'].indexOf(traverse) === -1){
        throw new TypeError(`options.traverse should be "next", "prev", or undefined. Instead options.traverse is equal to ${traverse}.`);
    }

    if(localNaN(range)){
        throw new TypeError(`options.range should be a number. Instead options.range is equal to ${range}`);
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
    let c = hCenter(rect1);
    return rect2.bottom > c || rect2.top < c;
    //return (rect2.top <= rect1.top && rect2.bottom > rect1.top);
}

function vReachable(rect1, rect2){
    let c = vCenter(rect1);
    return rect2.right > c || rect2.left < c;
    //return (rect2.left <= rect1.left && rect2.right > rect1.left);
}

function vCenter(rect){
    return rect.bottom - rect.top / 2;
}

function hCenter(rect){
    return rect.right - rect.left / 2;
}

function getRects(...elements){
    return elements.map(getRect);
}

function getRect(e){
    return e.getBoundingClientRect();
}
