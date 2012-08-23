function Stratum(x,y,w,h,r,c,name){
    //the constructor for the class Stratum
	if (name) {this.name = name + (Stratum.count++)}
	else {this.name = "Stratum" + (Stratum.count++)}
	this.x = x
	this.y = y
	this.w = w
	this.h = h
	this.adjust=true
	this.rows = r
	this.cols = c
	this.spacing = 1
	this.header=false
	this.headText=""

	//Name of last cell clicked
	this.lastCellClicked=''
	
	//Row and column of last input box position
	this.inputR=0
	this.inputC=0
	//default movement of input box is across.  Can be reset by pressing down arrow to inputdown=true.
	this.moveUpDown=false
	this.moveUp=false
	
	
	this.bgColor = '#ffffff'
	//was #000000
	this.cellColor = '#3399ff'
	this.cellRollOver = '#eeeeee'
	this.headColor = this.cellColor
	
	this.cellAlign = 'center'
	this.cellValign = 'middle'
	this.cellFont = 'arial'
	this.cellFontSize = '16px'
	this.cellPadding = 1

	this.headAlign = 'center'
	this.headValign = 'middle'
	this.headPadding = '2'
	this.headFont = 'arial'
	this.headFontSize = '32px'
	
	this.shadowwidth=12 
	this.shadowcolor='#777777'
	
	this.row = new Array()
	for (i=0 ; i < this.rows ; i++)
	    {
		this.row[i] = new Object()
		this.row[i].name = this.name + "Row" + i
		this.row[i].cell = new Array()
		for (j=0; j < this.cols ; j++){
			this.row[i].cell[j] = new Object()
			this.row[i].cell[j].name = this.name + "Cell" + j
			this.row[i].cell[j].value = ''
			this.row[i].cell[j].locked = false
			this.row[i].cell[j].type="label";
			this.row[i].cell[j].span=1;  //Oct 2003
		}
	}
	
	this.locklabels=false;
	this.lock=StratumLockCell;
	this.unlock=StratumUnlockCell;
	this.locked=StratumCellLocked;
	
	//Methods for the class
	this.over = StratumOver
	this.out = StratumOut
	this.down = StratumDown
	
	this.build = StratumBuild
	this.activate = StratumActivate
	this.setRow = StratumSetRow
	this.insert = StratumInsert
	this.get = StratumGet
	this.setHref = StratumSetHref
	this.setImg = StratumSetImg
	this.setFn = StratumSetFn
	this.callFn = StratumCallFn
	this.setSpacing = StratumSetSpacing
	this.setCellStyle = StratumSetCellStyle
	this.setHeaderStyle = StratumSetHeaderStyle
	this.setHeaderText = StratumsetHeaderText
	this.writeHeader = StratumWriteHeaderText
	this.setRowColor = StratumRowColor
	this.setColColor = StratumColColor
	this.setCellColor = StratumCellColor
	this.cellWrite = StratumCellWrite
	
	this.setCellSpan=StratumSetCellSpan
	
	this.evalEntry = StratumEvalEntry
	this.calcTotals=StratumCalcTotals
	this.moveInputTo = StratumMoveInputTo
	this.moveInputNext = StratumMoveInputNext
	this.emptyCellsinRow = StratumEmptyCellsinRow
	this.emptyCellsinCol = StratumEmptyCellsinCol
	
	this.obj = this.name + "Object"
	eval (this.obj + " = this")	
}

//var entryObj=$("entryfield");

if (device=="smartphone")
{
   $(function () {
	$('#entryfield').keypad();
   });
}

function StratumCellWrite(r,c)
{
  var span=this.row[r].cell[c].span;
   //if (r==2 && c==0) {this.cellAlign="right"}
	this.row[r].cell[c].dynlayer.write("<div class='" + this.name + 
	"innerCell'><table border=0 width=" + this.cellwidth*span + " height=" + 
	this.cellheight +" cellpadding=" + this.cellPadding + "><tr><td class='" +
    this.name + "TdStyle' width=" + this.cellwidth*span + " height=" + 
	this.cellheight + " align=" + this.cellAlign + " valign=" + 
	this.cellValign + ">" + this.row[r].cell[c].value + 
	"</td></tr></table></div>")
}

