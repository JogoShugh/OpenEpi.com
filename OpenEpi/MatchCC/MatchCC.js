// JavaScript Document
<!-- //hide this script tag's contents from old browsers
//This program is based on one developed by John C. Pezzullo, johnp71@aol.com, Interactive Statistics page
//Modifications were by Kevin Sullivan, cdckms@sph.emory.edu
//changes include the addition of corrected and MH chi square tests, improved calculation of the chi square
//p-values, improved confidence interval methods, and placing the outcome as rows and exposure as columns
//

//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="Matched Pair Case-Control Study";

var Authors="<b>Statistics</b><br>Kevin M. Sullivan, Emory University<br>"+
"based on code from John C. Pezzullo<br>"+
"<b>Interface</b><br>"+
"Andrew G. Dean, EpiInformatics.com, "+
"and Roger Mir<br> ";

var Description="<p>Pairs of Cases and Controls matched 1:1 on defined characteristics are evaluated "+
"for exposure to a risk factor and distributed into the four cells of "+
"the table representing the four possible combinations of outcome in a pair. "+
"The counts represent PAIRS containing 1 case and 1 control rather than "+
"individual cases. "+
"</p> "+
"<p>Results include Fisher Exact and midP Exact tests and confidence limits for the "+
"odds ratio, and the McNemar test and the Pair-Matched Odds Ratio to "+
"evaluate whether an association exists between case status and the presence or absence "+
"of the risk factor.</p></td> ";    
 
 //The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo=      
	  "<ul>"+
	    "<li>The default numbers presented are from a comparison of detection of hypertension by an automatic device versus detection by a trained technician. The automatic device results are 'Cases' and the technician\'s results are the 'Controls'.  </li>"+
		"<li>Click Calculate to discover (with the mid-P exact) that the difference may be marginally significant with this unrealistically small sample.  More results are needed.</li>"+
      "</ul>"+
      "Data from Rosner, B Fundamentals of Biostatistics, 5th ed., Duxbury, 2000, p. 383.";
	  
var Exercises= 
	  "<ul>"+
	  "<li>183 cases of endometrial cancer were compared with the same number of controls matched by age, race, date of admission, and hospital.  The factor of interest was previous exposure to oral estrogen (conjugated estrogens). </li>"+
      "<li>There were 12 pairs in which both case and control were exposed, and 121 pairs in which neither was exposed.  Discordant pairs included 7 with unexposed case and exposed control and 43 with exposed case and unexposed control.  </li>"+
	  "<li>Find the odds ratio and compare it with the odds ratio using the unmatched methods of TwobyTwo analysis, which gave an odds ratio of 3.71.  Did the matching make a difference?</li>"+
      "</ul>"+
    "Data from Schlesselman, JJ Case-Control Studies, Oxford, 1982; p. 209.";
var halfadded=t("0.5 has been added to each cell for calculations");

