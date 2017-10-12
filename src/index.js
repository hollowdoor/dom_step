import rawObject from 'raw-object';
import localNaN from 'is-nan';
import isElement from './lib/iselement.js';
import match from './lib/match.js';
import { isWest, isNorth, isEast, isSouth } from './lib/compass.js';

const directions = rawObject({
    left(element, range, traverse = 'prev'){
        return match(isWest, element, range, traverse);
    },
    up(element, range, traverse = 'prev'){
        return match(isNorth, element, range, traverse);
    },
    right(element, range, traverse = 'next'){
        return match(isEast, element, range, traverse);
    },
    down(element, range, traverse = 'next'){
        return match(isSouth, element, range, traverse);
    }
});

export default function step(element, direction, {
    range = 1,
    traverse
} = {}){

    if(!isElement(element)){
        throw new TypeError(`element is not a DOM element. Instead element is equal to ${element}.`)
    }

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
