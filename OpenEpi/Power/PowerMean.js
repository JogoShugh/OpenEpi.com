// JavaScript Document
//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="Power For Comparing Two Means";

var Authors="<b>Statistics</b><br>Minn M. Soe and Kevin M. Sullivan, Emory University<br>"+
"<br>"+
"<b>Interface</b><br>"+
"Andrew G. Dean, EpiInformatics.com, "+
"<br>and Roger A. Mir<br> ";
      
var Description=
"This module estimates power for comparing two means. Entering means (or mean difference), standard deviation (or variance) and sample size of individual group will calculate the power at the desired confidence interval.";

//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="Suppose 100 oral contraceptive (OC) users  and 100 non-OC users are available for a study and a true difference in mean systolic blood pressure (SBP) of 5 mmHg is anticipated. Assuming estimates of standard deviation of OC users (15.35 mmHg) and non-OC users (18.23 mmHg) from a pilot study are correct, What is the power to detect a difference in SBP between these two groups at the significance level of 0.05 (95% confidence interval)?"+
	  "<ul>"+
	    "<li>To answer this question, enter the given values in respective cells in Open Epi Power for comparing two Means, and click on Calculate</li>"+
		"<li>In the new window screen, power without continuity correction will be seen as 55.52%.</li>"+
      "</ul>"+
	  "Reference: Bernard Rosner. Fundamentals of Biostatistics(5th edition). (Data obtained from example 8.31: pg 309).";


var Exercises="currently not available";
 
//----------------------------------------------------------------------------------------------------;
	  
var Pi=Math.PI; var PiD2=Pi/2; var PiD4=Pi/4; var Pi2=2*Pi;
var e=2.718281828459045235; var e10 = 1.105170918075647625;
var Deg=180/Pi;


// for computing 1 sided value of p;
function Norm(z) {
  //z=Math.abs(z);//..........omit it to compute only 1 tail value;
  var p=1+ z*(0.04986735+ z*(0.02114101+ z*(0.00327763+ z*(0.0000380036+ z*(0.0000488906+ z*0.000005383)))))
 p=p*p; p=p*p; p=p*p
 return 1/(p*p)
 }



function CalcPower(data) 
{
// significance level;
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


var m1=0; var m2=0; var s1=0; var n1=0; var v1=0; var s2=0; var v2=0; var n2=0; var ratio=0; var d=0;

var m1 = parseFloat(data[1].E2D0);
var m2 = parseFloat(data[1].E2D2);
var d = parseFloat(data[1].E2D4); // for the display purpose in the output table; depending on user's input eg. -23);
var diff = parseFloat(Math.abs(d));

if ( (m1==0)&& (m2==0)&&(diff==0) ){
	alert("Missing values! enter mean of group-1 and group-2 (or) enter mean difference of these 2 groups")
	}
if (diff==0) {
	diff=Math.abs(m1-m2);
	}
if (  ((m1==0) && (m2!=0))|| ((m2==0) && (m1!=0))  ) {
	alert("missing mean value in the other group!!")
	}



var n1 = parseFloat(data[1].E3D0);
if (n1==0) alert("missing value of sample size in group-1");
var n2 = parseFloat(data[1].E3D2);
if (n1==0) alert("missing value of sample size in group-1");
var ratio = n2/n1;


var s1 = parseFloat(data[1].E4D0);
var s2 = parseFloat(data[1].E4D2);
var v1 = parseFloat(data[1].E5D0);
var v2 = parseFloat(data[1].E5D2);

if ((s1!=0) && (s2!=0)) {
	v1=s1*s1;
	v2=s2*s2;
	};
if ((v1!=0) && (v2!=0)) {
	s1=Math.sqrt(v1);
	s2=Math.sqrt(v2);
	};

//---------------------------------


// Power calculation;
	powerz= -z +  (Math.sqrt(n1)*diff)/( Math.sqrt(  Math.pow(s1,2) + (Math.pow(s2,2)/ratio)  ));
	powerz = (1-(Norm(powerz)/2))*100; //to get a percent value;
	//alert("size "+n1+"  power"+powerz+"   power-cc"+powerzcc);

//------------------------------------------------------------;


with (outTable)
	{
	newtable(7,90);	 //6 columns and 90 pixels per column
	title("<h3>" + Title+ "</h3>");			 
	line(7); //draw the line for the length of 8 columns;
	newrow("span7:bold:c:Input Data");
	newrow("span7:l: &nbsp;  ");
	newrow("color#66ffff:span3:l:Two-sided Confidence Interval", "color#66ffff:span1:r:"+fmtSigFig(pt,6)+"%","color#66ffff:span3:l:");
	newrow("color#66ffff:span7:l: &nbsp;  ");
	newrow("color#ffff99:span2:l:",      		"color#ffff99:span1:bold:c: Group 1", 		"color#ffff99:span1:r:", 	"color#ffff99:span1:bold:c:Group 2", 		"color#ffff99:span1:c: ", "color#ffff99:span1:bold:c:Mean Difference <sup>1" ); //to insert a new row;
	if ((m1==0) && (m2==0)) {
	newrow("color#ffff99::span2:l:Mean", 		"color#ffff99:span1:c:",	"color#ffff99:span1:c:", 	"color#ffff99:span1:c:", 	"color#ffff99:span1:c:", "color#ffff99:span1:c:"+fmtSigFig(d,6) );
	}else {	
	newrow("color#ffff99::span2:l:Mean", 		"color#ffff99:span1:c:"+fmtSigFig(m1,6),	"color#ffff99:span1:c:", 	"color#ffff99:span1:c:"+fmtSigFig(m2,6), 	"color#ffff99:span1:c:", "color#ffff99:span1:c:"+fmtSigFig(m1-m2,6) );
	};
	
	newrow("color#ffff99::span2:l:Sample size", "color#ffff99:span1:c:"+fmtSigFig(n1,6),	"color#ffff99:span1:c:", "color#ffff99:span1:c:"+fmtSigFig(n2,6), 	"color#ffff99:span3:c:" );
	newrow("color#ffff99::span2:l:Standard deviation", "color#ffff99:span1:c:"+fmtSigFig(s1,6),"color#ffff99:span1:c:", "color#ffff99:span1:c:"+fmtSigFig(s2,6), 	"color#ffff99:span3:c:" );
	newrow("color#ffff99::span2:l:Variance",	 "color#ffff99:span1:c:"+fmtSigFig(v1,6),	"color#ffff99:span1:c:", "color#ffff99:span1:c:"+fmtSigFig(v2,6), 		"color#ffff99:span3:c:" );
	line(7);
	newrow("span7:l: &nbsp;  ");
	newrow("span3:bold:l:Power based on: ");
	newrow("span3:l: Normal approximation method","span1:c:" +fmtSigFig(powerz,4)+"%");
	line(7);
	newrow("span7:l: <sup>1</sup> <small> Mean difference= (Group 1 mean) - (Group 2 mean)</small>");
	endtable();
	}  
} 
//end of calculate CIMean routine






