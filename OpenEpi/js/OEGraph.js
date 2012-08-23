// JavaScript Document
//OEGraph.js
//Converts commands (function calls) given in an Open Epi application to javascript
//text that can be run (using eval) against the graphing module, wz_jsgraphics.js.  
//The latter is a Javascript file from Walter Zorn that provides the ability to draw 
//lines, rectangles, polygons,  and ellipses in different colors at exact locations on 
//the screen.  It is issued under the open source GNU license and is therefore 
//available for use in Open Epi.

function OEGraph()
{
    //the constructor for the graphing class
    //this.g is an array to hold the accumulated javascript commands for the graphing
	//module, wz_jsgraphics.js
	
	this.html="";
	this.s  = "";
	//Header material for HTML page in case it is needed
	this.htmlheader = 
	'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">\n'+
    '<html>\n'+'<head>\n'+'<title>Untitled Document</title>\n'+
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n'+
    '</head>\n'+'<body>\n'
	this.validate=Validate;
	this.newgraph=newGraph;
	this.title=graphTitle;
	this.vaxis=vAxis;
	this.haxis=hAxis
	this.line=Line;
	this.bar=Bar;
	this.hbar=hBar;
	this.points=Points;
	this.images=Images;
	this.footnote=footNote;
	this.text=Text;
	this.add=Add;
	this.width=300;
	this.height=300; 
	this.left=150;
	this.top=125;
	this.jg; //The graphing object, to be set in newGraph
	this.endgraph=endGraph;
	this.nextfootnote= 50;
	this.nexttitle= -60;
	this.vunit
	this.hunit
	this.vmax;
	this.vmin=0
	this.hmax;
	this.hmin=0;
	this.bararray=new Array()
	this.groupBar=groupBar;
	this.vvalarray=new Array();
	this.hvalarray=new Array();
}
	
function Add(text)
{
this.html+=text +"\n";
}

function Validate(legalarray, origargs, legalsonly)
{
var i,j
var arg;
var tmp;
var point=new Array();
var args=new Array()
var retArray = new Array();
var tmpArray=new Array();
var pointnum=0;
//If any of the arguments are arrays, unfold them into individual parameters
//(Only down one level for now.  That is, an array is ok, but it must be an
//array of legal parameters, not an array of arrays, etc.
//alert("In validate")
for (i=0; i<origargs.length; i++)
 {
  if (objType(origargs[i])=="string")
    {
	 args[args.length]=origargs[i];
	}
  else if (objType(origargs[i])=="array")
    { 
	 for (j=0; j<origargs[i].length; j++)
	  {
	   args[args.length]=origargs[i][j];
	   //alert("arg="+args[args.length-1]);
	  }
	}	
 }
 //Args is now an array of strings
for (i=0; i<args.length; i++)
 {
  if (objType(args[i])=="string")
   {
     arg=args[i].split(":")
     if(legalarray[arg[0]]=="")  //An associative array member exists for this arg
                              //e.g., legalarray["varname"]
      {    //
		   tmp=parseFloat(arg[1])
		   if (isNumber(arg[1]))
			{  
			  tmp=parseFloat(arg[1]);  //return a number
			}
			else
			{
			  tmp=arg[1];
			} 
			if (retArray[arg[0]])
			  {//one of these already exists; add to array
			   if (objType(retArray[arg[0]])=="string")
			   { //convert to an array
			     tmpArray=[retArray[arg[0]]];
				 retArray[arg[0]]=tmpArray;
			   }
			   
			  // alert("type of retArray[arg[0]]="+objType(retArray[arg[0]]) + " arg[0]="+arg[0]+
			  // "\nlength="+retArray[arg[0]].length)
			    
			   retArray[arg[0]][retArray[arg[0]].length]=tmp;
			  }
			else 
			  {
			   retArray[arg[0]]=tmp;
			  }
			//alert("arg0 "+arg[0] + " retArray[arg[0]]="+retArray[arg[0]][retArray[arg[0]].length-1])
       } 
      else
       {
	       //Not a valid legal member
			if (legalsonly)
			  {
				//Reject it
				alert("'"+arg[0]+"'"+ " is not a valid parameter.")
			  }	
			else
			  { 
				//Assume it is data in the format x:y and return x as the key or index
				// and y as the value
				//alert(arg[0]+":"+arg[1]+"   "+objType(arg[0])+":"+objType(arg[1]));
				retArray[arg[0]+""]=arg[1]
			  } 
        }
    }
   else
     {alert("Items in the list must be strings.  Quotation marks may help.")}
 }
// alert("valname in return array "+retArray.valname)	
 return retArray
}



function newGraph(widthinpixels, heightinpixels, 
  leftmargininpixels, topmargininpixels)
