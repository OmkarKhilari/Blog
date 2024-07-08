import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '../services/firebase';
import Loading from '../components/Loading';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchProfile(user.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchProfile = async (authorId) => {
    try {
      const response = await fetch(`/api/users?author_id=${authorId}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        setProfile(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4 mt-16 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <img src={user.photoURL} alt={user.displayName} className="w-16 h-16 rounded-full border" />
          <div>
            <h2 className="text-2xl font-bold">{user.displayName}</h2>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="px-1 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <hr className="my-6" />
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Reading list</h3>
        {profile && profile.post_ids.length === 0 ? (
          <p className="text-gray-600">No stories found</p>
        ) : (
          <div className="space-y-4">
            {profile ? profile.post_ids.map(postId => (
              <div key={postId} className="p-4 border rounded shadow-sm">
                <h4 className="text-lg font-semibold mb-2">Post ID: {postId}</h4>
              </div>
            )) : (
              <p className="text-gray-600">No profile data found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
