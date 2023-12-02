/*
 * --- Day 1: Trebuchet?! ---
Something is wrong with global snow production, and you've been selected to take a look. The Elves have even given you a map; on it, they've used stars to mark the top fifty locations that are likely to be having problems.

You've been doing this long enough to know that to restore snow operations, you need to check all fifty stars by December 25th.

Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants one star. Good luck!

You try to ask why they can't just use a weather machine ("not powerful enough") and where they're even sending you ("the sky") and why your map looks mostly blank ("you sure ask a lot of questions") and hang on did you just say the sky ("of course, where do you think snow comes from") when you realize that the Elves are already loading you into a trebuchet ("please hold still, we need to strap you in").

As they're making the final adjustments, they discover that their calibration document (your puzzle input) has been amended by a very young Elf who was apparently just excited to show off her art skills. Consequently, the Elves are having trouble reading the values on the document.

The newly-improved calibration document consists of lines of text; each line originally contained a specific calibration value that the Elves now need to recover. On each line, the calibration value can be found by combining the first digit and the last digit (in that order) to form a single two-digit number.


 */


import java.io.*; 
import java.nio.charset.Charset;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class advent01 {
    public static void main(String[] args) throws IOException { 
       
        Path path = FileSystems.getDefault().getPath("advent01.txt");
        List<String> lines = Files.readAllLines(path, Charset.defaultCharset());
        int result = 0;
        
        for (String line : lines) {
            line = line.replaceAll("oneight", "oneeight");
            line = line.replaceAll("twone", "twoone");
            line = line.replaceAll("threeight", "threeeight");
            line = line.replaceAll("fiveight", "fiveeight");
            line = line.replaceAll("sevenine", "sevennine");
            line = line.replaceAll("eightwo", "eighttwo");
            line = line.replaceAll("eighthree", "eightthree");
            line = line.replaceAll("nineight", "nineeight");
            line = line.replaceAll("one", "1");
            line = line.replaceAll("two", "2");
            line = line.replaceAll("three", "3");
            line = line.replaceAll("four", "4");
            line = line.replaceAll("five", "5");
            line = line.replaceAll("six", "6");
            line = line.replaceAll("seven", "7");
            line = line.replaceAll("eight", "8");
            line = line.replaceAll("nine", "9");
            System.out.println(line);
            int lng = line.length();
            //System.out.println(lng);
            String ccat = null;    
        
            for(int i = 0; i  < lng; i++) {

                if(Character.isDigit(line.charAt(i))) {
                    ccat = String.valueOf(line.charAt(i));
                    break;
                }
            }

            for(int i = lng - 1; i >= 0; i--) {
                if(Character.isDigit(line.charAt(i))) {
                    ccat = ccat.concat(String.valueOf(line.charAt(i)));
                    break;
                }
            }
            System.out.println(ccat);
            result = result + Integer.parseInt(ccat);
            System.out.println(result);
            System.out.println("___________");
        }

        System.out.println(result);
        // The result should be = 53268
    }
}
