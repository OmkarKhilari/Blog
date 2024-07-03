import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from "firebase/auth";

const RequireAuth = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default RequireAuth;