function StratumUnlockCell(cellortypename)
{ 
  this.lock(cellortypename,false);
}

function StratumLockCell(cellortypename,locked)
{ 
var r,c
  if (arguments.length==1) {locked=true}  //No locked parameter passed.
  
  if (cellortypename.search(/\bE\d+D\d+\b/)>=0)
   {
 
    var rc=new Array(2);
    rc=rcFromStrId(cellortypename)
	alert("rc0="+rc[0]+ " rc1="+rc[1]);
	this.row[rc[0]].cell[rc[1]].locked=locked;
   }
  else
   { 
      for (r=0 ; r < this.rows ; r++)
	   {
		for (c=0; c < this.cols ; c++)
		 {
		  if (this.row[r].cell[c].type==cellortypename)
		    {
			this.row[r].cell[c].locked=locked
			 }
		  else if (cellortypename=="labels" &&
                this.row[r].cell[c].type !="calendar" &&
		        this.row[r].cell[c].type !="data" &&
				this.row[r].cell[c].type !="rowtot" &&
				this.row[r].cell[c].type !="coltot")
				{
				this.row[r].cell[c].locked=locked
				} 	
		 }	
       }
    }
}
var morecols=t("Problem:\nNot enough columns to accommodate data" );
function StratumSetRow()
{
	r = arguments[0]
	this.cellCount = 0
	args = (arguments.length - 1)/2
	if (args > this.cols) 
	    {
		alert(morecols)
		return
		}
	for (var i=0 ; i<(arguments.length-1); i=i+2)
	  {
		if (this.lockCheck) 
		{
			if (this.lockCheck(r,this.cellCount)) {return true}
		}
		this.row[r].cell[this.cellCount].value = arguments[i+1]
		if (arguments[i+2]) this.row[r].cell[this.cellCount].href = arguments[i+2]
		this.cellCount++
	  }
}

function StratumEmptyCellsinRow(row)
{
var col;
var count=0;

for (col=0; col<this.cols; col++)
{
  if (this.row[row].cell[col].value.length==0 && 
     this.row[row].cell[col].type=="data")
  {
   count+=1; 
  }
}
return count;
}

function StratumEmptyCellsinCol(c)
{
var r;
var count=0;

for (r=0; r<this.rows; r++)
{
  if (this.row[r].cell[c].value.length==0 && this.row[r].cell[c].type=="data")
  {
   count+=1; 
  }
}
return count;
}

var singleemp=t( "There must be a single empty cell in row to enter total.");
var singleempc=t( "There must be a single empty cell in column to enter total.");
var gtmsg=t("Cannot enter Grand Total; please try another cell." );
var rowtotmsg=t("Row Total");
var coltotmsg=t("Column Total");
var valnamemsg=t("Value Name");
var varnamemsg=t("Variable Name");
var labelmsg=t("Text Label");
var entermsg=t("Enter");

function addCalendar()
  {
     // do{
       jQuery(function() {
		jQuery( "#entryfield" ).datepicker(
        {
	 	    yearRange: '-99:+00',
	 		changeMonth: true,
			changeYear: true
	 	}
        );
        jQuery("#entryfield").bind('change', function(){ jQuery("#entryfield").focus() })
	    }
        );
    //  }
    //  while (jQuery("#entryfield").datepicker == "undefined")
     alert("wait");
  };




function removeCalendar()
{
  jQuery("#entryfield").datepicker("destroy");
}

