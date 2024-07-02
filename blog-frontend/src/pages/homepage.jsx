import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../axiosInstance';
import '../App.css';

const Homepage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  if (!posts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Link to={`/post/${post.id}`} key={post.id} className="post-link">
            <div className="post-container mt-12 bg-white shadow-sm rounded-lg border border-gray-200 p-4">
              <div className="post-content">
                <div className="post-text">
                  <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                  <div className="post-meta mb-2 text-gray-500">
                    <span className="author">{post.author}</span>
                    <span className="date">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: post.content.slice(0, 100) }} />
                </div>
                {post.image && (
                  <div className="post-image">
                    <img 
                      src={`http://localhost:8000/uploads/${post.image}`} 
                      alt={post.title} 
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div>No posts available</div>
      )}
    </div>
  );
};

export default Homepage;
