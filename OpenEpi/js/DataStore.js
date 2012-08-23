// DataStore.js
// JavaScript Document
// Data storage and retrieval functions
function storeAllToMem(currStratum, maxAtLeft, maxAtTop, expLeft )
{
if (!storeStratumDataToMem(currStratum, maxAtLeft, maxAtTop, expLeft ))
  {return false}
else
  {  
   storeMetaToMem(maxAtLeft, maxAtTop, expLeft)
 //  alert(jsStringFromArray(dataMatrix))  //for debugging
   return true;
  } 
}

function storeStratumDataToMem(currStratum, maxAtLeft, maxAtTop, expLeft )
{
//Assumes that myTable exists.  Rmin, rmax, cmin, and cmax will be set to indicate 
//the data area of the table.
var tc
var tr
var v=0;
var nodata=true;
//Copies data values in table to dataArray, a one-dimensional array containing 
//at index 0, metadata for the table, and at indices 1 through n, data for 1 
//through n strata in the form of associative (string indexed) arrays.
//"Disease" and "exposure" are assumed to be coded as ordered values, with 0 
//representing absence or the baseline category.  
//emax is the number of the last exposure category, beginning with 0.  
//dmax is the last disease category.

var currTable=new Array();   //will contain data for this stratum

//Find boundaries of data area.
var rmin=myTable.rows
var rmax=-1
var cmin=myTable.cols
var cmax=-1
//Find their values by searching for data cells. If the data area is not
//contiguous, it should not matter, as we test each cell below before
//treating its value as data.
for (var r=0; r<myTable.rows; r++)
 {
  for (var c=0; c< myTable.cols; c++)
    {
	  if (myTable.row[r].cell[c].type == "data")
	   {
	     if (r<rmin) {rmin=r}
		 if (r>rmax) {rmax=r}
		 if (c<cmin) {cmin=c}
		 if (c>cmax) {cmax=c}
	   }
	}
 }	
if (rmax==-1 || cmax==-1) 
{
alert("No cells of type 'data' found.  Can't make data array.")
}
else
{
//Populate array
for(tr=rmin; tr<=rmax; tr++) 
 {
   for (tc=cmin; tc<=cmax; tc++)
   {
     if ((myTable.row[tr].cell[tc].type=="data") || (myTable.row[tr].cell[tc].type=="calendar"))
	   //skips any cells within the data area that are not of type 'data'
        {
		 v=myTable.get(tr,tc);
	   //Get the entered cell value
		 if (v == "") 
		   {
		     v=0  //Sets empty cells to zero.  May want to change this.
		   }
		 else
		   {
		    nodata=false;
		   } 
		 //If cols in descending order make them ascending
		 if (maxAtLeft&&useTableSettings) 
		    {
			  newCol=parseInt(cmax-tc);
		    }
		 else 
		    {
			  newCol=parseInt(tc-cmin)
			}
		 //If rows in descending order make them ascending
		 if (maxAtTop&&useTableSettings) 
		    {
			  newRow=parseInt(rmax-tr);
		    }
		 else 
		    {
			  newRow=parseInt(tr-rmin)
			}
		 //If exposure is not on the left, transpose the matrix so that it is
		 if (expLeft || !useTableSettings) 
			{
			 //Set up with E as rows if exp is on left or table is not useTableSettings
			 currTable["E" + newRow + "D" + newCol]=v;
			}
		 else 
			{
			 currTable["E" + newCol + "D" + newRow]=v;
			}	
	    }	
    }
 } 
}
 
 if (nodata) 
   {return false} //Returns false if no data, otherwise true
 else 
   {
    dataMatrix[currentstratum]=currTable;
    return true;
   };   
 
}

