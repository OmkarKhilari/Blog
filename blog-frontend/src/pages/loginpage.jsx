import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from '../services/firebase';
import Loading from '../components/Loading';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();   

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      navigate('/create');
      console.log(result.user);
    } catch (error) {
      console.error("Error during login: ", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <button
          onClick={handleGoogleLogin}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
