const a = 1,
  b = 2;

const c = 3,
  d = 4;

const e = 5;

let f = 1,
  g = 2;

let h = 3,
  i = 4;

let j = 5;

// comment1

var k = 1,
  l = 2;

var m = 3,
  n = 4;

var o = 5;

function test() {
  const p = 1,
    q = 2;
  const r = 3,
    s = 4;
  const t = 5;
  let u = 1,
    v = 2;
  let w = 3,
    x = 4;
  let y = 5;
  var z = 1,
    A = 2;
  var B = 3,
    C = 4;
  var D = 5;
}

{
  const p = 1,
    q = 2;
  const r = 3,
    s = 4;
  const t = 5;
  let u = 1,
    v = 2;
  let w = 3,
    x = 4;
  let y = 5;
  var z = 1,
    A = 2;
  var B = 3,
    C = 4;
  var D = 5;
}

switch (a) {
  case 1:
    const p = 1,
      q = 2;
    const /* comment2 */ r = 3,
      s = 4;
    const t = 5;
    let u = 1,
      v = 2;
    let w = 3,
      x = 4;
    let y = 5;
    var z = 1,
      A = 2;
    var B = 3,
      C = 4;
    var D = 5;
    break;
}
