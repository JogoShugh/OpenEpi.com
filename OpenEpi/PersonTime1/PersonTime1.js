// JavaScript Document
<!-- hide this script tag's contents from old browsers
//This program is based on one developed by John C. Pezzullo, johnp71@aol.com, Interactive Statistics page
//Modifications were by Kevin Sullivan, cdckms@sph.emory.edu 
//

//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="Single Person-Time Rate";

var Authors="<b>Statistics</b>"+
"<br>Kevin M. Sullivan, Emory University<br>"+
"based on code from John C. Pezzullo<br>"+
"<b>Interface</b><br>"+
"Andrew G. Dean, EpiInformatics.com, "+
"and Roger A. Mir<br>";
    
    
var Description="The PersonTime1 module of Open Epi is used to analyze data based "+
"on length of exposure, persons exposed, and a count of the event being "+
"measured. This method of analysis is frequently used in cohort studies "+
"and clinical trials.  Person time "+
"is frequently expressed in person-years, although person-hours, days, "+
"or months will work just as well. Results include the rate per 100 person-time "+
"units and confidence limits using several methods.<br>";
var halfadded=t("0.5 has been added to each cell for calculations" );
var numnotless=t( "Numerator cannot be less than zero");
var denomnotless=t("Denominator cannot be less than zero" );    
	
//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="Suppose that there were 66 cases of cancer during 2098 years of experience in a specified environment.  What are the confidence limits for this estimate? "+      
	  "<ul>"+
	    "<li>Enter the numbers or click 'Load Demo Data'.  </li>"+
		"<li>The rate of 3.146 per hundred person years has 95% confidence limits of 2.387 and 3.905. </li>"+
      "</ul>";

var Exercises="Suppose that a rare disease is experienced twice in 209800 person-years of exposure. "+ 
	  "<ul>"+
	  "<li>What are the rate and appropriate 95% confidence limits? </li>"+
	  "<li>What are some important factors to consider in interpreting person-time rates?  Hint: What are the most important risk factors for many cancers?</li>"+
      "</ul>";
    
