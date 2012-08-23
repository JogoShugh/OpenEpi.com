// JavaScript Document  AppHelper.js
//Global variables and functions for opening data input window
//To be linked into OpenEpi Applications
var OpenEpi=false; //Set when Etable is loaded and false after unloading
var OEShell=true;
//These global variables must be present for ETable to work with settings from
//this module.
var EntryWin;   //for data entry
var ResultWin;  //for results
var DemoWin;    //for demo data htm
var ExWin;      //for demo and Exercise instructions
var newWindow; // for messages
//Jan 2007
var LoadData=false;  //Set to true when data are to be loaded from demofile frame (or future storage)
var etablecmds1=new Array();
var etablecmds2=new Array();
//var appDataArray=new Array();
var triedtoopen=0;
var applabel=null;  //Label for section in the translation file.  Will be set by InitTranslation and reset to null by t();
//Number of attempts to open the EntryWin window
if (typeof(basefilename)== "undefined")
  {
	var basefilename="NoBaseFile"
	//alert("location.pathname="+location.pathname);
  }
//alert("window.top.code.translationpath="+window.top.code.translationpath);  //This works when menu is running alone without a shell
var demofile="";     //Must be defined even if there is no demo file.

//Basefilename must be defined and set at the beginning of the application
//The other filenames are derived from the basefilename as follows:
demofile=basefilename+"Demo.htm";  //If you do not have a demo file, set this variable to null ("")
								   //in the application itself
                                   //The Load Demo Data button and the Demo toolbar button 
								   //will be automatically omitted from the interface.

var statsfile=basefilename+".js";  //The file containing statistical routines. 
var examplefile=basefilename+"Ex.htm"
var docfile="../Documentation/"+basefilename+"doc.htm"; //The help or documentation file
var testfile="../Documentation/"+basefilename+"tests.htm"; //A file describing testing that has been done
var inscreenimg="Screens/"+basefilename+"In.gif"  //Assumes files by these names are supplied in the
var outscreenimg="Screens/"+basefilename+"Out.gif" //subdirectory called Screens.
var TFrameFile=examplefile;


function useOpenEpiEntry(tblcmdarray1,tblcmdarray2,externalData)
{
//Opens the ETable module in a new window.  Its properties can be referred to by
//referring to the EntryWin object.
if ($('panel2').innerHTML.length>0)
  { return}
/*  try
  {
  if (!EntryWin.closed) 
    {
     //If it exists, just bring it to the foreground
     EntryWin.focus()
     return
    }
  }
  catch(e)
  {
  }*/
 // alert("61 LoadData="+LoadData);
appDataArray=new Array()   //Initialize the arrays in case this is a rerun
etablecmds1=new Array()
etablecmds2=new Array()
//If it does not exist, parse the input table setup commands and make them available
//in the two arrays, called Etablecmds1 and Etablecmds2, using the functions in the Input 
//object, which know which of the two arrays to employ.

if (tblcmdarray1 && tblcmdarray1.length>0)
{
 //There must be tabcmdarray1, probably from a demo file or other outside input
 etablecmds1=tblcmdarray1;  //If commands are provided, use them; otherwise this should do no harm.
 etablecmds2=tblcmdarray2;
 //alert("etablecmds1 has "+ etablecmds1.length + " commands")
}
else
{
 if (typeof(configureInput)=="undefined"){return}
 if (configureInput()==false)
  {
    //Run configureInput, but, if the user cancelled, just return.
    return
  }
}
//open the data entry table as a popup window.

//Never again after Jan 2007
//Run Etable in the Panel2 iframe
//var entryProg="../Etable/ETable.htm";

//var myFrame=document.getElementById('panel2');
//alert("about to set SRC at 89")
//myFrame.setAttribute('src',"../Etable/ETable.htm");
//frames["panel2"].location.href="../Etable/ETable.htm";

//showPanel(2);
//EntryWin=frames["panel2"];
showPanel(2); //moved down, Mar 2007
//if (device=="smartphone")
//  {showPanelAsWindow(2)}

//alert("finished loading frame in 94");

//EntryWin=frames["panel2"]
//EntryWin=myFrame;  //Mar 2007

if (externalData)
 {
  appDataArray=externalData;
  //alert("128 ada Must be external Data")
 }
/*
if (EntryWin != null && EntryWin.OpenEpi==true)
    {
	//checkWindowOpen()
	}
  else
    {
	 //setTimeout("checkWindowOpen()",1000)
	 //Give Etable time to load before loading data or trying again
    }
//alert("finished useOpenEpiEntry")
*/   
}

