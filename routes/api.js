"use strict";

const expect = require("chai").expect;
const ConvertHandler = require("../controllers/convertHandler.js");

module.exports = function (app) {
  let convertHandler = new ConvertHandler();

  app.route("/api/convert").get((req, res) => {
    const input = req.query.input,
      initNum = convertHandler.getNum(input),
      initUnit = convertHandler.getUnit(input),
      returnNum = convertHandler.convert(initNum, initUnit),
      returnUnit = convertHandler.getReturnUnit(initUnit);

    if (!returnUnit && !initNum) {
      res.send("invalid number and unit");
    } else if (!returnUnit) {
      res.send("invalid unit");
    } else if (!initNum) {
      res.send("invalid number");
    } else {
      res.json({
        initNum: initNum,
        initUnit: initUnit,
        returnNum: +returnNum.toFixed(5),
        returnUnit: returnUnit,
        string: convertHandler.getString(
          initNum,
          initUnit,
          returnNum,
          returnUnit,
        ),
      });
    }
  });
};