function CalcStats(outTable) 
{
	var zL; var vx;var vN;var vP; var vPL; var vPU;var vWL; var vWU;
    var added05 = 0;
    var ptunit=1;   //Units in which to express the results
	
   a  = parseFloat(outTable.data[1]["E0D0"]);
   //alert("a="+a);
   b  = parseFloat(outTable.data[1]["E1D0"]);
   //alert("b="+b);
  
   
    if ((a == 0) || (b == 0)) 
    {
    added05 = 1;
    a = a + 0.5;
    b = b + 0.5;
    EntryWin.infoDialog (halfadded);
    }
      
    var vx = eval(a)
    var vN = eval(b)
    if (vx < 0) {
      EntryWin.infoDialog (numnotless);
      return;
    }
    if (vN < 0) {
      EntryWin.infoDialog (denomnotless );
      return;
    }
    var vP = vx/vN;
  
	// to set person-time unit value; 10 persontime or 100 pt or so on;
	var rate=vP
	while (rate < 1)
    { 
      rate*=10;
	  ptunit*=10;
    }
	//alert ("ptunit="+ptunit)
	
	
	// Reading setting of confidence interval from main menu or from individual dialog for data entry;
	var cscrit=cscritFromOEConfLevel(ConfLevel);
	var zL=Math.sqrt(cscrit);
	var zU=Math.sqrt(cscrit);
	
	//---------------------------****************************************--------------------------;
	
	
	// to compute Title ---% Confidence Interval;
	//alert("cscript"+cscrit);
	var ci=0;
	if (cscrit==2.706) {ci=90};
	if (cscrit==3.841) {ci=95};
	if (cscrit==6.635) {ci=99};
	if (cscrit==10.828) {ci=99.9};
	if (cscrit==15.137) {ci=99.99};
	
				
		
// ----------------------------Mid-P test--------------------------------;
// Lower tail;

	 if (cscrit=="15.137") {var v=0.5; var dv=0.5; var vTL=0.005; var p=vTL/100;}
     //if (cscrit=="13.831") {var v=0.5; var dv=0.5; var vTL=0.01; var p=vTL/100;}
     //if (cscrit=="12.116") {var v=0.5; var dv=0.5; var vTL=0.025; var p=vTL/100;}
     if (cscrit=="10.828") {var v=0.5; var dv=0.5; var vTL=0.05; var p=vTL/100;}
     //if (cscrit=="9.550") {var v=0.5; var dv=0.5; var vTL=0.1; var p=vTL/100;}
     //if (cscrit=="7.879") {var v=0.5; var dv=0.5; var vTL=0.25; var p=vTL/100;}
     if (cscrit=="6.635") {var v=0.5; var dv=0.5; var vTL=0.5; var p=vTL/100;}
     //if (cscrit=="5.412") {var v=0.5; var dv=0.5; var vTL=1; var p=vTL/100;}
     if (cscrit=="3.841") {var v=0.5; var dv=0.5; var vTL=2.5; var p=vTL/100;}
     if (cscrit=="2.706") {var v=0.5; var dv=0.5; var vTL=5; var p=vTL/100;}
     /*if (cscrit=="2.072") {var v=0.5; var dv=0.5; var vTL=7.5; var p=vTL/100;}
     if (cscrit=="1.642") {var v=0.5; var dv=0.5; var vTL=10; var p=vTL/100;}
     if (cscrit=="1.323") {var v=0.5; var dv=0.5; var vTL=12.5; var p=vTL/100;}
     if (cscrit=="1.074") {var v=0.5; var dv=0.5; var vTL=15; var p=vTL/100;}
	 if (cscrit=="0.873") {var v=0.5; var dv=0.5; var vTL=17.5; var p=vTL/100;}
     if (cscrit=="0.708") {var v=0.5; var dv=0.5; var vTL=20; var p=vTL/100;}
     if (cscrit=="0.571") {var v=0.5; var dv=0.5; var vTL=22.5; var p=vTL/100;}
     if (cscrit=="0.455") {var v=0.5; var dv=0.5; var vTL=25; var p=vTL/100;}
     if (cscrit=="0.357") {var v=0.5; var dv=0.5; var vTL=27.5; var p=vTL/100;}
     if (cscrit=="0.275") {var v=0.5; var dv=0.5; var vTL=30; var p=vTL/100;}
     if (cscrit=="0.206") {var v=0.5; var dv=0.5; var vTL=32.5; var p=vTL/100;}
     if (cscrit=="0.148") {var v=0.5; var dv=0.5; var vTL=35; var p=vTL/100;}
     if (cscrit=="0.102") {var v=0.5; var dv=0.5; var vTL=37.5; var p=vTL/100;}
     if (cscrit=="0.064") {var v=0.5; var dv=0.5; var vTL=40; var p=vTL/100;}
	*/
	var vZ = vx;
    while(dv>1e-5) {  dv=dv/2; if ( PoisP((1+vZ)*v/(1-v),vZ+1,1e10) + 0.5*PoisP((1+vZ)*v/(1-v),vZ,vZ) >p)
    { v=v-dv } else { v=v+dv }  }
    var QL= ((1+vZ)*v/(1-v))/vN; //prob of 1,2,3,......Obs events per 1 unit of person-time;
    

// Upper tail;
	 if (cscrit=="15.137") {var v=0.5; var dv=0.5; var vTL=0.005; var p=vTL/100;}
     if (cscrit=="10.828") {var v=0.5; var dv=0.5; var vTL=0.05; var p=vTL/100;}
     if (cscrit=="6.635") {var v=0.5; var dv=0.5; var vTL=0.5; var p=vTL/100;}
     if (cscrit=="3.841") {var v=0.5; var dv=0.5; var vTL=2.5; var p=vTL/100;}
     if (cscrit=="2.706") {var v=0.5; var dv=0.5; var vTL=5; var p=vTL/100;}

	 var vZ = vx;
	 while(dv>1e-5) { dv=dv/2; if  (  PoisP((1+vZ)*v/(1-v),0,vZ-1)  +  0.5*PoisP((1+vZ)*v/(1-v),vZ,vZ) <p)
     { v=v-dv } else { v=v+dv } }
     var QU = ((1+vZ)*v/(1-v))/vN; 
 


// ----------------------------------Fisher's exact test---------------------------;
	// Lower tail;
	 if (cscrit=="15.137") {var v=0.5; var dv=0.5; var vTL=0.005; var p=vTL/100;}
     if (cscrit=="10.828") {var v=0.5; var dv=0.5; var vTL=0.05; var p=vTL/100;}
     if (cscrit=="6.635") {var v=0.5; var dv=0.5; var vTL=0.5; var p=vTL/100;}
     if (cscrit=="3.841") {var v=0.5; var dv=0.5; var vTL=2.5; var p=vTL/100;}
     if (cscrit=="2.706") {var v=0.5; var dv=0.5; var vTL=5; var p=vTL/100;}
	 	 
	 var vZ = vx;
     while(dv>1e-5) {  dv=dv/2; if(PoisP((1+vZ)*v/(1-v),vZ,1e10)>p) { v=v-dv } else { v=v+dv }  }
     var QL3= ((1+vZ)*v/(1-v))/vN;
         
    // Upper tail;
     if (cscrit=="15.137") {var v=0.5; var dv=0.5; var vTL=0.005; var p=vTL/100;}
     if (cscrit=="10.828") {var v=0.5; var dv=0.5; var vTL=0.05; var p=vTL/100;}
     if (cscrit=="6.635") {var v=0.5; var dv=0.5; var vTL=0.5; var p=vTL/100;}
     if (cscrit=="3.841") {var v=0.5; var dv=0.5; var vTL=2.5; var p=vTL/100;}
     if (cscrit=="2.706") {var v=0.5; var dv=0.5; var vTL=5; var p=vTL/100;}
	 
	 while(dv>1e-5) { dv=dv/2; if(PoisP((1+vZ)*v/(1-v),0,vZ)<p) { v=v-dv } else { v=v+dv } }
     var QU3 = ((1+vZ)*v/(1-v))/vN; 
	 
//---------------------------------------------------------------------------------------------------;
    
	//Normal approximation;	  
		zL=Math.sqrt(cscrit);
	   	var vPL = vP - zL * Math.sqrt(vx / (vN*vN));
    	if (vPL < 0) vPL = 0;
    	var vPU = vP + zL * Math.sqrt(vx / (vN*vN));
	
	
	//Byar;
		var vWL = vx * Math.pow((1 - (1 / (9 * vx)) - ((zL / 3)* Math.sqrt(1 / vx))),3) / vN;
		if (vWL < 0) vWL = 0;
		var vWU = (vx + 1) * Math.pow((1 - (1 / (9 * (vx + 1))) + ((zL / 3)* Math.sqrt(1 / (vx + 1)))),3) / vN;
			
			
		
	//As described in Rothman and Greenland text
		 var vWL1 = Math.exp(Math.log(vP) - zL * (1 / Math.sqrt(vx)))
		 var vWU1 = Math.exp(Math.log(vP) + zL * (1 / Math.sqrt(vx)))
	
	
		
	with (outTable)
	{   
	    newtable(6,90);
	    title("<h3>Person-Time Rate and " +ci+ "% Confidence Intervals</h3>");
		var unithead=t("Per")+" "+ptunit+" "+t("Person-Time Units");
        newrow("span6:bold:c:"+"<font color=#ff0000><h3>"+unithead+"</h3></font>");
		
		line(6);
        newrow("span2:","r:span2:Number of cases::",a,"");
        newrow("span2:","r:span2:Person-Time::",b,"");
        line(6);
        newrow("<br>");
      
		newrow("span2:","c:bold:Lower CL", "c:bold:Rate", "c:bold:Upper CL")
		line(6);
		
		//Mid-P;
		newrow("span2:"+editorschoice+"Mid-P exact test:", fmtSigFig(QL,4,ptunit), fmtSigFig(vP,4,ptunit), fmtSigFig(QU,4,ptunit))	
		
		//Fisher exact;
		newrow("span2:Fisher's exact test:", fmtSigFig(QL3,4,ptunit), "", fmtSigFig(QU3,4,ptunit))	
				
		//Normal approximation;
		newrow("span2:Normal approximation:", fmtSigFig(vPL,4,ptunit), "", fmtSigFig(vPU,4,ptunit))	
		
		//Byar;
		newrow("span2:Byar approx. Poisson:", fmtSigFig(vWL,4,ptunit), "", fmtSigFig(vWU,4,ptunit))
		//As described in Rothman and Greenland text
		newrow("span2:Rothman/Greenland:", fmtSigFig(vWL1,4,ptunit),"", fmtSigFig(vWU1,4,ptunit))
		line(6)
		
		newrow("span6:"+editorschoice+"LookFirst items:: Editor\'s choice of items to examine first.");
		newrow()
		
		newrow("span6:&quot;Mid-P exact test&quot; using Miettinen's (1974d) modification, as described in Epidemiologic Analysis with a Programmable Calculator, 1979.")		
		newrow("span6:&quot;Fisher's exact test&quot; based on the formula (Armitage,1971; Snedecor & Cochran,1965) as described in Epidemiologic Analysis with a Programmable Calculator, 1979.")
		newrow("span6:&quot;Normal approximation&quot; to the Poisson distribution as described by Rosner, Fundamentals of Biostatistics (5th Ed).")		
		newrow("span6:&quot;Byar approx. Poisson&quot; as described in Rothman and Boice, Epidemiologic Analysis with a Programmable Calculator, 1979.")		
		newrow("span6:&quot;Rothman/Greenland&quot; as described in Rothman and Greenland, Modern Epidemiology (2nd Ed).")			
        newrow() 
		endtable();
    }
}

function csq(o,e) {
   if(e==0) { return 0 }
   var x=Math.abs(o-e)-0.5; if(x<0) { return 0 }
   return x*x/e
}

//Poisson iteration;
function PoisP(Z,x1,x2) {
    var q=1; var tot=0; var s=0; var k=0
    while(k<Z || q>(tot*1e-10)) {
        tot=tot+q
        if(k>=x1 & k<=x2) { s=s+q }
       if(tot>1e30){s=s/1e30; tot=tot/1e30; q=q/1e30}
        k=k+1; q=q*Z/k
        }
    return s/tot
}

function Fmt(x) { 
   var v
   if(x>0) { v=''+(x+0.00000001) } else { v=''+(x-0.00000000) };
   return v.substring(0,v.indexOf('.')+8)
}

//end of script