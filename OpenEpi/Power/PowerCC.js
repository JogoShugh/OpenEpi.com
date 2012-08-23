// JavaScript Document
//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="Power for Unmatched Case-Control Studies";

var Authors="<b>Statistics</b><br>Minn M. Soe and Kevin M. Sullivan, Emory University<br>"+
"<br>"+
"<b>Interface</b><br>"+
"Andrew G. Dean, EpiInformatics.com, "+
"<br>and Roger A. Mir<br> ";
      
var Description=
"This module estimates the power for unmatched case-control studies. Entering the number of cases and controls, percent with exposure within each, and desired confidence interval will calculate the power with and without the continuity correction.";


	
//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="An example is provided by an unmatched case control study of an association between spontaneous abortion and prior induced abortion. Researchers wanted to estimate the power of detecting a difference in exposure (prior induced abortion) between cases and controls, based on the available sample sizes. There were 474 cases and 255 controls recruited for this study. The percent of cases and controls with prior history of induced abortion were found to be 45.0% and 35.29%, respectively. What is the power to detect a significant difference between these two groups at the significance level of 0.05 (95% confidence interval)?"+
	  "<ul>"+
	    "<li>To answer this question, enter the given values in respective cells in Open Epi Estimation of Power for unmatched case control program, and click on Calculate.</li>"+
		"<li>In the new window screen, power with and without continuity correction will be seen as 69% and 72%, respectively.</li>"+
      "</ul>"+
	  "Reference: James Schlesselman. Case-control studies: Design, Conduct, Analysis (1982). (Data obtained from table 6.3)";

var Exercises="currently not available";
 
	  
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



function CalcPower(data) {
// significance level;

var  cscrit=0; var z=0; var pt=0;//pt=percent;

var pt=parseFloat(data[1].E0D0);
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
	
	/*
	else if (pt!=20 && pt!=25 && pt!=30&& pt!=35&& pt!=40&& pt!=45&& pt!=50&& pt!=55&& pt!=60&& pt!=65&& pt!=70&& pt!=75
	&& pt!=80 && pt!=85&& pt!=90&& pt!=95&& pt!=98&& pt!=99&& pt!=99.5&& pt!=99.8&& pt!=99.9&& pt!=99.95&& pt!=99.98&& pt!=99.99 )
		{
		alert ("The selected confidence interval is not available, choose other ranges");
		return false
		};
	*/
	
z = Math.sqrt(cscrit);


var n1 = parseFloat(data[1].E2D0);
if (n1==0) {
	alert("Number of case are missing");
	return;
	}
//alert ("size="+n1);


var n2 = parseFloat(data[1].E2D1);
if (n2==0) {
	alert("Number of control are missing");
	return;
	}

var pp1=0; var p1=0; var pp2=0; var p2=0;  
//proportion of exposure among cases;
var pp1 = parseFloat(data[1].E3D0); 
p1 = pp1/100;

//proportion of exposure among controls;
var pp2 = parseFloat(data[1].E3D1); 
p2 = pp2/100;


// ----------------------------------Power calculation --------------------------------------------;
// 	normal approximation method; n1,p1=cases and n2,p2=control;
	var q1=0; var q2=0; var d=0; var pbar=0; var qbar=0; var powerz=0; var ratio=0; var or=0;
	var ratio=n2/n1;
	var or=(p1*(1-p2))/ (p2*(1-p1));
	var q1=1-p1;
	var q2=1-p2;
	var d=p1-p2;
    var pbar=( p1+(ratio*p2))/ (1+ratio);
    var qbar=1-pbar;
	
	powerz= (  Math.sqrt(n1*d*d)-  z*Math.sqrt( (1+1/ratio)*pbar*qbar ) )/ Math.sqrt( p1*q1 + (p2*q2/ratio));   ;
	powerz = (1-(Norm(powerz)/2))*100;
	


//	power with continuity correction;
   	//to control 'n' changes with ratio (?risk or protective) && to prevent negative number of sample size when size is small than the right side of equation;
   	var nn1=0;
	if (or>1) {
		var nn1=Math.abs(n1-((ratio+1)/(ratio*d)));
   	}
   	else {
   		var nn1=Math.abs(n1+((ratio+1)/(ratio*d)));  
   	}
   	
   	powerzcc= (  Math.sqrt(nn1*d*d)-  z*Math.sqrt( (1+1/ratio)*pbar*qbar ) )/ Math.sqrt( (p1*q1) + (p2*q2/ratio) );   ;
	if (isNaN(powerzcc)){
	powerzcc=''+"'?' undefined";
	}
	else {
	powerzcc = (1-(Norm(powerzcc)/2))*100; 
	}; 

//------------------------------------------------------------;


with (outTable)
	{
	newtable(8,90);	 //6 columns and 90 pixels per column
	title("<h3>" + Title+ "</h3>");			 
	line(8); //draw the line for the length of 8 columns;
	newrow("span4:bold:c:",														"span4:bold:c:Input Data");
	newrow("color#66ffff:span4:bold:l:Two-sided confidence interval (%)",		"color#ffff99:span4:c:"+fmtSigFig(pt,6));
	newrow("color#66ffff:span4:bold:l:Number of cases",							"color#ffff99:span4:c:"+fmtSigFig(n1,6));
	newrow("color#66ffff:span4:bold:l:Percent of exposure among cases (%)",		"color#ffff99:span4:c:"+pp1),
	newrow("color#66ffff:span4:bold:l:Number of controls",						"color#ffff99:span4:c:"+fmtSigFig(n2,6));
	newrow("color#66ffff:span4:bold:l:Percent of exposure among controls (%)",	"color#ffff99:span4:c:"+pp2);
	newrow("color#66ffff:span4:bold:l:Odds Ratio",				"color#ffff99:span4:c:"+fmtSigFig(or,2));
	line(8);
	newrow("span4:bold:l:Power based on:: ");
	newrow("span4:l: Normal approximation","span4:c:" +fmtSigFig(powerz,4)+"%");
	newrow("span4:l: Normal approximation with continuity correction","span4:c:"+fmtSigFig(powerzcc,4)+"%");
	line(8);
	endtable();
	}  
} 
//end of calculate CIMean routine






