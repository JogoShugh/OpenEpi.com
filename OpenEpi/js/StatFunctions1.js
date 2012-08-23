// JavaScript Document
var highcolor="#3300FF";
var highlight="color"+highcolor+":" //Color for highlighting of "significant" results

var edchoicecolor="#33EEFF";
var editorschoice="color"+edchoicecolor+":"  //Color for editor's choice selections

function coloredText(text,color)
{
 return '<font color='+color+'>'+text+'</font>';
 //return "<span style='color:"+color+"'>"+text+"<\/span>";  //Not deprecated, but doessn't work
}

if (!ConfLevel)
 {
  var ConfLevel=95;
  var Pvalues=0;  //Do not suppress highlighting of "significance"
  }  //Protection in case application does not include ReadCookie.js

function stdRefStr()
{  var refstr
   refstr= '\nnewrow("span6:&deg; &sup1; '+ConfLevel+'% confidence limits testing exclusion of 0 or 1, as indicated")';
   var highnote="P-values \< "+(100-ConfLevel)/100+" and confidence limits excluding null values (0,1, or [n]) are highlighted."
   if (!(Pvalues>0)) 
   {
     refstr += '\nnewrow("span6:'+ coloredText(highnote,highcolor)+'")';
   }
   refstr +='\nnewrow("span6:'+editorschoice+'LookFirst items:: Editor\'s choice of items to examine first.")';  
   return refstr
}
function objType(item)
{
//Returns 'array', 'function', 'string', or 'number'
if (item.substring)
   {
    //alert("has substring method")
	if (isNumber(item))
	  {
	   return "numstring";
	  }
	 else
	  {
	   return "string";
	  } 
	}  
if (item.length)
  {
  
  return "array";
  }
if (typeof(item)=="function")
  {
	 
	 return "function";
  }
if (isNumber(item))
  {
     
	 return"number";  
  }  
}


function isNumber(str)
{ //returns true if number, otherwise false
if (!isNaN(parseFloat(str))) {return true;}
if (str==null) {return false}
var re=/^[-]?\d*\.?\d*$/;
str=str.toString();
if (!str.match(re))
  {
   return false;
  }
return true;
} 


//http://www.merlyn.demon.co.uk/js-round.htm
function OKStrOfMN(X, M, N) 
 {
  //Format the number X to have at least M digits to the left and N to the right
  //of the decimal.  
  var T, S=new String(Math.round(X*Number('1e'+N)))
  while (S.length<M+N) S='0'+S
  return S.substr(0, T=(S.length-N)) + '.' + S.substr(T, N) 
 }

function Prfx(Q, L, c) { var S = Q+"" // ??
  // if (!c) var c = ' '
  if (c.length>0) while (S.length<L) { S = c+S } ;
  return S }
  
function StrU(X, M, N) 
{ 
// X>=0.0
//Warning.  If N is > 9, wrong numbers are produced in the Safari browser
//S seems to default to the max number available in Safari rather than causing an error!!
 var T=""; 
 var S=new String(Math.round(X*Number("1e"+N)))
 //alert ("96 N="+N+" num="+num+ " S="+S+ " max val="+Number.MAX_VALUE)
  if (/\D/.test(S)) { return ''+X }
  with (new String(Prfx(S, M+N, '0')))
    return substring(0, T=(length-N)) + '.' + substring(T) 
}

function SigFigNo(X, N) {
  var p = Math.pow(10, N-Math.ceil(Math.log(Math.abs(X))/Math.LN10))
  return isFinite(p) ? Math.round(X*p)/p : X }
	
	 
function Fmt(x) 
{ 
if (x==Number.NEGATIVE_INFINITY || x==Number.POSITIVE_INFINITY) 
  {
   return "'undefined'"
  }
if (x==NaN)
  {
   return "'\?'"
  }
var v
if(x>0) { v=''+(x+0.00000001) } else { v=''+(x-0.00000000) };
return v.substring(0,v.indexOf('.')+8)
}
  
function fmtFixed(num, accuracy)
{   
		if (isNumber(num))
		  {
		    if (num==Number.NEGATIVE_INFINITY || num==Number.POSITIVE_INFINITY) 
            {
              return "'undefined'"
            }
			else
			{
            var factor=Math.pow(10,accuracy);
            return Math.round(num*factor)/factor;
		    }
		  }	
		else
		   { 
             return "'\?'"
           }	
}