function StratumMoveInputTo(r,c){
//If cell is not a data cell, then pop a choice box before placing input in field.

var tp = this.row[r].cell[c].type;

//if (tp!="calendar"){removeCalendar();}
if (tp !="data")
  {
    if (tp=="rowtot")
	  {
	   tp=rowtotmsg;
	   //alert("r="+r+" Empty cells="+this.emptyCellsinRow(r))
	   if (this.emptyCellsinRow(r) !=1)
	     { alert(singleemp);
		  //this.out(r,c);
		  //this.moveInputTo(this.inputR,this.inputC);
		  //self.focus()
	      return false
		 }
	  }
    else if (tp=="coltot")
	  {
	  tp=coltotmsg;
	  if (this.emptyCellsinCol(c) !=1)
	     { alert(singleempc);
	      return
		 }
	  }
    else if (tp=="grandtot")
	  {
	   alert(gtmsg)
	   //this.moveInputTo(this.inputR, this.inputC);
	   return
	  //t="Grand Total"
	  }
    else if (tp=="valname") {tp=valnamemsg}
    else if (tp=="varname") {tp=varnamemsg}
    else if (tp=="label") {tp=labelmsg}
    else
      // if (tp=="calendar")
      // {
       // addCalendar();
      /*  jQuery(function() {
		jQuery( "#entryfield" ).datepicker({
	 	    yearRange: '-99:+00',
	 		changeMonth: true,
			changeYear: true
	 	});
	   });
        alert("298 estratum added datepicker");
       }
       */
   if(tp!="calendar"){ enter=window.confirm(entermsg+" " + tp + "?")}
   }
   else
   {
    enter = true
   }

if (enter)
  {
   //If cell is a data cell, then move input box into place and have it assume the value
   //currently in the cell.
  // this.inputbox.moveTo(this.row[r].cell[c].dynlayer.x,this.row[r].cell[c].dynlayer.y);
  // var newcss= css("InputDiv",this.Hpos,this.Vpos,this.cellwidth*this.row[r].cell[c].span,this.cellheight,"#ff0000","show",1) //show changed to visible Mar 2007

  var newcss= css("InputDiv",this.Hpos,this.Vpos,this.cellwidth*this.row[r].cell[c].span,this.cellheight,"#ff0000","visible",1)
   var m=newcss.match(/\{(.*)\}/);
   if (m)
    {
	  newcss=''+m[1]+'';
	}

   this.inputbox.moveTo(this.row[r].cell[c].dynlayer.x,this.row[r].cell[c].dynlayer.y);
  //var entryObj=document.getElementById("entryfield");
   var entryObj=$("entryfield");
   entryObj.focus();
   entryObj.value=this.row[r].cell[c].value;
   entryObj.select()
   if (tp=="calendar")
       {
       addCalendar();
       /* jQuery(function() {
	   	jQuery( "#entryfield" ).datepicker
        ({
	 	    yearRange: '-99:+00',
	 		changeMonth: true,
			changeYear: true
	 	});
	   });
        alert("298 estratum added datepicker");

       */
       }

   //document.inBox.entryfield.focus();
   //document.inBox.entryfield.value=this.row[r].cell[c].value;
   //window.document.inBox.entryfield.select()
   bcolor=this.row[r].cell[c].color;
   if (!bcolor) {bcolor = this.cellColor;}
   var nwidth=this.row[r].cell[c].span*(this.cellwidth)+(this.row[r].cell[c].span-1)*this.spacing;
   if (nwidth<0){nwidth=0}  //added Mar 2007

   var elem;
   if (is.ie)
   {
    elem=window.document.all('InputDiv').style;
	elem.background=bcolor;
	elem.pixelWidth=nwidth;
	elem.clip='rect(0px '+nwidth+'px '+this.cellheight+'px 0px)';
    window.document.all('entryfield').style.pixelWidth=nwidth;
    window.document.all('inBox').style.pixelWidth=nwidth;
   }
   else if (is.ns4)
   {
    elem=window.document.layers('InputDiv');
    elem.bgcolor=bcolor;
	elem.width=nwidth;
	elem.clip='rect(0px '+nwidth+'px '+this.cellheight+'px 0px)';
	window.document.layers('entryfield').width=nwidth;
	window.document.layers('inBox').nwidth;
	//have not tested this one
   }
  else
   { //was,  if (is.ns)
     elem=window.document.getElementById('InputDiv').style;
	 elem.background=bcolor;
	 elem.width=nwidth;
	 elem.clip='rect(0px '+nwidth+'px '+this.cellheight+'px 0px)';
	 window.document.getElementById('entryfield').style.width=nwidth;
	 window.document.getElementById('inBox').style.width=nwidth;
   }

   this.inputR=r;
   this.inputC=c;

 //Copied from experiment with KeypadBasid.html
// <p><input type="text" id="defaultKeypad" onFocus="window.location.hash='anchor'" ></p>
// <a name="anchor"></a>


  //alert("moved input to: R " + this.inputR + " C " + this.inputC)
  //document.inBox.entryfield.focus();
  return true;
  }
}

