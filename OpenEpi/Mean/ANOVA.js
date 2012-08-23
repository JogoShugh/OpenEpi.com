// JavaScript Document
//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="Analysis of Variance (ANOVA)";

var Authors="<b>Statistics</b><br>Minn M. Soe and Kevin M. Sullivan, Emory University<br>"+
"<br>"+
"<b>Interface</b><br>"+
"Andrew G. Dean, EpiInformatics.com, "+
"<br>and Roger A. Mir<br> ";
      
var Description=
"This one-way ANOVA module compares the means of two or more independent samples. Entering sample size, mean and standard deviation (or standard error) of each sample group will test for significant difference among the sample means. The confidence intervals for each individual mean are also displayed.";

//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="Suppose a study was conducted to analyse the difference in mean finger-wrist tapping score (MAXFWT) by lead-exposure group. Group 1 is the control group with no history of lead exposure, group 2 the currently exposed group with elevated blood-lead level and group 5 the previously exposed group. To compare the mean scores in above three groups, one-way ANOVA has to be used."+
	  "<ul>"+
	    "<li>To analyse this, enter the given values in respective cells in Open Epi ANOVA for comparing two or more means, and click on Calculate</li>"+
		"<li>In the new window screen, p-value from <i>F</i> test would be 0.012.</li>"+
      "</ul>"+
	  "Conclusion: There is an overall significant difference among mean MAXFWT scores in the three groups."+
	  "<p>Reference: Bernard Rosner. Fundamentals of Biostatistics(5th edition). (Data obtained from table 12.5; pg 533).";
	  

var Exercises="currently not available";
 
//----------------------------------------------------------------------------------------------------;
	  
var Pi=Math.PI; var PiD2=Pi/2; var PiD4=Pi/4; var Pi2=2*Pi;
var e=2.718281828459045235; var e10 = 1.105170918075647625;
var Deg=180/Pi;

//function keys;
function ChiSq(x,n) {
    if(n==1 & x>24) {return "<0.001"};
    
    if(x>1000 | n>100000) {
        var q=ChiSq((x-n)*(x-n)/(2*n),1)/2
        if(x>n) {return q} {return 1-q}
        }
        
    var Pi = 3.141592653589793238462643383;
    var p=Math.exp(-0.5*x); if((n%2)==1) { p=p*Math.sqrt(2*x/Pi) }
    var k=n; while(k>=2) { p=p*x/k; k=k-2 }
    
    var t=p; var a=n; while(t>0.0000000001*p) { a=a+2; t=t*x/a; p=p+t };
    return 1-p;
	}
	
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

function space(n) {
	if (n==0) {n=""};
	return n;
}
//---------------------------------------------------------------------------------------------------------;

//function CalcAnova(data) 
//{
//---------------------------create arrays;
var n = new Array(0,0,0,0,0,0,0,0,0,0);
var m = new Array(0,0,0,0,0,0,0,0,0,0);
var s = new Array(0,0,0,0,0,0,0,0,0,0);
var se = new Array(0,0,0,0,0,0,0,0,0,0);
var va = new Array(0,0,0,0,0,0,0,0,0,0);
var l = new Array(0,0,0,0,0,0,0,0,0,0);
var u = new Array(0,0,0,0,0,0,0,0,0,0);
var ll = new Array(0,0,0,0,0,0,0,0,0,0);
var uu = new Array(0,0,0,0,0,0,0,0,0,0);

