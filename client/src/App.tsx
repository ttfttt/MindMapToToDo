import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={() => axios.get('/api/teshima/todo').then(res => {
          console.log(res.data);
        })}>{"押してみよう"}</button>
      </header>
    </div>
  );
}

export default App;
