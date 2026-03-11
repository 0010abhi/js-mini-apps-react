import React, { useState } from 'react';

const SlidingTicTacToe = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [selectedSquare, setSelectedSquare] = useState(null);

  const currentPlayer = xIsNext ? 'X' : 'O';
  const winner = calculateWinner(squares);
  const playerPieces = squares.filter(s => s === currentPlayer).length;
  const isSlidingPhase = playerPieces === 3;

  // Mapping of adjacent indices for a 3x3 grid
  const adjacents = {
    0: [1, 3, 4], 1: [0, 2, 3, 4, 5], 2: [1, 4, 5],
    3: [0, 1, 4, 6, 7], 4: [0, 1, 2, 3, 5, 6, 7, 8], 5: [1, 2, 4, 7, 8],
    6: [3, 4, 7], 7: [3, 4, 5, 6, 8], 8: [4, 5, 7],
  };

  const handleClick = (i) => {
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
      } else if (!squares[i] && adjacents[selectedSquare].includes(i)) {
        newSquares[selectedSquare] = null;
        newSquares[i] = currentPlayer;
        setSquares(newSquares);
        setSelectedSquare(null);
        setXIsNext(!xIsNext);
      }
    }
  };

  const status = winner 
    ? `Winner: ${winner}` 
    : `Next: ${currentPlayer} ${isSlidingPhase ? '(Slide!)' : '(Place)'}`;

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <div style={{ marginBottom: '10px', fontSize: '1.2rem' }}>{status}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 80px)', gap: '5px', justifyContent: 'center' }}>
        {squares.map((square, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{
              width: '80px', height: '80px', fontSize: '1.5rem',
              backgroundColor: selectedSquare === i ? '#87CEFA' : '#fff',
              border: '2px solid #333', cursor: 'pointer'
            }}
          >
            {square}
          </button>
        ))}
      </div>
      <button style={{ marginTop: '20px' }} onClick={() => window.location.reload()}>Reset</button>
    </div>
  );
};

function calculateWinner(squares: any) {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
  return null;
}

export default SlidingTicTacToe;
