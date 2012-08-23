var inTbl = "HELLO";


//  Revised from ETable.htm, March 16, 2011
//  saved from url=(0052)http://www.scottandrew.com/dhtml/demos/dynchart.html
//  revised (some would say "mangled" )by Andy Dean, agdean9@hotmail.com, during early 2003
//  to accomodate data entry, with a single input cell moving over the surface of the
//  dyntable (now called a "stratum") , doing its validation thing, and dumping the user input into
//  the cell beneath when appropriate.  The idea is to have a configurable table for use
//  in entering summary data for epidemiologic or other statistical programs.

inTbl += '<script type=text/javascript>\n';
inTbl += 'var out=new Output();\n';
inTbl += 'var input=new Input();\n';
inTbl += 'var save=false;\n';
//When true, saving is allowed and Save and Read Data buttons will be displayed.
inTbl += 'var OpenEpi=false;\n';
//Set to true by onLoad when (supposedly) all modules have finished loading
inTbl += 'var configured=false;\n';
inTbl += 'var useTableSettings=false;\n';
inTbl += '//Set by OECommand usetablesettings(true or false)\n';
//Define a variable to hold the current table object\n';
inTbl += 'var myTable;\n';
//Define the data array to be passed to the calling application\n';
inTbl += 'var jg;\n';
inTbl += 'var currentstratum=1;\n';
//Strata start with 1, not 0\n';
inTbl += 'var HighLightP=true; \n';
inTbl += 'var dataMatrix=new Array();\n';
inTbl += 'var rows=10;\n';
inTbl += 'var cols=6;\n';
inTbl += 'var cmin=-1;\n';
inTbl += 'var cmax=-1;\n';
inTbl += 'var rmin=-1;\n';
inTbl += 'var rmax=-1;\n';
inTbl += 'var x=200;\n';
inTbl += 'var y=50;\n';
inTbl += 'var w=400;\n';
inTbl += 'var h=600;\n';
//Default r x c  table parameters\n';
inTbl += 'function loadExternalData()\n';
inTbl += '{\n';
inTbl += 'if (LoadData && appDataArray && appDataArray.length>1)\n';
inTbl += '\t   {\n';
inTbl += '\t    \n';
inTbl += '\t\t//alert("sample data in appDataArray[1]="+appDataArray[1]["E0D0"])\n';
inTbl += '\t\t//alert("sample data in appDataArray[5]="+appDataArray[5]["E0D0"])\n';
inTbl += '\t\t //EntryWin exists and is completely loaded and not closed")\n';
inTbl += '\t    dataMatrix=appDataArray;\n';
inTbl += '\t//alert("148 sample data in EntryWin.dataMatrix[1]="+EntryWin.dataMatrix[1]["E0D0"])\n';
inTbl += '\t\t//alert("sample data in EntryWin.dataMatrix[5]="+EntryWin.dataMatrix[5]["E0D0"])\n';
inTbl += '\t\treadMemToTable(1);  //Get stratum 1 data\n';
inTbl += '\t\t\n';
inTbl += '\t\treadMetaToTable();  //Get metadata from dataMatrix\n';
inTbl += '\t\t\n';
inTbl += '\t\tif (dataMatrix.length>2)\n';
inTbl += '\t\t {\n';
inTbl += '\t\t     for (i=0; i<dataMatrix.length-2;i++)\n';
inTbl += '\t\t       {\n';
inTbl += '\t\t         addStratum()\n';
inTbl += '\t\t       }\n';
inTbl += '\t\t\t changeStratumTo(1); \n';
inTbl += '\t\t }\t\n';
inTbl += '\t\t }\n';
inTbl += ' }\n';
inTbl += 'function okCancelDialog(prompt)\n';
inTbl += '{ \n';
//Shows the confirm modal dialog box.  Placed here so that the dialog appears
//in front of Etable.  Dialogs called from another window will appear in front of
//that window, leading to confusion if Etable has been in the foreground.
inTbl += '  return confirm(prompt);\n';
inTbl += '}\n';
inTbl += 'function infoDialog(prompt)\n';
inTbl += '{\n';
//Shows the alert modal dialog box.  Placed here so that the dialog appears
//in front of Etable.  Dialogs called from another window will appear in front of
//that window, leading to confusion if Etable has been in the foreground.
inTbl += '  alert(prompt);\n';
inTbl += '}\n';
inTbl += 'function setColors()\n';
inTbl += '{\n';
inTbl += 'var datacolor= myTable.bgcolor;\n';
inTbl += 'var totalcolor="#aaaaaa";\n';
inTbl += 'var valuecolor="#bbbbbb";\n';
inTbl += 'var variablecolor="#cccccc";\n';
inTbl += 'var ccolor = myTable.bgcolor;\n';
//alert("in setcolors")\n';
inTbl += 'for (r=0 ; r< myTable.rows ; r++)\n';
inTbl += '  {\n';
inTbl += '\t\tfor (c=0; c < myTable.cols ; c++)\n';
inTbl += '\t\t{\n';
inTbl += '\t\t   t=myTable.row[r].cell[c].type; \n';
inTbl += '\t\t  // alert("r="+r+" c="+"t="+t)\n';
inTbl += '\t\t\tif (t== "data") {ccolor=datacolor;}\n';
inTbl += '\t\t\t  else if  (t=="rowtot" || t== "row total" || t=="column total") {ccolor=totalcolor;}  \n';
inTbl += '\t\t\t  else if (t=="valname") {ccolor=valuecolor;}\n';
inTbl += '\t\t\t  else if (t=="varname") {ccolor=variablecolor;}\n';
inTbl += '\t\t\t  else if (t=="label") {ccolor=variablecolor;};\n';
inTbl += '\t\t    myTable.setCellColor(r,c,ccolor); \n';
inTbl += '\t\t\tmyTable.out(r,c);\n';
//not efficient, but it works to restore color.  Don't know why
//Potential types are data, row total, column total, grand total, value label, variable label
inTbl += '\t\t}\n';
inTbl += '  }\n';
inTbl += '}\n';
inTbl += ' \n';
inTbl += 'function fillTable() {\n';
//Fills one stratum of table from memory array
inTbl += '}\n';
inTbl += 'function saveTable(){\n';
//Saves one stratum to array in memory
inTbl += '}\n';
inTbl += 'function clearTable()\n';
inTbl += '{\n';
inTbl += ' for (r=0 ; r< myTable.rows ; r++)\n';
inTbl += '  {\n';
inTbl += '\t\tfor (c=0; c < myTable.cols ; c++)\n';
inTbl += '\t\t{\n';
inTbl += '\t\t   t=myTable.row[r].cell[c].type; \n';
inTbl += '\t\t\tif (t== "data" ||t=="rowtot" ||t=="coltot" || t=="grandtot") \n';
inTbl += '\t\t\t{\n';
inTbl += '\t\t\t  myTable.insert(r,c,"");\n';
inTbl += '\t\t\t}\n';
inTbl += '  \t\t }\n';
inTbl += '  }\n';
inTbl += '  document.inBox.entryfield.value="";\n';
inTbl += '}\n';
//writeCSS(myTable.css);\n';
inTbl += 'function cmdExecute(cmdArray)\n';
inTbl += '{\n';
//Executes a series of commands passed in as a one-dimensional array\n';
//Commands must be JavaScript as text strings\n';
//alert("in cmdExecute cmdArray has "+cmdArray.length +" commands")\n';
inTbl += 'count=0;\n';
inTbl += 'for (var i=0; i<cmdArray.length; i++)\n';
inTbl += '  {\n';
inTbl += '  var c=cmdArray[i];\n';
inTbl += '  try \n';
inTbl += '   {\n';
inTbl += '    eval(c);\n';
inTbl += '\tcount+=1;\n';
inTbl += '   }\n';
inTbl += '   catch(exception)\n';
inTbl += '    {\n';
inTbl += '    if(!confirm("Oops, cannot evaluate["+cmdArray[i] + " Problem=" + exception+".] Continue?"))\n';
inTbl += '\t  {return count}\n';
inTbl += '    }      \n';
inTbl += '   }\n';
inTbl += ' if(typeof(myTable)=="object")\n';
inTbl += '    {configured=true;}\n';
inTbl += '   else\n';
inTbl += '    {alert("myTable not ready")}\n';
inTbl += ' return count;  \n';
inTbl += '}\n';
//Note: The functions evalEntry and evalKey MUST exist, since they are called specifically by the dynamic stratum's input box.\n';
inTbl += 'function evalEntry()\n';
inTbl += '{\n';
//call input box evaluation in current stratum\n';
inTbl += 'myTable.evalEntry();\n';
inTbl += 'myTable.moveInputNext();\n';
inTbl += '}\n';
inTbl += 'function evalKey(evt) {\n';
inTbl += '  var keyCode = document.layers ? evt.which : document.all ?  \n';
inTbl += '        evt.keyCode : evt.keyCode;\n';
inTbl += ' //alert("keycode "+evt.keyCode);\n';
inTbl += '  if (keyCode == 9)   \n';
inTbl += '    {evalEntry();\n';
inTbl += '\treturn false;}\n';
inTbl += '  else if (keyCode ==40) {\n';
inTbl += '    myTable.moveUpDown=true;\n';
inTbl += '    evalEntry();\n';
inTbl += '\treturn false;} \n';
inTbl += '  else if (keyCode==38) {\n';
inTbl += '    myTable.moveUpDown=true;\n';
inTbl += '\tmyTable.moveUp=true;\n';
inTbl += '\tevalEntry();\n';
inTbl += '\treturn false;}\t\n';
inTbl += '  else {return true;}\n';
inTbl += '}\n';
inTbl += 'function userInsert(){\n';
inTbl += '\trow = document.forms["insertForm"].row.value\n';
inTbl += '\tcol = document.forms["insertForm"].col.value\n';
inTbl += '\tval = document.forms["insertForm"].val.value\n';
inTbl += '\tmyTable.insert(row,col,val)\n';
inTbl += '\tmyTable.calcTotals(row,col);\n';
inTbl += '}\n';
inTbl += 'function setCellValue(r,c,setting)\n';
inTbl += '{\n';
inTbl += 'myTable.insert(r,c,setting)\n';
inTbl += '}\n';
inTbl += 'function getCellValue(r,c)\n';
inTbl += '{\n';
inTbl += 'value=myTable.get(r,c);\n';
inTbl += 'return value\n';
inTbl += '}\n';
inTbl += 'function showObject(obj) \n';
inTbl += '{\n';
inTbl += '\tobj.style.visibility="visible";\n';
inTbl += '}\n';
inTbl += 'var delstrat=t( "Delete this Stratum?");\n';
inTbl += 'var selstrat=t("Please select a Stratum before deleting.");\n';
inTbl += 'function deleteStratum() \n';
inTbl += '{\n';
inTbl += 'var i,n;\n';
inTbl += ' var strat = document.form1.theStratum;\n';
inTbl += ' var chosen=strat.selectedIndex+1;  //Options are zero based, but strata are 1 based.\n';
inTbl += ' if (chosen > 0 ) \n';
inTbl += '   {\n';
inTbl += '      if (confirm(delstrat) )\n';
inTbl += '      {\n';
inTbl += '\t   changeStratumTo(chosen-1);\n';
inTbl += '\t   //changeStratumTo(chosen-1);  //actually the one just before the one chosen\n';
inTbl += '\t   //strat.selectedIndex-=1;\n';
inTbl += '\t   strat.options[chosen-1]=null;\n';
inTbl += '\t   //Fix names of strata beyond deletion, if they are system generated.\n';

