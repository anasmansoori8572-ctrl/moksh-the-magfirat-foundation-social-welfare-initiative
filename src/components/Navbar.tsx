import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Initiatives', path: '/initiatives' },
    { name: 'Voices of Impact', path: '/testimonials' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Suggestions', path: '/suggestions' },
    { name: 'Contact Us', path: '/contact' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin Dashboard', path: '/admin/dashboard' });
  }

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-stone-200"
    >
      <div className="section-container">
        <div className="flex justify-between items-center h-16 md:h-20 lg:h-24 gap-4">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 md:space-x-4 group">
              <div className="w-10 h-10 md:w-14 md:h-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/20 bg-black shadow-md transition-transform group-hover:scale-105">
                <img 
                  src="https://res.cloudinary.com/dbdx1mxd5/image/upload/v1773125850/cld-sample-5.png" 
                  alt="Moksh – The Magfirat Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/initials/svg?seed=MokshTheMagfirat&backgroundColor=059669';
                  }}
                />
              </div>
              <span className="font-bold text-base md:text-xl lg:text-2xl tracking-tight text-primary">
                <span className="md:hidden">Moksh</span>
                <span className="hidden md:inline">Moksh – The Magfirat</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-5 xl:space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs xl:text-sm font-bold transition-all hover:text-primary uppercase tracking-widest relative group ${
                  location.pathname === link.path ? 'text-primary' : 'text-stone-600'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`}></span>
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-stone-600 hover:text-primary transition-colors bg-stone-100 rounded-xl"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white border-b border-stone-100 overflow-hidden shadow-2xl"
          >
            <div className="px-5 pt-4 pb-8 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-4 text-lg font-bold rounded-2xl transition-all active:scale-95 ${
                    location.pathname === link.path
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
