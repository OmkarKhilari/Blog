import React, { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white fixed w-full z-10">
      <div className="max-w-7xl mx-auto pr-16">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <img className="h-16 w-48" src="/assets/blogshog-rect.png" alt="Logo" />
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="/" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
              <a href="/create" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">Create</a>
              <a href="/profile" className="text-gray-800 hover:text-gray-600 px-3 py-2 rounded-md text-sm font-medium">Profile</a>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-800 hover:text-gray-600 focus:outline-none focus:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/" className="text-gray-800 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium">Home</a>
            <a href="/create" className="text-gray-800 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium">Create</a>
            <a href="/profile" className="text-gray-800 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium">Profile</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
