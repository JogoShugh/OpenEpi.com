// ReadCookie.js
//Contains global variables for cookie settings
//As of April 2011, uses localStorage if cookie cannot be set and read by
//browser, as with Google Chrome if the files are not in a server.
//Makes use of DetectDevice.js

var alerting = false;    //Set this to true to activate alert boxes, lots of them
var OnTop;// = readCookie("openepi","Dropbox0");
//alert("onTop=" +OnTop)
var TopLeft ;// = readCookie("openepi","TopLeft");
//alert("TopLeft=" +TopLeft)
var TopRight ;// = readCookie("openepi","TopRight");
//alert("TopRight=" +TopRight)
var Dropbox1 ;// = readCookie("openepi","Dropbox1");
//alert("Dropbox1=" +Dropbox1)

var Exposure ;
var Top ;
var Bottom ;
var Dropbox2 ;
var AutoLayout ;
var ConfidenceLevel ;
var Pvalues ;
var Columnpercents ;
var RowPercents ;
var Language ;
var ShowTables ;
var ShowStrata ;
var ExposureLeft ;
var MaxValueAtLeft ;
var MaxValueAtTop ;
var ConfLevel ;
var conflevel;
var ScreenConfig;
var device;

function getItem(key) {
    var value;
    log('Get Item in 6 of readcookie:' + key);
    try {
      value = window.localStorage.getItem(key);
    }catch(e) {
      log("Error inside getItem() for key:" + key);
	  log(e);
	  value = "null";
    }
    log("Returning value from getItem: " + value);
    return value;
  }

 function setItem(key, value) {
    try {
      log("Inside setItem in ReadCookie 20: " + key + ":" + value);
      window.localStorage.removeItem(key);
      window.localStorage.setItem(key, value);
    }catch(e) {
      log("Error inside setItem");
      log(e);
    }
    log("Return from setItem" + key + ":" +  value);
  }

function clearStrg() {
    log('about to clear local storage');
    window.localStorage.clear();
    log('cleared');
  }

 function log(txt) {
    if(alerting) {
      alert(txt);
    }
  }

function readUnescapedCookie(cookieName)
{
    var cookieValue;
    if(cookiesEnabled())
       {
        cookieValue=document.cookie;
       }
    else
       {
       try{
        cookieValue=getItem(cookieName)
        }
        catch(e)
        {
        cookieValue=null;
        }
       }
	var cookieRegExp = new RegExp("\\b" + cookieName + "=([^;]*)");
	cookieValue = cookieRegExp.exec(cookieValue);
	if (cookieValue != null)
		{
		cookieValue = cookieValue[1];
		}
	return cookieValue;
}

function readCookie(cookieName, multiValueName)
{
	var cookieValue = readUnescapedCookie(cookieName)
	if (cookieValue == null)
		{
		return cookieValue;
		}
	var extractMultiValueCookieRegExp = new RegExp("\\b" + multiValueName + "=([^;&]*)");
	cookieValue = extractMultiValueCookieRegExp.exec(cookieValue);
	if (cookieValue != null)
	{
		cookieValue = unescape(cookieValue[1]);
	}
	return cookieValue;
}

function deleteCookie(cookieName)
  {
   if (cookiesEnabled())
    {
	var expiredDate = new Date();
	expiredDate.setMonth(-1);
	writeCookie(cookieName,"","",expiredDate,"/");
	}
    else
     {
     try {
      log("Inside deleteCookie in ReadCookie 95: " + key + ":" + value);
      window.localStorage.removeItem(cookieName);
     }
     catch(e) {
      log("Error inside deleteCookie");
      log(e);
    }
    }
  }
 function cookiesEnabled()
 {
   // var cookieEnabled=(navigator.cookieEnabled)? true : false;
      var cookieEnabled=false;
      document.cookie="testcookie";
      cookieEnabled=(document.cookie.indexOf("testcookie")!=-1)? true : false;


    /*
    if (typeof navigator.cookieEnabled=="undefined" && !cookieEnabled){
        document.cookie="testcookie";
        cookieEnabled=(document.cookie.indexOf("testcookie")!=-1)? true : false;
    }
    */

    return cookieEnabled;
 }

/*
function cookiesEnabled()
	{
	//var cookiesEnabled = window.navigator.cookieEnabled;
	var cookiesEnabled;
	document.cookie = "cookiesEnabled=True";
	cookiesEnabled = new Boolean(document.cookie).valueOf();
	return cookiesEnabled;
	}
*/
function writeCookie(cookieName, multiValueName, value, expires, path)
{
	var cookieValue = readUnescapedCookie(cookieName);
    //alert("55 in writeCookie of readcookie");
	if (cookieValue)
	{
		var stripAttributeRegExp = new RegExp("(^|&)" + multiValueName + "=[^&]*&?");
		cookieValue = cookieValue.replace(stripAttributeRegExp,"$1");
		if (cookieValue.length != 0)
		{
		cookieValue += "&";
		}
	}
	else
	{
		cookieValue = "";
	}
	cookieValue += multiValueName + "=" + escape(value);
	var cookieDetails = cookieName + "=" + cookieValue;
	cookieDetails += (expires ? "; expires=" + expires.toGMTString(): '');
	cookieDetails += (path ? "; path=" + path: '');
     //alert(116 + "in ReadCookie.js, cookieDetails="+cookieDetails);
     if(cookiesEnabled())
       {document.cookie = cookieDetails; }
     else
       {
     try
      {
      setItem(cookieName, cookieDetails);
      }
      catch(e)
      {
        alert (t("Unable to save settings"))
      }

      }

 }

