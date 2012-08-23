function BaseClass() {
    this.SetFailureMessage = function (message) {
        this.FailureMessage = message;
    }

    this.SetResultData = function (resultData) {
        this.ResultData = resultData;
    }
}

function TwoByTwo() {
}

TwoByTwo.prototype = new BaseClass();

TwoByTwo.Title="TwobyTwo Tables";

TwoByTwo.Authors="<b>Statistics</b><br>Kevin M. Sullivan, Emory University<br>"
    + "and Andrew G. Dean, EpiInformatics.com<br>"
    + "based on code from John C. Pezzullo<br>"
	+ "Exact and maximum likelihood statistics "
	+ "adapted from a Pascal program by David Martin."
    + "Thanks to Ray Simons for advice and testing.<br>"
    + "<b>Interface</b><br>"
    + "Andrew G. Dean and Roger Mir<br>";
	
TwoByTwo.Description="<p>Two by two tables are used to evaluate the association between a possible "
    + "risk factor (&quot;Exposure&quot;) and an outcome (&quot;Disease&quot;). "
    + "Counts summarizing the occurence of the four possible combinations of "
    + "events in the study population are entered into the appropriate cells. "
    + "The table can be rotated or flipped  so that either rows or "
    + "columns represent Exposure, and the column headings (+) and (-) can be "
    + " in either order "
    + "to match common textbooks of epidemiology. A single table or multiple "
    + "strata can be entered. </p> "
    + "<p>Statistics produced include the Fisher and mid-p exact tests, chi squares, "
    + "odds ratio, maximum likelihood odds ratio estimate, risk/prevalence ratio "
    + "(relative risk), risk difference, and etiologic fractions with confidence "
    + "limits produced by several methods, with stratified analysis ";
   
//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
TwoByTwo.Demo = "A cohort study of 162 men and 347 women examines the relationship between low income (the exposure) and a disease"+ 
"(say, osteoporosis, but these data are fictitious)."+ 
"To control for possible confounding by sex, men are entered in one stratum and women in the other."+  
"Choose Load Demo Data to see the data; then click on Calculate and choose Show all Results."+      
	  "<ul>"+
	    "<li>"+
"The chi square and midP exact results suggest that there is an association. "+  
"The Risk Ratio(RR) adjusted across the strata is 1.16, a modest effect indeed(16% increase in risk), with confidence limits barely excluding 1.0. "+  
"There is no evidence of interaction (difference in RR across strata). The adjusted and crude RRs and Odds Ratios are nearly identical, "+ 
"suggesting that there is no confounding by sex and that stratification is unnecessary."+
"</li>"+
		"<li>Conclusion: The study shows little or no association between the exposure and the disease, and neither confounding nor interaction by sex are demonstrated. "+ 
"Alas, many studies turn out this way, but it is good to have the quantitative confirmation. 'Null hypothesis' is the winner."+ 
"</li>"+
      "</ul>";
	  
TwoByTwo.Exercises = "<h2>Exercise 1--A Case-Control Study</h2>"+
"A case-control study examined Recent Oral Contraceptive use (OC) and Myocardial Infarction, with the following results:"+ 
	  "<ul>"+
	    "<li>OC+,MI+ =  29  OC+,MI- = 135</li>"+
        "<li>OC-,MI+ = 205  OC-,MI- =1607</li>"+
      "</ul>"+
  "Analyze and interpret the data.  What other information do you need and how would you analyze it?"+
 "<br><br>Reference: Schlesselman JJ, Case-Control Studies, Oxford, 1982; p. 187." +
 
 "<h2>Exercise 2--Attributable or Etiologic Fraction</h2>"+
      "<table>"+
	  "<b>"+
	  "<tr><td></td><td>HT +</td><td>HT-</td></tr>"+
	  "<tr><td>MI+</td><td>  3</td><td>10</td></tr>"+
	  "<tr><td>MI-</td><td>100</td><td>854</td></tr>"+
	  "</b>"+
	  "</table>"+
	  "<p>Note that the table has Disease on the left and Exposure at the top.  "+
	  "To avoid some serious mental gymnastics, choose Options/Setting in OpenEpi and select the Kleinbaum table layout.  "+
	  "Then return to TwobyTwo and enter the data.  Be sure to change the Setting back again if you normally work with Exposure on the left.</p>"+
	  "Hypothyroidism (HT) as a possible risk factor for myocardial infarction(MI) was studied in women over age 55 in Rotterdam."+
	  "<ul>"+
	    "<li>What percentage of the MIs were attributable to HT?  What percentage of MIs in those with HT? </li>"+
        "<li>lIs there a significant association between HT and MI in this study? </li>"+
      "</ul>"+
  "<br>Data from Kleinbaum, Sullivan, Barker. ActivEpi Companion Textbook, Springer, NY, 2003, p. 150-1.";
  