function fmtSci2Dec(num)
{
var result1=num.toString();

var epos=result1.search(/e/i);
if (epos<0) {
	          return num; //no e found
            }
            //Found an e;  Fix the format.
             var zerostr="";
		     var efactor=parseInt(result1.substring(epos+1))
			 var finalnum=result1.substring(0,epos); //Put numbers prior to e in finalnum
			 finalnum=finalnum.replace(/[\,\.]/,"");
				// alert("Point gone? "+finalnum);
			if (efactor>0)
			   {
				 
				 if (finalnum.length>efactor) 
				    {
						//Place the decimal point
						finalnum=finalnum.substring(0,efactor)+"."+finalnum.substring(efactor);
					}
				  else
				    {
				     
				     for (var i=0; i<=efactor-finalnum.length; i++)
				       {
					     zerostr+="0";
					   }
				     finalnum+=zerostr;
					}
			   }
			  else
			   {
				 
				 //efactor is negative
				 //Put efactor-1 zeroes in front of number
                 //Warning! This assumes that the decimal position was after the first digit
				 zerostr="0.";
				 for (var i=0; i<Math.abs(efactor)-1;i++) 
				   {
					 zerostr+="0"
				   }
				 // finalnum=finalnum+corenum;
				  finalnum=zerostr+finalnum;
				  while (finalnum.charAt(finalnum.length-1)=="0")
				  {
					 //trim off traiing zeroes
				     finalnum=finalnum.substring(0,finalnum.length-1) 
			      }
				  
				
			   }
   
return finalnum
		   
}
		   

function fmtSigFig(num, sig, multby)
{   var result;
    var refactor=1;
    var percent="";

   if (multby==null) {multby=1.0}
   if (/\%/.test(multby) )
			  {
			   multby=100;
	           percent="\%";
			  }   //Add a percent sign if appropriate
    
   if (isNumber(num) && isNumber(multby))
	 {	    
	   if (num==Number.NEGATIVE_INFINITY || num==Number.POSITIVE_INFINITY) 
        {
            return "'undefined'"
        }
	   else
	    {   
            //Find the rounding factor
			if (num==0.0) {return "0.0"}
			num=num*multby;
            var factor=Math.pow(10,sig-Math.ceil(Math.log(Math.abs(num))/Math.LN10));
            //Round to acc decimal places (which is sig significant figures)
			
			//if (factor > 10e7) {factor=factor/1000;refactor=1000}
	//if (num<10e6) {alert("num="+num+" factor="+factor+"Math.roung(num * factor)="+Math.round(num*factor)+" res="+Math.round(num*factor)/factor) }
	      // alert("Math.round(num*factor)="+ Math.round(num*factor))
		  // var corenum=Math.round(num*factor);
		   result= (Math.round(num*factor)/factor);
		   result=fmtSci2Dec(result);
		   result = result+percent;
		  //  result= (multby * Math.round(num*factor)/factor)+percent;
			return result;
        }
	  }	
	else
	  { 
	   // alert("in fmtSigFig,formatting "+num + " multby is "+multby);
           return "'\?'"
      }
}			

function limits(lowlim,uplim,markifexclude,multby)
{
 //Takes two numbers and formats with square brackets, changing the color of the numbers
 //if the number in markifexclude is not included in the limits.  Results are
 //multiplied by Multby, and a percent sign is added if Multby is 100.  If Multby
 //is not supplied, it is assumed to be 1. The test for exclusion is applied before
 //multiplying by multby.
var m="";
 if (markifexclude===0) 
   {m="&deg; "}
 else if (markifexclude==1) 
   {m="&sup1; "}
 
 var s=fmtSigFig(lowlim,4,multby)+"\,   "+fmtSigFig(uplim,4,multby)+m;
// if (markifexclude != null && markifexclude != "")
markifexclude=parseFloat(markifexclude);
if (!isNaN(markifexclude))
 {
  if ((lowlim>markifexclude||uplim<markifexclude) && !(Pvalues>0)) 
  {
     return coloredText(s,highcolor); //highlighted
  }
 }
 return s;  //without highlighting
}
		