function getIEVersion()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
{
  var rv = -1; // Return value assumes failure
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}
/*
function SetInputWidth(width)
{
  alert("333 "+ width)
  //var spanname;
  var IEbrowser=getIEVersion();
  alert("335 Estratum ieVersion="+ IEBrowser);
  if (document.all)
     {
		eval("window.document.all.InputDiv.style.width='"+width+"';");
		eval("window.document.all.InputDiv.style.background='#ff0000';");
		alert(340)
     }
  else
    {
     if(navigator.userAgent.indexOf("Gecko")!=-1)
	   {// is NS6 ?
	     alert(346)
      if (show)
	     {document.getElementById(spanname).style.visibility='visible';}
      else 
	     {document.getElementById(spanname).style.visibility='hidden'; }}
  else {
    alert(353)
    if (show) 

	     {eval("document.layers['"+spanname+"'].visibility='show';");}
    else
	     {eval("document.layers['"+spanname+"'].visibility='hide';"); }}
  }
}
*/
function StratumMoveInputNext()
{
row=this.inputR
col=this.inputC
tries=0;
do
 {
 tries +=1;
 if (this.moveUp) 
   {
   if (row>0) {row-=1};
   this.moveUp =false; 
   }
 else if (!this.moveUpDown && col<this.cols-1) 
   {
   col+=1;
   }
 else if (row<this.rows-1) 
   {
  row+=1;
  if (!this.moveUpDown) {col=0};
   } 
 else if (this.moveUpDown && (row==this.rows-1) && (col<this.cols-1)) 
   {
   col +=1;
   row=0;
   }  
 else 
   {
   row=0;
   col=0;
   } 
  // alert("tries="+ tries + "row=" + row + "  col=" + col)
 }
 while ((this.row[row].cell[col].type != "data") && (this.row[row].cell[col].type != "calendar") && (tries <= this.rows * this.cols));
 //May want to put test and message here if no data cells found.  

this.moveInputTo(row, col)
//alert("moved to next row and col")
//document.inBox.entryfield.focus();
}
var clearone=t( "Please clear one cell in the column before entering total.")
function StratumEvalEntry()
{
 //Evaluates entry for this cell type and calls insert if valid
 //Does row and column totals

  //var inputForm=document.inBox;
  var inputForm=$("inBox");
  var entry=inputForm.entryfield.value;

  //Jan 2007
  if (entry==parseFloat(entry))
      {
	   entry=parseFloat(entry)   //Be sure a number is received as a number and not a string.
	  }
  var gtotal=0;
  var celltype=this.row[this.inputR].cell[this.inputC].type;
  
  if (celltype == "rowtot")
     {
	  entry1 = this.totalRow(this.inputR, this.inputC, entry);
	  
	  this.insert(this.inputR,this.inputC, entry1);
	 }
  else if (celltype == "coltot")
     {
	  entry1 = this.totalCol(this.inputR, this.inputC, entry);
//alert("this.emptycol="+this.emptycol)
	  if (this.emptycol!=-2)
	  {
	  this.insert(this.inputR,this.inputC, entry1);
	  }
	  else
	  {
	   alert(clearone);
	  }
	 }
  else if ((celltype=="data")||(celltype=="calendar"))
     // a data or calendar cell
     {
     if (celltype=="calendar")
       {
         removeCalendar();

       }
	  var entry1=entry;
	  if (checkcode)
	      {entry=checkcode(this.inputR,this.inputC,entry)}
	  if(typeof(entry)=="undefined")
	      {
		    //Check code routine returning useless value.  Bypass it.
		   entry=entry1;
		  }
	  this.insert(this.inputR,this.inputC, entry); 
	  //Find row total column and call totalRow, inserting row total in correct cell
	  this.calcTotals(this.inputR,this.inputC);
	  }
	  else
	  //another kind of cell type
	  {
	    this.insert(this.inputR,this.inputC, entry);
	  }
 } 