TwoByTwo.prototype.Execute = function (cmdObj, showTables, showStrate, casecontrol) {

/*
The TwobyTwo table statistics are complicated because results are calculated
for each stratum separately, but then displayed in a different order in groups.
Hence, the commands are stored in arrays, like oddsBased and riskBased, and can 
be inserted into the output tables in whatever order is desired.  So, the idea
is to do calculations, save commands for formatting the results, and then 
evaluate the commands in the proper order to construct the output tables in HTML.

First define the arrays in which to put the various types of statistical results.
*/
var oddsBased = new Array()
var riskBased= new Array()
//var RRRDbased=new Array()
var assoc=new Array()
var oddsEtiolprev=new Array()
var riskEtiolprev=new Array()
var references=new Array()
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
   //Variables for Mantel-Haenszel summary chi square
   var sumMhChiNum=0
   var sumMhChiDenom=0;
   var MhUncorrSummaryChi=0; 
   
   var expLT5 = new Array()
   
   var z=zFromP((cmdObj.data[0].conflevel/100 +1)/2)  //z of (1-alpha)/2
 
   //Variables for adjusted Risk Ratio 
   var RRarr=new Array();
   var wRRarr=new Array();
   var sumRRDirectwlnRR=0
   var sumwRR=0
   
   var adjRRDirect=0
   var lowRRDirect=0
   var upRRDirect=0

   //Variables for Mantel-Haenszel Adjusted Risk Ratio
  
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
    { 
	 //Create a new table using the commands in cmdObj  
	 newtable(7,90);
     //7 columns and 100 pixels per column
     title("<h2>2 x 2 Table Statistics</h2>");
     line(7,1);
     endtable();
	
     var  exactStats=new martinStats(cmdObj); //Create an instance of the exact
	                                          //statistics, module

											  
	 //For each statum, do the calculations.  Results are returned in the arrays
	 //as cmdObj commands.										  
     for (stratum=1; stratum<=numStrata; stratum++)
       {
        if(showTables) 
          {
		    //Call the method to construct the table
	        cmdObj.tableAsHTML(stratum)
	        newrow("<br>");    //Skip a row
	      }
 // alert(137)
      //The next two calls calculate results for a stratum, but return the output
      //commands in the parameter arrays for later use.	
      calc2x2Stratum(cmdObj,stratum,oddsBased,riskBased,assoc,oddsEtiolprev,riskEtiolprev,references )
      //exactStats=new martinStats(cmdObj);
      exactStats.strat2x2(stratum,mORbased,mRRbased,massoc,mreferences)

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
	 // alert(156)
	  exactStats.strat2x2("Crude",mORbased,mRRbased,massoc,mreferences)
      exactStats.strat2x2("Adjusted",mORbased,mRRbased,massoc,mreferences)
      calc2x2Stratum(cmdObj,"Crude",oddsBased,riskBased,assoc,oddsEtiolprev,riskEtiolprev,references )
     //alert(159)
	  calc2x2Adjusted(cmdObj,oddsBased,riskBased,assoc,oddsEtiolprev,riskEtiolprev,references)
     //alert(161)
	  }


      //Use new tables for different sections so that printing is more likely not to
      //split a table.  This section is where we actually produce the table(s) from
	  //the arrays of commands that have been returned.  The JavaScript  eval command
	  //is used to execute the strings as commands.


//--------------------------------------------------------------	  
newtable(7,90)
newrow("<br>");
title("Chi Square and Exact Measures of Association")
line(7)
eval(assoc[0]);

for (i=1; i<=numStrata; i++)
    {
     eval (assoc[i]);
	 eval (massoc[i]);

	 line(6,1);
	}

if (numStrata>1)
{
  for (i=numStrata+1; i<=numStrata+2; i++)
	{
	 eval (assoc[i]);
	 eval (massoc[i]);
	 line(6,1);
	}
}	
//}
//Arrays with index numstrata+1 are results for CRUDE tables.  Those with
//index numstrata+2 are for adjusted (all) strata.

newrow("<br>");
if (!anyExpLT5)
{
  newrow("c:span6:All expected values (row total*column total/grand total) are >=5");
  newrow("c:span6:OK to use chi square.");
}
else
{
  newrow("c:span6:At least one expected value (row total*column total/grand total) is < 5");
  newrow("c:span6:Fisher or Mid-P exact tests are recommended rather than chi square.");
}  
newrow("<br>");

//eval(assoc[assoc.length-1])  //Show crude
endtable()


//--------------------------------------------------------------------
if (!casecontrol)
{
	newtable(8,90)
	newrow("<br>");
	 
	for (i=0; i<=numStrata+summarystrata; i++)
	{
	 eval(riskBased[i])
	 if (i>0)
	  {
		eval (mRRbased[i])
	  }	
	 if ((numStrata==1 || i==numStrata+1) && (i>0))
	  {
		eval ( riskEtiolprev[i])
	  }
	 if (i>0)
	  {
	   line(6,1);
	  }  
	}
	
	newrow("<br>");
	endtable();
}

newtable(8,90)
newrow("<br>")
title("Odds-Based Estimates and Confidence Limits")
line(7);
     
eval (oddsBased[0])  //First the column headings
    
for (i=1; i<=numStrata+summarystrata; i++)
{
 eval (mORbased[i]);
// alert(mORbased[i] + "i="+i);
 eval (oddsBased[i]);
 if (numStrata==1 || i==numStrata+1)
   {
    eval ( oddsEtiolprev[i])
   }
   line(6,1); 
}
eval (mreferences[0]);
eval (references[0]);
newrow("<br>");
endtable();
//-----------------------------------------------------------
}  //with cmdObj


//note that the following functions are nested within calc2x2 and therefore
//have access to its variables.

function calc2x2Adjusted(cmdObj,oddsBased,riskBased,assoc,oddsEtiolprev,riskEtiolprev,references)
{
var index=numStrata+2;
if (numStrata>1)
{
    MhUncorrSummaryChi=(sumMhChiNum*sumMhChiNum)/sumMhChiDenom;
    assoc[index]='newrow("Adjusted","span2:Mantel-Haenszel Summary Chi Sqr","'+fmtSigFig(MhUncorrSummaryChi,4)+'","","","c:'+pchisq(MhUncorrSummaryChi,1)+'")'; 
 
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
	riskBased[index]='\nnewrow("Adjusted","span2:Directly Adjusted RR","'+fmtSigFig(adjRRDirect,4)+'"\,\"c:span2:'+limits(lowRRDirect,upRRDirect,1)+'\",\"span2:Taylor series\")'
	//alert("401"+riskBased[index])
	riskBased[index]+='\nnewrow("","span2:MH Adjusted RR","'+fmtSigFig(adjRRmh,4)+'","c:span2:'+limits(lowRRmh,upRRmh,1)+'",\"span2:Taylor series\")'
	riskBased[index]+='\nnewrow("","span2:Directly Adjusted RD","c:'+fmtSigFig(adjRDdirect,4,"%")+'","c:span2:'+limits(lowRD,upRD,0,100)+'",\"span2:Taylor series\")'
		 //note: RD limits will be marked if they exclude 0, not 1
	//alert("405"+riskBased[index])	 
	for(i=1; i<=numStrata; i++)
	  {
		BDchiRR+=Math.pow ( Math.log(RRarr[i])-Math.log(adjRRDirect),2) / (1/(wRRarr[i]))
	  
	  }
	 
	 pBDchiRR=Math.abs(pchisq(BDchiRR,numStrata-1));   //added abs May 2007 
	 riskBased[index]+='\nnewrow("<br>")';
	 riskBased[index]+='\nnewrow("","span5:"+"Breslow-Day test for interaction of Risk Ratio over strata::")'
	 riskBased[index]+='\nnewrow("","span2:l:chi square=","l:'+fmtSigFig(BDchiRR,4)+ '","r:p=","l:'+pBDchiRR+'")'
	
	 if (pBDchiRR<0.05)
	 {
	  riskBased[index]+='\nnewrow("","span6: p is less than 0.05, suggesting that RR differs among strata(interaction).")'
	 }
	 else
	 {
	  riskBased[index]+='\nnewrow ("","span6: p greater than 0.05 does not suggest interaction. Adjusted RR can be used.")'
	 }
	
	riskBased[index]+='\nnewrow("<br>")';
	for(i=1; i<=numStrata; i++)
	  {
		BDchiRD+=Math.pow ( RDarr[i]-adjRDdirect,2)/(1/(wRDarr[i]));
	  
	  }
	 pBDchiRD=pchisq(BDchiRD,numStrata-1)
	 riskBased[index]+='\nnewrow("<br>")'
	// riskBased[index]+='\nnewrow("span6: Breslow-Day test for interaction of Risk Difference over strata:: chi square='+fmtSigFig(BDchiRD,4)+ '"," p='+pBDchiRD+'")'
	 riskBased[index]+='\nnewrow("","span5:"+"Breslow-Day test for interaction of Risk Difference over strata::")'
	 riskBased[index]+='\nnewrow("","span2:l:chi square=","l:'+fmtSigFig(BDchiRD,4)+ '","r:p=","l:'+pBDchiRD+'")'
	 if (pBDchiRD<0.05)
	 {
	  riskBased[index]+='\nnewrow("","span6: p is less than 0.05, suggesting that RD differs among strata(interaction).")'
	 }
	 else
	 {
	  riskBased[index]+='\nnewrow ("","span6: p greater than 0.05 does not suggest interaction. Adjusted RD can be used.")'
	 }
    // alert("440"+riskBased[index])

   //Calculate adjusted odds-based statistics across strata
   var adjORdirect=0;
   var lowORdirect=0;
   var upORdirect=0;
//calculate mh adjusted OR
   var adjORmh= summhORNum/summhORDenom;
   
//calculate Robins, Greenland, Breslow confidence limits
   var ORmhSE=sumRgbPR/(2*sumRgbSumR*sumRgbSumR)
   ORmhSE+=sumRgbPSplusQR/(2*sumRgbSumR*sumRgbSumS)
   ORmhSE+=sumRgbQS/(2*sumRgbSumS*sumRgbSumS)
   ORmhSE=Math.pow(ORmhSE,0.5)
   
   var lowORmh= adjORmh*Math.exp(-(z*ORmhSE));
   var upORmh=adjORmh*Math.exp(z*ORmhSE);
   //Calc Directly Adjusted Odds Ratio
   //alert("sumwtimesOR="+sumwtimesOR+" sumwOR="+sumwOR)

   var daOR= Math.exp( sumwtimesOR/sumwOR);
   var lowORda=daOR*Math.exp(-(z/Math.sqrt(sumwOR)))
   var upORda=daOR*Math.exp(+(z/Math.sqrt(sumwOR)))
   //oddsBased[index]+=mORbased[numStrata+2]
   oddsBased[index]+='\nnewrow("","span2:Directly Adjusted OR","c:'+fmtSigFig(daOR,4)+'",\"c:span2:'+limits(lowORda,upORda,1)+'",\"span2:Taylor series\")';   
   oddsBased[index]+='\nnewrow("","span2:Mantel-Haenszel OR","c:'+fmtSigFig(adjORmh,4)+'",\"c:span2:'+limits(lowORmh,upORmh,1)+'","span2:Robins,Greenland,Breslow")';
  // oddsBased[index]+='\nline(6,1)'
   //oddsBased[index]+=mORbased[mORbased.length-1]
   //oddsBased[index]+=oddsBased[oddsBased.length-1]

   //Test for interaction of OR

   for(i=1; i<=numStrata; i++)
   {
     BDchiOR+=Math.pow ( Math.log(ORarr[i])-Math.log(daOR),2) / (1/(wORarr[i]))
   }
   pBDchiOR=Math.abs(pchisq(BDchiOR,numStrata-1))  //added abs, May 2007
   oddsBased[index]+='\nnewrow("<br>")';
   //oddsBased[index]+='\nnewrow("span6: Breslow-Day test for interaction of Odds Ratio over strata:: chi square='+fmtSigFig(BDchiOR,4)+ '"," p='+pBDchiOR+'")'
   oddsBased[index]+='\nnewrow("","span5:"+"Breslow-Day test for interaction of Odds Ratio over strata::")'
   oddsBased[index]+='\nnewrow("","span2:l:chi square=","l:'+fmtSigFig(BDchiOR,4)+ '","r:p=","l:'+pBDchiOR+'")'
   if (pBDchiOR<0.05)
   {
    oddsBased[index]+='\nnewrow("","span6: p is less than 0.05, suggesting that OR differs among strata(interaction).")'
   }
   else
   {
    oddsBased[index]+='\nnewrow ("","span6: p greater than 0.05 does not suggest interaction. Adjusted OR can be used.")'
   }
  }  //if numStrata>1
}
 
 
function calc2x2Stratum(cmdObj,stratum,oddsBased,riskBased,assoc,oddsEtiolprev,riskEtiolprev,references) 
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


//Now set up a,b,c,d correctly from the single stratum
a  = parseFloat(dataTable["E1D1"]);
//alert("a="+a);
b  = parseFloat(dataTable["E0D1"]);
//alert("c="+c);
c  = parseFloat(dataTable["E1D0"]);
//alert("b="+b);
d  = parseFloat(dataTable["E0D0"]);
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
//alert("a="+a+" b="+b+" c="+c+" d="+d)
if (stratum=="Crude")
   {
    rec=numStrata+1
   }
 else 
   {
    rec=stratum;
   } 
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
/*    
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
if ((cmdObj.data[0].strata==1) && ((a == 0) || (b == 0) || (c == 0) || (d == 0))) 
{
  EntryWin.infoDialog("Some calculations are not possible with a zero cell.\nAfter seeing these results, you may wish to add a small number, like 0.5, to each cell,\nand calculate again.");
}
  //Chi Square calculations         
  var chiSquareCalculationResult = ChiSquares.Calculate(t, a, b, c, d, c1, c2, r1, r2);
  cs = chiSquareCalculationResult.cs;
  csc = chiSquareCalculationResult.csc;
  mhcs = chiSquareCalculationResult.mhcs;
  if (stratum==1)
  {
   assoc[0]='\nnewrow("c:bold:'+hstratum+'","c:span2:bold:Test","c:bold:Value","c:bold:span2:p-value(1-tail)","c:bold:p-value(2-tail)");'
   //assoc[0]+='\nnewrow("","span2:","","c:bold:span2:(upper,lower)","c:bold:span2:2 x min(1-sided)");'
   assoc[0]+='\nline(7)'
  }
  var pcs = pchisq(cs,1,true); //Chi square, 1 degree of freedom, number only
  var pcsc = pchisq(csc,1,true);
  var pmhcs = pchisq(mhcs,1,true);
 //alert("570 pcs="+pcs+"    fmtPValue(pcs)="+fmtPValue(pcs));
 
  assoc[rec]='\nnewrow("c:'+pstratum+'","span2:Uncorrected chi square",'+fmtSigFig(cs,4)+',"c:span2:'+fmtPValue(0.5*pcs) +'","c:'+fmtPValue(pcs)+'")';
 // alert("rec="+rec +"\n" +assoc[rec])
  assoc[rec]+='\nnewrow("","span2:Yates corrected chi square",'+fmtSigFig(csc,4)+',"c:span2:'+fmtPValue(0.5*pcsc) +'","c:'+fmtPValue(pcsc)+'")';
  assoc[rec]+='\nnewrow("","span2:Mantel-Haenszel chi square",'+fmtSigFig(mhcs,4)+',"c:span2:'+fmtPValue(0.5*pmhcs) +'","c:'+fmtPValue(pmhcs)+'")';
  cscrit=cscritFromOEConfLevel(cmdObj.data[0].conflevel);
  if (stratum==1)
    { 
	 //Set up headings 
	 riskBased[0]='title("Risk-Based* Estimates and '+ConfLevel+'% Confidence Intervals");'
	 riskBased[0]+='\nnewrow("c:span7:(Not valid for Case-Control studies)");'
	 riskBased[0]+='\nline(7);'
	 riskBased[0]+='\nnewrow("","C:bold:span2:Point Estimates","","c:span2:bold:Confidence Limits")'
	 riskBased[0]+='\nline(7)'
	 riskBased[0]+='\nnewrow("c:bold:'+hstratum+'","c:bold:span2:Type","c:bold:Value","c:span2:bold:Lower\, Upper","c:bold:Type")'
	 riskBased[0]+='\nline(7)'
	 //RRRDbased[0]='\ntitle("Risk Ratio(RR) and Risk Difference(RD) with Confidence Limits");'
	 //RRRDbased[0]+='\nnewrow("c:span7:(Not for Case-Control Studies)");'
	 //RRRDbased[0]+='\nnewrow("c:bold:Stratum","c:bold:RR","c:bold:span2:Conf Lim","c:bold:RD", "c:span2:bold:Conf Lim")'
	 //RRRDbased[0]+='\nline(7)'
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
  denom = c1; z = Math.sqrt(cscrit);
  modiwald(num, denom, z);
  risk_exposed_pt=(num/denom); 
  risk_exposed_lower = lowerci; 
  risk_exposed_upper = upperci;  

  //confidence interval for risk/prevalence in unexposed;
  if (added05 == 1){
    num = b - 0.5;
    }
    else {num = b;
    }
  denom = c2; z = Math.sqrt(cscrit);
  modiwald(num, denom, z);
  risk_unexposed_pt=(num/denom); 
  risk_unexposed_lower = lowerci; 
  risk_unexposed_upper = upperci; 

  //confidence interval for overall risk /revalence;
  num = r1; denom = t; z = Math.sqrt(cscrit);
  modiwald(num, denom, z);
  risk_overall_pt=(num/denom); 
  risk_overall_lower = lowerci; 
  risk_overall_upper = upperci; 

  riskBased[rec]='\nnewrow("c:'+pstratum+'","span2:Risk in Exposed","c:'+fmtSigFig(risk_exposed_pt,4,"%")+'","c:span2:'+limits(risk_exposed_lower,risk_exposed_upper,"",100)+'\",\"span2:Taylor series\")'
  riskBased[rec]+= '\nnewrow("","span2:Risk in Unexposed","c:'+fmtSigFig(risk_unexposed_pt,4,"%")+'","c:span2:'+limits(risk_unexposed_lower,risk_unexposed_upper,"",100)+'\",\"span2:Taylor series\")'
  riskBased[rec]+='\nnewrow("","span2:Overall Risk","c:'+fmtSigFig(risk_overall_pt,4,"%")+'","c:span2:'+limits(risk_overall_lower,risk_overall_upper,"",100)+'\",\"span2:Taylor series\")'
  //riskBased[rec]+='\nline(7,1);';
  //calculate the risk/prevalence ratio;
  rr=(a/c1)/(b/c2); 
  //calculate the risk/prevalence difference;
  dp=a/c1-b/c2; 
  //calcuate the etiologic fraction in the population (EFp) based on risk/prevalence;
  efp=((r1/t)-(b/c2))/(r1/t);
  if (efp < -1) {efp = -1};
  if (efp >  1) {efp =  1};
  //calculate the etiologic fraction in the exposed (EFe) based on risk/prevalence;
  efe=(rr-1)/rr;
  if (efe < -1) {efe = -1};
  if (efe >  1) {efe =  1};
  
  //calculate the prevented fraction in the population (PFp) based on risk/prevalence;
  pfp= (risk_unexposed_pt - risk_overall_pt)/(risk_unexposed_pt);
  //  if (pfp < -100) {pfp = -100};
  //  if (pfp >  100) {pfp =  100};
  //calculate the prevented fraction in the exposed (PFe) based on risk/prevalence;
  pfe= (risk_unexposed_pt - risk_exposed_pt)/(risk_unexposed_pt);
  
  //calculate the odds ratio;
  if (b*c==0) 
   {
    od=Number.NEGATIVE_INFINITY
   }
  else
    {
	 od=(a*d)/(b*c);
	} 
  //calculate the etiologic fraction in the population (EFpOR) based on the odds ratio;
  efpor=((c/r2)*(od-1))/((c/r2)*(od-1)+1);
  if (efpor < -1) {efpor = -1};
  if (efpor >  1) {efpor =  1};
  
  //calculate the etiologic fraction in the exposed (EFeOR) based on the odds ratio;
  efeor=(od-1)/od;
  if (efeor < -1) {efeor = -1};
  if (efeor >  1) {efeor =  1};
 
  //calculate the prevented fraction in the population (PFpOR) based on the odds ratio;
  pfpor=((c/r2)*(1 - od));
  
  //calculate the prevented fraction in the exposed (PFeOR) based on the odds ratio;
  pfeor=(1 - od);
  

  //Confidence interval for the odds ratio, Taylor series;
  var od_lo = od * Math.exp(-Math.sqrt(cscrit) * Math.sqrt(1/a + 1/b + 1/c + 1/d));
  var od_hi = od * Math.exp( Math.sqrt(cscrit) * Math.sqrt(1/a + 1/b + 1/c + 1/d));
  
//Confidence interval for the risk/prevalence ratio, Taylor series;
  var rr_lo = rr * Math.exp(-Math.sqrt(cscrit) * Math.sqrt(((1 - a/c1)/(c1 * a/c1))+((1 - b/c2)/(c2 * b/c2))))
  var rr_hi = rr * Math.exp( Math.sqrt(cscrit) * Math.sqrt(((1 - a/c1)/(c1 * a/c1))+((1 - b/c2)/(c2 * b/c2))))
  
//Confidence interval for the risk/prevalence difference, Taylor series;
  var dp_lo = dp - Math.sqrt(cscrit) * Math.sqrt((a * c / Math.pow(c1,3)) + (b * d / Math.pow(c2,3)));
  var dp_hi = dp + Math.sqrt(cscrit) * Math.sqrt((a * c / Math.pow(c1,3)) + (b * d / Math.pow(c2,3)));
  

//Confidence interval for the etiologic fraction in the population based on risk/prevalence, Kahn/Sempos method;
// Note: Kahn and Sempos use a different table setup, so be careful in the formula
  var efp_lo = efp - Math.sqrt(cscrit) * Math.sqrt(b * t * (a * d * (t - b) + (c * b * b)) / (Math.pow(r1,3) * Math.pow(c2,3)));
  if (efp_lo < -1) {efp_lo = -1};
  
  var efp_hi = efp + Math.sqrt(cscrit) * Math.sqrt(b * t * (a * d * (t - b) + (c * b * b)) / (Math.pow(r1,3) * Math.pow(c2,3)));
  if (efp_hi > 1) {efp_hi = 1};
 
//Confidence interval for the etiologic fraction in the exposed based on risk/prevalence;
  var efe_lo = (rr_lo - 1) / rr_lo;
  if (efe_lo < -1) {efe_lo = -1};
  
  var efe_hi = (rr_hi - 1) / rr_hi;
  if (efe_hi > 1) {efe_hi = 1};

//Confidence interval for the prevented fraction in the population (pfp) based on risk/prevalence;
  var pfp_lo =  (1 - (1 / (1 - efp_hi)));
  var pfp_hi =  (1 - (1 / (1 - efp_lo)));

//Confidence interval for the prevented fraction in the exposed (pfe) based on risk/prevalence;
  pfe_lo =  (1 - rr_hi);
  pfe_hi =  (1 - rr_lo);
  
//Confidence interval for the etiologic fraction in the population based on the odds;
  var efpor_lo = efpor - Math.sqrt(cscrit) * Math.sqrt(Math.pow((b*r2)/(d*r1),2)*((a/(b*r1))+(c/(d*r2))));
  if (efpor_lo < -1) {efpor = -1};
  
  var efpor_hi = efpor + Math.sqrt(cscrit) * Math.sqrt(Math.pow((b*r2)/(d*r1),2)*((a/(b*r1))+(c/(d*r2))));
  if (efpor_hi > 1) {efpor_hi = 1};
  
//Confidence interval for the etiologic fraction in the exposed based on the odds ratio;
  var efeor_lo = (od_lo - 1) / od_lo;
  if (efeor_lo < -1) {efeor_lo = -1};
  
  var efeor_hi = (od_hi - 1) / od_hi;
  if (efeor_hi > 1) {efeor_hi = 1};

//Confidence interval for the prevented fraction in the population (pfp|or) based on the odds;
  var pfpor_lo =  (1 - (1 / (1 - efpor_hi)));
  
  var pfpor_hi =  (1 - (1 / (1 - efpor_lo)));
 
//Confidence interval for the prevented fraction in the exposed (pfe|or) based on the odds;
  pfeor_lo =  (1 - od_hi);
  pfeor_hi =  (1 - od_lo);
 
 if (numStrata>1 && stratum != "Crude") 
  {
   accumulateStratum(a,b,c,d) 
  }
// alert(limits(rr_lo,rr_hi,1)) 
 riskBased[rec]+='\nnewrow("","span2:Risk Ratio","'+fmtSigFig(rr,4)+'","c:span2:'+limits(rr_lo,rr_hi,1) +'\",\"span2:Taylor series\")'
 //alert(riskBased[rec])
 riskBased[rec]+='\nnewrow("","span2:Risk Difference","c:'+fmtSigFig(dp,4,"%")+'","c:span2:'+limits(dp_lo,dp_hi,0,100)+'\",\"span2:Taylor series\")'
 //riskBased[rec]+='\nline(7,1);';
 if (stratum==1)
  {  
  riskEtiolprev[0]='title("Etiologic or Prevented Fractions")'
  riskEtiolprev[0]+='\nnewrow("bold:c:'+hstratum+'","bold:c:span2:Parameter","bold:c:Point Est.", "bold:c:span2:Conf Limits")'
  }
 //riskBased[rec]+='\nline(7)' 
 if(efp>=0){ riskEtiolprev[rec]+='\nnewrow("","span2:Etiologic fraction in pop.(EFp)","c:'+fmtSigFig(efp,4,"%")+'","c:span2:'+limits(efp_lo,efp_hi,"",100)+'");'}
 if(efe>=0){ riskEtiolprev[rec]+='\nnewrow("","span2:Etiologic fraction in exposed(EFe)","c:'+fmtSigFig(efe,4,"%")+'","c:span2:'+limits(efe_lo,efe_hi,"",100)+'");'}
 if(pfp>=0){ riskEtiolprev[rec]+='\nnewrow("","span2:Prevented fraction in pop.(pfp)","c:'+fmtSigFig(pfp,4,"%")+'","c:span2:'+limits(pfp_lo,pfp_hi,"",100)+'");'}
 if(pfe>=0){ riskEtiolprev[rec]+='\nnewrow("","span2:Prevented fraction in exposed(pfe)","c:'+fmtSigFig(pfe,4,"%")+'","c:span2:'+limits(pfe_lo,pfe_hi,"",100)+'");'}
// riskEtiolprev[rec]+='\nline(7)' 
 if (stratum==1)
  {  
   oddsBased[0]='\nnewrow("","C:bold:span2:Point Estimates","","c:span2:bold:Confidence Limits")'
   oddsBased[0]+='\nline(7)'
   oddsBased[0]+='\nnewrow("c:bold:'+hstratum+'","c:bold:span2:Type","c:bold:Value","c:span2:bold:Lower\, Upper","c:bold:Type")'
   oddsBased[0]+='\nline(7)'
  }
 oddsBased[rec]='\nnewrow("","span2:Odds Ratio","c:'+fmtSigFig(od,4)+'","c:span2:'+limits(od_lo,od_hi,1)+'\",\"span2:Taylor series\")'

 if(efpor>=0){ oddsEtiolprev[rec]+='\nnewrow("","span2:Etiologic fraction in pop.(EFp|OR)","c:'+fmtSigFig(efpor,4,"%")+'","c:span2:'+limits(efpor_lo,efpor_hi,"",100)+'");'}
 if(efeor>=0){ oddsEtiolprev[rec]+='\nnewrow("","span2:Etiologic fraction in exposed(EFe|OR)","c:'+fmtSigFig(efeor,4,"%")+'","c:span2:'+limits(efeor_lo,efeor_hi,"",100)+'");'}
 if(pfpor>=0){ oddsEtiolprev[rec]+='\nnewrow("","span2:Prevented fraction in pop(PFpOR)","c:'+fmtSigFig(pfpor,4,"%")+'","c:span2:'+limits(pfpor_lo,pfpor_hi,"",100)+'");'}
 if(pfeor>=0){ oddsEtiolprev[rec]+='\nnewrow("","span2:Prevented fraction in exposed(PFeOR)","c:'+fmtSigFig(pfeor,4,"%")+'","c:span2:'+limits(pfeor_lo,pfeor_hi,"",100)+'");'}
 if (stratum==1)
 {
   references[0]=stdRefStr();  //Function in StatFunctions1.js that supplies
                               // standard footnotes.
							   
  /* 
   references[0]= '\nnewrow("span6:&deg; &sup1; '+ConfLevel+'% confidence limits testing exclusion of 0 or 1, as indicated")';
   var highnote="P-values \< "+(100-ConfLevel)/100+" and confidence limits excluding null values (0,1, or [n]) are highlighted."
   if (!(cmdObj.data[0].nohighlight>0)) 
   {
     references[0]+= '\nnewrow("span6:'+ coloredText(highnote,highcolor)+'")';
   }
   references[0]+='\nnewrow("span6:'+editorschoice+'LookFirst items:: Editor\'s choice of items to examine first.")';  
  */
 }
 
