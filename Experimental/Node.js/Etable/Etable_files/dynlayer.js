// Dynamic Layer Object
// sophisticated layer/element targeting and animation object which provides the core functionality needed in most DHTML applications
// 19990604

// Copyright (C) 1999 Dan Steinman
// Distributed under the terms of the GNU Library General Public License
// Available at http://www.dansteinman.com/dynapi/

// updated 20011228 by Bob Clary <bc@bclary.com>
// to support Gecko

function DynLayer(id,nestref,frame) {
	//bc:maybe? if (!is.ns5 && !DynLayer.set && !frame) DynLayerInit()
	//alert("is.ie="+is.ie + "is.ns="+is.ns + "is.ns5="+is.ns5)
	if (!DynLayer.set && !frame) DynLayerInit()
	this.frame = frame || self
	//bc:if (is.ns) {
	if (is.ns4) 
	  {
		if (is.ns4) 
		  {
			if (!frame) 
			{
				if (!nestref) var nestref = DynLayer.nestRefArray[id]
				if (!DynLayerTest(id,nestref)) return
				this.css = (nestref)? eval("document."+nestref+".document."+id) : document.layers[id]
			}
			else 
			{this.css = (nestref)? eval("frame.document."+nestref+".document."+id) : frame.document.layers[id]
			this.elm = this.event = this.css
			this.doc = this.css.document}
			//not sure about the two preceding curly brackets.  There were none.
		 // }
		//bc:else if (is.ns5) {
		//bc:	this.elm = document.getElementById(id)
		//bc:	this.css = this.elm.style
		//bc:	this.doc = document
		//bc: }
		this.x = this.css.left
		this.y = this.css.top
		this.w = this.css.clip.width
		this.h = this.css.clip.height
		}
	}
	//bc:else if (is.ie) {
	else if (is.ie || is.ns5) 
	{
    //bc:
    if (is.ie)
	    {
	   //alert("47:frame="+this.frame + "this.frame.document.all[id]="+ this.frame.document.all[id] + " id=" + id)
		this.elm = this.event = this.frame.document.all[id]
	//	alert("id=" +id)
	//	alert("49: this.elm="+this.elm)
		}
    //bc:
    else 
		{this.elm = this.event = this.frame.document.getElementById(id)}
//alert("52 this.elm=" + this.elm)
//alert("53 is.ie=" + is.ie)
		//bc:this.css = this.frame.document.all[id].style
//alert("57: this.elm.style="+this.elm.style)		
		this.css = this.elm.style
		this.doc = document
		this.x = this.elm.offsetLeft
		this.y = this.elm.offsetTop
		this.w = (is.ie4)? this.css.pixelWidth : this.elm.offsetWidth
		this.h = (is.ie4)? this.css.pixelHeight : this.elm.offsetHeight
		
	}
	this.id = id
	this.nestref = nestref
	this.obj = id + "DynLayer"
	//this.obj=id+".dynlayer"  //experiment
//alert("69 in Dynlayer.")
//alert("in 70, this.obj+=this is: "+this.obj+"=this" + "this="+this)	
	eval(this.obj + "=this")
}
function DynLayerMoveTo(x,y) {
	if (x!=null) {
		this.x = x
		//bc:if (is.ns) this.css.left = this.x
		if (is.ns4) this.css.left = this.x
		//bc:else this.css.pixelLeft = this.x
		else if (is.ie) this.css.pixelLeft = this.x
		else if (is.ns5) this.css.left = Math.floor(this.x) + 'px'
	}
	if (y!=null) {
		this.y = y
		//bc:if (is.ns) this.css.top = this.y
		if (is.ns4) this.css.top = this.y
		//bc:else this.css.pixelTop = this.y
		else if (is.ie) this.css.pixelTop = this.y
		else if (is.ns5) this.css.top = Math.floor(this.y) + 'px'
	}
}
function DynLayerMoveBy(x,y) {
	this.moveTo(this.x+x,this.y+y)
}
function DynLayerShow() {
	this.css.visibility = (is.ns4)? "show" : "visible"
}
function DynLayerHide() {
	this.css.visibility = (is.ns4)? "hide" : "hidden"
}
DynLayer.prototype.moveTo = DynLayerMoveTo
DynLayer.prototype.moveBy = DynLayerMoveBy
DynLayer.prototype.show = DynLayerShow
DynLayer.prototype.hide = DynLayerHide
DynLayerTest = new Function('return true')

