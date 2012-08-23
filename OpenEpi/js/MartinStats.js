// JavaScript Document
function martinStats(cmdObj)
{
    //the constructor for the Martin Exact statistics module for 2 x 2 tables
	//   This program was converted from Pascal and the old program is included as comments.
//   In general, the DLL exports 3 functions:
//       Strat2x2(DataArray As Variant, ConfLevel As Double, ResultArray As Variant) As Variant
//       MatchedCC(DataArray As Variant, ConfLevel As Double, ResultArray As Variant) As Variant
//       PersonTime(DataArray As Variant, ConfLevel As Double, ResultArray As Variant) As Variant
//   For all 3:
//       DataArray is a standard IEpiFace data array
//       ResultArray is a standard IEpiface result array
//       The return is a string containing standard text output (not HTML)
//   Each of the 3 calls Process with its data and a data type indicator
//   Process moves the data from the data array into Tables, an array of 2x2 tables
//   It then calls CheckData to determine if the data are well conditioned
//   If not, the result is an error message and Process returns
//   If so, it then calls the routines for calculating the statistics
//   Then it prepares the output and returns
//

//Converted from Visual Basic and Pascal to JavaScript by Andy Dean, August 2003.
//Made into an object class to work with the OpenEpi framework (www.openepi.com)
//{----------------------------------------------------------------------------}
//{                                                                            }
//{  This is a bare-bones program which calculates the conditional maximum     }
//{  likelihood estimate, exact confidence limits, and exact P-values for      }
//{  either an an odds ratio (given a series of 2x2 tables with person-count   }
//{  denominators) or a rate ratio (given a series of 2x2 tables with person-  }
//{  time denominators). It utilizes an efficient algorithm for calculating    }
//{  the coefficients of the conditional distribution as described in the      }
//{  references. To increase execution speed, the arithmetic is performed on   }
//{  the natural scale (not the log scale). To avoid floating point overflow,  }
//{  extended precision (10 byte) reals are used at critical points.           }
//{  Otherwise, double precision (8 byte) reals are used. This program is      }
//{  released to the public domain.                                            }
//{                                                                            }
//{  References:                                                               }
//{     1. Martin,D; Austin,H (1991): An efficient program for computing       }
//{        conditional maximum likelihood estimates and exact confidence       }
//{        limits for a common odds ratio. Epidemiology 2, 359-362.            }
//{     2. Martin,DO; Austin,H (1996): Exact estimates for a rate ratio.       }
//{        Epidemiology 7, 29-33.                                              }
//{                                                                            }
//{  Author: David O. Martin, MD, MPH                                          }
//{                                                                            }
//{  Send questions or comments via e-mail to domartin@aol.com                 }
//{                                                                            }
//{----------------------------------------------------------------------------}
//
	//The string to build as html
	this.resultString  = ""
	this.resultArray=new Array();
	this.cmdObj=cmdObj;
	
	//alert("MS 56   cmdObj.data[1].E0D0=" + cmdObj.data[1].E0D0);
	//JavaScript
this.MAXNTABLES = 1000        // Apparently never used (was 100)  Max # "unique" 2x2 tables 
this.MAXDEGREE = 100000       // Max degree of a polynomial 
this.MAXITER = 10000          // Max # of iterations to bracket/converge to a root, originally 10,000
this.TOLERANCE = 0.0000001    // Relative tolerance in results 
this.INFINITY = Number.NEGATIVE_INFINITY
//was-16777211;       //     { Used to represent infinity }
this.NAN = NaN
//was-16777212;            //                { Used to represent "Not A Number" }
//

//type
//   {-------------------------------------------------------------------------}
//   {  Stratified case-control data, matched case-control data, and           }
//   {  stratified person-time data are all held in a record (Rec2x2). With    }
//   {  stratified case-control data, the record is defined so that:           }
//   {                                                                         }
//   {                           Exposed        Non-Exposed       Total        }
//   {        Diseased              a                 b             m1         }
//   {        Non-Diseased          c                 d             m0         }
//   {        ---------------------------------------------------------        }
//   {        Total                 n1                n0             t         }
//   {                                                                         }
//   {  For stratified case-control data, FREQ is set to 1. For matched case-  }
//   {  control data, the record is defined in the same way except that FREQ   }
//   {  corresponds to the frequency of like 2x2 tables. Note that for         }
//   {  matched data, M1 must ALWAYS equal 1.                                  }
//   {                                                                         }
//   {  For stratified person-time data, the record is defined so that:        }
//   {                                                                         }
//   {                           Exposed        Non-Exposed       Total        }
//   {        Diseased              a                 b             m1         }
//   {        Person-Time           n1                n0             t         }
//   {                                                                         }
//   {  For stratified person-time data, FREQ is set to 1. For all types of    }
//   {  data, the variable INFORMATIVE is TRUE if no margins of the given 2x2  }
//   {  table are zero, otherwise INFORMATIVE is FALSE.                        }
//   {-------------------------------------------------------------------------}
//

//
// //  Ar2x2 = array[1..MAXNTABLES] of Rec2x2;         { Array of 2x2 table data }
//
//   {-----------------------------------------------------------}
//   { The polynomials are manipulated as arrays of coefficients }
//   {-----------------------------------------------------------}
//
//   Vector = array[0..MAXDEGREE] of extended;         { Array of coefficients }


   this.NumColumns 
   this.NumRows 
   this.NumStrata    //: Integer;  {AD}
   this.Tables=new Array()  //      {List to be filled with Table objects}

   this.sumA=0 //      : longint;   { Sum of the observed "a" cells }
   this.minSumA=0 //   : longint;   { Lowest value of "a" cell sum w/ given margins }
   this.maxSumA=0  //  : longint;   { Highest value of "a" cell sum w/ given margins }

   this.polyD = new Array()    //     : Vector;    { The polynomial of conditional coefficients }
   this.degD =0  //      : integer;   { The degree of polyD }

   this.value =0.0 //    : double;    { Used in defining Func }

   this.polyN = new Array()    //     : Vector;    { The "numerator" polynomial in Func }
   this.degN =0;
	this.strat2x2=Strat2x2;
	this.matchedCC=MatchedCC;
	this.personTime=PersonTime;
	this.process=Process;
	this.checkData=CheckData;
	this.calcExactLim=CalcExactLim
    this.getExactLim=GetExactLim
    this.calcCmle=CalcCmle
    this.getCmle=GetCmle
    this.calcExactPVals=CalcExactPVals
    this.zero=Zero
    this.bracketRoot=BracketRoot
    this.evalPoly=EvalPoly
    this.func=Func
    this.calcPoly=CalcPoly
    this.multPoly=MultPoly
    this.binomialExpansion=BinomialExpansion
    this.polyStratCC=PolyStratCC
    this.polyMatchCC=PolyMatchCC
    this.polyStratPT=PolyStratPT
    this.converge=Converge
    this.dPlaces=DPlaces  //never called, it seems
    this.comb=Comb
	this.addToArray=AddToArray; 
	this.cmdObj=cmdObj;
    this.confLevel=this.cmdObj.data[0].conflevel
	if (this.confLevel>1) {this.confLevel=this.confLevel/100}
	
	this.getData=getData;  //Never called, apparently
}
var probspec=t("Problem in specifying stratum in MartinStats module." );

