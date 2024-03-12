import React from 'react';
import ReactDOM from 'react-dom/client';
import RecipeSite from './RecipeSite';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <RecipeSite />
  </React.StrictMode>
);