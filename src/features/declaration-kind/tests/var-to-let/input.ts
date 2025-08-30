let a = 1;

const b = 2;

var c = 3;


using d = {
    [Symbol.dispose]() {
        console.log("dispose");
    }
}


await using e = {
    [Symbol.dispose]() {
        console.log("dispose");
    }
}