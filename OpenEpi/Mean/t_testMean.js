// JavaScript Document
//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="Two-Sample Independent <i>t</i> Test";

var Authors="<b>Statistics</b><br>Minn M. Soe and Kevin M. Sullivan, Emory University<br>"+
"<br>"+
"<b>Interface</b><br>"+
"Andrew G. Dean, EpiInformatics.com, "+
"<br>and Roger A. Mir<br> ";
      
var Description=
"This module compares the means of two independent samples. Entering desired confidence interval, sample size, mean and standard deviation (or standard error) of each sample group will test for significant difference between two sample means. The mean difference with confidence interval would also be displayed.";

//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="Suppose a study was conducted to observe whether there is a significant difference between the mean duration of hospitalization in users of a particular antibiotic compared to non-users. Among the 7 antibiotic users in the study, the mean duration of hospitalization was 11.57 days with standard deviation of 8.81 days, and among 18 non-users, the mean duration of hospitalization was 7.44 days with standard deviation of 3.7 days. Assuming the samples are normally distributed, is there any difference in the mean duration of hospitalization between these two groups?"+
	  "<ul>"+
	    "<li>To answer this question, enter the given values in respective cells in Open Epi Two Sample Independent <i>t</i> test, and click on Calculate</li>"+
		"<li>In the new window screen, the p-value would be 0.24 assuming unequal variance as indicated by Hartley's <i>f</i> test. </li>"+
      "</ul>"+
	  "Conclusion: There is no significant difference between the mean duration of hospitalization in these two groups."+
	  "<p>Reference: Bernard Rosner. Fundamentals of Biostatistics(5th edition). (Data obtained from example 8.18: pg 297-8).";


var Exercises="currently not available";
 
//----------------------------------------------------------------------------------------------------;
	  
var Pi=Math.PI; var PiD2=Pi/2; var PiD4=Pi/4; var Pi2=2*Pi;
var e=2.718281828459045235; var e10 = 1.105170918075647625;
var Deg=180/Pi;

//function keys;
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

function FishF(f,n1,n2) {
    var x=n2/(n1*f+n2)
    if((n1%2)==0) { return StatCom(1-x,n2,n1+n2-4,n2-2)*Math.pow(x,n2/2) }
    if((n2%2)==0){ return 1-StatCom(x,n1,n1+n2-4,n1-2)*Math.pow(1-x,n1/2) }
    var th=Math.atan(Math.sqrt(n1*f/n2)); var a=th/PiD2; var sth=Math.sin(th); var cth=Math.cos(th)
    if(n2>1) { a=a+sth*cth*StatCom(cth*cth,2,n2-3,-1)/PiD2 }
    if(n1==1) { return 1-a }
    var c=4*StatCom(sth*sth,n2+1,n1+n2-4,n2-2)*sth*Math.pow(cth,n2)/Pi
    if(n2==1) { return 1-a+c/2 }
    var k=2; while(k<=(n2-1)/2) {c=c*k/(k-.5); k=k+1 }
    return 1-a+c
    }
function AFishF(p,n1,n2) { var v=0.5; var dv=0.5; var f=0
    while(dv>1e-10) { f=1/v-1; dv=dv/2; if(FishF(f,n1,n2)>p) { v=v-dv } else { v=v+dv } }
    return f
    }

//------------------------------------------------------------------------------;


