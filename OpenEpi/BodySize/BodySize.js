// JavaScript Document
//Here is the text that goes on the first page of the application, the one presented by running the HTM.
var Title="Size";
var  Authors="Andrew G. Dean, University of Miami<br>";
     Authors+="Kevin M. Sullivan, Emory University<br> and Roger Mir<br>";
var Description="<p>Given an individual's age, sex, height, and weight, this module "
    Description+="calculates z-scores and percentiles for age-appropriate nutritional statistics, "
    Description+="using reference data from the US Centers for Disease Control and Prevention(CDC) "
    Description+="and the World Health Organization."

    Description+="<p>For Adults this module calculates the Body Mass Index  = Kilograms/Height * Height "
    Description+="and provides a brief interpretation of the result. For children up to 24 months "
    Description+="of age, it compares the result with the WHO reference population "
    Description+=" to give the z-score, or number of standard deviations from the reference "
    Description+="mean for the same age and sex of height or length for age, weight for age, and BMI"
    Description+="for age. For ages from 24 months to 20 years, the CDC reference curves are used for "
    Description+=" comparison.  Head Circumference up to age 36 months is compared with WHO standards. "
    Description+=" Body Surface Area is calculated for pediatric use.</p>"

//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
var Demo="You have taken on the task of assessing the nutritional status of recent arrivals at a center "
    Demo+="for abused children.  Two of the children have the following measurements:"
    Demo+= "<ul>"
	Demo+= "<li>Child A --DOB=     , Measurement date=01/01/2012, Weight=    kilos; height=   cm; head circumference=   ;</li>"
    Demo+= "<li>Child A --DOB=     , Measurement date=01/01/2012, Weight=    kilos; height=   cm; head circumference=   ;</li>"
    Demo+="The nurse in charge decides to check her own weight, and has the following values:"
    Demo+="<li>Nurse Metro --DOB=     , Measurement date=01/01/2012, Weight=    kilos; height=   cm; head circumference=   ;</li>"
    Demo+="Please describe the nutritional status of the two children and the nurse.  You may also want to "
    Demo+="insert your own age, height, and weight in the Size calculator to calculate your BMI. "
    Demo+="</ul>";

var Exercises=" A medication has a starting dose of 250 mgm per square meter of body surface. "
    Exercises+=" Please calculate the total dose for the following child:"
    Exercises+= "<ul>"
    Exercises+= "<li>Child C --DOB=     , Measurement date=01/01/2012, Weight=    kilos; height=   cm; head circumference=   ;</li>"
    Exercises+="</ul>";

//Error messages, placed here for translation, since they will rarely be displayed
var numnotless=t( "Numerator cannot be less than zero");
var denomnotless=t("Denominator cannot be less than zero" );
var numnotlarger=t("Numerator cannot be larger than the denominator" );

