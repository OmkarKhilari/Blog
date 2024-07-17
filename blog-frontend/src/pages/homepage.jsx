import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../axiosInstance';
import Loading from '../components/Loading';
import { getImageUrl } from '../services/firebaseStorage';
import '../App.css';

const Homepage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortMethod, setSortMethod] = useState('latest');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/posts');
        const postsWithImageUrls = await Promise.all(
          response.data.map(async (post) => {
            if (post.image) {
              const imageUrl = await getImageUrl(post.image);
              return { ...post, imageUrl };
            }
            return post;
          })
        );
        setPosts(postsWithImageUrls);
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
      return new Date(b.date) - new Date(a.date);
    } else if (sortMethod === 'oldest') {
      return new Date(a.date) - new Date(b.date);
    }
    return 0;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 font-montserrat">
      <div className="mt-12 mb-6 flex justify-end">
        <label htmlFor="sort" className="mr-2 text-gray-700">Sort by:</label>
        <select id="sort" value={sortMethod} onChange={handleSortChange} className="px-1 py-1 border rounded bg-gray-100 text-gray-700">
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => (
          <Link to={`/post/${post.id}`} key={post.id} className="post-link block mb-8">
            <div className="post-container bg-white shadow-sm rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-300">
              <div className="post-content flex flex-col md:flex-row items-start">
                {post.imageUrl && (
                  <div className="post-image mb-4 md:mb-0 md:mr-4">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="rounded-lg object-cover h-48 w-full md:w-64"
                    />
                  </div>
                )}
                <div className="post-text flex-grow">
                  <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
                  <div className="post-meta mb-2 text-gray-500 text-sm">
                    <span className="author">{post.author}</span>
                    <span className="date ml-2">{new Date(post.date).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: post.content.slice(0, 100) }} />
                </div>
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
