//If there are problems with getBoundingClientRect
//See https://github.com/webmodules/bounding-client-rect
export function getRect(e){
    return e.getBoundingClientRect();
}

export function height(rect){
    return rect.bottom - rect.top;
}

export function width(rect){
    return rect.right - rect.left;
}
