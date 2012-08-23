// JavaScript Document
//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="Dose Response: Chi Square for Linear Trend";

var Authors="<b>Statistics and Interface</b> <br>"+
"Andrew G. Dean, EpiInformatics.com<br>"+
"Equations from<br>"+
"Schlesselman, JJ. Case-Control Studies: "+
"Design, Conduct, Analysis. Oxford Univ. Press, NY, 1982; p.200-206."+
"</p> ";

    
var Description="Use this module to test for trend "+ 
"when there are more than two levels of exposure. In the example shown, "+
"the levels are midpoints of ranges of cigarettes smoked per day "+
"during the third month of pregnancy. Cases are infants with congenital "+
"malformations. "+
"<p>The test performed is the Extended Mantel Haenszel Chi Square for linear "+
"trend with a p-value for one degree of freedom. More than one stratum "+
"can be entered to remove confounding.</p> "
 
 //The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="Use the Load Demo Data button to load data from a case-control study of myocardial infarction(MI) in women.  There are five strata representing 5-year age groups from age 25 to 49 with Level 0 being non-smokers, Level 1 smoking 1-24 cigarettes per day, and Level 2 smoking 25 or more per day."+
		" After examining the strata, click Calculate to see the results.  "+      
"<ul>"+
	  "<li>Age adjusted odds ratios are 1.0 for non-smokers (baseline group); 3.16 for Level 1 and 8.56 for Level 2 smokers. </li>"+
      "<li>The Mantel-Haenszel extended chi square summarizing linear trend is 128.8 with a p-value less than 0.0000001. </li>"+
	  "<li>We conclude that there is a dose-response of MIs by smoking level after adjusting for 5-year age group. Other factors have not yet been considered.</li>"+
"</ul>"+
"Data from Schlesselman JJ. Case-Control Studies, Oxford, 1982;p. 205. Note that the answers differ slightly due to the inclusion of a continuity correction in the OpenEpi formulas, following Rosner B Fundamentals of Biostatistics, 4th ed., Duxbury, 2000;p 607-9.";   

var Exercises="<h2>Age and Snoring</h2>"+
	"<ul>"+
	  "<li>A questionnaire study of state employees in Wisconsin gave the following data: </li>"+
	  "<table border='1'>"+
	  "<b>"+
	  "<tr align='center'><td></td><td colspan='2'>Women</td><td colspan='2'>Men</td></tr>"+
	  "<tr align='center'><td>Age</td><td>Snore</td><td>No_Snore</td><td>Snore</td><td>No_Snore</td></tr>"+
	  "<tr align='center'><td>30-39</td><td>196</td><td>603</td><td>188</td><td>348</td></tr>"+
	  "<tr align='center'><td>40-49</td><td>223</td><td>486</td><td>313</td><td>383</td></tr>"+
	  "<tr align='center'><td>50-60</td><td>103</td><td>232</td><td>232</td><td>206</td></tr>"+
	  "</b>"+
	  "</table><br>"+
	  
	  
      "<li>Does the frequency of snoring increase with age, after adjusting for sex?</li>"+
    "</ul>"+
"Rosner B Fundamentals of Biostatistics, 4th ed., Duxbury, 2000; p. 606.";    
	
//Calculations for Dose Response
//From Schlesselman, James J. Case-Control Studies:Design, Conduct, Analysis. 
//Oxford Univ. Press, NY, 1982;200-206.  

