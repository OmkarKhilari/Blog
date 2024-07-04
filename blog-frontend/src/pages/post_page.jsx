import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosInstance';
import Loading from '../components/Loading';

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${postId}`);
        setPost(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mt-12 bg-white shadow-sm rounded-lg border border-gray-200 p-4">
        <h1 className="text-3xl font-semibold mb-4">{post.title}</h1>
        {post.image && (
          <img 
            src={`http://localhost:8000/uploads/${post.image}`} 
            alt={post.title} 
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', marginBottom: '1rem' }} 
          />
        )}
        <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </div>
  );
};

export default PostPage;
