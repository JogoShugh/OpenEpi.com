// JavaScript Document
function Commandclass()
{
    //the constructor for the Command class
	//The string to build as html
	this.s ="";
	this.rowopen=false;
	//Header material for HTML page in case it is needed
	this.htmlheader = 
	'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">\n'+
    '<html>\n'+'<head>\n'+'<title>Untitled Document</title>\n'+
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n'
    if (parent.device=="smartphone")
      {
      this.htmlheader+= '<style>table{align:left;width:80%;}\n img{width:10%; } </style>\n';
      this.htmlheader+='</head>\n<body style="font-size:1em">\n'}
    else
      {
       this.htmlheader+= '<style>table {width:80%;} img {width:10%; } </style>\n' ;
       this.htmlheader+='</head>\n<body>\n'
      }
    //  alert("18 in OECommands htmlHeader="+this.htmlheader)
	this.cols=0;
	this.rows=0;
	this.colwidth=100;
    this.newtable = CmdNewTable;
    this.newrow=CmdNewRow;
    this.cell=CmdCell;
	this.isnumber=CmdIsNumber;
	this.image=CmdImage;
	this.imagecell=CmdImageCell;
	this.line=CmdLine;
	this.header=CmdHeader;
    this.expandedcell=CmdExpandedCell;
    this.title=CmdTitle;
    this.endtable=CmdEndTable;
    this.html=CmdHTML;
   // this.showresult=CmdShowResult;
    this.reference=CmdReference;
	this.footnote=CmdFootnote;
	this.javascript=CmdJavaScript;
    this.bar1=CmdBar1;
	this.bar2=CmdBar2;
	this.constructcelltags=CmdConstructCellTags;
	//this.execute=CmdExecute;
	this.cellcolor=CmdCellColor;
	this.colcolor=CmdColColor;
	this.rowcolor=CmdRowColor;
	this.addinputattribute=CmdAddInputAttribute;
	this.rowblank=false;
}


function Input()
{   this.r=-1;
    this.c=-1;
	this.mode="input";
	this.precmds=Array();  //Array containing commands for this table to be executed
	//before the table is built and written to the screen
	this.postcmds=Array(); // Commands to be executed after the table has been
	//built and activated.
	this.newtable=NewInputTable; //overrides the CommandClass equivalent
	this.title=InputCmdTitle;
	this.endtable=InputEndTable;
	this.datarange=InputDataRange;
	this.allowstrata=InputAllowStrata;
	this.settingslink=InputSettingsLink;
	this.tablecmd=InputmyTableCmd;
	this.lock=InputLock;
	this.unlock=InputUnlock;
	this.usetablesettings=InputUseTableSettings;
}	

Input.prototype= new Commandclass;
//Input inherits all the properties and functions of the Command class.
//They can be overridden as needed.

function Output(data)
{ 
    this.data=data;
	this.tableAsHTML=TableAsHTML;
	this.crudeTable=crudeTable;
	this.mode="output";	
}	
Output.prototype= new Commandclass;
//Output inherits all the properties and methods of Commandclass.  
//They can be overridden as needed.

function crudeTable()
{
var table= new Array()
//var table=this.data[1];
//The cumbersome maneuvers below are necessary because the preceeding line 
//causes changes in the "table" to be reflected in this.data[1].  Hard to understand,
//but it happens, at least in Netscape.
var i,n;

 for(c=0; c<this.data[0].numD; c++)
   {  
      for(r=0; r<this.data[0].numE; r++)
	  {
	   //visit all the cells and initialize corresponding table variables
	   table["E"+r+"D"+c]=0
	  } 
    }
 
 for (i=1; i<=this.data[0].strata; i++)
 {
  for(c=0; c<this.data[0].numD; c++)
   {  
      for(r=0; r<this.data[0].numE; r++)
	  {
	   //visit all the cells and add to crude totals in ttable
	   n=this.data[i]["E"+r+"D"+c]
	   //Jan 2007 Added parseFloat below  
	   table["E"+r+"D"+c]+=parseFloat(n)
       alert("in 117 OEC"+table);
	  } 
    } 
  } 
  return table
}
 
 

