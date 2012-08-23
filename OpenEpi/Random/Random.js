// JavaScript Document
//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="Random Number Generator";

var Authors="Andrew G. Dean, EpiInformatics.com<br>";
       
var Description="<p>This module generates a specified number of 'random' "+
"integers within a a given range. To obtain decimal results, generate integers "+
"and then move the decimal point as needed. <br>"+
"The numbers can be printed from the "+
"browser or cut and pasted to other programs.</p> ";
 
//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="Seven cases of Rhodococcus bronchialis surgical wound infection occurred among 331 cardiac surgery patients."+      
	  "<ul>"+
	    "<li>Suppose that you wish to abstract records of 28 patients among 324 who did not have postoperative infections with Rhodococcus bronchialis. </li>"+
		"<li>We make a list of the potential controls from 1 to 324, request 30 random numbers from 1 to 324, and use the first 28 to identify the positions of the chosen controls on the list. If two numbers come up the same, we use one of the two extras to complete the list.</li>"+
      "</ul>";

var Exercises="Suppose that we want a random sample of geographic units (provinces) with chance of selection proportional to population. These will be the primary sampling units (PSU) of a cluster survey.  We would like 30 units. "+ 
 "<ul>"+
	  "<li>One way to do this would be to assign sequential groups of numbers to each province, with the number of numbers determined by population.  Hence, assign 1 through 34 to province A which has 34,000 people, and 35 through 54 to province B with 20,000 people.  The entire country has 945,000, so we assign numbers 1 through 945 altogether. </li>"+
      "<li>Now produce 30 random numbers from 1 to 945 and choose the provinces in which the random numbers match the assigned numbers.  What should be done if 2 or more random numbers fall within a single province? </li>"+
      "<li>If you prefer to take a systematic sample (every 30th number), how can the random number generator assist in doing this correctly?</li>"+
 "</ul>";
    
function randomInt(lower,upper)
 {
   return Math.round(Math.random()*(upper-lower) + lower) 

 }
 
function Fmt(x) 
{ 
var v
if(x>0) { v=''+(x+0.00000001) } else { v=''+(x-0.00000000) };
return v.substring(0,v.indexOf('.')+8)
}
