// JavaScript Document
//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="Sample Size for Cross-Sectional, Cohort, &amp; Randomized Clinical Trial Studies";

var Authors="<b>Statistics</b><br>Kevin M. Sullivan, Emory University<br>"+
"based on code from John C. Pezzullo<br>"+
"<b>Interface</b><br>"+
"Andrew G. Dean, EpiInformatics.com, and Roger A. Mir<br> ";
    
var Description="This module calculates sample size for unmatched "+
"cross-sectional and cohort studies, including clinical trials. "+
"<p>You enter the desired confidence level, power, ratio of exposed to "+
"unexposed samples, and a hypothetical percentage of outcome among the "+
"controls. Then enter one of four parameters to be detected, and the others "+
"will be calculated. </p> "+
"<p> Results are presented using methods of Kelsey, Fleiss, and Fleiss with a continuity "+
"correction.</p> ";
    
//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="At a company picnic, about 25% of people 'exposed' to potato salad and only a handful(5%) of others became ill with gastroenteritis.  We wish to take a random or systematic sample of all attendees to ascertain the real attack rates."+      
	  "<ul>"+
	    "<li>Using the default numbers provided, enter 25 for Percent of Exposed with Outcome and click Calculate.  It appears that we need 98 to 118 interviews depending on statistical method. </li>"+
		"<li>Note that we have assumed equal numbers of exposed and unexposed (only 50% ate potato salad).  Experiment with other ratios of unexposed to exposed (0.33=75% ate potato salad), and also other attack rates in the unexposed. </li>"+
        "<li>Note that sample size calculations are based on guesses, and will be replaced by real results when the data become available.  A few memory lapses or sympathetic vomiting episodes on the part of the unexposed can change the sample size estimations dramatically.</li>"+
      "</ul>";

var Exercises="A phase I clinical trial is to be conducted to determine the frequency of adverse effects from a new medication.  Two groups of equal size will be randomly allocated to receive the drug or a placebo.  The effect being measured is expected to occur in 2% of the placebo group."+ 
	  "<ul>"+
	  "<li>How large must the groups be to detect a risk/prevalence ratio of 2.0 for an adverse effect with 95% confidence and 80% power? </li>"+
      "<li>Answer: 1144 to 1242 in each group, depending on method.</li>"+
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

a=parseFloat(data[1]["E0D0"]); //Confidence level
a = ((100-a)/100);
b=parseFloat(data[1]["E1D0"]); //Power
vr=parseFloat(data[1]["E2D0"]);
v2=parseFloat(data[1]["E3D0"]/100);
vor=parseFloat(data[1]["E5D0"]);
v1=parseFloat(data[1]["E6D0"]/100);
rr=parseFloat(data[1]["E7D0"]);
dd=parseFloat(data[1]["E8D0"]/100);

var Za=ANorm(a);
if(b>=1) { b=b/100 }; 

if(b<0.5) { Zb=-ANorm(2*b) } else { Zb=ANorm(2-(2*b)) };
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
	 //6 columns and 100 pixels per column
	 title("<h3>" + Title + "</h3>");
	 line(6);
	 newrow("span4:Two-sided significance level(1-alpha)::",parseFloat(data[1]["E0D0"]));
	 newrow("span4:Power(1-beta, % chance of detecting)::",parseFloat(data[1]["E1D0"]));
	 newrow("span4:Ratio of sample size, Unexposed/Exposed::",parseFloat(data[1]["E2D0"]));			 
	 newrow("span4:Percent of Unexposed with Outcome::",fmtSigFig(v2,2,100));	
	 newrow("span4:Percent of Exposed with Outcome::", fmtSigFig(v1,2,100), "");
	 newrow("span4:Odds Ratio::", fmtSigFig(vor,2), "");
	 newrow("span4:Risk/Prevalence Ratio::", fmtSigFig(rr,2), "");		
	 newrow("span4:Risk/Prevalence difference::", fmtSigFig(dd,2,100), "");		
	 
	 line(6);
			 
	 newrow("span2:","bold:c:Kelsey", "bold:c:Fleiss", "bold:c:Fleiss with CC");
	 line(6);
	 newrow("span2:Sample Size - Exposed", Math.ceil(vn), Math.ceil(vn1), Math.ceil(vn2));
	 newrow("span2:Sample Size-Nonexposed", Math.ceil((vn * vr)), Math.ceil((vn1 * vr)), Math.ceil((vr*vn2)));
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