function cscritFromOEConfLevel(OEConfLevel)
{
 //Returns z value for various levels of confidence and 1 degree
 //of freedom.  OEConfLevel must be expressed as
 //a string with two digits, then two optional digits, without a % sign.
 //Useful for changing the cookie values of confidence level into
 //z values or cscrit values.
  var cscrit =Array()
  cscrit['99.99%']=15.137
  cscrit['99.98%']=13.831
  cscrit['99.95%']=12.116
  cscrit['99.9%']=10.828
  cscrit['99.8%']=9.550
  cscrit['99.5%']=7.879
  cscrit['99%']=6.635
  cscrit['98%']=5.412
  cscrit['95%']=3.841
  cscrit['90%']=2.706
  cscrit['85%']=2.072
  cscrit['80%']=1.642
  cscrit['75%']=1.323
  cscrit['70%']=1.074
  cscrit['65%']=0.873
  cscrit['60%']=0.708
  cscrit['55%']=0.571
  cscrit['50%']=0.455
  cscrit['45%']=0.357
  cscrit['40%']=0.275
  cscrit['35%']=0.206
  cscrit['30%']=0.148
  cscrit['25%']=0.102
  cscrit['20%']=0.064
  //alert ("OEConfLevel=" + OEConfLevel + "cscrit="+cscrit[OEConfLevel+"%"])
  return cscrit[OEConfLevel+"%"]
}

//The functions below that are labelled Sundar Dorai-Raj were obtained from 
//the website  http://www.stat.vt.edu/~sundar/java/  We are grateful for their 
//use under the GNU license.

/** * @(#)pchisq.js * * Copyright (c) 2000 by Sundar Dorai-Raj
  * * @author Sundar Dorai-Raj
  * * Email: sdoraira@vt.edu
  * * This program is free software; you can redistribute it and/or
  * * modify it under the terms of the GNU General Public License 
  * * as published by the Free Software Foundation; either version 2 
  * * of the License, or (at your option) any later version, 
  * * provided that any use properly credits the author. 
  * * This program is distributed in the hope that it will be useful,
  * * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  * * GNU General Public License for more details at http://www.gnu.org * * */

function pchisq(q,df,numonly) {
  // Posten, H. (1989) American Statistician 43 p. 261-265
  //Modified to get confidence level from data array in OpenEpi application
  //var ConfLevel=appDataArray[0].conflevel
  //Despite appearances, q is apparently the chi square
  df2=df/2;
  q2=q/2;
  nn=5;
  if (q==0) return 1.0;   //added June 2011
  if(q<=0 || df<=0) return -1;
  if(q<df) 
  {
   tk=q2*(1-nn-df2)/(df2+2*nn-1+nn*q2/(df2+2*nn));
   for(kk=nn-1;kk>1;kk--)
     tk=q2*(1-kk-df2)/(df2+2*kk-1+kk*q2/(df2+2*kk+tk));
   CFL=1-q2/(df2+1+q2/(df2+2+tk));
   prob=Math.exp(df2*Math.log(q2)-q2-lngamma(df2+1)-Math.log(CFL));
  }
  else 
  {
    tk=(nn-df2)/(q2+nn);
    for(kk=nn-1;kk>1;kk--)
      tk=(kk-df2)/(q2+kk/(1+tk));
    CFU=1+(1-df2)/(q2+1/(1+tk));
    prob=1-Math.exp((df2-1)*Math.log(q2)-q2-lngamma(df2)-Math.log(CFU));
  }

    prob=1-prob;           //Andy Dean, www.openepi.com

  if (numonly && numonly==true)
   {
     return prob;
   }
  else
   {  	 
     return fmtPValue(prob, ConfLevel);        //Returns a string rather than a number
   }
}

