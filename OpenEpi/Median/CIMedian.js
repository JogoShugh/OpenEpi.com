// JavaScript Document
//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="Confidence Interval of median or other percentile for a sample size";

var Authors="<b>Statistics</b><br>Minn M. Soe and Kevin M. Sullivan, Emory University<br>"+
"<br>"+
"<b>Interface</b><br>"+
"Andrew G. Dean, EpiInformatics.com, "+
"<br>and Roger A. Mir<br> ";
      
var Description=
"This module calculates confidence interval around a selected percentile for "+
"a sample size given. Entering sample size and desired percentile will calculate " +
"95% confidence interval as a default confidence limit. The user can change the " +
"confidence interval by typing in new value. Please note that the selected percentile "+
"should be within 1-100%";


	
//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="For non-Normal distribution, the median of the sample or population is preferable to the mean as a measure of location (Rank). Medians are also appropriate in other situations-for example, when measurements are on an ordinal scale. In a dataset of 100 diabetic patients, let's assume the median systolic blood pressure is 146 mmHg. Using this module, let's calculate 95% confidence interval of median value in the sample."+
		"<ul>"+
	    "<li>First, enter the sample size (eg. 100), median value (eg. 50), and 95% confidence interval (eg. 95) in respective cells in Open Epi Median program, and click on Calculate. </li>"+
		"<li>In the new window screen, 95% confidence limits of Median position in the sample are seen as 40 - 61. This result is calculated from the normal approximation method of large sample size theory. </li>"+
		"<li>Then, after arranging observations (here, the systolic blood pressure) in increasing order, read the corresponding values of systolic blood pressure at 40th and 61th position. They are 95% confidence interval of median systolic blood pressure of the sample. </li>"+
		"</ul>";

 var Exercises="currently not available";
 /*  "Random samples are expensive.  A survey company designs a cluster sample based on first selecting random census blocks and then choosing samples within those selected.  They state that the expected 'Design Effect' (sample size multiplier) is 1.8, based on previous surveys."+ 
	  "<ul>"+
	    "<li>Use the default numbers but change the design effect to 1.8 to see the sample size for the cluster survey.</li>"+
        "<li>Note that the sample size for a random sample is simply multiplied by the Design Effect.</li>"+
      "</ul>";   

/*	  
var Pi=Math.PI; var PiD2=Pi/2; var PiD4=Pi/4; var Pi2=2*Pi;
var e=2.718281828459045235; var e10 = 1.105170918075647625;
var Deg=180/Pi;


function Norm(z) 
{
z=Math.abs(z);
var p=1+ z*(0.04986735+ z*(0.02114101+ z*(0.00327763+ z*(0.0000380036+ z*(0.0000488906+ z*0.000005383)))));
p=p*p; p=p*p; p=p*p;
return 1/(p*p);
}

function ANorm(p) 
{ var v=0.5; var dv=0.5; var z=0;
while(dv>1e-6) { z=1/v-1; dv=dv/2; if(Norm(z)>p) { v=v-dv } else { v=v+dv } };
return z;
}

var Pi=Math.PI; var PiD2=Pi/2; var PiD4=Pi/4; var Pi2=2*Pi; 
var e=2.718281828459045235; var e10 = 1.105170918075647625
var Deg=180/Pi

// If integral values >'9'*21 times, beware of exponential sign at the end;
*/
function CalcCIMedian(data) 
{
var n = parseFloat(data[1].E0D0);
if (n <= 0) {
	alert("Sample size must be >0");
	return false;
	}
	
	
var median = parseFloat(data[1].E1D0) ;
if (median<=0 || median >100) 
    {
      	alert ("Percentile value must be within the limits of 1-100%");
		return false;
    }


var  cscrit=0; var pt=0; var z=0;
//alert("fed to cscrit ...."+String(data[1].E4D0));
//var cscrit = cscritFromOEConfLevel(String(data[1].E4D0S));
//alert("cscrit="+cscrit);
//alert("setting for conflevel="+data[0].conflevel);
//cscrit=cscritFromOEConfLevel(data[0].conflevel);
var pt=data[1].E2D0;

	if (pt==99.99)  cscrit=15.137
    if (pt==99.98)  cscrit=13.831
    if (pt==99.95)  cscrit=12.116 
    if (pt==99.9)   cscrit=10.828
    if (pt==99.8)   cscrit=9.550 
    if (pt==99.5)   cscrit=7.879
    if (pt==99)  cscrit=6.635
    if (pt==98)  cscrit=5.412
    if (pt==95)  cscrit=3.841
    if (pt==90)  cscrit=2.706 
    if (pt==85)  cscrit=2.072
    if (pt==80)  cscrit=1.642
    if (pt==75)  cscrit=1.323
    if (pt==70)  cscrit=1.074
    if (pt==65)  cscrit=0.873
    if (pt==60)  cscrit=0.708 
    if (pt==55)  cscrit=0.571
    if (pt==50)  cscrit=0.455
    if (pt==45)  cscrit=0.357
    if (pt==40)  cscrit=0.275
    if (pt==35)  cscrit=0.206
    if (pt==30)  cscrit=0.148
    if (pt==25)  cscrit=0.102
    if (pt==20)  cscrit=0.064;
	
	else if (pt!=20 && pt!=25 && pt!=30&& pt!=35&& pt!=40&& pt!=45&& pt!=50&& pt!=55&& pt!=60&& pt!=65&& pt!=70&& pt!=75
	&& pt!=80 && pt!=85&& pt!=90&& pt!=95&& pt!=98&& pt!=99&& pt!=99.5&& pt!=99.8&& pt!=99.9&& pt!=99.95&& pt!=99.98&& pt!=99.99 )
		{
		alert ("The selected confidence interval is not available, choose other ranges");
		return false
		};
z = Math.sqrt(cscrit);

//rank calculation;
var np=0; var p=0;
var p = median/100;
if (p == 0.5) var np=(n+1)/2; else var np = Math.round (n*p);

//confidence limits and checking errors;
var ll= Math.round ( n*p - z*(Math.sqrt(n*p*(1-p))) );		if (ll<=0) var ll=0;
var ul= Math.round ( 1 + n*p + z*(Math.sqrt(n*p*(1-p))) );	if (ul<=0) var ul=0;
if (ul>=n) var ul=n;

//-------------------------------------------------------------------------------------------------;

with (outTable)
	{
	newtable(6,90);	 //6 columns and 90 pixels per column
	title("<h3>" + Title + "</h3>");			 
	newrow("","","span2:c:bold:Input Data");
	newrow();
	newrow("","color#66ffff:span2:r:Sample Size:", "color#ffff99:span1:r:"+n);
	newrow("","color#66ffff:span2:r:Desired percentile:","color#ffff99:span1:r:"+median);
	newrow("","color#66ffff:span2:r:Confidence Interval (%):", "color#ffff99:span1:r:"+pt);
	newrow();
	line(6); 	//line with 6 columns size
	
	//tableAsHTML(0);   //Reproduce the input table in the output *************************************;
	
	
	newtable(6,90);
	title("<h4>Confidence Interval for " + data[1]["E1D0"] + "<SUP>th</SUP>"  +" percentile of " + "sample size " + data[1]["E0D0"] + "</h4>");
	newrow("span2:bold:c:Method:","span1:bold:c:Lower Limit","span1:bold:r:  Rank","span2:c:bold:Upper Limit");
	newrow("span2:c:Normal Approximation","span1:c:"+fmtSigFig(ll,6), "span1:r:"+fmtSigFig(np,6),"span2:c:"+fmtSigFig(ul,6)); //6 means 6 digits including decimals;
	
	line(6);
	endtable();
	}  
} 
//end of calc routine



