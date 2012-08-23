// JavaScript Document
//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="Sample Size For Comparing Two Means";

var Authors="<b>Statistics</b><br>Minn M. Soe and Kevin M. Sullivan, Emory University<br>"+
"<br>"+
"<b>Interface</b><br>"+
"Andrew G. Dean, EpiInformatics.com, "+
"<br>and Roger A. Mir<br> ";
      
var Description="This module calculates sample sizes for comparing two means. Enter a desired confidence interval, power, ratio of sample size of group 2 to group 1, mean (or mean difference) and standard deviation (or variance), and the sample size will be calculated for each group.";

	
//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="An example is given by a hypothetical blood pressure study among oral contraceptive (OC) users and non-users described in a text by Rosner. Suppose we assume that true systolic blood pressure (SBP) of 35 to 39 year old OC users is normally distributed with mean (132.86 mmHg) and standard deviation (15.34 mmHg). Similarly, for non-OC users, assume the SBP is normally distributed with mean (127.44 mmHg) and standard deviation (18.23 mmHg). If we desire an equal sample size in both groups, what would be the minimal sample size in each group to detect a difference with a power of 80% at 95% confidence level?"+
	  "<ul>"+
	    "<li>To answer this question, enter the given values in respective cells in 'Open Epi: Sample Size for comparing two means' program, and click on Calculate</li>"+
		"<li>In the new window screen, the sample size required will be 152 each. </li>"+
      "</ul>"+
"Reference: Bernard Rosner. Fundamentals of Biostatistics(5th edition). (Data obtained from example 8.28 and 8.29: pg 307).";

var Exercises="currently not available";
 
//----------------------------------------------------------------------------------------------------;

