import { useState } from "react";
import SlidingTicTacToe from "./sliding-general";

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
        <div className="w-full h-full flex flex-col items-center justify-start gap-6 p-4">
            <div className="text-2xl font-bold text-center">
                <div className="text-blue-600 dark:text-blue-400 mb-4">Tic Tac Toe</div>
                <div className={`text-xl ${
                    winner 
                        ? 'text-green-600 dark:text-green-400' 
                        : isDraw 
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-gray-700 dark:text-gray-300'
                }`}>
                    {winner ? `🎉 Winner: ${winner}` : isDraw ? "🤝 Draw!" : `Next Player: ${xIsNext ? "O" : "X"}`}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-gray-300 dark:bg-gray-600 p-2 rounded-lg">
                {board.map((value, i) => (
                    <button
                        key={i}
                        className="w-20 h-20 bg-white dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-500 rounded font-bold text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
                        style={{
                            color: value === "X" ? "#ef4444" : value === "O" ? "#3b82f6" : "transparent",
                        }}
                        onClick={() => handleBoardClick(i)}
                    >
                        {value}
                    </button>
                ))}
            </div>

            <button 
                onClick={reset}
                className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
            >
                Reset Game
            </button>

            {/* Sliding Tic Tac Toe Section */}
            <div className="w-full border-t-2 border-gray-300 dark:border-gray-600 pt-6 mt-6">
                <SlidingTicTacToe />
            </div>
        </div>
    );
}