function fmtPValue(p)
{
//Returns a formatted value with numbers smaller than <0.0000001 indicated
//as such.  If the 'ConfLevel' variable is provided, then it is used to test
//for p < 1-ConfLevel/100 and mark the text with "highcolor" if the test is passed, 
//and if the highlight variable is turned on in Settings.
//Modified to get confidence level from data array in OpenEpi application 
var reg=new RegExp("[1-9]")
var prob=p 
var mark=!(Pvalues>0)
//var ConfLevel=appDataArray[0].conflevel

//alert ("mark="+mark)
if (prob< 0.0000001) //Deals with small numbers 
    { 
	  if (mark) 
	   {
	    return coloredText("\<0.0000001",highcolor) 
	    //return "<img src=../Etable/img/redpin.gif>\<0.0000001" 
	   }
	   else
	   {
	    return "<0.0000001"
	   }                    
	  
	}
if (prob> 0.9999999 && prob <= 1.0) //Deals with numbers close to 1
    { 
	  if (mark) 
	   {
	    return coloredText("\>0.9999999",highcolor)
	   }
	   else
	   {
	    return ">0.9999999"
	   }                    
	  
	}
	  
	  prob=SigFigNo((prob),4)  //Three significant figures
	  
	 // alert("398  "+prob)
	 // prob=StrU(prob,1,11)
	  prob=StrU(prob,1,9);  //Changed to 9 digits to correct a  bug in Safari that always returned 2147......
	 // alert("400  "+prob)
 var index =prob.search(reg)
 prob=prob.substring(0,index+4)
 
 if (ConfLevel && (p<((100-ConfLevel)/100)))
  {
   if (mark>0) 
    {
	 // prob="image=../Etable/img/redpin.gif:"+prob;
	  prob=coloredText(prob,highcolor);
	}
  }
 if (prob=="NaN") {prob="'\?'"}
 return prob
 
}

function pctAboveZ(Z)
{
    return pnorm(Z,true)*100;
        //Calls the pnorm function in StatFunctions1.js, with upper set to true
}
function pctBelowZ(Z)
{
    return pnorm(Z,false)*100;
        //Calls the pnorm function in StatFunctions1.js, with upper set to false
}

/** * @(#)pnorm.js * * Copyright (c) 2000 by Sundar Dorai-Raj
  * * @author Sundar Dorai-Raj
  * * Email: sdoraira@vt.edu
  * * This program is free software; you can redistribute it and/or
  * * modify it under the terms of the GNU General Public License 
  * * as published by the Free Software Foundation; either version 2 
  * * of the License, or (at your option) any later version, 
  * * provided that any use properly credits the author. 
  * * This program is distributed in the hope that it will be useful,
  * * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  * * GNU General Public License for more details at http://www.gnu.org * * */

  // "Applied Statistics Algorithms" (1985)
  // P. Griffiths and I. D. Hill, editors

  function pnorm(z,upper) {
    // Algorithm AS66 Applied Statistics (1973) vol22 no.3
    // Computes P(Z<z)
	
	//When z=1.96, the values returned are .975 (upper=false) or .025(upper=true) (roughly).
    z=parseFloat(z);
   // upper=(form.upper[0].checked ? true:false);
    //upper must be set to true or false when the function is called
    ltone=7.0;
    utzero=18.66;
    con=1.28;
    a1 = 0.398942280444;
    a2 = 0.399903438504;
    a3 = 5.75885480458;
    a4 =29.8213557808;
    a5 = 2.62433121679;
    a6 =48.6959930692;
    a7 = 5.92885724438;
    b1 =0.398942280385;
    b2 =3.8052e-8;
    b3 =1.00000615302;
    b4 =3.98064794e-4;
    b5 =1.986153813664;
    b6 =0.151679116635;
    b7 =5.29330324926;
    b8 =4.8385912808;
    b9 =15.1508972451;
    b10=0.742380924027;
    b11=30.789933034;
    b12=3.99019417011;

    if(z<0) {
      upper=!upper;
      z=-z;
    }
    if(z<=ltone || upper && z<=utzero) {
      y=0.5*z*z;
      if(z>con) {
        alnorm=b1*Math.exp(-y)/(z-b2+b3/(z+b4+b5/(z-b6+b7/(z+b8-b9/(z+b10+b11/(z+b12))))));
      }
      else {
        alnorm=0.5-z*(a1-a2*y/(y+a3-a4/(y+a5+a6/(y+a7))));
      }
    }
    else {
      alnorm=0;
    }
    if(!upper) alnorm=1-alnorm;
    return(alnorm);
  }

 

