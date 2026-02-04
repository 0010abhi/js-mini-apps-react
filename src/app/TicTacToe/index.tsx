import { useState, useEffect } from "react";
import "./styles.css";

export default function TicTacToe() {
  let [playerTurn, setPlayerTurn] = useState("First");
  let [winner, setWinner] = useState('');
  let [count, setCount] = useState(0);
  let [player1, setPlayer1] = useState<number[]>([]);
  let [player2, setPlayer2] = useState<number[]>([]);
  const winningCombo = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  useEffect(() => {
    checkWinner();
  }, [player1, player2])

  function checkWinner() {
    const player1Loc = [...player1].sort((a,b) => a-b);
    const player2Loc = [...player2].sort((a,b) => a-b);

    console.log('>>>1', player1Loc);
    console.log('>>>2', player2Loc);

    winningCombo.forEach((value) => {
      if(value.toString() === player1Loc.toString()) {
        setWinner('First');
      }
      if(value.toString() === player2Loc.toString()) {
        setWinner('Second');
      }
    })
  }

  function handleBoardClick(value: number) {
    if(winner || player1.indexOf(value) > -1 || player2.indexOf(value) > -1) {
      return;
    }
    setCount((count) => {
      return count + 1;
    });
    if (count % 2 === 0) {
      setPlayer1((preVal) => [...preVal, value]);
      setPlayerTurn("Second");
    } else {
      setPlayer2((preVal) => [...preVal, value]);
      setPlayerTurn("First");
    }
  }

  function reset() {
    setCount(0);
    setPlayerTurn("First");
    setPlayer1([]);
    setPlayer2([]);
    setWinner('');
  }

  return (
    <div>
      <div className="player-info">{winner ? `Player ${winner} wins` : `Player ${playerTurn} turn`}</div>
      <div className="board">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => {
          return (
            <div
              key={value}
              className="board-section"
              onClick={() => {
                handleBoardClick(value);
              }}
            >
              <span>{player1.indexOf(value) > -1 ? "O" : ""}</span>
              <span>{player2.indexOf(value) > -1 ? "X" : ""}</span>
            </div>
          );
        })}
      </div>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