function StratumCalcTotals(r,c)
{
var gtotal="";
var v;
//for (var i=cmin ; i <= this.cols-1 ; i++) 
for (var i=this.cols-1; i>=0; i--)
	  	{
		   	if (this.row[r].cell[i].type == "rowtot")
			{
				total=this.totalRow(r,i,this.row[r].cell[i].value);
				
				this.insert(r,i,total);
			}
	  	 }
	  //Find rtotal row and call totalCol, inserting column total in correct cell
for (var i=this.rows-1; i>=0; i--)	
	  	{
	    	if (this.row[i].cell[c].type == "coltot")
			{
				total=this.totalCol(i,c,this.row[i].cell[c].value);
				this.insert(i,c,total);
				
			//Do the grand total by adding up the column totals
			
			    for(var cc=this.cols-1;cc>0;cc--)
				   { 
				     if (this.row[i].cell[cc].type == "coltot")
					  { 
					    v=parseFloat(this.row[i].cell[cc].value) 
						if (!isNaN(v))
					      {
						  if (gtotal=="") {gtotal=0}
						  gtotal+=v
						  }
					  }
 			       }	  
            }
		}
//Find the grandtot cell(s) and insert the grand total.
for (var i=this.cols-1; i>=0; i--)
  {
    for (var j=this.rows-1; j>=0; j--)
     {
	   if (this.row[j].cell[i].type=="grandtot")
		   {
		    this.insert(j,i,gtotal);
		   } 
	  }
   }					 
}
var norow=t( "Stratum Error:\nThere is no Row ");
var nocol=t( "Stratum Error:\nThere is no Column ");
function StratumInsert(r,c,val){
	//if (this.lockCheck){
	//	if (this.lockCheck(r,c)) {return}
	//}
	
	if (r > this.rows) {alert( norow+ r); return false}
	if (c > this.cols) {alert(nocol + c); return false}
	//alert ("329: inserting r,c,val " + r + " ," + c +"," +val)
	//if (this.inputR==r && this.inputC==c)  {this.moveInputTo(r,c)}
	this.row[r].cell[c].value = val
	this.row[r].cell[c].elm
	this.cellWrite(r,c)
	//this.calcTotals(r,c); //can't do this because calcTotals calls Insert
	if (this.inputR==r && this.inputC==c)  
	 {
	 this.inputbox.moveTo(this.row[r].cell[c].dynlayer.x,this.row[r].cell[c].dynlayer.y);
     //document.inBox.entryfield.focus();
    // document.inBox.entryfield.value=this.row[r].cell[c].value;
     //window.document.inBox.entryfield.select()
	 entryObj.focus();
     entryObj.value=this.row[r].cell[c].value;
     entryObj.select()

	 //this.moveInputTo(r,c)
	 }
}

function StratumGet(r,c)
{
	return this.row[r].cell[c].value	
}


function StratumRowColor(r,color)
{
	for (i=0 ; i < this.cols ; i++)
	{
	    //was i <=   bug
		this.row[r].cell[i].dynlayer.setbg(color)
		this.row[r].cell[i].color = color
	}		
}


function StratumColColor(c,color)
{
	for (i=0 ; i < this.rows ; i++)
	{
	    //was i <=   bug
		this.row[i].cell[c].dynlayer.setbg(color)
		this.row[i].cell[c].color = color
	}
}

function StratumCellColor(r,c,color)
{
		this.row[r].cell[c].dynlayer.setbg(color)
		this.row[r].cell[c].color = color
}