function doStatistics(cmdObj)
{
//This is the main statistical routine.  Results are accumulated in cmdObj.s, an HTML string that is later displayed
//by the calling page.

//First get values from the interface
var name=cmdObj.data[1]["E0D0"];

var DOB=cmdObj.data[1]["E2D1"]
var dateMeas=cmdObj.data[1]["E1D1"]
//Calculate age
var ageDays=parseInt(daysBetween(DOB,dateMeas));
var negAgeMsg=t("Date of Measurement cannot be before Birth")
if (ageDays < 0)
   {
     alert(negAgeMsg);
     return;
   }
//var ageMonths= parseInt(monthsBetween(DOB,dateMeas));
//alert (ageMonths);
var sexMissing= t("Please enter sex as M/F or 1/2. Guess if necessary.");
var sex=parseInt(cmdObj.data[1]["E4D1"]);
   if ((sex==1)|| (sex=="1")||(sex =="m") || (sex=="M"))
     {sex="M"}
   else if ((sex==2)|| (sex=="2")||(sex =="f") || (sex=="F"))
     {sex="F"}
   else
     {

     alert(sexMissing)
     removeCalendar();
     return
     }
var kg=parseFloat(cmdObj.data[1]["E5D1"]);

//var cm=parseFloat(cmdObj.data[1]["E6D1"]);

var standingCM=parseFloat(cmdObj.data[1]["E6D1"]);
//alert("standingCM="+standingCM);
var recumbentCM=parseFloat(cmdObj.data[1]["E7D1"]);
var headCM=parseFloat(cmdObj.data[1]["E8D1"]);
var armCM=parseFloat(cmdObj.data[1]["E9D1"]);


 if (ageDays<1856)
 {
 //Adjust cm for age and method of measurement
 //Children are 0.7 longer when measured in recumbent position
 //WHO stats assume that those less than 731 days are measured recumbent
 var adjustedCM=0.0
 //var noHtLen=t("Please enter height or length");
 if ((standingCM>0) || (recumbentCM>0))
   {  // measurement was entered
    if (ageDays > 0)
      {
       if (ageDays < 731)
        {
          if (recumbentCM>0)
            {adjustedCM=recumbentCM}
          else
            {adjustedCM=standingCM+0.7}
        }
       else
        { //must be older than 731 days
          if (standingCM>0)
           {adjustedCM=standingCM}
          else
           {adjustedCM=recumbentCM-0.7}
        }
      }
   }
   else
   {
     adjustedCM=0;
   }

   alert("Stature in cm ="+adjustedCM)





// var bsa=BSA(kg,cm);
 var adjustedBSA=BSA(kg,adjustedCM);

 //var bmi=BMI(kg,cm);
 var adjustedBMI=BMI(kg,adjustedCM);
// bmiAge=Z_WHO(statistic, sex, agedays, kg, cm, LorH, headcm, muac)
 //  alert(bsa + ", "+bmi +  ", "+bmiAge)
 var BMIZ_W06=Z_WHO("BMIZ_W06",sex,ageDays,kg,adjustedCM);
 var WAZ_W06=Z_WHO("WAZ_W06",sex,ageDays,kg,adjustedCM);
 var HAZ_W06=Z_WHO("HAZ_W06",sex,ageDays,kg,adjustedCM);
 var WLZ_W06=Z_WHO("WLZ_W06",sex,ageDays,kg,adjustedCM);
 var WHZ_W06=Z_WHO("WHZ_W06",sex,ageDays,kg,adjustedCM);
 var WHead_W06=Z_WHO("WHead_W06",sex,ageDays,kg,adjustedCM,headCM,armCM);
 var WArm_W06=Z_WHO("WArm_W06",sex,ageDays,kg,adjustedCM,headCM,armCM);

 } //end of ageDays < 1856
 else
 {
 // CDC2000 calculations here

 }

 //Define a table.  You can include extra columns to help with the formatting
 //and then use the span property to combine several cells and make a wider one.


  var ageMonths=parseInt(ageDays/30.4375)    //Dubious assumption

with (cmdObj)
	{
	    //Use the functions of cmdObj to construct the HTML output page, which is accumulated as cmdObj.s
		newtable(4,100);
	 	newrow("bold:span5:l:<h2>Results for " +name+ ", born "+ DOB +"</h2>");
if ((ageDays >= 0) && (ageMonths <= 24))
       {
        newrow("bold:span5:l:Age="+ageDays+ " Days on "+ dateMeas);
        newrow("bold::span5:l:Kg="+kg + " cm="+adjustedCM+ " Sex="+t(sex));
	    newrow("bold:span5:l:Body Surface Area(BSA)="+adjustedBSA+ " square meters");
        newrow("bold:span5:l:BMI="+adjustedBMI+" BMI for age z="+fmtSigFig(BMIZ_W06,4)+"  Percentile="+fmtSigFig(pctBelowZ(BMIZ_W06),4));

        newrow("bold:span5:l: Weight for Age Z="+fmtSigFig(WAZ_W06,4)+"  Percentile="+fmtSigFig(pctBelowZ(WAZ_W06),4));
        newrow("bold:span5:l: Height for Age Z="+fmtSigFig(HAZ_W06,4)+"  Percentile="+fmtSigFig(pctBelowZ(HAZ_W06),4));
        newrow("bold:span5:l: Weight for Length Z="+fmtSigFig(WLZ_W06,4)+"  Percentile="+fmtSigFig(pctBelowZ(WLZ_W06),4));
        newrow("bold:span5:l: Weight for Height Z="+fmtSigFig(WHZ_W06,4)+"  Percentile="+fmtSigFig(pctBelowZ(WHZ_W06),4));
       }
      else if ((ageMonths > 24) && (ageMonths<=240))
       {
        newrow("bold:span5:l:Age="+ageMonths+ " Months "+"or "+parseInt(ageMonths/12)+" years on "+ dateMeas);
        newrow("bold:span5:l:Kg="+kg + " cm="+adjustedCM + " Sex="+t(sex));
	    newrow("bold:span5:l:Body Surface Area(BSA)="+adjustedBSA+ " square meters");
        var bmiAgeZ=BMIAGE(sex,ageMonths, kg, adjustedCM)
        newrow("bold:span5:l:BMI="+adjustedBMI+" BMI for age z="+fmtSigFig(bmiAgeZ,4)+"  Percentile="+fmtSigFig(pctBelowZ(bmiAgeZ),4));
           // For AGEMO=24 to 240
        var wtAgeZ=WTAGE(sex,ageMonths, kg, adjustedCM)
        newrow("bold:span5:l: Weight for Age Z="+fmtSigFig(wtAgeZ,4)+"  Percentile="+fmtSigFig(pctBelowZ(wtAgeZ),4));
        var htAgeZ=HEIGHTAGE(sex,ageMonths, kg, adjustedCM)
        newrow("bold:span5:l: Height for Age Z="+fmtSigFig(htAgeZ,4)+"  Percentile="+fmtSigFig(pctBelowZ(htAgeZ),4));
       }
       else if (ageMonths >240)
        {
          //Adult of more than 20 years
        newrow("bold:span5:l:Adult--Age="+parseInt(ageMonths/12)+ " Years on "+ dateMeas);
        newrow("bold:span5:l:Kg="+kg + " cm="+standingCM + " Sex="+t(sex));

        if ((bmi < 18.5) && (bmi > 3.2)) {bmiInterp=t("underweight")};
        if ((bmi >= 18.5) && (bmi < 25)) {bmiInterp=t("normal weight")};
        if ((bmi >= 25.0) && (bmi < 30)) {bmiInterp=t("overweight")};
        if ((bmi > 30) && (bmi < 55)) {bmiInterp=t("obese")};
        if ((bmi <= 3.2) || (bmi > 55)) {bmiInterp=t("??")};

        newrow("bold:span5:l:BMI="+adjustedBMI+ ",  "+bmiInterp);
        newrow("bold:span5:l:Body Surface Area(BSA)="+adjustedBSA+ " square meters");
        }
        //if (sex=="m")
       // {newrow("bold:span5:c:No sex specified.  Assumed to be male.")}
	     //Tell output that we are done
		endtable();
	} //end with(cmdObj)
 }

