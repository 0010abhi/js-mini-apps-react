import JobBoard from '../app/JobBoard/improved-single-call';
import TicTacToe from '../app/TicTacToe/improved';
import FileExplorer from '../app/FileExplorer';

const appsNavigation = [
    {
        id: 'home',
        name: 'Home',
        icon: 'home',
        component: null,
    }, {
        id: 'file-explorer',
        name: 'File Explorer',
        icon: 'folder',
        component: FileExplorer,
    }, {
        id: 'job-board',
        name: 'Job Board',
        icon: 'briefcase',
        component: JobBoard,
    }, {
        id: 'tic-tac-toe',
        name: 'Tic Tac Toe',
        icon: 'gamepad',
        component: TicTacToe,
    }, {
        id: 'wyswyg',
        name: 'WYSWYG',
        icon: 'NA',
    }
];

export default appsNavigation;