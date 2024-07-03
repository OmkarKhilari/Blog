import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../services/firebase';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchBlogs(user.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchBlogs = async (userId) => {
    try {
      const response = await fetch(`/api/blogs?userId=${userId}`);
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-16 max-w-2xl">
      <div className="flex items-center space-x-4">
        <img src={user.photoURL} alt={user.displayName} className="w-16 h-16 rounded-full border" />
        <div>
          <h2 className="text-2xl font-bold">{user.displayName}</h2>
        </div>
      </div>
      <hr className="my-6" />
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Reading list</h3>
        {blogs.length === 0 ? (
          <p className="text-gray-600">No stories</p>
        ) : (
          <div className="space-y-4">
            {blogs.map(blog => (
              <div key={blog.id} className="p-4 border rounded shadow-sm">
                <h4 className="text-lg font-semibold mb-2">{blog.title}</h4>
                <p className="text-gray-700">{blog.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