function CalcAnova(data) 
{
//----------------------------data reading;
n[1] = parseFloat(data[1].E0D0);m[1] = parseFloat(data[1].E0D1);s[1] = parseFloat(data[1].E0D2);se[1] = parseFloat(data[1].E0D4);
n[2] = parseFloat(data[1].E1D0);m[2] = parseFloat(data[1].E1D1);s[2] = parseFloat(data[1].E1D2);se[2] = parseFloat(data[1].E1D4);
n[3] = parseFloat(data[1].E2D0);m[3] = parseFloat(data[1].E2D1);s[3] = parseFloat(data[1].E2D2);se[3] = parseFloat(data[1].E2D4);
n[4] = parseFloat(data[1].E3D0);m[4] = parseFloat(data[1].E3D1);s[4] = parseFloat(data[1].E3D2);se[4] = parseFloat(data[1].E3D4);
n[5] = parseFloat(data[1].E4D0);m[5] = parseFloat(data[1].E4D1);s[5] = parseFloat(data[1].E4D2);se[5] = parseFloat(data[1].E4D4);
n[6] = parseFloat(data[1].E5D0);m[6] = parseFloat(data[1].E5D1);s[6] = parseFloat(data[1].E5D2);se[6] = parseFloat(data[1].E5D4);
n[7] = parseFloat(data[1].E6D0);m[7] = parseFloat(data[1].E6D1);s[7] = parseFloat(data[1].E6D2);se[7] = parseFloat(data[1].E6D4);
n[8] = parseFloat(data[1].E7D0);m[8] = parseFloat(data[1].E7D1);s[8] = parseFloat(data[1].E7D2);se[8] = parseFloat(data[1].E7D4);
n[9] = parseFloat(data[1].E8D0);m[9] = parseFloat(data[1].E8D1);s[9] = parseFloat(data[1].E8D2);se[9] = parseFloat(data[1].E8D4);
n[10] = parseFloat(data[1].E9D0);m[10] = parseFloat(data[1].E9D1);s[10] = parseFloat(data[1].E9D2);se[10] = parseFloat(data[1].E9D4);
//alert("n7"+n[10]+"m7"+m[10]+"s7"+s[10]);


// ------------------------------ANOVA test calculation;
var g=0; var sn=0; var st=0; var sq=0; var sv=0; var sumnum=0; sumnum1=0; sumnum2=0; var sumdenom=0; var cnum=0; 

for (i=1; i<=10; i++) { var ni = n[i]
	if(ni>0){
		if (se[i]!=0) {s[i] = se[i]*Math.sqrt(n[i]);}  //if SE is entered, it will be converted to SD;
		
		// summing up for Bartlett test;
		va[i]	  = (s[i]*s[i]); 
		sumnum 	 += (n[i]-1) * (va[i]);
		sumdenom += (n[i]-1);
		
		sumnum1  += (n[i]-1) * Math.log(va[i]);
		cnum 	 += 1/(n[i]-1);
		
		// summing for ANOVA test;
		var ti = ni*m[i];
		var qi = ni*m[i]*m[i] + (ni-1)*s[i]*s[i];
		var vi = ti*ti/ni; 	// partA of vSSb;
		
		g = g + 1;			//#of comparison groups;
		sn = sn + ni;
		st = st + ti; 		// partB of vssb;
		sq = sq + qi;		
		sv = sv + vi;
		}
	}

// ANOVA F test;
var vSSb = sv - st*st/sn;  	//SSbet;
var vSSw = sq - sv; 		//SSwithin;
var vSSt = vSSb + vSSw; 	//SStotal;

var vDFb = g - 1;			// degree of freedom;
var vDFt = sn - 1;
var vDFw = vDFt - vDFb;

var vEVb = vSSb / vDFb;		// mean square between;
var vEVw = vSSw / vDFw;		// mean square within; 

// F and p values from ANOVA;
var vF = vEVb / vEVw;
var vP = FishF( vF , vDFb , vDFw );



// --------------------------Bartlett's Homogeneity test;
var vpool= sumnum/sumdenom;
var sumnum2  = (sn-g) * Math.log(vpool);
var cval=  1  +   ( 1/(3*g - 3)) * (cnum - (1/(sn-g)) );

var cs= (sumnum2-sumnum1)/cval; 		//chisquare statistics;
var dfbart=g-1;  				//degree of freedom;
var pbart= ChiSq(cs,dfbart); 			//p value of chisq;

//alert(vF+"  "+vP+"   "+cs+"   "+pbart+" "+dfbart)


// ----------------------------calculating 95% confidence intervals of individual MEANs;
for (i=1; i<=10; i++) {
l[i]=""; u[i]=""; ll[i]=""; uu[i]="";

if(n[i]>0){
if (s[i]!=0) {se[i] = s[i]/Math.sqrt(n[i]);}  //if SD is entered, it will be converted to SE to calculate CI;
/*
//based on z-statistics;
var z = Math.sqrt(3.841);
l[i]=m[i] - (z*s[i]);
u[i]=m[i] + (z*s[i]);
ll[i]=m[i] - z*Math.sqrt(vEVb/n[i]);
uu[i]=m[i] + z*Math.sqrt(vEVb/n[i]);
*/

//based on t-statistics;
var t=AStudT(0.05,n[i]-1); // 0.05 means t statistics at alpha=0.05;
                      //Added -1 above Feb 26, 2008
l[i]=m[i] - (t*se[i]); //based on individual Mean;
l[i]=fmtSigFig(l[i],6);


u[i]=m[i] + (t*se[i]);
u[i]=fmtSigFig(u[i],6);

ll[i]=m[i] - t*Math.sqrt(vEVw/n[i]);//based on average mean, assuming equal variance;
ll[i]=fmtSigFig(ll[i],6);

uu[i]=m[i] + t*Math.sqrt(vEVw/n[i]);
uu[i]=fmtSigFig(uu[i],6);
}
}
//alert(m[1]+" "+s[1]+" "+se[1]+" "+l[1]+"  "+u[1]+"  "+ll[1]+"  "+uu[1]);
//alert(m[2]+" "+s[2]+" "+se[1]+" "+l[2]+"  "+u[2]+"  "+ll[2]+"  "+uu[2]);
//alert(m[10]+" "+l[10]+"  "+u[10]+"  "+ll[10]+"  "+uu[10]);




//----------------------------------------------------------------------------------------------------------;
//input data read again. the values of std dev (or) std error are for some reason not displayed correctly.
// also, not to display '0' if there is no value in a cell.
s1=space((data[1].E0D2)); se1=space((data[1].E0D4));
s2=space((data[1].E1D2)); se2=space((data[1].E1D4));
s3=space((data[1].E2D2)); se3=space((data[1].E2D4));
s4=space((data[1].E3D2)); se4=space((data[1].E3D4));
s5=space((data[1].E4D2)); se5=space((data[1].E4D4));
s6=space((data[1].E5D2)); se6=space((data[1].E5D4));
s7=space((data[1].E6D2)); se7=space((data[1].E6D4));
s8=space((data[1].E7D2)); se8=space((data[1].E7D4));
s9=space((data[1].E8D2)); se9=space((data[1].E8D4));
s10=space((data[1].E9D2)); se10=space((data[1].E9D4));

m[1]=space(m[1]);
m[2]=space(m[2]);
m[3]=space(m[3]);
m[4]=space(m[4]);
m[5]=space(m[5]);
m[6]=space(m[6]);
m[7]=space(m[7]);
m[8]=space(m[8]);
m[9]=space(m[9]);
m[10]=space(m[10]);

// Output table;


	with (outTable)
	{
	newtable(8,90);	 //6 columns and 90 pixels per column
	title("<h3>" + Title+ "</h3>");			 
	//line(7); //draw the line for the length of 8 columns;
	newrow("span8:bold:c:Input Data");
	newrow("span8:l: &nbsp;  ");
	//newrow("color#66ffff:span3:l:Two-sided confidence interval", "color#66ffff:span1:r:"+fmtSigFig(pt,6)+"%","color#66ffff:span4:l:");
	
	newrow("span1:l:",   "color#ffff99:span2:bold:c: Group",  "color#ffff99:span1:bold:c: N (count)",  "color#ffff99:span1:bold:c:Mean", 	"color#ffff99:span1:bold:c: Std. Dev.", "color#ffff99:span1:bold:c: Std. error", "span1:bold:l:"); 
	newrow("span1:l:",   "color#ffff99:span6:l:&nbsp;",   "span1:l:"); 
	newrow("span1:l:",   "color#66ffff:span2:bold:c: 1:",  "color#66ffff:span1:c:"+space(n[1]),  "color#66ffff:span1:c:"+space(m[1]),  "color#66ffff:span1:c:"+s1,  "color#66ffff:span1:c:"+se1,  "span1:bold:l:"); 
	newrow("span1:l:",   "color#66ffff:span2:bold:c: 2:",  "color#66ffff:span1:c:"+space(n[2]),  "color#66ffff:span1:c:"+space(m[2]),  "color#66ffff:span1:c:"+s2,  "color#66ffff:span1:c:"+se2,  "span1:bold:l:"); 
	newrow("span1:l:",   "color#66ffff:span2:bold:c: 3:",  "color#66ffff:span1:c:"+space(n[3]),  "color#66ffff:span1:c:"+space(m[3]),  "color#66ffff:span1:c:"+s3,  "color#66ffff:span1:c:"+se3,  "span1:bold:l:"); 
	newrow("span1:l:",   "color#66ffff:span2:bold:c: 4:",  "color#66ffff:span1:c:"+space(n[4]),  "color#66ffff:span1:c:"+space(m[4]),  "color#66ffff:span1:c:"+s4,  "color#66ffff:span1:c:"+se4,  "span1:bold:l:"); 
	newrow("span1:l:",   "color#66ffff:span2:bold:c: 5:",  "color#66ffff:span1:c:"+space(n[5]),  "color#66ffff:span1:c:"+space(m[5]),  "color#66ffff:span1:c:"+s5,  "color#66ffff:span1:c:"+se5,  "span1:bold:l:"); 
	newrow("span1:l:",   "color#66ffff:span2:bold:c: 6:",  "color#66ffff:span1:c:"+space(n[6]),  "color#66ffff:span1:c:"+space(m[6]),  "color#66ffff:span1:c:"+s6,  "color#66ffff:span1:c:"+se6,  "span1:bold:l:"); 
	newrow("span1:l:",   "color#66ffff:span2:bold:c: 7:",  "color#66ffff:span1:c:"+space(n[7]),  "color#66ffff:span1:c:"+space(m[7]),  "color#66ffff:span1:c:"+s7,  "color#66ffff:span1:c:"+se7,  "span1:bold:l:"); 
	newrow("span1:l:",   "color#66ffff:span2:bold:c: 8:",  "color#66ffff:span1:c:"+space(n[8]),  "color#66ffff:span1:c:"+space(m[8]),  "color#66ffff:span1:c:"+s8,  "color#66ffff:span1:c:"+se8,  "span1:bold:l:"); 
	newrow("span1:l:",   "color#66ffff:span2:bold:c: 9:",  "color#66ffff:span1:c:"+space(n[9]),  "color#66ffff:span1:c:"+space(m[9]),  "color#66ffff:span1:c:"+s9,  "color#66ffff:span1:c:"+se9,  "span1:bold:l:"); 
	newrow("span1:l:",   "color#66ffff:span2:bold:c: 10:",  "color#66ffff:span1:c:"+space(n[10]), "color#66ffff:span1:c:"+space(m[10]),  "color#66ffff:span1:c:"+s10,  "color#66ffff:span1:c:"+se10,  "span1:bold:l:"); 
	line(8);
	
	newrow("span8:bold:c:ANOVA Table");
	newrow("span8:bold:c: &nbsp;");
	newrow("span2:bold:r:Source of variation",   "span2:bold:r: Sum of squares",  "span1:bold:c: d.f",  "span1:bold:c:Mean square", 	"span1:bold:c:<i>F </i>statistics", "span1:bold:c: p-value<tt><sup>1</sup>", "color#ffff99:span1:bold:l:"); 
	newrow("span2:bold:r:Between Groups:",   "span2:r:"+fmtSigFig(vSSb,6),  "span1:c:"+fmtSigFig(vDFb,6),  "span1:c:"+fmtSigFig(vEVb,6), 	"span1:c:"+fmtSigFig(vF,6), "span1:c:"+fmtSigFig(vP,6)); 
	newrow("span2:bold:r:Within Groups:",   "span2:r:"+fmtSigFig(vSSw,6),  "span1:c:"+fmtSigFig(vDFw,6),  "span1:c:"+fmtSigFig(vEVw,6));
	newrow("span2:bold:r:Total:",   "span2:r:"+fmtSigFig(vSSt,6),  "span1:c:"+fmtSigFig(vDFt,6));
	newrow("span8:bold:c: &nbsp;");
	
	// Bartlett's test result;
	newrow("span3:bold:r:",   								"span1:bold:r: Chi square",  "span1:bold:c: d.f",        	  "span1:bold:c:p-value<tt><sup>1</sup>", 	"span2:bold:c:"); 
	newrow("span3:bold:c:Test for equality of variance:",   "span1:r:"+fmtSigFig(cs,6),  "span1:c:"+fmtSigFig(dfbart,6),  "span1:c:"+fmtSigFig(pbart,6), 	"span2:c:"); 
	//newrow("span8:bold:c: &nbsp;");
	line(8);
	
	//CI results;
	newrow("span2:bold:c:",   "span1:bold:c:",  "span2:bold:c: 95% CI of individual sample mean",  "span1:bold:c:", 	"span2:bold:c:95% CI assuming equal variance"); 
	newrow("span8:bold:c: &nbsp;");
	newrow("span2:bold:c:Group", 	  "span1:bold:l: Mean",  	"span1:bold:c: Lower Limit",  "span1:bold:c:Upper Limit", 		"span1:bold:c:", 	"span1:bold:c:Lower Limit", "span1:bold:c: Upper Limit"); 
	newrow("span2:bold:c:");
	newrow("span2:bold:c:1:",   "span1:l:"+m[1],  "span1:c:"+l[1],  "span1:c:"+u[1],     "span1:bold:c:", 	"span1:c:"+ll[1], "span1:c:"+uu[1]); 
	newrow("span2:bold:c:2:",   "span1:l:"+m[2],  "span1:c:"+l[2],  "span1:c:"+u[2],     "span1:bold:c:", 	"span1:c:"+ll[2], "span1:c:"+uu[2]); 
	newrow("span2:bold:c:3:",   "span1:l:"+m[3],  "span1:c:"+l[3],  "span1:c:"+u[3],     "span1:bold:c:", 	"span1:c:"+ll[3], "span1:c:"+uu[3]); 
	newrow("span2:bold:c:4:",   "span1:l:"+m[4],  "span1:c:"+l[4],  "span1:c:"+u[4],     "span1:bold:c:", 	"span1:c:"+ll[4], "span1:c:"+uu[4]); 
	newrow("span2:bold:c:5:",   "span1:l:"+m[5],  "span1:c:"+l[5],  "span1:c:"+u[5],     "span1:bold:c:", 	"span1:c:"+ll[5], "span1:c:"+uu[5]); 
	newrow("span2:bold:c:6:",   "span1:l:"+m[6],  "span1:c:"+l[6],  "span1:c:"+u[6],     "span1:bold:c:", 	"span1:c:"+ll[6], "span1:c:"+uu[6]); 
	newrow("span2:bold:c:7:",   "span1:l:"+m[7],  "span1:c:"+l[7],  "span1:c:"+u[7],     "span1:bold:c:", 	"span1:c:"+ll[7], "span1:c:"+uu[7]); 
	newrow("span2:bold:c:8:",   "span1:l:"+m[8],  "span1:c:"+l[8],  "span1:c:"+u[8],     "span1:bold:c:", 	"span1:c:"+ll[8], "span1:c:"+uu[8]); 
	newrow("span2:bold:c:9:",   "span1:l:"+m[9],  "span1:c:"+l[9],  "span1:c:"+u[9],     "span1:bold:c:", 	"span1:c:"+ll[9], "span1:c:"+uu[9]); 
	newrow("span2:bold:c:10:",   "span1:l:"+m[10],  "span1:c:"+l[10],  "span1:c:"+u[10],     "span1:bold:c:", 	"span1:c:"+ll[10], "span1:c:"+uu[10]); 
	newrow("span8:bold:c:");
	line(8);
	newrow("span8:l: <tt><sup>1</sup></tt> <small> p-value (two-tailed)");
	
	endtable();
	}  
} 
//end of calculate ANOVA routine