inTbl += '\t    if (strat.options.length>=chosen)\n';
inTbl += '\t\t  {\n';
inTbl += '\t\t   for (i=chosen; i<=strat.options.length; i++)\n';
inTbl += '\t\t     {\n';
inTbl += '\t\t\t  n=strat.options[i-1].text\n';
inTbl += '\t\t\t  if (/(Stratum)\s\d* /.test(n)) \n';       //Contains asterisk slash problem
inTbl += '\t\t\t    {\n';
inTbl += '\t\t\t\t strat.options[i-1].text="Stratum "+(i);\n';
inTbl += '\t\t\t\t}\n';
inTbl += '\t\t\t }\n';
inTbl += '\t\t  } \n';

inTbl += '\t   if (dataMatrix[chosen])\n';
inTbl += '\t     {dataMatrix.splice(chosen,1);}\n';
inTbl += '\t   strat.focus()\n';
inTbl += '\t   myTable.moveInputTo(dataMatrix[0].datarmin,dataMatrix[0].datacmin);\n';
inTbl += '       } \n';
inTbl += '\t}   \n';
inTbl += '   else \n';
inTbl += '  \t  {\n';
inTbl += '\t  alert(selstrat);\n';
inTbl += '\t  }\n';
inTbl += ' \n';
inTbl += ' if (strat.options.length<2)\n';
inTbl += '\t    {\n';
inTbl += '\t\t //Hide the selection box\n';
inTbl += '\t\t ShowHide("stratsel_span",false);\n';
inTbl += '\t\t ShowHide("delbtn_span",false);\n';
inTbl += '\t\t}\n';
inTbl += '}\n';

