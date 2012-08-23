// JavaScript Document
//Here is the text that goes on the first page of the application, the one presented by running the HTM.
//if (opener) {var t=opener.t}
var Title="Proportion<br>Confidence Limits for a Single Proportion";
var Authors="<b>Statistics</b><br>Kevin M. Sullivan, Emory University<br>";
    Authors+= "based on code from John C. Pezzullo<br>"
    Authors+="<b>Interface</b><br>";
    Authors+="Andrew G. Dean, EpiInformatics.com, and Roger Mir<br>";
var Description="<p>This module provides confidence limits "
    Description+="for simple (binomial) proportions. Entering a numerator and denominator "
    Description+="produces confidence limits calculated by several different methods."
    Description+=" The numerator must be smaller than the denominator and both must be positive "
    Description+="numbers.</p>"

//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="A simple random or systematic sample survey in a state asked respondents, 'Have you ever been told by a doctor that you have diabetes?' Among 6153 respondents 418 answered 'yes' (excluding those with diabetes solely related to pregnancy). "+      
	  "<ul>"+
	    "<li>To find the percentage of respondents answering Yes, and 95% confidence limits, enter the numerator and denominator into the OpenEpi Proportion program and click Calculate.</li>"+
		"<li>The point estimate is 6.79% and the preferred (Wilson score) 95% confidence limits are 6.19% to 7.45%.</li>"+
      "</ul>";

var Exercises="Pretend that the survey was smaller but found nearly the same percentage (42/616, or even 4/58)." + 
	  "<ul>"+
	  "<li>Find the confidence intervals for these two proportions. </li>"+
      "<li>What does a smaller sample do to the confidence interval?</li>"+
      "</ul>";
	  
//Error messages, placed here for translation, since they will rarely be displayed
var numnotless=t( "Numerator cannot be less than zero");
var denomnotless=t("Denominator cannot be less than zero" );
var numnotlarger=t("Numerator cannot be larger than the denominator" );

