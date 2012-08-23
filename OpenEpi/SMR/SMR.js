// JavaScript Document
<!-- hide this script tag's contents from old browsers
//This program is based on one developed by John C. Pezzullo, johnp71@aol.com, Interactive Statistics page
//Modifications were by Kevin Sullivan, cdckms@sph.emory.edu 
//

//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="Standardized Mortality Ratio";

var Authors="<b>Statistics</b>"+
"<br>Minn M. Soe and Kevin M. Sullivan, Emory University<br>"+

"<b>Interface</b><br>"+
"Andrew G. Dean, EpiInformatics.com, "+
"and Roger A. Mir<br>";
    
    
var Description="The Standardized Mortality Ratio (SMR) is the ratio of observed to the expected number of deaths " +
"in the study population under the assumption that the mortality rates for the study population are the same as those for the general population. "+
"For nonfatal conditions, the Standardized Mortality Ratio is sometimes known as the Standardized Morbidity Ratio. Entering observed and expected number of cases (deaths) will result in the point estimate of SMR and the confidence intervals at the user's setting."


//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link

var Demo="In a rubber worker study, a group of 8418 white male workers ages 40-84 (either active or retired) on January 1, 1964, were followed for 10 years for various mortality outcomes. Their mortality rates were then compared with US while male mortality rates in 1968. In one of the reported findings, 4 observed deaths due to Hodjkin's disease were compared with 3.3 deaths expected from US cancer mortality rates. Is this difference significant? Evaluate the statistical significance of the results."+
	  	"<ul>"+
	    	"<li>To answer the question, enter the observed and expected numbers deaths in the respective data entry cells, and click on Calculate</li>"+
			"<li>In the new window screen, two-tailed p-value based on Exact method is 0.8393 with confidence intervals that include null value '1'. Therefore, the mortality rates are similar and there is no significant excess or deficit of Hodgkin's disease in this population.</li>"+
      	"</ul>"+
		"Reference: Bernard Rosner. Fundamentals of Biostatistics(5th edition). (Data obtained from example 7.50; page 255).";

var Exercises="Not yet available";
/*
var Exercises="Suppose that a rare disease is experienced twice in 209800 person-years of exposure. "+ 
	  "<ul>"+
	  "<li>What are the rate and appropriate 95% confidence limits? </li>"+
	  "<li>What are some important factors to consider in interpreting person-time rates?  Hint: What are the most important risk factors for many cancers?</li>"+
      "</ul>";
 */




