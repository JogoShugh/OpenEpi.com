// JavaScript Document
//This module for performance evaluation of diagnostic tests was
//developed by Hemant Kulkarni, Amit Amin, Manju Mamtani, Manik Amin for
//Lata Medical Research Foundation, Nagpur, India and was offered to be used in
//OpenEpi on June 9, 2003.

function CalcBin() {
    if (levels==2) {
         if (tp<0||tn<0||fp<0||fn<0) {
             alert("Counts can not be negative!");
             return;
         }
         if (tp!=Math.floor(tp)||tn!=Math.floor(tn)||fp!=Math.floor(fp)||fn!=Math.floor(fn)) {
             alert("Counts can not be fractions!");
             return;
         }
         assesstwobytwo();
    }
    if (levels>2) {
         sensitivity[0]=1;
         specificity[0]=1;
         for (c=1; c<levels; c++) {
              with (outTable) {
                   title("<h3>Cut-off point between level "+ c +" and "+ (c+1) + "</h3>");
                   newrow();
              }
              definetwobytwo(c);
              assesstwobytwo();
              sensitivity[c]=Fmt(sn);
              specificity[c]=Fmt(1-sp);
         }
         sensitivity[levels]=0;
         specificity[levels]=0;
         with (outTable) {
              newrow();
              title("<h3>Level-specific Likelihood Ratios</h3>");
              newrow();
         }
         levellr();
         calcauc();
    }
}
function Fmt(x) { 
var v
if(x>0) { v=''+(x+0.00001) } else { v=''+(x-0.00000) };
return v.substring(0,v.indexOf('.')+5)
}
\

