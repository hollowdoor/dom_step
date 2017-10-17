export default function has(parent, child){
    return child !== parent
    && (parent === child.parentNode && parent.contains(child));
}
