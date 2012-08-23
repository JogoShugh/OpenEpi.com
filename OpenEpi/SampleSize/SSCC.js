// JavaScript Document

//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="Sample Size--Unmatched Case Control Study";

var Authors="<b>Statistics</b><br>Kevin M. Sullivan, Emory University<br>"+
"based on code from John C. Pezzullo<br>"+
"<b>Interface</b><br>"+
"Andrew G. Dean, EpiInformatics.com, and Roger A. Mir<br> ";
    
var Description="This module calculates sample size for an unmatched "+
"case-control study.<br>You enter the desired confidence level, power, a hypothetical percentage "+
"of exposure among the controls, and either an odds ratio or a hypothetical "+
"percentage of exposure among the cases. Results are presented using methods "+
"of Kelsey, Fleiss, and Fleiss with a continuity correction.";
   
//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="Usual expectations for a case control study are 95% confidence (that a difference detected is 'real') and 80% power (to detect a difference if there is one in the underlying population). How many cases and controls, in 1:1 ratio, are needed to detect an odds ratio of 2.0 or greater?"+      
	  "<ul>"+
	    "<li>Using the default numbers, enter 2 for the odds ratio, and click Calculate.  Note that several methods produce different answers, but that 144 cases and 144 controls should be enough on a purely statistical basis.</li>"+
		"<li>Many kinds of bias in interviewing, processing, etc., enter into the reliability of the actual study.</li>"+
      "</ul>";

var Exercises="7 postoperative infections occurred in a hospital.  How many controls should be chosen for each to conduct a case-control study in which Nurse A was present at all 7 (99.9%) surgeries, but at only 50% of other surgeries? "+ 
	  "<ul>"+
	  "<li>Start with 4 controls per case, and then see if 5 controls per case would be better.  Keep in mind that you only have 7 cases.</li>"+
      "<li>Is your plan to use 7 cases and 28 controls practical, or do you need a new idea?</li>"+
      "</ul>";
    
var Pi=Math.PI; var PiD2=Pi/2; var PiD4=Pi/4; var Pi2=2*Pi;
var e=2.718281828459045235; var e10 = 1.105170918075647625;
var Deg=180/Pi;


function Norm(z) {
z=Math.abs(z);
var p=1+ z*(0.04986735+ z*(0.02114101+ z*(0.00327763+ z*(0.0000380036+ z*(0.0000488906+ z*0.000005383)))));
p=p*p; p=p*p; p=p*p;
return 1/(p*p);
}

function ANorm(p) { var v=0.5; var dv=0.5; var z=0;
while(dv>1e-6) { z=1/v-1; dv=dv/2; if(Norm(z)>p) { v=v-dv } else { v=v+dv } };
return z;
}

function Calc(data) {
var a;
var b;
var Zb;
var v1;
var v2;
var vr;
var vor;

a=parseFloat(data[1]["E0D0"]);
a = ((100-a)/100);
b=parseFloat(data[1]["E1D0"]);
vr=parseFloat(data[1]["E2D0"]);
v2=parseFloat(data[1]["E3D0"]/100);
vor=parseFloat(data[1]["E5D0"]);
v1=parseFloat(data[1]["E6D0"]/100);

var Za=ANorm(a);		
if(b>=1) { b=b/100 };
if(b<0.5) { Zb=-ANorm(2*b) } else { Zb=ANorm(2-2*b) };
if (vor != 0)
{
 v1 = v2 * vor / (1 + v2 * (vor - 1));
}
var pbar=(v1+vr*v2)/(1+vr);

var qbar=1-pbar;
var vn = ((Math.pow((Za + Zb),2)) * pbar * qbar * (vr + 1)) / ((Math.pow((v1 - v2),2)) * vr);
var vn1 = Math.pow(((Za*Math.sqrt((vr+1)*pbar*qbar)) + (Zb*Math.sqrt((vr*v1*(1-v1))+(v2*(1-v2))))),2) / (vr*Math.pow((v2-v1),2));
vn2=Math.pow(Za * Math.sqrt((vr+1)*pbar*qbar) + Zb * Math.sqrt(vr*v1*(1-v1)+v2*(1-v2)),2) /(vr*Math.pow(Math.abs(v1-v2),2));
vn2 = vn2 * Math.pow((1+Math.sqrt(1+2*(vr+1)/(vn2*vr*Math.abs(v2-v1)))),2)/4;

with (outTable)
	{
       //Define a table.  You can included extra columns to help with the formatting
	   //and then use the span property to combine several cells and make a wider one.
	   
	 newtable(6,90);
	 title("<h3>" + "Sample Size for Unmatched Case-Control Study" + "</h3>");
	 
	 //Title goes across all cells.  Text can have HTML tags that make it
	 //bold or give it particular styles.  These are optional.  Be sure to
	 //include a closing tag for each one.
	 line(6);
	 //6 columns and 100 pixels per column
	 newrow("For::")
	 newrow("","span3:Two-sided confidence level(1-alpha)",parseFloat(data[1]["E0D0"]));
	 newrow("","span3:Power(% chance of detecting)",parseFloat(data[1]["E1D0"]));
	 newrow("","span3:Ratio of Controls to Cases",parseFloat(data[1]["E2D0"]));			 
	 newrow("","span3:Hypothetical proportion of controls with exposure",parseFloat(data[1]["E3D0"]));	
	 newrow("","span3:Hypothetical proportion of cases with exposure::", parseFloat(data[1]["E6D0"]), "");
	 newrow("","span3:Least extreme Odds Ratio to be detected::", vor.toFixed(2));
	 line(6);
	 newrow();
	 //blank line
    //alert("ceil(vr*vn2)="+Math.ceil(vr*vn2));
	//alert("ceil((vr*vn2))="+Math.ceil((vr*vn2)));
	 newrow("span2:","bold:c:Kelsey", "bold:c:Fleiss", "bold:c:Fleiss with CC");
	 line(6);
	 newrow("span2:Sample Size - Cases", Math.ceil(vn), Math.ceil(vn1), Math.ceil(vn2));
	 newrow("span2:Sample Size - Controls", Math.ceil((vn * vr)), Math.ceil((vn1 * vr)), Math.ceil((vr*vn2)));
     line(6);
	 newrow("span2:Total sample size::", Math.ceil(vn) + Math.ceil((vn * vr)), Math.ceil(vn1) + Math.ceil((vn1 * vr)), Math.ceil((vr*vn2)) + Math.ceil(vn2));
     line(6);
	
	 newrow();	
	 newrow("span6:c:color#c0c0c0:References")
     newrow("span6:Kelsey et al., Methods in Observational Epidemiology 2nd Edition, Table 12-15")
	 newrow("span6:Fleiss, Statistical Methods for Rates and Proportions, formulas 3.18 &amp;3.19")
     newrow()
	 newrow("span6:CC = continuity correction")
	 newrow("span6:Results are rounded up to the nearest integer.")
	 newrow("span6:Print from the browser menu or select, copy, and paste to other programs.")
	}  
}