function TableAsHTML(stratum)
{
//Constructs an HTML version of the input table and inserts it into the output
//stream, s.  This function does not return a value directly.
//It has its own newtable() and endtable() calls, but tables before and after
//must be correctly created and terminated with these commands.
var e,d,i,r,c;
var table=new Array();
var ttable=new Array();

var rowtot=new Array();
var coltot=new Array();
var rowpercents=new Array();
var colpercents=new Array();
var basiccolor="color#ffff"
var countcolor=basiccolor+"cc:"
var rowpccolor=basiccolor+"99:"
var colpccolor=basiccolor+"66:"
var totalcolor="color#ffffff:"
var valuecolor="color#bbbbbb:"
var exposurecolor="color#99eeee:"
var diseasecolor="color#ff9900:" 
var leftcolor=exposurecolor; //Will be switched if necessary
var topcolor=diseasecolor;  
var grandtot=0;
var rows, cols;
var title;

function copyArray(source,destination)
{
 //Copies values from source to destination, but without linking.
 //JavaScript array assignment is by reference and any changes made to
 //array 2 are reflected in array 1.  This avoids that problem.
 //Both source and destination must be arrays.
 var i;
 destination.length=0;
 for (i=0; i<source.length; i++)
   {
     destination[i]=source[i];
   }

}  //End of copyArray function



if (typeof(stratum)=="undefined") {stratum=0}
if (stratum=="crude") {stratum=0}
if (stratum==0 )
{
table=this.crudeTable()
title=t("Unstratified (Crude) Values"); 
}


if (parseInt(stratum)>0)
{   
    //alert("fetching stratum="+stratum)
    table=this.data[stratum]
	if (this.data[0].strata>=2)
     {
	   title=t("Values for Stratum ")+stratum
	 }
	 else
	 {
	   title=t("Single Table Analysis");
	 }
}
//If usetablesettings is true in the data object, then:

	//If necessary, rotate or flip the table
	//If max at left or max at top (the usual situation with 2 x 2 tables)
	// change order of columns or rows
	//If exposure on the left (epi info style), do nothing; otherwise rotate the table
	// 90 degrees

if (this.data[0].expleft || !this.data[0].usetablesettings)
    {
    rows=this.data[0].numE;
	cols=this.data[0].numD;
	}
  else
    {
	 rows=this.data[0].numD;
	 cols=this.data[0].numE;
    }
	
	
for(c=0; c<this.data[0].numD; c++)
   {  
      for(r=0; r<this.data[0].numE; r++)
	  {	 
	   //Visit all the cells and adjust for configuration settings
	   if (this.data[0].expleft || !this.data[0].usetablesettings) 
	     { //
		   rr=r
		   cc=c
		 }
	   else
	     {//Swap Disease and Exposure
		   rr=c
		   cc=r
		 }
		if (this.data[0].maxatleft && this.data[0].usetablesettings) 
		  {
		   cc=cols-cc-1
		  }
		if (this.data[0].maxattop && this.data[0].usetablesettings)
		  {
		   rr=rows-rr-1
		  } 
		table["R"+rr+"C"+cc]=eval("table.E"+r+"D"+c)
			 
	  } 
    } 


  for (i=0; i<rows; i++) {rowtot[i]=0}  //Initialize row totals
  for (i=0; i<cols; i++) {coltot[i]=0}  //Initialize col totals
   
  for(c=0; c<cols; c++)
   {  
   // Calculate Row and Column Totals
      
      for(r=0; r<rows; r++)
	  {
	   //Jan 2007 added parseFloat
	   cell=parseFloat(table["R"+r+"C"+c]);
	   coltot[c]+=cell
	   rowtot[r]+=cell
	   grandtot+=cell
	  } 
    }
//Calculate row and column percents
 var tablecols=cols+this.data[0].datacmin+1
 var colwidth=Math.round(750/tablecols)
 if (colwidth > 100)
  {
    colwidth=100;
	tablecols=7;
  }
 this.newtable(tablecols,colwidth,0) // Third parameter sets  border
 this.title(title); 
 var ii;
 var topvals=new Array()
 var leftvals=new Array()
 
 var topvar=this.data[0].varD; 
 var leftvar=this.data[0].varE;
 copyArray(this.data[0].Dvals,topvals);
 copyArray(this.data[0].Evals,leftvals);
 //alert("usetablesettings="+this.data[0].usetablesettings+" maxattop="+this.data[0].maxattop)
 
 if (this.data[0].usetablesettings)
   {
     if (this.data[0].expleft==false)
	   {
	   //Swap variable names and value arrays
	   topcolor=exposurecolor
	   leftcolor=diseasecolor
	   topvar=this.data[0].varE;
	   leftvar=this.data[0].varD;
	   copyArray(this.data[0].Evals,topvals);
	   copyArray(this.data[0].Dvals,leftvals);
	   }
	 if (this.data[0].maxatleft)
	  {
	   topvals.reverse()
	  } 
	 if (this.data[0].maxattop)
	  {
	   leftvals.reverse();
	  }  
   }
 //Add rows for variable name and values
 for (i=0; i<this.data[0].datarmin;i++)
 {
   if (i<this.data[0].datarmin-2) {this.newrow("<br>")}  //extra row at beginning, but rarely needed
   if (i==this.data[0].datarmin-2) 
    {
	//variable label row
	     this.newrow()
		 for (ii=0; ii< this.data[0].datacmin;ii++)
		  {
		   this.cell("");
		  }
		 this.cell("c:"+ topvar)
	}
   if (i==this.data[0].datarmin-1)
    {
	 this.newrow();
	 //value label row
	 
	 for (ii=0; ii< this.data[0].datacmin;ii++)
		  {
		   this.cell("");
		  }	  
	 for (ii=0; ii<topvals.length;ii++)
          {
	       this.cell("c:"+topcolor+topvals[ii])
	      }
	}	
 }
 
 
 
 var r;

 for(r=0; r<rows; r++)
   { 
      //Calculate and construct the rows down to the last data row
      this.newrow()
      //Go across the row
	  //First the columns for variable name and values
	  for (ii=0; ii< this.data[0].datacmin-2;ii++)
		  {
		   this.cell("");
		  }
	  if (r==1) {this.cell("c:"+leftvar)} else {this.cell("")}
	  this.cell("c:"+leftcolor+leftvals[r])
	  
	 // alert("leftvals["+r+"]="+leftvals[r])
	  
	  for(c=0; c<cols; c++)
	  {
	   //Go across the row
	   
	   //Get a data value
	   cell=parseFloat(table["R"+r+"C"+c])
	   //Add a data cell
	   this.cell(countcolor+"c:"+cell)
	   //alert("cell="+cell+"\nrowtot["+r+"]="+rowtot[r])
	   
	   //Calculate row and column percents but keep for later
	   rowpercents["R"+r+"C"+c]=fmtFixed(100*cell/rowtot[r],1)
	  // alert("rowpercents value="+rowpercents["R"+r+"C"+c])
	   colpercents["R"+r+"C"+c]=fmtFixed(100*cell/coltot[c],1)
	   
	  } 
	  
	  if (this.data[0].rowtots>0)
	    {
		  //Show the row total
	      this.cell(totalcolor+"c:"+rowtot[r])
		}  
	  
	  if (this.data[0].rowpercents>0) 
	    {
		//Show the rowpercents row
		this.newrow("","")
		for (i=0; i< cols;i++)
		  {
		   this.cell(rowpccolor+"c:"+rowpercents["R"+r+"C"+i]+"%")
		  }
		  this.cell("c:100%")
		}
	  if (this.data[0].columnpercents>0) 
	    {
		 //Show the columnpercents row
		this.newrow("","")
		for (i=0; i< cols;i++)
		  {
		   this.cell(colpccolor+"c:"+colpercents["R"+r+"C"+i]+"%")
		  }
		  this.cell("&nbsp;")
		}	
    } //End of the rows for the data area
	
if (this.data[0].coltots>0)
{	
    //If entry table has column totals, show column totals and grand total
	this.newrow("","")
	for (i=0; i< coltot.length; i++)
		{
		 this.cell(totalcolor+"c:"+coltot[i])
		}	
	 this.cell(totalcolor+"c:"+grandtot);
}

if (this.data[0].rowpercents>0 && this.data[0].rowtots>0 && this.data[0].coltots>0) 
 {
   //Show row total percents if entry table has row totals and rowpercents
   //is on.
   this.newrow("","")
   for (i=0; i< cols;i++)
	{
	  this.cell("c:"+ fmtFixed(100*coltot[i]/grandtot,1)+"%") //
	}
	this.cell("c:100%")
 }
if (this.data[0].columnpercents>0 && this.data[0].coltots>0)
 {
  //Show col total percents if entry table has column totals and columnpercents
  //is on.
  this.newrow("","")
  for (i=0; i<coltot.length; i++)
   {
     this.cell("c:100%")
   }
 } 
this.endtable();
}