function CalcPower(data) 
{
// Enter confidence interval level;
var powerz=0; var  cscrit=0; var z=0; var pt=0; //pt=percent;
var pt=parseFloat(data[1].E0D2);
//alert("percent"+pt);

	if (pt==99.99)  cscrit=15.137
    if (pt==99.98)  cscrit=13.831
    if (pt==99.95)  cscrit=12.116 
    if (pt==99.9)   cscrit=10.828
    if (pt==99.8)   cscrit=9.550 
    if (pt==99.5)   cscrit=7.879
    if (pt==99)  	cscrit=6.635
    if (pt==98)  	cscrit=5.412
    if (pt==95)  	cscrit=3.841
    if (pt==90)  	cscrit=2.706 
    if (pt==85)  	cscrit=2.072
    if (pt==80)  	cscrit=1.642
    if (pt==75)  	cscrit=1.323
    if (pt==70)  	cscrit=1.074
    if (pt==65)  	cscrit=0.873
    if (pt==60)  	cscrit=0.708 
    if (pt==55)  	cscrit=0.571
    if (pt==50)  	cscrit=0.455
    if (pt==45)  	cscrit=0.357
    if (pt==40)  	cscrit=0.275
    if (pt==35)  	cscrit=0.206
    if (pt==30)  	cscrit=0.148
    if (pt==25)  	cscrit=0.102
    if (pt==20)  	cscrit=0.064;
		
z = Math.sqrt(cscrit);


// Enter Power ;
var power=0; var powerpt=0; 
var powerpt=parseFloat(data[1].E1D2);
if (powerpt==95)  power=1.6449;
if (powerpt==90)  power=1.2815;
if (powerpt==80)  power=0.8416;
if (powerpt==70)  power=0.5244;
if (powerpt==60)  power=0.2533;
//alert("power"+power+"percent"+powerpt);


// desired ratio of sample size of gp-2 to gp-1;
if (parseFloat(data[1].E2D2)==0) {
	alert("missing value in ratio");
	}
else {var ratio = parseFloat(data[1].E2D2)}; 
//alert("ratio"+ratio);


// Obtain the Mean difference ;
//Calculating expected Mean difference;
var s1=0; var m1=0; var v1=0; var s2=0; var v2=0; var m2=0; var diff=0; var d=0;
//May 2007 Next two lines changed from .E4D4 to .E4D5   Now there is output!
if (parseFloat(data[1].E4D5) != 0) {
	var diff = parseFloat(data[1].E4D5);
	var d=diff;
	m1 = " ";
	m2 = " ";
	}
else {
	var m1 = parseFloat(data[1].E4D0);
	var m2 = parseFloat(data[1].E4D2);
	var d  =  m1-m2;
	var diff = Math.abs(m1-m2);
}
//alert("diff"+diff);



// reading SD and Variance;
var s1 = parseFloat(data[1].E5D0);
var v1 = parseFloat(data[1].E6D0);
//alert("s1  "+s1+" v1 "+v1);

var s2 = parseFloat(data[1].E5D2);
var v2 = parseFloat(data[1].E6D2);
//alert("s2  "+s2+" v2 "+v2);

if ((s1!=0) && (s2!=0)) {
	v1=s1*s1;
	v2=s2*s2;
	};
if ((v1!=0) && (v2!=0)) {
	s1=Math.sqrt(v1);
	s2=Math.sqrt(v2);
	};





// --------------------------------Sample size Calculation-----------------------------------------------;
var n1=0; var n2=0; var n3=0;

n1=Math.ceil( ( Math.pow(s1,2)+ (Math.pow(s2,2)/ratio) ) * Math.pow(z+power,2) / (Math.pow(diff,2)) );
//n2=Math.ceil( (ratio*(Math.pow(s1,2))+ Math.pow(s2,2) ) * Math.pow(z+power,2) / (Math.pow(diff,2)) );
n2=Math.ceil(n1*ratio);
n3=n1+n2;
//alert("n1   "+n1+"   n2   "+n2);

//---------------------------------------------------------------------------------------------;


with (outTable)
	{
	newtable(7,90);	 //6 columns and 90 pixels per column
	title("<h3>" + Title+ "</h3>");			 
	line(7); //draw the line for the length of 8 columns;
	newrow("span8:bold:c:Input Data");
	newrow("span8:l: &nbsp;  "); //to insert a new row;
	
	newrow("color#66ffff:span3:l:Confidence Interval  (2-sided)", "color#66ffff:span1:c:"+fmtSigFig(pt,6)+"%","color#66ffff:span3:l:");
	newrow("color#66ffff:span3:l:Power", "color#66ffff:span1:c:"+fmtSigFig(powerpt,6)+"%","color#66ffff:span3:l:");
	newrow("color#66ffff:span3:l:Ratio of sample size (Group 2/Group 1)", "color#66ffff:span1:c:"+fmtSigFig(ratio,6),"color#66ffff:span3:l:");
	newrow("color#66ffff:span7:l: &nbsp;  ");
	newrow("color#ffff99:span2:l:",      		"color#ffff99:span1:bold:c: Group 1", 		"color#ffff99:span1:r:", 	"color#ffff99:span1:bold:c:Group 2", 		"color#ffff99:span1:c: ", "color#ffff99:span1:bold:c:Mean difference<sup>1" ); //to insert a new row;
	if ((m1==0) && (m2==0)) {
	newrow("color#ffff99::span2:l:Mean", 		"color#ffff99:span1:c:",	"color#ffff99:span1:c:", 	"color#ffff99:span1:c:", 	"color#ffff99:span1:c:", "color#ffff99:span1:c:"+fmtSigFig(d,6) );
	}else {	
	newrow("color#ffff99::span2:l:Mean", 		"color#ffff99:span1:c:"+fmtSigFig(m1,6),	"color#ffff99:span1:c:", 	"color#ffff99:span1:c:"+fmtSigFig(m2,6), 	"color#ffff99:span1:c:", "color#ffff99:span1:c:"+fmtSigFig(m1-m2,6) );
	};
	newrow("color#ffff99::span2:l:Standard deviation", "color#ffff99:span1:c:"+fmtSigFig(s1,6),"color#ffff99:span1:c:", "color#ffff99:span1:c:"+fmtSigFig(s2,6), 	"color#ffff99:span3:c:" );
	newrow("color#ffff99::span2:l:Variance",	 "color#ffff99:span1:c:"+fmtSigFig(v1,6),	"color#ffff99:span1:c:", "color#ffff99:span1:c:"+fmtSigFig(v2,6), 		"color#ffff99:span3:c:" );
	line(7);
	//newrow("span8:l: &nbsp; ");
	newrow("span3:l: Sample size of Group 1","span1:c:"+n1);
	newrow("span3:l: Sample size of Group 2","span1:c:"+n2);
	//line(7);
	newrow("span3:l: Total sample size","span1:c:"+n3);
	line(7);
	newrow("span7:l: <sup>1</sup> Mean difference= (Group 1 mean) - (Group 2 mean)</small>");
	endtable();
	}  
} 
//end of calculate CIMean routine