inTbl += 'function changeStratumTo(newchoice)\n';
inTbl += '{\n';
inTbl += 'evalEntry();\n';
inTbl += 'var strat = document.form1.theStratum;\n';
//alert("New Stratum="+newchoice + "currentstratum="+currentstratum)
//Store currentstratum to dataMatrix
inTbl += 'storeAllToMem(currentstratum, MaxValueAtLeft, MaxValueAtTop, ExposureLeft);\n';
//Get new stratum from dataMatrix if it exists there
//getAllFromMem(newchoice,MaxValueAtLeft, MaxValueAtTop, ExposureLeft);
inTbl += 'clearTable();\n';
inTbl += 'readMemToTable(newchoice)\n';
//Set currentstratum to newchoice\n';
inTbl += 'currentstratum=newchoice\n';
inTbl += 'strat.selectedIndex=newchoice-1\n';
inTbl += 'strat.focus()\n';
inTbl += '}\n';
inTbl += 'var plsenter=t("Please enter data for this stratum before adding another.");\n';
inTbl += 'function addStratum()\n';
inTbl += '{\n';
inTbl += 'evalEntry();  //Assimulate the last entry in the current stratum\n';
inTbl += 'if (storeAllToMem(currentstratum, MaxValueAtLeft, MaxValueAtTop, ExposureLeft))\n';
inTbl += '   {\n';
inTbl += '    //At least one data item found.  OK to add stratum\n';
inTbl += '\tvar strat = document.form1.theStratum;\n';
inTbl += '\tvar option = new Option("Stratum "+(strat.options.length+1),"Optional Name",false,true);\n';
inTbl += '\tShowHide("stratsel_span",true);\n';
inTbl += '\tShowHide("delbtn_span",true);      \n';
inTbl += '\tstrat.options[strat.options.length] = option;\n';
inTbl += '\tchangeStratumTo(strat.options.length)\n';
inTbl += '\t//strat.focus()\n';
inTbl += '    myTable.moveInputTo(dataMatrix[0].datarmin,dataMatrix[0].datacmin); \n';
inTbl += '   }\n';
inTbl += 'else\n';
inTbl += '   {\n';
inTbl += '    alert(plsenter)\n';
inTbl += '\tclearTable();\n';
inTbl += '   }     \n';
inTbl += '}\n';
inTbl += 'function ShowHide(spanname, show) \n';
inTbl += '{\n';
inTbl += '  //var spanname;\n';
inTbl += '  if (document.all) \n';
inTbl += '    {\n';
inTbl += '     if (show) \n';
inTbl += '\t     {\n';
inTbl += '\t\t  eval("document.all."+spanname+".style.visibility=&quot;visible&quot;;");\n';
inTbl += '\t\t }\n';
inTbl += '     else \n';
inTbl += '\t     {\n';
inTbl += '\t\t  eval("document.all."+spanname+".style.visibility=&quot;hidden&quot;;");\n';
inTbl += '\t\t }\n';
inTbl += '\t }\n';
inTbl += '  else \n';
inTbl += '     {\n';
inTbl += '    if(navigator.userAgent.indexOf("Gecko")!= -1) \n';
inTbl += '\t {// is NS6 ?\n';
inTbl += '      if (show) \n';
inTbl += '\t     {\n';
inTbl += '\t\t   document.getElementById(spanname).style.visibility="visible";\n';
inTbl += '\t\t  }\n';
inTbl += '      else \n';
inTbl += '\t     {\n';
inTbl += '\t\t document.getElementById(spanname).style.visibility="hidden";\n';
inTbl += '\t\t }\n';
inTbl += '\t  }\n';
inTbl += '  else \n';
inTbl += '      {\n';
inTbl += '    if (show) \n';
inTbl += '\t     {\n';
inTbl += '\t\t \n';
inTbl += '\t\t eval("document.layers["+spanname+"].visibility=&quot;show&quot;;");\n';
inTbl += '\t\t alert("show");\n';
inTbl += '\t\t }\n';
inTbl += '    else \n';
inTbl += '\t     {\n';
inTbl += '\t\t \n';
inTbl += '\t\t eval("document.layers["+spanname+"].visibility=&quot;hide&quot;;"); \n';
inTbl += '\t\t }\n';
inTbl += '\t  }\n';
inTbl += '  }\n';
inTbl += '}\n';

