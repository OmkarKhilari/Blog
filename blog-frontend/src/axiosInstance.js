import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://omkar.bhaskaraa45.me/blogshog',
});

export default instance;
