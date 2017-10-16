//Some modules exist for this,
//but they do runtime exports (not static)
export default function isVisible(el){
    return el.offsetParent !== null
}