//This command constructs a new graph object of the dimensions specified.  The width and height specify the graphing area, with axis markings placed to the left and below.  Titles, if any, will be centered over the graphing area, and footnotes will appear below the horizontal axis. 
{
//Use the name to set up a canvas

this.jg= new jsGraphics();
this.jg.setPrintable(true);
var str="";

this.width=widthinpixels;
this.height=heightinpixels;
this.left=leftmargininpixels;
this.top=topmargininpixels;

//doc=doc+"."+name
//str=doc+'.document.write('
//str+= '\'<div id=\"'+ name +'\"'
str+= '<div'
//str+= ' id='+ name 
str+=' style=\" POSITION: relative; LEFT:'+leftmargininpixels + 'px;'+
'TOP:'+ topmargininpixels + '; OVERFLOW: visible; WIDTH: '+widthinpixels+'px; '+
' HEIGHT: '+heightinpixels +'px\">'

this.add(str)  
}


function graphTitle(text, font, size, style)
//The text will be centered over the graphing area.  Font, size, and style are optional.
{
      this.jg.setFont("arial,helvetica,sans-serif", "14px", Font.BOLD);
	  
	  this.jg.drawString(text,0,this.nexttitle)
	  this.nexttitle+=20;
}


function vAxis ()
//Specifies the vertical or y axis.  "varname" is taken as the label for the axis.  Min and Max specify the numeric limits of the axis.  "Tick" and "labelevery" are the intervals between tick marks and numeric labels.  If min, max, tick, and labelevery are omitted, valnames may be specified as text items, creating an axis for categorical values, such as "anthrax," "salmonella", and "yellow fever."  
{
//"varname:text", "vmin:xxx","vmax:xxx","tick:xxx","labelevery:xxx", "valname:text", "valname:text", etc.
  var param=new Array()
  param["varname"]=""
  param["vmin"]=""
  param["vmax"]=""
  param["tick"]=""
  param["labelevery"]=""
  param["valname"]=""
  
  
  var vars=this.validate(param,arguments,true)
 // alert("vars for labelevery="+vars["labelevery"])
 
  //var i
 
  var pxu=(this.height/(vars.vmax-vars.vmin))  //pixels per axis unit
  this.vunit=pxu
  //alert("pxu="+pxu + " vars.vmax="+vars.vmax+"vars.vmin="+vars.vmin)
  this.vmax=vars.vmax
  this.vmin=vars.vmin
    this.jg.setColor("#000000");
	this.jg.setStroke(2);
    //jg.setFont("arial,helvetica,sans-serif", "11px", Font.PLAIN);
    //jg.drawString("<nobr>.drawEllipse(&nbsp;)<\/nobr>",35, 180+dy);
    this.jg.drawLine(0,0,0,this.height);
	this.jg.setStroke(1);
	//Do ticks
	for (var i=vars.vmin+vars.tick; i<=vars.vmax; i+=vars.tick)
	  {
	    //alert("i for tick="+i)
	    this.jg.drawLine(-4,this.height-(i*pxu),0,this.height-(i*pxu));
	  }
	  //alert(204)
	this.jg.setFont("arial,helvetica,sans-serif", "11px", Font.PLAIN);
    //alert(206)
	 //do labels
	if (vars.valname)
	 {//labels specified
	   alert("vars.valname.0="+vars.valname[0])
	 }
	else
	 {
	   //alert("vars.labelevery="+vars.labelevery+"\nvars.vmin="+vars.vmin+
	   //"\nvars.vmax="+vars.vmax);
	   for (var i=vars.vmin; i<=vars.vmax; i+=vars.labelevery)
	    {
		 //alert("i="+i+" pxu="+pxu+" i * pxu="+(i*pxu))
	     //alert("drawlabel at "+(this.height-(i*pxu)));
		 this.jg.drawString(fmtFixed(i,1),-35, this.height-(i*pxu)-6);
	    }
	 }
	 this.jg.setFont("arial,helvetica,sans-serif","14px",Font.BOLD);
	 this.jg.drawString(vars.varname,-100,Math.round(this.height/2)-6);
	 //alert(224)
}