function checkWindowOpen()
{
 //Calls useOpenEpiEntry again if there is no EntryWin, up to 4 times.  Loads
 //data into EntryWin if this is a demo
 alert("in appHelper 145 in checkWindowOpen")
try
 {

  if (!EntryWin)
   {
    if (triedtoopen<4)
     {
	   //alert("Calling useOpenEpiEntry "+"try="+triedtoopen)
       useOpenEpiEntry()
	   //alert(93)
     }
    else
     {
     alert("Problem in opening the data entry window.\n If you have a popup window exterminator, you can turn it off, or work by clicking on the ENTER menu item.");
    //Gives user advice, but may also solve the problem through providing more time;
     }
   }
  else
   {
    //EntryWin exists but is not necessarily completely loaded
    triedtoopen=0
	//EntryWin must exist.  Reset tries to 0.
	//
	do
	{
	if (appDataArray && appDataArray.length>1)
	   {

		//alert("sample data in appDataArray[1]="+appDataArray[1]["E0D0"])
		//alert("sample data in appDataArray[5]="+appDataArray[5]["E0D0"])
	   if(EntryWin && EntryWin.OpenEpi==true && !EntryWin.closed)
	    {
		 //EntryWin exists and is completely loaded and not closed")

	    EntryWin.dataMatrix=appDataArray;
	//alert("148 sample data in EntryWin.dataMatrix[1]="+EntryWin.dataMatrix[1]["E0D0"])
		//alert("sample data in EntryWin.dataMatrix[5]="+EntryWin.dataMatrix[5]["E0D0"])

		EntryWin.readMemToTable(1);  //Get stratum 1 data

		EntryWin.readMetaToTable();  //Get metadata from dataMatrix

		if (EntryWin.dataMatrix.length>2)
		 {
		     for (i=0; i<EntryWin.dataMatrix.length-2;i++)
		       {
		         EntryWin.addStratum()
		       }
			 EntryWin.changeStratumTo(1);
		 }
		 }
	    }
	 }
	 while (EntryWin && !(EntryWin.OpenEpi==true) && !EntryWin.closed);
	 appDataArray=new Array();  //Clean up
	 //alert("166 entryWin.OpenEpi="+EntryWin.OpenEpi)
   }
 }
 catch(e)
  {
  alert("Problem in opening window or reading data.  Error message is: "+e)
  }
}


function openWindow(doc,name,properties)
{
var theWindow;
try
{
  theWindow=window.open(doc,name,properties)
}
catch(e)
{
  return false
}
return theWindow;
}

function closeWindow(windowvar)
{
try
{
 if (windowvar!=null)
  {
   if(!windowvar.closed)
     {
      windowvar.close()
     }
  }
}
catch(e)
{
}
}


function closeWindows()
{
//called automatically from the onUnload event in the <body> tag
       closeWindow(EntryWin)
      // if(device=="smartphone")
     //    {
      //    if(panelWin!=null){panelWin.close();}
     //    }
	   //closeWindow(DemoWin)
	closeWindow(ResultWin)  //user may want to leave this one open?
}

function browserLanguage()
{
	//Gets the language of the browser as a two-character, 
	//upper-case standard Internet code, such as EN for English or ES for Spanish.
	//If none is found, a null string returns, probably indicating an unusual browser
 var ie=window.navigator.browserLanguage; //Works in IE
 var ns=window.navigator.language;     //Works in Netscape
 if (typeof(ie) != "undefined")
   {return ie.toUpperCase().substring(0,2)}
 else if (typeof (ns)!="undefined")
   {return ns.toUpperCase().substring(0,2)}  
 else {return ""}	
}

function completedHTML(stringtofix,omittext)
{
var regexp=/<html>/i;
if (!regexp.test(stringtofix))
{
    //add initial tags for html
    var htmlheader =
	'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">\n'+
    '<html>\n'+'<head>\n'+'<title>Untitled Document</title>\n'+
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n'+
    '</head>\n'+'<body>\n'
	//alert("htmlheader="+htmlheader+ " stringtofix="+stringtofix)

    stringtofix=htmlheader+stringtofix
//		alert(stringtofix)
}

regexp=/<\/html>/i;
if (!regexp.test(stringtofix))
{
    //add closing tags
	if (!omittext)
	{
	stringtofix+="\n<br><h3>"+	t("Results from OpenEpi, Version 2, open source calculator--")+ basefilename+"</h3>";
	stringtofix+=document.location.href +"<br>";
	stringtofix+="\n"+t("Source file last modified on")+" " + document.lastModified;
	stringtofix+="\n<br><br>"+t("Print from the browser, or select all or part of the text and then copy and paste to other programs.")+"<br>\n";
	stringtofix+="\n"+t("Many browsers have an optional setting to print background colors.")+"\n";
	}
	stringtofix += "</body></html>"

}
return stringtofix
}