/** * @(#)lngamma.js * * Copyright (c) 2000 by Sundar Dorai-Raj
  * * @author Sundar Dorai-Raj
  * * Email: sdoraira@vt.edu
  * * This program is free software; you can redistribute it and/or
  * * modify it under the terms of the GNU General Public License 
  * * as published by the Free Software Foundation; either version 2 
  * * of the License, or (at your option) any later version, 
  * * provided that any use properly credits the author. 
  * * This program is distributed in the hope that it will be useful,
  * * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  * * GNU General Public License for more details at http://www.gnu.org * * */

function lngamma(c) {
  cof=new Array(6);
  cof[0]=76.18009172947146;
  cof[1]=-86.50532032941677;
  cof[2]=24.01409824083091;
  cof[3]=-1.231739572450155;
  cof[4]=0.1208650973866179e-2;
  cof[5]=-0.5395239384953e-5;
  xx=c;
  yy=c;
  tmp = xx + 5.5 - (xx + 0.5) * Math.log(xx + 5.5);
  ser = 1.000000000190015;
  for(j=0;j<=5;j++)
    ser += (cof[j] / ++yy);
  return(Math.log(2.5066282746310005*ser/xx)-tmp);
}

function lnbeta(a,b) {
  return(lngamma(a)+lngamma(b)-lngamma(a+b));
}

/** * @(#)pbeta.js * * Copyright (c) 2000 by Sundar Dorai-Raj
  * * @author Sundar Dorai-Raj
  * * Email: sdoraira@vt.edu
  * * This program is free software; you can redistribute it and/or
  * * modify it under the terms of the GNU General Public License 
  * * as published by the Free Software Foundation; either version 2 
  * * of the License, or (at your option) any later version, 
  * * provided that any use properly credits the author. 
  * * This program is distributed in the hope that it will be useful,
  * * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  * * GNU General Public License for more details at http://www.gnu.org * * */

function pbeta_raw(x,pin,qin,lower_tail) {
  // Bosten and Battiste (1974).
  // Remark on Algorithm 179, CACM 17, p153, (1974).
  eps=0.5*1e-8;
  sml=1e-5;
  lneps=Math.log(eps);
  lnsml=Math.log(sml);

  if(pin/(pin+qin)<x) {
    swap_tail=true;
    y=1-x;
    p=pin;
    q=qin;
  }
  else {
    swap_tail=false;
    y=x;
    p=pin;
    q=qin;
  }
  if((p+q)*y/(p+1)<eps) {
    ans=0;
    xb=p*Math.log(Math.max(y,sml))-Math.log(p)-lnbeta(p,q);
    if(xb>lnsml && y!=0)
      ans=Math.exp(xb);
    if(swap_tail==lower_tail)
      ans=1-ans;
  }
  else {
    ps=q-Math.floor(q);
    if(ps==0) ps=1;
    xb=p*Math.log(y)-lnbeta(ps,p)-Math.log(p);
    ans=0;
    if(xb>=lnsml) {
      ans=Math.exp(xb);
      term=ans*p;
      if(ps!=1) {
        n=Math.max(lneps/Math.log(y),4.0);
        for(i=1;i<=n;i++) {
          xi=i;
          term*=(xi-ps)*y/xi;
          ans+=term/(p+xi);
        }
      }
    }
    if(q>1) {
      xb=p*Math.log(y)+q*Math.log(1-y)-lnbeta(p,q)-Math.log(q);
      ib=Math.max(xb/lnsml,0.0);
      term=Math.exp(xb-ib*lnsml);
      c=1/(1-y);
      p1=q*c/(p+q-1);
      finsum=0;
      n=q;
      if(q==n) n--;
      for(i=1;i<=n;i++) {
        if(p1<=1 && term/eps<=finsum) break;
        xi=i;
        term=(q-xi+1)*c*term/(p+q-xi);
        if(term>1) {
          ib--;
          term*=sml;
        }
        if(ib==0)
          finsum+=term;
      }
      ans+=finsum;
    }
    if(swap_tail==lower_tail)
      ans=1-ans;
    ans=Math.max(Math.min(ans,1),0);
  }
  return ans;
}

function pbeta(x,pin,qin,lower_tail) {
  x=parseFloat(x)
  pin=parseFloat(pin);
  qin=parseFloat(qin);
  lower_tail=true;
  if(pin<=0 || qin<=0) return -1;
  if(x<=0) return (lower_tail ? 0.0:1.0);
  if(x>=1) return (lower_tail ? 1.0:0.0);
  return pbeta_raw(x,pin,qin,lower_tail);
}

