var inTbl = "HELLO From Panel 2";
function buildTable()
{
alert("Here we are in buildTable");
var pTag = document.createElement("p");

           // pTag.setAttribute("align","center");

pTag.innerHTML = "This paragraph <b>HTML p tag</b> is added dynamically inside the panel2 tag.";
document.getElementById("panel2").appendChild(pTag);

}

//  Revised from ETable.htm, March 16, 2011
//  saved from url=(0052)http://www.scottandrew.com/dhtml/demos/dynchart.html
//  revised (some would say "mangled" )by Andy Dean, agdean9@hotmail.com, during early 2003
//  to accomodate data entry, with a single input cell moving over the surface of the
//  dyntable (now called a "stratum") , doing its validation thing, and dumping the user input into
//  the cell beneath when appropriate.  The idea is to have a configurable table for use
//  in entering summary data for epidemiologic or other statistical programs.
/*
inTbl += '<script type=text/javascript>\n';
inTbl += 'function buildTable()\n';
inTbl += '{\n';
inTbl += 'alert("Here we are in buildTable")\n';
inTbl += '}\n';
inTbl += 'buildTable()\n';
inTbl += '</script>\n';
 */