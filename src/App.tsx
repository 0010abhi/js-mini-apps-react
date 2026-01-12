import { useState } from 'react';
import './App.css'
import TicTacToe from './TicTacToe/improved';
import JobBoard from './JobBoard/improved-single-call';
import FileExplorer from './FileExplorer';

function App() {
  const [miniApp, setMiniApp] = useState('ticTacToe');
  return (
    <>
      {['ticTacToe', 'jobBoard', 'fileExplorer'].map((item) => {
        return <div className={`menu-item ${miniApp === item ? 'active' : ''}`} key={item} onClick={() => setMiniApp(item)}>{item}</div>
      })}
      {miniApp === 'ticTacToe' && <TicTacToe />}
      {miniApp === 'jobBoard' && <JobBoard />}
      {miniApp === 'fileExplorer' && <FileExplorer />}
    </>
  )
}

export default App
