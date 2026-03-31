import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Suggestion } from '../../types';
import AdminSidebar from '../../components/AdminSidebar';
import { Trash2, MessageSquare, Mail, User, Clock, Search, Languages, Loader2, AlertCircle } from 'lucide-react';
import { translateText } from '../../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';

const ManageSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [translating, setTranslating] = useState<string | null>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'suggestions'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Suggestion[];
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDelete(id);
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    const id = confirmDelete;
    setConfirmDelete(null);
    
    try {
      if (!db) throw new Error("Database not initialized");
      
      await deleteDoc(doc(db, 'suggestions', id));
      fetchSuggestions();
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(`Failed to delete: ${error.message || "Unknown error"}`);
    }
  };

  const handleDeleteAll = async () => {
    setConfirmDeleteAll(false);
    setLoading(true);
    try {
      const q = query(collection(db, 'suggestions'));
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(sDoc => deleteDoc(doc(db, 'suggestions', sDoc.id)));
      await Promise.all(deletePromises);
      fetchSuggestions();
      alert("All suggestions deleted successfully");
    } catch (error: any) {
      console.error("Delete all error:", error);
      alert("Failed to delete all suggestions");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async (id: string, text: string) => {
    if (translations[id]) {
      const newTranslations = { ...translations };
      delete newTranslations[id];
      setTranslations(newTranslations);
      return;
    }

    setTranslating(id);
    try {
      const translated = await translateText(text, "English"); // Admin might prefer English or Hindi
      setTranslations(prev => ({ ...prev, [id]: translated }));
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setTranslating(null);
    }
  };

  const filteredSuggestions = suggestions.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-1 md:mb-2">Manage Suggestions</h1>
            <p className="text-sm md:text-base text-stone-500">Read and manage feedback from the community.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:space-x-4">
            {suggestions.length > 0 && (
              <button
                onClick={() => setConfirmDeleteAll(true)}
                className="bg-red-50 text-red-600 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-red-100 transition-all border border-red-100"
              >
                <Trash2 size={18} md:size={20} />
                <span className="text-sm md:text-base">Delete All</span>
              </button>
            )}
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} md:size={20} />
              <input
                type="text"
                placeholder="Search suggestions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 md:w-80 bg-white border border-stone-200 rounded-xl md:rounded-2xl pl-11 md:pl-12 pr-4 md:pr-6 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 md:space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl md:rounded-3xl h-40 md:h-48 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {filteredSuggestions.map((item) => (
              <div key={item.id} className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] earthy-shadow group">
                <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-4 md:mb-6">
                      <div className="flex items-center space-x-2 text-stone-600 bg-stone-100 px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg md:xl text-xs md:text-sm font-medium">
                        <User size={14} md:size={16} />
                        <span>{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-stone-600 bg-stone-100 px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg md:xl text-xs md:text-sm font-medium">
                        <Mail size={14} md:size={16} />
                        <span className="truncate max-w-[150px] sm:max-w-none">{item.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-stone-400 text-[10px] md:text-xs ml-auto">
                        <Clock size={12} md:size={14} />
                        <span>{item.createdAt.toDate().toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute top-2 right-2 md:top-4 md:right-4">
                        <button
                          onClick={() => handleTranslate(item.id, item.content)}
                          disabled={translating === item.id}
                          className="flex items-center space-x-1.5 md:space-x-2 text-primary font-bold text-[10px] md:text-xs bg-primary/10 px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          {translating === item.id ? (
                            <Loader2 className="animate-spin" size={12} md:size={14} />
                          ) : (
                            <Languages size={12} md:size={14} />
                          )}
                          <span>{translations[item.id] ? 'Original' : 'Translate'}</span>
                        </button>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={translations[item.id] ? 'translated' : 'original'}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-stone-700 text-sm md:text-lg leading-relaxed bg-stone-50 p-5 md:p-8 rounded-xl md:rounded-2xl border border-stone-100"
                        >
                          {translations[item.id] || item.content}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="flex md:flex-col justify-end">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-white text-red-500 border border-stone-200 p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-red-50 transition-all shadow-sm"
                      title="Delete"
                    >
                      <Trash2 size={18} md:size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredSuggestions.length === 0 && (
              <div className="text-center py-12 md:py-20 bg-white rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-stone-200">
                <MessageSquare className="mx-auto text-stone-200 mb-4" size={40} md:size={48} />
                <p className="text-stone-500 font-medium text-sm md:text-base">No suggestions found.</p>
              </div>
            )}
          </div>
        )}
        {/* Custom Confirmation Modals */}
        {confirmDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}></div>
            <div className="bg-white w-full max-w-sm md:max-w-md rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative z-10 p-6 md:p-8 text-center">
              <div className="bg-red-50 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Trash2 className="text-red-500" size={24} md:size={32} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2">Delete Suggestion?</h3>
              <p className="text-sm md:text-base text-stone-500 mb-6 md:mb-8">This action cannot be undone. The suggestion will be permanently removed.</p>
              <div className="flex space-x-3 md:space-x-4">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 md:px-6 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base text-stone-600 bg-stone-100 hover:bg-stone-200 transition-all">
                  Cancel
                </button>
                <button onClick={executeDelete} className="flex-1 px-4 md:px-6 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-200">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmDeleteAll && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setConfirmDeleteAll(false)}></div>
            <div className="bg-white w-full max-w-sm md:max-w-md rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative z-10 p-6 md:p-8 text-center">
              <div className="bg-red-100 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <AlertCircle className="text-red-600" size={24} md:size={32} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2">Delete ALL Suggestions?</h3>
              <p className="text-sm md:text-base text-stone-500 mb-6 md:mb-8">Are you absolutely sure? This will permanently delete all suggestions.</p>
              <div className="flex space-x-3 md:space-x-4">
                <button onClick={() => setConfirmDeleteAll(false)} className="flex-1 px-4 md:px-6 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base text-stone-600 bg-stone-100 hover:bg-stone-200 transition-all">
                  Cancel
                </button>
                <button onClick={handleDeleteAll} className="flex-1 px-4 md:px-6 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base text-white bg-red-600 hover:bg-red-700 transition-all shadow-lg shadow-red-200">
                  Delete All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSuggestions;
