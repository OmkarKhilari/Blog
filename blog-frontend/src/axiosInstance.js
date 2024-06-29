import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api', // Make sure this matches your backend base URL
});

export default instance;