function getData(stratum)
{
var dataArray = new Array();
if (stratum=="Crude")
    {
	 dataArray=this.cmdObj.crudeTable();
	}
   else if (stratum=="Adjusted")
    {
	 dataArray=this.cmdObj.data;
	} 
   else if (parseInt(stratum)>0)
    {
	 dataArray=this.cmdObj.data[parseInt(stratum)]
	}
   else
    {
	 alert(probspec)
	 return false
	} 

return dataArray	
}
	
function Strat2x2(stratum,ORbased,RRbased,assoc,references)     
{
  // var dataArray=this.getData(stratum)
  // if (dataArray)
   //{		
     this.process(stratum,1, this.confLevel,ORbased,RRbased,assoc,references)  
   //} 
}

function MatchedCC(stratum,ORbased,RRbased,assoc,references)     
{
   
   this.process(stratum, 2, this.confLevel,ORbased,RRbased,assoc,references)   

}
function PersonTime(stratum,ORbased,RRbased,assoc,references)     
{					
   this.process(stratum, 3, this.confLevel,ORbased,RRbased,assoc,references)  
}

function CheckData(DataType)
{
//       dataType  : integer;  { i: Type of data }
//       numTables : integer;  { i: Number of "unique" 2x2 tables }
//   var tables    : TList;    { i: Array of 2x2 table data }
//   var error     : integer); { o: Flags error in data }
//{
//   This routine determines if the data allow exact estimates to be calculated.
//   It MUST be called once prior to calling CalcPoly() given below. DATATYPE
//   indicates the type of data to be analyzed (1 = stratified case-control,
//   2 = matched case-control, 3 = stratified person-time). Exact estimates
//   can only be calculated if ERROR = 0.
//
//   Errors : 0 = can calc exact estimates, i.e., no error,
//            1 = too much data (MAXDEGREE too small),
//            2 = no informative strata.
//            3 = More than one case in a Matched Table (added July 21, 1998)
//}
//var
var i
var curTbl = new Array()
//begin
   error = 0
//
//   { Compute the global vars SUMA, MINSUMA, MAXSUMA }
   this.sumA = 0
   this.minSumA = 0
   this.maxSumA = 0
//
   for( i = 0; i< this.Tables.length; i++)
    {
      curTbl = this.Tables[i]
     
	/*   alert( "Stratum="+i+
      "\na="+curTbl.a+
	  "\nb="+curTbl.b+
	  "\nc="+curTbl.c+
	  "\nd="+curTbl.d+
	  "\nfreq="+curTbl.freq+
	  "\nm1="+curTbl.m1+
	  "\nn1="+curTbl.n1+
	  "\nn0="+curTbl.n0+
	  "\ninformative="+curTbl.informative+
	  "\nthis.Tables.length="+this.Tables.length+
	  "\nDataType="+DataType)  
	  */
        if ( curTbl.informative ) 
          {
			this.sumA += Math.round(curTbl.a * curTbl.freq)
        	if ( (DataType == 1) || (DataType == 2) ) 
   			{
 //                { Case-control data }
            	this.minSumA += Math.round(Math.max(0, curTbl.m1 - curTbl.n0) * curTbl.freq) 
            	this.maxSumA += Math.round(Math.min(curTbl.m1, curTbl.n1) * curTbl.freq) 
           //  alert("minSumA="+this.minSumA+
			//        "\nmaxSumA="+this.maxSumA)   
		 	}
		   else if (DataType==3)
			{
 //                                       { Person-time data }
            	this.minSumA = 0
            	this.maxSumA += Math.round(curTbl.m1 * curTbl.freq)
	//	alert("at 261 stratum,freq, cur m1, maxSumA,this.sumA="+i+","+curTbl.freq+","+curTbl.m1+","+this.maxSumA+","+this.sumA) 
         	}
       	  }

//   { Check for errors }
       if ( (this.maxSumA - this.minSumA > this.MAXDEGREE) ) 
         {
              //  Poly too small 
             error = 1
         } 
       else if (this.minSumA == this.maxSumA) 
         {
             //   No informative strata 
            error = 2
         } 
       else if ( (DataType == 2) && (curTbl.a > 1) ) 
         {
            error = 3
         }   
 } //  for loop
 
 return error;
}//CheckData 