function writeResults(stringtowrite, windowandfilename, saveifpossible, outputObj, omitfooter)
{
var htmlstr;
if (outputObj!=null)
 {
  htmlstr=htmlHeaderWithData(outputObj.data)+stringtowrite;
 }
else
 {
  htmlstr=stringtowrite;
 }
//Jan 2007
if (starttime> 1)
   {
     timerStop(10)
   } //moved from below
var resultpane=document.getElementById("panel3");
htmlstr=completedHTML(htmlstr,omitfooter); //Adds HTML tags and header if necessary

resultpane.innerHTML=htmlstr;
//alert(298+resultpane.innerHTML)
//htmlstr=completedHTML(htmlstr,omitfooter); //Adds HTML tags and header if necessary
var fname=""
//window.frames["panel2"].timerStop(10);
showPanel(3);   //Open the results panel
/*
if (EntryWin) {EntryWin.timerStop(10)};  //Stop timer and leave it visible for 10 seconds
ResultWin=window.open("","Results");
ResultWin.document.open();
ResultWin.document.write(htmlstr);
ResultWin.document.close();
ResultWin.resizeTo(800,600);
*/
if (saveifpossible)
 {
 fname=savetofile(htmlstr,windowandfilename)
 }
 /*
setTimeout("if (!ResultWin.closed) {ResultWin.focus();}",100);
setTimeout("if (!ResultWin.closed) {ResultWin.focus();}",1000);
setTimeout("if (!ResultWin.closed) {ResultWin.focus();}",2500);
setTimeout("if (!ResultWin.closed) {ResultWin.focus();}",5000);
*/
}


function popWindow(message,millisecs)
{
var mwidth  = 700;
var mheight = 50;

newWindow = window.open("",'newWindow','toolbar=no,menubar=no,resizable=no,scrollbars=no,status=no,location=no,width='+mwidth+',height='+mheight);
var htmlstr

htmlstr='<html><head><script language="javascript">\n'
htmlstr+='var t\n'
htmlstr+='function closeMe()\n'
htmlstr+='{\n'
htmlstr+='t = setTimeout("self.close()",'+millisecs+');\n'
htmlstr+='}\n'
htmlstr+='</script>\n'
htmlstr+='</head>\n'
htmlstr+='<body onload="closeMe()" bgcolor="#CCCCFF">\n'
htmlstr+='<body bgcolor="#CCCCFF">\n'

htmlstr+='<h3>'
htmlstr+=message
htmlstr+='</h3>\n'
htmlstr+='</body></html>'
newWindow.document.open()
newWindow.document.write(htmlstr);
newWindow.document.close();
//newWindow.closeMe()

if (millisecs>400)
{
  m=setTimeout("newWindow.focus();",300);
}

}

function oesavefound()
{    //revised Sept 2009 to avoid error in Firefox 3.5
if (window.parent) 
    {
	 if (window.parent.parent=="OpenepiSave.hta")
	   {
	     //if (window.parent.parent.savingdata)
		 //  {
		     return true;
		 //  }
	    }
     }
return false;
}

function savetofile(htmstr, name,append)
{
var calledsave=false;
var namesaved=""

if (oesavefound())
   {
     //Call saving routine and get back path of saved file
	 namesaved = window.parent.parent.savingdata(htmstr,name,append)
	 popWindow("Results saved in "+namesaved,6000)
	 calledsave=true
   }
return calledsave;
}

function jsStringFromArray(dataArray)
{
var jsStr = 'var A = new Array()\n'
//var ix=0;
//var val
//var index = new Array();
/*
for (key in dataArray)
  {index[ix]=key;
   ix++;}
index.sort()
*/
//jsStr+='var s = new Array();\n'
for (i=0; i<dataArray.length;i++)
 {if (i==0) {jsStr+='\n   \/\/Meta data for the dataset...\n';}
  if (i==1){jsStr+='\n  \/\/Data in one or more strata...\n';}
  var val,j
  jsStr+='var s'+i+'= new Array();\n'
  for (key in dataArray[i])
   {
    val=dataArray[i][key]
    //jsStr+='s["'+key+'"]='+dataArray[i][key]+'\n'
	//if(key=="Evals") {alert("typeof="+typeof(val)+" length="+val.length)}
	if (typeof(val)=="object")
	  {

	     //alert("key="+key)
		 if (val!=null && val.length)
		 {
		 // if (val.length==null) {alert("val.length=null" + "val=" + val)}
	       if (val.length>0)
	       {
	        //must be an array
	         jsStr+='s'+i+'["'+key+'"]=new Array(';
		     for(j=0; j<val.length; j++)
		     {
		       jsStr+='"'+val[j]+'"';
			   if (j<val.length-1){jsStr+=',';}  //If not the last item, add a comma
		     }
		     jsStr+=')\n';
	       }
	     }
	  }
	else
	  {
		if (typeof(val)!="string")
		 {
		   jsStr+='s'+i+'["'+key+'"]='+val+'\n'   // no quotes
		 }
		 else
		 {
		  //jsStr+='A['+i+']["'+key+'"]='+'\"' + val+'\"\n'  //Set up javascript assignment to array
		  jsStr+='s'+i+'["'+key+'"]='+'\"' + val+'\"\n'

		 }
	  }
   }
   jsStr+='A['+i+']=s'+i+';\n'
   //jsStr+= 's.length=0;\n'
 }

return jsStr;
}

