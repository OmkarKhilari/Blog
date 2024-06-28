import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosInstance';

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${postId}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mt-16 mb-6 p-4 bg-white">
        <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
        <p className="text-gray-600 mb-2">by {post.author}</p>
        <div className="text-gray-500 mb-4">
          <span>{post.date}</span> • <span>{post.views} views</span> • <span>{post.comments} comments</span>
        </div>
        <img src={post.image} alt={post.title} className="mb-4 w-full rounded-lg" />
        <p className="text-gray-700">{post.content}</p>
      </div>
    </div>
  );
};

export default PostPage;
