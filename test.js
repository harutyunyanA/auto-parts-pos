const a = performance.now();
let number = 0;

for (let i = 0; i < 1000000000; i++) {
  number += 1;
}

const b = performance.now();
console.log(b - a);
