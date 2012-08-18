// JavaScript Document
//For tabbed user interface
var currentPanel;
function initPanels(panelInicial)
{
for (pp=1; pp<6; pp++)
	  {
	   if (pp!=panelInicial)
	    {
		  document.getElementById('panel'+pp).style.display = 'none';
		  //alert("display set to none for panel "+pp+ " in showpanel");
		}
		else
		{
		  showPanel(pp)
		}
	  }
}

function showPanel(panelNum)
{    var pp =0;
	//hide visible panel, show selected panel, set tab
    if (currentPanel != null) 
	{
		hidePanel();
	}
	
	document.getElementById('panel'+panelNum).style.visibility = 'visible';
	//document.getElementById('panel'+panelNum).style.class ='panel'; //Experiment March 2007
	//alert("panel "+ panelNum +"  class = panel")
   	document.getElementById('panel'+panelNum).style.display = ''; //Experiment March 2007  'block' does not work
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

function hover(tab)
    {
	tab.style.backgroundColor = '#ddddff';
	tab.style.borderBottom='none';
    }
//end