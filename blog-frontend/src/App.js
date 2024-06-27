import React from 'react';
import Navbar from './components/navbar.jsx';
import Homepage from './pages/homepage.jsx';
import './App.css';

const App = () => {
  return (
    <div>
      <div className="navbar">
        <Navbar />
      </div>
      <div className="homepage">
        <Homepage />
      </div>
    </div>
  );
};

export default App;