function Process(stratum, DataType, pnConfLevel,ORbased,RRbased,assoc,references) 
{				 
   var b, c, d  //    { b, c, d cells of 2x2 table }
   var numTables  //   { Number of "unique" 2x2 tables }
 
   var cmle        //    { Odds Ratio (cond. max. likelihood estimate) }
   var loFishLim   //    { Lower exact Fisher confidence limit }
   var upFishLim   //    { Upper exact Fisher confidence limit }
   var loMidPLim   //    { Lower mid-P confidence limit }
   var upMidPLim   //    { Upper mid-P confidence limit }
   var pValues=new Array()  //Holds all 4 p values
   var approx  //    { An approximation to the exact estimate }
   var error  //   { Error in procedure CheckData }
   var s  // temporary string
   var i   //temporary number
   var errornum   //
   this.resultString = ""  //
   this.resultArray= new Array()
   var  NumColumns = this.cmdObj.data[0].cols
   var  NumRows = this.cmdObj.data[0].rows
   var firststratum, laststratum,NumStrata;
  // initialize variables
   this.polyD = new Array()    //     : Vector;    { The polynomial of conditional coefficients }
   this.degD =0  //      : integer;   { The degree of polyD }
   this.value =0.0 //    : double;    { Used in defining Func }
   this.polyN = new Array()    //     : Vector;    { The "numerator" polynomial in Func }
   this.degN =0;
   var cl=pnConfLevel*100    //Confidence limit for output formatting
   
   this.Tables=new Array()   //initialize Tables array
   NumStrata = this.cmdObj.data[0].strata; //May be reset to 1 if only one table is currently
                                           //being processed
   var totalstrata=this.cmdObj.data[0].strata;  //Number of strata in dataset
   function addCCTbl(a,b,c,d,freq,tableArray)
    {
        var tbl=new Array();
		//Jan 2007  Added parseFloats below
		    tbl.a=parseFloat(a);tbl.b=parseFloat(b);tbl.c=parseFloat(c);tbl.d=parseFloat(d);tbl.freq=parseFloat(freq);
			tbl.m1 = tbl.a + tbl.b // { # cases }
            tbl.n1 = tbl.a + tbl.c // { # exposed }
            tbl.n0 = tbl.b + tbl.d //           { # unexposed }
            tbl.informative = (tbl.a * tbl.d != 0) || (tbl.b * tbl.c != 0)
			tableArray[tableArray.length]=tbl; 		
	}  
   
   if (stratum==0) {stratum="Adjusted"}
   if (stratum=="Adjusted") 
    {   
	 
	 firststratum=1
	 laststratum=NumStrata
	 // alert("stratum=adjusted "+firststratum+" "+laststratum)
	}
	else if (parseInt(stratum)>0)
	{
	  NumStrata=1;
	  firststratum=stratum
	  laststratum=stratum
	}
	else if (stratum=="Crude")
    {
      dataTable=this.cmdObj.crudeTable()
	  firststratum=1
	  laststratum=1
    }
   var tbl = new Array()
   //alert("as defined tbl="+tbl)
    //ReDim Tables(NumStrata - 1)
	//alert("in 355, stratum, firststratum, laststratum="+stratum +", "+firststratum+", "+ laststratum);
   for (i = firststratum; i<= laststratum; i++)
	  {
	   tbl=new Array()
	   //tbl=null;
	   //tbl.length=0;
       if ( DataType == 1 )
       { 
 //                    { Stratified case-control }
         if (stratum=="Crude")
		 {
		 tbl.a = parseFloat(dataTable.E1D1)  
         tbl.b = parseFloat(dataTable.E0D1)   
         tbl.c = parseFloat(dataTable.E1D0)  
         tbl.d = parseFloat(dataTable.E0D0)  
		/*
		 alert("tbl.a crude="+tbl.a
		 +"\nb="+tbl.b
		 +"\nc="+tbl.c
		 +"\nd="+tbl.d)
		 */
		 }
		 else
		 {
		 tbl.a = parseFloat(this.cmdObj.data[i].E1D1)  
         tbl.b = parseFloat(this.cmdObj.data[i].E0D1)   
         tbl.c = parseFloat(this.cmdObj.data[i].E1D0)  
         tbl.d = parseFloat(this.cmdObj.data[i].E0D0)  
         }
		 
		 //alert(" 378 in MartinStats tbl.a="+ tbl.a);
	
         tbl.freq = 1 //
         tbl.m1 = tbl.a + tbl.b // { # cases }
         tbl.n1 = tbl.a + tbl.c // { # exposed }
         tbl.n0 = tbl.b + tbl.d // { # unexposed }
         tbl.informative = ((tbl.a * tbl.d) != 0) || ((tbl.b * tbl.c) != 0) 
		// alert(" 385 in MartinStats tbl.n1="+ tbl.n0);
   /*
	  alert( "stratum="+stratum+
	  "\ni="+i+
      "\na="+tbl.a+
	  "\nb="+tbl.b+
	  "\nc="+tbl.c+
	  "\nd="+tbl.d+
	  "\nfreq="+tbl.freq+
	  "\nm1="+tbl.m1+
	  "\nn1="+tbl.n1+
	  "\nn0="+tbl.n0+
	  "\ninformative="+tbl.informative+
	  "\nthis.cmdObj.data[1].E1D1="+this.cmdObj.data[1].E1D1) 
	 */  
	    }	
      else if(DataType == 2) 
        {  
		    
           //      Matched case-control 
		    if (this.cmdObj.data[0].numD==2 && 
		        this.cmdObj.data[0].numE==2)
		    {
			   //Two by two table.  Must be 1 to 1 matching.
			   //Other tables can be accomodated, but right now, we
			   //are setting up tables only for 1 to 1 matching.
			   //There are four possible tables, with frequencies 
			   //represented by the counts of pairs entered in OpenEpi.
			/*addCCTbl(1,0,0,1,this.cmdObj.data[i].E1D0,this.Tables); //
			addCCTbl(1,0,1,0,this.cmdObj.data[i].E1D1,this.Tables); // d cell on the screen
			addCCTbl(0,1,0,1,this.cmdObj.data[i].E0D0,this.Tables);// a cell
			addCCTbl(0,1,1,0,this.cmdObj.data[i].E0D1,this.Tables);
			SWITCHED TABLE VALUES FOR FIRST AND LAST BELOW--EXPERIMENT Nov 2007
			It corrected the problem of inverse odds ratios, so here it is!!!
			*/
			addCCTbl(0,1,1,0,this.cmdObj.data[i].E1D0,this.Tables); // c cell on the screen
			addCCTbl(1,0,1,0,this.cmdObj.data[i].E1D1,this.Tables); // d cell 
			addCCTbl(0,1,0,1,this.cmdObj.data[i].E0D0,this.Tables);// a cell
			addCCTbl(1,0,0,1,this.cmdObj.data[i].E0D1,this.Tables); // b cell
			
			/*
			alert(this.cmdObj.data[i].E1D0 + " for E1D0"); //
			alert(this.cmdObj.data[i].E1D1+ " for E1D1"); // d cell on the screen
			alert(this.cmdObj.data[i].E0D0+ " for E0D0");// a cell
			alert(this.cmdObj.data[i].E0D1+ " for E0D1");
			*/ 
			   			
			}
           /*  tbl.a = this.cmdObj.data[i].E1D1  //
             tbl.c = this.cmdObj.data[i].E1D0   //
             tbl.d = this.cmdObj.data[i].E0D0   //
            // tbl.freq = pvaDataArray(2, 2, i)   //

            if ( tbl.a <= 1 ) 
            {
               b = 1 - tbl.a
            }
            else
            {
               b = -1
            }
            tbl.m1 = tbl.a + tbl.b // { # cases }
            tbl.n1 = tbl.a + tbl.c // { # exposed }
            tbl.n0 = tbl.b + tbl.d //           { # unexposed }
            tbl.informative = (tbl.a * tbl.d != 0) || (tbl.b * tbl.c != 0) 
			*/
         }
	  else if ( DataType == 3 ) 
        {
          //    Stratified person-time 
		 if (stratum=="Crude")
		 {
		 tbl.a = dataTable.E0D0  
         tbl.b = dataTable.E0D1   
         tbl.n1 = dataTable.E1D0  
         tbl.n0 = dataTable.E1D1  
		/*
		 alert("tbl.a crude="+tbl.a
		 +"\nb="+tbl.b
		 +"\nc="+tbl.c
		 +"\nd="+tbl.d)
		 */
		 }
		 else
		 { 
         tbl.a = this.cmdObj.data[i].E0D0    //
         tbl.b = this.cmdObj.data[i].E0D1     //
         tbl.n1 = this.cmdObj.data[i].E1D0    //
         tbl.n0 = this.cmdObj.data[i].E1D1    //
		 }
		 
		
         tbl.freq = 1  //
         tbl.m1 = tbl.a + tbl.b  // { # cases }
         tbl.informative = (tbl.a * tbl.n0 != 0) 
		        || ((tbl.b * tbl.n1) != 0) 
		/*
		alert( "stratum="+stratum+
	  "\ni="+i+
      "\na="+tbl.a+
	  "\nb="+tbl.b+
	  "\nfreq="+tbl.freq+
	  "\nm1="+tbl.m1+
	  "\nn1="+tbl.n1+
	  "\nn0="+tbl.n0+
	  "\ninformative="+tbl.informative+
	  "\nthis.cmdObj.data[1].E1D1="+this.cmdObj.data[1].E1D1) 
	   */		
        }
     // End With
	 
	 if (DataType != 2) 
	  {
	  this.Tables[this.Tables.length]=tbl;
	  }
	// alert("450 this.Tables.length="+this.Tables.length);
   }//Next i
  /* alert("this.Tables has length="+this.Tables.length)
   for (i=0; i<this.Tables.length; i++)
    {
	  alert ("this.Tables["+i+"].a="+this.Tables[i].a)
	}
	*/
   errornum=this.checkData( DataType, this.Tables)  
   if ( errornum != 0 ) 
      {
	   if (errornum==1)
	       {
		     s=t("Exact calculations skipped, since numbers are large.  Use other results.")
			 this.cmdObj.title(s)
             this.addToArray(this.resultArray,  "ERROR", 1 )
		   }
       else if (errornum==2)
	       {
             s=t("All tables have zero marginals. Cannot perform exact calculations.")
             this.cmdObj.title(s)
             this.addToArray(this.resultArray,  "ERROR", 2) 
		   } //
       else if (errornum==3)
	       {
             s=t("PROBLEM: Must have only one case in each table for exact calculations.")
             this.cmdObj.title(s)
             this.addToArray(this.resultArray,  "ERROR", 3 )
		   }
       }
 
  if (errornum==0)
   {
     //errornum was 0
	// try
	//  {
        this.calcPoly (DataType)
        pValues=this.calcExactPVals()
        //alert("In 530 Martin cmle="+cmle);	
        cmle=this.calcCmle(1)
        //alert("In 532 Martin cmle="+cmle);
		
        if (isNaN(cmle)||!isFinite(cmle)) 
       	{
            approx = this.maxSumA
        }
        else
		{
            approx = cmle
        }
	// March 2007 experiment  :  Removed : 
	    if ((DataType==3) && (tbl.b==0)) {approx=cmle}	
        //alert ("in 542, approx="+approx + " Conf level="+pnConfLevel)
		
        upFishLim=this.calcExactLim (false, true, approx, pnConfLevel)

        upMidPLim=this.calcExactLim (false, false, approx, pnConfLevel)


        loFishLim=this.calcExactLim (true, true, approx, pnConfLevel)
        loMidPLim=this.calcExactLim (true, false, approx, pnConfLevel)
       // this.cmdObj.newtable(6,100)
        //this.cmdObj.line(6)
	    // was var but apparently already defined Mar 2007
		totalstrata=this.cmdObj.data[0].strata;
		if (stratum=="Adjusted" || stratum=="Crude" || totalstrata==1)
	    {
	      editorschoice1=editorschoice;
	    }
	    else
	    {
	      editorschoice1="";
	    }
		if (DataType==1 || DataType==2)
		  {
			//s="Exact Odds Ratio Estimates"
			//this.cmdObj.title(s)
			s="CMLE OR*" 
			references[0]='newrow("span6:*Conditional maximum likelihood estimate of Odds Ratio");' 
            ORbased[0]='newrow("c:bold:Stratum","c:bold:CMLE OR*","c:bold:span2:'+editorschoice1+'Mid-P Limits","c:bold:span2:Fisher Limits");'
			
			//newrow("span4:"+s,"",fmtSigFig(cmle,4))
		  }
		  else if (DataType==3)
		  {
			//s="Exact Rate Ratio Estimates"
			//this.cmdObj.title(s)
			//s= "Conditional maximum likelihood estimate of Rate Ratio:"
			//this.cmdObj.newrow("span5:"+s,"",fmtSigFig(cmle,4)) 
			s="CMLE RR*" 
			references[0]='newrow("span6:*Conditional maximum likelihood estimate of Rate Ratio");' 
            //ORbased[0]='newrow("c:bold:Stratum","c:bold:CMLE RR*","c:bold:span2:Mid-P Limits","c:bold:span2:Fisher Limits");'
			//ORbased[0]+='\nline(6)' 
			RRbased[0]='newrow("c:bold:Stratum","c:bold:CMLE RR*","c:bold:span2:Mid-P Limits","c:bold:span2:Fisher Limits");'
			RRbased[0]+='\nline(6)'
		  }
	  // this.addToArray(this.resultArray,  "CMLE", fmtSigFig(cmle,4)) 
	   //this.cmdObj.line(6)
	  // s="Lower & Upper " + pnConfLevel+"%" + " Exact Fisher Limits:"  
	  // this.cmdObj.newrow("span4:"+s,fmtSigFig(loFishLim,4), fmtSigFig(upFishLim,4))
	 var index=stratum;
	 
	 if(index=="Adjusted") {index=totalstrata+2}
	 if (index=="Crude") {index=totalstrata+1}
	 	
	  var pstratum ="";
	  if (totalstrata>1) {pstratum=stratum}
	  //alert("pstratum="+pstratum +"NumStrata="+NumStrata);
	  ORbased[index]='\nnewrow("'+pstratum +'","span2:CMLE Odds Ratio*",'+fmtSigFig(cmle,4)+','
	  ORbased[index]+='"c:span2:'+limits(loMidPLim,upMidPLim,1)+'","'+editorschoice1+'Mid-P Exact");'
	  ORbased[index]+='\nnewrow("","span2:","","c:span2:'+limits(loFishLim,upFishLim,1)+'","Fisher Exact");'
      if (DataType==3)
	    {
		  //Person Time data
		//Thanks to Ray Simons for correcting the following.   Feb 2007
     /*  if (tbl.b==0)
       {
         alert ("tbl.b was 0  fixing cmle and upper mid-P and Fish CLs" + " cmle="+ cmle+" upMidPLim="+upMidPLim+" upFishLim="+upFishLim)
         
         
         }  */
		 
		RRbased[index]='\nnewrow("'+pstratum +'","span2:'+editorschoice1+'CMLE Rate Ratio*",'+fmtSigFig(cmle,4)+','
	    RRbased[index]+='"c:span2:'+limits(loMidPLim,upMidPLim,1)+'","'+editorschoice1+'Mid-P Exact");'
//alert("cmle="+cmle);
 
	    RRbased[index]+='\nnewrow("","span2:","","c:span2:'+limits(loFishLim,upFishLim,1)+'","Fisher Exact");'

		}

	   assoc[0]='newrow("c:bold:Stratum","c:span2:bold:Value","c:bold:p-value(1-tail)","c:bold:p-value(2-tail)");'
	   assoc[0]+='\nline(5)'
	  //2-tail p is minimum value for Fisher and mid-P from the two values offered
	  //(per Rothman)
	  var FishP1Tail;
	  var FishP1TailType;
	  
	  var midP1Tail;
	  var midP1TailType;
	  
	  
      
	 // if (pValues.upFishP<pValues.loFishP)   //June 2011
        if (pValues.upFishP<=pValues.loFishP)
	     {
		  FishP1TailType=""
		  FishP1Tail=pValues.upFishP;
		 } 
		else
		 {
		  //One tail type tests negative (protective) association
		  FishP1TailType="(P)"
		  FishP1Tail=pValues.loFishP;
		 } 
      //if (pValues.upMidP<pValues.loMidP)   //June 20011
	  if (pValues.upMidP<=pValues.loMidP)
	     {
		  midP1TailType=""
		  midP1Tail=pValues.upMidP;
		 } 
		else
		 {
		  //One tail type tests negative (protective) association
		  midP1TailType="(P)"
		  midP1Tail=pValues.loMidP;
		 }  
		 
	  var FishP2Tail=2*FishP1Tail;
          if (FishP2Tail>=1.0)
         {FishP2Tail=1.0}
         //Adjustment to prevent values > 1.0  April 2009
	  var midP2Tail=2*midP1Tail;
          if (midP2Tail>=1.0)
          {midP2Tail=1.0}
         //Adjustment to prevent values > 1.0  April 2009

	  var Fish1Tailstr="c:span2:"+fmtPValue(FishP1Tail,ConfLevel)+FishP1TailType;
	  //var midP1Tailstr="c:span2:"+"lower="+fmtPValue(pValues.loMidP,ConfLevel)+"<br>upper="+fmtPValue(pValues.upMidP,ConfLevel);
	  var midP1Tailstr="c:span2:"+fmtPValue(midP1Tail,ConfLevel)+midP1TailType;
	 
	  //assoc[index]='newrow("","c:span2:'+stratum+'","'+fmtPValue(FishP,ConfLevel)+'","'+fmtPValue(midP,ConfLevel)+'");'
	  assoc[index]='\nnewrow("","span2:Fisher exact","","'+Fish1Tailstr+'","c:span2:'+fmtPValue(FishP2Tail,ConfLevel)+ '");'
	  assoc[index]+='\nnewrow("","span2:'+editorschoice1+'Mid-P exact","","'+midP1Tailstr+'","c:span2:'+fmtPValue(midP2Tail,ConfLevel)+ '");' 
      
	   s="(P)indicates a one-tail P-value for Protective or negative association; otherwise one-tailed exact P-values are for a positive association.";
	   s+="<br>Martin,D; Austin,H (1991): An efficient program for computing "
	   s+="conditional maximum likelihood estimates and exact confidence "      
       s+="limits for a common odds ratio. Epidemiology 2, 359-362."
	   //this.cmdObj.newrow();
	   references[0]+='\nnewrow("span6:'+s+'")'            
       s="Martin,DO; Austin,H (1996): Exact estimates for a rate ratio."       
       s+="Epidemiology 7, 29-33."   
	   if (DataType==3)
	     {
		 references[0]+='\nnewrow("span6:'+s+'")' 
		 }
	   //endtable();
} //if errornum==0

}  //end of Process function