function doStatistics(cmdObj)
{
//This is the main statistical routine.  Results are accumulated in cmdObj.s, an HTML string that is later displayed
//by the calling page.

// To see the structure of the data
//array, uncomment the following 3 lines and run the program:

//EntryWin.writeTable(cmdObj.data)
//alert("This is the data array, ready for programming in the statistical routine.")
//return  //exits from OECalculate

//Remove the comment from the 3 lines above to see a table of the contents of the data array
//so that the correct correspondence between the data array and your stats routine
//can be set up below.

 //The next two lines illustrate how to get input from the user after the Calculate button is clicked.  They 
 //are not used in the Proportion example.
 //var casecontrol= !(EntryWin.okCancelDialog("Show all results?\n(Cancel to limit to case-control study.)"));
 //EntryWin.timerStart();  //Restart the processing timer, since modal dialog above takes time.

//In this section, write some code to extract the needed data from the standard
//data array produced by the data input module.  Strata have indices starting with
// 1, and table cells begin with the baseline (e.g., 0 or "no") values in the upper
// left, in the "E0D0" cell.  Exposure is represented on the left margin and Disease
// at the top, if this distinction is meaningful.  

//In this section, write some code to extract the needed data from the standard
//data array produced by the data input module.  Strata have indices starting with
// 1, and table cells begin with the baseline (e.g., 0 or "no") values in the upper
// left, in the "E0D0" cell.  Exposure is represented on the left margin and Disease
// at the top, if this distinction is meaningful.  
// For a simple proportion, the translation is easy:

		vx=parseFloat(cmdObj.data[1]["E0D0"]);
		
		//vx is the numerator
		
		vN = parseFloat(cmdObj.data[1]["E1D0"]);

        multiplier = parseFloat(cmdObj.data[1]["E2D0"]);
        pop= parseFloat(cmdObj.data[1]["E3D0"]);
        compareWith = parseFloat(cmdObj.data[1]["E4D0"]);
		
		//vN is the denominator
 //Define a table.  You can included extra columns to help with the formatting
	   //and then use the span property to combine several cells and make a wider one.
	   CalcBin();

function CalcBin() {
	//var vTL=2.5; var zL=1.96; var vTU=2.5; var zU=1.96; var vCL=95
 
	
    if (vx < 0) {
      alert(numnotless);
      return;
    }
    if (vN < 0) {
      alert(denomnotless);
      return;
    }
    if (vx > vN) {
      alert(numnotlarger);
      return;
    }
	
    var vP = vx/vN
	
	var npq=vN * vP * (1 - vP)
  
  
  
  //------------------------------------------adapted from Prototypes--------------------------;
  	
	var cscrit=cscritFromOEConfLevel(ConfLevel);
	zL=Math.sqrt(cscrit);
	//alert("CI--z "+zL);
  	
  	var zL = Math.sqrt(cscrit); 
	var zU= zL;
	var zsquare=Math.pow(zL,2);
	
	    
    //wald (normal approximation);
    var vPL = vP-zL*Math.sqrt(vP*(1-vP)/vN)
    if (vPL < 0) vPL = 0;
    var vPU = vP+zU*Math.sqrt(vP*(1-vP)/vN)
    if (vPU > 1) vPU = 1;
    
    
    
    //modified wald;
    var vPP = (vx+zsquare*.5)/(vN+zsquare);
    var vWL = vPP-zL*Math.sqrt(vPP*(1-vPP)/(vN+zsquare));
    if (vWL < 0) vWL = 0;
    var vWU = vPP+zU*Math.sqrt(vPP*(1-vPP)/(vN+zsquare));
    if (vWU > 1) vWU = 1;
    
    
        
    //score method, also known as Wilson's method;
    if (vP == 0) var vSL = 0;
    else var vSL = (vN/(vN+zsquare))*((vP+(zsquare/(2*vN)))- zL*Math.sqrt(((vx*(vN-vx)/(vN*vN*vN))+(zsquare/(4*vN*vN)))));
    if (vP == 1) var vSU = 1;
    else var vSU = (vN/(vN+zsquare))*((vP+(zsquare/(2*vN)))+ zU*Math.sqrt(((vx*(vN-vx)/(vN*vN*vN))+(zsquare/(4*vN*vN)))));
    
    
    
    
    //Score with continuity correction, Fleiss Quadratic method;
    if (vP == 0) var vSCL = 0;
    else var vSCL = ((2 * vN * vP + zsquare - 1) - zL * Math.sqrt(zsquare - (2 + 1 / vN)+ 4 * vP * (vN * (1 - vP) + 1))) / (2 * (vN + zsquare))
    if (vP ==1 ) var vSCU = 1;
    else var vSCU = ((2 * vN * vP + zsquare + 1) + zU * Math.sqrt(zsquare + (2 - 1 / vN)+ 4 * vP * (vN * (1 - vP) - 1))) / (2 * (vN + zsquare))

    

    
    
    //Fisher exact method;
    if (cscrit==15.137) var prob=99.99
    //else if (cscrit==13.831 ) var prob= 99.98 
    //else if (cscrit==12.116 ) var prob=99.95
    else if (cscrit==10.828) var prob=99.9
    //else if (cscrit==9.550) var prob=99.8
    //else if (cscrit==7.879) var prob=99.5 
    else if (cscrit==6.635) var prob=99 
    //else if (cscrit==5.412) var prob=98
    else if (cscrit==3.841) var prob=95
    else if (cscrit==2.706) var prob=90
    /*else if (cscrit==2.072) var prob=85
    else if (cscrit==1.642) var prob=80 
    else if (cscrit==1.323) var prob=75 
    else if (cscrit==1.074) var prob=70 
    else if (cscrit==0.873) var prob=65 
    else if (cscrit==0.708) var prob=60 
    else if (cscrit==0.571) var prob=55 
    else if (cscrit==0.455) var prob=50 
    else if (cscrit==0.357) var prob=45 
    else if (cscrit==0.275) var prob=40 
    else if (cscrit==0.206) var prob=35 
    else if (cscrit==0.148) var prob=30 
    else if (cscrit==0.102) var prob=25
    else if (cscrit==0.064) var prob=20*/
     
    var vTL= ((100-prob)/2);
    var vTU= vTL;
	
    if (vx==0) { var DL = 0 } 
	else
        { var v=vP/2; vsL=0; vsH=vP; var p=vTL/100
        while((vsH-vsL)>1e-5) { if (  BinP(vN,v,vx,vN) >p ) { vsH=v; v=(vsL+v)/2} else { vsL=v; v=(vsH+v)/2 } };
        var DL = (v);
        }
        
    if (vx==vN) { var DU = 0 } 
	else
        { var v=(1+vP)/2; vsL=vP; vsH=1; var p=vTU/100
        while((vsH-vsL)>1e-5) { if(BinP(vN,v,0,vx) <p) { vsH=v; v=(vsL+v)/2 } else { vsL=v; v=(vsH+v)/2 } };
        var DU = (v);
        }
        
    
    //mid-P test;
    if (vx==0) 	{ var T1 = 0 } 
	else
        { var v=vP/2; vsL=0; vsH=vP; var p=vTL/100
        while((vsH-vsL)>1e-5) { if (  BinP(vN,v,vx,vx)*0.5  +  BinP(vN,v,vx+1,vN)  >p ) { vsH=v; v=(vsL+v)/2} else { vsL=v; v=(vsH+v)/2 } };
        var T1 = (v);
       }
        
    if (vx==vN)  { var T2 = 0 } else
        { var v=(1+vP)/2; vsL=vP; vsH=1; var p=vTU/100
        while((vsH-vsL)>1e-5) { if(  BinP(vN,v,vx,vx)*0.5  +   BinP(vN,v,0,vx-1)  <p) { vsH=v; v=(vsL+v)/2 } else { vsL=v; v=(vsH+v)/2 } };
        var T2 = (v);
        }
     //One-Sample test for binomial proportion--normal theory (two-sided alternative)
     compareWith=compareWith/multiplier;
     var zValue=  ((vx/vN) - compareWith) / Math.sqrt(compareWith*(1-compareWith)/vN);
     var twoSidedP;
         if (zValue>=0)
             {twoSidedP=2*pnorm(zValue,true)}
         else
             {twoSidedP=2*pnorm(zValue,false)}     ;

     // alert("p upper for z of "+zValue+" "+ pnorm(zValue,true) )
     // alert("2xp not upper for z of "+zValue+"= "+ 2*pnorm(zValue,false) )
     // alert("p upper for z of 1-"+zValue+" "+ pnorm(1-zValue,true) )
     // alert("p not upper for z of 1-"+zValue+" "+ pnorm(1-zValue,false) )
/* ----------------------------------original coding syntax----------------------------------------------;
    //score method, also known as Wilson's method;  This is the preferred method for large and small numbers
	var pcl=proportion95CL(vx,vN,"Wilson");  //Call function in StatFunctions1.js module
	vSL=pcl[1];
	vSU=pcl[2];
	/*
    if (vP == 0) var vSL = 0;
    else var vSL = (vN/(vN+3.8416))*((vP+(3.8416/(2*vN)))-1.96*Math.sqrt(((vx*(vN-vx)/(vN*vN*vN))+(3.8416/(4*vN*vN)))));
    if (vP == 1) var vSU = 1;
    else var vSU = (vN/(vN+3.8416))*((vP+(3.8416/(2*vN)))+1.96*Math.sqrt(((vx*(vN-vx)/(vN*vN*vN))+(3.8416/(4*vN*vN)))));
    */
	
/* 
  if (vN<30001)
  {
	  
	//wald (normal approximation;
    var vPL = vP-zL*Math.sqrt(vP*(1-vP)/vN)
    if (vPL < 0) vPL = 0;
    var vPU = vP+zU*Math.sqrt(vP*(1-vP)/vN)
    if (vPU > 1) vPU = 1;
	
    //modified wald;
    var vPP = (vx+1.9208)/(vN+3.8416);
    var vWL = vPP-zL*Math.sqrt(vPP*(1-vPP)/(vN+3.8416));
    if (vWL < 0) vWL = 0;
    var vWU = vPP+zL*Math.sqrt(vPP*(1-vPP)/(vN+3.8416));
    if (vWU > 1) vWU = 1;
	
	//Score with continuity correction, Fleiss Quadratic method;
	var pcl=proportion95CL(vx,vN,"Fleiss");  //Call function in StatFunctions1.js module
	vSCL=pcl[1];
	vSCU=pcl[2];
	/*
    if (vP == 0) var vSCL = 0;
    else var vSCL = ((2 * vN * vP + 3.8416 - 1) - 1.96 * Math.sqrt(3.8416 - (2 + 1 / vN)+ 4 * vP * (vN * (1 - vP) + 1))) / (2 * (vN + 3.8416))
    if (vP ==1 ) var vSCU = 1;
    else var vSCU = ((2 * vN * vP + 3.8416 + 1) + 1.96 * Math.sqrt(3.8416 + (2 - 1 / vN)+ 4 * vP * (vN * (1 - vP) - 1))) / (2 * (vN + 3.8416))
    */
/*  
	//Fisher exact method;
	var DU=null;
	var DL=null;
	//var F;	
    var v=vP/2; vsL=0; vsH=vP; var p=vTL/100
    while((vsH-vsL)>1e-5) 
	   { 
	     if(BinP(vN,v,vx,vN)>p) 
		    { 
			  vsH=v; 
			  v=(vsL+v)/2; 
			} 
		  else 
		    { 
			vsL=v; 
			v=(v+vsH)/2; 
			} 
	    }
    DL = Fmt(v);
    var v=(1+vP)/2; 
	vsL=vP; 
	vsH=1; 
	var p=vTU/100;
    while((vsH-vsL)>1e-5) 
	  { if(BinP(vN,v,0,vx)<p) { vsH=v; v=(vsL+v)/2 } else { vsL=v; v=(v+vsH)/2 } }
    DU = Fmt(v)
	
}
*/



	if (vx==0) 
	  {
		 vP=0.0  //Special case 
	  }  
	if (vx==vN) 
	  {
		 vP=1.0  //Special case 
	  }  
	
	
	
with (cmdObj)
	{   
	    //Use the functions of cmdObj to construct the HTML output page, which is accumulated as cmdObj.s
		newtable(5,100);
		 //6 columns and 120 pixels per column
	   //	newrow()
		//blank line

	 //	title("<h2>" + "Results" + "</h2>");
		 //Title goes across all cells.  Text can have HTML tags that make it
		 //bold or give it particular styles.  These are optional.  Be sure to
		 //include a closing tag for each one.
	  //	line(5);
	  //	title("<h2>"+ prob+"% Confidence Limits for Proportion "+"nt("+ vx + "/" + vN + ")</h2>");
	   	newrow("bold:span5:c:"+ prob+"% Confidence Limits for Proportion "+"nt("+ vx + "/" + vN + ")");
	//line(5);
		newrow("bold:span5:c:Multiplier="+ multiplier);
        //newrow("bold:span5:c:Corrected for population size "+pop);
        newrow("bold:span5:c:Not corrected for population size ");

	   // newrow("span2:","bold:Lower CL", "bold:Upper CL")
       // if (multiplier==100)
       //    {per="%"}
       // else
        //   {per=multiplier}
        newrow("span1:","c:bold:Lower CL","c:bold:Per "+multiplier ,"c:bold:Upper CL");
        newrow("span2:Proportion x "+multiplier,fmtSigFig(vP,6,multiplier));
		if (typeof(DL)!="undefined")
		{		   
		newrow("span1:Mid-P Exact",fmtSigFig(T1,4,multiplier),"",fmtSigFig(T2,4,multiplier));
		}
	    if (typeof(DL)!="undefined")
		{		   
		newrow("span1:Fisher Exact(Clopper-Pearson)",fmtSigFig(DL,4,multiplier),"",fmtSigFig(DU,4,multiplier));
		}
		if (typeof(vPL)!="undefined")
		{
		newrow("Wald (Normal Approx.)",fmtSigFig(vPL,4,multiplier),"",fmtSigFig(vPU,4,multiplier));
		}
		if (typeof(vWL) !="undefined")
		{
		newrow("span1:Modified Wald(Agresti-Coull)",fmtSigFig(vWL,4,multiplier),"",fmtSigFig(vWU,4,multiplier));
		}
		if (typeof(vSL)!="undefined")
		{   
		    var WilsonL=fmtSigFig(vSL,4,multiplier);
		    if (vSL>0.9999)
			  {
				WilsonL="99.99+%"; //Special case 
			  }
			newrow("span1:"+editorschoice+"Score(Wilson)*",WilsonL,"",fmtSigFig(vSU,4,multiplier));
		}
		if (typeof(vSCL)!="undefined")
		{
		newrow("span1:Score with Continuity");
		newrow("span1:Correction (Fleiss Quadratic)",fmtSigFig(vSCL,4,multiplier),"",fmtSigFig(vSCU,4,multiplier));
		}

        if (typeof(vPL)!="undefined")
		{
		if (npq < 5)
		  {
		  newrow("span5:The npq of " + fmtSigFig(npq,4)+" is \<5. The Wald method is not recommended.");
		  }
		}
        newrow("span6:"+editorschoice+"*LookFirst items:: Editor\'s choice of items to examine first.");

        newrow();
        if (typeof(zValue!="undefined"))
        {
          newrow("span5:c:One-Sample Test for Binomial Proportion, Normal-Theory Method");
          newrow("span5:c:Does "+fmtSigFig(vP,4)+" proportion differ from "+fmtSigFig(compareWith,4)+"?")
          newrow("span5:c:z-value = "+fmtSigFig(zValue,4));
          newrow("span5:c:Two-sided p-value="+fmtPValue(twoSidedP));
        }
	     //Tell output that we are done
		endtable();
	} //end with(cmdObj)
 }

function BinP(N,p,x1,x2) {
    var q=p/(1-p); var k=0; var v = 1; var s=0; var tot=0
    while(k<=N) {
        tot=tot+v
        if(k>=x1 & k<=x2) { s=s+v }
        if(tot>1e30){s=s/1e30; tot=tot/1e30; v=v/1e30}
        k=k+1; v=v*q*(N+1-k)/k
        }
    return s/tot
    }


}  //End of doStatistics