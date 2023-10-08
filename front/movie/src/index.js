import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserSession } from './stores/UserSession';

const root = ReactDOM.createRoot(document.getElementById('root'));
export const Context = createContext(null);
root.render(
  <Context.Provider value={{
    userSession: new UserSession(),
  }}>
    <App />
  </Context.Provider>
);