function jsToHtml(js)
{
 var tag='<script language="JavaScript" type="text/JavaScript">\n'
 return tag+js+'\n</script>'
}

function dataToJSFunction(dataArray)
{
//Note: This assumes that the string representing the array names the array 'A'
var s='function dataArray()\n{'

s+=jsStringFromArray(dataArray);
s+='\nreturn A\n}\n'

return s;
}

function inputCmdsToJSFunction(inputArray,functionname)
{
var i;
var s='function '+functionname+'()\n{var A=new Array()\n';
for (i=0; i<inputArray.length; i++)
  {
  s+='A['+i+']='+"\'"+inputArray[i]+"\'"+'\n'
  }
s+='\nreturn A\n}\n\n'
return s;
}

function callStatsIf()
{
//Call stats if panel two is visible.  Mar 2007
//alert ("Panel 2 display="+document.getElementById('panel2').style.display );
if (document.getElementById('panel2').style.display != 'none')
  {
  //EntryWin.calculateStats()
  calculateStats()
  }
}


function htmlHeaderWithData(dataArray)
{

var s=
'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">\n'+
    '<html>\n'+'<head>\n'+'<title>Results</title>\n'+
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n'+

 '<style>'+
'table {'+
'  width:80%;'+
'}'+
//'img {'+
//'  width:15%;'+
//'} '+
'</style>'+

    '</head>\n'
/*
var s1='function runEtable()\n'+
'{\n'+
'if (opener)\n'+
' {\n'+
'   if (opener.useOpenEpiEntry)\n'+
'    {\n'+
'	  opener.useOpenEpiEntry(etableCmds1(),etableCmds2(),dataArray());\n'+
'	}\n'+
' }\n'+
'else if (parent)\n'+
' {\n'+
'   if (parent.useOpenEpiEntry)\n'+
'    {\n'+
'	  parent.useOpenEpiEntry(etableCmds1(),etableCmds2(),dataArray());\n'+
'	}\n'+
' }\n'+
'}\n\n';
*/
var s1='function runEtable()\n'+
'{\n'+
'if (typeOf useOpenEpiEntry=="function")\n'+
' {\n'+
'   useOpenEpiEntry(etableCmds1(),etableCmds2(),dataArray());\n'+
'	}\n'+
' }\n'


//s+=jsToHtml(dataToJSFunction(dataArray)+inputCmdsToJsFunction(cmds1,"etableCmds1")+inputCmdsToJsFunction(cmds2,"etableCmds2")+s1);
s+=jsToHtml(dataToJSFunction(dataArray)+inputCmdsToJSFunction(etablecmds1,"etableCmds1")+inputCmdsToJSFunction(etablecmds2,"etableCmds2")+s1);


s+='</head><body onload="runEtable()">\n'

return s
}

var dialoghandle = "";

function modalDialog(urlname)
{
//Shows an htm file containing suitable code to keep the dialog in front of
//other windows.  To use this technique, copy DialogYesNo.htm and modify it for
//your application.  It will automatically call processDialog(choice) when the user
//makes a choice. processDialog must be in the application.
//var waitover=0;
//var result=null;
//var winhandle=null;
attributes='height=200,width=300,left=300,top=200'
dialoghandle=openWindow(urlname,"dialogwin",attributes);
}

function loadIframe(iframename,filetoload)
 {
	  window.frames[iframename].location.href=filetoload;
 }

//A function for writing the entire front end document as an HTML string, using document.write