function storeMetaToMem(maxAtLeft, maxAtTop, expLeft )
{
//Assumes that myTable exists.  Rmin, rmax, cmin, and cmax will be set to indicate 
//the data area of the table.
var c
var r
var v=0;
//Copies data values in table to dataArray, a one-dimensional array containing 
//at index 0, metadata for the table, and at indices 1 through n, data for 1 
//through n strata in the form of associative (string indexed) arrays.
//"Disease" and "exposure" are assumed to be coded as ordered values, with 0 
//representing absence or the baseline category.  
//emax is the number of the last exposure category, beginning with 0.  
//dmax is the last disease category.

var metaData=new Array();   //will contain data for stratum 0, the Meta Data

//Find boundaries of data area.
var rmin=myTable.rows
var rmax=-1
var cmin=myTable.cols
var cmax=-1
//Find their values by searching for data cells. If the data area is not
//contiguous, it should not matter, as we test each cell below before
//treating its value as data.
for (r=0; r<myTable.rows; r++)
 {
  for (c=0; c< myTable.cols; c++)
    {
	 
	  if (myTable.row[r].cell[c].type == "data")
	   {
	     if (r<rmin) {rmin=r}
		 if (r>rmax) {rmax=r}
		 if (c<cmin) {cmin=c}
		 if (c>cmax) {cmax=c}
	   }
	   
	}
 }	
metaData["title"]=myTable.headText;
metaData["datacmin"]=cmin
metaData["datacmax"]=cmax
metaData["datarmin"]=rmin
metaData["datarmax"]=rmax
metaData["numD"]=cmax-cmin+1
metaData["numE"]=rmax-rmin+1
//metaData["createdby"]= "\'"+opener.document.URL+"\'";
metaData["createdby"]= parent.document.URL;
metaData["cols"]=myTable.cols;
metaData["rows"]=myTable.rows;
metaData["maxatleft"]= maxAtLeft  ;
metaData["maxattop"]= maxAtTop  ;
metaData["expleft"]= expLeft ;
metaData["conflevel"]=ConfLevel;
metaData["nohighlight"]=Pvalues;
metaData["columnpercents"]=Columnpercents;
metaData["rowpercents"]=RowPercents;
metaData["usetablesettings"]=useTableSettings;
metaData["labels"]=0;
metaData["varnames"]=0
metaData["valnames"]=0
metaData["rowtots"]=0
metaData["coltots"]=0
metaData["grandtots"]=0
metaData["varD"]="Disease Variable"
metaData["varE"]="Exposure Variable"
metaData["varS"]="Stratifying Variable"
metaData["Dvals"]=new Array()  //Names or values of Disease values
metaData["Evals"]=new Array()  //Names or values of Exposure values
metaData["Svals"]=new Array()  //Names of Stratum values
//Store number of strata and, if more than one, their names
metaData["strata"]=dataMatrix.length-1
var FirstRowOfVals=-1 

if (dataMatrix.length>2)
  {
  //There must be some strata
  var strat=document.form1.theStratum
  for(i=0; i<strat.options.length;i++)
    {
      //metaData["stratum"+(i+1)]=strat.options[i].text
	  //metaData["stratumval"+(i+1)]=strat.options[i].value
	  metaData.Svals[metaData.Svals.length]=strat.options[i].text
    }
  }
for(r=0; r<myTable.rows; r++) 
 {
   metaData["R"+r]=new Array();
   metaData["R"+r+"type"]=new Array();
   var v;
   var tt;
   for (c=0; c<myTable.cols; c++)
    {    
	     
     	 v=myTable.get(r,c);  //get cell value
	   
		 tt=myTable.row[r].cell[c].type;  //cell type
		 
		 if (tt != "data" && tt.length>0)
		 { 
		  if (metaData[tt+"s"] != null)
		   { 
		     metaData[tt+"s"]+=1;   //Increment count for this type
									//e.g.,  metadata["labels"]
		   }
		 }
		 metaData["R"+r][c]=v;
		 metaData["R"+r+"type"][c]=tt;
		 if (tt=="valname")
		   {
		    if (FirstRowOfVals==(-1)){FirstRowOfVals=r}
			if (r==FirstRowOfVals)
			 {
			  //Put values in the first row of values into the Dvals array
			  metaData.Dvals[metaData.Dvals.length]=v
			  //alert("r="+r+" Dvals includes="+metaData.Dvals[metaData.Dvals.length-1])
			  //alert("Dvals.length="+metaData.Dvals.length+" Dval value="+metaData.Dvals[metaData.Dvals.length-1])
			 }
			else
			 {
			  metaData.Evals[metaData.Evals.length]=v
			 // alert("Eval value="+metaData.Evals[metaData.Evals.length-1])
			 } 
		   }
		 else if (tt=="varname")
		   {
		    if (metaData.varnames==1)
			  {
			   metaData.varD=v;
			  }
			else
			  {
			   metaData.varE=v;
			  } 
		   }	   
	 }
  }	 
  //alert("244 useTableSettings="+useTableSettings)
if (useTableSettings)
  { 
    var temp=""
    var temparr=new Array(); 
     //if expleft is false then swap the two variable names and the 
	 //values of numD and numE and the two arrays
	 if (expLeft==false) 
	  { 
	   temp=metaData["varname1"]
	   //metaData["varname1"]="'"+metaData["varname2"]+"'"
	   //metaData["varname2"]="'"+temp+"'"
       //metaData["varname1"]=metaData["varname2"]
	   //metaData["varname2"]=temp
	   temp=metaData.numE
	   metaData.numE=metaData.numD
	   metaData.numD=temp
	   //swap the two value arrays
	   temparr=metaData.Evals;
	   metaData.Evals=metaData.Dvals;
	   metaData.Dvals=temparr
	   //swap variable names
	   temp=metaData.varD
	   metaData.varD=metaData.varE
	   metaData.varE=temp;
	  }
	 //if maxatleft is true than swap the valnames
	 if (maxAtLeft) 
	  { 
	   //alert("at 253 metaData.Dvals[0]="+metaData.Dvals[0] + " maxAtTop="+maxAtTop)
	   if (expLeft==true)
	     { 
		  //Reverse (invert) the arrays
		  metaData.Dvals.reverse();
		 }
		else
		 {
		  metaData.Evals.reverse(); 
		 }
	  }
	   //alert("at 264 metaData.Dvals[0]="+metaData.Dvals[0] + " maxAtTop="+maxAtTop)
	 
	 
	 if (maxAtTop) 
	  { 
	   if (expLeft==true)
	     {
		  //Reverse (invert) the arrays
		  metaData.Evals.reverse();
		 }
		else
		 {
		  metaData.Dvals.reverse(); 
		 }
	  }
	 //metaData.varD=metaData.varname1;
	// metaData.varE=metaData.varname2; 	 
  }//end of   if usetablesettings
  dataMatrix[0]=metaData;
}