function CalcStats(outTable) 
{
	var zL; var vx;var vN;var vP; var vPL; var vPU;var vWL; var vWU; var x2;
    //var added05 = 0;
    	
  	a  = parseFloat(outTable.data[1]["E0D0"]);
	//alert("a="+a);
  	b  = parseFloat(outTable.data[1]["E1D0"]);
  
    if (a == 0|| b==0) {
		alert("At least one of the cells has missing value");
		return}; 
          
    var vx = eval(a)
    var vN = eval(b)
   
  
  	//	to simply calculate SMR (point estimate);
    var ratio = vx/vN;
	//alert("ratio"+ratio);
	
   	//---------------Significance tests------------------------------------;
	// p-value for hypothesis of association;
	// chi-square test;
    cs=(vx - vN) * (vx - vN) / vN;
	cs_pvalue = ChiSq(cs, 1);
	//if(cs>10.83) cs_pvalue="<0.001";
	
	
	//Byar method approximation;
	if (vx>vN) {vx=vx}
	else {vx=vx+1};
	var x2=(Math.sqrt(9*vx))* ( 1 - 1/(9*vx) - Math.pow(vN/vx,1/3) );
    var x2_pvalue=Norm(x2);
	//alert(x2+"pvalue"+x3);
	
	
//Fisher's exact test for poisson distribution ; 
        var e=2.718281828459045235; var expect; var k;var p_value; var total=0; var 
subtotal=0; 
        var Obs=vx; var Exp=vN; 

if (Obs>=Exp) { 
        var k=Obs-1; 
        while (k>=0) { 
        var numerator=Math.pow(e,-Exp)*Math.pow(Exp,k); 
        //alert("numerator"+numerator); 
        var kk=k; 
        var denom=1; 
        while (kk>0) {denom=denom*kk; kk=kk-1}; //calculate the value of a factorial; 
        //alert("denominator"+denom); 
        var subtotal=numerator/denom; 
        //alert("subtotal"+subtotal); 
        total=total+subtotal; 
        k=k-1; 
        } 
        p_value=2*(1-total); 
} 

if (Obs<Exp) { 
        var k=Obs-1; 
        while (k>=0) { 
        var numerator=Math.pow(e,-Exp)*Math.pow(Exp,k); 
        //alert("numerator"+numerator); 
        var kk=k; 
        var denom=1; 
        while (kk>0) {denom=denom*kk; kk=kk-1}; //calculate the value of a factorial; 
        //alert("denominator"+denom); 
        var subtotal=numerator/denom; 
        //alert("subtotal"+subtotal); 
        total=total+subtotal; 
        k=k-1; 
        } 
        p_value=2*total; 
} 
//alert("exact test P="+p_value); 

	
	
	
	
	// Mid-p exact test for poisson distribution;
	var total1=0;var subtotal1=0;
	var Obs = eval(a)
    var Exp = eval(b)
	
if (Obs<Exp) {	
	//second part of equation;
	var k=Obs-1;
	while (k>=0) {
	var numerator=Math.pow(e,-Exp)*Math.pow(Exp,k);
	//alert("numerator"+numerator);
	var kk=k;
	var denom=1;
	while (kk>0) {denom=denom*kk; kk=kk-1}; //calculate the value of a factorial;
	//alert("denominator"+denom);
	var subtotal1=numerator/denom;
	//alert("subtotal"+subtotal);
	total1=total1+subtotal1;
	k=k-1;
	}
	
	//first part of equation;
	var num; var deno; var i; var aa;
	num=Math.pow(e,-Exp)*Math.pow(Exp,Obs);
	deno=1;
	i=Obs;
	while (i>0) {deno=deno*i; i=i-1}; 
	//alert("denominator "+deno);
	var aa=(num/deno)*0.5;
	
	//combine both parts of equation;
	var MidP=2*(aa+total1);
	//alert("mid-p"+MidP);
}
	
	
if (Obs>=Exp) {
	//second part of equation;
	var k=Obs-1;
	while (k>=0) {
	var numerator=Math.pow(e,-Exp)*Math.pow(Exp,k);
	//alert("numerator"+numerator);
	var kk=k;
	var denom=1;
	while (kk>0) {denom=denom*kk; kk=kk-1}; //calculate the value of a factorial;
	var subtotal1=numerator/denom;
	total1=total1+subtotal1;
	k=k-1;
	}
	
	//first part of equation;
	var num; var deno; var i; var aa;
	num=Math.pow(e,-Exp)*Math.pow(Exp,Obs);
	deno=1;
	i=Obs;
	while (i>0) {deno=deno*i; i=i-1}; 
	var aa=(num/deno)*0.5;
	
	//combine both parts of equation;
	var MidP=2*(1-(aa+total1));
}
	
	
	
	
	
	
	
	
	//-------------------------------------------------CI-----------------------------------------------;
	
	// Reading setting of confidence interval from settings;
	var cscrit=cscritFromOEConfLevel(ConfLevel);
	var zL=Math.sqrt(cscrit);
	var zU=Math.sqrt(cscrit);
	
	// to compute Title ---% Confidence Interval;
	//alert("cscript"+cscrit);
	var ci=0;
	if (cscrit==2.706) {ci=90};
	if (cscrit==3.841) {ci=95};
	if (cscrit==6.635) {ci=99};
	if (cscrit==10.828) {ci=99.9};
	if (cscrit==15.137) {ci=99.99};
	

// Mid-P exact test;
	// Lower tail;
	{var v=0.5; var dv=0.5; var vTL=(100-ci)/2; var p=vTL/100;}
	
	var vZ = Obs;
    while(dv>1e-5) {  dv=dv/2; if ( PoisP((1+vZ)*v/(1-v),vZ+1,1e10) + 0.5*PoisP((1+vZ)*v/(1-v),vZ,vZ) >p)
    { v=v-dv } else { v=v+dv }  }
    var QL= ((1+vZ)*v/(1-v))/Exp;
    
    
    // Upper tail;
    {var v=0.5; var dv=0.5; var vTU=(100-ci)/2; var p=vTU/100;}
	  
    while(dv>1e-5) { dv=dv/2; if  (  PoisP((1+vZ)*v/(1-v),0,vZ-1)    +  0.5*PoisP((1+vZ)*v/(1-v),vZ,vZ) <p)
    { v=v-dv } else { v=v+dv } }
    var QU = ((1+vZ)*v/(1-v))/Exp; 
    //alert("mid-p="+QL+"upper tail"+QU);
	

// Fisher's exact test;
	// Lower tail;
	{var v=0.5; var dv=0.5; var vTL=(100-ci)/2; var p=vTL/100;}
	
	var vZ = Obs;
    while(dv>1e-5) {  dv=dv/2; if(PoisP((1+vZ)*v/(1-v),vZ,1e10)>p) { v=v-dv } else { v=v+dv }  }
    var QL3= ((1+vZ)*v/(1-v))/Exp;
    
    
    // Upper tail;
    {var v=0.5; var dv=0.5; var vTU=(100-ci)/2; var p=vTU/100;}
	  
    while(dv>1e-5) { dv=dv/2; if(PoisP((1+vZ)*v/(1-v),0,vZ)<p) { v=v-dv } else { v=v+dv } }
    var QU3 = ((1+vZ)*v/(1-v))/Exp; 
 //alert("fisher-p="+QL3+"upper tail"+QU3);
 

// Vandenbroucke method
if (ci==95){
	//lower tail;
	QL1=Math.pow((Math.sqrt(Obs) - zL*0.5),2)/Exp;
	
	//Upper tail;
	QU1=Math.pow((Math.sqrt(Obs) + zU*0.5),2)/Exp;
	}
else {	QL1= " ";QU1= ' ';}
	

// Ury and Wiggins method;

if (ci==90 || ci==95|| ci==99){
	//for observation>50;
	if (Obs>50)	{
	//for 99%CI;
	if (ci==99) {QL2= (Obs - (zL*Math.sqrt(Obs))+ 2)/Exp;
				QU2= (Obs + (zL*Math.sqrt(Obs))+ 3)/Exp;}
	if (ci==95) {QL2= (Obs - (zL*Math.sqrt(Obs))+ 1)/Exp;
				QU2= (Obs + (zL*Math.sqrt(Obs))+ 2)/Exp;}
	if (ci==90) {QL2= (Obs - (zL*Math.sqrt(Obs))+ 0.65)/Exp;
				QU2= (Obs + (zL*Math.sqrt(Obs))+ 1.65)/Exp;}
	}
	// for observation <=50;
	else {
	if (ci==99) { QL2= (Obs - (zL*Math.sqrt(Obs))+ 2 )/Exp;
				QU2= (Obs + (zL*Math.sqrt(Obs))+ 3 + 0.1)/Exp;}
	if (ci==95)  {QL2= (Obs - (zL*Math.sqrt(Obs))+ 1 )/Exp;
				QU2= (Obs + (zL*Math.sqrt(Obs))+ 2 + 0.1)/Exp;}
	if (ci==90) {QL2= (Obs - (zL*Math.sqrt(Obs))+ 0.65 )/Exp;
				QU2= (Obs + (zL*Math.sqrt(Obs))+ 1.65 + 0.1)/Exp;}
	}
}
	else {	QL2= " ";QU2= ' ';}
	//alert("vanden-p="+QL1+"upper tail"+QU1);
	//alert("ury-p="+QL2+"upper tail"+QU2);

//Byar method approximation;
    var vPL = ratio * Math.pow(1 - (1/(9 * Obs)) - (zL / (3 * (Math.sqrt(Obs)))),3);
    var vPU = ((Obs + 1)/Exp) * Math.pow(1 - (1/(9 * (Obs + 1))) + (zL / (3 * (Math.sqrt(Obs + 1)))),3);
	//alert("Byar-p="+vPL+"upper tail"+vPU);

//Boice-Monson method approximation;
    var PU = Math.exp( (Math.log(Obs/Exp)) + (zU*(1/Math.sqrt(Obs))) );
    var PL = Math.exp( (Math.log(Obs/Exp)) - (zU*(1/Math.sqrt(Obs))) );
	//alert("Boice-monson-p="+PL+"upper tail"+PU);

		
		
	with (outTable)
	{   
	    newtable(6,90);
	    title("<h3>SMR and " +ci+ "% Confidence Interval</h3>");
				
		line(6);
        newrow("span2:","r:span2:Observed number of cases:",a,"");
        newrow("span2:","r:span2:Expected number of cases:",b,"");
        line(6);
        newrow("<br>");
      	newrow("span2:","c:bold:Statistics", "c:bold:d.f.", "span2:bold:p-value (2 sided)")
		newrow("span2:l:bold:Mid-P exact test:","span1:c:-","span1:c:-",Round(fmtSigFig(MidP,4)));
		newrow("span2:l:bold:Fisher exact test:","span1:c:-","span1:c:-",Round(fmtSigFig(p_value,4)));
		newrow("span2:l:bold:Byar approximation:",Math.abs(fmtSigFig(x2,4)),"span1:c:-",Round(fmtSigFig(x2_pvalue,4))); //to hide negative symbol;
		newrow("span2:l:bold:Chi-square test:",fmtSigFig(cs,4),1,Round(fmtSigFig(cs_pvalue,4)));
		line(6);
		newrow("<br>");
		newrow("span2:","c:bold:Lower CL", "c:bold:SMR", "c:bold:Upper CL")
		newrow("<br>");
		
		//Mid-P;
		newrow("span2:"+editorschoice+"Mid-P exact test:", fmtSigFig(QL,4), fmtSigFig(ratio,4), fmtSigFig(QU,4))	
		
		//Fisher exact;
		newrow("span2:Fisher exact test:", fmtSigFig(QL3,4), "", fmtSigFig(QU3,4))	
		
		//Byar approximation based on Poisson distribution;
		newrow("span2:Byar approximation:", fmtSigFig(vPL,4), "", fmtSigFig(vPU,4))	
		
		//Boice-Monson;
		newrow("span2:Rothman/Greenland method:", fmtSigFig(PL,4), "", fmtSigFig(PU,4))
				
		// Ury and Wiggins method;
		newrow("span2:Ury and Wiggins method:", fmtSigFig(QL2,4), "", fmtSigFig(QU2,4))	
		
		//Vandenbroucke method;
		newrow("span2:Vandenbroucke method:", fmtSigFig(QL1,4), "", fmtSigFig(QU1,4))	
		
		line(6)
		newrow("span6:"+editorschoice+"LookFirst items:: Editor\'s choice of items to examine first.");
		newrow("span6: Exact confidence intervals and p-values should be used when the number of observed deaths is less than or equal to five. For greater numbers of observed deaths, approximation methods are as nearly accurate as exact tests.")
		newrow("span6:'?' = Not available.")			
        newrow("span6:Note..Only 90%, 95% & 99% confidence limits are available in Ury and Wiggins method, and Vandenbroucke method computes 95%CI only.")			
        newrow()
		newrow("span6:&quot;Mid-P exact test&quot; using Miettinen's (1974d) modification, as described in Epidemiologic Analysis with a Programmable Calculator, 1979.")		
		newrow("span6:&quot;Fisher exact test&quot; based on the formula (Armitage,1971; Snedecor & Cochran,1967), as described in Epidemiologic Analysis with a Programmable Calculator, 1979.")
		newrow("span6:&quot;Byar approx. Poisson Method&quot; as described in Rothman and Boice, Epidemiologic Analysis with a Programmable Calculator, 1979.")		
		newrow("span6:&quot;Rothman/Greenland&quot; as described in Rothman and Greenland, Modern Epidemiology (2nd Ed).")			
        newrow("span6:Ury HK, Wiggins AD. Another shortcut method for calculating the confidence interval of a poisson variable (or of a standardized mortality ratio). Am J Epidemiol 1985; 122; 197-8.")		
		newrow("span6:Vandenbroucke&nbsp;JP. A shortcut method for calculating the 95 percent confidence interval of the standardized mortality ratio (Letter). Am J Epidemiol 1982; 115; 303-4.")		
		newrow() 
		endtable();
    }
}