function CalcExactLim(pbLower, pbFisher, pvApprox, pnConfLevel)
{

   var pnLimit
   if ( (this.minSumA < this.sumA) && (this.sumA < this.maxSumA) ) 
   {
      pnLimit=this.getExactLim (pbLower, pbFisher, pvApprox, pnConfLevel)
   } 
   else if ( (this.sumA == this.minSumA) ) 
   {
  //   { Point estimate = 0 => pbLower pnLimit = 0 }
      if ( pbLower ) 
       {
	    // alert("pnLimit must be zero")
         pnLimit = 0
       }
      else
       {
         pnLimit= this.getExactLim( pbLower, pbFisher, pvApprox, pnConfLevel)
       }
   } 
   else if ( (this.sumA == this.maxSumA) ) 
   {
  //{ Point estimate = inf => upper pnLimit = inf}
      if ( !(pbLower) ) 
       {
        pnLimit = this.INFINITY
       }
      else
       {
        pnLimit= this.getExactLim( pbLower, pbFisher, pvApprox, pnConfLevel)
       }
   }
   return pnLimit;
}

function GetExactLim(pbLower, pbFisher, pvApprox, pnConfLevel)  
   {
    var i, error  //
    var pvLimit=null
      if ( pbLower ) 
         {
         this.value = 0.5 * (1 + pnConfLevel)  //{ = 1 - alpha / 2 }
         }
      else
         {
         this.value = 0.5 * (1 - pnConfLevel) //  alpha / 2 
         }
      if ( pbLower && pbFisher ) 
         {
  //                        { Degree of numerator poly }
         this.degN = this.sumA - this.minSumA - 1
         }
      else
         {
          this.degN = this.sumA - this.minSumA //
         }
       //redim polyN(degN)
      for( i = 0; i<= this.degN; i++)
        {
	     this.polyN[i] = this.polyD[i] //                             { this.degN!=this.degD => this.polyN!=this.polyD }
        }
      if ( !pbFisher ) 
        {
         this.polyN[this.degN] = (0.5) * this.polyD[this.degN] // Mid-P adjustment }
        }	
      pvLimit=this.converge(pvApprox)  //       { Solves so that Func(pvLimit) = 0 }
	return pvLimit	
}

