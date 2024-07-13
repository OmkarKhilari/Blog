import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosInstance';
import Loading from '../components/Loading';
import { getImageUrl } from '../services/firebaseStorage';

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${postId}`);
        const postData = response.data;

        if (postData.image) {
          postData.imageUrl = await getImageUrl(postData.image);
        }

        setPost(postData);
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
      <div className="mt-12 rounded-lg p-4">
        <h1 className="text-3xl font-semibold mb-4">{post.title}</h1>
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
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
