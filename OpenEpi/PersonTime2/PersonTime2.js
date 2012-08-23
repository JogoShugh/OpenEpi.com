// JavaScript Document
<!-- hide this script tag's contents from old browsers
//This program is based on one developed by John C. Pezzullo, johnp71 at aol.com, 
//Modifications were by Kevin Sullivan, cdckms at sph.emory.edu. 
//Changes include the addition of corrected and MH chi square tests, improved 
//calculation of the chi square p-values, improved confidence interval methods, 
//and placing the outcome as rows and exposure as columns. Stratified analysis 
//was added by Andy Dean, agdean9 at hotmail.com, who also added a JavaScript
//version of David Martin's exact calculations.
//

//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="PersonTime2--Comparing Two Person-Time Rates";

var Authors="<b>Statistics</b><br>"+
"Kevin M. Sullivan, Emory University <br>"+
"and Andrew G. Dean, EpiInformatics.com<br>"+
"based on code from John C. Pezzullo<br>"+
"Exact and maximum likelihood statistics "+
"adapted from a Pascal program by David Martin<br><br>"+
"<b>Interface</b><br>"+
"Andrew G. Dean and Roger Mir ";
    
    
var Description="This module compares case rates in exposed and unexposed "+
"persons, using person time of exposure or non-exposure as denominators. "+
"Time can be entered as person-hours, -days, -years, etc., using the same "+
"units for exposed and unexposed persons. "+ 
"<p>Fisher and midP exact tests are included in the results. "+ 
"More than one stratum can be entered to calculate both crude and adjusted statistics.</p>";
 
//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="A cohort study of leukemia in workers exposed or not exposed to benzene produced the following data.  You can load the data automatically with the Load Demo Data button. "+      
	"<table border='1'>"+
	  "<b>"+
	  "<tr align='center'><td>&nbsp;</td><td colspan='2'>Men</td><td colspan='2'>Women</td></tr>"+
	  "<tr align='center'><td>Age</td><td>Benzene Exposure</td><td>No_Benzene</td><td>Benzene Exposure</td><td>No_Benzene</td></tr>"+
	  "<tr align='center'><td>Leukemia Deaths</td><td>17</td><td>3</td><td>8</td><td>1</td></tr>"+
	  "<tr align='center'><td>Person Years</td><td>100025</td><td>122268</td><td>78531</td><td>77932</td></tr>"+
	  "</b>"+
	  "</table><br>"+  
	  "After loading the demo data and choosing Calculate, the results show:"+ 
	  "<ul>"+
	    "<li>The difference between the two rates is statistically significant, with very small p values by several methods </li>"+
		"<li>There is roughly 7 times more leukemia mortality in the exposed group, with confidence limits for the rate ratio excluding 1.0 by a wide margin.</li>"+
      "</ul>"+
"Data from Martin DO &Austin H. Exact estimates for a rate ratio.  Epidemiology 1996;7:29-33.";

var Exercises="Analyze and interpret the following data from a chemotherapeutic study.<br>"+ 
"<TABLE BORDER=1>"+
"<TR>"+
  "<TD>&nbsp;</TD><TD>Treated</TD><TD>Placebo</TD>"+
"</TR>"+
"<TR>"+
"  <TD>Disease Recurrence</TD><TD>9</TD><TD>21</TD>"+
"</TR>"+
"<TR>"+
  "<TD>Patient-weeks of followup</TD><TD>359</TD><TD>182</TD>"+
