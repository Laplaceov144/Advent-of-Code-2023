// --- Day 6: Wait For It --- PARTS ONE & TWO
// https://adventofcode.com/2023/day/6

// ~~~~~~~~~~~~~~PART ONE~~~~~~~~~~~~~~~

const times = [55, 82, 64, 90];
const records = [246, 1441, 1012, 1111];
// timeLimit = runTime(i) + loadTime = 55 etc.
// runDistance = speed * runTime >= 246 etc.
// speed = loadTime

let product = 1;
for(let i = 0; i < 4; i++) {
    let options = 0;
    for(let j = 0; j <= times[i]; j++) {
        let runTime = j;
        let loadTime = times[i] - j;
        let distance = runTime * loadTime;
        if(distance >= records[i]) {
            options++;
        }
    }
    product = options * product;
}

// This is the result
console.log(product);


// ~~~~~~~~~~~~~~PART TWO~~~~~~~~~~~~~~~

let result = null;
for(let i = 0; i < 4; i++) {
    let options = 0;
    for(let j = 0; j <= 55826490; j++) {
        let runTime = j;
        let loadTime = 55826490 - j;
        let distance = runTime * loadTime;
        if(distance >= 246144110121111) {
            options++;
        }
    }
    result = options;
}

// This is the result of part two
console.log(result);
