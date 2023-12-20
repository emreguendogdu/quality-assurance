const chai = require("chai");
let assert = chai.assert;
const ConvertHandler = require("../controllers/convertHandler.js");


let convertHandler = new ConvertHandler();

suite("Unit Tests", function () {
  suite("Function convertHandler.getNum(input)", function () {
    test("Whole number input", (done) => {
      let input = "19L";
      assert.equal(convertHandler.getNum(input), 19);
      done();
    });
    test("Decimal number input", (done) => {
      let input = "1.9L";
      assert.equal(convertHandler.getNum(input), 1.9);
      done();
    });
    test("Fractional number input", (done) => {
      let input = "1/1L";
      assert.equal(convertHandler.getNum(input), 1 / 1);
      done();
    });
    test("Fractional number with a decimal input", (done) => {
      let input = "1/9L";
      assert.equal(convertHandler.getNum(input), 0.1111111111111111);
      done();
    });
    test("Invalid input (double fraction)", (done) => {
      let input = "1/9/1L";
      assert.equal(convertHandler.getNum(input), null);
      done();
    });
    test("No numerical input", (done) => {
      let input = "L";
      assert.equal(convertHandler.getNum(input), 1);
      done();
    });
    test("Read valid input unit", (done) => {
      let input = ["mi","kg","L","km","lbs","gal"]
      for(let i = 0; i < input.length; i++){
        assert.equal(convertHandler.getUnit(input[i]), input[i])
      }
      done();
    });
    test("Invalid input unit", (done) => {
      let input = "19gr";
      assert.equal(convertHandler.getUnit(input), null);
      done();
    });
    test("Return valid input unit", (done) => {
      let input = "19mi";
      assert.equal(convertHandler.getUnit(input), "mi");
      done();
    });
    test("Valid spelled out unit", (done) => {
      let input = "mi";
      assert.equal(convertHandler.spellOutUnit(input), "miles");
      done();
    });
    test("Convert gal to L", (done) => {
      let input = "gal";
      assert.equal(
        convertHandler.convert(
          convertHandler.getNum(input),
          convertHandler.getUnit(input),
        ),
        3.78541,
      );
      done();
    });
    test("Convert L to gal", (done) => {
      let input = "L";
      assert.equal(
        convertHandler.convert(
          convertHandler.getNum(input),
          convertHandler.getUnit(input),
        ),
        1 / 3.78541,
      );
      done();
    });
    test("Convert lbs to kg", (done) => {
      let input = "lbs";
      assert.equal(
        convertHandler.convert(
          convertHandler.getNum(input),
          convertHandler.getUnit(input),
        ),
        0.453592,
      );
      done();
    });
    test("Convert kg to lbs", (done) => {
      let input = "kg";
      assert.equal(
        convertHandler.convert(
          convertHandler.getNum(input),
          convertHandler.getUnit(input),
        ),
        1 / 0.453592,
      );
      done();
    });
    test("Convert mi to km", (done) => {
      let input = "mi";
      assert.equal(
        convertHandler.convert(
          convertHandler.getNum(input),
          convertHandler.getUnit(input),
        ),
        1.60934,
      );
      done();
    });
    test("Convert km to mi", (done) => {
      let input = "km";
      assert.equal(
        convertHandler.convert(
          convertHandler.getNum(input),
          convertHandler.getUnit(input),
        ),
        1 / 1.60934,
      );
      done();
    });
  });
});
