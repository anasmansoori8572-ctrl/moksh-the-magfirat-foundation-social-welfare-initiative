import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { GalleryItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, Filter, Loader2, Camera, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ClipReveal from '../components/ClipReveal';
import TiltCard from '../components/TiltCard';

const Gallery = () => {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Events', 'Education', 'Community', 'Library'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GalleryItem[];
        setItems(data);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredItems = items.filter(item => filter === 'All' || item.category === filter);

  return (
    <div className="pb-20">
      {/* Header */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-stone-50">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dbdx1mxd5/image/upload/v1774738040/samples/food/dessert.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-50/30 via-stone-50/50 to-stone-50"></div>
        </div>
        <div className="section-container text-center relative z-10">
          <ClipReveal>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-4 md:mb-6">
              Our <span className="text-primary italic">Gallery</span>
            </h1>
          </ClipReveal>
          <p className="text-base md:text-xl text-stone-600 max-w-2xl mx-auto mb-6 md:mb-8 px-4">
            Capturing moments of hope, learning, and community impact.
          </p>
          {isAdmin && (
            <Link 
              to="/admin/gallery"
              className="inline-flex items-center space-x-2 bg-stone-900 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/20 text-sm md:text-base"
            >
              <Settings size={18} />
              <span>Manage Gallery</span>
            </Link>
          )}
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 md:py-16 sticky top-16 md:top-20 z-40 bg-background/80 backdrop-blur-md border-b border-stone-100">
        <div className="section-container">
          <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 md:px-6 py-1.5 md:py-2.5 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                  filter === cat 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-primary hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24 md:py-48">
        <div className="section-container">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 sm:px-0">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-square bg-stone-100 rounded-[1.5rem] md:rounded-[2.5rem] animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 sm:px-0"
                >
                  {filteredItems.map((item) => (
                    <TiltCard key={item.id}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => setSelectedImage(item)}
                        className="relative aspect-square rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden earthy-shadow group cursor-pointer h-full"
                      >
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=400'}
                          alt={item.title || 'Gallery Image'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-md p-3 md:p-4 rounded-full text-white">
                            <Maximize2 size={20} md:size={24} />
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl inline-block text-primary font-bold text-[10px] md:text-xs shadow-lg">
                            {item.category}
                          </div>
                        </div>
                      </motion.div>
                    </TiltCard>
                  ))}
                </motion.div>
              </AnimatePresence>

              {filteredItems.length === 0 && (
                <div className="text-center py-16 md:py-32 bg-stone-50 rounded-[1.5rem] md:rounded-[3rem] border-2 border-dashed border-stone-200 mx-4 sm:mx-0">
                  <div className="bg-stone-100 w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <Camera className="text-stone-300" size={28} md:size={40} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2">No photos found</h3>
                  <p className="text-stone-500 text-sm md:text-base px-4">Check back soon for more updates.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-4 right-4 md:top-10 md:right-10 text-white/70 hover:text-white transition-colors z-50 p-2"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={32} md:size={40} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedImage.imageUrl || 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800'}
                alt={selectedImage.title || 'Gallery Image'}
                className="max-w-full max-h-[70vh] md:max-h-[80vh] object-contain rounded-xl md:rounded-2xl shadow-2xl"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400';
                }}
              />
              <div className="mt-6 md:mt-8 text-center px-4">
                <span className="bg-primary px-3 py-1 md:px-4 md:py-1.5 rounded-full text-white text-xs md:text-sm font-bold mb-3 md:mb-4 inline-block">
                  {selectedImage.category}
                </span>
                {selectedImage.title && (
                  <h3 className="text-xl md:text-2xl font-bold text-white">{selectedImage.title}</h3>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