// Compute Chi-square p-value;
function csq(o,e) {
   if(e==0) { return 0 }
   var x=Math.abs(o-e)-0.5; if(x<0) { return 0 }
   return x*x/e
}


// for computing 2-sided p-value;
function Norm(z) {
  z=Math.abs(z);
  var p=1+ z*(0.04986735+ z*(0.02114101+ z*(0.00327763+ z*(0.0000380036+ z*(0.0000488906+ z*0.000005383)))))
  p=p*p; p=p*p; p=p*p
  return 1/(p*p)
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

//Chi-square test;
function ChiSq(x,n) {
    if(n==1 & x>10.83) {return 0};
    
    if(x>1000 | n>1000) {
        var q=ChiSq((x-n)*(x-n)/(2*n),1)/2
        if(x>n) {return q} {return 1-q}
        }
    var p=Math.exp(-0.5*x); if((n%2)==1) { p=p*Math.sqrt(2*x/Pi) }
    var k=n; while(k>=2) { p=p*x/k; k=k-2 }
    
    var t=p; var a=n; while(t>0.0000000001*p) { a=a+2; t=t*x/a; p=p+t };
    return 1-p;
}

// if you don't want to see p-value <0.0001 or P>1.0;
function Round(x){
if (x <0.001) {x = "<0.001"};
if (x >1) {x = "1.0000"};
return x;
}

//to control a scientific notation;
function Fmt(x) { 
   var v
   if(x>0) { v=''+(x+0.00000001) } else { v=''+(x-0.00000000) };
   return v.substring(0,v.indexOf('.')+8)
}

//end of script