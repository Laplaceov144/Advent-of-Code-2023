// Importing text file
const fs = require('node:fs');
try {
    const text = fs.readFileSync('advent10.txt', 'utf8');

    // Splitting the text into separate lines
    const lines = text.split("\n");

    // The main algorithm
    let row = 0;
    let steps = 1;
    for(line of lines) {
        if(line.includes("S")) {
            let column = line.indexOf("S");
            let direction = [0, 1]; // Since the second tile is '7'
            column++;
            const current = (row, column) => lines[row].charAt(column);

            while(current(row, column) != "S") {
                switch(current(row, column)) {
                    case '|': case '-':
                        break;
                    case 'L': case '7':
                        direction = [direction[1], direction[0]];
                        break;
                    case 'J': case 'F':
                        direction = [(-1) * direction[1], (-1) * direction[0]];
                        break;
                }
                row += direction[0];
                column += direction[1];
                steps++;
            }            
            break;
        }
    row++;
    }

    // The result
    console.log(steps / 2);

} catch (err) {
  console.error(err);
}


