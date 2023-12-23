/*
 * Day 8 : Advent of Code ~~ PART ONE
 * https://adventofcode.com/2023/day/8
 */


import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public class advent0801 {
    public static void main(String[] args) throws IOException {
        
        Path path = FileSystems.getDefault().getPath("advent08.txt");
        List<String> lines = Files.readAllLines(path, Charset.defaultCharset());
        
        // Sequence of steps (LR...)
        String seq = lines.get(0);
        
        // Formating data
        lines.remove(0);
        lines.remove(0);
        ArrayList<String> basePoints = new ArrayList<String>();
        ArrayList<String> leftTurns = new ArrayList<String>();
        ArrayList<String> rightTurns = new ArrayList<String>();
        
        for(String line : lines) {
            String bPoint = line.substring(0, 3);
            basePoints.add(bPoint);
            String lTurn = line.substring(7, 10);
            leftTurns.add(lTurn);
            String rTurn = line.substring(12, 15);
            rightTurns.add(rTurn);
        }
        
        // Declaring necessary variables
        int result = 0;
        String currPoint = "AAA";
        int address = 0;
        Character nextTurn = 'L';
       
        // The core algorithm
        while(currPoint.equals("ZZZ") == false) {
            address = basePoints.indexOf(currPoint);
            
            if(nextTurn == 'L') currPoint = leftTurns.get(address);
            else currPoint = rightTurns.get(address);
            
            result++;
            nextTurn = seq.charAt(result % seq.length()); 
        }
        
        // The result should be 22357
        System.out.println("The result is: " + result);
    }
}