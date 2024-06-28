import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080', // your backend URL
});

export default instance;
