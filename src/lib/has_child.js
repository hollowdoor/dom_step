export default function has(parent, child){
    return child
    && (parent === child.parentNode || parent.contains(child));
}