function hAxis ()
//Specifies the horizontal or x axis.  "varname" is taken as the label for the axis.  Min and Max specify the numeric limits of the axis.  "Tick" and "labelevery" are the intervals between tick marks and numeric labels.  If min, max, tick, and labelevery are omitted, valnames may be specified as text items, creating an axis for categorical values, such as "anthrax," "salmonella", and "yellow fever."  
{
var param=new Array()
  param["varname"]=""
  param["hmin"]=""
  param["hmax"]=""
  param["tick"]=""
  param["labelevery"]=""
  param["valname"]=""
  
  
var vars=this.validate(param,arguments,true)
//"varname:text", "min:xxx","max:xxx","tick:xxx","labelevery:xxx", "valname:text", "valname:text", etc.

 var i
 
 var pxu=Math.round(this.width/(vars.hmax-vars.hmin))  //pixels per axis unit
 this.hunit=pxu;
 this.hmax=vars.hmax
 this.hmin=vars.hmin
 
    this.jg.setColor("#000000");
	this.jg.setStroke(2);
    //jg.setFont("arial,helvetica,sans-serif", "11px", Font.PLAIN);
    //jg.drawString("<nobr>.drawEllipse(&nbsp;)<\/nobr>",35, 180+dy);
    this.jg.drawLine(0,this.height,this.width,this.height);
	this.jg.setStroke(1);
	//Do ticks
	for (i=vars.hmin; i<=vars.hmax; i+=vars.tick)
	  {
	  //alert("i="+i)
	    this.jg.drawLine((i*pxu),this.height,(i*pxu),this.height+4);
	  }
	  this.jg.setFont("arial,helvetica,sans-serif", "11px", Font.PLAIN);
    
	 //do labels
	 if (vars.valname)
	 {//labels specified
	   
	   var str=""
	   if (objType(vars.valname)=="array")
	     {
	      // for(var i=0; i<vars.valname.length; i++)
	      //  {str+=vars.valname[i]+"\n";}
		  //  alert("vars.valname in hbar="+str)
		  this.hvalarray=vars.valname;  
	     }
	    else 
		 { //must be a string
		  this.hvalarray[0]=vars.valname;
		 } 
		this.hunit=Math.round(this.width/vars.valname.length)
		//Draw ticks and labels
		for (var i=0; i<this.hvalarray.length; i++)
	    {
		 //alert("i for drawing="+i);
	     this.jg.drawLine((i+1)*this.hunit,this.height,(i+1)*this.hunit,this.height+4);
		 this.jg.drawString(this.hvalarray[i],((i+1)*this.hunit)-(this.hunit/2.5), this.height+12);
	    }
	 }
	 else
	 {
	   for (i=vars.hmin; i<=vars.hmax; i+=vars.labelevery)
	    {
	     //this.jg.drawLine(-4,this.height-(i*pxu),0,this.height-(i*pxu));
		 this.jg.drawString(fmtFixed(i,1),(i*pxu)-6, this.height+12);
	    }
	 }
	 this.jg.setFont("arial,helvetica,sans-serif","14px",Font.BOLD);
	 this.jg.drawString(vars.varname,Math.round(this.width/3),this.height+30);

}

function Line()
//Draws a line connecting the points indicated by the x:y values, "hhh:vvv".  The line will begin at the first point given.
//The color of the line may be expressed as a six character RGB indicator such as "#ff0000" for red.  The default is blue, or #0000ff.
//Each of the remaining items specifies one point on the line, with "hhh" and "vvv" being values on the horizontal(x) and vertical(y) axes.  If an axis contains categorical text items, the corresponding plot coordinates must match one of the text items.  
//If more than one line command is given, multiple lines will be drawn.
{
//"color:#xxxxxx", "hhh:vvv","hhh:vvv",.etc. 
var param=new Array()
  
//alert(arguments.join())  
var vars=this.validate(param,arguments,false)

//Validate with legalsonly set to false.  Will return x:y pairs as data
 var i=0
 var p=0;
 var s;
 
 var Xpoints = new Array()
 var Ypoints=new Array()
 for (key in vars)
 {
  s=key                    //Get the string value of the key or index
  if (s == "color")
    {
	 this.jg.setColor(vars.color)
    }
   else if (s=="hcoords")
	{
	 Xpoints = Xpoints.concat(eval(vars[s]))
    }
   else if (s=="vcoords")
    {
	 Ypoints = Ypoints.concat(eval(vars[s]))
	}
   else
	{	
	  //Add  to the Xpoint and Ypoint arrays
	  Xpoints[Xpoints.length]=s;
	  Ypoints[Ypoints.length]=vars[s];
	}	 	 
 }
 
 for (i=0;i<Xpoints.length;i++)
   { if (isNumber(Xpoints[i]))
     {
	   Xpoints[i]=this.hunit*parseFloat(Xpoints[i]);
	 }
	 else
	 { //Not a number; convert to coordinate
	 
	 }
   } 
 for (i=0;i<Ypoints.length;i++)
   { if (isNumber(Ypoints[i]))
     {
	   Ypoints[i]=this.height-(this.vunit*parseFloat(Ypoints[i]));
	 }
	 else
	 { //Not a number; convert to coordinate
	 
	 }
   }	 	 
// alert(Xpoints[0]+" "+Ypoints[0]+" "+Xpoints[1]+" "+Ypoints[1])
 this.jg.drawPolyline(Xpoints,Ypoints)
}

