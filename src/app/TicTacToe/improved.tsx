import { useState } from "react";

const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6],          // Diagonals
];

export default function App() {
    // Use a single array to represent the board
    const [board, setBoard] = useState<(null | "O" | "X")[]>(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);

    // Derived state: calculate winner every render
    const calculateWinner = (squares: (null | "O" | "X")[]) => {
        for (let [a, b, c] of WINNING_COMBOS) {
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const winner = calculateWinner(board);
    const isDraw = !winner && board.every((square) => square !== null);

    function handleBoardClick(index: number) {
        // Return early if square is taken or game is over
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = xIsNext ? "O" : "X";
        setBoard(newBoard);
        setXIsNext(!xIsNext);
    }

    function reset() {
        setBoard(Array(9).fill(null));
        setXIsNext(true);
    }

    return (
        <div className="game-container">
            <div className="status">
                {winner ? `Winner: ${winner}` : isDraw ? "Draw!" : `Next Player: ${xIsNext ? "O" : "X"}`}
            </div>

            <div className="board" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)' }}>
                {board.map((value, i) => (
                    <button
                        key={i}
                        className="square"
                        style={{ height: '100px', fontSize: '2rem' }}
                        onClick={() => handleBoardClick(i)}
                    >
                        {value}
                    </button>
                ))}
            </div>

            <button onClick={reset} style={{ marginTop: '20px' }}>Reset Game</button>
        </div>
    );
}
