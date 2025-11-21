import { FileSystemProvider } from './context/FileSystemContext';
import Sidebar from './components/Sidebar';
import Explorer from './components/Explorer';
import './App.css';

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <FileSystemProvider>
        <div className="app-container">
          <Sidebar />
          <Explorer />
        </div>
      </FileSystemProvider>
    </ThemeProvider>
  );
}

export default App;
