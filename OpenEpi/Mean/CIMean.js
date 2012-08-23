// JavaScript Document
//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="Confidence Intervals for a Sample Mean";

var Authors="<b>Statistics</b><br>Minn M. Soe and Kevin M. Sullivan, Emory University<br>"+
"<br>"+
"<b>Interface</b><br>"+
"Andrew G. Dean, EpiInformatics.com, "+
"<br>and Roger A. Mir<br> ";
      
var Description=
"This module calculates confidence intervals for a sample mean. Entering mean, "+
"standard deviation, and sample size will calculate a confidence interval. The "+
"user can change the desired confidence interval by typing in new value. A  "+
"finite population size can also be entered if the population under study is "+
"not large, otherwise, population size is set as 999,999,999.";


	
//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="In a simple random sample of 268 adults from a local county, blood cholesterol level was measured as a baseline to evaluate a behavioral change intervention program on obesity. Let's assume the mean of blood cholesterol level obtained from that sample was found to be 150 mg% with standard deviation of 27.36 mg%. Given the population size in the county was 100,000, what is the estimated 95% confidence limits of mean cholesterol level in that population?."+      
	  "<ul>"+
	    "<li>To answer this question, enter the given values in respective cells in Open Epi Mean program, and click on Calculate</li>"+
		"<li>In the new window screen, 95% confidence limits of Mean cholesterol are 146.73 - 153.27 mg%. This result is based on large sample size theory as our sample size is large. If a sample size is small (eg. <30), the confidence limits based on t-test should be taken.</li>"+
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

// If integers >21 digits, beware of exponential sign at the end;
*/
//var mean=0; var SD=0; var variance=0; var SE=0;

function CalcCIMean(data) 
{
var mean = parseFloat(data[1].E0D0);

//alert ("mean="+mean);


if (mean.length > 21) 
    {
      	alert ("Confidence limits may be in scientific notation");
    }

var SD=0; var variance=0; var SE=0;
var SD = parseFloat(data[1].E1D0);
var SE = parseFloat(data[1].E1D2);
var variance = parseFloat(data[1].E1D4);
//alert (SD+"   "+variance+"   "+SE+"   ");
if (SD!=0 && SE!=0 ||  SE!=0 && variance!=0 ||  SD!=0 &&  variance!=0)  {
	alert ("Select only one! - Standard deviation or Standard error or Variance??");
	return false;
}
if (SD==0 && SE==0 && variance==0) {
	alert ("The value of dispersion must be greater than 0!");
	return false;
}

var n = parseFloat(data[1].E2D0);
if (n <= 0 || n.length > 9) {
	alert("Sample size must be between 1 and 999999999");
	return false;
	}

// calculation for output table;
if (SD!=0) {
	var SE=SD/Math.sqrt(n);
	var variance=SD*SD;
	}
if (SE!=0) {
	var SD=SE*Math.sqrt(n);
	var variance=SD*SD;
	}
if (variance!=0) {
	var SD=Math.sqrt(variance);
	var SE=SD/Math.sqrt(n);
	}


var popsize = parseFloat(data[1].E3D0);
if (popsize.length < 1 || popsize.length > 9 || popsize < n) {
	alert("Population size must be between 1 and 999,999,999  &  must be >= sample size");
	return false;
	}


var  cscrit=0; var pt=0;
var pt=parseFloat(data[1].E4D0);

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
	
	else if (pt!=20 && pt!=25 && pt!=30&& pt!=35&& pt!=40&& pt!=45&& pt!=50&& pt!=55&& pt!=60&& pt!=65&& pt!=70&& pt!=75
	&& pt!=80 && pt!=85&& pt!=90&& pt!=95&& pt!=98&& pt!=99&& pt!=99.5&& pt!=99.8&& pt!=99.9&& pt!=99.95&& pt!=99.98&& pt!=99.99 )
		{
		alert ("The selected confidence interval is not available, choose other ranges");
		return false
		};
z = Math.sqrt(cscrit);


//for z distribution;
var ll= mean - z *  (SD/Math.sqrt(n)) * Math.sqrt((popsize-n)/(popsize-1));
var ul= mean + z * (SD/Math.sqrt(n)) * Math.sqrt((popsize-n)/(popsize-1)) ;


// for t distribution;
var p=(100-pt)/100;
var t=AStudT(p,n-1);
var llt= mean - t *  (SD/Math.sqrt(n)) * Math.sqrt((popsize-n)/(popsize-1));
var ult= mean + t *  (SD/Math.sqrt(n)) * Math.sqrt((popsize-n)/(popsize-1)) ;

//------------------------------------------------------------;

with (outTable)
	{
	newtable(8,90);	 //6 columns and 90 pixels per column
	title("<h3>" + Title+ "</h3>");			 
	line(8); //draw the line for the length of 8 columns;
	newrow("span3:bold:c:",	"span5:bold:c:Input Data");
	newrow("color#66ffff:span3:bold:c:Sample Mean",			"color#ffff99:span5:l:"+fmtSigFig(mean,6));
	newrow("color#66ffff:span3:bold:c:Sample Std. Deviation",	"color#ffff99:span1:l:"+fmtSigFig(SD,6),
		   "color#ffff99:span1:bold:l:Std. Error",			"color#ffff99:span1:l:"+fmtSigFig(SE,6),
		   "color#ffff99:span1:bold:l:Variance",			"color#ffff99:span1:l:"+fmtSigFig(variance,6));
	newrow("color#66ffff:span3:bold:c:Sample size",			"color#ffff99:span5:l:"+fmtSigFig(n,6));
	newrow("color#66ffff:span3:bold:c:Population size",		"color#ffff99:span5:l:"+fmtSigFig(popsize,9));
	newrow("color#66ffff:span3:bold:c:Confidence Interval",	"color#ffff99:span1:l:"+fmtSigFig(pt,6),  "color#ffff99:span4:bold:l:% (100)");
	line(8);
	endtable();  // Optional: to mark the end of current table;
	
	//tableAsHTML();   //Reproduce the input table in the output
	
	
	newtable(8,90);
	title("<h4>  "+ pt+"% Confidence Limits for the Mean of "+ parseFloat(data[1]["E0D0"])+"</h4>");
	newrow("span4:bold:c:Based on:: ","span2:bold:c:Lower Limit","span2:c:bold:Upper Limit");
	newrow("span4:c: z-test","span2:c:"+fmtSigFig(ll,6), "span2:c:"+fmtSigFig(ul,6));
	newrow("span4:c: t-test","span2:c:"+fmtSigFig(llt,6), "span2:c:"+fmtSigFig(ult,6));
	line(8);
	endtable();
	}  
} 
//end of calculate CIMean routine