"</TR>"+
"</TABLE>";

    
function calcPersonTime(cmdObj,showTables, showStrata)
{
var ptunit=1; //Units for reporting, as in "per (units) units of person time"
             //The value to use is calculated from the rate for the unexposed.
var rateBased= new Array()
var assoc=new Array()
var rateEtiolprev=new Array()
var references=new Array()
var ORbased=new Array(); //Not used, but defined for compatibility with twobytwo
var RRRDbased=new Array(); //Not used, but defined temporarily for backward compatibility
var mORbased = new Array()
var mRRbased= new Array()
var massoc=new Array()
var mreferences=new Array()
var summarystats=new Array()
//Consult the metadata in the data array to get the number of strata
var numStrata=cmdObj.data[0].strata

var anyExpLT5=false;  //Initialize variable for any expected value being less than 5.
var summarystrata=0;
if (numStrata>1) 
   {
    summarystrata=2
   };
//If the data set is stratified, define variables for accumulating the statistics
//that are adjusted across strata.  
if(numStrata>1)
  { 
   //Components for z score summary statistic for PersonTime data
   var sumA=0;
   var summ1n1divn=0;
   var summ1n1n0divnsqrd=0;
   
   //For Mantel-Haenszel summary chi square
   var sumMhChiNum=0
   var sumMhChiDenom=0;
   var MhUncorrSummaryChi=0; 
   
//Variables for Directly Adjusted Rate Ratio 
   var expLT5 = new Array()
   
   var z=zFromP((cmdObj.data[0].conflevel/100 +1)/2)  //z of (1-alpha)/2
 //  alert("z="+z)
   
   var RRarr=new Array();
   var wRRarr=new Array();
   var sumRRDirectwlnRR=0
   var sumwRR=0
   
   var adjRRDirect=0
   var lowRRDirect=0
   var upRRDirect=0

//Variables for Mantel-Haenszel Adjusted Rate Ratio
  
  var sumMhRRNum=0
  var sumMhRRDenom=0
  var sumRgbRRNum=0
  var sumRgbRRSE=0
  
  var adjRRmh
  var lowRRmh=0
  var upRRmh=0
  
//Variables for Risk Difference
  var RDarr=new Array();
  var wRDarr=new Array();
  var sumwtimesRD=0
  var sumwRD=0
  
  var adjRDdirect=0;
  var lowRD=0;
  var upRD=0;
  
//Variables for directly adjusted OR 
   var ORarr=new Array();
   var wORarr=new Array();
   var sumwtimesOR=0;
   var sumwOR=0;

//Variables for Mantel-Haenszel Adjusted OR     
   var summhORNum=0;
   var summhORDenom=0; 
   
  //For Robins, Greenland, Breslow
   
   var sumRgbPR=0;
   var sumRgbPSplusQR=0;
   var sumRgbQS=0;
   var sumRgbSumR=0;
   var sumRgbSumS=0;
   
   //Tests for Interaction --Breslow-Day test of homogeneity
   //The calculation for each stratum requires that final adjusted point 
   //estimate, so we store the intermediate values in suitable arrays, (OR, wOR, etc.)
   //with a value for each stratum
   
   var BDchiRR=0;
   var BDchiRD=0;
   var BDchiOR=0;
   }  //End of definitions for statistics adjusted across strata
  
var stratum,i;
with (cmdObj)
 {   newtable(7,90);
   //6 columns and 100 pixels per column
     title("<h2>Comparing 2 Person-Time Rates</h2>");
	 title("<h3>"+ConfLevel+"% Confidence Level</h3>");
     line(7)
var  exactStats=new martinStats(cmdObj);
	 //For each statum, do the calculations.  Results are returned in the arrays
	 //as cmdObj commands.
//Calculate ptunits to use for reporting
var num
var minrate=999999999999;
for (stratum=1; stratum<=numStrata; stratum++)
 {
 //Calculate ptunits to use for reporting
  num=cmdObj.data[stratum].E0D1
  if(num==0) {num=1};
  if (num/cmdObj.data[stratum].E1D1 <minrate)
    {
	 minrate=num/cmdObj.data[stratum].E1D1
	}
	//alert("minrate="+minrate);
  //minrate should now be the smallest rate in any stratum for the unexposed,
  //with 0 rates replaced by 1 case.
 }
while (minrate < 1)
  { 
    minrate*=10;
	ptunit*=10;
  }
//ptunit should now be the number of person time units needed to make the rate exceed 1
//alert("ptunit="+ptunit);
  	   	 										  
for (stratum=1; stratum<=numStrata; stratum++)
 {
 
  if(showTables) 
    {
	  cmdObj.tableAsHTML(stratum)
	  newrow("<br>");    //Skip a row
	}
  //The next two calls calculate results for a stratum, but return the output
  //commands in the parameter arrays for later use.	
  calcPersonTimeStratum(cmdObj,stratum,ORbased,rateBased,assoc,rateEtiolprev,references )
  exactStats.personTime(stratum,mORbased,mRRbased,massoc,mreferences)
 }
 
 //Do the same for the crude table
 if (showTables && numStrata>1) 
   {
   //Show crude table
    tableAsHTML(0)
	newrow("<br>"); 
   } 
   
if (numStrata>1)
{
  exactStats.personTime("Crude",mORbased,mRRbased,massoc,mreferences)
  exactStats.personTime("Adjusted",mORbased,mRRbased,massoc,mreferences)
  calcPersonTimeStratum(cmdObj,"Crude",ORbased,rateBased,assoc,rateEtiolprev,references )
  calcPersonTimeAdjusted(cmdObj,ORbased,rateBased,assoc,rateEtiolprev,references)
}
newtable(7,90)
newrow("<br>");
title("z-Score and Exact Measures of Association")
line(7)
eval(assoc[0]);

for (i=1; i<=numStrata; i++)
	{
	 eval (assoc[i]);
	 eval (massoc[i]);
	 line(7,1);
	}

//Arrays with index numstrata+1 are results for CRUDE tables.  Those with
//index numstrata+2 are for adjusted (all) strata.

if (numStrata>1)
{
  eval(assoc[numStrata+1]);
  eval(massoc[numStrata+1]);
  line(7,1);
  eval(assoc[numStrata+2]);
  eval(massoc[numStrata+2]);
 
 // newrow("Adjusted","span2:Mantel-Haenszel Summary Chi Sqr",fmtSigFig(MhUncorrSummaryChi,4),pchisq(MhUncorrSummaryChi,1)); 
 
}
newrow("<br>");

endtable()

//--------------------------------------------------------------------
newtable(8,90)
newrow("<br>"); 

title("Exact Rate Ratio Estimates and Confidence Limits");

//title("<font color=#ff0000>Per "+ptunit+" Person-Time Units</font>");
for (i=0; i<=numStrata; i++)
{
 //eval(rateBased[i])
 if (i>0)
  {
    eval (mRRbased[i])
  }
 eval (rateBased[i]); 	
 if ((numStrata==1)&&(i>0))
  {
	eval( rateEtiolprev[0]);
    eval ( rateEtiolprev[i])
  }
 if (i>0)
  {
   line(6,1);
  }  
}
if (numStrata>1)
 {
	  //Show crude and adjusted strata
  eval (mRRbased[numStrata+1]);
  eval (rateBased[numStrata+1]);
  eval (rateEtiolprev[0]);
  eval ( rateEtiolprev[numStrata+1])
  line(6,1);
  eval (mRRbased[numStrata+2]);
  eval (rateBased[numStrata+2]);
  line(6,1);
  
 
 }
//Now show results adjusted over all strata


eval (mreferences[0]);
eval (references[0]);
newrow("<br>");
newrow("<br>");
endtable();
//-----------------------------------------------------------
}  //with cmdObj


//note that the following functions are nested within calc2x2 and therefore
//have access to its variables.

function calcPersonTimeAdjusted(cmdObj,oddsBased,rateBased,assoc,rateEtiolprev,references)
{
var index=numStrata+2;  
if (numStrata>1)
{
    //MhUncorrSummaryChi=(sumMhChiNum*sumMhChiNum)/sumMhChiDenom;
	var zscore=(sumA-summ1n1divn)/(Math.pow(summ1n1n0divnsqrd,0.5));
    var zscorep=pnorm(zscore,true);
    assoc[index]='newrow("Adjusted","span2:z-score statistic","'+fmtSigFig(zscore,4)+'","span2:'+fmtPValue(zscorep)+'","c:' + fmtPValue(2*zscorep)+'")'; 
 
	//Calculate Directly Adjusted RR and RD
	adjRRDirect=Math.exp(sumRRDirectwlnRR/sumwRR);
	lowRRDirect=adjRRDirect*Math.exp( -(z/(Math.sqrt(sumwRR))))
	upRRDirect=adjRRDirect*Math.exp(z/(Math.sqrt(sumwRR)))
	
	adjRDdirect=sumwtimesRD/sumwRD;
	lowRD=adjRDdirect-(z/(Math.sqrt(sumwRD)));
	upRD=adjRDdirect+z/(Math.sqrt(sumwRD));
	
	//Calculate Mantel-Haenszel Adjusted RR
	adjRRmh=sumMhRRNum/sumMhRRDenom;
	var SE=Math.sqrt(sumRgbRRNum/(sumMhRRNum*sumMhRRDenom))
	  
	lowRRmh=adjRRmh*Math.exp(-z*SE);
	upRRmh=adjRRmh*Math.exp(z*SE);
	//Display results
	//'\nnewrow("c:'+stratum+'","span2:Risk in Exposed","'+fmtSigFig(risk_exposed_pt,4)+'","c:span2:'+limits(risk_exposed_lower,risk_exposed_upper)+'")'
   // alert(limits(lowRRDirect,upRRDirect,1))
	rateBased[index]='\nnewrow("","span2:Directly Adjusted RR","'+fmtSigFig(adjRRDirect,4)+'"\,\"c:span2:'+limits(lowRRDirect,upRRDirect,1)+'\",\"span2:Taylor\")'
	//alert("401"+rateBased[index])
	rateBased[index]+='\nnewrow("","span2:MH Adjusted RR","'+fmtSigFig(adjRRmh,4)+'","c:span2:'+limits(lowRRmh,upRRmh,1)+'",\"span2:Taylor\")'
	rateBased[index]+='\nnewrow("","span2:Directly Adjusted RD","'+fmtSigFig(adjRDdirect,4,ptunit)+'","c:span2:'+limits(lowRD,upRD,0,ptunit)+'",\"span2:Taylor\")'
		 //note: RD limits will be marked if they exclude 0, not 1
	//alert("405"+rateBased[index])	 
	for(i=1; i<=numStrata; i++)
	  {
		BDchiRR+=Math.pow ( Math.log(RRarr[i])-Math.log(adjRRDirect),2) / (1/(wRRarr[i]))
	  
	  }
	 pBDchiRR=pchisq(BDchiRR,numStrata-1)
	 rateBased[index]+='\nnewrow("<br>")';
	 rateBased[index]+='\nnewrow("","span5:"+"Breslow-Day test for interaction of Rate Ratio over strata::")'
	 rateBased[index]+='\nnewrow("","r:chi square=","l:'+fmtSigFig(BDchiRR,4)+ '","r:p=","l:'+pBDchiRR+'")'
	 if (pBDchiRR<0.05)
	 {
	  rateBased[index]+='\nnewrow("","span6: p is less than 0.05, suggesting that RR differs among strata(interaction).")'
	 }
	 else
	 {
	  rateBased[index]+='\nnewrow ("","span6: p greater than 0.05 does not suggest interaction. Adjusted RR can be used.")'
	 }
	
	
	rateBased[index]+='\nnewrow("<br>")';
	for(i=1; i<=numStrata; i++)
	  {
		BDchiRD+=Math.pow ( RDarr[i]-adjRDdirect,2)/(1/(wRDarr[i]));
	  
	  }
	 pBDchiRD=pchisq(BDchiRD,numStrata-1)
	 rateBased[index]+='\nnewrow("","span5:"+"Breslow-Day test for interaction of Risk Difference over strata::")'
	 rateBased[index]+='\nnewrow("","r:chi square=","l:'+fmtSigFig(BDchiRD,4)+ '","r:p=","l:'+pBDchiRD+'")'
	 if (pBDchiRD<0.05)
	 {
	  rateBased[index]+='\nnewrow("","span6: p is less than 0.05, suggesting that RD differs among strata(interaction).")'
	 }
	 else
	 {
	  rateBased[index]+='\nnewrow ("","span6: p greater than 0.05 does not suggest interaction. Adjusted RD can be used.")'
	 }
  }  //if numStrata>1
}


function calcPersonTimeStratum(cmdObj,stratum,oddsBased,rateBased,assoc,rateEtiolprev,references) 
{
//Performs the calculations for one 2 x 2 table, calling the accumulate stratum
//function to accumulate the adjusted statistics across strata.
var a; var b; var c; var d;
var r1; var r2; var c1; var c2; var t; var added05;
//var ax; //var bx; //var cx; //var dx; 
var cs; var num; var denom; var lowerci; var upperci; var rr; var dp; var efp; var efe; var od; var efpor; var efeor;
var od_lo; var od_hi; var rr_lo; var rr_hi; var dp_lo; var dp_hi; var efp_lo; var efp_hi; var efe_lo; 
var efe_hi; var efpor_lo; var efpor_hi; var efeor_lo; var efeor_hi;
var added05 = 0;

var zstat=0;  //z statistic for this stratum
var zstatp=0;  //p value for z statistic
//In this section, extract a single stratum from the
//data array produced by the data input module.  Strata have indices starting with
// 1, and table cells begin with the baseline (e.g., 0 or "no") values in the upper
// left, in the "E0D0" cell. 
var dataTable=new Array();  //Define an array for the single stratum or crude table
var pstratum =stratum; //Version of stratum for printing (blank if only one stratum)
var hstratum="Stratum"; //Column heading for strata
if (numStrata==1)
   {
     pstratum="";
	 hstratum="";
   }	 
if (stratum=="Crude")
{
 dataTable=cmdObj.crudeTable()  //The crude table is calculated by this function
}
else
{
 dataTable=cmdObj.data[stratum]  //Otherwise extracts a single stratum from the 
                                 //data array.
}
a  = parseFloat(dataTable["E0D0"]);
b  = parseFloat(dataTable["E0D1"]);
c  = parseFloat(dataTable["E1D0"]);
d  = parseFloat(dataTable["E1D1"]);
//alert("c="+c);

//alert("d="+d)
r1 = a+b;
m1=r1;
r2 = c+d;
n=r2;
n1=c;
n0=d;

//c1 = a+c;
//c2 = b+d;
//t  = a+b+c+d;
//alert("a="+a+" b="+b+" c="+c+" d="+d)
if (stratum=="Crude")
   {
    rec=numStrata+1
   }
 else 
   {
    rec=stratum;
   } 
   
/*   
//Set flag for expecteds less than 5
if( ((r1*c1)/t)<5 ||((r1*c2)/t)<5||((r2*c1)/t)<5||((r2*c2)/t)<5 )
{ 
  if (numStrata>1){expLT5[rec]=true;}
  anyExpLT5=true;
} 
else if (numStrata>1)
{
  expLT5[rec]=false;
}
 
if ((cmdObj.data[0].strata==1) && ((a == 0) || (b == 0) || (c == 0) || (d == 0))) 
{
  added05 = 1;
  a = a + 0.5;
  b = b + 0.5;
  c = c + 0.5;
  d = d + 0.5;
  alert ("0.5 has been added to each cell for some of the calculations");
}
*/         
	
//Z-score calculations         
//csc=(t * Math.pow(Math.abs((a * d) - (b * c))-t/2,2))/(c1 * c2 * r1 * r2);

//mhcs=((t - 1) * Math.pow((a * d) - (b * c),2))/(c1 * c2 * r1 * r2);
if (stratum==1)
{
   assoc[0]='\nnewrow("c:bold:'+hstratum+'","c:span2:bold:Test","c:bold:Value","c:bold:span2:p-value(1-tail)","c:'+editorschoice+'bold:p-value(2-tail)");'
   //assoc[0]+='\nnewrow("","span2:","","c:bold:span2:(upper,lower)","c:bold:span2:2 x min(1-sided)");'
   assoc[0]+='\nline(7)'
}
//cs=(Math.pow((a * d) - (b * c),2))/(r1 * c * d);
zstat= (a-(n1*m1/n))/(Math.pow( m1*n1*n0/(n*n),0.5));

zstat=Math.abs(zstat);  //Added Mar 2007 per Kevin 
zstatp= pnorm(zstat,true);  //Call function in Statfunctions1 to calculate p
                             //False means "not upper"
//cs_p = Csp(cs);
//var pcs = pchisq(cs,1);
  assoc[rec]='newrow("c:'+pstratum+'","span2:z-score","'+fmtSigFig(zstat,4)+'","span2:'+fmtPValue(zstatp)+'","c:' + fmtPValue(2*zstatp)+'")'; 
//  alert("assoc="+assoc[rec]+" rec="+rec);
  // cmdObj.newrow("","Uncorrected",Fmt(cs), 1, cs_p)   
  
    cscrit=cscritFromOEConfLevel(cmdObj.data[0].conflevel);
 
 //  cmdObj.title("Rate-based estimates")
  // cmdObj.newrow("span3:Parameter       ","Point Estimates", "Lower CI", "Upper CI")
 //  cmdObj.line(7)
if (stratum==1)
    {  
	 rateBased[0]='title("Rate-Based Estimates and '+ConfLevel+'% Confidence Intervals");'
	 rateBased[0]+='title("<font color=#ff0000><h3>Per "+ptunit+" Person-Time Units</h3></font>");'
	 rateBased[0]+='\nline(7);'
	 rateBased[0]+='\nnewrow("","C:bold:span2:Point Estimates","","c:span2:bold:Confidence Limits")'
	 rateBased[0]+='\nline(7)'
	 rateBased[0]+='\nnewrow("c:bold:'+hstratum+'","c:bold:span2:Type","c:bold:Value","c:span2:bold:Lower\, Upper","c:bold:Type")'
	 rateBased[0]+='\nline(7)'
    }
//confidence interval for risk/prevalence in exposed;
  if (added05 == 1)
    {
     num = a - 0.5;
    }
    else 
	{
	 num = a;
    }	
  denom = c; z = Math.sqrt(cscrit);
  byar(num, denom, z);
  rate_exposed_pt=(num/denom); 
  rate_exposed_lower = lowerci; 
  rate_exposed_upper = upperci; 
    

//confidence interval for rate in unexposed;
  if (added05 == 1){
    num = b - 0.5;
    }
    else {num = b;
    }
  denom = d; z = Math.sqrt(cscrit);
  byar(num, denom, z);
  rate_unexposed_pt=(num/denom); 
  rate_unexposed_lower = lowerci; 
  rate_unexposed_upper = upperci; 
//confidence interval for overall rate;
  num = r1; denom = r2; z = Math.sqrt(cscrit);
  byar(num, denom, z);
  rate_overall_pt=(num/denom); 
  rate_overall_lower = lowerci; 
  rate_overall_upper = upperci; 
 


  rateBased[rec]='\nnewrow("","span2:Rate in the <i>exposed</i>","'+fmtSigFig(rate_exposed_pt,4,ptunit)+'","c:span2:'+limits(rate_exposed_lower,rate_exposed_upper,"",ptunit)+'","Taylor");'
  rateBased[rec]+= '\nnewrow("","span2:Rate in the <i>unexposed</i>","'+fmtSigFig(rate_unexposed_pt,4,ptunit)+'","c:span2:'+limits(rate_unexposed_lower,rate_unexposed_upper,"",ptunit)+'","Taylor");'
  rateBased[rec]+='\nnewrow("","span2:Overall Rate","'+fmtSigFig(rate_overall_pt,4,ptunit)+'","c:span2:'+limits(rate_overall_lower,rate_overall_upper,"",ptunit)+'","Taylor");'
  
  

//calculate the rate ratio;
  rr=(a/c)/(b/d); 
//calculate the rate difference;
  dp=a/c-b/d;
//calcuate the etiologic fraction in the population (EFp);
  efp=((r1/r2)-(b/d))/(r1/r2);
  if (efp < -1) {efp = -1};
  if (efp >  1) {efp =  1};

//calculate the etiologic fraction in the exposed (EFe);
  efe=(rr-1)/rr;
  if (efe < -1) {efe = -1};
  if (efe >  1) {efe =  1};

//calculate the prevented fraction in the population (PFp);
  var pfp = (rate_unexposed_pt - rate_overall_pt) / rate_unexposed_pt;
  
//calculate the prevented fraction in the exposed (PFe);
  var pfe = (rate_unexposed_pt - rate_exposed_pt) / rate_unexposed_pt;
  
  
//Confidence interval for the rate ratio, Taylor series;
  var rr_lo = rr * Math.exp(-Math.sqrt(cscrit) * Math.sqrt((1 / a) + (1 / b)))
  var rr_hi = rr * Math.exp( Math.sqrt(cscrit) * Math.sqrt((1 / a) + (1 / b)))
//Confidence interval for the rate difference, Taylor series;
  var dp_lo = dp - Math.sqrt(cscrit) * Math.sqrt((a / Math.pow(c,2)) + (b / Math.pow(d,2)));
  var dp_hi = dp + Math.sqrt(cscrit) * Math.sqrt((a / Math.pow(c,2)) + (b / Math.pow(d,2)));
// alert("A=" + a + " B=" + b + " C="+c+" D="+d)

//Confidence interval for the etiologic fraction in the population based on rate, from Abramson, Pepi manual;
// Note: Kahn and Sempos use a different table setup, so be careful in the formula
  var efp_lo = ((c / r2) * (rr_lo - 1)) / ((c / r2) * (rr_lo - 1) + 1);
 // if (efp_lo < -1) {efp_lo = -1};
  
  var efp_hi = ((c / r2) * (rr_hi - 1)) / ((c / r2) * (rr_hi - 1) + 1);
 // if (efp_hi > 1) {efp_hi = 1};

//Confidence interval for the etiologic fraction in the exposed based on rate;
  var efe_lo = (rr_lo - 1) / rr_lo;
 // if (efe_lo < -1) {efe_lo = -1};
  
  var efe_hi = (rr_hi - 1) / rr_hi;
 // if (efe_hi > 1) {efe_hi = 1};
  
 //Confidence interval for the prevented fraction in the population;
  var pfp_lo = 1 - (1 / (1 - efp_hi));
  //form.pfp_lo.value=Fmt(pfp_lo * 100);
  var pfp_hi = 1 - (1 / (1 - efp_lo));
  //form.pfp_hi.value=Fmt(pfp_hi * 100);
//Confidence interval for the prevented fraction in the exposed (pfe);
  var pfe_lo = (1 - rr_hi);
  //form.pfe_lo.value=Fmt(pfe_lo);
  var pfe_hi = (1 - rr_lo);
  //form.pfe_hi.value=Fmt(pfe_hi);
  
 if (numStrata>1 && stratum != "Crude") 
  {
   accumulateStratum(a,b,c,d) 
  }
//Thanks to Ray Simons for correcting the following.  
/*if (b==0) 
  {
    alert ("b was 0  fixing rr and rr_hi" + "rr="+rr+" rr_hi="+rr_hi)
    rr=0;
    rr_hi=0;
	
  }
 */	 
 rateBased[rec]+='\nnewrow("","span2:RateRatio","'+fmtSigFig(rr,4)+'","c:span2:'+limits(rr_lo,rr_hi,1) +'","Byar");'
 rateBased[rec]+='\nnewrow("","span2:RateDifference","'+fmtSigFig(dp,4,ptunit)+'","c:span2:'+limits(dp_lo,dp_hi,0,ptunit)+'","Byar");'
 //rateBased[rec]+='\nline(7)'
 if (stratum==1)
  {  
  rateEtiolprev[0]='title("Attributable Fractions: Etiologic or Preventive")' 
  //rateEtiolprev[0]+='\nnewrow("Stratum","span2:Parameter","Point Est.", "Lower CI", "Upper CI")'
  //rateEtiolprev[0]+='\nline(7)' 
  
   }
 if (efp>=0) {rateEtiolprev[rec]+='\nnewrow("","span2:Etiologic fraction in pop.(EFp)","'+fmtSigFig(efp,4,"%")+'","c:span2:'+limits(efp_lo,efp_hi,0,"%")+'","PEPI");'}
 if (efe>=0) {rateEtiolprev[rec]+='\nnewrow("","span2:Etiologic fraction in exposed(EFe)","'+fmtSigFig(efe,4,"%")+'","c:span2:'+limits(efe_lo,efe_hi,0,"%")+'","PEPI");'}
 if (pfp>=0) {rateEtiolprev[rec]+='\nnewrow("","span2:Preventive fraction in pop.(PFp)","'+fmtSigFig(pfp,4,"%")+'","c:span2:'+limits(pfp_lo,pfp_hi,0,"%")+'","PEPI");'}
 if (pfe>=0) {rateEtiolprev[rec]+='\nnewrow("","span2:Preventive fraction in exposed(PFe)","'+fmtSigFig(pfe,4,"%")+'","c:span2:'+limits(pfe_lo,pfe_hi,0,"%")+'","PEPI");'}
 
if (stratum==1)
 {
  references[0]= '\nnewrow("span6:Byar=Byar Method; Taylor=Taylor series; PEPI=as described in Abramson and Gahlinger, PEPI software")';  
  references[0]+= stdRefStr();  //Function in StatFunctions1.js that supplies
                                // standard footnotes.
 }
/*
references[0]+= '\nnewrow("span6:&deg; &sup1; '+ConfLevel+'% confidence limits testing exclusion of 0 or 1 as indicated")';
var highnote="P-values \< "+(100-ConfLevel)/100+" and confidence limits excluding null values (0,1, or other as indicated) are highlighted."
if (!(cmdObj.data[0].nohighlight>0)) 
 {
  references[0]+= '\nnewrow("span6:'+ coloredText(highnote,highcolor)+'")';
 }
references[0]+='\nnewrow("span6:'+editorschoice+'LookFirst items:: Editor\'s choice of items to examine first.")';  
*/
//End of code for calcPersonTimeStratum.  Nested functions follow:

function byar(nnum, ndenom, z) 
{
  var lower = nnum * Math.pow((1 - (1 / (9 * nnum)) - ((z / 3)* Math.sqrt(1 / nnum))),3) / ndenom;
  if (lower < 0) lower = 0;
  var upper = (nnum + 1) * Math.pow((1 - (1 / (9 * (nnum + 1))) + ((z / 3)* Math.sqrt(1 / (nnum + 1)))),3) / ndenom;
  lowerci = lower;
  upperci = upper;
}
}//end calcPersontimeStratum()

function accumulateStratum(a,b,c,d)
{
//calculate cumulative statistics for this stratum and place in sum variables
//in calling routine, calc2x2(), 
//Variables for Directly Adjusted Rate Ratio 
//Note that b is, for these formulas, E0D1, hence we must switch b and c from the
//main routine

var m1 = a+b;
//var m0 = c+d;
var n1 = c;
//var n1 = a+c;
var n0 = d;
var n=n1+n0;


var w=0;
var RR,OR,RD;

sumA+=a;
summ1n1divn+=m1*n1/n;
summ1n1n0divnsqrd+=m1*n1*n0/(n*n);


//Variables for Mantel-Haenszel Uncorrected Chi Square across strata
sumMhChiNum += (a*n0)/n
sumMhChiDenom += (b*n1)/n;
//Variables for Directly Adjusted relative risk   
   RR= (a/n1) / (b/n0) ;
   RRarr[stratum]=RR;
   w= (a*b)/(m1);
   wRRarr[stratum]=w; 
   sumRRDirectwlnRR+=w* Math.log(RR);
   sumwRR+=w;
  
  sumMhRRNum+=a*n0/n;
  sumMhRRDenom+=b*n1/n;
  sumRgbRRNum+=(m1*n1*n0)/(n*n);
  sumRgbRRSE=0
//Variables for Rate Difference
  var RD=(a/n1)-(b/n0)
  
  w=1/ ( (a/(n1*n1)) + (b /(n0*n0))); 
  RDarr[stratum]=RD;
  wRDarr[stratum]=w;
  
 // sumwtimesRD+= w*RD
  sumwRD+=w;
  sumwtimesRD+=w*RD;
   
   //Tests for Interaction --Breslow-Day test of homogeneity
   //The calculation for each stratum requires that final adjusted point 
   //estimate, so we store the intermediate values in suitable arrays, (OR, wOR, etc.)
   //with a value for each stratum
 
}//end accumulateStratum
} //end calcPersonTime function : Note nesting of functions