// DynLayerInit Function
function DynLayerInit(nestref) {
   //alert("in DynLayerInit")
	if (!DynLayer.set) DynLayer.set = true
	//bc:if (is.ns) {
	if (is.ns4) {
		if (nestref) ref = eval('document.'+nestref+'.document')
		else {nestref = ''; ref = document;}
		for (var i=0; i<ref.layers.length; i++) {
			var divname = ref.layers[i].name
			DynLayer.nestRefArray[divname] = nestref
			var index = divname.indexOf("Div")
			if (index > 0) {
				eval(divname.substr(0,index)+' = new DynLayer("'+divname+'","'+nestref+'")')
			}
			if (ref.layers[i].document.layers.length > 0) {
				DynLayer.refArray[DynLayer.refArray.length] = (nestref=='')? ref.layers[i].name : nestref+'.document.'+ref.layers[i].name
			}
		}
		if (DynLayer.refArray.i < DynLayer.refArray.length) {
			DynLayerInit(DynLayer.refArray[DynLayer.refArray.i++])
		}
	}
	else if (is.ie) {
		for (var i=0; i<document.all.tags("DIV").length; i++) {
			var divname = document.all.tags("DIV")[i].id
			var index = divname.indexOf("Div")
			if (index > 0) {
				eval(divname.substr(0,index)+' = new DynLayer("'+divname+'")')
			}
		}
	}
  //bc:
	else if (is.ns5) {
    var nodeList = document.getElementsByTagName('div');
		for (var i=0; i<nodeList.length; i++) {
			var divname = nodeList[i].id
			var index = divname.indexOf("Div")
			if (index > 0) {
				eval(divname.substr(0,index)+' = new DynLayer("'+divname+'")')
			}
		}
	}
	return true
}
DynLayer.nestRefArray = new Array()
DynLayer.refArray = new Array()
DynLayer.refArray.i = 0
DynLayer.set = false

// Slide Methods
function DynLayerSlideTo(endx,endy,inc,speed,fn) {
	if (endx==null) endx = this.x
	if (endy==null) endy = this.y
	var distx = endx-this.x
	var disty = endy-this.y
	this.slideStart(endx,endy,distx,disty,inc,speed,fn)
}
function DynLayerSlideBy(distx,disty,inc,speed,fn) {
	var endx = this.x + distx
	var endy = this.y + disty
	this.slideStart(endx,endy,distx,disty,inc,speed,fn)
}
function DynLayerSlideStart(endx,endy,distx,disty,inc,speed,fn) {
	if (this.slideActive) return
	if (!inc) inc = 10
	if (!speed) speed = 20
	var num = Math.sqrt(Math.pow(distx,2) + Math.pow(disty,2))/inc
	if (num==0) return
	var dx = distx/num
	var dy = disty/num
	if (!fn) fn = null
	this.slideActive = true
	this.slide(dx,dy,endx,endy,num,1,speed,fn)
}
function DynLayerSlide(dx,dy,endx,endy,num,i,speed,fn) {
	if (!this.slideActive) return
	if (i++ < num) {
		this.moveBy(dx,dy)
		this.onSlide()
		if (this.slideActive) setTimeout(this.obj+".slide("+dx+","+dy+","+endx+","+endy+","+num+","+i+","+speed+",\""+fn+"\")",speed)
		else this.onSlideEnd()
	}
	else {
		this.slideActive = false
		this.moveTo(endx,endy)
		this.onSlide()
		this.onSlideEnd()
		eval(fn)
	}
}
function DynLayerSlideInit() {}
DynLayer.prototype.slideInit = DynLayerSlideInit
DynLayer.prototype.slideTo = DynLayerSlideTo
DynLayer.prototype.slideBy = DynLayerSlideBy
DynLayer.prototype.slideStart = DynLayerSlideStart
DynLayer.prototype.slide = DynLayerSlide
DynLayer.prototype.onSlide = new Function()
DynLayer.prototype.onSlideEnd = new Function()

