import React, { useState } from 'react';

interface SlidingTicTacToeProps {
  n?: number; // grid size, default 3
}

const SlidingTicTacToe = ({ n = 4 }: SlidingTicTacToeProps) => {
  const [squares, setSquares] = useState(Array(n * n).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);

  const currentPlayer = xIsNext ? 'X' : 'O';
  const winner = calculateWinner(squares, n);
  const playerPieces = squares.filter(s => s === currentPlayer).length;
  const isSlidingPhase = playerPieces === n;

  // Generalized function to get adjacent indices for an n*n grid
  function getAdjacents(index: number) {
    //    0   1   2   3
    // 0 [0,  1,  2,  3], 
    // 1 [4,  5,  6,  7], 
    // 2 [8,  9,  10, 11], 
    // 3 [12, 13, 14, 15]
    const row = Math.floor(index / n);
    const col = index % n;
    const adj = [];
    // 8 directions: up, down, left, right, and diagonals
    // const directions = [
    //   [-1, 0], // up
    //   [1, 0],  // down
    //   [0, -1], // left
    //   [0, 1],  // right
    //   [-1, -1], // up-left
    //   [-1, 1],  // up-right
    //   [1, -1],  // down-left
    //   [1, 1],   // down-right
    // ];
    // const adj = [];
    // for (const [dr, dc] of directions) {
    //   const newRow = row + dr;
    //   const newCol = col + dc;
    //   if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n) {
    //     adj.push(newRow * n + newCol);
    //   }
    // }
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const newRow = row + dr;
        const newCol = col + dc;
        if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n) {
          adj.push(newRow * n + newCol);
        }
      }
    }
    return adj;
  }

  const handleClick = (i: any) => {
    if (winner) return;
    const newSquares = [...squares];

    // PHASE 1: PLACEMENT (Place until you have 3 pieces)
    if (!isSlidingPhase) {
      if (squares[i]) return; 
      newSquares[i] = currentPlayer;
      setSquares(newSquares);
      setXIsNext(!xIsNext);
      return;
    }

    // PHASE 2: SLIDING (Move an existing piece)
    if (selectedSquare === null) {
      if (squares[i] === currentPlayer) setSelectedSquare(i);
    } else {
      if (i === selectedSquare) {
        setSelectedSquare(null); // Deselect if clicked again
      } else if (!squares[i] && getAdjacents(selectedSquare).includes(i)) {
        newSquares[selectedSquare] = null;
        newSquares[i] = currentPlayer;
        setSquares(newSquares);
        setSelectedSquare(null);
        setXIsNext(!xIsNext);
      }
    }
  };

  const status = winner 
    ? `🎉 Winner: ${winner}` 
    : `Next: ${currentPlayer} ${isSlidingPhase ? '(Slide!)' : '(Place)'}`;

  return (
    <div className='flex flex-col items-center gap-6'>
      <div>
        <h3 className='text-xl font-bold text-blue-600 dark:text-blue-400 mb-2'>Sliding Tic Tac Toe (4x4)</h3>
        <div className='text-lg font-semibold text-gray-800 dark:text-gray-200'>{status}</div>
      </div>
      <div 
        className='grid gap-1 bg-gray-300 dark:bg-gray-600 p-2 rounded-lg'
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      >
        {squares.map((square, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`w-20 h-20 font-bold text-2xl rounded transition-all duration-200 flex items-center justify-center border-2 ${
              selectedSquare === i
                ? 'bg-blue-400 dark:bg-blue-600 border-blue-600 dark:border-blue-400'
                : 'bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            style={{
              color: square === "X" ? "#ef4444" : square === "O" ? "#3b82f6" : "transparent",
            }}
          >
            {square}
          </button>
        ))}
      </div>
      <button 
        onClick={() => window.location.reload()}
        className='px-6 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg font-medium hover:bg-red-700 dark:hover:bg-red-600 transition-colors duration-200'
      >
        Reset Game
      </button>
    </div>
  );
};

// Generalized winner calculation for n*n grid
//    0   1   2   3
// 0 [0,  1,  2,  3], 
// 1 [4,  5,  6,  7], 
// 2 [8,  9,  10, 11], 
// 3 [12, 13, 14, 15]
function calculateWinner(squares: any[], n: number) {
  // // Check rows (old logic)
  // for (let row = 0; row < n; row++) {
  //   const first = squares[row * n];
  //   if (first && Array.from({ length: n }).every((_, i) => squares[row * n + i] === first)) {
  //     return first;
  //   }
  // }
  // // Check columns (old logic)
  // for (let col = 0; col < n; col++) {
  //   const first = squares[col];
  //   if (first && Array.from({ length: n }).every((_, i) => squares[i * n + col] === first)) {
  //     return first;
  //   }
  // }
  // // Check main diagonal (old logic)
  // const firstDiag = squares[0];
  // if (firstDiag && Array.from({ length: n }).every((_, i) => squares[i * n + i] === firstDiag)) {
  //   return firstDiag;
  // }
  // // Check anti-diagonal (old logic)
  // const firstAntiDiag = squares[n - 1];
  // if (firstAntiDiag && Array.from({ length: n }).every((_, i) => squares[i * n + (n - 1 - i)] === firstAntiDiag)) {
  //   return firstAntiDiag;
  // }

  // Check rows (direct comparison)
  for (let row = 0; row < n; row++) {
    const first = squares[row * n];
    if (!first) continue;
    let win = true;
    for (let i = 1; i < n; i++) {
      if (squares[row * n + i] !== first) {
        win = false;
        break;
      }
    }
    if (win) return first;
  }
  // Check columns (direct comparison)
  for (let col = 0; col < n; col++) {
    const first = squares[col];
    if (!first) continue;
    let win = true;
    for (let i = 1; i < n; i++) {
      if (squares[i * n + col] !== first) {
        win = false;
        break;
      }
    }
    if (win) return first;
  }
  // Check main diagonal (direct comparison)
  const firstDiag = squares[0];
  if (firstDiag) {
    let win = true;
    for (let i = 1; i < n; i++) {
      if (squares[i * n + i] !== firstDiag) {
        win = false;
        break;
      }
    }
    if (win) return firstDiag;
  }
  // Check anti-diagonal (direct comparison)
  const firstAntiDiag = squares[n - 1];
  if (firstAntiDiag) {
    let win = true;
    for (let i = 1; i < n; i++) {
      if (squares[i * n + (n - 1 - i)] !== firstAntiDiag) {
        win = false;
        break;
      }
    }
    if (win) return firstAntiDiag;
  }
  return null;
}

export default SlidingTicTacToe;
