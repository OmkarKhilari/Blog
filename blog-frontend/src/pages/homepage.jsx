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
        <Link key={post.id} to={`/post/${post.id}`}>
          <div className="mt-12 p-4 bg-white shadow-lg rounded-lg flex cursor-pointer">
            <div className="flex-grow">
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.author}</p>
              <div className="text-gray-500 flex items-center space-x-2">
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.views} views</span>
                <span>•</span>
                <span>{post.comments} comments</span>
              </div>
            </div>
            <div className="ml-4 flex-shrink-0">
              <img src={post.image} alt={post.title} className="h-24 w-24 object-cover rounded-lg" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Homepage;
