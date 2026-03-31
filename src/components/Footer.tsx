import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 md:pt-24 pb-8 md:pb-12">
      <div className="section-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 px-4 sm:px-0">
          {/* Brand */}
          <div className="space-y-6 text-center sm:text-left">
            <Link to="/" className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 group">
              <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/10 bg-black shadow-md transition-transform group-hover:scale-105">
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
              <span className="font-bold text-xl md:text-2xl lg:text-3xl tracking-tight text-white">Moksh – The Magfirat</span>
            </Link>
            <p className="text-stone-400 leading-relaxed max-w-xs mx-auto sm:mx-0 text-sm md:text-base">
              Moksh – The Magfirat Foundation is dedicated to social welfare and educational empowerment for a better tomorrow.
            </p>
            <div className="flex justify-center sm:justify-start space-x-6">
              <a href="#" className="hover:text-primary transition-colors p-2 bg-white/5 rounded-lg"><Facebook size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors p-2 bg-white/5 rounded-lg"><Twitter size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors p-2 bg-white/5 rounded-lg"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-bold mb-6 md:mb-8 uppercase tracking-widest text-xs md:text-sm">Quick Links</h3>
            <ul className="space-y-4 md:space-y-5">
              <li><Link to="/about" className="hover:text-primary transition-colors text-sm md:text-base">About Us</Link></li>
              <li><Link to="/initiatives" className="hover:text-primary transition-colors text-sm md:text-base">Our Initiatives</Link></li>
              <li><Link to="/gallery" className="hover:text-primary transition-colors text-sm md:text-base">Gallery</Link></li>
              <li><Link to="/testimonials" className="hover:text-primary transition-colors text-sm md:text-base">Voices of Impact</Link></li>
              <li><Link to="/suggestions" className="hover:text-primary transition-colors text-sm md:text-base">Suggestion Box</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-bold mb-6 md:mb-8 uppercase tracking-widest text-xs md:text-sm">Contact Us</h3>
            <ul className="space-y-5 md:space-y-6">
              <li className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                <MapPin className="text-primary shrink-0 mt-1" size={18} md:size={20} />
                <span className="text-sm md:text-base leading-relaxed">Moksh Library, Kanpur, Uttar Pradesh, India</span>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                <Phone className="text-primary shrink-0 mt-1" size={18} md:size={20} />
                <span className="text-sm md:text-base leading-relaxed">+91 8858272425, +91 7007397430</span>
              </li>
              <li className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
                <Mail className="text-primary shrink-0 mt-1" size={18} md:size={20} />
                <span className="break-all text-sm md:text-base leading-relaxed">themoksh.org@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-center sm:text-left">
            <h3 className="text-white font-bold mb-6 md:mb-8 uppercase tracking-widest text-xs md:text-sm">Stay Updated</h3>
            <p className="text-stone-400 mb-6 text-sm md:text-base leading-relaxed">Subscribe to our newsletter for latest updates.</p>
            <form className="space-y-3.5 max-w-sm mx-auto sm:mx-0">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-stone-800 border-stone-700 rounded-xl px-5 py-3.5 md:py-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm md:text-base"
              />
              <button className="w-full bg-primary text-white font-bold py-3.5 md:py-4 rounded-xl hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/10 text-sm md:text-base">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-stone-800 pt-8 flex flex-col lg:flex-row justify-between items-center text-xs md:text-sm text-stone-500 gap-8 px-4 sm:px-0">
          <p className="text-center lg:text-left leading-relaxed">© {new Date().getFullYear()} Moksh – The Magfirat Foundation. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <Link to="/admin/login" className="hover:text-stone-300 transition-colors">Admin Login</Link>
            <Link to="/privacy" className="hover:text-stone-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-stone-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
