import React from 'react';
import { Link } from 'react-router-dom';

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

const Homepage = () => {
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