function CalcStats(cmdObj) 
{
var mORbased = new Array();
var mRRbased=new Array();
var massoc=new Array();
var mreferences=new Array();

var a; var b; var c; var d;
var r1; var r2; var c1; var c2; var t; var added05;
var cs; var num; var denom; var lowerci; var upperci;  var od; 
var od_lo; var od_hi;    
added05 = 0;
a  = parseFloat(cmdObj.data[1]["E1D1"]);
//alert("a="+a);
//Experiment--swap these two values and turn off UseTableSettings
//Nov 2007
/*
var swapval=cmdObj.data[1]["E1D0"]
cmdObj.data[1]["E1D0"]=cmdObj.data[1]["E0D1"]
cmdObj.data[1]["E0D1"]=swapval;
swapval=null;
*/

c  = parseFloat(cmdObj.data[1]["E1D0"]); //switched b and c
b = parseFloat(cmdObj.data[1]["E0D1"]);
//alert("b="+b);
//alert("c="+c);
d  = parseFloat(cmdObj.data[1]["E0D0"]);
//alert("d="+d)

//Note that this setup assumes a,b,c,d with Disease on the LEFT and
//EXPOSURE at the TOP of the table, the opposite of the Epi Info
//configuration.  a,b,c,d are not universal terms and must be understood
//in the context defined by the author of the statistical routine or formula.

r1 = a+b;  //Total number of diseased persons
r2 = c+d;
c1 = a+c;  //Total number of exposed persons
c2 = b+d;
t  = a+b+c+d;



var  exactStats=new martinStats(cmdObj); //Create an instance of the exact
	                                          //statistics, module

exactStats.matchedCC(1,mORbased,mRRbased,massoc,mreferences)

//alert (mORbased[1] + "\n"+ mRRbased[1] +"\n"+ massoc [1] +"\n"+ mreferences[1]);

//alert("a=" + a + " b=" + b + " c=" + c + "d=" + d);
if ( (b == 0) || (c == 0)) 
{
  added05 = 1;
 // a = a + 0.5;
  b = b + 0.5;
  c = c + 0.5;
 // d = d + 0.5;
  alert (halfadded);
}
cs=Math.pow((b - c),2)/(b + c);
//csc=Math.pow(Math.abs((b - c)- 1),2)/(b + c);
//Corrected error above, thanks to Michael Campbell, Statistics at Square One.  October 24, 2008
csc=Math.pow((Math.abs(b - c)- 1),2)/(b + c);


mhcs=((t - 1) * Math.pow((a * d) - (b * c),2))/(c1 * c2 * r1 * r2);
with (cmdObj)
{
newtable(7,90);
//6 columns and 100 pixels per column
newrow()
title("<h2>" + "Matched Pair Case-Control Study" + "</h2>");
line(7,1)

tableAsHTML(1); //Show the input data

newtable(7,90);
newrow("<br>");    //Skip a row

title("Measures of Association");
line(7,1);
newrow("span4:","span3:c:bold:P Values");
newrow("","span2:l:bold:Test","l:bold:Value", "l:bold:d.f.", "l:bold:1-tail",editorschoice1+"c:bold:2-tail");
line(7,1);
//alert("EntryWin.ConfLevel="+EntryWin.ConfLevel)   
  
  
//alert("pcutoff="+pcutoff)
  
   var p = Csp(cs);
   
   newrow("","span2:l:McNemar::","l:"+fmtSigFig(cs,4),"l:1","","c:"+fmtPValue(p))
   
   p = Csp(csc);
   
   newrow("","span2:l:McNemar with continuity correction::","l:"+fmtSigFig(csc,4),"l:1","", "c:"+fmtPValue(p))
 
 //alert("massoc1="+massoc[1]);
   eval(massoc[1]);
   //line(6)
 newrow("<br>");  
 var dpairs = b+c;
 newrow("","span6:c:There are "+dpairs+" discordant pairs.");
 if (dpairs < 20)
 {
 newrow("","span6:c:Because this number is fewer than 20, it is recommended that only the exact results be used.");  
  }
  else
  {
  newrow("","span6:c:Because this number is >= 20, the McNemar test can be used.");
  }
 newrow("<br>");   
  
   cscrit=cscritFromOEConfLevel(ConfLevel);
   

//calculate the odds ratio;
 od=b/c;  
//Confidence interval for the odds ratio, Taylor series;
  var od_lo = od * Math.exp(-Math.sqrt(cscrit) * Math.sqrt(1/b + 1/c));
  var od_hi = od * Math.exp( Math.sqrt(cscrit) * Math.sqrt(1/b + 1/c));
  newrow("<br>");
   title("Odds-based Estimates");
   line(7,1);
   newrow("span4:","bold:c:span3:"+ConfLevel+"\% Confidence Intervals")
   newrow("","l:bold:span2:Parameter","l:span2:bold:Point Estimate","l:bold:Lower,Upper", "c:bold:Type");
   line(7,1);
   newrow("","span2:Pair-Matched Odds Ratio::",fmtSigFig(od,4),"c:span2:"+limits(od_lo,od_hi,1),"Taylor series");
   eval(mORbased[1]);
  // line(6);
  // newrow("span2:<i>* Taylor series</i>","","","");
   line(7,1);
   newrow();
   for (i=0;i<=1;i++)
    {
     eval(mreferences[i]); 
    }
   endtable();
 } //with cmdObj  
}

function csq(o,e) {
if(e==0) { return 0 }
var x=Math.abs(o-e)-0.5; if(x<0) { return 0 }
return x*x/e
}

function Csp(x)
{
var z = Math.sqrt(x);
var aa = 0.3989422804014 * Math.exp(-1 *(Math.pow(z,2)/2))
var bb = (0.31938153 * (1/(1+(0.2316419 * z)))) + (-0.356563782 * (1/Math.pow((1 + 0.2316419 * z),2)))+(1.7815 * (1/Math.pow((1 + 0.2316419 * z),3)));
var cc = (-1.8213 * (1/Math.pow((1 + 0.2316419 * z),4))) + (1.3303 * (1/Math.pow((1 + 0.2316419 * z),5)));
var chisqp = 2 * (aa * (bb + cc));
return chisqp;
}

function modiwald(mnum, mdenom, z) {
//Error checking issues - denominator cannot be less than numerator - denominator should must be > zero;
//Also double check Z value - if negative, make positive - give some upper and lower limits';
  var vPP = (mnum + (z * z / 2))/(mdenom + (z * z));
  var lower = vPP - z * Math.sqrt(vPP*(1-vPP)/(mdenom + (z * z)));
  if (lower < 0) lower = 0;
  var upper = vPP + z * Math.sqrt(vPP*(1-vPP)/(mdenom + (z * z)));
  if (upper > 1) upper = 1;
  lowerci = lower;
  upperci = upper;
}

function Fmt(x) { 
var v
if(x>=0) { v=''+(x+0.000005) } else { v=''+(x-0.000005) }
return v.substring(0,v.indexOf('.')+6)
}

//end of script