/*
--- Day 4: Scratchcards --- PART ONE
https://adventofcode.com/2023/day/4

 */


import java.io.*; 
import java.nio.charset.Charset;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class advent0401 {
    public static void main(String[] args) throws IOException { 
        
        // Importing text file
        Path path = FileSystems.getDefault().getPath("advent04.txt");
        List<String> lines = Files.readAllLines(path, Charset.defaultCharset());
        
        int cardID = 1;
        double result = 0;
        
        for(String line : lines) {
            
            // Formatting a string/line into two arrays of integers: winningNumbers & ourNumbers
            String [] cardSplit = line.split(":");
            String [] mainSplit = cardSplit[1].replace("|", "#").split("#");
            String [] tmp = mainSplit[0].replaceAll("[ ]+", " ").split(" ");
            String [] tmp2 = mainSplit[1].replaceAll("[ ]+", " ").split(" ");
            tmp[0] = "0";
            tmp2[0] = "0";
            int [] winningNumbers = new int[tmp.length];
            int [] ourNumbers = new int[tmp2.length];
            for(int i = 0; i < tmp.length; i++) {
                winningNumbers[i] = Integer.parseInt(tmp[i]);
            }
            for(int i = 0; i < tmp2.length; i++) {
                ourNumbers[i] = Integer.parseInt(tmp2[i]);
            }
            
            // Counting the number of matches for every card
            double matches = 0;
            for(int i = 0; i < winningNumbers.length; i++) {
                for(int j = 0; j < ourNumbers.length; j++) {
                    if(ourNumbers[j] == winningNumbers[i] && ourNumbers[j] != 0) {
                        matches++;
                    }
                }
            }
            System.out.println("Matches for card " + cardID + ": " + matches);

            // Calculating the score for each card based on the number of matches found
            if(matches > 0) {
                matches = Math.pow(2, matches - 1);
            }
            result = result + matches;

            cardID++;
        }
        System.out.println("The result is: " + result);
    }
}


