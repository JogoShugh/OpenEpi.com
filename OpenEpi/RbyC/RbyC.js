// JavaScript Document

//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="R by C Table";

var Authors="<b>Statistics and Interface</b> <br>"+
"Andrew G. Dean and Kevin M. Sullivan<br> ";

var Description="Use this table to test for an association between variables with more than 2 "+
"values, for example 3 diseases and 3 blood types. The result is a chi square "+
"testing whether the results differ from those expected from the marginal "+
"sums alone. Further testing may be necessary to localize a significant "+
"finding, using either a subset in this table or the TwobyTwo statistics. "+
"<p>Criteria are evaluated to see if the chi square result can be accepted, "+
"as chi square is not reliable for small expected values.";
    
//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="Click 'Load Demo Data' for data from a study of blood type, peptic ulcer, gastric cancer, and a control group with neither disease "+      
	  "<ul>"+
	    "<li>Click 'Calculate' to find the chi square and p value for 4 degrees of freedom.</li>"+
		"<li>P is very small, suggesting that an association between blood type and disease exists, but further work is needed to describe how the results differ from those expected by chance. </li>"+
		"<li>If percentages are not shown in the result table, they can be turned on in the Options/Settings choice of the menu. </li>"+
      "</ul>"+
   "Data from Snedecor, GW & Cochran, WG Statistical Methods, Iowa State, Ames, Iowa, 1980, p. 210."
var Exercises="Refine the results from the demo by running R by C from the Enter New Data button. Specify 2 rows and 2 columns so that you can compare blood type O versus other blood types (vertically) and Peptic Ulcer versus all others (horizontally). "+ 
	  "<ul>"+
	  "<li>Rather than pulling out your calculator to combine values, enter 983 in the upper left for peptic ulcer, type O patients. Now click on the total for the first column, click Yes, and enter 1796. Note that the combined A+B cell for peptic ulcer is calculated. </li>"+
	  "<li>Use this feature to enter the total type O column as 4258. You will have to add 3720+788 manually and place the sum(4508) in the second row, last column. Now the total should be 8766.</li>"+
      "<li>You can label the margins by clicking in the marginal cells. </li>"+
      "<li>Click Calculate and find the chi square and tiny p value, indicating a relationship between blood type O and peptic ulcer. More information could be obtained by running the Two by Two program with the same numbers. </li>"+
	  "</ul>";
    
function CalcStats(cmdObj)   
{ 
  //chi square for r x c table
  with (cmdObj)
  {
  var i
  var cellval
  var r,c,p,df
  var meta=data[0]
  var numE=meta.datarmax-meta.datarmin+1
  var numD=meta.datacmax-meta.datacmin+1
  var rowtot=new Array()
  var coltot=new Array()
  var chisqr=0;
  var expected;
  var expunder1=0;
  var expunder5=0;
  var expunder5percent=0;
  
  var grandtot=0;
  for (i=0; i<numE; i++) {rowtot[i]=0}  //Initialize row totals
  for (i=0; i<numD; i++) {coltot[i]=0}  //Initialize col totals
   
  for(c=0; c<numD; c++)
   {  
   // Calculate Row and Column Totals
      //for each column
      for(r=0; r<numE; r++)
	  {
	   //go down the rows
	   cellval=data[1]["E"+r+"D"+c]
	  // alert("63 cellval=" + cellval)
	   coltot[c]+=cellval
	   rowtot[r]+=cellval
	   grandtot+=cellval
	  } 
    }
	
   for(c=0; c<numD; c++)
   { 
      //for each column
      for(r=0; r<numE; r++)
	  {
	   //go down the rows
	   cellval=data[1]["E"+r+"D"+c]
	   expected=rowtot[r]*coltot[c]/grandtot
	   expunder1+=(expected<1)
	   expunder5+=(expected<5)
	   chisqr+=((cellval-expected)*(cellval-expected))/expected
	  } 
	  
    }
	df=(numE-1)*(numD-1)
	p=pchisq(chisqr,df)
	
	 
	
	
	with(cmdObj)
	{
	for ( i=1; i<data.length; i++)
			 {  
			   tableAsHTML(i)   //Show a table for each stratum (currently only one)
			 }  
			 newtable(6,90);
			 //6 columns and 90 pixels per column
			 newrow()
			 //blank line
			 newrow()
			 //blank line
			
			 //Title goes across all cellvals.  Text can have HTML tags that make it
			 //bold or give it particular styles.  These are optional.  Be sure to
			 //include a closing tag for each one.
			 
			 title("<h3>Chi Square for R by C Table</h3>");
			 line(6);
			 
	newrow("","span3:c:Chi Square=","l:"+SigFigNo(chisqr,4))
	newrow("","span3:c:Degrees of Freedom=","l:"+df)
	newrow("","span3:c:p-value=","l:"+p)
	
	
	
	
	
	newrow()
	newrow("","span5:Cochran recommends accepting the chi square if::")
	newrow("","span4:1. No more than 20% of cells have expected < 5.")
	newrow("","span4:2. No cell has an expected value < 1.")
	newrow();
	newrow("span2:r:In this table::")
	expunder5percent=Math.round(100*expunder5/(numE*numD))
	if (expunder5percent==0){expunder5percent="None"} else {expunder5percent+="%"}
	newrow("","span4:"+expunder5percent+" of "+(numE*numD)+" cells  have expected values < 5.")
	if (expunder1==0) {expunder1="No"}
	newrow("","span4:"+expunder1+" cells have expected values < 1.")
	newrow()
	if ( ((expunder5/(numE*numD))>0.20) || (expunder1>0))
	  {
	  newrow("","span5:This table DOES NOT MEET Cochran's criteria.")
	  }
	else
	  {
	  newrow("","span5:Using these criteria, this chi square can be accepted.")
	  } 
	newrow() 
	newrow("","span6:Expected value = row total*column total/grand total")
	newrow()  
	newrow("","span6:Rosner, B. Fundamentals of Biostatistics. 5th ed. Duxbury Thompson Learning. 2000; p. 395")
	endtable();  
 }
}
}
/*
function BinP(N,p,x1,x2) 
{
    var q=p/(1-p); var k=0; var v = 1; var s=0; var tot=0
    while(k<=N) {
        tot=tot+v
        if(k>=x1 & k<=x2) { s=s+v }
        if(tot>1e30){s=s/1e30; tot=tot/1e30; v=v/1e30}
        k=k+1; v=v*q*(N+1-k)/k
        }
    return s/tot
}


function Fmt(x) 
{ 
var v
if(x>0) { v=''+(x+0.00000001) } else { v=''+(x-0.00000000) };
return v.substring(0,v.indexOf('.')+8)
}
*/