function CmdNewTable(cols, colwidth, border, spacing, padding)
{
  if (!border) {border=0}
  if (!spacing) {spacing=0}
  if (!padding) {padding=0}
  this.cols=cols;
  this.colwidth=colwidth;
  var i;
  this.s+='<table " border="'+border+'" cellspacing="0" cellpadding="0">\n'
  //alert("in 256, "+this.s)            
  this.s+='<tr>\n'
//The following is a trick to maintain constant column width in an
//empty HTML table.  It is done by embedding img tags in the top
//row of columns and using a one-pixel transparent GIF file as a 
//placeholder.
  for( i=0; i < this.cols; i++)
   {
     this.s+='<td><img src="../img/shim.gif" height="1"></td>\n'
   }
  this.s+='</tr>\n'         
}

function NewInputTable(rows,cols,w,h,x,y)
{
if (parent.device=="smartphone")
  {
    //shrink and move table to left for small screen
    x=3; //left margin
    w=240;
  }
this.rows=rows;
this.cols=cols;
//Insert the code to create myTable as the first command 
// in the precmds array.
this.precmds[this.precmds.length]="myTable \= new Stratum("+x+","+y+","+w+","+h+","+rows+","+cols+")";
//Insert a command for background color
this.precmds[this.precmds.length]='myTable.bgColor \= \"#ffffff\"'
//was #336633
//and a command for header/title configuration     moved Oct 2007 to inputcmdtitle
//this.precmds[this.precmds.length]=
//    'myTable.setHeaderStyle("#cccccc","center","middle",6,"arial","16px")'
}

