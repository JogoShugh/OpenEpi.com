var module = require("../CIMedian.js");

describe("CIMedian Module", function() {
    it("Calculates lower limit, rank, and upper limit for 100, 50, 95", function () {
        var input = [{}, { "E0D0": 100, "E1D0": 50, "E2D0": 95 }];
        var median = new module.CalcCIMedian(input, null);
		median.Execute();
		expect(median.ResultData.lowerLimit).toBe(40);
		expect(median.ResultData.rank).toBe(50.5);
		expect(median.ResultData.upperLimit).toBe(61);
        //console.log("Result Data Dump: %j", median.ResultData);
    });

    it("Calculates lower limit, rank, and upper limit for 100, 70, 95", function () {
        var input = [{}, { "E0D0": 100, "E1D0": 70, "E2D0": 95 }];
        var median = new module.CalcCIMedian(input, null);
        median.Execute();
        expect(median.ResultData.lowerLimit).toBe(61);
        expect(median.ResultData.rank).toBe(70);
        expect(median.ResultData.upperLimit).toBe(80);
        //console.log("Result Data Dump: %j", median.ResultData);
    });
});