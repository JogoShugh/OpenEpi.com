// JavaScript Document
//This module for performance evaluation of diagnostic tests was
//developed by Hemant Kulkarni, Amit Amin, Manju Mamtani, Manik Amin for
//Lata Medical Research Foundation, Nagpur, India and was offered to be used in
//OpenEpi on June 9, 2003.

//Here is the text that goes on the first page of the application, the one presented by running the HTM.  
var Title="Diagnostic or Screening Test Evaluation 1.0";

var Authors="<b>Statistics</b><br>";
    Authors+="Hemant Kulkarni, Amit Amin, Manju Mamtani, Manik Amin<br>"
    Authors+="Lata Medical Research Foundation, Nagpur, India<br>"
    Authors+="<b>Interface</b><br>"
	Authors+="Andrew G. Dean, EpiInformatics.com, and Roger Mir<br>"
        
var Description="<p>This module helps evaluate the performance of a candidate diagnostic test or screening procedure against a known <i>reference</i> "
    Description+="or <i>gold</i> standard. It is assumed that a reference standard (the true diagnosis) exists. The module lets you choose the type of diagnostic test "
	Description+="based on the outcome it reports. Then, the module uses pertinent statistics to evaluate the performance of the diagnostic test.</p> " 
    Description+="<p>For two or more exposure levels, the program calculates Sensitivity, Specificity, Positive and Negative Predictive Values, "
	Description+="Diagnostic Accuracy, Likelihood Ratios, Diagnostic Odds, Cohen's Kappa, Entropy Reduction, and a Bias Index.</p> " 
    Description+="<p>If more than two levels of results are specified, a plot (ROC curve) showing proportions of true positives versus false "
	Description+="positives is produced.</p> " 

//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="Run Diagnostic Test Evaluation and click on Load Demo Data  "+      
	  "<ul>"+
	    "<li>The data  are scores from 1 (definitely normal) to 5 (definitely abnormal) of computed tomographic (CT) images by a radiologist. "+  
        "The scores are compared with 'True Disease Status' of normal and abnormal as determined by an absolute standard or, more practically, by subsequent clinical outcome. "+  
      "</li>"+
		"<li>How useful are the various scores in predicting disease? How good is the scoring system at distinguishing normal from abnormal?</li>"+
      "</ul>"+
"Data from Rosner B Fundamentals of Biostatistics, 4th ed., Duxbury, 2000; p. 63"+

"<h2>Demo--Interpretation</h2>"+
"A score of 2 or greater is 94% sensitive but only 57% specific in predicting disease. A score of 5 is 97% specific but only 65% sensitive. "+  
"There is a smooth progression between these two extremes."+
"<ul>"+
	  "<li>A score of 4 ('Probably abnormal') or greater has a sensitivity of 86% and specificity of 78% </li>"+
      "<li>The area under the Receiver Operator Characteristic (ROC) Curve is 89%, meaning that, given a pair of CT scans from 1 normal and 1 abnormal patient, "+ 
"this radiologist has an 89% chance of scoring the abnormal one higher (if ties are randomly allocated). "+
"</li>"+
      "</ul>";
 
var Exercises="A rapid screening test is compared with definitive laboratory testing of the same persons as the gold standard' "+ 
"The results are: "+
"<ul>"+
	  "<li>Both tests positive in 67 persons</li>"+
     "<li>Both tests negative in 202 persons</li>"+ 
     "<li>Screen positive, Gold negative, in 14</li>"+ 
     "<li>Screen negative, Gold positive, in 7</li>"+ 
"</ul>"+
"How good is the screening test?"+  
"<ul>"+
	 "<li>How many false positives would you expect among 1000 normal people?</li>"+  
     "<li>How many true positives would you miss among 1000 truly positive people?</li>"+   
	 "<li>What factors influence a decision to use the screening test and the strategy for doing so?</li>"+  
"</ul>";	 
	 