function CmdNewRow()
{
//The list comes over as the arguments array with length = the number of arguments
var tmp,i,j;
var pos
if (this.mode=="output")
{
  if (this.rowopen)
   {
    if (this.rowblank)
	  {
	    this.cell ("&nbsp;")
	  }
    this.s+="</tr>\n"
    this.rowopen=false;
   }

  this.s += "<tr>" 
  this.rowopen=true;
}
else
 {this.r+=1}  
if (arguments.length==0)
  {
  this.rowblank=true; 
  }
else
  { 
   if(this.mode=="output")
     {
	 for (var i=0; i<arguments.length; i++)
       {
	     this.cell(arguments[i],this.r,i)
	   }
	 }
   else
   {	 
	   var revisedarr = new Array;
	   var a = new Array; 
	   for ( i=0; i<arguments.length; i++)
		{
		  //revisedarr[revisedarr.length]=arguments[i];
		  //alert("arg.i="+arguments[i]);
		  revisedarr[revisedarr.length]=arguments[i];
		  a=arguments[i].match(/span(\d+)/i)
		  
		  if (a && a.length>1)
			{
			 // alert("a[1]="+a[1])
			  var z;
			  a=parseInt(a[1]);
			  if (a>0)
			  {
			  for (z=0; z<a-1; z++)
			   {
				 revisedarr[revisedarr.length]="label:span0:";
				// alert ("added blank");
			   }
			  }
			} 
			
		//Look for spanxx: and insert additional items in the array
		}
	   for (j=0; j<revisedarr.length; j++)
		 {
		 this.cell(revisedarr[j],this.r,j);
		 }	
	  }
  } 
}

