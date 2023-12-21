function ConvertHandler() {
  const numRegex = /[.\d\/]+/g;
  const strRegex = /[a-zA-Z]+/g;
  const galToL = 3.78541;
  const lbsToKg = 0.453592;
  const miToKm = 1.60934;

  const units = {
    gal: { opposite: "L", spelledOut: "gallons", convert: (n) => n * galToL },
    L: { opposite: "gal", spelledOut: "liters", convert: (n) => n / galToL },
    lbs: { opposite: "kg", spelledOut: "pounds", convert: (n) => n * lbsToKg },
    kg: {
      opposite: "lbs",
      spelledOut: "kilograms",
      convert: (n) => n / lbsToKg,
    },
    mi: { opposite: "km", spelledOut: "miles", convert: (n) => n * miToKm },
    km: {
      opposite: "mi",
      spelledOut: "kilometers",
      convert: (n) => n / miToKm,
    },
  };

  function numStringSplitter(input) {
    let str, num;
    // Str is a must, so match it first
    if (input.match(strRegex)) {
      num = input.match(numRegex) ? input.match(numRegex)[0] : 1;
      str = input.match(strRegex)[0];
    }

    // Only upper the l and lower others but L
    if (str) {
      if (str === "l") {
        str = str.toUpperCase();
      } else if (str !== "L") {
        str = str.toLowerCase();
      }
    }
    
    return [num, str];
  }

  this.getNum = (input) => {
    let num;

    // False if more than 2 dividers
    if (input.split("/").length > 2) {
      num = null;
    } else if (input.match(strRegex)) {
      // If word regex is true

      num = numStringSplitter(input)[0];

      // If num not exists, give value 1
      if (num === undefined) {
        num = 1;
      } else {
        // If num exists, do math
        num = String(num).includes("/") ? eval(num) : parseFloat(num);
      }
    }

    return num;
  };

  this.getUnit = (input) => {
    let result;
    
    if (numStringSplitter(input)[1] in units) {
      result = numStringSplitter(input)[1];
    }
    
    return result;
  };

  this.getReturnUnit = (initUnit) => {
    let result;
    if (initUnit in units) {
      result = units[initUnit].opposite;
    }
    
    return result;
  };

  this.spellOutUnit = (unit) => {
    let result;
    if (unit in units) {
      result = units[unit].spelledOut;
    }
    return result;
  };

  this.convert = (initNum, initUnit) => {
    let result;
    if (initUnit in units) {
      result = units[initUnit].convert(initNum);
    }

    return result;
  };

  this.getString = (initNum, initUnit, returnNum, returnUnit) => {
    let result;
    result = `${initNum} ${this.spellOutUnit(
      initUnit,
    )} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
    return result;
  };
}

module.exports = ConvertHandler;
