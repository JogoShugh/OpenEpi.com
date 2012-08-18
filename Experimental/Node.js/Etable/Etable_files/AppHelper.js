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
if (configureInput()==false)  
  {
    //Run configureInput, but, if the user cancelled, just return.
    return
  }
}
//open the data entry table as a popup window.   //Never again after Jan 2007
//Run Etable in the Panel2 iframe
var entryProg="../Etable/ETable.htm";

var myFrame=document.getElementById('panel2');
//alert("about to set SRC at 89")
myFrame.setAttribute('src',"../Etable/ETable.htm");
//frames["panel2"].location.href="../Etable/ETable.htm";

//showPanel(2);  
//EntryWin=frames["panel2"];
showPanel(2); //moved down, Mar 2007
//alert("finished loading frame in 94");

EntryWin=frames["panel2"]
//EntryWin=myFrame;  //Mar 2007

if (externalData)
 {
  appDataArray=externalData;
  //alert("128 ada Must be external Data")
 }
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
	   //closeWindow(DemoWin)
	//closeWindow(ResultWin)  //user may want to leave this one open?
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
if (window.frames["panel2"].starttime> 1) 
   {
     window.frames["panel2"].timerStop(10)
   }; //moved from below
var resultpane=document.getElementById("panel3");
htmlstr=completedHTML(htmlstr,omitfooter); //Adds HTML tags and header if necessary