function InputCell(content)
{

}

function CmdCell(content,r,c)
{
//   Each item can have one or more of the following commands, followed by a colon, 
//   and then the item to place in the row:

//	image  "imagepathandname": An image to be placed in the cell.  The path should be relative to the location of the application, as in   image/myimage.gif, for example.
//	spanx:where x is the number of columns to be occupied by this cell
//	hx: where x is a number from 1 to 6, indicating the HTML header style to be applied
//	bold:    for bold type
//	b:	left justify
//	c:	center
//	r:	right justify
//	t:	vertically align to Top
//	m:	vertically align to Middle
//	b:	vertically align to Bottom
//	color#rrggbb: where #rrggbb is a color indicator in hexadecimal. #000000 is black.  #ffffff (or #FFFFFF) is white, and #FF0000 is pure red.  Charts of colors are available on the Internet.
//	nowrap: text will be kept on the same line, without wrapping
  var i;
  var tmp=content;
  var tags=""
  this.rowblank=false;
//Allow arrays Added Aug 2003
  if (typeof(content)=="object" && content.length>0)
   {
    //Is probably an array
    for (i=0; i<content.length; i++)
	  { 
	  this.cell(content[i])
	  }
	 return    //Don't let array come through undigested 
   }
   
  if (this.isnumber(content)) 
    {
	//is a number.  Make it center aligned, and also a string
	  tmp="c:" + content
	 //if user has specified alignment, content will not be a number 
	}
  	
  tags=this.constructcelltags(tmp,r,c);
  this.s+=tags
  }	 

function CmdIsNumber(content)
{
if (typeof(content)=="number")
 {
 return true;
 }
else
 var validFormatRegExp=/^((\+|-)\d)?\d*(\.\d+)?$/;
 var isValid = validFormatRegExp.test(content);
 return isValid;
}

function CmdConstructCellTags(content,r,c)
//looks for one or more commands ending with a colon
//If none, returns; otherwise calls appropriate function
//to execute the command.  Returns HTML to paste into tag
//if appropriate.
//   Each item can have one or more of the following commands, followed by a colon, 
//   and then the item to place in the row:

//	image  "imagepathandname": An image to be placed in the cell.  The path should be relative to the location of the application, as in   image/myimage.gif, for example.
//	spanx:where x is the number of columns to be occupied by this cell
//	hx: where x is a number from 1 to 6, indicating the HTML header style to be applied
//	bold:    for bold type
//	l:	left justify
//	c:	center
//	r:	right justify
//	t:	vertically align to Top
//	m:	vertically align to Middle
//	b:	vertically align to Bottom
//	color#rrggbb: where #rrggbb is a color indicator in hexadecimal. #000000 is black.  #ffffff (or #FFFFFF) is white, and #FF0000 is pure red.  Charts of colors are available on the Internet.
//	nowrap: text will be kept on the same line, without wrapping