function CalcBin(outObj) {
	if (levels<2) return;
	if (levels==2) {
          	    tp=parseFloat(outObj.data[1]["E0D0"]);
		        //tp are the true positives
		         
                fp=parseFloat(outObj.data[1]["E0D1"]);
                //fp are the false positives
		
		        fn = parseFloat(outObj.data[1]["E1D0"]);
          	   //fn are the false negatives

                tn = parseFloat(outObj.data[1]["E1D1"]);
                //tn are true negatives
          // alert("tp="+tp+ " fp="+fp+" fn="+fn+" tn="+tn)
                D = tp+fn;
                //D subjects have disease

                nD = fp+tn;
                //nD subjects are normal

                Tpos = tp+fp;
                //Tpos subjects are positive by the diagnostic test

                Tneg = fn+tn;
                //Tneg subjects are negative by the diagnostic test

                N = D+nD;
                //N are the total subjects
         }                                  
    var notneg=t("Counts cannot be negative!");
	var notfrac=t("Counts cannot be fractions!");
    if (levels==2) {
         if (tp<0||tn<0||fp<0||fn<0) {
             alert(notneg);
             return;
         }
         if (tp!=Math.floor(tp)||tn!=Math.floor(tn)||fp!=Math.floor(fp)||fn!=Math.floor(fn)) {
             alert(notfrac);
             return;
         }
         assesstwobytwo();
    }
    if (levels>2) {
         sensitivity[0]=1;
         specificity[0]=1;
         for (c=1; c<levels; c++) {
              with (outObj) {
                   title("<h3>"+ t("Cut-off point between level")+ " "+ c +" "+t("and")+" "+ (c+1) + "</h3>");
                   //newrow();
              }
              definetwobytwo(c);
              assesstwobytwo();
              sensitivity[c]=fmtSigFig4(sn);
              specificity[c]=fmtSigFig4(1-sp);
         }
         sensitivity[levels]=0;
         specificity[levels]=0;
         with (outObj) {
              newrow();
              title("<h3>Level-specific Likelihood Ratios</h3>");
			  newrow("","bold:Level","bold:c:Ratio","bold:span2:Confidence Limits");
			  line(5,1);
         }
         levellr();
         calcauc();
    }
}
function fmtSigFig4(x) 
{ 
return fmtSigFig(x,4);  //use function in StatFunctions1 to get 4 significant figures
//var v
//if(x>0) { v=''+(x+0.00001) } else { v=''+(x-0.00000) };
//return v.substring(0,v.indexOf('.')+5)
}