function CalcCmle(approx)
{
   var cmle
  //alert("minSumA, sumA, maxSumA="+this.minSumA+","+this.sumA+","+this.maxSumA) 
 if ( (this.minSumA < this.sumA) && (this.sumA < this.maxSumA) ) 
     {
 //  { Can calc point estimate }
     //alert("Calculating cmle..")
      cmle=this.getCmle( approx)
     } 
   else if ( (this.sumA == this.minSumA) ) 
     {
 //  { Point estimate = 0 }
      cmle = 0
     } 
else if ( (this.sumA == this.maxSumA) ) 
     {
 //                      { Point estimate = inf }
      cmle = this.INFINITY
      }
//alert (" cmle in 775 CalcCmle = " +cmle); 	 
return cmle
}

function GetCmle(approx)
{
   var i, error,cmle
   this.value = this.sumA  //   { The sum of the observed "a" cells }
   //alert("this.degN in GetCmle="+this.degN)
   this.degN = this.degD //      { Degree of the numerator polyNomial }
   //alert ( "785 this.degN="+this.degN)
 //  for(i = 0; i<=this.degN; i++) //  { Defines the numerator polynomial }
     for(i = 0; i<=this.degN; i++) //  { Defines the numerator polynomial }
     {
	  this.polyN[i] = (this.minSumA + i) * this.polyD[i]
	  //alert("in GetCmle, this.polyN["+i+"]="+this.polyN[i])
     }
	 
//alert("791 polyD=" +this.polyD)	 
   cmle=this.converge( approx)  //         { Solves so that Func(cmle) = 0 }
  return cmle
}

