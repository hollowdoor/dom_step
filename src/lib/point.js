export default function point(x, y){
    let div = document.createElement('div');
    div.style.width = '4px';
    div.style.height = '4px';
    div.style.backgroundColor = 'red';
    div.style.position = 'absolute';
    div.style.top = (y - 2) + 'px';
    div.style.left = (x - 2) + 'px';
    document.body.appendChild(div);
}
