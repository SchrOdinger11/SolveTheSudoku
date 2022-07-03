"use strict";


// Set this variable to true to publicly expose otherwise private functions inside of SudokuSolver
var TESTABLE = true;

var Solver = function (testable) {
  var solver;

  // PUBLIC FUNCTIONS
  function solve(boardinstring) {
    var boardinarray = boardinstring.split("");
    if (!boardIsValid(boardinarray)) {
      return false;
    }
    return recursiveSolve(boardinstring);
  }

  function solveAndPrint(boardString) {
    var solvedBoard = solve(boardString);
    console.log(toString(solvedBoard.split("")));
    return solvedBoard;
  }

  // PRIVATE FUNCTIONS
  function recursiveSolve(boardString) {
    var boardArray = boardString.split("");
    if (boardIsSolved(boardArray)) {
      return boardArray.join("");
    }
    var cellPossibilities = getNextCellAndPossibilities(boardArray);
    var nextUnsolvedCellIndex = cellPossibilities.index;
    var possibilities = cellPossibilities.choices;
    for (var i = 0; i < possibilities.length; i++) {
      boardArray[nextUnsolvedCellIndex] = possibilities[i];
      var solvedBoard = recursiveSolve(boardArray.join(""));
      if (solvedBoard) {
        return solvedBoard;
      }
    }
    return false;
  }

 

  function boardIsValid(boardArray) {
    return allRowsValid(boardArray) && allColumnsValid(boardArray) && allBoxesValid(boardArray);
  }

  function boardIsSolved(boardArray) {
    for (var i = 0; i < boardArray.length; i++) {
      if (boardArray[i] === "-") {
        return false;
      }
    }
    return true;
  }

  function getNextCellAndPossibilities(boardArray) {
    for (var i = 0; i < boardArray.length; i++) {
      if (boardArray[i] === "-") {
        var existingValues = getAllIntersections(boardArray, i);
        var choices = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].filter(function (num) {
          return existingValues.indexOf(num) < 0;
        });
        return { index: i, choices: choices };
      }
    }
  }

  function getAllIntersections(boardArray, i) {
    return getRow(boardArray, i).concat(getColumn(boardArray, i)).concat(getBox(boardArray, i));
  }


  //0,9,18...are the starting indices of each row
  function allRowsValid(boardinarray) {
    return [0, 9, 18, 27, 36, 45, 54, 63, 72].map(function (i) {
      return getRow(boardinarray, i);
    }).reduce(function (validity, row) {
      return isValid(row) && validity;
    }, true);
  }

  //get elements from start to start+9
  function getRow(boardinarray, i) {
    
    return boardinarray.slice(i,i+ 9);
  }

  function allColumnsValid(boardinarray) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (i) {
      return getColumn(boardinarray, i);
    }).reduce(function (validity, row) {
      return isValid(row) && validity;
    }, true);
  }

  function getColumn(boardinarray, i) {
    
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (num) {
      return boardinarray[i + num * 9];
    });
  }

  function allBoxesValid(boardinarray) {
    return [0, 3, 6, 27, 30, 33, 54, 57, 60].map(function (i) {
      return getBox(boardinarray, i);
    }).reduce(function (validity, row) {
      return isValid(row) && validity;
    }, true);
  }

  function getBox(boardArray, i) {
    var boxCol = Math.floor(i / 3) % 3;
    var boxRow = Math.floor(i / 27);
    var startingIndex = boxCol * 3 + boxRow * 27;
    return [0, 1, 2, 9, 10, 11, 18, 19, 20].map(function (num) {
      return boardArray[startingIndex + num];
    });
  } 


  //check duplicacy of the numbers in a row.
  function isValid(arr) {
    var countnum = {};
    for(var i = 0; i < arr.length; i++) {
      if (arr[i] != "-") {
        if (countnum [arr[i]] === undefined) {
            countnum [arr[i]] = 1;
        } else {
          return false;
        }
      }
    }
    return true;
  }

  function toString(boardArray) {
    return [0, 9, 18, 27, 36, 45, 54, 63, 72].map(function (i) {
      return getRow(boardArray, i).join(" ");
    }).join("\n");
  }

  if (testable) {
    // These methods will be exposed publicly when testing is on.
    solver = { 
      solve: solve,
      solveAndPrint: solveAndPrint,
      recursiveSolve: recursiveSolve,
     
      boardIsValid: boardIsValid,
      boardIsSolved: boardIsSolved,
      getNextCellAndPossibilities: getNextCellAndPossibilities,
      getAllIntersections: getAllIntersections,
      allRowsValid: allRowsValid,
      getRow: getRow,
      allColumnsValid: allColumnsValid,
      getColumn: getColumn,
      allBoxesValid: allBoxesValid,
      getBox: getBox,
      isValid: isValid,
      toString: toString };
  } else {
    // These will be the only public methods when testing is off.
    solver = { solve: solve,
      solveAndPrint: solveAndPrint };
  }

  return solver;
}(TESTABLE);