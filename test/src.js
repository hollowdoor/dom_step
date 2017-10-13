import step from '../';
const vlist = document.querySelector('#vertical').children;
const hlist = document.querySelector('#horizontal').children;
const flist = document.querySelector('#flowing').children;

console.log('- vlist -')
loop(3, vlist[0], last=>{
    const down = step(last, 'down');
    console.log(down.innerHTML);
    return down;
});

loop(3, vlist[3], last=>{
    const up = step(last, 'up');
    console.log(up.innerHTML);
    return up;
});
console.log('- hlist -')
loop(3, hlist[0], last=>{
    const right = step(last, 'right');
    console.log(right && right.innerHTML);
    return right;
});

loop(3, hlist[3], last=>{
    const left = step(last, 'left');
    console.log(left.innerHTML);
    return left;
});

console.log('- flist -')

one(0, 'right');
one(0, 'down');
one(3, 'left');
one(3, 'up');
one(1, 'down');
one(1, 'left');
console.log('- edges -');
one(3, 'down');
one(1, 'right');

function loop(n, last, fn){
    try{
        for(let i=0; i<n; i++){
            last = fn(last);
        }
    }catch(e){ console.error(e); }
}

function one(index, direction, options){

    const el = step(flist[index], direction, options);
    console.log(direction, ' index ',index,'flowing ', flist[index], ' result ', el);
    //console.log(el)
    //console.log('arguments ',arguments)

    console.log(el && el.innerHTML);
}