function BSA(KILOS, CM)
{
 return (Math.pow((CM * KILOS)/3600, 0.5)).toFixed(2);
}

function BMI(KILOS, CM)
{
     var crudeBMI=(KILOS* 10000) / (CM * CM );
     return crudeBMI.toFixed(2);
}

function resultStr(LMSArray, numValue)
{
if (typeof(LMSArray) != "undefined")
{
  var L=LMSArray[0]
  var M=LMSArray[1]
  var S=LMSArray[2]

  var ZScore=0;

  if (L != 0)
   {
     ZScore =  (Math.pow((numValue/M),L) - 1 ) / (L*S)
   }
  else
  {
     ZScore = Math.log(numValue/M)/S; //This is the log to the base e function, despite the notation
  }
  return ZScore;
}
else
{
  return 997;
}
}

/*
function PCTILEFROMZ(Z)
{
  // function pnorm(z,upper)
   //{
    // Algorithm AS66 Applied Statistics (1973) vol22 no.3
    // Computes P(Z<z)
	var upper=false;
	//When z=1.96, the values returned are .975 (upper=false) or .025(upper=true) (roughly).
    var z=parseFloat(Z); //note upper case Z converted to lower.
   // upper=(form.upper[0].checked ? true:false);
    //upper must be set to true or false when the function is called
    ltone=7.0;
    utzero=18.66;
    con=1.28;
    a1 = 0.398942280444;
    a2 = 0.399903438504;
    a3 = 5.75885480458;
    a4 =29.8213557808;
    a5 = 2.62433121679;
    a6 =48.6959930692;
    a7 = 5.92885724438;
    b1 =0.398942280385;
    b2 =3.8052e-8;
    b3 =1.00000615302;
    b4 =3.98064794e-4;
    b5 =1.986153813664;
    b6 =0.151679116635;
    b7 =5.29330324926;
    b8 =4.8385912808;
    b9 =15.1508972451;
    b10=0.742380924027;
    b11=30.789933034;
    b12=3.99019417011;

    if(z<0) {
      upper=!upper;
      z=-z;
    }
    if(z<=ltone || upper && z<=utzero) {
      y=0.5*z*z;
      if(z>con) {
        alnorm=b1*Math.exp(-y)/(z-b2+b3/(z+b4+b5/(z-b6+b7/(z+b8-b9/(z+b10+b11/(z+b12))))));
      }
      else {
        alnorm=0.5-z*(a1-a2*y/(y+a3-a4/(y+a5+a6/(y+a7))));
      }
    }
    else {
      alnorm=0;
    }
    if(!upper) alnorm=1-alnorm;
    return(alnorm*100);
    }
//End of P from Z function

*/