function copyArray(source,destination)
{
 //Copies values from source to destination, but without linking.
 //JavaScript array assignment is by reference and any changes made to
 //array 2 are reflected in array 1.  This avoids that problem.
 //Both source and destination must be arrays.
 var i;
 if (typeof(source)!="undefined")
 {
 destination.length=0;
 for (i=0; i<source.length; i++)
   {
     destination[i]=source[i];
   }
 }
} 

function readMetaToTable()
{
//Given a metaData array, populate the non-data cells in a table.
//Table is assumed to exist already.
var r,c,type, val
var topvals=new Array()
 var leftvals=new Array()

 var topvar=dataMatrix[0].varD; 
 var leftvar=dataMatrix[0].varE;

 if (typeof(dataMatrix[0].Dvals)!="undefined") {copyArray(dataMatrix[0].Dvals,topvals)};
 if (typeof(dataMatrix[0].Evals)!="undefined") {copyArray(dataMatrix[0].Evals,leftvals)};
 
 if (useTableSettings==true)
   {
     if (ExposureLeft==false)
	   {
	   //Swap variable names and value arrays
	   topvar=dataMatrix[0].varE;
	   leftvar=dataMatrix[0].varD;
	   copyArray(dataMatrix[0].Evals,topvals);
	   copyArray(dataMatrix[0].Dvals,leftvals);
	   }
	 if (MaxValueAtLeft==true)
	  {
	   //alert("before reversing topval.0="+topvals[0])
	   topvals.reverse()
	   //alert("after reversing topval.0="+topvals[0])
	  } 
	 if (MaxValueAtTop==true)
	  {
	   leftvals.reverse();
	  }  
   }
var varnamecount=0;
var firstvalrow=-1;
var topcount=0;
var leftcount=0;
var preval;
for(r=0; r<myTable.rows; r++)
  { 
 	
    for (c=0; c<myTable.cols; c++)
     { 
	   type=myTable.row[r].cell[c].type;
	   preval=myTable.row[r].cell[c].value.toString();
	   
       if (type!="data")
	    {
		 //skip the data cells and any cell with a preexisting value 
	
		 if(type=="valname")
		   {
		   if (firstvalrow==-1) 
		     {
			  firstvalrow=r
			 }
		    if (r==firstvalrow)
             {
               //Insert next value of topvals
			  myTable.insert(r,c,topvals[topcount]);
			  topcount+=1; 
             }
            else
             {
			  //Insert next value of leftvals
			  myTable.insert(r,c,leftvals[leftcount]);
			  leftcount+=1;
			 }
		    }
		   else if (type=="varname")
		    {
		     if (varnamecount==0)
			   {
			    val=topvar
			   }
			 else
			   {
			    val=leftvar
			   }  
			 myTable.insert(r,c,val); 
			 varnamecount+=1; 
		    }
		  else if (type="label")
		   {
		   }  
		 }  
     }
  }
}



