function BaseClass() {
    this.SetFailureMessage = function (message) {
        this.FailureMessage = message;
    }

    this.SetResultData = function (resultData) {
        this.ResultData = resultData;
    }
}

function CalcCIMedian(data, outputCollector) {
    this.Data = data;
    this.OutputCollector = outputCollector;
}

CalcCIMedian.prototype = new BaseClass();

CalcCIMedian.Title = "Confidence Interval of median or other percentile for a sample size";

CalcCIMedian.Authors = "<b>Statistics</b><br>Minn M. Soe and Kevin M. Sullivan, Emory University<br>" +
"<br>" +
"<b>Interface</b><br>" +
"Andrew G. Dean, EpiInformatics.com, " +
"<br>and Roger A. Mir<br> ";

CalcCIMedian.Description =
"This module calculates confidence interval around a selected percentile for " +
"a sample size given. Entering sample size and desired percentile will calculate " +
"95% confidence interval as a default confidence limit. The user can change the " +
"confidence interval by typing in new value. Please note that the selected percentile " +
"should be within 1-100%";

//The text in the next variables will be inserted into the HTML document that comes up in response to the Exercise link
CalcCIMedian.Demo = "For non-Normal distribution, the median of the sample or population is preferable to the mean as a measure of location (Rank). Medians are also appropriate in other situations-for example, when measurements are on an ordinal scale. In a dataset of 100 diabetic patients, let's assume the median systolic blood pressure is 146 mmHg. Using this module, let's calculate 95% confidence interval of median value in the sample." +
        "<ul>" +
        "<li>First, enter the sample size (eg. 100), median value (eg. 50), and 95% confidence interval (eg. 95) in respective cells in Open Epi Median program, and click on Calculate. </li>" +
        "<li>In the new window screen, 95% confidence limits of Median position in the sample are seen as 40 - 61. This result is calculated from the normal approximation method of large sample size theory. </li>" +
        "<li>Then, after arranging observations (here, the systolic blood pressure) in increasing order, read the corresponding values of systolic blood pressure at 40th and 61th position. They are 95% confidence interval of median systolic blood pressure of the sample. </li>" +
        "</ul>";

CalcCIMedian.Exercises = "currently not available";

CalcCIMedian.prototype.Execute = function () {
    var n = parseFloat(this.Data[1].E0D0);
    if (n <= 0) {
        this.SetFailureMessage("Sample size must be >0");
        return false;
    }

    var median = parseFloat(this.Data[1].E1D0);
    if (median <= 0 || median > 100) {
        this.SetFailureMessage("Percentile value must be within the limits of 1-100%");
        return false;
    }

    var cscrit = 0; var pt = 0; var z = 0;
    var pt = this.Data[1].E2D0;

    if (pt == 99.99) cscrit = 15.137
    if (pt == 99.98) cscrit = 13.831
    if (pt == 99.95) cscrit = 12.116
    if (pt == 99.9) cscrit = 10.828
    if (pt == 99.8) cscrit = 9.550
    if (pt == 99.5) cscrit = 7.879
    if (pt == 99) cscrit = 6.635
    if (pt == 98) cscrit = 5.412
    if (pt == 95) cscrit = 3.841
    if (pt == 90) cscrit = 2.706
    if (pt == 85) cscrit = 2.072
    if (pt == 80) cscrit = 1.642
    if (pt == 75) cscrit = 1.323
    if (pt == 70) cscrit = 1.074
    if (pt == 65) cscrit = 0.873
    if (pt == 60) cscrit = 0.708
    if (pt == 55) cscrit = 0.571
    if (pt == 50) cscrit = 0.455
    if (pt == 45) cscrit = 0.357
    if (pt == 40) cscrit = 0.275
    if (pt == 35) cscrit = 0.206
    if (pt == 30) cscrit = 0.148
    if (pt == 25) cscrit = 0.102
    if (pt == 20) cscrit = 0.064;

    else if (pt != 20 && pt != 25 && pt != 30 && pt != 35 && pt != 40 && pt != 45 && pt != 50 && pt != 55 && pt != 60 && pt != 65 && pt != 70 && pt != 75
	&& pt != 80 && pt != 85 && pt != 90 && pt != 95 && pt != 98 && pt != 99 && pt != 99.5 && pt != 99.8 && pt != 99.9 && pt != 99.95 && pt != 99.98 && pt != 99.99) {
        this.SetFailureMessage("The selected confidence interval is not available, choose other ranges");
        return false
    };
    z = Math.sqrt(cscrit);

    //rank calculation;
    var np = 0; var p = 0;
    var p = median / 100;
    if (p == 0.5) var np = (n + 1) / 2; else var np = Math.round(n * p);

    //confidence limits and checking errors;
    var ll = Math.round(n * p - z * (Math.sqrt(n * p * (1 - p)))); if (ll <= 0) var ll = 0;
    var ul = Math.round(1 + n * p + z * (Math.sqrt(n * p * (1 - p)))); if (ul <= 0) var ul = 0;
    if (ul >= n) var ul = n;

    //-------------------------------------------------------------------------------------------------;
    var currentObject = this;
    var resultData = {
        tableDefinition: [6, 90],
        title: CalcCIMedian.Title,
        n: n,
        median: median,
        pt: pt,
        confidenceIntervalCategory: this.Data[1]["E1D0"],
        sampleSize: this.Data[1]["E0D0"],
        lowerLimit : ll,
        rank: np,
        upperLimit : ul,
        tableGenerationFunc: function () {
            if (currentObject.OutputCollector != null) {
                with (currentObject.OutputCollector) {
                    newtable(6, 90);	 //6 columns and 90 pixels per column
                    title("<h3>" + CalcCIMedian.Title + "</h3>");
                    newrow("", "", "span2:c:bold:Input Data");
                    newrow();
                    newrow("", "color#66ffff:span2:r:Sample Size:", "color#ffff99:span1:r:" + n);
                    newrow("", "color#66ffff:span2:r:Desired percentile:", "color#ffff99:span1:r:" + median);
                    newrow("", "color#66ffff:span2:r:Confidence Interval (%):", "color#ffff99:span1:r:" + pt);
                    newrow();
                    line(6); 	//line with 6 columns size

                    //tableAsHTML(0);   //Reproduce the input table in the output *************************************;

                    newtable(6, 90);
                    title("<h4>Confidence Interval for " + currentObject.Data[1]["E1D0"] + "<SUP>th</SUP>" + " percentile of " + "sample size " + currentObject.Data[1]["E0D0"] + "</h4>");
                    newrow("span2:bold:c:Method:", "span1:bold:c:Lower Limit", "span1:bold:r:  Rank", "span2:c:bold:Upper Limit");
                    newrow("span2:c:Normal Approximation", "span1:c:" + fmtSigFig(ll, 6), "span1:r:" + fmtSigFig(np, 6), "span2:c:" + fmtSigFig(ul, 6)); //6 means 6 digits including decimals;

                    line(6);
                    endtable();
                }
            }
        }
    };

    this.SetResultData(resultData);

    return true;
}

try {
    module.exports.CalcCIMedian = CalcCIMedian;
}
catch (ex) {
}