/** * @(#)qt.js * * Copyright (c) 2000 by Sundar Dorai-Raj
  * * @author Sundar Dorai-Raj
  * * Email: sdoraira@vt.edu
  * * This program is free software; you can redistribute it and/or
  * * modify it under the terms of the GNU General Public License 
  * * as published by the Free Software Foundation; either version 2 
  * * of the License, or (at your option) any later version, 
  * * provided that any use properly credits the author. 
  * * This program is distributed in the hope that it will be useful,
  * * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  * * GNU General Public License for more details at http://www.gnu.org * * */

function qt(p,ndf,lower_tail) {
  // Algorithm 396: Student's t-quantiles by
  // G.W. Hill CACM 13(10), 619-620, October 1970
  if(p<=0 || p>=1 || ndf<1) return -1;
  eps=1e-12;
  M_PI_2=1.570796326794896619231321691640; // pi/2
  if((lower_tail && p > 0.5) || (!lower_tail && p < 0.5)) {
     neg = false;
     P = 2 * (lower_tail ? (1 - p) : p);
   }
   else {
     neg = true;
     P = 2 * (lower_tail ? p : (1 - p));
   }

   if(Math.abs(ndf - 2) < eps) {   /* df ~= 2 */
     q=Math.sqrt(2 / (P * (2 - P)) - 2);
   }
   else if (ndf < 1 + eps) {   /* df ~= 1 */
     prob = P * M_PI_2;
     q = Math.cos(prob)/Math.sin(prob);
   }
   else {      /*-- usual case;  including, e.g.,  df = 1.1 */
     a = 1 / (ndf - 0.5);
     b = 48 / (a * a);
     c = ((20700 * a / b - 98) * a - 16) * a + 96.36;
     d = ((94.5 / (b + c) - 3) / b + 1) * Math.sqrt(a * M_PI_2) * ndf;
     y = Math.pow(d * P, 2 / ndf);
     if (y > 0.05 + a) {
       /* Asymptotic inverse expansion about normal */
       x = qnorm(0.5 * P);
       y = x * x;
       if (ndf < 5)
         c += 0.3 * (ndf - 4.5) * (x + 0.6);
       c = (((0.05 * d * x - 5) * x - 7) * x - 2) * x + b + c;
       y = (((((0.4 * y + 6.3) * y + 36) * y + 94.5) / c - y - 3) / b + 1) * x;
       y = a * y * y;
       if (y > 0.002)
         y = Math.exp(y) - 1;
       else { /* Taylor of    e^y -1 : */
         y = (0.5 * y + 1) * y;
       }
     }
     else {
       y = ((1 / (((ndf + 6) / (ndf * y) - 0.089 * d - 0.822)
           * (ndf + 2) * 3) + 0.5 / (ndf + 4))
           * y - 1) * (ndf + 1) / (ndf + 2) + 1 / y;
     }
     q = Math.sqrt(ndf * y);
   }
   if(neg) q = -q;
   return q;
}

/** * @(#)pt.js * * Copyright (c) 2000 by Sundar Dorai-Raj
  * * @author Sundar Dorai-Raj
  * * Email: sdoraira@vt.edu
  * * This program is free software; you can redistribute it and/or
  * * modify it under the terms of the GNU General Public License 
  * * as published by the Free Software Foundation; either version 2 
  * * of the License, or (at your option) any later version, 
  * * provided that any use properly credits the author. 
  * * This program is distributed in the hope that it will be useful,
  * * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  * * GNU General Public License for more details at http://www.gnu.org * * */

function pt(t,df,lower_tail) {
  t=parseFloat(t);
  df=parseFloat(df);
  lower_tail=true;
  if(df>4e5) 
  {
    val = 1./(4.*df);
    return pnorm(t*(1. - val)/Math.sqrt(1. + t*t*2.*val),!lower_tail);
  }
  val = pbeta(df/(df+t*t),df/2.0,0.5,true);
  if(t<=0) lower_tail=!lower_tail;
  val/=2.0;
  return (lower_tail ? 1-val:val);
}

