
import { FileSystemProvider } from './context/FileSystemContext';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <FileSystemProvider>
      <Layout />
    </FileSystemProvider>
  );
}

export default App;
