import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar.jsx';
import Footer from './components/footer.jsx';
import Homepage from './pages/homepage.jsx';
import PostPage from './pages/post_page.jsx';
import CreatePost from './pages/create_post.jsx';
import LoginPage from './pages/loginpage.jsx';
import RequireAuth from './services/require_auth.jsx';
import ProfilePage from './pages/profilepage.jsx';
import ScrollToTop from './components/scroll_to_top.jsx';
import './App.css';

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/post/:postId" element={<PostPage />} />
            <Route path="/create" element={
              <RequireAuth>
                <CreatePost />
              </RequireAuth>
            } />
            <Route path="/profile" element={
              <RequireAuth>
                <ProfilePage />
              </RequireAuth>
            } />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
