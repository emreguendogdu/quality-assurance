class SudokuSolver {
  validate(puzzleString) {
    if (!puzzleString) {
      return { error: "Required field missing" };
    } else if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    } else if (puzzleString.match(/[^\.\d]/g)) {
      // Invalid characters = not 1-9 or .
      return { error: "Invalid characters in puzzle" };
    }
    return true;
  }

  validateValues(row, column, value) {
    const singleDigitRegex = /^\d$/;
    if (!singleDigitRegex.test(value)) {
      return { error: "Invalid value" };
    } else if (value < 1 || value > 9) {
      return { error: "Invalid value" };
    } else if (!singleDigitRegex.test(row) || !singleDigitRegex.test(column)) {
      return { error: "Invalid coordinate" };
    } else if (row < 1 || row > 9 || column < 1 || column > 9) {
      return { error: "Invalid coordinate" };
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const validateVals = this.validateValues(row, column, value);
    const validatePuzzle = this.validate(puzzleString);
    if (validatePuzzle !== true) {
      return validatePuzzle;
    }
    if (validateVals !== true) {
      return validateVals;
    }

    row -= 1;
    column -= 1;

    const rowStart = row * 9;
    const rowEnd = rowStart + 9;
    const selectedRow = puzzleString.slice(rowStart, rowEnd);

    // if all row doesn't has that number
    if (selectedRow.indexOf(value) === -1) {
      return { valid: true };
    } else if (selectedRow[column] === value) {
      // if column & row pair is the given number
      return { valid: true };
    } else {
      return false;
    }
  }

  checkColPlacement(puzzleString, row, column, value) {
    const validateVals = this.validateValues(row, column, value);
    const validatePuzzle = this.validate(puzzleString);
    if (validatePuzzle !== true) {
      return validatePuzzle;
    }
    if (validateVals !== true) {
      return validateVals;
    }

    // COL 1: 1st value of each ROW
    let selectedCol = "";

    // To increment start to 1
    column -= 1;
    row -= 1;

    for (let i = 0; i < 9; i++) {
      let num = i * 9 + column;

      selectedCol += puzzleString[num];
    }
    if (selectedCol.indexOf(value) === -1) {
      return { valid: true };
    } else if (selectedCol[row] === value) {
      return { valid: true };
    } else {
      return false;
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const validateVals = this.validateValues(row, column, value);
    const validatePuzzle = this.validate(puzzleString);
    if (validatePuzzle !== true) {
      return validatePuzzle;
    }
    if (validateVals !== true) {
      return validateVals;
    }

    column -= 1;
    row -= 1;
    // Row & column numbers must be 0 or multiply 3 to return to the beginning of its region, as we count 2 rows or columns from there. (e.g 0-1-2, 3-4-5, 6-7-8)
    const row0 = row % 3,
      col0 = column % 3,
      threeMultiplesRow = row - row0,
      threeMultiplesCol = column - col0;

    let selectedRegion = "";

    // i = region start row
    for (let i = threeMultiplesRow; i < threeMultiplesRow + 3; i++) {
      // multiply by 9 to take all 3 rows, add column num if exists to move right on the table
      let num = i * 9 + threeMultiplesCol;

      for (let j = 0; j < 3; j++) {
        selectedRegion += puzzleString[num];
        // i returns once, then j returns 3 times inside. So add num, num+1, num+2 to array, return back to i loop, repeat. We increment num after first push because first coming num will be our starting point, we'll increment from there. (0-1-2 instead of 1-2-3)
        num += 1;
      }
    }
    const coordinate = selectedRegion[row0 * 3 + col0];
    if (selectedRegion.indexOf(value) === -1) {
      return { valid: true };
    } else if (coordinate === value) {
      return { valid: true };
    } else {
      return false;
    }
  }

  solve(puzzleString) {
    const validatePuzzle = this.validate(puzzleString);
    if (validatePuzzle !== true) {
      return validatePuzzle;
    }

    const size = 9;

    function isSafe(board, row, col, num) {
      // Check if the number is not present in the current row and column
      for (let i = 0; i < size; i++) {
        if (board[row][i] === num || board[i][col] === num) {
          return false; // num exists in row or col
        }
      }

      // Check if the number is not present in the 3x3 subgrid
      const startRow = row - (row % 3);
      const startCol = col - (col % 3);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i + startRow][j + startCol] === num) {
            return false;
          }
        }
      }

      return true;
    }

    function findEmptyLocation(board) {
      // Find the first empty cell in the board
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (board[i][j] === 0) {
            return { row: i, col: j };
          }
        }
      }
      return null; // No empty cell found
    }

    function sudokuSolver(board) {
      // Find an empty location
      const emptyLocation = findEmptyLocation(board);

      // If no empty cell is found, the Sudoku is solved
      if (emptyLocation === null) {
        return true;
      }

      // Destructure the result
      const { row, col } = emptyLocation;

      // Try placing numbers 1 to 9 in the empty cell
      for (let num = 1; num <= size; num++) {
        if (isSafe(board, row, col, num)) {
          // Place the number if it's valid
          board[row][col] = num;

          // Recursively try to solve the rest of the Sudoku
          if (sudokuSolver(board)) {
            return true;
          }

          // If placing the current number doesn't lead to a solution, backtrack
          board[row][col] = 0;
        }
      }

      // If no number can be placed, backtrack
      return false;
    }

    // Convert the puzzle string to a 2D array
    const puzzleArray = puzzleString
      .split("")
      .map((char) => (char === "." ? 0 : parseInt(char)));
    const sudokuBoard = [];
    for (let i = 0; i < size; i++) {
      sudokuBoard.push(puzzleArray.slice(i * size, (i + 1) * size));
    }

    // Solve the Sudoku
    if (sudokuSolver(sudokuBoard)) {
      // Convert the solved board back to a string
      const solvedPuzzle = sudokuBoard.map((row) => row.join("")).join("");
      return { solution: solvedPuzzle };
    } else {
      return { error: "Puzzle cannot be solved" };
    }
  }
}

module.exports = SudokuSolver;
