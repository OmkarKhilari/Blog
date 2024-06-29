import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../axiosInstance';

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white shadow-sm rounded-lg mb-4 border border-gray-200 p-4">
          <Link to={`/post/${post.id}`}>
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
          </Link>
          {post.image && (
            <img 
              src={`/${post.image}`} 
              alt={post.title} 
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }} 
            />
          )}
          <p className="text-gray-700">{post.content.slice(0, 100)}...</p>
          <Link to={`/post/${post.id}`} className="text-blue-600 hover:underline">
            Read more
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Homepage;