function assesstwobytwo() {
         sn = tp/D;
         sp = tn/nD;
         ppv = tp/Tpos;
         npv = tn/Tneg;
         acc = (tp+tn)/N;
         snl = sn-1.96*(Math.sqrt(sn*(1-sn)/D));
         snu = sn+1.96*(Math.sqrt(sn*(1-sn)/D));
         spl = sp-1.96*(Math.sqrt(sp*(1-sp)/nD));
         spu = sp+1.96*(Math.sqrt(sp*(1-sp)/nD));
         ppvl = ppv-1.96*(Math.sqrt(ppv*(1-ppv)/Tpos));
         ppvu = ppv+1.96*(Math.sqrt(ppv*(1-ppv)/Tpos));
         npvl = npv-1.96*(Math.sqrt(npv*(1-npv)/Tneg));
         npvu = npv+1.96*(Math.sqrt(npv*(1-npv)/Tneg));
         accl = acc-1.96*(Math.sqrt(acc*(1-acc)/N));
         accu = acc+1.96*(Math.sqrt(acc*(1-acc)/N));
         lrp = (tp/D)/(fp/nD);
         lrn = (fn/D)/(tn/nD);
         lrpl = lrp*Math.exp(-1.96*(((1-sn)/(tp*sn))+(sp/(tn*(1-sp)))));
         lrpu = lrp*Math.exp(1.96*(((1-sn)/(tp*sn))+(sp/(tn*(1-sp)))));
         lrnl = lrn*Math.exp(-1.96*((sn/(tp*(1-sn)))+((1-sp)/(tn*sp))));
         lrnu = lrn*Math.exp(1.96*((sn/(tp*(1-sn)))+((1-sp)/(tn*sp))));
         odds = (tp*tn)/(fp*fn);
         odl = odds*Math.exp(-1.96*Math.sqrt((1/tp)+(1/fp)+(1/fn)+(1/tn)));
         odu = odds*Math.exp(1.96*Math.sqrt((1/tp)+(1/fp)+(1/fn)+(1/tn)));
         pe = ((D*Tpos)+(nD*Tneg))/(N*N);
         kap = (acc-pe)/(1-pe);
         vtemp = ((D*Tpos*(D+Tpos))+(nD*Tneg*(nD+Tneg)))/(N*N*N)
         sekap = (1/((1-pe)*Math.sqrt(N)))*Math.sqrt(pe+(pe*pe)-vtemp);
         kapl = kap-1.96*sekap;
         kapu = kap+1.96*sekap;
         enth = -1.0*((D*Math.log(D/N)/N)+(nD*Math.log(nD/N)/N));
         enp = -1.0*((ppv*Math.log(ppv))+((1-ppv)*Math.log(1-ppv)));
         enn = -1.0*((npv*Math.log(npv))+((1-npv)*Math.log(1-npv)));
         entp = enth - enp;
         entn = enth - enn;
         bi = (fp-fn)/N;
    	with (outTable)
	{
	newrow("span2:b:Parameter","c:Estimate", "c:95% CI");
	newrow();
        newrow("span2:Sensitivity:","c:"+Fmt(sn), "c:("+Fmt(snl)+" - "+Fmt(snu)+")");
	newrow("span2:Specificity:","c:"+Fmt(sp), "c:("+Fmt(spl)+" - "+Fmt(spu)+")");
	newrow("span2:Positive Predictive Value:","c:"+Fmt(ppv), "c:("+Fmt(ppvl)+" - "+Fmt(ppvu)+")");
	newrow("span2:Negative Predictive Value:","c:"+Fmt(npv), "c:("+Fmt(npvl)+" - "+Fmt(npvu)+")");
	newrow("span2:Diagnostic Accuracy:","c:"+Fmt(acc), "c:("+Fmt(accl)+" - "+Fmt(accu)+")");
	newrow("span2:Likelihood ratio of a Positive Test:","c:"+Fmt(lrp), "c:("+Fmt(lrpl)+" - "+Fmt(lrpu)+")");
	newrow("span2:Likelihood ratio of a Negative Test:","c:"+Fmt(lrn), "c:("+Fmt(lrnl)+" - "+Fmt(lrnu)+")");
	newrow("span2:Diagnostic Odds:","c:"+Fmt(odds), "c:("+Fmt(odl)+" - "+Fmt(odu)+")");
	newrow("span2:Cohen's kappa (Unweighted):","c:"+Fmt(kap), "c:("+Fmt(kapl)+" - "+Fmt(kapu)+")");
	newrow("span2:Entropy reduction after a Positive Test:","c:"+Fmt(entp));
	newrow("span2:Entropy reduction after a Negative Test:","c:"+Fmt(entn));
	newrow("span2:Bias Index:","c:"+Fmt(bi));
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
        fn = fn + parseFloat(EntryWin.dataMatrix[1][si]);
        si = "E"+i+"D1";
        tn = tn + parseFloat(EntryWin.dataMatrix[1][si]);
    }
    for (i=cp;i<levels;i++) {
        si = "E"+i+"D0";
        tp = tp + parseFloat(EntryWin.dataMatrix[1][si]);
        si = "E"+i+"D1";
        fp = fp + parseFloat(EntryWin.dataMatrix[1][si]);
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
        ld = parseFloat(EntryWin.dataMatrix[1][si]);
        si = "E"+(lc-1)+"D1";
        ln = parseFloat(EntryWin.dataMatrix[1][si]);
        p1 = ld/D;
        p2 = ln/nD;
        lr = p1/p2;
        lrl = lr*Math.exp(-1.96*(((1-p1)/(tp*p1))+((1-p2)/(tn*p2))));
        lru = lr*Math.exp(1.96*(((1-p1)/(tp*p1))+((1-p2)/(tn*p2))));
        with (outTable) {
            newrow("span2:Level "+lc,Fmt(lr),Fmt(lrl)+" - "+Fmt(lru));
        }
    }
    with (outTable) {
        newrow();
        newrow();
    }

}
function calcauc() {
    for (ac=1;ac<levels+1;ac++) {
        si = "E"+(ac-1)+"D1";
        auc1[ac-1] = parseFloat(EntryWin.dataMatrix[1][si]);
        si = "E"+(ac-1)+"D0";
        auc3[ac-1] = parseFloat(EntryWin.dataMatrix[1][si]);
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