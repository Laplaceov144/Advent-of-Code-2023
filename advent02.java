/*
--- Day 2: Cube Conundrum --- PART 1
https://adventofcode.com/2023/day/2


max: red - 12, green - 13, blue - 14
 */


import java.io.*; 
import java.nio.charset.Charset;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class advent02 {
    public static void main(String[] args) throws IOException { 
        
        Path path = FileSystems.getDefault().getPath("advent02.txt");
        List<String> lines = Files.readAllLines(path, Charset.defaultCharset());
        System.out.println("_________");
        int gameID = 1;
        int result = 0;
        
        for(String line : lines) {
            System.out.println(line);
            String [] gameSplit = line.split(":");
            String [] split = gameSplit[1].split(";");
            String coma = ",";

            // Single game
            outer:
            for(int i = 0; i < split.length; i++) {
                split[i] = coma.concat(split[i]);
                String [] singleCells = split[i].split(",");
                
                // Single draw
                for(int j = 1; j < singleCells.length; j++) {
                    if(singleCells[j].contains("red")) {
                        String ballsNumber = singleCells[j].substring(0, singleCells[j].indexOf("red"));
                        ballsNumber = ballsNumber.trim();
                        if(Integer.parseInt(ballsNumber) > 12) break outer;
                    }
                    if(singleCells[j].contains("green")) {
                        String ballsNumber = singleCells[j].substring(0, singleCells[j].indexOf("green"));
                        ballsNumber = ballsNumber.trim();
                        if(Integer.parseInt(ballsNumber) > 13) break outer;
                    }
                    if(singleCells[j].contains("blue")) {
                        String ballsNumber = singleCells[j].substring(0, singleCells[j].indexOf("blue"));
                        ballsNumber = ballsNumber.trim();
                        if(Integer.parseInt(ballsNumber) > 14) break outer;
                    }
                }
               
              if(i == split.length - 1) {
                result = result + gameID;
              }
            }
            

            System.out.println(gameID);
            System.out.println(result);
            System.out.println("_________");

            gameID++;
        }
        System.out.println(result);
        
        
    }
}
