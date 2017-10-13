export function isWest(rect1, rect2, range){
    let distance = rect1.left - rect2.right;
    if(distance > -1 && distance <= range){
        return vContained(rect1, rect2);
    }
    return false;
}

export function isNorth(rect1, rect2, range){
    let distance = rect1.top - rect2.bottom;
    if(distance > -1 && distance <= range){
        return hContained(rect1, rect2);
    }
    return false;
}

export function isEast(rect1, rect2, range){
    let distance = rect2.left - rect1.right;
    if(distance > -1 && distance <= range){
        return vContained(rect1, rect2);
    }
    return false;
}

export function isSouth(rect1, rect2, range){
    let distance = rect2.top - rect1.bottom;
    if(distance > -1 && distance <= range){
        return hContained(rect1, rect2);
    }
    return false;
}

//(h) horizontal
//(v) vertical

function hContained(rect1, rect2){
    let c1 = hCenter(rect1);
    return rect2.left >= rect1.left && rect2.left <= c1
    || rect2.right <= rect1.right && rect2.right >= c1;
}

function vContained(rect1, rect2){
    let c1 = vCenter(rect1);
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

export function westEdge(rect, range, parent){
    let subject = document.elementFromPoint(
        rect.left - range, rect.top + (height(rect) / 2));
    return subject && parent !== subject.parentNode;
}

export function northEdge(rect, range, parent){
    let subject = document.elementFromPoint(
        rect.left + (width(rect) / 2), rect.top - range);
    return subject && parent !== subject.parentNode;
}

export function eastEdge(rect, range, parent){
    let subject = document.elementFromPoint(
        rect.right + range, rect.top + (height(rect) / 2));
    return subject && parent !== subject.parentNode;
}

export function southEdge(rect, range, parent){
    let subject = document.elementFromPoint(
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
