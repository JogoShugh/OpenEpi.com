// JavaScript Document

function readUnescapedCookie(cookieName)
{
	var cookieValue = document.cookie;
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

function cookiesEnabled()
	{
	//var cookiesEnabled = window.navigator.cookieEnabled;
	var cookiesEnabled
	document.cookie = "cookiesEnabled=True";
	cookiesEnabled = new Boolean(document.cookie).valueOf();
	return cookiesEnabled;
	}

function writeCookie(cookieName, multiValueName, value, expires, path)
{
	var cookieValue = readUnescapedCookie(cookieName);
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
	document.cookie = cookieDetails;	
}

function saveSettings()
{
	/*check for cookies are enabled,
	 if not then display a warning message and return	
	*/
	if (!cookiesEnabled())
		{
		alert("Cookies are disabled or not allowed in this browser. Please enable them in the browser settings to allow saving settings.");
		return;
		}

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

   
//alert("Language="+Language+ "\nShowTables=" +ShowTables + "\nShowStrata="+ShowStrata);