function StudT(t,n) {
    t=Math.abs(t); var w=t/Math.sqrt(n); var th=Math.atan(w)
    if(n==1) { return 1-th/PiD2 }
    var sth=Math.sin(th); var cth=Math.cos(th)
    if((n%2)==1)
        { return 1-(th+sth*cth*StatCom(cth*cth,2,n-3,-1))/PiD2 }
        else
        { return 1-sth*StatCom(cth*cth,1,n-3,-1) }
    }
function StatCom(q,i,j,b) {
    var zz=1; var z=zz; var k=i; while(k<=j) { zz=zz*q*k/(k-b); z=z+zz; k=k+2 }
    return z
    }
function AStudT(p,n) { var v=0.5; var dv=0.5; var t=0
    while(dv>1e-6) { t=1/v-1; dv=dv/2; if(StudT(t,n)>p) { v=v-dv } else { v=v+dv } }
    return t;
    }
/*
// For rounding upto 6 decimal places;
function round(x){
var x = Math.round(x * 1000000) /1000000;
if (x < 1e-6) x = "<0.000001";
return x;
}


function Calc(data) 
{

	function ssx(conflevel)
	{
	var sampsize
	var Za2;
	var N_totpop=parseFloat(data[1]["E0D0"]);
	var proportionx = parseFloat(data[1]["E1D0"])/100;
	//var clx=conflevel;
	var d_precisionx = parseFloat(data[1]["E2D0"])/100;
	var deffx = parseFloat(data[1]["E3D0"]);
	var Za1=(100-conflevel)/100;
	Za2=ANorm(Za1);
	 sampsize= (deffx*N_totpop*proportionx*(1-proportionx))/(((d_precisionx * d_precisionx)
	/(Za2 * Za2))*(N_totpop - 1) + (proportionx * (1 - proportionx)));
	return Math.ceil(sampsize)
	}
*/


