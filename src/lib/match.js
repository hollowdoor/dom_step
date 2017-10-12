import nextElementSibling from 'dom-next-element-sibling';
import previousElementSibling from 'dom-previous-element-sibling';
import rawObject from 'raw-object';

const find = rawObject({
    next: nextElementSibling,
    prev: previousElementSibling
});

export default function match(isDirection, element, range, traverse){
    let rect1 = getRect(element);
    let current = element;
    let near = find[traverse];
    while(current = near(current)){
        let rect2 = getRect(current);
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