function CalcTtest(data) 
{
var m1=0; var m2=0; var s1=0; var se1=0; var n1=0; var v1=0; var s2=0; var se2=0; var v2=0; var n2=0; 

//sample size;
var n1 = parseFloat(data[1].E2D0);
if (n1==0) alert("missing value in sample size of group-1");

var n2 = parseFloat(data[1].E3D0);
if (n2==0) alert("missing value in sample size of group-2");

//sample means;
var mean1 = parseFloat(data[1].E2D1);
if (mean1==0) alert("missing value in group-1 mean");
//alert("mean1-"+m1);
var mean2 = parseFloat(data[1].E3D1);
if (mean2==0) alert("missing value in group-2 mean");
//alert ("mean2-"+m2);

//converting values between std deviation and variance;
var s1 = parseFloat(data[1].E2D2);
var se1 = parseFloat(data[1].E2D4);
var s2 = parseFloat(data[1].E3D2);
var se2 = parseFloat(data[1].E3D4);
//alert("s1-"+s1);alert("v1-"+v1);alert("s2-"+s2);alert("v2-"+v2);

if (s1!=0) 	{v1=s1*s1; se1=""};
if (se1!=0) {
	s1=se1*Math.sqrt(n1);
	v1=s1*s1;
	s1="";
	};

if (s2!=0) 	{v2=s2*s2; se2=""};
if (se2!=0)  {
	s2=se2*Math.sqrt(n2);
	v2=s2*s2;
	s2="";
	};
	
//alert("s1-"+s1);alert("v1-"+v1);alert("s2-"+s2);alert("v2-"+v2);

// --------------------------------------significance level----------------------------------------------;
var pp=0; var pt=0;  //pt=percent;
var pt=parseFloat(data[1].E0D2);
//alert("percent"+pt);
var pp=(100-pt)/100;
var t=AStudT(pp,n1+n2-2);


// ------------------------------------t-test calculation steps------------------------------------------;
// CHECKING FOR EQUALITY OF VARIANCE by Hartley's f test;
// f statistics and related p value;
// note that std deviation(variance)of numerator must be larger. Otherwise, F will not be significant, if any;
var mini=0; var numerator=0; var denominator=0;
var mini=Math.min(v1,v2);
if (mini==v2) {
	var f=v1/v2;
	var pf= (FishF(f,n1-1,n2-1) )*2; //2*F distribution;
	numerator=n1-1;
	denominator=n2-1;
	}
else if (mini==v1) {
	var f=v2/v1;
	var pf= (FishF(f,n2-1,n1-1) )*2; //2*F distribution;
	numerator=n2-1;
	denominator=n1-1;
	}

// -----------------ASSUMING EQUAL VARIANCE;
// calculating pooled variance s2--->pooled std error s ;
var s=0; var d=0; var tstat=0; var p=0; var df=0; var meandif=0; var ll=0; var ul=0;
var s=Math.sqrt (  ((n1-1)*v1+(n2-1)*v2)/(n1+n2-2) );
var d=(s * Math.sqrt((1/n1)+(1/n2)) );
//var tstat=Math.abs( (mean1-mean2)/d );
//abs above removed to reflect sign of difference
var tstat=(mean1-mean2)/d
var p=StudT(tstat,n1+n2-2);
var df=n1+n2-2;

// calculating confidence limits of mean difference;
var meandif = (mean1-mean2);
//if (meandif<0) {meandif= (mean2-mean1)};    // Removed April 2009 to provide
                             //predictable results for a series of comparisons
var ll=meandif -(t * d); //'t' depends on confidence level chosen;
//alert("ll"+ll);
var ul=meandif +(t * d);
//alert("ul"+ul);

// -----------------ASSUMING UNEQUAL VARIANCE
// calculating t statistics and degree of freedom for unequal variance;
var t1=0; var df1=0; var p1=0; var meandif1=0; var t=0; var s=0; var lll=0; var ull=0;
var t1=meandif/ Math.sqrt ( (v1/n1)+(v2/n2) );
//var df1=Math.round ( Math.pow( (v1/n1)+(v2/n2),2 ) / ( (Math.pow( (v1/n1),2 )/(n1-1))+(Math.pow( (v2/n2),2 )/(n2-1))) );
var df1=Math.round(Math.pow( (v1/n1)+(v2/n2),2 ) / ( (Math.pow( (v1/n1),2 )/(n1-1))+(Math.pow( (v2/n2),2 )/(n2-1))) );
var p1=StudT(t1,df1);


// calculating confidence limits of mean difference;
var meandif1=meandif;
//alert("meandif1-"+meandif1);
var t=AStudT(pp,df1);
//alert("t"+t);

var s=Math.sqrt( (v1/n1)+(v2/n2) );
//alert("s"+s);

var lll= (meandif1) -(t*s);
var ull= (meandif1) + (t*s);
//alert("lll"+lll);
//alert("ull"+ull);
//----------------------------------------------------------------------------------------------------------;

// Output table;

with (outTable)
	{
	newtable(8,90);	 //6 columns and 90 pixels per column
	title("<h3>" + Title+ "</h3>");			 
	line(8); //draw the line for the length of 8 columns;
	newrow("span8:bold:c:Input Data");
	newrow("span8:l: &nbsp;  ");
	
	newrow("color#66ffff:span3:l:Two-sided confidence interval", "color#66ffff:span1:r:"+pt+"%","color#66ffff:span4:l:");
	newrow("color#66ffff:span8:l: &nbsp;  ");
	newrow("color#ffff99:span2:l:", 			"color#ffff99:span1:bold:l: Sample size",  "color#ffff99:span1:bold:c: Mean",  "color#ffff99:span1:bold:c:Std. Dev.", 	"color#ffff99:span1:bold:c: Std. Error",  "color#ffff99:span2:bold:l:"); //to insert a new row;
	//newrow("color#ffff99:span8:l: &nbsp;  ");
	newrow("color#ffff99::span2:l:Group-1", 	"color#ffff99:span1:c:"+n1,	"color#ffff99:span1:c:"+mean1, 	"color#ffff99:span1:c:"+s1, 	"color#ffff99:span1:c:"+se1,  "color#ffff99:span2:bold:l:" );
	newrow("color#ffff99::span2:l:Group-2", 	"color#ffff99:span1:c:"+n2,	"color#ffff99:span1:c:"+mean2, 	"color#ffff99:span1:c:"+s2, 	"color#ffff99:span1:c:"+se2,  "color#ffff99:span2:bold:l:" );
	newrow("color#ffff99:span8:l: &nbsp;  ");
	
	//newrow("color#ffff99::span2:l:Sample size", "color#ffff99:span1:c:"+fmtSigFig(n1,6),	"color#ffff99:span1:c:", "color#ffff99:span1:c:"+fmtSigFig(n2,6), 	"color#ffff99:span3:c:" );
	//newrow("color#ffff99::span2:l:Standard deviation", "color#ffff99:span1:c:"+fmtSigFig(s1,6),"color#ffff99:span1:c:", "color#ffff99:span1:c:"+fmtSigFig(s2,6), 	"color#ffff99:span3:c:" );
	//newrow("color#ffff99::span2:l:Variance",	 "color#ffff99:span1:c:"+fmtSigFig(v1,6),	"color#ffff99:span1:c:", "color#ffff99:span1:c:"+fmtSigFig(v2,6), 		"color#ffff99:span3:c:" );
	line(8);
	newrow("span8:l: &nbsp;  ");
	newrow("span2:l:bold:<u>Result:</u>", "span1:bold:c:<i>t</i>  statistics",  "span1:bold:c:<i>df</i>",  "span1:c:bold:p-value<tt><sup>1</sup>", "span1:bold:c:Mean Difference", "span1:bold:c:Lower Limit","span1:bold:c:Upper Limit"); 
	
	newrow("span2:l:bold:Equal variance:", "span1:c:"+fmtSigFig(tstat,6), "span1:c:"+df,   "span1:c:"+fmtPValue(p),   "span1:c:"+fmtSigFig(meandif,6),    "span1:c:"+fmtSigFig(ll,6),    "span1:c:"+fmtSigFig(ul,6));
	
	newrow("span2:l:bold:Unequal variance:", "span1:c:"+fmtSigFig(t1,6),  "span1:c:"+df1,  "span1:c:"+fmtPValue(p1),  "span1:c:"+fmtSigFig(meandif1,6),  "span1:c:"+fmtSigFig(lll,6),    "span1:c:"+fmtSigFig(ull,6)); 
		
	line(8);
	newrow("span8:l: &nbsp; ");
	newrow("span3:l:bold:", "span1:bold:l:<i>F</i> statistics", "span2:c:bold:c:<i>df</i>(numerator,denominator)","span2:c:bold:p-value<tt><sup>1</sup>"); 
	newrow("span3:l:bold:Test for equality of variance<tt><sup>2</sup>", "span1:l:"+fmtSigFig(f,6),  "span2:c:"+numerator+","+denominator,  "span2:c:"+fmtPValue(pf)); //last one was fmtSigFig(pf,6)) fixed April 2009;
		
	newrow("span8:l: &nbsp;  ");
	line(8);
	newrow("span8:l: <tt><sup>1</sup></tt> <small> p-value (two-tailed)");
	newrow("span8:l: <tt><sup>2</sup></tt> <small> Hartley's <i>f</i> test for equality of variance");
	
	endtable();
	}  
}
//end of calculate CIMean routine