/** * @(#)qnorm.js * * Copyright (c) 2000 by Sundar Dorai-Raj
  * * @author Sundar Dorai-Raj
  * * Email: sdoraira@vt.edu
  * * This program is free software; you can redistribute it and/or
  * * modify it under the terms of the GNU General Public License 
  * * as published by the Free Software Foundation; either version 2 
  * * of the License, or (at your option) any later version, 
  * * provided that any use properly credits the author. 
  * * This program is distributed in the hope that it will be useful,
  * * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  * * GNU General Public License for more details at http://www.gnu.org * * */

  function qnorm(p) {
    // ALGORITHM AS 111, APPL.STATIST., VOL.26, 118-121, 1977.
    // Computes z=invNorm(p)
    p=parseFloat(p);
    split=0.42;
    a0=  2.50662823884;
    a1=-18.61500062529;
    a2= 41.39119773534;
    a3=-25.44106049637;
    b1= -8.47351093090;
    b2= 23.08336743743;
    b3=-21.06224101826;
    b4=  3.13082909833;
    c0= -2.78718931138;
    c1= -2.29796479134;
    c2=  4.85014127135;
    c3=  2.32121276858;
    d1=  3.54388924762;
    d2=  1.63706781897;
    q=p-0.5;
    if(Math.abs(q)<=split) {
      r=q*q;
      ppnd=q*(((a3*r+a2)*r+a1)*r+a0)/((((b4*r+b3)*r+b2)*r+b1)*r+1);
    }
    else {
      r=p;
      if(q>0) r=1-p;
      if(r>0) {
        r=Math.sqrt(-Math.log(r));
        ppnd=(((c3*r+c2)*r+c1)*r+c0)/((d2*r+d1)*r+1);
        if(q<0) ppnd=-ppnd;
      }
      else {
        ppnd=0;
      }
    }
    return(ppnd);
  }
  
/** * @(#)pf.js * * Copyright (c) 2000 by Sundar Dorai-Raj
  * * @author Sundar Dorai-Raj
  * * Email: sdoraira@vt.edu
  * * This program is free software; you can redistribute it and/or
  * * modify it under the terms of the GNU General Public License 
  * * as published by the Free Software Foundation; either version 2 
  * * of the License, or (at your option) any later version, 
  * * provided that any use properly credits the author. 
  * * This program is distributed in the hope that it will be useful,
  * * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  * * GNU General Public License for more details at http://www.gnu.org * * */

  // "Applied Statistics Algorithms" (1985)
  // P. Griffiths and I. D. Hill, editors

  function lnbeta(a,b) {
    return(lngamma(a)+lngamma(b)-lngamma(a+b));
  }

  function betainv(x1,p,q) {
    // ALGORITHM AS 63 APPL. STATIST. VOL.32, NO.1
    // Computes P(Beta>x)
    beta=lnbeta(p,q);
    acu=1e-14;
    if(p<=0 || q<=0) return(-1);
    if(x1<=0 || x1>=1) return(-1);
    psq=p+q;
    cx=1-x1;
    if(p<psq*x1) {
      x2=cx;
      cx=x1;
      pp=q;
      qq=p;
      indx=true;
    }
    else {
      x2=x1;
      pp=p;
      qq=q;
      indx=false;
    }
    term=1;
    ai=1;
    betain=1;
    ns=qq+cx*psq;
    rx=x2/cx;
    temp=qq-ai;
    if(ns==0) rx=x2;
    while(temp>acu && temp>acu*betain) {
      term=term*temp*rx/(pp+ai);
      betain=betain+term;
      temp=Math.abs(term);
      if(temp>acu && temp>acu*betain) {
        ai++;
        ns--;
        if(ns>=0) {
          temp=qq-ai;
            if(ns==0) rx=x2;
        }
        else {
          temp=psq;
          psq+=1;
        }
      }
    }
    betain*=Math.exp(pp*Math.log(x2)+(qq-1)*Math.log(cx)-beta)/pp;
    if(indx) betain=1-betain;
    return(betain);
  }

  function pf(f,df1,df2) {
    // ALGORITHM AS 63 APPL. STATIST. VOL.32, NO.1
    // Computes P(F>x)
    f=parseFloat(f);
    df1=parseInt(df1);
    df2=parseInt(df2);
    return(betainv(df1*f/(df1*f+df2),0.5*df1,0.5*df2));
  }  

