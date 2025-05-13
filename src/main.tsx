// src/main.tsx
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { MusicProvider } from './MusicContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <MusicProvider><App /></MusicProvider>
    );