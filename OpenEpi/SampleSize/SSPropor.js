// JavaScript Document
//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="Sample Size for a Proportion or Descriptive Study";

var Authors="<b>Statistics</b><br>Kevin M. Sullivan, Emory University<br>"+
"based on code from John C. Pezzullo<br>"+
"<b>Interface</b><br>"+
"Andrew G. Dean, EpiInformatics.com, "+
"<br>and Roger A. Mir<br> ";
      
var Description="This module calculates sample size for determining "+
"the frequency of a factor in a population. Sample sizes are provided "+
"for confidence levels from 90% to 99.99%. "+
"<p>A finite population correction will be applied if the population size "+
"is not large. For samples that are not random or systematic, a design "+
"effect other than 1.0 may be entered. The calculated sample sizes are "+
"multiplied by the design effect.</p> "
	
//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="A simple random or systematic sample is to be used to survey a large population concerning satisfaction with particular aspects of health care.  The expected result is unknown, but guesstimated to be about 50% positive and 50% negative.  If the result is 50%, we want 95% confidence that the true frequency lies between 45 and 55%."+      
	  "<ul>"+
	    "<li>How large should the sample be?</li>"+
		"<li>Using the default numbers in the sample size for proportion module, click calculate to determine that the sample needed is 384 persons (ignoring non-response and other possibly important factors) </li>"+
      "</ul>";

var Exercises="Random samples are expensive.  A survey company designs a cluster sample based on first selecting random census blocks and then choosing samples within those selected.  They state that the expected 'Design Effect' (sample size multiplier) is 1.8, based on previous surveys."+ 
	  "<ul>"+
	    "<li>Use the default numbers but change the design effect to 1.8 to see the sample size for the cluster survey.</li>"+
        "<li>Note that the sample size for a random sample is simply multiplied by the Design Effect.</li>"+
      "</ul>";   
	  
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

var formula ="<b><i>n</i> = [DEFF*Np(1-p)]/ [(d<sup>2</sup>/Z<sup>2</sup><sub>1-<span>&#945;/2</span></sub>*(N-1)+p*(1-p)]&nbsp;&nbsp;</B>"; 

with (outTable)
	{
	newrow("","bold:r:Confidence ","bold:l: Level(%)","c:bold:Sample Size");
	newrow();
	newrow("","r: 95%", "",ssx(95));
	newrow();
	newrow("","r: 80%","",ssx(80));
	newrow("","r: 90%","",ssx(90));
	newrow("","r: 97%","",ssx(97));
	newrow("","r: 99%","",ssx(99));
	newrow("","r: 99.9%","",ssx(99.9));
	newrow("","r: 99.99%","",ssx(99.99));
	 line(6);
	newrow();
	newrow("span6:c:color#c0c0c0:Equation");
    newrow("span6:Sample size " + formula);
	}  
}

