import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosInstance';
import Loading from '../components/Loading';
import { useAuth } from '../services/auth';
import { format } from 'date-fns';
import { storage } from '../services/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import '../App.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePost = async () => {
    if (!title || !content || !image) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    const uploadImageToFirebase = async (file) => {
      const sanitizedImageName = file.name.replace(/\s+/g, '_');
      const storageRef = ref(storage, `images/${sanitizedImageName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => reject(error),
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', user.displayName);
    formData.append('date', format(new Date(), 'yyyy-MM-dd'));
    formData.append('image', image);
    
    try {
      const imageUrl = await uploadImageToFirebase(image);
      formData.append('imageUrl', imageUrl);
      
      await axios.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/');
    } catch (error) {
      console.error('Error posting:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mt-16 mb-6 p-4 bg-white shadow-sm rounded-lg border border-gray-200">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 border-b border-gray-200 focus:outline-none text-2xl font-semibold"
        />
        <ReactQuill
          value={content}
          onChange={setContent}
          className="mb-4 border-b border-gray-200"
          placeholder="Tell your story..."
        />
        <div className="flex items-center mb-4">
          <label className="custom-file-input">
            Choose File
            <input type="file" onChange={handleImageChange} />
          </label>
        </div>
        {imagePreview && (
          <div className="mb-4">
            <img 
              src={imagePreview} 
              alt="Selected" 
              style={{ maxWidth: '400px', maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }} 
            />
          </div>
        )}
        <button
          onClick={handlePost}
          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700 transition duration-100"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
