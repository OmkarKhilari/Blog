import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../axiosInstance';
import Loading from '../components/Loading';
import '../App.css';

const Homepage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState('latest');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/posts');
        setPosts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleSortChange = (event) => {
    setSortMethod(event.target.value);
  };

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortMethod === 'latest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortMethod === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mt-16">
        <label htmlFor="sort" className="mr-2">Sort by:</label>
        <select id="sort" value={sortMethod} onChange={handleSortChange} className="p-2 border rounded">
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => (
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