function assesstwobytwo() {
         snarr = proportion95CL(tp,D,'Wilson'); //Sensitivity
		 sn=snarr[0];
		 snl = snarr[1]; 
         snu = snarr[2];
		 
		 sparr=proportion95CL(tn,nD,'Wilson');  //Specificity
         sp = sparr[0];
		 spl = sparr[1]; 
         spu = sparr[2];
		 
         
		 ppvarr=proportion95CL(tp,Tpos,'Wilson');  //Positive Predictive Value
         ppv = ppvarr[0];
		 ppvl = ppvarr[1]; 
         ppvu = ppvarr[2];
		 
        
		 npvarr=proportion95CL(tn,Tneg,'Wilson'); //Negative Predictive Value
         npv = npvarr[0];
		 npvl = npvarr[1]; 
         npvu = npvarr[2];
		 
         
		 accarr=proportion95CL((tp+tn),N,'Wilson');  //Diagnostic Accuracy
         acc = accarr[0];
		 accl = accarr[1]; 
         accu = accarr[2];
         
   
		 
         lrp = (tp/D)/(fp/nD); //Likelihood ratio of positive test
         lrn = (fn/D)/(tn/nD); //Likelihood ratio of negative test
         lrpl = lrp*Math.exp(-1.96*(((1-sn)/(tp*sn))+(sp/(tn*(1-sp)))));
         lrpu = lrp*Math.exp(1.96*(((1-sn)/(tp*sn))+(sp/(tn*(1-sp)))));
         lrnl = lrn*Math.exp(-1.96*((sn/(tp*(1-sn)))+((1-sp)/(tn*sp))));
         lrnu = lrn*Math.exp(1.96*((sn/(tp*(1-sn)))+((1-sp)/(tn*sp))));
		 
         odds = (tp*tn)/(fp*fn);  //Diagnostic odds
         odl = odds*Math.exp(-1.96*Math.sqrt((1/tp)+(1/fp)+(1/fn)+(1/tn)));
         odu = odds*Math.exp(1.96*Math.sqrt((1/tp)+(1/fp)+(1/fn)+(1/tn)));
		
         pe = ((D*Tpos)+(nD*Tneg))/(N*N);
         kap = (acc-pe)/(1-pe);  //Cohen's kappa
         vtemp = ((D*Tpos*(D+Tpos))+(nD*Tneg*(nD+Tneg)))/(N*N*N)
         sekap = (1/((1-pe)*Math.sqrt(N)))*Math.sqrt(pe+(pe*pe)-vtemp);
         kapl = kap-1.96*sekap;
         kapu = kap+1.96*sekap;
         enth = -1.0*((D*Math.log(D/N)/N)+(nD*Math.log(nD/N)/N));
         enp = -1.0*((ppv*Math.log(ppv))+((1-ppv)*Math.log(1-ppv)));
         enn = -1.0*((npv*Math.log(npv))+((1-npv)*Math.log(1-npv)));
         entp = enth - enp; //Entropy reduction after pos. test
         entn = enth - enn; //Entropy reduction after negative test
         bi = (fp-fn)/N; //Bias index
    	with (outObj)
	{
	newrow("c:bold:Parameter","","c:bold:Estimate", "c:span2:bold:Lower - Upper\n95% CIs", "c:span2:bold:Method");
	line(6);
    newrow("span2:Sensitivity:","c:"+fmtSigFig(sn,4,100)+"\%", "c:span2:("+limits(snl,snu,1,100)+")","span2:Wilson Score");
	newrow("span2:Specificity:","c:"+fmtSigFig(sp,4,100)+"\%", "c:span2:("+limits(spl,spu,1,100)+")","span2:Wilson Score");
	newrow("span2:Positive Predictive Value:","c:"+fmtSigFig(ppv,4,100)+"\%", "c:span2:("+limits(ppvl,ppvu,1,100)+")","span2:Wilson Score");
	newrow("span2:Negative Predictive Value:","c:"+fmtSigFig(npv,4,100)+"\%", "c:span2:("+limits(npvl,npvu,1,100)+")","span2:Wilson Score");
	newrow("span2:Diagnostic Accuracy:","c:"+fmtSigFig(acc,4,100)+"\%", "c:span2:("+limits(accl,accu,1,100)+")","span2:Wilson Score");
	
	newrow("span2:Likelihood ratio of a Positive Test:","c:"+fmtSigFig4(lrp), "c:span2:("+fmtSigFig4(lrpl)+" - "+fmtSigFig4(lrpu)+")");
	newrow("span2:Likelihood ratio of a Negative Test:","c:"+fmtSigFig4(lrn), "c:span2:("+fmtSigFig4(lrnl)+" - "+fmtSigFig4(lrnu)+")");
	newrow("span2:Diagnostic Odds:","c:"+fmtSigFig4(odds), "c:span2:("+fmtSigFig4(odl)+" - "+fmtSigFig4(odu)+")");
	newrow("span2:Cohen's kappa (Unweighted):","c:"+fmtSigFig4(kap), "c:span2:("+fmtSigFig4(kapl)+" - "+fmtSigFig4(kapu)+")");
	newrow("span2:Entropy reduction after a Positive Test:","c:"+fmtSigFig(entp,4,100)+"\%");
	newrow("span2:Entropy reduction after a Negative Test:","c:"+fmtSigFig(entn,4,100)+"\%");
	newrow("span2:Bias Index:","c:"+fmtSigFig4(bi));
        newrow();
        newrow();
    }  
}
function definetwobytwo(cp) {
    tp = 0;
    fp = 0;
    fn = 0;
    tn = 0;
    for (i=0;i<cp;i++) {
        si = "E"+i+"D0";
        fn = fn + parseFloat(outObj.data[1][si]);
        si = "E"+i+"D1";
        tn = tn + parseFloat(outObj.data[1][si]);
    }
    for (i=cp;i<levels;i++) {
        si = "E"+i+"D0";
        tp = tp + parseFloat(outObj.data[1][si]);
        si = "E"+i+"D1";
        fp = fp + parseFloat(outObj.data[1][si]);
    }  
    D = tp + fn;
    nD = fp + tn;
    Tpos = tp + fp;
    Tneg = fn + tn;
    N = D + nD;
}
function levellr() {
    for (lc=1;lc<levels+1;lc++) {
        si = "E"+(lc-1)+"D0";
        ld = parseFloat(outObj.data[1][si]);
        si = "E"+(lc-1)+"D1";
        ln = parseFloat(outObj.data[1][si]);
        p1 = ld/D;
        p2 = ln/nD;
        lr = p1/p2;
        lrl = lr*Math.exp(-1.96*(((1-p1)/(tp*p1))+((1-p2)/(tn*p2))));
        lru = lr*Math.exp(1.96*(((1-p1)/(tp*p1))+((1-p2)/(tn*p2))));
        with (outObj) {
            newrow("","Level "+lc,fmtSigFig4(lr),"span2:"+fmtSigFig4(lrl)+" - "+fmtSigFig4(lru));
        }
    }
    with (outObj) {
        newrow();
        newrow();
    }

}
function calcauc() {
    for (ac=1;ac<levels+1;ac++) {
        si = "E"+(ac-1)+"D1";
        auc1[ac-1] = parseFloat(outObj.data[1][si]);
        si = "E"+(ac-1)+"D0";
        auc3[ac-1] = parseFloat(outObj.data[1][si]);
        tr = 0;
        for (acj=0; acj<ac; acj++) {
            tr = tr + auc3[acj];
        }
        auc2[ac-1] = D - tr;
        tr = 0;
        if (ac>1) {
            for (acj=0;acj<ac-1;acj++) {
                tr = tr + auc1[acj];
            }
        }
        auc4[ac-1] = tr;
    }
    theta = 0;
    Q1 = 0;
    Q2 = 0;
    for (ac=1; ac<levels+1; ac++) {
        auc5[ac-1] = (auc1[ac-1]*auc2[ac-1])+(0.5*auc1[ac-1]*auc3[ac-1]);
        auc6[ac-1] = auc3[ac-1]*((auc4[ac-1]*auc4[ac-1])+(auc4[ac-1]*auc1[ac-1])+(auc1[ac-1]*auc1[ac-1]/3));
        auc7[ac-1] = auc1[ac-1]*((auc2[ac-1]*auc2[ac-1])+(auc2[ac-1]*auc3[ac-1])+(auc3[ac-1]*auc3[ac-1]/3));
        theta = theta + auc5[ac-1];
        Q1 = Q1 + auc7[ac-1];
        Q2 = Q2 + auc6[ac-1];
    }     
    theta = theta/(nD*D);
    Q1 = Q1/(D*D*nD);
    Q2 = Q2/(nD*nD*D);
    setheta = Math.sqrt(((theta*(1-theta))+((D-1)*(Q1-theta*theta))+((nD-1)*(Q2-theta*theta)))/(nD*D));
}