//{---------------------------------------------------------------------------}
//{ The routines that follow return the exact P-values, the CMLE, or an exact }
//{ confidence limit.                                                         }
//{---------------------------------------------------------------------------}
//
//procedure CalcExactPVals(
//   var upFishPVal : double;  { o: The upper exact Fisher P-value }
//   var loFishPVal : double;  { o: The lower exact Fisher P-value }
//   var upMidPPVal : double;  { o: The upper exact mid-P P-value }
//   var loMidPPVal : double); { o: The lower exact mid-P P-value }
//{
//   This routine returns the exact P-values as defined in //Modern
//   Epidemiology // by K. J. Rothman (Little, Brown, and Co., 1986).
//}

function CalcExactPVals()
{
   var i, diff  //        { Index; sumA - minSumA }
   var upTail, denom  // { Upper tail; the whole distribution }
   var pValues= new Array();
 //alert("at 812, minSumA, sumA, maxSumA="+this.minSumA+","+this.sumA+","+this.maxSumA) 
   diff = this.sumA - this.minSumA
   upTail = this.polyD[this.degD]
   for (i = this.degD - 1; i>=diff; i-=1)
    {
    upTail = upTail + this.polyD[i]
    }
   denom = upTail
   for (i = diff - 1; i>=0; i-=1)
    {
	denom = denom + this.polyD[i]
    }
   pValues.upFishP = upTail / denom
   pValues.loFishP = 1.0 - (upTail - this.polyD[diff]) / denom
   pValues.upMidP = (upTail - 0.5 * this.polyD[diff]) / denom
   pValues.loMidP = 1.0 - pValues.upMidP
   return pValues
}


function Zero(nums)
{  //Takes in an array of x0,x1,f0, and f1 and returns a root or an error
   var root
   var found=false//              { Flags that a root has been found }
   var x2, f2, swap //        { Newest point, Func(X2), storage variable }
   var iter  //               { Current  of iterations }
   var x0=nums.x0;
   var x1=nums.x1;
   var f0=nums.f0;
   var f1=nums.f1;
   error = 0 //  { Initialize }
   iter = 0
   if ( Math.abs(f0) < Math.abs(f1) ) 
   {
    //             { Make X1 best approx to root }
      swap = x0;
	  x0 = x1;
	  x1 = swap;
      swap = f0;
	  f0 = f1;
	  f1 = swap;
   }
   found = (f1 == 0)    //    { Test for root }
   if ( !found && ((f0 * f1) > 0) ) 
      {
      error = 1 //            { Root not bracketed }
      }
   while (!(found) && (iter < this.MAXITER) && (error == 0))
   {
      iter = iter + 1
      x2 = x1 - f1 * (x1 - x0) / (f1 - f0)
      f2 = this.func(x2)
      if ( f1 * f2 < 0 ) 
       {
      //                      { X0 not retained }
         x0 = x1
         f0 = f1
       }
      else
      {
                        //    { X0 retained => modify F0 }
         f0 = f0 * f1 / (f1 + f2) // { The Pegasus modification }
      }
      x1 = x2
      f1 = f2
      found = ((Math.abs(x1 - x0) < (Math.abs(x1) * this.TOLERANCE)) || (f1 == 0))
      } //end of while loop
   root = x1 // { Estimated root }
   if ( !(found) && (iter >= this.MAXITER) && (error == 0) ) 
   {
	error=2                 // Too many iterations 
	//alert("Too many iterations in Zero function")
   }
   nums.error=error;
   return root
}
//
//{----------------------------------------------------------------------------}
//{ The routines that follow (BracketRoot, Zero, and Converge) locate a zero   }
//{ to the function Func .                                                }
//{----------------------------------------------------------------------------}
//


function BracketRoot(approx)
{  //Returns an array of x0,x1,f1,f0
   var iter
   var nums = new Array()
   
   iter = 0
   var x1 = Math.max(0.5, approx) //   { X1 is the upper bound }
   var x0 = 0  //              { X0 is the lower bound }
   var f0 = this.func(x0) //   { Func at X0 }
   var f1 = this.func(x1) //  { Func at X1 }
  // alert("In BracketRoot, approx, x1, x0, f0,f1="+approx+", "+x1+", "+x0+", "+f0+", "+f1)
   while ((f1 * f0) > 0.0 && (iter < this.MAXITER)) 
    {
	  iter = iter + 1
      x0 = x1  //What does this accomplish?  x0 does not seem to be used.
      f0 = f1
      x1 = x1 * 1.5 * iter
	  //alert("put in r ="+x1)
      f1 = this.func(x1)
	}
	nums.x1=x1
	nums.x0=x0
	nums.f1=f1
	nums.f0=f0
	return nums
}