// November 2010   Added ability to detect named data cells "data.nameddata" for example and extract the name to an array
// of dataNames, so that "data.nameddata" becomes "data" and "nameddata" is a member of the array dataNames[0...] 
{
var dataNames=new Array();
var pos
var strArray;
var strItem;
var pretag="<td ";
var pretag2=""
var posttag="";
//var endtags="";
var textitem="";
//alert("content="+content+" \n"+typeof(content));

if  (content.indexOf(":") > 0) 
//Colon found; there must be commands
 {
  strArray=content.split(":");
 // alert("strArray.length=" + strArray.length)
  //textitem=strArray[strArray.length-1]
 /* 
  if (this.mode=="output") 
	    {
	    alert("strArray[strArray.length-1]="+strArray[strArray.length-1]  );
		}
	*/

  for (var i = 0; i<strArray.length-1;i++)
   {//Last item of array is not a command, since it does not end in a colon
     strItem=strArray[i]

     if(/\bdata\.\w*/.test(strItem))
             {
              dataNames[dataNames.length+1]=strItem.substring(5);
              strItem="data";
              alert(785 + dataNames[dataNames.length-1]);
             }

	 if (strItem.search(/\bimage/i)>=0) 
	   {
	    //use regular expression search to find the word "image"
		//If found look for "="
	    pos=strItem.search(/\=/i);
		if (pos > 4)
		  {
		  //"Image =" found in some form.  Construct img tag.
		  strItem=strArray[i].substring(pos+1)
		  textitem+="<img src=" + strItem + ">";
		  }
		else 
		  {
		   alert("Please specify relative path and filename after 'image='")
		  } 
		}  
	 else if (strItem.search(/\bc\b/i)>=0)
	    { if (this.mode=="input")
		   {
		    this.addinputattribute(r,c, "align","center")
		   }
		   else
		   {
			pretag+=" align=center"
		   }		
		 }  
     else if (strItem.search(/\bl\b/i)>=0)
	    { 
		 if (this.mode=="input")
		   {
		    this.addinputattribute(r,c, "align","left")
		   }
		   else
		   {
			pretag+=" align=left"
		   }		
		 }  
	 else if (strItem.search(/\br\b/i)>=0)
	     { 
		  if (this.mode=="input")
		   {
		    this.addinputattribute(r,c, "align","right")
		   }
		   else
		   {
			pretag+=" align=right"
		   }		
		 }  
	    
	 else if (strItem.search(/\bt\b/i)>=0)
	    { 
		  if (this.mode=="input")
		   {
		    this.addinputattribute(r,c, "valign","top")
		   }
		   else
		   {
			 pretag+=" valign=top"
		   }		
		 }  
	    
     else if (strItem.search(/\bm\b/i)>=0)
	    { if (this.mode=="input")
		   {
		    this.addinputattribute(r,c, "valign","middle")
		   }
		   else
		   {
			pretag+=" valign=middle"
		   }		
		 }  
	 else if (strItem.search(/\bb\b/i)>=0)
	    { 
		  if (this.mode=="input")
		   {
		    this.addinputattribute(r,c, "valign","bottom")
		   }
		   else
		   {
			pretag+=" valign=bottom"
		   }		
		 }  
	 else if (strItem.search(/\bbold\b/i)>=0)
		   {
			pretag2+="<b>";
		    posttag= "</b>"+posttag
		   }		 
	 else if (strItem.search(/\bh\d\b/i)>=0)
	    {pretag2+="<" + strItem + ">";
		posttag="</" + strItem + ">" + posttag}
	 else if (strItem.search(/\bspan\s*\d+\b/i)>=0)
	     { 
		   pos=strItem.search(/\d+/);
		   if (pos>0) 
		     {pos=parseInt(strItem.substring(pos))}
		   else {pos=1};	 
		   if (this.mode=="input")
		    {var z;
			 var spanval;
			 spanval=pos;
		 
		      this.precmds[this.precmds.length]= 
		       'myTable.setCellSpan('+r+','+(c)+','+spanval+')'; 
		     }
		   else
		   {
			 pretag+=" colspan=" + pos;
		   }		
		 }  						
	 else if (strItem.search(/\bnowrap\b/i)>=0)
	    {pretag+=" nowrap"}
	 else if (strItem.search(/\bcolor\s*#\s*[a-f,0-9]{6}\b/i)>=0)
	    {
		 strItem.replace(/\s/,"");
		 //alert(strItem)
		 pos=strItem.search(/#/)
		 //alert("pos="+pos)
		 pretag+=" bgcolor="+ strItem.substring(pos)
		 if (this.mode=="input")
		   {
		    this.postcmds[this.postcmds.length]= 
		    'myTable.setCellColor('+r+','+c+','+ "\""+strItem.substring(pos)+"\")"
		   }
		}
	 else 
	    {
		  //not a known command
		  if (this.mode=="input")
		        {
				  //Check for valid data type
				 if (/\bdata\b/.test(strItem)||
				  /\browtot\b/.test(strItem)||
				  /\bcoltot\b/i.test(strItem)||
				  /\bgrandtot\b/i.test(strItem)||
				  /\bvalname\b/i.test(strItem)||
				  /\bvarname\b/i.test(strItem)||
				  /\blabel\b/i.test(strItem))
				  {
					//Data type found.  Make cmd to set type of this cell.
					this.precmds[this.precmds.length]=  
					'myTable.row['+r+'].cell['+c+'].type='+"\""+strItem.replace(/\:/,"").replace(/\s/,"")+"\"";			  
					//strArray[i]="";

					strItem="";
					//alert("cmd="+this.precmds[this.precmds.length-1])
				  }
			  }
		  if (strItem.length>=0 && textitem.length>0)
			  {
			   //Textitem already exists.  Must be part of a phrase containing a colon.
			    textitem+= ":"+strItem;
			  }
		  else
			  { 
			     textitem+=strItem;
				 //alert("textitem at 324="+textitem)
			  }	 	
			  //alert("leftover strItem="+strItem)
			  //alert("leftover textitem="+textitem)
			 
		 }		   
   } 
   textitem+=strArray[strArray.length-1]
}
else 
{
 textitem=content;
}

//Translate the item
if (t) {textitem=t(textitem);};

//alert("textitem at OEC 834="+textitem)

 if (this.mode=="input")
   {
   //Command to set myTable cell value property
   this.precmds[this.precmds.length]=  
     'myTable.row['+r+'].cell['+c+'].value=' + "\""+pretag2+textitem+posttag+"\"";
	 //alert("pretag2+textitem+posttag="+pretag2+textitem+posttag);
   }
 else  		
   {
   //Constructing ouput HTML.  Put a closing tag after the cell.
   return pretag+">"+pretag2+textitem+posttag+"</td>";
   }
}

function CmdAddInputAttribute(r,c,attribute,value)
{
  this.precmds[this.precmds.length]=  
     'myTable.row['+r+'].cell['+c+'].'+ attribute+ '= \"'+value+'\"';
}

function CmdCellColor(r,c,color)
{
if (this.mode=="input")
		   {
		    this.postcmds[this.postcmds.length]= 
		    'myTable.setCellColor('+r+','+c+','+ "\""+color+"\")"
		   }
}

function CmdColColor(c,color)
{
if (this.mode=="input")
		   {
		    this.postcmds[this.postcmds.length]= 
		    'myTable.setColColor('+c+','+ "\""+color+"\")"
		   }
}

function CmdRowColor(r,color)
{
if (this.mode=="input")
		   {
		    this.postcmds[this.postcmds.length]= 
		    'myTable.setRowColor('+r+','+ "\""+color+"\")"
		   }
}


function CmdExpandedCell(content,numofcells)
{
//
}

function CmdImage(imagename)
//Cmds an image without cell tags.
{
this.s+="<img src=" + imagename + ">";
}

function CmdImageCell(imagename)
//Image has a cell to itself
{
  this.s+="<td align=center><img src=" + imagename + "><td>\n"
}

function CmdLine(endat,indent)
{
var numofcells=endat
this.s+="<tr>";

if (indent!=null && indent>0)
 {
  this.s+="<td colspan="+indent+"></td>";
  numofcells=endat-indent;
 }

this.s+="<td colspan="+numofcells+"><hr noshade></td></tr>\n"
}

function CmdHeader(content)
{
//Uses the HTML tag <th> to specify a cell with centered bold text.
this.s+="<th>" + content + "</th>\n"
}

function CmdBar1(characterwidth)
{
//
}

function CmdBar2(characterwidth)
{
//
}


function CmdTitle(content)
{
if (t) {content=t(content)};  //Translate
//Put title in a cell spanning all the rows
this.s+='<tr><th align="center" colspan=' + this.cols + '>' + content + '</th></tr>\n'

}

function InputCmdTitle(content)
{
if (t) {content=t(content)};  //Translate
//Put title in a cell spanning all the rows
this.precmds[this.precmds.length]=
    'myTable.setHeaderStyle("#cccccc","center","middle",6,"arial","16px")'
this.precmds[this.precmds.length]="myTable.setHeaderText(\""+content+"\");"
//Add command to command string
}


function CmdFootnote(content)
{
//
}

function CmdReference(content)
{
//
}

function CmdEndTable()
{
//For HTML output, puts closing tags for row and table and resets
//default cols and colwidth.
if (this.rowopen) 
{
  this.s+="</tr>\n"
  this.rowopen=false;
}
this.s+="</table>";
//reset defaults for next time
this.cols=0;
this.colwidth=100;
}

function InputmyTableCmd(Cmd)
{
if ((Cmd.search(/\bmoveInput/i)>=0)||(Cmd.search(/\binsert\b/i)>=0)||
(Cmd.search(/\bget\b/i)>=0)||(Cmd.search(/\bsetrow\b/i)>=0))
 {
 this.postcmds[this.postcmds.length]=Cmd;
 }
else
 {
  this.precmds[this.precmds.length]=Cmd;
 }
}

function InputDataRange(rmin,rmax,cmin,cmax)
{
//alert("rows="+this.rows+" cols="+this.cols)

if (rmax>=rmin && cmax>=cmin && rmin>0 && cmin>0
    && rmax<this.rows && cmax< this.cols)
 {
 //alert(438)
  //If rmin,rmax, cmin,cmax appear to specify a data area.
  for (var r=0 ; r< this.rows ; r++)
   {
   //Use the data area to set up default cell types, but only
   //if the data type has not already been specified.
		for (var c=0; c < this.cols ; c++)
		  {
			var t="";
			if (c>=cmin && c<=cmax && r>=rmin && r<=rmax)
			   {t= "data"}
			 else if ((r==rmax+1) && (c==cmax+1))
			    {t="grandtot"}   
			else if ((c==this.cols-1 ) && (r>=rmin)) 
			   {t= "rowtot";}
			 else if ((r==this.rows-1) && (c>=cmin)) 
			    {t= "coltot"} 
			else if (((r==rmin-1) && (c>=cmin)) || ((c==cmin-1) && (r>=rmin)))
			    {t="valname"}
			else if (((r==rmin-2) && (c==cmin)) || ((c==cmin-2) && (r==rmin)))
		        {
				  t="varname"
			    }
			else 
			    {
				t="label"
				}
			
			this.postcmds[this.postcmds.length]= 
			  "if(myTable.row["+r+"].cell["+c+"].type.length!=0)"+ 
			   "{\n myTable.row["+r+"].cell["+c+"].type ="+ "\""+t+"\"}";
			 //alert(this.postcmds[this.postcmds.length-1])  
		  }
	} 
	this.postcmds[this.postcmds.length]="setColors()";  	
  }
else
  {
  alert(t("Please check that rowmin, rowmax, colmin, and colmax are within the boundaries of the table.\n  The boundaries are: 0,") +this.rows-1+t(", 0, and ")+this.cols-1)
  }
}

function InputAllowStrata(on)
{
this.postcmds[this.postcmds.length]= 'ShowHide("scontrols_span",'+on+')';
}

function InputSettingsLink(on)
{
this.postcmds[this.postcmds.length]= 'ShowHide("settings_span",'+on+')';
}

function InputUseTableSettings(on)
{
this.precmds[this.precmds.length]='useTableSettings='+on+';';
//sets Boolean in Etable, from which the precmds are evaluated.
}

function InputEndTable()
{
 var numcmds=this.execute(this.precmds);
  //Ends the series of commands that configure the input table and
  //sets up and displays the table.
}

function CmdHTML(content)
{
//Future command to embedd HTML within the table.  May not be necessary,
//since tags can be included with text in the cell or newrow commands.
}

function CmdJavaScript(content)
{
//Surrounds content with appropriate script tags
this.s+="<script language=JavaScript type=text/JavaScript>"+content+
 "</script>"
}

function InputLock(what)
{

var rc=new Array()

for (var i=0; i<arguments.length; i++)
    {
	   this.postcmds[this.postcmds.length]= 
	         // "myTable.lock('"+arguments[i]+"')";
			  'myTable.lock(\"'+arguments[i]+'\");'
	}
}
	
function InputUnlock(what)
{

var rc=new Array()

for (var i=0; i<arguments.length; i++)
    {
	   this.postcmds[this.postcmds.length]= 
	          'myTable.unlock(\"'+arguments[i]+'\");'
	}
}
