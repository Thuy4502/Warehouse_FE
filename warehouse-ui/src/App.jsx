import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';

import AppRoutes from './Routers/AppRoutes';

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  );
}

export default App;
