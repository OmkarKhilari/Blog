import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosInstance';

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-sm rounded-lg mb-4 border border-gray-200 p-4">
        <h1 className="text-3xl font-semibold mb-4">{post.title}</h1>
        {post.image && (
          <img 
            src={`http://localhost:8080/uploads/${post.image}`} 
            alt={post.title} 
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }} 
          />
        )}
        <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
};

export default Post;
