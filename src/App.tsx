import { useState } from 'react';
import appsNavigation from './config/appsNavigation';
import { useTheme } from './context/ThemeContext';

function App() {
  const [miniApp, setMiniApp] = useState('ticTacToe');
  const { theme, toggleTheme } = useTheme();

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200'>
      {/* Header with theme toggle */}
      <div className='flex justify-between items-center px-8 py-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
        <h1 className='text-3xl font-bold text-blue-600 dark:text-blue-400'>JS Mini Apps</h1>
        <button
          onClick={toggleTheme}
          className='px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 font-medium'
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>

      <div className='flex flex-col items-center justify-center gap-8 px-4 py-8'>
        {/* Navigation Menu */}
        <div className='flex flex-wrap gap-3 justify-center'>
          {appsNavigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setMiniApp(item.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                miniApp === item.id
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {item.icon !== 'NA' && <span className='mr-2'>{getIcon(item.icon)}</span>}
              {item.name}
            </button>
          ))}
        </div>

        {/* App Area */}
        <div className='w-full max-w-2xl border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-800 shadow-lg min-h-96'>
          {appsNavigation.map((item) =>
            item.component && miniApp === item.id ? (
              <div key={item.id} className='w-full'>
                <item.component />
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}

function getIcon(iconName: string): string {
  const icons: { [key: string]: string } = {
    home: '🏠',
    folder: '📁',
    briefcase: '💼',
    gamepad: '🎮',
  };
  return icons[iconName] || '📌';
}

export default App
