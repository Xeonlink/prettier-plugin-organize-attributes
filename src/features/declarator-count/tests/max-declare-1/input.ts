const a = 1, b = 2, c = 3, d = 4, e = 5;

// comment1


let f=1, 
g=2, 
h=3, i=4, j=5;

var k=1, l=2, m=3, n=4, o=5;

function test() {
    // comment2
    const p=1, q=2, r=3, s=4, t=5;
    let u=1, v=2, w=3, x=4, y=5;
    var z=1, A=2, B=3, C=4, D=5;
}

{
    const p=1, q=2, r=3, s=4, t=5;
    let u=1, v=2, w=3, x=4, y=5;
    var z=1, A=2, B=3, C=4, D=5;
}

switch (a) {
    case 1:
        const p=1, q=2, r=3, s=4, t=5;
        let u=1, v=2, w=3, x=4, y=5;
        var z=1, A=2, B=3, C=4, D=5;
        break;
}