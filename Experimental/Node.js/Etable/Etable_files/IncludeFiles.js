function includeJs(jsName)
{ 
jsName="'"+jsName+"'";
//A trick is employed to keep the browser from recognizing the script ending tag
var transfile="";

transfile='<SCRIPT language=JavaScript src='+jsName+' type=text/JavaScript>' + '\</SC'+'RIPT>';
//alert(8 + transfile);  // Very important debugging line.  Detected error in translation file, for example. Mar 2007

document.write(transfile)
//alert('wrote '+transfile);
}

//includeJs(basefilename+'.js'); //The js file is the one that you write, containing the statistics for this module
includeJs("../Etable/Etable_files/ReadCookie.js"); //Reads settings from the openepi cookie 
includeJs("../Etable/Etable_files/AppHelper.js"); //AppHelper includes many functions necessary to create the interface of OpenEpi and
												  //call the data entry table, including the translation functions
includeJs("../Etable/Etable_files/StatFunctions1.js"); //StatFunctions1 contains useful formatting and lookup functions for statistics.
includeJs("../Etable/Etable_files/OECommands.js"); //OECommands.js is necessary to parse input and output commands
//includeJs("../Etable/Etable_files/AppHelper.js"); //AppHelper includes many functions necessary to create the interface of OpenEpi and
												  //call the data entry table, including the translation functions
//January 2007 
includeJs("../Etable/Etable_files/TabbedUI.js");  //Tabbing function to prevent having to use pop-ups.  See source inside file.  
includeJs("../Etable/Etable_files/GoogleTrack.js");  //Tracking functions for Google Analytics  See source inside file.  
                                           												
	                                           												
																								 
if ((basefilename.length>0) && (basefilename != "Settings"))
  {
  includeJs(basefilename+'.js'); //The js file is the one that you write, containing the statistics functions for a new module
      							//If there is none, set basefilename to ""  (null) in your  main module
  }