function zFromP(p){
//function InvNormalP( p ) {  //function renamed by Andy Dean, 2003
   // Odeh & Evans. 1974. AS 70. Applied Statistics. 23: 96-97
   //Code taken from Terry Ritter, http://www.ciphersbyritter.com/JAVASCRP/NORMCHIK.HTM#Normal
   //No copyright or license found in source   Thank you, Terry.
   var
      p0 = -0.322232431088,
      p1 = -1.0,
      p2 = -0.342242088547,
      p3 = -0.0204231210245,
      p4 = -0.453642210148E-4,
      q0 =  0.0993484626060,
      q1 =  0.588581570495,
      q2 =  0.531103462366,
      q3 =  0.103537752850,
      q4 =  0.38560700634E-2,
      pp, y, xp;

   // p: 0.0 .. 1.0 -> pp: 0.0 .. 0.5 .. 0.0
   if (p < 0.5)  pp = p;  else  pp = 1 - p;

   if (pp < 1E-12)
      xp = 99;
   else {
      y = Math.sqrt(Math.log(1/(pp*pp)));
      xp = y + ((((y * p4 + p3) * y + p2) * y + p1) * y + p0) /
               ((((y * q4 + q3) * y + q2) * y + q1) * y + q0);
      }

   if (p < 0.5)  return -xp;
   else  return  xp;
   }  

var Pi=Math.PI; var PiD2=Pi/2; var PiD4=Pi/4; var Pi2=2*Pi
var e=2.718281828459045235; var e10 = 1.105170918075647625
var Deg=180/Pi
//The following F distribution functions are from John Pezzullo's page at http://members.aol.com/johnp71/pdfs.html
function FishF(f,n1,n2) 
    {
	
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
	
	function StatCom(q,i,j,b) {
    var zz=1; var z=zz; var k=i; while(k<=j) { zz=zz*q*k/(k-b); z=z+zz; k=k+2 }
    return z
    }
}

function FfromP(p,df1,df2) 
   { 
    var v=0.5; var dv=0.5; var f=0
    while(dv>1e-10)    //was -10 
	 { 
	   f=1/v-1; 
	   dv=dv/2; 
	   if(FishF(f,df1,df2)>p) 
	     { v=v-dv } 
		 else 
		 { v=v+dv } 
	  }
    return f
   }

function PfromF(p,df1,df2)
{
  return FishF(p,df1,df2);
}
//End of F distribution functions


function proportion95CL(vx,vN,type)
 {  var pcl=new Array(3);
    
    var vP=vx/vN;
	pcl[0]=vP;
	
	if (type=="Wilson")
	{
 //score method, also known as Wilson's method;
    if (vP == 0) var vSL = 0;
    else var vSL = (vN/(vN+3.8416))*((vP+(3.8416/(2*vN)))-1.96*Math.sqrt(((vx*(vN-vx)/(vN*vN*vN))+(3.8416/(4*vN*vN)))));
	pcl[1]=vSL;
    if (vP == 1) var vSU = 1;
    else var vSU = (vN/(vN+3.8416))*((vP+(3.8416/(2*vN)))+1.96*Math.sqrt(((vx*(vN-vx)/(vN*vN*vN))+(3.8416/(4*vN*vN)))));
	pcl[2]=vSU;
	}
	else 
	if (type=="Fleiss")
	{
	//Score with continuity correction, Fleiss Quadratic method;
    if (vP == 0) var vSCL = 0;
    else var vSCL = ((2 * vN * vP + 3.8416 - 1) - 1.96 * Math.sqrt(3.8416 - (2 + 1 / vN)+ 4 * vP * (vN * (1 - vP) + 1))) / (2 * (vN + 3.8416))
    pcl[1]=vSCL;
	if (vP ==1 ) var vSCU = 1;
    else var vSCU = ((2 * vN * vP + 3.8416 + 1) + 1.96 * Math.sqrt(3.8416 + (2 - 1 / vN)+ 4 * vP * (vN * (1 - vP) - 1))) / (2 * (vN + 3.8416))
	pcl[2]=vSCU;
	}
	else
	{alert("Confidence interval ,"+type+", does not exist. Legal types are 'Wilson' and 'Fleiss'.");}
	return pcl;
 }