//End of calculations for single stratum.  Nested functions follow.
function modiwald(mnum, mdenom, z) 
  {
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
  
}//end calc2x2Stratum()


function csq(o,e) 
{
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

function accumulateStratum(aa,bb,cc,dd)
{
//calculate cumulative statistics for this stratum and place in sum variables
//in calling routine, calc2x2(), 
//Variables for Directly Adjusted Risk Ratio 
//Note that b is, for these formulas, E0D1, hence we must switch b and c from the
//main routine

//Jan 2007
var a=parseFloat(aa);
var b=parseFloat(bb);
var c=parseFloat(cc);
var d=parseFloat(dd);

var m1 = a+b;
var m0 = c+d;
var n1 = a+c;
var n0 = b+d;
var t  = a+b+c+d;  
var w=0;
var RR,OR,RD;

//Variables for Mantel-Haenszel Uncorrected Chi Square across strata
  sumMhChiNum += ((a*d)-(b*c))/t
  sumMhChiDenom += (n0*n1*m0*m1)/((t-1)*t*t);

//Variables for Directly Adjusted relative risk   
   RR= (a/n1) / (b/n0) ;
   RRarr[stratum]=RR;
   w= (c/(a*n1)) + (d/(b*n0)) ;
   w=1/w
  // alert("w="+w+" stratum="+stratum+"a="+a+" b="+b+" c="+c+" d="+d+" n1="+n1+" n0="+n0)
   wRRarr[stratum]=w; 
   sumRRDirectwlnRR+=w* Math.log(RR);
   sumwRR+=w;
  
//Variables for Mantel-Haenszel Adjusted Risk Ratio
  
  sumMhRRNum+=a*n0/t;
  sumMhRRDenom+=b*n1/t;
  sumRgbRRNum+=((m1*n1*n0)-(a*b*t))/(t*t);
  sumRgbRRSE=0
 
//Variables for Risk Difference
  var RD=(a/n1)-(b/n0)
  
  w=1/ ( ((a*c)/(n1*n1*n1))  + ((b*d) / (n0*n0*n0)) )
  RDarr[stratum]=RD;
  wRDarr[stratum]=w
  
  sumwtimesRD+= w*RD
  sumwRD+=w
  
//Variables for directly adjusted OR 
   OR= (a*d) / (b*c) ;
   w= 1/(1/a + 1/b + 1/c + 1/d) ;
   ORarr[stratum]=OR
   wORarr[stratum]=w
  // alert("OR="+OR+" Math.log(OR)="+Math.log(OR)+" w*ln(OR)="+w*Math.log(OR))
   sumwtimesOR+=w*Math.log(OR);
   sumwOR+=w;
  
//Variables for Mantel-Haenszel Adjusted OR     
   summhORNum+= a*d/t;//These are the same as R and S below, but are left here for clarity.
   summhORDenom+=b*c/t; 
   //alert("summhORNum="+summhORNum+" a="+a)
   var P,Q,R,S; //For Robins, Greenland, Breslow
   P=(a+d)/t;
   Q=(b+c)/t;
   R=a*d/t;
   S=b*c/t;
   
   sumRgbPR+=P*R;
   sumRgbPSplusQR+=(P*S)+(Q*R);
   sumRgbQS+=Q*S;
   sumRgbSumR+=R;
   sumRgbSumS+=S;
  
   
   //Tests for Interaction --Breslow-Day test of homogeneity
   //The calculation for each stratum requires that final adjusted point 
   //estimate, so we store the intermediate values in suitable arrays, (OR, wOR, etc.)
   //with a value for each stratum
 
 }//end accumulateStratum

} //end Execute function : Note nesting of functions


// BEGIN JSG:

/* BEG Chi Squares */
function ChiSquares() {
}

ChiSquares.Calculate = function(t, a, b, c, d, c1, c2, r1, r2) {
  //Chi Square calculations         
  var cs = (t * Math.pow((a * d) - (b * c),2))/(c1 * c2 * r1 * r2);
  var csc = (t * Math.pow(Math.abs((a * d) - (b * c))-t/2,2))/(c1 * c2 * r1 * r2);
  var mhcs = ((t - 1) * Math.pow((a * d) - (b * c),2))/(c1 * c2 * r1 * r2);

  return new ChiSquareCalculationResult(cs, csc, mhcs);
}

function ChiSquareCalculationResult(cs, csc, mhcs) {
	this.cs = cs;
	this.csc = csc;
	this.mhcs = mhcs;
}
/* END Chi Squares */