function StratumSetCellSpan(r,c,span)
{
this.row[r].cell[c].span = span
//for now, set the array value to the number of columns in the span command,
//but later we could make use of this to set a true 'colspan='  attribute.
//if (r<3) {alert("span="+ span+" row="+r+" cell="+c)}
}

// Dynlayer setbg() required
function DynLayerSetbg(color) 
{
	if (is.ns4) this.doc.bgColor = color
	else if (is.ie) this.css.backgroundColor = color
	else this.css.backgroundColor = color
}

function StratumSetHeaderStyle(color,align,valign,padding,font,size)
{
	this.header = true
	this.headColor = color
	this.headAlign = align
	this.headValign = valign
	this.headPadding = padding
	this.headFont = font
	this.headFontSize = size
}

function StratumSetCellStyle(color,rcolor,align,valign,padding,font,size)
{   
	if (color.length >0) {this.cellColor = color}
	if (rcolor.length >0) {this.cellRollOver = rcolor}
	if (align.length >0) {this.cellAlign = align}
	if (valign.length >0) {this.cellValign = valign}
	if (padding.length >0) {this.cellPadding = padding}
	if (font.length >0) {this.cellFont = font}
	if (size.length >0) {this.cellFontSize = size}
}

function StratumsetHeaderText(text)
{
		this.headText = text
}

function StratumWriteHeaderText()
{
	if (this.header)
	{
	  this.headerlyr.write("<div class='" + this.name + "innerCell'><table border=0 width=" + (this.w - (this.spacing*2)) + " cellpadding=" + this.headPadding + "><tr><td class='" + this.name + "HdStyle' width=" + (this.w - (this.spacing*2)) + " height=" + this.cellheight + " align=" + this.headAlign + " valign=" + this.headValign + ">" + this.headText + "</td></tr></table></div>")
	}
}

function StratumSetSpacing(val)
{
	this.spacing = val
}

function StratumSetHref(r,c,url)
{
	this.row[r].cell[c].href = url
}

function StratumSetImg(r,c,url)
{
	this.row[r].cell[c].dynlayer.write("<img src='" + url + "' border=0>")
}

function StratumSetFn(r,c,fn,click)
{
	if (click) this.row[r].cell[c].click = true
	this.row[r].cell[c].fn = fn
}

function StratumCallFn(r,c){
	if (this.row[r].cell[c].fn)	eval(this.row[r].cell[c].fn)
}

