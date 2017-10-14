import nextElementSibling from 'dom-next-element-sibling';
import previousElementSibling from 'dom-previous-element-sibling';
import rawObject from 'raw-object';

const find = rawObject({
    next: nextElementSibling,
    prev: previousElementSibling
});

export default function match(isDirection, isEdge, element, range, traverse){
    let rect1 = getRect(element);
    let current = element;
    let near = find[traverse];
    let parent = element.parentNode;

    if(isEdge(rect1, range, parent)){
        return;
    }

    while(current = near(current)){
        let rect2 = getRect(current);

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