function writeFrontEnd(apptitle,authors,description,demofile)
{
 //String of HTML code to write
var fe="";
//fe+="</script>";
//fe+='<link rel="stylesheet" href="../CSS/TabbedUI.css" TYPE="text/css" MEDIA="screen">\n';
//fe+='<link rel="stylesheet" href="../CSS/TabbedUI-print.css" TYPE="text/css" MEDIA="print">\n';
//fe+='<link rel="StyleSheet" href="../CSS/dtree.css" type="text/css" >\n';
//fe+='<SCRIPT language="JavaScript" src="../js/IncludeFiles.js" type=text/JavaScript></SCRIPT>\n';

if (device=="smartphone")
{
  fe+='<STYLE type=text/css> '
  fe+='table{width:290px;background-color:#FFFFFF} tr{width:290px;} td{width=290px;}'
  fe+='</STYLE>'
}

fe+='</HEAD>';
fe+='<BODY onLoad="initPanels(1);" onUnload="closeWindows();" onBeforeUnload="closeWindows();">';
	//The first works in Netscape; the second in IE 6
//fe+='<div id="menuDiv" name="menuDiv" style="width:25%;"  class="dtree">';

//fe+='<div id="menuDiv" name="menuDiv" style="float:left;overflow:auto;"  class="dtree">';
fe+='<div id="menuDiv" name="menuDiv" style="float:left;overflow:auto;">';
fe+= d ;
//fe+='<script type="text/javascript" src="../js/Menuitems.js"></script>';
fe+='</div>';
//var tabWidth=20;
if (device!="smartphone")
{
  //Include the menu
//fe+=ExpColl+d;
  //fe+='<div id="divLogo" name="divLogo"><img src="../img/OpenEpi1.gif" id="logo" name="logo" width="110" height="30"></div>';//was 184 x 51
}
else
{
 // fe+='<div id="tab0" class="tab" width="15%" bgcolor="#CC6600"><a onClick="javascript:window.location=parent.location;history.go(-1);">'+'<strong>'+t("Menu")+'</strong>'+'</a></div>';
 //fe+='<div id="tab0" class="tab" width="15%" bgcolor="#CC6600"><a id="menulink" href="../menu/OEMenu.htm" onClick="window.close();" target="_self">'+'<strong>'+t("Menu")+'</strong>'+'</a></div>';
}

//fe+='<div id="tab6" class="tab" style="position:absolute; left: 34%; width:20%; top:0;" onClick = "if (OpenEpi==false){useOpenEpiEntry()};showPanel(2);" onMouseOver="hover(this);" onMouseOut="setState(2);">'
//fe+=t('Enter')
//fe+='</div>'

//fe+='<div id="tabDiv" name="tabDiv" style="position:absolute; top:0px; left:25%; height:24px;">';

//if (device=="smartphone")
//{
//fe+='<div id="tabDiv" name="tabDiv" style="position:absolute; top:0px; left:5px; right:0px; height:27px;">';
fe+='<div id="tabDiv" name="tabDiv" style="float:left; top:0px; height:27px;">';

// }
// else
 //{
// fe+='<div id="tabDiv" name="tabDiv" style="position:absolute; top:0px; left:25%; right:0px; height:27px;">';
// }
fe+='<button id="toMenu">Menu</button>'
fe+='<div id="tab1" class="tab" onClick = "showPanel(1);" onMouseOver="hover(this);" onMouseOut="setState(1)">'
fe+=t('Start')
fe+='</div>'
//Changed nov 1, 2011 fe+='<div id="tab2" class="tab"  style="position:absolute; left:'+'18.5%;"'+'onClick = "showPanel(2);" onMouseOver="hover(this);" onMouseOut="setState(2);">'
fe+='<div id="tab2" class="tab"'+'onClick = "useOpenEpiEntry();showPanel(2);" onMouseOver="hover(this);" onMouseOut="setState(2);">'

//fe+="&nbsp;"
//fe+='<div id="tab2" class="tab"  style="left:'+'18%;"'+'onClick = "if (OpenEpi==false){useOpenEpiEntry()};showPanel(2);" onMouseOver="hover(this);" onMouseOut="setState(2);">'
fe+=t('Enter')
fe+='</div>'
fe+='<div id="tab3" class="tab" onClick = "callStatsIf(); showPanel(3);" onMouseOver="hover(this);" onMouseOut="setState(3);">'
fe+=t('Results')
fe+='</div>'
fe+='<div id="tab4" class="tab" onClick = "showPanel(4);showExWindow();" onMouseOver="hover(this);" onMouseOut="setState(4)">'
fe+=t('Examples')
fe+='</div>'

//if (device=="smartphone")
//{
//fe+='<td <div id="tab5" class="tab" style="left: 82%;" align="center" width="15%" bgcolor="#EEEEEE"><a onClick="writeToWin(document.body.innerHTML)" ><img src="../img/move.gif" width="20px" alt=t("Scroll")></a></td>';
 // fe+='<td <div id="tab5" class="tab" style="position:absolute; left: 66%;" align="center" width="15%" bgcolor="#EEEEEE"><a onClick="showPanelAsWindow(currentPanel);" ><img src="../img/move.gif" width="10%" alt=t("Scroll")></a></td>';
//}
//else
//{
  fe+='<div id="tab5" class="tab" onClick = "showPanel(5);" onMouseOver="hover(this);" onMouseOut="setState(5)">'
//}
fe+=t("Help");
fe+='</div>'
fe+='</div>';  //end of tabDiv
//if (device=="smartphone")
// {
 //  fe+='<div id="appDiv" name="appDiv" style="position:absolute; left:5px;">'
fe+='<div id="appDiv" name="appDiv" style="float: left; top:28px;">'
// }
//else
 //{fe+='<div id="appDiv" name="appDiv" style="left:25%;">'}
//if (device!="smartphone")

fe+='<div id="panel1" class="panel">'

fe+='<table width="100%" border="0" cellspacing="0" cellpadding="4" bgcolor="#CCCCCC">';
fe+='  <tr color="#FFFFFF">';

fe+='<div id="banner" style="background-color:#EEEEEE; color:#FFFFFF;">'
//fe+='<td width = "2%" bgcolor="#EEEEEE">&nbsp;</td>';
//if (device!="smartphone")
// {
 // fe+='<button id="toMenu">Menu</button>'
  fe+='<td align="center" width="43%"  bgcolor="#EEEEEE"><span style="color:black"><strong>'+t("Open Source Statistics for Public Health");
  fe+='</strong></span></td>';
// }
//else
//if (device=="smartphone")
// {
 //   fe+='<td align="center" width="20%" bgcolor="#EEEEEE">'
// }
fe+='<td align="center" width="15%" bgcolor="#EEEEEE"><a href="'+ docfile +'" target="Documentation">'+t('Documentation')+'</a></td>'
fe+='<td align="center" width="15%" bgcolor="#EEEEEE"><a href="'+ testfile +'" target="Testing">'+t('Testing')+'</a></td>'
fe+='<td align="center" width="15%" bgcolor="#EEEEEE"><a href="../BriefDoc/About.htm" target="_blank">'+t('About')+'</a></td>'
if (device=="smartphone")
 {
 fe+='<td align="center" width="15%" bgcolor="#EEEEEE"><a href="../BriefDoc/UsingOpenEpi.htm" target="_blank">'+t('Help')+'</a></td>'
 }
fe+='</div>'
fe+='  </tr>';
fe+='  </table>';
fe+=' </td>';
fe+='</tr>';
fe+='</table>';
if (device=="smartphone")
{
//fe+='<table border="0" cellpadding="0" width="300px">';

//fe+='  <tr valign="top">';
//fe+='    <td align="left" valign="top"> <a href="#">';
fe+='	<table width="290px" border="0" bordercolor="#999999" cellspacing="0"  bgcolor="#FFFFFF">';
//fe+='  <tr bgcolor="#F00000">';
//fe+='   <td align="center">';
//fe+='<table width="280px" border="2" cellspacing="0" cellpadding="0">';
fe+='  <tr>';

fe+='    <td align="center" > <br /><input name="btnEnter" type="button" id="btnEnter" '
fe+='"javascript:showpanel(2);"'
//fe+='value="'+t("Enter New Data")+'" onClick="javascript:if (opener!=null){opener.useOpenEpiEntry();'
//fe+='setTimeout(&quot;opener.useOpenEpiEntry()&quot;,200);self.close();} else {useOpenEpiEntry();'
//fe+='setTimeout(&quot;useOpenEpiEntry()&quot;,200);}return false;"';

//fe+='    <td align="center" > <input name="btnEnter" type="button" id="btnEnter" value="'+t("Enter New Data")+'" onClick="javascript:if (opener!=null){opener.useOpenEpiEntry(opener.etablecmds1,opener.etablecmds2,opener.demodata);setTimeout(&quot;opener.useOpenEpiEntry(opener.etablecmds1,opener.etablecmds2,opener.demodata)&quot;,200);} else {useOpenEpiEntry()};return false;"';

fe+='      style="text-align:center; background-color:#800000; color:white; font-family:arial; font-weight:bold; font-size:10pt;">';
fe+='    </td>';
fe+='  </tr>';
fe+='</table>';
}
else
{
fe+='<table width="90%" border="0" cellspacing="6" cellpadding="0" align="center">';
fe+='  <tr valign="top">';
fe+='    <td align="center" valign="top" rowspan="2" colspan="2"> <a href="#">';
fe+='	<table width="25%" border="0" bordercolor="#999999" cellspacing="0"  bgcolor="#FFFFFF">';

//fe+='	<table width="25%" border="0" cellspacing="0" bordercolor="#999999" bgcolor="#FFFFFF">';
fe+='  <tr>';
fe+='   <td align="center">';
fe+='<table width="25%" border="0" cellspacing="0" cellpadding="3">';
fe+='  <tr>';
//changed Nov1, 2011 fe+='    <td> <input name="btnEnter" type="button" id="btnEnter" value="'+t("Enter New Data")+'" onClick="javascript:useOpenEpiEntry();return false"';
fe+='    <td> <input name="btnEnter" type="button" id="btnEnter" value="'+t("Enter New Data")+'" onClick="useOpenEpiEntry();showPanel(2);return false"';
fe+='      style="text-align:center; background-color:#800000; color:white; font-family:arial; font-weight:bold; font-size:14pt;">';
fe+='    </td>';
fe+='  </tr>';
fe+='</table>';
}
if (inscreenimg.length>0)
     {
      if (device=="smartphone")
      {
        fe+= '<br/><image name="inputscreen" src="'+inscreenimg+'" border="0" width="256px">'
      }
      else
      {
	  fe+= '<br/><image name="inputscreen" src="'+inscreenimg+'" border="0">'
      }
	 }
if (device!="smartphone" )
{
  fe+='	</td>';
  fe+='  </tr>';
  fe+='</table>';
  fe+='   <td  border="3" bordercolor="#00ff00" bgcolor="#CCCCCC" align="left" valign="Top" style="color:black; font-family:arial; font-weight:bold; font-size:14pt;">';
  fe+=t(apptitle); // for example,     Proportion<br>Confidence Limits for a Single Proportion
  fe+='    </td>';
  fe+='  </tr>';
}
fe+='  <tr>';
fe+='    <td height="263" border="3" bordercolor="#0000ff" >';

fe+=t(description);
if (device!="smartphone")
{
fe+='    </td>';
fe+='    </tr>';
fe+='  <tr>';

fe+='    <td bgcolor="#CCCCCC" colspan="2" align="center"';
fe+='	style="color:black;font-family:arial; font-weight:bold; font-size:12pt;">';
fe+=t('Author(s)');
fe+='	</td>';
fe+='    <td valign="top" align="center" rowspan="2">';
}

if ((demofile.length>0) && (device!="smartphone"))
  {
   // if (device!="smartphone")
    if (device=="smartphone")
    {
	fe+='<table width="25%" border="0" cellspacing="0" cellpadding="0">'
    }
    else
    {
      fe+='<table width=100% border="0" cellspacing="0" cellpadding="0">'
    }
    fe+='<tr>'
	fe+='<iframe name="demoframe" id="demoframe"  src=demofile class="panel" APPLICATION="yes"></iframe>'
    fe+='<td  border="0" cellpadding="0" style="text-align:center">'
    fe+='<input name="btnDemo" type="button" id="btnDemo" value="'+t("Load Demo Data")+'" onClick=\"javascript:LoadData=true;loadIframe(\'demoframe\', \''+demofile+'\');\" '

	fe+='style="text-align:center; background-color:#666666; color:white; font-family:arial; font-weight:bold; font-size:14pt;">'
    fe+='</td>'
    fe+='</tr>'
    fe+='</table>'
  }

if (outscreenimg.length>0)
     {
      fe+= '<image name="outputscreen" alt="Output screen image" src="'+outscreenimg+'"  border="0">'
	 }

fe+='	 </td>';
fe+='  </tr>';
fe+='  <tr>';


fe+='    <td valign="top" id="authorship" colspan="2">';
fe+='<p align="center">';
fe+=t(authors);

fe+='	 </td>';
fe+='  </tr>';
fe+='</table>';


fe+='<table width="100%" border="1" cellspacing="0" cellpadding="2" bgcolor="#CCCCCC">';
fe+='  <tr>';


fe+='<td align="center">';
 if (oesavefound())
  {
    fe+=t('Running from OpenEpiSave.HTA. Results will be saved automatically in ..\RESULTS folder');
  }
  else
  {
	fe+=t('Select, copy, and paste results to other programs or download OpenEpi to local disk and run OpenEpiSave.HTA to save automatically.');
  }
fe+='</td>';
fe+='</tr>';
fe+='</table>';

//Jan 2007
fe+='</div>';  //End of the panel1 div.
fe+='<div id="panel2" name="panel2" class="panel" ></div>';
var phr100=t("No results yet. ENTER some data and choose CALCULATE.");
fe+='<div id="panel3" class="panel"><h2 align="left"><br/><br/>'+phr100+'</h2></div>';
var phr101=t("It looks like there are no examples for this exercise.");
fe+='<div id="panel4" class="panel"><h2>'+phr101+'<h2></div>';
if (device!="smartphone")
{
//fe+='<div id="panel5" class = "panel"><iframe id="iframe5" APPLICATION="yes" width=100% height=100% src="../BriefDoc/UsingOpenEpi.htm"></iframe></div>';
fe+='<div id="panel5" class = "panel"></div>';

}
//fe+='</script>'
fe+='</div>'  //end of appDiv
fe+='</body>';
//fe+='<SCRIPT language="JavaScript" src="../js/SiteStats.js" type=text/JavaScript></SCRIPT>';
//fe+='</html>';
/*if (device == "smartphone")
  {
   fe='<div name="appDiv1" id="appDiv: style="position:float-left;">'+fe;
   fe+='</div>';
  }
  else                                                           F
  {
   fe='<div name="appDiv1" id="appDiv1" style="position:absolute; left-margin:235px; top:10px;">'+fe;
   fe+='</div>';
  }
 */
 fe+='</html>';

document.write(fe);

//alert(document.body)
document.close();
if (device=="smartphone")
   {
    $("menuDiv").hide();
   }
}


