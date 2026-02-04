import { useState } from 'react';
import './App.css'
import appsNavigation from './config/appsNavigation';

function App() {
  const [miniApp, setMiniApp] = useState('ticTacToe');
  return (
    <div className='container'>
      <div className='menu'>
        {appsNavigation.map((item) => {
          return <>
            <div>
              <div className={`menu-item ${miniApp === item.id ? 'active' : ''}`} key={item.id} onClick={() => setMiniApp(item.id)}>{item.name}</div>
            </div>
            <div className='app-area'>
              {
                item.component && miniApp === item.id && <div className="app-container">
                  <item.component />
                </div>
              }
            </div>
          </>
        })}
      </div>
    </div>

  )
}

export default App
