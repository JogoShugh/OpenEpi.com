


function includeJs(jsName)
{
jsName="'"+jsName+"'";
//A trick is employed to keep the browser from recognizing the script ending tag
var theScript="";
theScript='<SCRIPT language=JavaScript src='+jsName+' type=text/JavaScript>' + '\</SC'+'RIPT>';
document.write(theScript)
}
function linkCSS(cssName,media)
{
cssName="'"+cssName+"'";
//A trick is employed to keep the browser from recognizing the script ending tag
var theLink="";
if (media=="")
   {media="all"}

theLink='<link rel="stylesheet" href="'+cssName+' type="text/css" media="'+media+'">';
document.write(theLink)
}

var currLocation=this.location.toString().toLowerCase();
//alert("In IncludeFiles 22, currLocation="+currLocation)
//alert(currLocation.lastIndexOf("/openepi/"));
var rootDir=unescape(currLocation.substring(0,(currLocation.lastIndexOf("openepi/"))+8));
//alert ("rootDir="+rootDir);
var jsDir=rootDir+"js/";
var cssDir=rootDir+"css/";
//linkCSS(cssDir+"TabbedUI.css","screen");
//linkCSS(cssDir+"StdPage.css","screen");

//fe='<link rel="stylesheet" href="../CSS/TabbedUI.css" TYPE="text/css" MEDIA="screen">\n';

//fe+='<link rel="stylesheet" href="../CSS/TabbedUI-print.css" TYPE="text/css" MEDIA="print">\n';
//linkCSS(cssDir+"TabbedUI-print.css","print");
//fe+='<link rel="StyleSheet" href="../CSS/dtree.css" type="text/css" >\n';
//linkCSS(cssDir+"dtree.css");
includeJs(jsDir+"jquery.js"); //jQuery Cross-browser toolkit
includeJs(jsDir+"dynStyle.js"); //Dynamic CSS management
includeJs(jsDir+"DetectDevice.js");//Detects mobile devices
includeJs(jsDir+"ReadCookie.js"); //Reads settings from the openepi cookie
includeJs(jsDir+"Translate.js"); //Sept 2009 Translation functions moved to separate module
includeJs(jsDir+"dtree.js");
includeJs(jsDir+"menuitems.js");
includeJs(jsDir+"AppHelper.js"); //AppHelper includes many functions necessary to create the interface of OpenEpi and
												  //call the data entry table, including the translation functions
includeJs(jsDir+"StatFunctions1.js"); //StatFunctions1 contains useful formatting and lookup functions for statistics.
includeJs(jsDir+"OECommands.js"); //OECommands.js is necessary to parse input and output commands
includeJs(jsDir+"ETable.js");
includeJs(jsDir+"TabbedUI.js");  //Tabbing function to prevent having to use pop-ups.  See source inside file.
//includeJs(jsDir+"GoogleTrack.js");  //Tracking functions for Google Analytics  See source inside file.

includeJs(jsDir+"prototype.js");
includeJs(jsDir+"DataStore.js");
includeJs(jsDir+"EStratum.js");
includeJs(jsDir+"dynchart.js");
includeJs(jsDir+"dynlayer.js");
includeJs(jsDir+"MartinStats.js");
includeJs(jsDir+"OEGraph.js");
includeJs(jsDir+"wz_jsgraphics.js");
includeJs(jsDir+"UsingOpenEpi.js");


if ((typeof basefilename !== "undefined") && (basefilename.length>0) && (basefilename !== "Settings"))
  {
  includeJs(basefilename+'.js'); //The js file is the one that you write, containing the statistics functions for a new module
      							//If there is none, set basefilename to ""  (null) in your  main module
  }