/*
function saveSettings()
{


	writeCookie("openepi","Dropbox0", document.all.Dropbox0.options[document.all.Dropbox0.selectedIndex].index, expiryDate, "/");
	writeCookie("openepi","TopLeft", document.all.TopLeft.innerHTML, expiryDate, "/");
	writeCookie("openepi","TopRight", document.all.TopRight.innerHTML, expiryDate, "/");
	writeCookie("openepi","Dropbox1", document.form1.Dropbox1.options[document.all.Dropbox1.selectedIndex].index, expiryDate, "/");	
	writeCookie("openepi","Exp", document.all.Exp.innerHTML, expiryDate, "/");	
	writeCookie("openepi","Top", document.all.Top.innerHTML, expiryDate, "/");
	writeCookie("openepi","col0", document.all.col0.bgColor, expiryDate, "/");		
	writeCookie("openepi","col1", document.all.col1.bgColor, expiryDate, "/");		
	writeCookie("openepi","col2", document.all.col2.bgColor, expiryDate, "/");		
	writeCookie("openepi","col3", document.all.col3.bgColor, expiryDate, "/");					
	writeCookie("openepi","Bottom", document.all.Bottom.innerHTML, expiryDate, "/");		
	writeCookie("openepi","Dropbox2", document.form1.Dropbox2.options[document.all.Dropbox2.selectedIndex].index, expiryDate, "/");

	for ( var i =0; i < document.all.AutoLayout.length; i++)
		{
		if ( document.all.AutoLayout[i].checked) 
			{
		    writeCookie("openepi","AutoLayout", i, expiryDate, "/");
			}
		}
	writeCookie("openepi","ConfidenceLevel", document.form1.ConfidenceLevel.options[document.all.ConfidenceLevel.selectedIndex].index, expiryDate, "/");			
	if (document.all.Pvalues.checked)
		{	
		writeCookie("openepi","Pvalues", 1, expiryDate, "/");
		}	
	else
		{
		writeCookie("openepi","Pvalues", 0, expiryDate, "/");	
		}
		
	if (document.all.Columnpercents.checked)
		{	
		writeCookie("openepi","Columnpercents", 1, expiryDate, "/");	
		}
	else
		{
		writeCookie("openepi","Columnpercents", 0, expiryDate, "/");			
		}
		
	if (document.all.RowPercents.checked)
		{	
		writeCookie("openepi","RowPercents", 1, expiryDate, "/");	
		}
	else
		{
		writeCookie("openepi","RowPercents", 0, expiryDate, "/");		
		}

}
   */


function readSettings()
{
OnTop = readCookie("openepi","Dropbox0");
//alert("onTop=" +OnTop)
TopLeft = readCookie("openepi","TopLeft");
//alert("TopLeft=" +TopLeft)
TopRight = readCookie("openepi","TopRight");
//alert("TopRight=" +TopRight)
Dropbox1 = readCookie("openepi","Dropbox1");
//alert("Dropbox1=" +Dropbox1)
Exposure = readCookie("openepi","Exp");
//alert("Exp=" +Exposure)
Top = readCookie("openepi","Top");
//alert("Top=" +Top)
Bottom = readCookie("openepi","Bottom");
//alert("Bottom=" +Bottom)
Dropbox2 = readCookie("openepi","Dropbox2");
//alert("Dropbox2=" +Dropbox2)
AutoLayout = readCookie("openepi","AutoLayout");
//alert("AutoLayout=" +AutoLayout)
ConfidenceLevel = readCookie("openepi","ConfidenceLevel");
//alert("ConfidenceLevel=" + ConfidenceLevel)
Pvalues = readCookie("openepi","Pvalues");
//alert("Pvalues=" +Pvalues)
Columnpercents = readCookie("openepi","Columnpercents");
//alert("Columnpercents=" + Columnpercents)
RowPercents = readCookie("openepi","RowPercents");
//alert("RowPercents="+RowPercents)
Language = readCookie("openepi","Language");
ShowTables = readCookie("openepi","ShowTables");
ShowStrata = readCookie("openepi","ShowStrata");
ScreenConfig=readCookie("openepi","ScreenConfig");

ExposureLeft =true;
if (Exposure !=null && Exposure!="Exposure") {ExposureLeft=false};
//alert("ExposureLeft="+ExposureLeft);
MaxValueAtLeft = true;
if (TopLeft != null&&TopLeft!="(+)") {MaxValueAtLeft=false}
//alert ("MaxValueAtLeft="+MaxValueAtLeft);
MaxValueAtTop = true;
if (Top != null&&Top!="(+)") {MaxValueAtTop=false}
//alert ("MaxValueAtTop="+MaxValueAtTop);
if (ConfidenceLevel == null || ConfidenceLevel< 20) {ConfidenceLevel=95}
ConfLevel = ConfidenceLevel;
conflevel=ConfLevel;

//alert("RowPercents in Etable="+RowPercents)

if (Language == null)  {Language="EN"}

if (ShowTables == null) {ShowStrata = true}   
if (ShowStrata == null) {ShowStrata = true}


}

readSettings();

//if (DetectSmartphone()||(ScreenConfig=="smartphone"))
//  {device="smartphone";}
//else
//  {device="";}
//Set device to match the actual computer, but it can be set otherwise
//in the Settings page if desired.
//end of ReadCookie.js