resultpane.innerHTML=htmlstr;
//alert(resultpane.innerHTML)
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
{
if (window.parent) 
    {
	 if (window.parent.parent)
	   {
	     if (window.parent.parent.savingdata)
		   {
		     return true;
		   }
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
  EntryWin.calculateStats()
  }
}


function htmlHeaderWithData(dataArray)
{

var s=
'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">\n'+
    '<html>\n'+'<head>\n'+'<title>Results</title>\n'+
    '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n'+
    '</head>\n'
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
	
//s+=jsToHtml(dataToJSFunction(dataArray)+inputCmdsToJsFunction(cmds1,"etableCmds1")+inputCmdsToJsFunction(cmds2,"etableCmds2")+s1);
s+=jsToHtml(dataToJSFunction(dataArray)+inputCmdsToJSFunction(etablecmds1,"etableCmds1")+inputCmdsToJSFunction(etablecmds2,"etableCmds2")+s1);


s+='</head><body onload="runEtable()">\n'

return s
}

var dialoghandle=null;

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
var fe='<link rel="stylesheet" href="../Etable/TabbedUI.css" TYPE="text/css" MEDIA="screen">\n';
fe+='<link rel="stylesheet" href="../Etable/TabbedUI-print.css" TYPE="text/css" MEDIA="print">\n';
fe+='</HEAD>'; 
fe+='<BODY onLoad="initPanels(1);" onUnload="closeWindows();" onBeforeUnload="closeWindows();">';
	//The first works in Netscape; the second in IE 6
//Jan 2007
fe+='<div id="tab1" class="tab" style="left: 18%;" onClick = "showPanel(1);" onMouseOver="hover(this);" onMouseOut="setState(1)">'
fe+=t('Start')
fe+='</div>'
fe+='<div id="tab2" class="tab" style="left: 34%;" onClick = "if (OpenEpi==false){useOpenEpiEntry()};showPanel(2);" onMouseOver="hover(this);" onMouseOut="setState(2);">'
fe+=t('Enter')
fe+='</div>'
fe+='<div id="tab3" class="tab" style="left: 50%;" onClick = "callStatsIf(); showPanel(3);" onMouseOver="hover(this);" onMouseOut="setState(3);">'
fe+=t('Results')
fe+='</div>'
fe+='<div id="tab4" class="tab" style="left: 66%;" onClick = "showPanel(4);showExWindow();" onMouseOver="hover(this);" onMouseOut="setState(4)">'
fe+=t('Examples')
fe+='</div>'
fe+='<div id="tab5" class="tab" style="left: 82%;" onClick = "showPanel(5);" onMouseOver="hover(this);" onMouseOut="setState(5)">'
fe+=t('Help')
fe+='</div>'
fe+='<div id="divLogo" name="divLogo"><img src="../Etable/images/OpenEpi1.gif" id="logo" name="logo" width="110" height="30"></div>';//was 184 x 51
fe+='<div id="panel1" class="panel">'

fe+='<table width="100%" border="0" cellspacing="0" cellpadding="4" bgcolor="#CCCCCC">';
fe+='  <tr color="#FFFFFF">'; 

fe+='<div id="banner" style="background-color:#666666; color:#FFFFFF;">'
fe+='<td width = "2%" bgcolor="#666666">&nbsp;</td>';
fe+='<td align="left" width="43%"  bgcolor="#666666"><span style="color:#FFFFFF"><strong>'+t("Open Source Statistics for Public Health");
fe+='</strong></span></td>';
fe+='<td align="center" width="15%" bgcolor="#666666"><a href="'+ docfile +'" target="Documentation">'+t('Documentation')+'</a></td>'
fe+='<td align="center" width="15%" bgcolor="#666666"><a href="'+ testfile +'" target="Testing">'+t('Testing')+'</a></td>'
//fe+='<td align="center" width="15%" bgcolor="#666666"><a href="'+ docfile +'\#'+Language+'" target="Documentation">'+t('Documentation')+'</a></td>'
//fe+='<td align="center" width="15%" bgcolor="#666666"><a href="'+ testfile +'\#'+Language+'" target="Testing">'+t('Testing')+'</a></td>'
fe+='<td align="center" width="15%" bgcolor="#666666"><a href="../BriefDoc/About.htm" target="blank">'+t('About OpenEpi')+'</a></td>'
fe+='</div>'
fe+='  </tr>';
fe+='  </table>';
fe+=' </td>';
fe+='</tr>';
fe+='</table>';

fe+='<table width="90%" border="0" cellspacing="6" cellpadding="0" align="center">';
fe+='  <tr valign="top">'; 
fe+='    <td align="center" valign="top" rowspan="2" colspan="2"> <a href="#">';
fe+='	<table width="25%" border="0" cellspacing="0" bordercolor="#999999" bgcolor="#FFFFFF">';
fe+='  <tr>';
fe+='   <td align="center">';
fe+='<table width="25%" border="2" cellspacing="0" cellpadding="0">';
fe+='  <tr>';
fe+='    <td > <input name="btnEnter" type="button" id="btnEnter" value="'+t("Enter New Data")+'" onClick="javascript:useOpenEpiEntry();return false"';
fe+='      style="text-align:center; background-color:#800000; color:white; font-family:arial; font-weight:bold; font-size:14pt;">';
fe+='    </td>';
fe+='  </tr>';
fe+='</table>';
   if (inscreenimg.length>0)
     { 
	  fe+= '<br/><image name="inputscreen" src="'+inscreenimg+'" border="0">'
	 }   
fe+='	</td>'; 
fe+='  </tr>';
fe+='</table>';

fe+='   <td  bgcolor="#CCCCCC" align="center" valign="Top" style="color:black; font-family:arial; font-weight:bold; font-size:14pt;">';
fe+=t(apptitle); // for example,     Proportion<br>Confidence Limits for a Single Proportion
fe+='    </td>';
fe+='  </tr>';
fe+='  <tr>'; 
fe+='    <td height="263" >';
fe+=t(description);
        
fe+='    </td>';
fe+='    </tr>';
fe+='  <tr>';
fe+='    <td bgcolor="#CCCCCC" colspan="2" align="center"';            
fe+='	style="color:black;font-family:arial; font-weight:bold; font-size:12pt;">';
fe+=t('Author(s)');
fe+='	</td>';
fe+='    <td valign="top" align="center" rowspan="2">';
if (demofile.length>0) 
  {
	fe+='<table width="25%" border="3" cellspacing="0" cellpadding="0">'
    fe+='<tr>'
	fe+='<iframe name="demoframe" id="demoframe"  src=demofile class="panel" APPLICATION="yes"  scrolling="no"></iframe>'
    fe+='<td  border="0" cellpadding="0">'
	//fe+='<input name="btnDemo" type="button" id="btnDemo" value="'+t("Load Demo Data")+'" onClick=\"javascript:LoadData=true;loadIframe(\'demoframe\', \''+parent.demofile+'\');\" '
	//fe+='<input name="btnDemo" type="button" id="btnDemo" value="'+t("Load Demo Data")+'" onClick=\"javascript:LoadData=true;useOpenEpiEntry(frames["demoframe"].etableCmds1(),frames.demoframe.etableCmds2(),frames.demoframe.dataArray());\" '
    fe+='<input name="btnDemo" type="button" id="btnDemo" value="'+t("Load Demo Data")+'" onClick=\"javascript:LoadData=true;loadIframe(\'demoframe\', \''+demofile+'\');\" '

	fe+='style="text-align:center; background-color:#666666; color:white; font-family:arial; font-weight:bold; font-size:14pt;">'
   // fe+='<iframe name="demoframe" id="demoframe"  src="demofile" class="panel" application="yes"  scrolling="no"></iframe>'
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
//fe+='<div id="panel2" class="panel" ><iframe src="../../documentation/history.htm"></iframe></div>'
fe+='<iframe id="panel2" APPLICATION="yes" name="panel2" class="panel" ></iframe>';
var phr100=t("No results yet. ENTER some data and choose CALCULATE.");
fe+='<div id="panel3" class="panel"><h2 align="center"><br/><br/>'+phr100+'</h2></div>';
var phr101=t("It looks like there are no examples for this exercise.");
fe+='<div id="panel4" class="panel"><h2>'+phr101+'<h2></div>';
//fe+='<iframe id="panel5" class="panel" src="../BriefDoc/UsingOpenEpi.htm"></iframe>';
fe+='<div id="panel5" class = "panel"><iframe id="iframe5" APPLICATION="yes" width=100% height=100% src="../BriefDoc/UsingOpenEpi.htm"></iframe></div>';
fe+='</body>';
fe+='<SCRIPT language="JavaScript" src="../Etable/Etable_files/SiteStats.js" type=text/JavaScript></SCRIPT>';
fe+='</html>';

document.write(fe);

//alert(document.body)
document.close();
}

var T=new Array();

function initTranslation()
{   
	var currlanguage="";  //Set to language of settings
	var today= new Date();  //Mar 2007
	var month = today.getMonth() + 1 //apparently January is 0!!!   added these three lines August 2007
    var day = today.getDate()
    var year = today.getFullYear()

	//applabel=window.location.pathname;  //This will be written to the translation text file a single time and then reset to null.
	//Mar 2007 removed pathname, which does not work with IE7 and added date
	//applabel=window.location + "  "+ today.toLocaleString();	//Aug 2007 Changed to more concise version below
	applabel=window.location + "  "+ year +"/"+month+"/"+day;
	applabel=applabel.replace(/\//g,"\\");  //Converts forward slashes to backslashes
    applabel=applabel.replace(/file\:\\\\\\/,"");  //Takes out      'file:\\\'   Aug 2007--happens again in UpdateTranslation

   // alert(" 710 applabel="+applabel);
	if (typeof(Language)!=="undefined")
	  {
		currlanguage=Language;  
	  }
ffmsg="If you are running OpenEpi in Firefox on local disk, enter ABOUT:CONFIG in Firefox's address bar.";
 ffmsg+=" Consent to the scary message. Find SECURITY.FILEURI.STRICT_ORIGIN_POLICY and double-click it ";
 ffmsg+=" to change the value to 'false'. This one-time setting restores Firefox 3.x Javascript function to that of "
 ffmsg+="Firefox 2.0 and other browsers."
 try
  {
	if (typeof(window.top.writelang)!="undefined")
	  {
		// If updateTranslation is running, use the language specified by the user
	    currlanguage=window.top.writelang;
		//alert("language set from TOP="+currlanguage);
	  }
  }
  catch(err)
  {
    alert(ffmsg);
  }
	//alert("maxvalueatleft="+MaxValueAtLeft);
	//Changed following line Oct 2007
	// if (currlanguage.length==0 || currlanguage=="EN")
	 if (currlanguage.length==0 ) 
	  {
		   currlanguage=browserLanguage();
	  }
	//alert("currlanguage="+currlanguage);
	
	if (typeof(includeJs)!="undefined") 
	  {
		 includeJs("../Translations/"+currlanguage+".js");
	  }  //The includeJs function is in the IncludeFiles module
//alert(" 668 initTranslation set up for "+currlanguage);	
 
}

function visitTextNodes(n)
{   //n is the starting node, typically document.body for the first, pre-recursion call
    var txt;
	if(n.nodeType == 3)
	  {  
	     n.nodeValue = n.nodeValue.replace( /\s{2,}/g," ");    //Convert 2 or more spaces to a single space 
		                                                      // This cleans up large patches of  text that don't work as 
															  // array indices in FireFox  Aug/2007 
        
		 n.nodeValue=t(n.nodeValue);  //This actually does the translation
		 return
	  }
	for (var m=n.firstChild; m !=null; m=m.nextSibling)
	  {  
	    visitTextNodes(m);	  
	  }
}

function translateHTML(doc)
{
	if (doc==null)
	  {doc = document.body}
	else
	  {doc = doc.body}
	//alert("687 in translateHTML")
	visitTextNodes(doc);
	return; 
}


function t(origphrase)
{ //If the T array is defined, attempts to locate a translated phrase,
//using phrase as the index, and returns the result.
//If T[phrase] is undefined AND there is a function window.top.updateTranslation, it calls this function to write the T definition for this
//phrase into the translation file.
var phrase=origphrase;
var i;
var newphrase="";
//alert (phrase +" length="+phrase.length);

//Replace newline by space so that strings can be used as array indices
var lines = new Array();
lines = phrase.split("\n") 
if (lines.length>1) 
  { for (i=0; i<lines.length-1; i++)
     {
	  newphrase+=lines[i]+" ";
	 }
	newphrase+=lines[lines.length-1];
	phrase=newphrase;
  }
/*var before =phrase  
phrase = phrase.replace( /[\"\“\”\‘\’]/g, "'");   //Convert double quotes and smart quotes to single quote  Aug 2007	
//phrase = phrase.replace( /'/g, "\'" );  //Slashify single quotes   Aug 2007
phrase = phrase.replace(/\s{2,}/g," ");    //Convert 2 or more spaces to a single space Aug/2007 
//DEBUGGING  Aug 2007
if (before !== phrase)
  { alert (before + "\n" +phrase)}
 */ 
  
if (/[a-z]|[A-Z]+/.test(phrase))
  {
	//Has at least one alpha character
	phrase = phrase.replace( /[\"\“\”\‘\’]/g, "'");   //Convert double quotes and smart quotes to single quote  Aug 2007	
 //   phrase = phrase.replace(/\s{2,}/g," ");    //Convert 2 or more spaces to a single space Aug/2007 

  }
  else
  {
	return phrase
  }
		
//if (phrase.length=0) {return phrase}


var tempphrase=phrase;

if(/</.test(tempphrase))
	{		
	 //Do a crude test first for efficiency, then remove HTML tags if any.  Will miss tags without closing tag
	 tempphrase=tempphrase.replace(/(<[^>]*>)([^<]*)(<\/[^>]*>)/g,'$2');
	}

//Remove phrases consisting entirely of &, 1 to 4 non-spaces, and a semi-colon, such as "&nbsp;"

tempphrase=tempphrase.replace(/\&\S{1,6}\;/g," ");

 if (!(/[a-z]|[A-Z]+/.test(tempphrase))) 
  {
	 //If the cleaned up tempphrase now contains no alpha characters, return the original phrase and go no further.
	  return phrase
  }					

  
//Deal with nt(phrase) construction and do not translate.  This is the users "function" to exclude part of a phrase
var pattern = /(.*)(nt\()(.*)(\))(.*)/g
//pattern.lastIndex=0;
var tempstr=phrase;
var finalstr="";
var resultarr;
while ((resultarr=pattern.exec(tempstr)) != null)
 {
  tempstr=resultarr[5];  //for next round 
  finalstr+=t(resultarr[1])+resultarr[3]
  //alert("finalstr="+finalstr)
 }
if (finalstr.length>0) {return finalstr}


phrase=phrase.toString();
//var AllNum=/^((+|-)\d)?\d*(\.\d+)?$/;  //Regular expression for a number, not yet including those with comma in place of decimal point
//var AllNum = /^[-]?\d*\.?\d*$/; 

//var isAllNum=AllNum.test(phrase);
//alert("typeof(T)="+typeof(T)+ "\nphrase="+phrase +"\ntypeof(T[phrase])="+typeof(T[phrase]));
//if ((typeof(T)==="undefined") || isAllNum)
if (typeof(T)==="undefined")
  {
	 //There is no translation available 
	  // alert("T is not defined");	
	  return phrase
  }  
else
  if (typeof(T[phrase])!="undefined")
   {  //Note: operator above was !== Aug 2007                      
	  if ((T[phrase].length>0) && (!window.top.updateTranslation))
	    {
		// Aug 2007 Added second condition above to prevent translation and then retranslation when updating
		//if (phrase.length> 35) {alert("782 "+origphrase+"\n"+T[phrase])};	
		 return T[phrase];
		}
	  else
	    {
		//alert("787 T not defined for "+origphrase);
		 return phrase;  //Nothing there; return the English
		}
   }
  else
   {//No array item for this phrase.  If the updateTranslation shell is running, then update the translation array file
     if (window.top.updateTranslation)
	  { 
	    if (applabel==null)
		 {
	       window.top.updateTranslation(phrase);
		 }
		else
		 {
		   window.top.updateTranslation(phrase,applabel);  //Send it to the update module where it gets written as a comment in the file 
		   
		   applabel=null;  //Reset applabel to null so that it only gets written once
		 }
		T[phrase]=""; //also update the array in memory, since the file is not read back with each update
      } 
	 return phrase; 
   }
}

initTranslation();


function showExWindow()
{
var fe='<html>'
fe+='<head>'
fe+='<title>Untitled Document</title>'
fe+='<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">'

fe+='</head>'
fe+='<body  bgcolor="#FFFFFF" text="#336666" link="#009999" vlink="#66CCCC" alink="#00FFFF" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0">'
fe+='<table width="100%" border="0" cellspacing="0" cellpadding="4">'
 fe+= '<tr>'
  fe+=  '<td rowspan="2" bgcolor="#336666">'
    fe+=  '<img src="../Etable/images/OpenEpi1.gif" name="image" width="184" height="51"></td>'
    fe+='<td width="100%" bgcolor="#336666"><font color="#eeeeee"><h1>'
	fe+='Demos and Exercises'
	fe+='</h1> </font></td>'
  fe+='</tr>'
fe+='</table>'
fe+='<br>'
fe+='<table width="90%" border="0" cellspacing="4" cellpadding="2" align="center">'
fe+=  '<tr valign="middle">'
fe+=    '<td bgcolor="#CCCCCC">      <h2>'
	fe+=basefilename+'--Demo'
	fe+='</h2></td>'
fe+=    '<td width="150" align="center" rowspan="2"> <img src="'+inscreenimg+'" name="image" width="350" height="204" border="0"><br>'
fe+=    '</td>'
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
}
//end of AppHelper.js