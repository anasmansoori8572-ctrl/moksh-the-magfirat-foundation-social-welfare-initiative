import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Initiative } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ArrowRight, BookOpen, Heart, Users, GraduationCap, Settings, X, Calendar, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ClipReveal from '../components/ClipReveal';
import TiltCard from '../components/TiltCard';

const Initiatives = () => {
  const { isAdmin } = useAuth();
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);

  const categories = ['All', 'Education', 'Social Welfare', 'Vocational', 'Health'];

  useEffect(() => {
    const fetchInitiatives = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'initiatives'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Initiative[];
        setInitiatives(data);
      } catch (error) {
        console.error("Error fetching initiatives:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitiatives();
  }, []);

  const filteredInitiatives = initiatives.filter(item => {
    const matchesFilter = filter === 'All' || item.category === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (category: string) => {
    switch (category) {
      case 'Education': return GraduationCap;
      case 'Social Welfare': return Heart;
      case 'Vocational': return BookOpen;
      case 'Health': return Users;
      default: return Heart;
    }
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-stone-50">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dbdx1mxd5/image/upload/v1774725417/samples/cloudinary-icon.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-50/30 via-stone-50/50 to-stone-50"></div>
        </div>
        <div className="section-container text-center relative z-10">
          <ClipReveal>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-4 md:mb-6">
              Our <span className="text-primary italic">Initiatives</span>
            </h1>
          </ClipReveal>
          <p className="text-base md:text-xl text-stone-600 max-w-2xl mx-auto mb-6 md:mb-8 px-4">
            Explore the various programs we run to empower individuals and strengthen our community.
          </p>
          {isAdmin && (
            <Link 
              to="/admin/initiatives"
              className="inline-flex items-center space-x-2 bg-stone-900 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/20 text-sm md:text-base"
            >
              <Settings size={18} />
              <span>Manage Initiatives</span>
            </Link>
          )}
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 md:py-16 sticky top-16 md:top-20 z-40 bg-background/80 backdrop-blur-md border-b border-stone-100">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 px-4 sm:px-0">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
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
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} md:size={18} />
              <input
                type="text"
                placeholder="Search initiatives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 bg-white border border-stone-200 rounded-full pl-10 md:pl-11 pr-6 py-2 md:py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24 md:py-48">
        <div className="section-container">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-4 sm:px-0">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-6 animate-pulse">
                  <div className="aspect-[4/3] bg-stone-100 rounded-xl md:rounded-3xl mb-4 md:mb-6"></div>
                  <div className="h-6 bg-stone-100 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-stone-100 rounded w-full mb-2"></div>
                  <div className="h-4 bg-stone-100 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                <motion.div 
                  layout
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-4 sm:px-0"
                >
                  {filteredInitiatives.map((item) => {
                    const Icon = getIcon(item.category);
                    return (
                      <TiltCard key={item.id}>
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden earthy-shadow group hover:shadow-2xl transition-all h-full"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <img
                              src={item.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400'}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400';
                              }}
                            />
                            <div className="absolute top-4 left-4 md:top-6 md:left-6">
                              <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:rounded-2xl flex items-center space-x-2 text-primary font-bold text-[10px] md:text-xs shadow-lg">
                                <Icon size={12} />
                                <span>{item.category}</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-6 md:p-10">
                            <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-3 md:mb-4">{item.title}</h3>
                            <p className="text-stone-600 text-sm md:text-base leading-relaxed mb-6 md:mb-8 line-clamp-3">
                              {item.description}
                            </p>
                            <button 
                              onClick={() => setSelectedInitiative(item)}
                              className="w-full bg-secondary text-primary font-bold py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-primary hover:text-white transition-all flex items-center justify-center space-x-2 text-sm md:text-base"
                            >
                              <span>Learn More</span>
                              <ArrowRight size={16} md:size={18} />
                            </button>
                          </div>
                        </motion.div>
                      </TiltCard>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {filteredInitiatives.length === 0 && (
                <div className="text-center py-16 md:py-32 bg-stone-50 rounded-[1.5rem] md:rounded-[3rem] border-2 border-dashed border-stone-200 mx-4 sm:mx-0">
                  <div className="bg-stone-100 w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <Search className="text-stone-300" size={28} md:size={32} />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2">No initiatives found</h3>
                  <p className="text-stone-500 text-sm md:text-base px-4">Try adjusting your filters or search query.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      {/* Detail Modal */}
      <AnimatePresence>
        {selectedInitiative && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInitiative(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-[#F5F5F0]/70 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-white/20"
            >
              <button
                onClick={() => setSelectedInitiative(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2.5 md:p-3 bg-white/90 backdrop-blur-md rounded-xl md:rounded-2xl text-stone-900 hover:bg-primary hover:text-white transition-all shadow-lg"
              >
                <X size={20} />
              </button>

              <div className="overflow-y-auto">
                <div className="relative h-48 sm:h-64 md:h-96">
                  <img
                    src={selectedInitiative.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800'}
                    alt={selectedInitiative.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F5F5F0] via-transparent to-transparent" />
                </div>

                <div className="p-6 md:p-12 -mt-12 md:-mt-20 relative bg-white/40 backdrop-blur-md rounded-t-[2rem] md:rounded-t-[3rem]">
                  <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
                    <div className="bg-primary/10 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl flex items-center space-x-2 text-primary font-bold text-xs md:text-sm">
                      <Tag size={14} />
                      <span>{selectedInitiative.category}</span>
                    </div>
                    {selectedInitiative.createdAt && (
                      <div className="bg-stone-100 px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl flex items-center space-x-2 text-stone-500 font-bold text-xs md:text-sm">
                        <Calendar size={14} />
                        <span>{new Date(selectedInitiative.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-stone-900 mb-4 md:mb-8 leading-tight">
                    {selectedInitiative.title}
                  </h2>

                  <div className="prose prose-stone max-w-none">
                    <p className="text-base md:text-xl text-stone-600 leading-relaxed whitespace-pre-wrap">
                      {selectedInitiative.description}
                    </p>
                  </div>

                  <div className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-xl md:rounded-2xl flex items-center justify-center text-primary">
                        <Heart size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] md:text-sm font-bold text-stone-400 uppercase tracking-wider">Status</p>
                        <p className="text-sm md:text-base text-stone-900 font-bold">Active Initiative</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedInitiative(null)}
                      className="w-full sm:w-auto bg-primary text-white px-8 md:px-10 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 text-sm md:text-base"
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Initiatives;
