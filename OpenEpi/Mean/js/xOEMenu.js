//OEMenu.js from YACOpenEpi
//var smartPhone=DetectMobileQuick(); //from DetectDevice.js
var smartPhone=0;
var expand='Expand All';
var collapse='Collapse';
if (typeof(parent.t)=="function")
   {
   expand=parent.t(expand);
   collapse=parent.t(collapse);
   }
var ExpColl = '<a href="javascript: d.openAll();">' +
'&nbsp;' + expand +'</a> | <a href="javascript: d.closeAll();">' + collapse +'</a><p></p>'
d = new dTree('d');
d.config.target="blank";

 //Default target for display of URLs is current window, replacing this app.

//var menuButton='<div id="menuButton" name="menuButton" style="position:absolute;top:0;left:0;z:1000;"><button onClick="href=../menu/OEMenu.htm" value="Menu">Menuuu</button>     </div>'
var menuButton='<div id="menuButton" name="menuButton" ><input type=button style="position:absolute;top:10;left:10;z:1000;width:130px;height:60px;" onClick="location.href=&quot;../menu/OEMenu.htm&quot;" value="MENU"></button>     </div>'
var logoImage='<img src="../img/OpenEpi1.gif" name="logo" align="center" width="130">';
d.add(0,-1,'About OpenEpi','../Menu/OEIntro.htm');
d.add(100,0,'Language/Options/Settings', '../Settings/Settings.htm','','','../img/globe.gif');
d.add(12,0,'Counts','','','','','',true);
	d.add(13,12,'Std.Mort.Ratio','../SMR/SMR.htm');
	d.add(14,12,'Proportion','../Proportion/Proportion.htm');
	d.add(15,12,'Two by Two Table','../TwobyTwo/TwobyTwo.htm');
	d.add(16,12,'Dose-Response','../DoseResponse/DoseResponse.htm');
	d.add(17,12,'R by C Table','../RbyC/RbyC.htm');
    d.add(18,12,'Matched Case Control','../MatchCC/MatchCC.htm');
	d.add(19,12,'Screening', '../DiagnosticTest/DiagnosticTest.htm');
d.add(20,0,'Person Time','','','','','',true)
	d.add(21,20,'1 Rate','../PersonTime1/PersonTime1.htm');
	d.add(22,20,'Compare 2 Rates','../PersonTime2/PersonTime2.htm');
d.add(24,0,'Continuous Variables','','','','','',false);
	d.add(25,24,'Mean CI','../Mean/CIMean.htm');
	d.add(26,24,'Median/%ile CI','../Median/CIMedian.htm');
	d.add(27,24,'t test','../Mean/t_testMean.htm');
	d.add(28,24,'ANOVA','Mean/ANOVA.htm');
d.add(30,0,'Sample Size','','','','','',false);
	d.add(31,30,'Proportion','../SampleSize/SSPropor.htm');
	d.add(32,30,'Unmatched CC','../SampleSize/SSCC.htm');
	d.add(33,30,'Cohort/RCT','../SampleSize/SSCohort.htm');
	d.add(34,30,'Mean Difference','../SampleSize/SSMean.htm');
d.add(35,0,'Power','','','','','',false);
	d.add(2,35,'Unmatched CC','../Power/PowerCC.htm');
	d.add(3,35,'Cohort','../Power/PowerCohort.htm');
	d.add(4,35,'Clinical Trial','../Power/PowerRCT.htm');
	d.add(5,35,'X-Sectional','../Power/PowerCross.htm');
	d.add(6,35,'Mean Difference','../Power/PowerMean.htm');
d.add(50,0,'Random numbers','../Random/Random.htm');
//d.add(100,0,'Options/Settings', 'Etable/Settings.htm');
//d.add(115,0,'Download OpenEpi','Downloads/Downloads.htm');
d.add(110,0,'Searches','','','','','',false);
    d.add(111,110,'Google--Internet','http://www.google.com');
	d.add(112,110,'PubMed--MEDLARS','http://www.pubmed.gov');
d.add(11,0,'Calculator','../Calculator/calculator.htm');
d.add(1,0,'Info and Help');
    d.add(2,1,'About OpenEpi','../BriefDoc/About.htm');
	d.add(3,1,'News','../BriefDoc/news.htm');
	d.add(4,1,'Choosing a method', '../Search/Choosing.htm');
	d.add(5,1,'Using OpenEpi', '../BriefDoc/UsingOpenEpi.htm');
	d.add(6,1,'Credits', '../BriefDoc/Credits.htm');
	d.add(7,1,'Licensing/Disclaimer', '../BriefDoc/Licensing.htm');
	d.add(9,1,'History','../BriefDoc/History.htm');
d.add(200,0,'Net Links','../BriefDoc/OELinks.htm');
d.add(115,0,'Download OpenEpi','../Downloads/Downloads.htm');
d.add(45,0,'Development');
	d.add(46,45,'Proposal', '../Documentation/Proposal2.htm');
	d.add(47,45,'Toolkit Description','../Documentation/ToolkitDoc.htm');
	//d.add(48,45,'Toolkit Example','../Toolkit/Proportion.htm');
	d.add(49,45,'Translations','../Documentation/Translation.htm');
	d.add(50,45,'JavaScript Tips','../Documentation/JavaScriptTips.htm');
d+='<span style="font-size:smaller">'
d+='<br />dTree control &copy;2002-2003<br>by&nbsp;'
d+='<a href="mailto&#58;drop&#64;destroydrop&#46;com">Geir Landr&ouml;</a><br />'
d+='</span>'
  // document.write(logoImage+d);
/*if (this.toString()=="OEMenu.htm")
  {
    document.write(logoImage+d);  //Always write the menu if in the menu
  }
  else
  {  //not in menu.  Write menu only if not smartPhone
    if (!smartPhone)
    {
      document.write(logoImage+d);
    }
    else
    {
      document.write(menuButton);
    }
  }
*/