//
//{----------------------------------------------------------------------------}
//{ Below is a routine for evaluating a polynomial. If the value at which the  }
//{ polynomial is being evaluated is > 1.0 then the polynomial is divided      }
//{ through by R^(degree of the poly). This helps to prevent floating point    }
//{ overflows but must be taken into account when evaluating Func below.       }
//{----------------------------------------------------------------------------}
//


function EvalPoly(c , degC, r) 
{
    var i
    var y 
    if ( r == 0 ) 
     {
        y = c[0]
     } 
    else if ( r <= 1 ) 
     {
        y = c[degC]
        if ( r < 1 ) 
        {
          for(i = (degC - 1);i>= 0; i-=1)
             {
			   y = y * (r) + c[i]
			 }  
        }
        else
        {
          for( i = (degC - 1); i>=0; i-=1)
			{
                y = y + c[i]
            }
        }
     } 
     else if ( r > 1 ) 
     {
       y = c[0]
       r = 1 / r
       for( i = 1; i<=degC; i++)
	     {
            y = y * (r) + c[i]
         }
      }
  return y
}


function Func(r)
{
   var numer , denom 
   numer = this.evalPoly(this.polyN, this.degN, r)
   denom = this.evalPoly(this.polyD, this.degD, r)  
   if ( r <= 1 ) 
    {
     return numer / denom - (this.value)
    }
   else
    {
	    return (numer / Math.pow(r ,(this.degD - this.degN)) / denom) - this.value
    }
}

//
//{--------------------------------------------------------------------}
//{ Now follows the key routine which outputs the "main" polynomial of }
//{ conditional distribution coefficients to be used to compute exact  }
//{ estimates.                                                         }
//{--------------------------------------------------------------------}
//


function CalcPoly(DataType)
{
//   This routine outputs the "main" polynomial of conditional distribution
//   coefficients which will subsequently be used to calculate the conditional
//   maximum likelihood estimate, exact confidence limits, and exact P-values.
//   The results are placed in the global variables, this.polyD and this.degD.
//   For a given data set, this routine MUST be called once before calling
//   CalcExactPVals(), CalcCmle(), and CalcExactLim(). Note that DATATYPE
//   indicates the type of data to be analyzed (1 = stratified case-control,
//   2 = matched case-control, 3 = stratified person-time).
   var poly1= new Array();
   var poly2= new Array()    //    { Intermediate polynomials }
   var i, j, deg1, deg2    //  { Index; degree of polynomials p1 & p2 }
   var CurTable=new Array()

   CurTable = this.Tables[0]
   if (DataType==1)
			{	 
			 this.degD=this.polyStratCC (CurTable, this.polyD)
			// alert("datatype 1: this.degD="+this.degD+" this.polyD.length="+this.polyD.length);
			}
   else if (DataType==2)
			{
			 this.degD=this.polyMatchCC (CurTable, this.polyD)
			}
   else if (DataType==3)
			{
			 this.degD=this.polyStratPT (CurTable, this.polyD)
			//alert(" 962 this.degD before decrementing="+this.degD + " this.polyD[1]="+this.polyD[1])
           // alert("datatype 3: this.degD="+this.degD+" this.polyD.length="+this.polyD.length);
			
			// this.degD--;  //Not found in Martin's code  Removed Nov 2003
		//	alert("this.degD="+this.degD + " this.polyD[1]="+this.polyD[1])
			}
   else
			{
			 alert("DataType of "+DataType+" must be incorrect.  It should be 1,2,or 3");
			 return
			}	
   
//Experiment Feb 2007   Changed 1 below to 0.  As it is, only strata after the first are processed.  Single tables are not
//for(i = 1; i<this.Tables.length;i++) 
   for(i = 1; i<this.Tables.length;i++)    
     {
	 
//alert("1046 this.Tables.length="+ this.Tables.length + " this.Tables[0].a="+  this.Tables[0].a)
	  CurTable = this.Tables[i]
      //alert ("at 1048, CurTable.a=" + CurTable.a)
	 // var poly1=new Array(); //Reinitialize Poly1  Nov 2003 Note mistaken capitalization in previous version.  Fixed to lower case
	  //Mar 2007
      if ( CurTable.informative ) 
        {
		    poly1.length=0; //Experiment 2007
			deg1 = this.degD
		//	alert("deg1 at 1053="+deg1+ " this.Tables.length="+this.Tables.length)
		// WAS for (j = 0; j<= deg1; j++) Experiment 2007
		
      		for (j = 0; j<= deg1; j++)    
			{
			   // Changed <= to <  Nov 2003 but this destroys single stratum calc.
			  // Copy this.polyD to poly1
        		poly1[j] = this.polyD[j]
            }
//alert(" at 1057 poly1="+ poly1[0]+ ", "+ poly1[poly1.length-1])
//alert("this.polyD=" + this.polyD[0]+ ", "+ this.polyD[this.polyD.length-1])
//alert("poly2="+ poly2[0]+ ", "+ poly2[poly2.length-1])
            if (DataType==1)
			{
			   deg2=this.polyStratCC (CurTable, poly2)
			}
			else if (DataType==2)
			{
			   deg2=this.polyMatchCC (CurTable, poly2)
			}
			else if (DataType==3)
			{
			   poly2.length=0; //Experiment 2007  Seems to work to get same results regardless of order of strata
		
			   deg2=this.polyStratPT (CurTable, poly2)   //Feb 2007 Changed from poly2 to poly1 as experiment.  Can't calculate
//alert(" 1079 i="+i+" deg2="+deg2 + " poly2.length="+poly2.length)
			}
			else
			{
			    alert("DataType of "+DataType+" must be incorrect.  It should be 1,2,or 3");
			    return
			}
//alert(" 1086 poly1="+poly1)
//alert(" poly2="+poly2)
//alert(" deg1="+deg1)
//alert(" deg2="+deg2)
//alert(" this.polyD="+this.polyD)		
            this.degD=this.multPoly( poly1, poly2, deg1, deg2, this.polyD)
//alert(" 1087 this.degD="+ this.degD)	
      } //if
     }  //for   
}

