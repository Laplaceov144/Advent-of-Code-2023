// --- Day 2: Cube Conundrum --- PART 2

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
const text = importText("./advent02.txt");
//console.log(text);

// Splitting the text file into separate lines/games
const games = text.split(/\r?\n/);



//console.log(strings);

let result = 0;

for (const game of games) { 
    // Splitting separate draws
    const draws = game.split(': ')[1].split('; ');
    
    const bag = { red: 0, green: 0, blue: 0 }
    
    for(const draw of draws) {
        const balls = draw.split(', ');
        for (const ball of balls) {
            // Splitting into just single 'number - colour' pairs
            const [ count, colour ] = ball.split(' ');
            if (bag[colour] < count) {
                bag[colour] = Number(count)
            }
        }
    }
    result += Object.values(bag).reduce((acc, curr) =>  acc * curr, 1)
}

console.log(result)