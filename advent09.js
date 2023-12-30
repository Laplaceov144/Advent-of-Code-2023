/* --- Day 9: Mirage Maintenance --- PART ONE */
// https://adventofcode.com/2023/day/9

// Importing text file
function importText(textFile) {
    "use strict";
    var rawFile = new XMLHttpRequest();
    var allText = "";
    rawFile.open("Get", textFile, false);
    rawFile.onreadystatechange = function()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}
const text = importText("./advent09.txt");

const lines = text.split("\n");

// function to check if an array contains only zeroes
function zeroCheck(arr) {
    if(arr.length == 0) return false;
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] == 0) continue;
        else return false;
    }
    return true;
}

// main algorithm
let result = 0;
lines.forEach((history) => {
    const initValues = history.split(" ");
    const lastOne = parseInt(initValues[initValues.length - 1]);
    
    let arr = initValues;
    let keyValues = [];
    while(zeroCheck(arr) == false) {
        for(let i = 0; i < arr.length; i++) {
            if(i == arr.length - 1) arr[i] = null;
            else arr[i] = arr[i+1] - arr[i];
        }
        arr.pop();
        keyValues.push(arr[arr.length - 1]);
    }
    const prediction = keyValues.reduce(((acc, curr) => {
        acc += curr;
        return acc;
    }), lastOne);
    
    result += prediction;
});

console.log(result);