// Clip Methods
function DynLayerClipInit(clipTop,clipRight,clipBottom,clipLeft) {
	//bc:if (is.ie) {
	if (is.ie||is.ns5) {
		if (arguments.length==4) this.clipTo(clipTop,clipRight,clipBottom,clipLeft)
		else if (is.ie4) this.clipTo(0,this.css.pixelWidth,this.css.pixelHeight,0)
    //bc:
		else if (is.ns5) this.clipTo(0,this.elm.offsetWidth,this.elm.offsetHeight,0)
	}
}
function DynLayerClipTo(t,r,b,l) {
	if (t==null) t = this.clipValues('t')
	if (r==null) r = this.clipValues('r')
	if (b==null) b = this.clipValues('b')
	if (l==null) l = this.clipValues('l')
	//bc:if (is.ns) {
	if (is.ns4) {
		this.css.clip.top = t
		this.css.clip.right = r
		this.css.clip.bottom = b
		this.css.clip.left = l
	}
	//bc:else if (is.ie) this.css.clip = "rect("+t+"px "+r+"px "+b+"px "+l+"px)"
	else if (is.ie||is.ns5) this.css.clip = "rect("+t+"px "+r+"px "+b+"px "+l+"px)"
}
function DynLayerClipBy(t,r,b,l) {
	this.clipTo(this.clipValues('t')+t,this.clipValues('r')+r,this.clipValues('b')+b,this.clipValues('l')+l)
}
function DynLayerClipValues(which) {
	//bc:if (is.ie) var clipv = this.css.clip.split("rect(")[1].split(")")[0].split("px")
	if (is.ie||is.ns5) var clipv = this.css.clip.split("rect(")[1].split(")")[0].split("px")
	//bc:if (which=="t") return (is.ns)? this.css.clip.top : Number(clipv[0])
	if (which=="t") return (is.ns4)? this.css.clip.top : Number(clipv[0])
	//bc:if (which=="r") return (is.ns)? this.css.clip.right : Number(clipv[1])
	if (which=="r") return (is.ns4)? this.css.clip.right : Number(clipv[1])
	//bc:if (which=="b") return (is.ns)? this.css.clip.bottom : Number(clipv[2])
	if (which=="b") return (is.ns4)? this.css.clip.bottom : Number(clipv[2])
	//bc:if (which=="l") return (is.ns)? this.css.clip.left : Number(clipv[3])
	if (which=="l") return (is.ns4)? this.css.clip.left : Number(clipv[3])
}
DynLayer.prototype.clipInit = DynLayerClipInit
DynLayer.prototype.clipTo = DynLayerClipTo
DynLayer.prototype.clipBy = DynLayerClipBy
DynLayer.prototype.clipValues = DynLayerClipValues

// Write Method
function DynLayerWrite(html) {
	//bc:if (is.ns) {
	if (is.ns4) {
		this.doc.open()
		this.doc.write(html)
		this.doc.close()
	}
	//bc:else if (is.ie) {
	else if (is.ie||is.ns5) {
		this.event.innerHTML = html
	}
}
DynLayer.prototype.write = DynLayerWrite

// BrowserCheck Object
function BrowserCheck() {
	var b = navigator.appName
	if (b=="Netscape") this.b = "ns"
	else if (b=="Microsoft Internet Explorer") this.b = "ie"
	else this.b = b
	this.version = navigator.appVersion
	this.v = parseInt(this.version)
	this.ns = (this.b=="ns" && this.v>=4)
	this.ns4 = (this.b=="ns" && this.v==4)
	this.ns5 = (this.b=="ns" && this.v==5)
	this.ie = (this.b=="ie" && this.v>=4)
	this.ie4 = (this.version.indexOf('MSIE 4')>0)
	this.ie5 = (this.version.indexOf('MSIE 5')>0)
	this.min = (this.ns||this.ie)
}
is = new BrowserCheck()

// CSS Function
function css(id,left,top,width,height,color,vis,z,other) {
	if (id=="START") return '<STYLE TYPE="text/css">\n'
	else if (id=="END") return '</STYLE>'
	var str = (left!=null && top!=null)? '#'+id+' {position:absolute; left:'+left+'px; top:'+top+'px;' : '#'+id+' {position:relative;'
	if (arguments.length>=4 && width!=null) str += ' width:'+width+'px;'
	if (arguments.length>=5 && height!=null) {
		str += ' height:'+height+'px;'
		if (arguments.length<9 || other.indexOf('clip')==-1) 
		{
		  str += ' clip:rect(0px '+width+'px '+height+'px 0px);'
		  //str +="";  //Oct 2003  experiment
		}
	}
	//bc:if (arguments.length>=6 && color!=null) str += (is.ns)? ' layer-background-color:'+color+';' : ' background-color:'+color+';'
//alert(305 +"in dynlayer.  Color="+color)
	if (arguments.length>=6 && color!=null) str += (is.ns4)? ' layer-background-color:'+color+';' : ' background-color:'+color+';'
	if (arguments.length>=7 && vis!=null) str += ' visibility:'+vis+';'
	if (arguments.length>=8 && z!=null) str += ' z-index:'+z+';'
	if (arguments.length==9 && other!=null) str += ' '+other
	str += '}\n'
	return str
}
function writeCSS(str,showAlert) {
	str = css('START')+str+css('END')
	document.write(str)
	if (showAlert) alert(str)
}
