import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import App from './App'; 
import { store } from './State/store';
import { Provider } from 'react-redux'; // Import Provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> 
        <App />
    </Provider>
  </StrictMode>
);
