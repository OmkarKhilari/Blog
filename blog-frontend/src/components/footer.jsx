import React from 'react';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="text-white py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center">
          <img className="h-16 w-48" src="/assets/blogshog-rect.png" alt="Logo" />
        </div>
        <div className="flex space-x-4 my-4 md:my-0">
          <a href="https://github.com/OmkarKhilari" className="text-white hover:text-gray-700">
            <FaGithub size={24} />
          </a>
          <a href="https://linkedin.com/in/your-linkedin" className="text-white hover:text-gray-700">
            <FaLinkedin size={24} />
          </a>
          <a href="https://instagram.com/omkar1905k" className="text-white hover:text-gray-700">
            <FaInstagram size={24} />
          </a>
          <a href="mailto:omkarkhilari95@gmail.com" className="text-white hover:text-gray-700">
            <FaEnvelope size={24} />
          </a>
        </div>
        <div className="text-center md:text-right">
          <p className="text-white">© Omkar Khilari</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
