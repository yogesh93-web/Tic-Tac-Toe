const ultimateBoard = document.getElementById("ultimate-board");
const resetBtn = document.getElementById("reset-btn");

let boards = []; // 9 small boards
let currentPlayer = "X"; // Player always X
let overallWinner = null;

// Build the 9 boards
function createBoards() {
  ultimateBoard.innerHTML = "";
  boards = [];

  for (let i = 0; i < 9; i++) {
    let board = document.createElement("div");
    board.classList.add("small-board");

    let cells = [];
    for (let j = 0; j < 9; j++) {
      let cell = document.createElement("div");
      cell.classList.add("cell");
      cell.addEventListener("click", () => makeMove(i, j));
      board.appendChild(cell);
      cells.push(cell);
    }
    boards.push({ element: board, cells, winner: null });
    ultimateBoard.appendChild(board);
  }
}

// Check winner in 3x3 board
function checkWinner(cells) {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let [a, b, c] of wins) {
    if (
      cells[a].textContent &&
      cells[a].textContent === cells[b].textContent &&
      cells[a].textContent === cells[c].textContent
    ) {
      return cells[a].textContent;
    }
  }
  return null;
}

// Handle player move
function makeMove(boardIndex, cellIndex) {
  let board = boards[boardIndex];
  if (board.winner || overallWinner) return;

  let cell = board.cells[cellIndex];
  if (cell.textContent) return;

  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  let winner = checkWinner(board.cells);
  if (winner) {
    board.winner = winner;
    board.element.classList.add("won-board");
  }

  overallWinner = checkWinner(boards.map(b => {
    let fake = { textContent: b.winner };
    return fake;
  }));

  if (overallWinner) {
    setTimeout(() => alert(`${overallWinner} wins the game!`), 100);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (currentPlayer === "O") {
    setTimeout(aiMove, 300);
  }
}

// Very simple AI (picks first empty cell, can upgrade to minimax)
function aiMove() {
  for (let i = 0; i < 9; i++) {
    if (boards[i].winner) continue;
    for (let j = 0; j < 9; j++) {
      if (!boards[i].cells[j].textContent) {
        makeMove(i, j);
        return;
      }
    }
  }
}

resetBtn.addEventListener("click", () => {
  currentPlayer = "X";
  overallWinner = null;
  createBoards();
});

createBoards();
