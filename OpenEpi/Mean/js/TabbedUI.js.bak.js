// JavaScript Document
//For tabbed user interface
var currentPanel;

function writeToWin(content){
         var w = window.open();
         var d = w.document;
         d.open();
         d.write(content);
         d.close();
       }

function initPanels(panelInicial)
{
  for (pp=1; pp<6; pp++)
	  {
	   if (!(pp==5 && device=="smartphone"))
       {
	   if (pp!=panelInicial)
	    {
	      if(device != "smartphone")
          {
            //just for now
		  document.getElementById('panel'+pp).style.display = 'none';
		  //alert("display set to none for panel "+pp+ " in showpanel");
          }
		}
		else
		{
		  showPanel(pp)
		}
       }
	  }
 //   if (device=="smartphone")
  //  {
  //    setTimeout("panelWin = window.open(''+self.location,'mywin','left=20,top=20,height=500,width=500, toolbar=0,resizable=1');panelWin.focus();",2000);
  //  }
}
 //Junk note: if (opener && !opener.closed && opener.w2 && !opener.w2.closed)
function closeMe()
{

 window.location.href="../OpenEpiMenu.htm";

}


function showPanelAsWindow(panelNum)
{
var panelWin;
var HTMLforDiv='<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">';
HTMLforDiv+='<link rel="stylesheet" href="../Etable/TabbedUI.css" TYPE="text/css" MEDIA="screen">\n';
HTMLforDiv+='<link rel="stylesheet" href="../Etable/TabbedUI-print.css" TYPE="text/css" MEDIA="print">\n';
HTMLforDiv+='<head>'
HTMLforDiv+='<STYLE type=text/css> '
HTMLforDiv+='table{width:290px;background-color:#FFFFFF} tr{width:290px;} td{width=290px;}'
HTMLforDiv+='</STYLE>'

HTMLforDiv+='</head>';
HTMLforDiv+='<body>';
	//The first works in Netscape; the second in IE 6
//Jan 2007
var tabWidth=20;
HTMLforDiv+='<div id="tab0" class="tab" style="left: 2%;" onClick="opener.closeMe();setTimeout(&quot;self.close()&quot;,1000);"> '
HTMLforDiv +='<strong>'+t("Menu*")+'</strong>'+'</div>';
HTMLforDiv+='<div id="tab1" class="tab" style="left: 18%;" onClick = "parent.opener.showPanelAsWindow(1);" onMouseOver="opener.hover(this);" onMouseOut="opener.setState(1)">'
HTMLforDiv+=t('Start*')
HTMLforDiv+='</div>'
HTMLforDiv+='<div id="tab2" class="tab" style="left: 34%;" onClick = "opener.useOpenEpiEntry();self.close()" onMouseOver="opener.hover(this);" onMouseOut="opener.setState(2);">'
HTMLforDiv+=t('Enter*')
HTMLforDiv+='</div>'
HTMLforDiv+='<div id="tab3" class="tab" style="left: 50%;" parent.opener.showPanel(3);" onMouseOver="opener.hover(this);" onMouseOut="opener.setState(3);">'
HTMLforDiv+=t('Results*')
HTMLforDiv+='</div>'
HTMLforDiv+='<div id="tab4" class="tab" style="left: 70%;" onClick = "parent.opener.showPanel(4);opener.showExWindow();" onMouseOver="opener.hover(this);" onMouseOut="opener.setState(4)">'
HTMLforDiv+=t('Examples*')
HTMLforDiv+='</div><br />'
HTMLforDiv+='<table width="100%" border="0" cellspacing="0" cellpadding="2" bgcolor="#CCCCCC">';
HTMLforDiv+='  <tr color="#FFFFFF">';
HTMLforDiv+='<div id="banner" style="background-color:#EEEEEE; color:#FFFFFF;">'

if(parent.document.getElementById('panel'+panelNum)!=null)
   {HTMLforDiv+= parent.document.getElementById('panel'+panelNum).innerHTML;}
else
   {HTMLforDiv+= document.getElementById('panel'+panelNum).innerHTML;}
HTMLforDiv+='</body>';
HTMLforDiv+='</html>';


if (panelWin && panelWin.open) {panelWin.close();}  //smartphone allows only one popup window
if (panelNum==2)
   {
    panelWin=window.open('../Etable/Etable.htm','panelW2','fullscreen=yes,resizable=no, scrollbars=yes, titlebar=no');
    self.close();
   }
   else
   {
     //Open a copy of the entire window to allow scrolling
   //setTimeout(" panelWin = window.open(''+self.location,'mywin','left=20,top=20,height=500,width=500, toolbar=0,resizable=1');panelWin.focus();",4000);
    //panelWin.focus();
    //alert(92 + document.location);
    panelWin=window.open('../Etable/Empty.htm','<a target=name href="../Etable/Empty.htm">','fullscreen=yes,resizable=no, scrollbars=yes, titlebar=no');
   }
  //alert(panelWin.document.location);

panelWin.document.write(HTMLforDiv);

panelWin.document.close();
panelWin.focus();
currentPanel=panelNum;
//hidePanel();
}

function showPanel(panelNum)
{    var pp =0;
	//hide visible panel, show selected panel, set tab
    if (currentPanel != null)
	{
		hidePanel();
	}


	 document.getElementById('panel'+panelNum).style.visibility = 'visible';
   	 document.getElementById('panel'+panelNum).style.display = '';
    //Experiment March 2007  'block' does not work

   if ((parent.device =="smartphone") && (panelNum != 2))
    {

       //showPanelAsWindow(panelNum);
    }
    currentPanel = panelNum;
	setState(panelNum);
}
function hidePanel(){
	//hide visible panel, unhilite tab
       //The following line causes Safari to Crash completely.
      // document.getElementById('panel'+currentPanel).style.display = 'none';

	//alert("display set to none for panel "+currentPanel+ " in hidepanel")
	document.getElementById('panel'+currentPanel).style.visibility = 'hidden';
	document.getElementById('tab'+currentPanel).style.backgroundColor = '#ffffff';
	document.getElementById('tab'+currentPanel).style.color = 'navy';
}

function setState(tabNum)
{
  if (device!="smartphone")
   {
	if(tabNum==currentPanel)
	    {
		document.getElementById('tab'+tabNum).style.backgroundColor = '#666666';  // was'#ddddff'
		document.getElementById('tab'+tabNum).style.color = 'white';
		document.getElementById('tab'+tabNum).style.borderBottomColor = '#666666';
	    }
	else
	    {
		document.getElementById('tab'+tabNum).style.backgroundColor = '#ffffff';
		document.getElementById('tab'+tabNum).style.color = 'navy';
	    }
   }
}

function hover(tab)
    {
	tab.style.backgroundColor = '#ddddff';
	tab.style.borderBottom='none';
    }
//end