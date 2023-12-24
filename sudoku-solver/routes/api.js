"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    if (!req.body.coordinate || !req.body.value || !req.body.puzzle ) {
      return res.json({ error: 'Required field(s) missing' })
    } else if (req.body.coordinate.length !== 2) {
      return res.json({error: "Invalid coordinate" })
    }
    
    const rowLetter = req.body.coordinate[0],
      colNum = req.body.coordinate[1],
      puzzle = req.body.puzzle,
      value = req.body.value;

    function convertRowLettersToNum(letter) {
      letter = letter.toLowerCase();
      return letter.replace(/[a-i]/g, (match) => match.charCodeAt(0) - 96);
    }

    const rowNum = convertRowLettersToNum(rowLetter);

    if (solver.validate(puzzle) !== true) {
      return res.json(solver.validate(puzzle))
    } else if (solver.validateValues(rowNum, colNum, value) !== true) {
      return res.json(solver.validateValues(rowNum, colNum, value))
    }

    
    
    const checkRow = solver.checkRowPlacement(
        puzzle,
        rowNum,
        colNum,
        value,
      ),
      checkCol = solver.checkColPlacement(puzzle, rowNum, colNum, value),
      checkRegion = solver.checkRegionPlacement(
        puzzle,
        rowNum,
        colNum,
        value,
      );
    const conflicts = [];

    if (checkRow.valid && checkCol.valid && checkRegion.valid) {
      return res.json({ valid: true })
    }

    if (!checkRow) {
      conflicts.push("row")
    }
    if (!checkCol) {
      conflicts.push("column")
    }
    if (!checkRegion) {
      conflicts.push("region")
    }

    return res.json({valid: false, conflict: conflicts })
  });

  app.route("/api/solve").post((req, res) => {
    const puzzle = req.body.puzzle;

    if (solver.validate(puzzle).error) {
      return res.json(solver.validate(puzzle));
    } 
    
    const solvedPuzzle = solver.solve(puzzle);
    res.json(solvedPuzzle);
  });
};
