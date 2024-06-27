// src/pages/PostPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const posts = [
  // Sample posts data here
  {
    id: 1,
    title: "5 extra packages to use with Flutter 3.22 in 2024",
    date: "May 17",
    views: 759,
    comments: 6,
    image: "/path-to-image1.jpg",
    author: "Leonidas Kanellopoulos",
  },
  {
    id: 2,
    title: "Google Doesn't Appreciate Flutter",
    date: "May 28",
    views: 482,
    comments: 17,
    image: "/path-to-image2.jpg",
    author: "Andrew Zuo",
  },
  {
    id: 3,
    title: "Debug your Flutter App like a Pro with these 5 Tips & Tricks!",
    date: "Feb 1",
    views: 645,
    comments: 6,
    image: "/path-to-image3.jpg",
    author: "Tomic Riedel",
  },
  // Add more posts here
];

const PostPage = () => {
  const { postId } = useParams();
  const post = posts.find((p) => p.id === parseInt(postId));

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
        <p className="text-gray-700">Detailed content of the post goes here...</p>
      </div>
    </div>
  );
};

export default PostPage;
