export function isWest(rect1, rect2, range){
    if(rect1.left - rect2.right <= range){
        return hReachable(rect1, rect2);
    }
    return false;
}

export function isNorth(rect1, rect2, range){
    if(rect1.top - rect2.bottom <= range){
        return vReachable(rect1, rect2);
    }
    return false;
}

export function isEast(rect1, rect2, range){
    if(rect2.left - rect1.right <= range){
        return hReachable(rect1, rect2);
    }
    return false;
}

export function isSouth(rect1, rect2, range){
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
