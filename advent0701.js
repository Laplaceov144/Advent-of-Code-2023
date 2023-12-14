// --- Day 7: Camel Cards --- PART ONE
// https://adventofcode.com/2023/day/7

// FIVE (6)>> FOUR (5)>> FULL HOUSE (4)>> 3 (3)>> 2x2 (2) >> 2(1)
// A > K > Q > J > T > 9 > 8 etc.

// Pre-defined function that counts occurrences of a given character within a string.
const countOccurrences = (str, char) => {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === char) {
            count++;
        }
    }
    return count;
};


// A function that tells us how many times a card value repeats in a single hand, it returns an array
const holdem = (inputStr) => {
    const sortedStr = inputStr.split('').sort().join(''); 
    let prevChar = sortedStr[0]; 
    let duplicates = []; 
    let holdem = [];
    for (const char of sortedStr.slice(1)) { 
        if (char === prevChar && !duplicates.includes(char)) { 
        duplicates.push(char); 
        holdem.push(countOccurrences(inputStr, char));
    } 
    prevChar = char; 
    } 
    return holdem;
};

// And now reduces it to a single score value to make it comparable with other hands
const primaryScore = (holdem) => {
    const max = Math.max(...holdem);
    const second = Math.max(holdem.filter(item => {
        return item < max;
    }));

    if(max >= 4)                return max + 1;
    if(max == 3 && second == 2) return 4;
    if(max == 3 && second != 2) return 3;  
    if(holdem = [2, 2] && holdem.length == 2) return 2;
    if(max == 2 && second == 0) return 1;
    else return 0;
}


// A function that returns an array of respective scores for each card in a single hand
const secondaryScore = (inputStr) => {
    const arr = inputStr.split("").map(element => {
       switch(element) {
            case 'A':
                element = 14;
                break;
            case 'K':
                element = 13;
                break;
            case 'Q':
                element = 12;
                break;
            case 'J':
                element = 11;
                break;
            case 'T':
                element = 10;
                break;
            default:
                element = parseInt(element);
        }
        return element;
    });
    return arr;;
}


// Importing text file with data
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
const text = importText("./advent07.txt");



// Formatting input data
let data = text.split("\n").map(item => {
    const lineSplit = item.split(" ");
    const dataItem = {
        rank: null,
        primaryScore: 0,
        secondaryScore: 0,
        hand: lineSplit[0],
        bid: parseInt(lineSplit[1])
    };
    return dataItem;
});


// Assigning holdem and high card scores
data.forEach(element => {
    element.primaryScore = primaryScore(holdem(element.hand));
    element.secondaryScore = secondaryScore(element.hand);
});



// Sorting hands by these scores
data = data.sort(function(a, b) {
    if(a.primaryScore > b.primaryScore) return 1;
    if(a.primaryScore < b.primaryScore) return -1;
    else if(a.primaryScore == b.primaryScore) {
        for(let i = 0; i < 5; i++) {
            if(a.secondaryScore[i] > b.secondaryScore[i]) return 1;
            if(a.secondaryScore[i] < b.secondaryScore[i]) return -1;
            if(a.secondaryScore[i] == b.secondaryScore[i] && i != 5) continue; 
            else if(a.secondaryScore[i] == b.secondaryScore[i] && i == 5) return 0;
        }
    }
});
console.log(data);

// Calculating result
let i = 1;
for(hand of data) {
    hand.rank = i;
    i++;
}
const result = data.map(item => {
    return item.rank * item.bid;
}).reduce((acc, curr) => {
    acc += curr;
    return acc;
}, 0)
console.log(result);