function calcDoseResponse(dataArr)
{
var stratum=0
var i;
var Vsum=0;     //called the "quantity" in Schlusselman
var V1sum=0;     //numerator (before squaring) in equation 7.43 in Schlusselman
var XMHchisq=0 ; //Extended Mantel Haenszel chi square
var levels=dataArr[0]["rows"]-2
var mhORad=new Array();  //Mantel Haenszel OR numerator for each level of exposure
   						    //to be summed over all strata
var mhORbc=new Array();  //Denominator for same
var acrude=new Array()   // Cell a to be summed over all strata with index for each
                         //exposure level
var bcrude=new Array(); 
var ccrude=0;           //baseline cells summed over all strata.
var dcrude=0;      
var mhsumOR;        						 
var crudeOR;
with (outTable)
{
for (i=0; i<levels; i++) 
  {
   mhORad[i]=0;  
   mhORbc[i]=0;
   acrude[i]=0;
   bcrude[i]=0;
  }
for(stratum=1; stratum <dataArr.length; stratum++)
  {var t;
   var T1=0;
   var T2=0;
   var T3=0;
   var n1=0;
   var n2=0;
   var n=0;
   var OR=1.0;
   
   var x,a,b,m,p;
   
   
   title("Stratum "+stratum)
   newrow("Exposure Level","Cases","Controls","Total", "Odds of Exp.","Odds Ratio")
   var abase=dataArr[stratum]["E0D0"]
   var bbase=dataArr[stratum]["E0D1"] 
   ccrude+=abase;
   dcrude+=bbase;
   
	//for(t=0; t<levels; t++;)
	for(t=0; t<levels; t++)
	  { 
	   //Set up variables
	   x=dataArr[0].Evals[t]
	 
	   x=parseFloat(x)

	   a=dataArr[stratum]["E"+t+"D0"]                    //number of cases
	   b=dataArr[stratum]["E"+t+"D1"]                    //number of controls
	   acrude[t]+=a;
	   bcrude[t]+=b;
	   m=a + b               //sum of cases and controls
	   //Compute sums over the rows
	   //Conditions
	   //n>1; b>0; abase>0 
	   T1+=a*x;
	   T2+=m*x;
	   T3+=m*x*x;
	   n1+=a;
	   n2+=b;
	   n+=a+b;
	   
	   OR=(a*bbase)/(b*abase) //OR for this level in this stratum
	   if(t>0)
	   {
	   ttot=a+bbase+b+abase; 
	   mhORad[t]+=a*bbase/ttot   //MH summary Odds Ratio numerator for this exposure level
	   mhORbc[t]+=b*abase/ttot   //Denominator, also summed over all strata
	   }
	   //alert("a="+a+" b="+b+" t="+t+" mhORad[t]="+ mhORad[t])
	   //alert("t="+t+" mhORbc[t]="+ mhORbc[t])
	  // alert("a="+a+" b="+b+" bbase="+bbase+" abase="+abase+" OR="+OR)
	   newrow(x+"",a+"",b+"",m+"",fmtFixed(a/b,2),fmtFixed(OR,2))
	   }
	 Vsum+=(n1*n2*(n*T3-(T2*T2)))/(n*n*(n-1))
	 V1sum+=T1-((n1/n)*T2)
	   //alert("T1="+T1+" T2="+T2+" T3="+T3) 
	 line(6) 
	 newrow("Total",n1+"",n2+"",n+"") 
     newrow()
	
  }  //end of for stratum
 XMHchisq+=((V1sum-0.5)*(V1sum-0.5))/Vsum  //Added continuity correction to agree
                                           //with Rosner (2000) rather than Schlesselman
										   //(1982)
 p=pchisq(XMHchisq,1)
 newrow("span6:c:bold:Mantel-Haenszel Summary Odds Ratios and Crude OR for Each Exposure Level")
 newrow("span2:bold:Exposure","span2:bold:MH Summary OR","span2:bold:Crude OR")
 for (i=0; i<levels; i++)
   {
   //For each level of exposure, show the MH summary Odds ratio.
   //alert("i="+i+" mhORad[i]="+ mhORad[i]+" mhORbc[i]="+mhORbc[i])
   if (i==0)
    {
	 mhsumOR=1
	}
    else
	{
	 mhsumOR=mhORad[i]/mhORbc[i]
	}	
   newrow("span2:Level "+i+" vs. Level 0::","","l:"+fmtFixed(mhsumOR,3),fmtFixed((acrude[i]*dcrude)/(bcrude[i]*ccrude),3))
   //alert("a=" +acrude[i]+" b="+bcrude[i]+"c="+ccrude+" d="+dcrude)
   }
 newrow();  
 newrow("span6:If MH and crude ORs are equal, confounding by the stratifying variable");
 newrow("span6:was not present and stratification is unnecessary."); 
 newrow(); 
 newrow("span5:Extended Mantel-Haenszel chi square for linear trend=","l:"+fmtFixed(XMHchisq,2))
 newrow("span5:p-value(1 degree of freedom)=","l:"+p);
 newrow(); 
 newrow ("span6:Includes continuity correction. Rosner,B. Fundamentals of Biostatistics, 5th ed.,Duxbury, 2000, p.606.");
 newrow ("span6:Results will therefore differ slightly from Statcalc and from Schlesselman,JJ,Case-Control Studies, Oxford, 1982,p.203."); 
 
 newrow();
  }  //end of with outTable
}
