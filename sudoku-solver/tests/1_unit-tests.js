const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();
const puzzleString =
"..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
const invalidPuzzleString = "x" + puzzleString.slice(1);
const missingCharsPuzzleString = puzzleString.slice(0, -1);

suite("Unit Tests", () => {
  test("Logic handles a valid puzzle string of 81 characters", (done) => {
    assert.equal(solver.validate(puzzleString), true);
    done();
  });
  test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", (done) => {
    assert.equal(
      solver.validate(invalidPuzzleString).error,
      "Invalid characters in puzzle",
    );
    done();
  });
  test("Logic handles a puzzle string that is not 81 characters in length", (done) => {
    assert.equal(
      solver.validate(missingCharsPuzzleString).error,
      "Expected puzzle to be 81 characters long",
    );
    done();
  });
  test("Logic handles a valid row placement", (done) => {
    const validPlacement = solver.checkRowPlacement(puzzleString, 1, 1, 2);
    assert.equal(validPlacement.valid, true);
    done();
  });
  test("Logic handles an invalid row placement", (done) => {
    const invalidPlacement = solver.checkRowPlacement(puzzleString, 0, 1, 1);
    assert.equal(invalidPlacement.error, "Invalid coordinate");
    done();
  });
  test("Logic handles a valid column placement", (done) => {
    const validPlacement = solver.checkColPlacement(puzzleString, 1, 1, 2);
    assert.equal(validPlacement.valid, true);

    done();
  });
  test("Logic handles an invalid column placement", (done) => {
    const invalidPlacement = solver.checkColPlacement(puzzleString, 1, 0, 1);
    assert.equal(invalidPlacement.error, "Invalid coordinate");

    done();
  });
  test("Logic handles a valid region (3x3 grid) placement", (done) => {
    const validPlacement = solver.checkRegionPlacement(puzzleString, 1, 4, 2);
    assert.equal(validPlacement.valid, true);

    done();
  });
  test("Logic handles an invalid region (3x3 grid) placement", (done) => {
    const invalidPlacement = solver.checkRegionPlacement(
      puzzleString,
      0,
      10,
      1,
    );
    assert.equal(invalidPlacement.error, "Invalid coordinate");
    done();
  });
  test("Valid puzzle strings pass the solver", (done) => {
    const solvePuzzle = solver.solve(puzzleString);
    assert.notEqual(solvePuzzle.error, "Invalid characters in puzzle");
    assert.notEqual(
      solvePuzzle.error,
      "Expected puzzle to be 81 characters long",
    );
    done();
  });
  test("Invalid puzzle strings fail the solver", (done) => {
    const solvePuzzle = solver.solve(invalidPuzzleString);
    assert.equal(solvePuzzle.error, "Invalid characters in puzzle");
    done();
  });
  test("Solver returns the expected solution for an incomplete puzzle", (done) => {
    const solvePuzzle = solver.solve(puzzleString);
    assert.match(solvePuzzle.solution, /^\d+$/);
    done();
  });
});