function StratumBuild(){
var noline=0;
var span=1;	
	//determine cell widths based on table width
	this.availW = this.w - (this.spacing*2);
	this.neededW = this.availW - (this.spacing*(this.cols - 1))
	this.cellwidth = Math.round(this.neededW/this.cols)
	this.celltotal = (this.cellwidth*this.cols) + 
	    (this.spacing*(this.cols - 1))
	
	//determine cell heights based on table height, account for header
	if (this.header) {this.totalrows = this.rows + 1}
		else {this.totalrows = this.rows}
	this.availH = this.h - (this.spacing*2);
	this.neededH = this.availH - (this.spacing*(this.totalrows -1))
	this.cellheight = Math.round(this.neededH/this.totalrows)
	this.rowtotal = (this.cellheight*this.totalrows) + (this.spacing*(this.totalrows - 1))

	//optional width and height auto adjuster	
	if (this.celltotal != this.availW && this.adjust) 
	  {this.w = this.celltotal + (this.spacing*2)}
	if (this.rowtotal != this.availH && this.adjust) 
	  {this.h = this.rowtotal + (this.spacing*2)}

	//create css and divs
	this.Hpos = this.spacing
	this.Vpos = this.spacing
	this.Hstep = this.cellwidth + this.spacing
	this.Vstep = this.cellheight + this.spacing
	this.div = ''
	this.css = ''
	this.div += '<div id="' + this.name + 'ShadowDiv"></div>\n'
	//this.css += css(this.name+"ShadowDiv",this.x+this.shadowwidth,this.y+this.shadowwidth,this.w,this.h,this.shadowcolor,"show");//Mar 2007 Show changed to visible
    this.css += css(this.name+"ShadowDiv",this.x+this.shadowwidth,this.y+this.shadowwidth,this.w,this.h,this.shadowcolor,"visible")

	this.div += '<div id="' + this.name + 'LayerDiv">\n'
	
	//this.css += css(this.name + "LayerDiv",this.x,this.y,this.w,this.h,this.bgColor,"show");//Mar 2007 show changed to visible
	this.css += css(this.name + "LayerDiv",this.x,this.y,this.w,this.h,this.bgColor,"visible")
	
	if (this.header)
	   {
		this.css += css(this.name + "HeaderDiv",this.Hpos,this.Vpos,
		   //this.w -(this.spacing*2),this.cellheight,this.headColor,"show") //Mar 2007 show changed to visible
		this.w -(this.spacing*2),this.cellheight,this.headColor,"visible")   
		this.div += '<div id="' + this.name + 'HeaderDiv"></div>\n'
		this.Vpos += this.Vstep
	   }
	//Build input div and css
//    alert ("717 es device=" + device);
    if (device!="smartphone")
	{this.div += '<div id="InputDiv" name="InputDiv">' +
         '<form id="inBox" name="inBox" onsubmit="evalEntry();return false;" action="" method=post>\n' +
		     '<INPUT maxLength=127 size=10 type="TEXT" id="entryfield" name="entryfield" ' +
			  ' onkeydown="return evalKey(event);" autocomplete="off">\n' +
          '</form> </div>\n'; }
    else
     {this.div += '<div id="InputDiv" name="InputDiv">' +
         '<form id="inBox" name="inBox" onsubmit="evalEntry();return false;" action="" method=post>\n' +
		     '<INPUT maxLength=127 size=10 type="TEXT" id="entryfield" name="entryfield" ' +
			  '  onFocus="window.location.hash=&quot;anchor&quot;;" autocomplete="off">\n' +
          '<a name="anchor"></a>'+
         '</form> </div>\n'; }


	//this.css += css("InputDiv",this.Hpos,this.Vpos,this.cellwidth,this.cellheight,this.cellColor,"show",1)
    this.css += css("InputDiv",this.Hpos,this.Vpos,this.cellwidth,this.cellheight,this.cellColor,"visible",1)

    this.css += '#InputDiv INPUT {font-family : Trebuchet MS;font-size : 10pt;font-weight : bold; background-color:#ddddff; border-color : #336699;' +
    'border-style : inset; border-width : 0;color : #000000;}\n';
//alert(701 + this.css)
    //Build cell div and css's
	for (i=0 ; i < this.row.length ; i++)
	  {
	    var cellcount=0;  //Oct 2003
		for (j=0; j < this.row[i].cell.length ; j++)
		   { 
		    if (this.row[i].cell[j].align) 
			   {
			   this.cellAlign=this.row[i].cell[j].align
			   }
			if (this.row[i].cell[j].valign) 
			   {
			   this.cellValign=this.row[i].cell[j].align
			   } 
			   
			   span=this.row[i].cell[j].span;
			  
			var adjw=span*(this.cellwidth)+(this.spacing*(span-1));//Oct 2003
			if (adjw<0)	{adjw=0} //Mar 2007		
			this.css += css(this.name + "Row" + i + "Cell" + j + "Div",this.Hpos,
			 //  this.Vpos,adjw,this.cellheight,this.cellColor,"show")//Mar 2007 show changed to visible
			  this.Vpos,adjw,this.cellheight,this.cellColor,"visible")//Mar 2007 show changed to visible
			 
			 //  this.Vpos,this.cellwidth+noline,this.cellheight,this.cellColor,"show")
			
			this.div += '<div id="' + this.name + 'Row' + i + 'Cell' + j + 'Div">'
			this.div += "<div class='" + this.name + 
			   "innerCell'><table border=0 width=" + adjw + 
			   " height=" + this.cellheight +
			   " cellpadding=" + this.cellPadding + "><tr><td class='" + this.name + 
			   "TdStyle' width=" + adjw + " height=" + this.cellheight + 
			   " align=" + this.cellAlign + " valign=" + this.cellValign + ">"
			if (this.row[i].cell[j].value) this.div += this.row[i].cell[j].value
			this.div += '</td></tr></table></div>'
			this.div += '</div>\n'
			this.Hpos += (this.Hstep*span) 
		   }
	     this.Vpos += this.Vstep;
	     this.Hpos = this.spacing
	  }
	this.div += '</div>'
	
	//add css info for inside of cells
	this.css += "." + this.name + 
	"innerCell {position:absolute; left:-1; top:-4; width:" + this.cellwidth + ";}\n"
    //Note that InnerCell was capitalized in the preceding line.  I think this was a bug.

	this.css += "." + this.name + "TdStyle {font-family:" + this.cellFont + "; font-size:" + this.cellFontSize + ";}\n"

	this.css += "." + this.name + "HdStyle {font-family:" + this.headFont + "; font-size:" + this.headFontSize + ";}\n"
}

