function StratumLockCheck(r,c){
	if (this.row[r].cell[c].locked) {
		alert("Dynamic Table Error:\nCell(' + r + ',' + c + ') is locked")
		return true
	}
	else {return false}
}
Stratum.prototype.lockCheck = StratumLockCheck

function StratumCellLocked(r,c)
{
	if (this.row[r].cell[c].locked )
	{
		return true
	}
	else {return false}
}

function StratumAddTo(r,c,val)
{
	if (this.lockCheck)
	{
		if (this.lockCheck(r,c)) {return true}
	}
	if (r > this.rows) {alert("Dynamic Table Error:\nThere is no Row " + r); return false}
	if (c > this.cols) {alert("Dynamic Table Error:\nThere is no Column " + c); return false}
	if (!this.row[r].cell[c].value) {this.insert(r,c,val); return false}
	this.row[r].cell[c].value = this.row[r].cell[c].value + val
	this.cellWrite(r,c)
}

Stratum.prototype.addTo = StratumAddTo

function StratumSubFrom(r,c,val){
	if (this.lockCheck)
	{
		if (this.lockCheck(r,c)) 
		{
		return false;
		}
	}
	if (r > this.rows) {alert("Dynamic Table Error:\nThere is no Row " + r); return false;}
	if (c > this.cols) {alert("Dynamic Table Error:\nThere is no Column " + c); return false;}
	if (!this.row[r].cell[c].value) {this.row[r].cell[c].value = '0'}
	if(isNaN(this.row[r].cell[c].value)) {alert("Dynamic Table Error:\nCell value is not an integer"); return false;}
	this.row[r].cell[c].value = parseInt((this.row[r].cell[c].value - val),10)
	this.cellWrite(r,c)
}

Stratum.prototype.subFrom = StratumSubFrom

function StratumInsertRow(r,args){
	if (args.length > this.cols) {
		alert("Dynamic Table Error:\nNot enough columns to accommodate data")
		return
		}
	for (i=0 ; i < args.length ; i++){
		if (this.lockCheck(r,i)) {return false;}
		this.row[r].cell[i].value = args[i]
		this.cellWrite(r,i)
	}
}

Stratum.prototype.insertRow = StratumInsertRow

function StratumInsertCol(c,args){
	if (args.length > this.rows) {
		alert("Dynamic Table Error:\nNot enough rows to accommodate data")
		return
		}
	for (i=0 ; i < args.length ; i++){
		if (this.lockCheck(i,c)) {return false;}
		this.row[i].cell[c].value = args[i]
		this.cellWrite(i,c)
	}
}

Stratum.prototype.insertCol = StratumInsertCol
/*
function StratumLockCell(r,c){
	this.row[r].cell[c].locked = true
}

Stratum.prototype.lockCell = StratumLockCell

function StratumUnlockCell(r,c){
	this.row[r].cell[c].locked = false
}

Stratum.prototype.unlockCell = StratumUnlockCell
*/
function StratumLockRow(r){
	for (i=0 ; i < this.cols ; i++){
	this.row[r].cell[i].locked = true
	}
}

Stratum.prototype.lockRow = StratumLockRow

function StratumLockCol(c){
	for (i=0 ; i < this.rows ; i++){
	this.row[i].cell[c].locked = true
	}
}

Stratum.prototype.lockCol = StratumLockCol

function StratumUnlockRow(r){
	for (i=0 ; i < this.cols ; i++){
	this.row[r].cell[i].locked = false
	}
}

Stratum.prototype.unlockRow = StratumUnlockRow

function StratumUnlockCol(c){
	for (i=0 ; i < this.rows ; i++){
	this.row[i].cell[c].locked = false
	}
}

Stratum.prototype.unlockCol = StratumUnlockCol


function StratumTotalCol(r,c,entry)
{   
	this.results = ""
	this.emptyrow=-1

	for (var i=0 ; i < this.rows ; i++)
	//Look for empty cells in column
	{  
	   if (this.row[i].cell[c].type != null) 
	  { 
	   if (this.row[i].cell[c].type == "data")
	    {
		if(isNaN(this.row[i].cell[c].value)){
			//alert("Dynamic Table Error:\nCannot total column containing string")
			this.results = ''
			return this.results
		 }
		 value=parseFloat(this.row[i].cell[c].value);
		  if (!isNaN(value))
		    { 
			 if (this.results=="")
			   {
			   this.results=0;
			   }
		      this.results += value;
			  //Add up the total
			} 
			else
			{
			if ((this.emptyrow == -1) && (this.row[this.inputR].cell[this.inputC].type != "data"))
		      {this.emptyrow=i}
		    else {this.emptyrow = -2} 
			} 
		 }  
		 //Only data cells processed, so far
		 }
	}
		//through looping
		 if (this.emptyrow>=0 && !isNaN(entry) && entry != '') 
			 {  diff = entry-this.results;
			    if (entry > this.results)  
				{
			//	alert ("Setting empty cell r" + r + ", c"+this.emptyrow + " to " + entry - this.results);
				this.insert(this.emptyrow,c,entry - this.results);
				this.calcTotals(this.emptyrow,c);
				this.results=entry;
				}
			 	
			 } 	
	return(this.results)
}		


Stratum.prototype.totalCol = StratumTotalCol

function StratumTotalRow(r,c,entry)
//Row and column of proposed total.  Value of entry in rtotal box that is being evaluated 
//or value currently in rtotal cell.
{
	this.results = ""
	this.emptycol=-1
	for (var i=0 ; i < this.cols-1 ; i++)
	//Look for empty cells in row
	{  
	   if (this.row[r].cell[i].type != null) 
	  { 
	   if (this.row[r].cell[i].type == "data")
	    { 
		 if(isNaN(this.row[r].cell[i].value))
		   {
			//alert("Problem in row total function:\nCannot total row containing text")
			this.results = ''
			return this.results
		   }
		  value=parseFloat(this.row[r].cell[i].value);
		  
		  if (!isNaN(value))
		    { 
			  if (this.results=="")
			   {
			   this.results=0;
			   }
		      this.results += value;
			  //Add up the total
			} 
			else
			{
			if ((this.emptycol == -1) && (this.row[this.inputR].cell[this.inputC].type != "data"))
			  //If no previous empty column and input was not from a data cell
		      {this.emptycol=i}
		    else 
			  {this.emptycol = -2} 
			// Set flag so that empty cell is not automatically filled in
			} 
		 }  
		 //Only data cells processed, so far
	   }
	}
			 if (this.emptycol>=0 && !isNaN(entry) && entry != '') 
			 {  
			     if (entry > this.results)  
				{
				this.insert(r,this.emptycol,entry - this.results);
				this.calcTotals(r,this.emptycol);
				this.results=entry;
				}
			 } 
	return(this.results)
}

Stratum.prototype.totalRow = StratumTotalRow