function showExWindow()
{
var fe='<html>'
fe+='<head>'
fe+='<title>Untitled Document</title>'
fe+='<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">'

fe+='</head>'
fe+='<body  bgcolor="#FFFFFF" text="#336666" link="#009999" vlink="#66CCCC" alink="#00FFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">'
fe+='<table width="90%" border="0" cellspacing="0" cellpadding="4">'
 fe+= '<tr>'
  fe+=  '<td rowspan="2" bgcolor="#336666">'
if (device != "smartphone")
 {    fe+=  '<img src="../img/OpenEpi1.gif" name="image" width="184" height="51"></td>'  }
    fe+='<td width="100%" bgcolor="#336666"><font color="#eeeeee"><h1>'
	fe+='Demos and Exercises'
	fe+='</h1> </font></td>'
  fe+='</tr>'
fe+='</table>'
fe+='<br>'
if (device != "smartphone")
{
fe+='<table width="90%" border="0" cellspacing="4" cellpadding="2" align="center">'
}
else
{
fe+='<table width="90%" border="0" cellspacing="4" cellpadding="2" align="left">'
}
fe+=  '<tr valign="middle">'
fe+=    '<td bgcolor="#CCCCCC">      <h2>'
fe+=basefilename+'--Demo'
fe+='</h2></td>'
if (device != "smartphone")
{
  fe+=    '<td width="150" align="center" rowspan="2"> <img src="'+inscreenimg+'" name="image" width="350" height="204" border="0"><br>'
  fe+=    '</td>'
}
fe+=  '</tr>';

  if (Demo!=null)
  {
  fe+='<tr>'
    fe+='<td>'

	//fe+=t(Demo)  //Aug 2007
	fe+=Demo
	fe+='</td>'
  fe+='</tr>'
  }

  if (Exercises!=null)
  {
  fe+='<tr>'
    fe+='<td bgcolor="#CCCCCC" colspan="2" align="center"> <h2>'+ t("More Exercises")+ '</h2></td>'
  fe+='</tr>'
  fe+='<tr>'
    fe+='<td valign="top" colspan="2"><br>'
	//fe+= t(Exercises)    //Aug 2007
	fe+=Exercises
	fe+='</td>'
  fe+='</tr>'
  }
  fe+='<tr>'
   fe+= '<td align="center" width="100" colspan="2">&nbsp;'
   fe+= '</td>'
  fe+='</tr>'
fe+='</table>'
//'<table width="90%" border="0" cellspacing="0" cellpadding="4" align="center">'+
//  '<tr align="center">'+
    //'<td><a href="#">&lt;&lt; Previous</a>'+
    //  '&#149; <a href="#">Next &gt;&gt;</a></td>'+
//  '</tr>'+
//'</table>'+
fe+='<p>&nbsp;</p>'
fe+='<table width="100%" border="0" cellspacing="0" cellpadding="2" bgcolor="#CCCCCC">'
 fe+= '<tr> '
 fe+=   '<td>&nbsp; </td>'
fe+=    '<td align="right">&nbsp;</td>'
fe+=  '</tr>'
fe+='</table>'
fe+='</body>'
fe+='</html>';

var resultpane=document.getElementById("panel4");

resultpane.innerHTML=fe;
//alert(fe);
translateHTML(resultpane.body);   //August 2007
//htmlstr=completedHTML(htmlstr,omitfooter); //Adds HTML tags and header if necessary

showPanel(4);   //Open the results panel
//alert(resultpane.innerHTML)
/*
ExWin=window.open("","Exercises");
ExWin.document.open();
ExWin.document.write(fe);
ExWin.document.close();
*/


//end of AppHelper.js
}