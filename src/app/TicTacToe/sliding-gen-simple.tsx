import React, { useState } from 'react';

interface SlidingTicTacToeProps {
  n?: number; // grid size, default 3
}

const SlidingTicTacToe = ({ n = 4 }: SlidingTicTacToeProps) => {
  // Use player1 and player2 arrays to track positions, and a turn state
  const [player1, setPlayer1] = useState<number[]>([]); // O
  const [player2, setPlayer2] = useState<number[]>([]); // X
  const [playerTurn, setPlayerTurn] = useState<'O' | 'X'>('O');
  const [selectedSquare, setSelectedSquare] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  // Build squares array for rendering and winner calculation
  const squares = Array(n * n).fill(null).map((_, idx) =>
    player1.includes(idx) ? 'O' : player2.includes(idx) ? 'X' : null
  );

  // Count pieces for current player
  const playerPieces = (playerTurn === 'O' ? player1 : player2).length;
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

  const handleClick = (i: number) => {
    if (winner) return;
    // PHASE 1: PLACEMENT
    if (!isSlidingPhase) {
      if (player1.includes(i) || player2.includes(i)) return;
      if (playerTurn === 'O') {
        setPlayer1(prev => [...prev, i]);
        setPlayerTurn('X');
      } else {
        setPlayer2(prev => [...prev, i]);
        setPlayerTurn('O');
      }
      return;
    }
    // PHASE 2: SLIDING
    if (selectedSquare === null) {
      if ((playerTurn === 'O' && player1.includes(i)) || (playerTurn === 'X' && player2.includes(i))) {
        setSelectedSquare(i);
      }
    } else {
      if (i === selectedSquare) {
        setSelectedSquare(null);
      } else if (!player1.includes(i) && !player2.includes(i) && getAdjacents(selectedSquare).includes(i)) {
        // Move piece
        if (playerTurn === 'O') {
          setPlayer1(prev => prev.map(idx => idx === selectedSquare ? i : idx));
          setPlayerTurn('X');
        } else {
          setPlayer2(prev => prev.map(idx => idx === selectedSquare ? i : idx));
          setPlayerTurn('O');
        }
        setSelectedSquare(null);
      }
    }
  };

  // Winner calculation effect
  React.useEffect(() => {
    const win = calculateWinner(squares, n);
    if (win) setWinner(win);
    else setWinner(null);
    // eslint-disable-next-line
  }, [player1, player2]);

  const status = winner
    ? `Winner: ${winner}`
    : `Next: ${playerTurn} ${isSlidingPhase ? '(Slide!)' : '(Place)'}`;

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <div style={{ marginBottom: '10px', fontSize: '1.2rem' }}>{status}</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 80px)`, gap: '5px', justifyContent: 'center' }}>
        {Array.from({ length: n * n }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{
              width: '80px', height: '80px', fontSize: '1.5rem',
              backgroundColor: selectedSquare === i ? '#87CEFA' : '#000000',
              color: '#ffffff',
              border: '2px solid #333', cursor: 'pointer'
            }}
          >
            {player1.includes(i) ? 'O' : player2.includes(i) ? 'X' : ''}
          </button>
        ))}
      </div>
      <button style={{ marginTop: '20px' }} onClick={() => window.location.reload()}>Reset</button>
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