function Bar()
//Draws a vertical bar for each of the x:y values, "hhh:vvv".  
//The color of the bar may be expressed as a six character RGB indicator such as "#ff0000" for red.  The default is blue, or #0000ff.
//Each of the remaining items specifies one bar, with "hhh" and "vvv" being values on the horizontal(x) and vertical(y) axes.  If an axis contains categorical text items, the corresponding plot coordinates must match one of the text items.  
//If more than one bar command is given, the bars will be grouped, so that that all bars for "anthrax," for example, appear over the label "anthrax".
{
//"color:#xxxxxx", "hhh:vvv","hhh:vvv",.etc.
//Save commands to find out how many there are before executing.  This is 
// necessary for calculating width and position of grouped bars

var param=new Array();
var args=new Array();
var strcmd=""
for (var i=0; i<arguments.length;i++)
  {args[i]=arguments[i]}

strcmd+='"'+args.join()+"\""
//strcmd+=args.join()
//+"\""
strcmd=strcmd.replace(/[^'"],[^'"]/g,"\",\"")
//alert("strcmd="+strcmd)
strcmd+=")";
//Construct a new command as a string and save it in the bararray for later 
//execution with eval
this.bararray[this.bararray.length]='this.groupBar('+strcmd;
alert(this.bararray[this.bararray.length-1])
}

function groupBar()
{//Set color
//Find offset from center of location of bar group
//

//alert("groupbar")

var beginbar;
var groupspacing=10;
var barsingroup=this.bararray.length
var barwidth=(this.width/this.hvalarray.length)/(barsingroup+groupspacing)

for (var i=0; i<this.hvalarray.length; i++)
  {
   beginbar= -0.5*barwidth + 0.5*groupspacing + i*barwidth//half of barwidth*barsingroup+1
   //alert("beginbar="+beginbar)
   alert("hvalarray="+this.hvalarray[i])
  }
}

function hBar()
//Draws a horizontal bar for each of the x:y values, "hhh:vvv".  
//The color of the bar may be expressed as a six character RGB indicator such as "#ff0000" for red.  The default is blue, or #0000ff.
//Each of the remaining items specifies one bar, with "hhh" and "vvv" being values on the horizontal(x) and vertical(y) axes.  If an axis contains categorical text items, the corresponding plot coordinates must match one of the text items.  
//If more than one plotbars command is given, the bars will be grouped, so that that all bars for "anthrax," for example, appear opposite the valname "anthrax".
{
//"color:#xxxxxx", "hhh:vvv","hhh:vvv",.etc. 

}

function Points( )
//Essentially the same as plotline, but the points are indicated by circles, dots, squares, or triangles as specified in "shape:".  Valid choices for "sss" are "circle", "square",  and "triangle".  Any of these may be preceded by "s", as in "scircle" to indicate a solid or filled circle, giving six possible indicators for each color.
{
//"color:#xxxxxx", "shape:sss", "hhh:vvv","hhh:vvv",.etc.
}

function Images()
//Essentially the same as plotpoints, but the points are indicated by the image specified.
{
//"image:relfilename", "hhh:vvv","hhh:vvv",.etc. 
}

function footNote( text, font, size, style)
//Places text below the graph.  Each footnote begins on a new line. New lines can also be indicated by inserting "\n" in the text.
{
	  this.jg.setFont("arial,helvetica,sans-serif", "12px", Font.PLAIN);
	  
	  this.jg.drawString(text,0,this.height+this.nextfootnote)
	  this.nextfootnote+=20;
}

function Text(text, xloc,yloc,  font, size, style)
//Places text on the graph itself at the location indicated.  Note that, if desired, the line command can be used to create a pointer from the text to a particular bar or line.
{   
    
    this.jg.setFont("arial,helvetica,sans-serif", "11px", Font.PLAIN);

    this.jg.drawString(text,xloc,yloc)
}

function endGraph( )
//closes the current graph
{
//Temporary fix to make page extend beyond the graph in Netscape
var str='<div style="position:relative;left:0px;top:300px;align=center">'
str+='<table><tr><td><p><br><br><br><br><br><br><br><br><br><br>&nbsp;</p><p>&nbsp;</p>'
str+='</td></tr></table></div>'
for(var i=0; i<this.bararray.length; i++)
//Eval all the bar commands that have been saved up
 {
   eval (this.bararray[i])
 }
this.add(this.jg.htm)
this.add("</div>")
this.add(str);
//alert(this.html)
//this.add('opener.resultwin.document.write(jg.htm);')
//this.add("opener.resultwin.document.write('chart canvas</div>')")
}


