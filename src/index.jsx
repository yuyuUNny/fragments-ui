import ReactDOM from 'react-dom/client';
import App from './app.jsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Cannot find element with id="root"');
}

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