function MultPoly(p1 , p2 , deg1, deg2, p3 )
{
   var i, j
   deg3 = deg1 + deg2
   for (i = 0; i<=deg3; i++)
    {
	  p3[i] = 0.0
    }
   for (i = 0; i<=deg1; i++)
	  {
	   for (j = 0; j<=deg2; j++)  
         {
         p3[i + j] = p1[i] * p2[j] + p3[i + j]
         }
      }
	//alert("1025 deg1="+deg1+"  p1.length="+p1.length+"  deg2="+deg2+ "  p2.length="+p2.length+" deg3=this.polyD="+deg3+" p3.length="+p3.length);
 
	return deg3;  
} //; { MultPoly }


function BinomialExpansion(c0 , c1 , f, p, degp )
{
   var i
   //degp=f
   //alert("in BE, c0="+c0+ " c1="+c1+" f="+f)
   //var   Mar 2007  IE says degp already defined, but why is it being set equal to f
   // I don't see anything RETURNED from this function.  Shouldn't it DO something?
   degp = f
   p[degp] = Math.pow(c1, degp)
   for (i = degp - 1; i>=0; i--)
     {
	  p[i] = p[i + 1] * c0 * (i + 1) / (c1 *(degp - i))
//alert("in binomial expansion, p["+i+"]="+p[i])
	 }
     
}     //; { BinomialExpansion }

//
//{--------------------------------------------------------------}
//{ Routines are given to calculate stratum-specific polynomials }
//{--------------------------------------------------------------}
//
//{-----------------------------------------------------------------}
//{ Two polynomial multiplication routines are given. The first is  }
//{ a generic routine. The second uses the binomial expansion.      }
//{-----------------------------------------------------------------}
//
//procedure MultPoly(
//   var p1, p2     : Vector;    { i: Two polynomials }
//       deg1, deg2 : integer;   { i: The degrees of the above polynomials }
//   var p3         : Vector;    { o: The product polynomial of p1 * p2 }
//   var deg3       : integer);  { o: The degree of the product polynomial }
//{
//   This routine multiplies together two polynomials P1 and P2 to obtain
//   the product polynomial P3. Reference: //Algorithms 2nd ed.//, by R.
//   Sedgewick (Addison-Wesley, 1988), p. 522.
//

function PolyStratCC(Table, polyDi)
{
   var i
   var minA, maxA, aa, bb, cc, dd
   
   var degDi = 0
   polyDi[0] = 1.0
   with (Table)
   {
   if ( informative ) 
   {

      minA = Math.max(0, m1 - n0) //  { Min val of the "a" cell w/ these margins }
      maxA = Math.min(m1, n1) //   { Max val of the "a" cell w/ these margins }
      degDi = Math.round(maxA - minA) // { The degree of this table//s polynomial }
      aa = minA //                       { Corresponds to the "a" cell }
      bb = m1 - minA + 1 //              { Corresponds to the "b" cell }
      cc = n1 - minA + 1 //              { Corresponds to the "c" cell }
      dd = n0 - m1 + minA //             { Corresponds to the "d" cell }
      for (i = 1; i<= degDi; i++)
        {
		 polyDi[i] = polyDi[i - 1] * ((bb - i) / (aa + i)) * ((cc - i) / (dd + i))
        // alert("polyDi["+i+"]="+polyDi[i])
        }
    } //if
    } //with
	return degDi
} // { PolyStratCC }


function PolyMatchCC(Table, polyEi)
{
   var c0, c1
   var degEi = 0
   polyEi[0] = 1.0
   with (Table)
   {
   if ( informative ) 
   {

      c0 = (this.comb(n1, 0) * this.comb(n0, m1))    //Corresponds to 0 in "a" cell 
      c1 = (this.comb(n1, 1) * this.comb(n0, m1 - 1)) //Corresponds to 1 in "a" cell
      this.binomialExpansion (c0, c1, freq, polyEi, degEi)
   }
   } //end with
   return polyEi.length-1;  //Added -1 Nov 2003
}


//
//{--------------------------------------------------------------------------}
//{ The following routine is an alternative to the above. It is based on     }
//{ PolyStratCC() and the idea that by letting the c and d cells of a 2x2    }
//{ table approach infinity, the noncentral hypergeometric becomes binomial. }
//{ Unlike the above routine, this routine scales the coefficients so that   }
//{ the first coefficient is always 1.0.                                     }
//{--------------------------------------------------------------------------}
//
function PolyStratPT(Table,polyDi)
{
   var degDi = 0
  // ReDim polyDi(0)
  // polyDi=new Array();
   polyDi[0] = 1.0
   with (Table)
   {
   if ( informative ) 
    {
    //alert ("m1="+m1+"Table.m1="+Table.m1)
      this.binomialExpansion ((n0 / n1), 1.0, Math.round(m1), polyDi, degDi)
    }
   } //end with
   //alert("in 1209 polyDi.length="+polyDi.length);
   return polyDi.length-1; //Added -1  Nov 2003  Feb 2007 Tried zero and then + 1  experiment, but neither works
   
}



//
//procedure Converge(
//       approx : double;    { i: An approximation to the root }
//   var root   : double;    { o: The estimated root }
//   var error  : integer);  { o: Error code as defined in proc Zero above }
//{
//   This routine returns the root of Func above on the interval [0, infinity).
//}


function Converge(approx)
{
//Returns the root or an error 
   var nums = new Array()
   var rootc
   var error
   nums=this.bracketRoot(approx)
   rootc=this.zero(nums)
   if (nums.error==0)
     {
      return rootc
	 }
	else
	 {
	   return this.NAN
	 }   
}

function DPlaces(r)
{
   if ( Math.abs(r) >= 10000 ) 
   {
      return  0
   } 
else if ( Math.abs(r) >= 1000 ) 
   {
      return  1
   } 
else if ( Math.abs(r) >= 100 ) 
   {
      return  2
   } 
else if ( Math.abs(r) >= 10 ) 
   {
      return  3
   } 
else if ( (Math.abs(r) >= 0.01) || (r = 0) ) 
   {
      return  4
   }
else
   {
      return  -1
   }
}

function Comb(  y,   x)
{
// { Returns the combination y choose x. }
   var i
   var f
   
   f = 1.0
   for (i=1; i<=Math.round(Math.min(x,y-x));i++)
     {
	  f = f * y / i
      y = y - 1.0
	 }
   return f
}


function AddToArray(pvArray , psTitle , pvResult )
{
    this.resultArray['"'+psTitle+'"']=pvResult
}