function StratumActivate(){
		this.contentlyr = new DynLayer(this.name + "LayerDiv")
		if (this.header) this.headerlyr = new DynLayer(this.name + "HeaderDiv")	
		this.inputbox = new DynLayer("InputDiv")
		for (var i=0 ; i < this.row.length ; i++){
		    
			for (var j=0; j < this.row[i].cell.length ; j++){
				this.row[i].cell[j].dynlayer = new DynLayer(this.name + "Row" + i + "Cell" + j + "Div")
				this.row[i].cell[j].dynlayer.setbg = DynLayerSetbg
				//this.row[i].cell[j].elayer = new DynLayer(this.name + "Row" + i + "Cell" + j + "Div")
				//if (this.row[i].cell[j].href || this.row[i].cell[j].fn) {
				if (is.ns4) {this.row[i].cell[j].dynlayer.event.captureEvents(Event.MOUSEDOWN)
					this.row[i].cell[j].dynlayer.event.onmousedown = new Function(this.obj + '.down('+i+','+j+'); return false;')
					}
				this.row[i].cell[j].dynlayer.event.onmousedown = new Function(this.obj + '.down('+i+','+j+'); return false;')
				this.row[i].cell[j].dynlayer.event.onmouseover = new Function(this.obj + '.over('+i+','+j+'); return false;')
				this.row[i].cell[j].dynlayer.event.onmouseout = new Function(this.obj + '.out('+i+','+j+'); return false;')	
			}
		}
		if (this.header && this.headText) this.writeHeader()
}



function StratumOver(r,c)
{ 
  
  if (!this.locked(r,c))
    {
	this.row[r].cell[c].dynlayer.setbg(this.cellRollOver);
	}	
}

function StratumOut(r,c)
{
	if (this.row[r].cell[c].color) 
	{
		this.row[r].cell[c].dynlayer.setbg(this.row[r].cell[c].color)
	}
	else
	{
		this.row[r].cell[c].dynlayer.setbg(this.cellColor)
	}
    entryObj=$("entryfield");
	entryObj.focus();
    entryObj.select();
	//Apparently when entry box gets in front of a cell, it causes mouseout and the cursor focus and
	//selection have to be restored.
}

function StratumDown(r,c)
{  //var type=this.row[r].cell[c].type;
   
   if (!this.locked(r,c))
    {
      cellName=this.name + "Row" + r + "Cell" + c + "Div";
      doubleclick = (cellName == this.lastCellClicked) 
	//Works in ns7 but not in ie6.  ie6 takes a double click as a click, unless well spaced.
	
	  this.lastCellClicked = cellName;  
	  this.evalEntry();
	  if (!this.moveInputTo(r,c)) 
	    {
		 this.out(r,c);
		 //this.moveInputTo(this.inputR,this.inputC);
		};
	  this.moveUp = false;
	  this.moveUpDown=false;
    }
}

Stratum.count = 0