inTbl += 'function hideObject(obj) \n';
inTbl += '{\n';
inTbl += '\tif (ns4) obj.visibility = "hide"\n';
inTbl += '\telse if (ie4) obj.visibility = "hidden"\n';
inTbl += '}\n';
inTbl += 'var timerid\n';
inTbl += 'var stopid\n';
inTbl += 'var starttime;\n';
inTbl += 'function timerStart()\n';
inTbl += '{\n';
inTbl += 'starttime=new Date();  //Get current time\n';
//ShowHide("proc_span",true);\n';
inTbl += 'document.body.style.cursor="wait"'; //change cursor to hourglass--seems to work on time only in NS
inTbl += 'document.getElementById("proc_span").innerHTML="Processing.."\n';
inTbl += '}\n';
inTbl += 'function timerStop(hideAfter)\n';
inTbl += '{\n';
//stop timer\n';
inTbl += 'document.body.style.cursor="default";\n';
inTbl += 'var now=new Date();\n';
inTbl += ' try\n';
inTbl += ' { \n';
inTbl += 'var elapsedtime=(now.getTime()-starttime.getTime())/1000;\n';
inTbl += 'document.getElementById("proc_span").innerHTML="Done<br>" + elapsedtime+ " seconds";\n';
inTbl += '}\n';
inTbl += 'catch(err)\n';
inTbl += '{\n';
//ignore error\n';
inTbl += '}\n';
inTbl += 'setTimeout("document.getElementById(&quot;proc_span&quot;).innerHTML=&quot;&quot;",1000*hideAfter);\n';
//Make timer display invisible\n';
inTbl += '\t\t\t\t\t\t\t\t\t\t\t\t\t\t \n';
inTbl += '}\n';
inTbl += 'function EntryTableAsHTML (obj)\n';
inTbl += '{\n';
inTbl += 'var out=new Output();\n';
inTbl += 'var w=Math.round(600/obj.cols);\n';
inTbl += 'if (w<40){w=40};\n';
inTbl += 'if (w>100){w=100}\n';
inTbl += 'out.newtable(obj.cols+1,w);\n';
//alert("obj.cols="+obj.cols)\n';
inTbl += 'out.title("<h3>" + obj.headText + "</h3>");\n';
inTbl += 'out.line(obj.cols+1);\n';
inTbl += 'for (var r=0; r<obj.rows; r++)\n';
inTbl += '{\n';
inTbl += '   out.newrow()\n';
inTbl += '   for (var c=0; c<obj.cols; c++)\n';
inTbl += '   {\n';
inTbl += '    if (myTable.row[r].cell[c].type=="data")\n';
inTbl += '      {\n';
inTbl += '\t  out.cell(myTable.get(r,c))\n';
inTbl += '\t  }\n';
inTbl += '\telse\n';
inTbl += '\t  {\n';
inTbl += '\t  out.header(myTable.get(r,c))\n';
inTbl += '\t  }   \n';
inTbl += '   }\n';
inTbl += '}\n';
inTbl += 'out.endtable();\n';
inTbl += 'return out.s\n';
inTbl += '}\n';
inTbl += 'var beforecalc=t("Please enter data before choosing Calculate.");\n';
inTbl += 'function calculateStats(){\n';
//cStratum=1; //temporarily\n';
//timerStart();\n';
inTbl += 'evalEntry();\n';
inTbl += 'if (currentstratum==1)\n';
inTbl += '{\n';
inTbl += '  if (storeAllToMem(currentstratum, MaxValueAtLeft, MaxValueAtTop, ExposureLeft))\n';
inTbl += '   {\n';
inTbl += '    //At least one data item found.  Do calculations. \n';
inTbl += '\t//timerStart();\n';
inTbl += '    if (parent) {OECalculate(dataMatrix);}\n';
inTbl += '   }\n';
inTbl += '   else\n';
inTbl += '   {\n';
inTbl += '    alert(beforecalc)\n';
inTbl += '\tclearTable();\n';
inTbl += '\tmyTable.moveInputNext();\n';
inTbl += '\tmyTable.moveInputTo(myTable.inputR-1,myTable.inputC);\n';
inTbl += '\ttimerStop(0.01);\n';
inTbl += '   }  \n';
inTbl += '}\n';
inTbl += 'else\n';
inTbl += '{\n';
inTbl += '    if (!storeAllToMem(currentstratum, MaxValueAtLeft, MaxValueAtTop, ExposureLeft))\n';
inTbl += '\t  {\n';
inTbl += '\t    //stratum must be empty\n';
inTbl += '\t    deleteStratum();\n';
inTbl += '\t  }\n';
inTbl += '    if (parent) \n';
inTbl += '\t  {\n';
inTbl += '\t  // Go ahead and calculate anyway because there are other strata\n';
inTbl += '\t  // timerStart();\n';
inTbl += '\t    OECalculate(dataMatrix);\n';
inTbl += '\t\t\n';
inTbl += '\t  }\n';
inTbl += '}\n';
inTbl += '}\n';
inTbl += 'function EtableOpen()\n';
inTbl += '{\n';
inTbl += '  if(parent) \n';
inTbl += '    {\n';
inTbl += '\tOpenEpi=true;\n';
inTbl += '    return true;\n';
inTbl += '    }\n';
inTbl += '}\n';
//inTbl+='//</HEAD>\n';
//inTbl+='<!--<BODY onLoad="JavaScript:OpenEpi=true; loadExternalData()" onUnload="JavaScript:OpenEpi=false;">  -->\n';
//inTbl+='<BODY onLoad="JavaScript:setTimeout('EtableOpen()',1000); loadExternalData();" onUnload="JavaScript:OpenEpi=false;">  \n';
//inTbl+='if (device=="smartphone")\n';
//inTbl+=' {\n';
//inTbl+='   htmlstr+='<style type="text/css">'\n';
//inTbl+='   htmlstr+='/*<![CDATA[*/'\n';
//inTbl+='     htmlstr+='body,td {font-size:0.9em;}'\n';
//inTbl+='   htmlstr+='/*]]>*/'\n';
//inTbl+='   htmlstr+='</style>'\n';
//inTbl+=' }\n';
inTbl += '<script>\n';
inTbl += '<DIV id="button1">;\n';
if (device!="smartphone")
{
  inTbl += '<br><br><br><br><p>;\n';
}
inTbl += '<br>';
inTbl += '<input type="submit" value="'+ t("Calculate")+'" onClick="timerStart();setTimeout(\'calculateStats()\',100);return false;"  name="calc" id="calc">\n';
if (device!="smartphone")
{
  inTbl += "</p><p>"
}
else
{
  inTbl += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n';
}
inTbl += '<input type="submit" name="Clear" value="'+'t("Clear")'+'" onClick="clearTable();return false;">\n';
if (device!="smartphone")
{
  inTbl += "</p></DIV>"
}
inTbl += '<span id="settings_span" name="settings_span" style="visibility:hidden;">\';\n';
if (device!="smartphone")
{
  inTbl += "<p><p></p></p>";
}
inTbl += ' <a name="settinglink" href="Settings.htm" target="_self">'+t("Settings")+'</a>\'\n';
if (device != "smartphone")
{
  inTbl += '<br>';
}
else
{
  inTbl += '&nbsp;&nbsp;'
}
inTbl += '<font size=-1>&nbsp;Conf. level="\'+ConfLevel+\'"\%</font>\';\n';
if (device=="smartphone")
{
  inTbl += "<br>";
}
inTbl += "</span>";
if (device!="smartphone")
{
  inTbl += '<span id="scontrols_span" style="visibility:hidden; position:absolute;top:20;left:200">\';\n';
}
else
{
  inTbl += '  <br /><span id="scontrols_span" style="visibility:hidden; position:absolute;top:50;left:3">\';\n';
}
inTbl += '<FORM NAME=form1>;\n';
inTbl += '<table name=scontrols id=scontrols style="position:relative; top:0;left:0">\';\n';
inTbl += '<tr>;\n';
inTbl += '<td>;\n';
inTbl += '<INPUT TYPE="button" VALUE="'+t("Add Stratum")+'" NAME=btnAddStrat  onclick="addStratum()">\';\n';
inTbl += '</td>\';\n';
inTbl += '<td>\';\n';
inTbl += '<span id="stratsel_span" style = "position:relative;top:0;left:0">\n';
inTbl += '<SELECT NAME=theStratum onChange="changeStratumTo(selectedIndex+1);" SIZE=1>\';\n';
inTbl += '   <OPTION VALUE=0>'+t("Stratum")+' 1\';\n';
inTbl += "</SELECT>";
inTbl += "</span>";
inTbl += '</td>\n';
inTbl += '<td>\n';
inTbl += '<span id="delbtn_span" style = "position:relative;top:0;left:0">;\n';
inTbl += '<input type="button" value="'+t("Delete Stratum")+'" name=btnDeleteStrat  onClick="deleteStratum()">\';\n';
inTbl += '</span>;\n';
inTbl += '</td>;\n';
inTbl += '</tr>;\n';
inTbl += '</table>;\n';
inTbl += '</FORM>;\n';
inTbl += '</span>;\n';
inTbl += '<span id="proc_span" style="position:absolute;top:350;left:10">'+'</span>;\n';
 /*
var ffmsg = "If you are running OpenEpi in Firefox on local disk, enter ABOUT:CONFIG in the Firefox address bar.";
ffmsg += " Consent to the scary message. Find SECURITY.FILEURI.STRICT_ORIGIN_POLICY and double-click it ";
ffmsg += " to change the value to FALSE. This one-time setting restores Firefox 3.x Javascript function to that of ";
ffmsg += "Firefox 2.0 and other browsers.";
var tries = 0;
var numcmds = 0;
var parentobjOK = false;
//Test for error caused by Firefox 3.x that affects only local disk version of OpenEpi
try
{
  if (typeof(etablecmds1)=="object")
  {
    parentobjOK = true;
  }
}
catch(err)
{
  alert(ffmsg);
}
*/
inTbl += '<script type=text/javascript>\n';
inTbl += 'function buildTable()'
inTbl += '{\n';
inTbl += 'if (typeof (etablecmds1) =="object")\n';
inTbl += '{\n';
inTbl += ' numcmds = cmdExecute(etablecmds1);\n';
inTbl += '  if (numcmds!=-1)\n';
inTbl += '  {\n';
inTbl += '    myTable.build();\n';
inTbl += '    writeCSS(myTable.css); \n';
inTbl += '     document.write(myTable.div); \n';
//The document.write must be in the body or called from the body or it will write
//over the existing HTML in the window, including the buttons.
 inTbl += '     myTable.activate(); \n';
inTbl += '      setColors();\n';
inTbl += '    if (etablecmds2 != null) {numcmds=cmdExecute(etablecmds2);}\n';
inTbl += '   } \n';
inTbl += ' document.close(); \n';
inTbl += ' myTable.moveInputNext();\n';
inTbl += '} \n';
inTbl += 'else \n';
inTbl += '{ \n';
inTbl += '  alert(notalone);\n';
inTbl += '}\n';
inTbl += '}\n';

inTbl+='</script>\n';

//end of etable.js