function readMemToTable(stratum)
{
var r,c;
 //alert("in readMemToTable")
if (dataMatrix[stratum]) 
 {
  //alert("dataMatrix for stratum"+stratum+" exists");
 // alert("myTable.rows="+myTable.rows)
for (r=0; r<myTable.rows ;r++)
  {
   for (c=0; c<myTable.cols; c++)
    { 
	//alert("type="+myTable.row[r].cell[c].type)
	 if (myTable.row[r].cell[c].type=="data") 
	   {
	     myTable.insert(r,c,dataMatrix[stratum][strIdFromRC(r,c)])
		 myTable.calcTotals(r,c);
	   }
		  
	 }
   }
 }
}

function writeTable(tableData)
{
//Writes out the data array in an understandable HTML form for reference by 
//developers.  Not expected to be part of a final application for users.
var s2=""
var s;
var list=""
var list1="<h4>Temporary Data Array<br>To be rearranged for output</h4>";
list1+="The dataArray and a corresponding data table follow.  "
list1 +="Note that they are in a standard format (ExposureLeft with ascending rows and columns),"
list1+=" but this is only the format for internal storage by OpenEpi.  The statistical module "
list1+="will be able to request the data in any table layout desired, and can, of course, "
list1+="make use of the item names to extract desired elements for processing.  "
list1+="Functions will be provided later for automatic conversion of the data.<br>"
list1+="<br>"
var ix=0;
//var val
var index = new Array();
 //stratum number
var stratum; //stratum index

//Assemble HTML version of metadata
var mdata="<table border='1' width='60%'><tr>"
mdata+="<tr><td><b>Array Index</b></td><td><b>Value</b></td></tr>\n";
for (key in tableData[0])  
	  {
	    mdata+= "<tr><td>"+"\""+key+"\""+"</td><td>"+ tableData[0][key]+"</td></tr>\n";
	  }
mdata+="</table><br>"
for (stratum=1;stratum<tableData.length;stratum++)
{
    s = "<table border='1' width='60%'><tr>"
    list="<table><tr><td>&nbsp;<b>Exposure and Disease Status</b></td><td>&nbsp;<b>Value</b></td></tr>"
	ix=0;
	for (key in tableData[stratum])  
	  {index[ix]=key;
	   ix++;}
	index.sort()  
	//sort the indices
	//alert (index.length)
	var e=[-1,0];
	var eprev=[-1,0];
	for (i=0; i<index.length;i++)
	 {
	  list+="<tr><td>&nbsp;"+index[i] + "&nbsp; &nbsp;</td><td>&nbsp;"+tableData[stratum][index[i]]+ "&nbsp;</td></tr>";
	  e=index[i].match(/\d+/); //finds first number in the string as e[0]
	  if (e[0] != eprev[0] && eprev[0] != -1) 
	   {
	   //if the value for Exposure changes, start a new row
	   s+="</tr><tr>"
	   }
	  eprev=e;       
	  s+="<td>" + tableData[stratum][index[i]] + "</td>";
	 }
	s+="</tr></table>"
	list += "</table><h5>The following table has exposure on the left, disease at the top, and (-)(-) upper left.</h5>"
	s2+="<h3>Stratum "+stratum+"</h3>"+list+s+"<br><br>";
}
win2=window.open("about:blank", "window2","Width=800,Height=600,scrollbars=yes"); 
win2.document.write(list1+mdata+"<br>"+s2)
win2.document.close();
//alert(jsStringFromArray(tableData))  //for debugging
}

//end of DataStore module