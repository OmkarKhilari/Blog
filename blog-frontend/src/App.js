// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import Homepage from './pages/homepage.jsx';
import PostPage from './pages/post_page.jsx';
import CreatePost from './pages/create_post.jsx';
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <div className="navbar">
          <Navbar />
        </div>
        <div className="homepage">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/post/:postId" element={<PostPage />} />
            <Route path="/create" element={<CreatePost />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
