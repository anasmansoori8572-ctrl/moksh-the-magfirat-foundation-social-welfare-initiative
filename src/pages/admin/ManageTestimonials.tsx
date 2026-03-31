import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { Testimonial } from '../../types';
import AdminSidebar from '../../components/AdminSidebar';
import { Check, Trash2, X, MessageSquare, Star, User, AlertCircle } from 'lucide-react';

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Testimonial[];
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, 'testimonials', id), {
        approved: true
      });
      fetchTestimonials();
      alert("Testimonial approved");
    } catch (error: any) {
      console.error("Approval error:", error);
      alert(`Failed to approve: ${error.message || "Unknown error"}`);
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
      
      await deleteDoc(doc(db, 'testimonials', id));
      fetchTestimonials();
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(`Failed to delete: ${error.message || "Unknown error"}`);
    }
  };

  const handleDeleteAll = async () => {
    setConfirmDeleteAll(false);
    setLoading(true);
    try {
      const q = query(collection(db, 'testimonials'));
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(tDoc => deleteDoc(doc(db, 'testimonials', tDoc.id)));
      await Promise.all(deletePromises);
      fetchTestimonials();
      alert("All testimonials deleted successfully");
    } catch (error: any) {
      console.error("Delete all error:", error);
      alert("Failed to delete all testimonials");
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = testimonials.filter(t => !t.approved).length;

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-1 md:mb-2">Manage Testimonials</h1>
            <p className="text-sm md:text-base text-stone-500">Review and approve stories from the community.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:space-x-4">
            {testimonials.length > 0 && (
              <button
                onClick={() => setConfirmDeleteAll(true)}
                className="bg-red-50 text-red-600 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-red-100 transition-all border border-red-100"
              >
                <Trash2 size={18} md:size={20} />
                <span className="text-sm md:text-base">Delete All</span>
              </button>
            )}
            {pendingCount > 0 && (
              <div className="bg-amber-100 text-amber-700 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold flex items-center justify-center space-x-2">
                <AlertCircle size={18} md:size={20} />
                <span className="text-sm md:text-base">{pendingCount} Pending Approval</span>
              </div>
            )}
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
            {testimonials.map((item) => (
              <div 
                key={item.id} 
                className={`bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] earthy-shadow border-2 transition-all ${
                  item.approved ? 'border-transparent' : 'border-amber-200 bg-amber-50/30'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8">
                  <div className="flex-1">
                    <div className="flex items-center space-x-1.5 md:space-x-2 mb-3 md:mb-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={12} md:size={14} className="text-amber-400 fill-amber-400" />
                      ))}
                      {!item.approved && (
                        <span className="bg-amber-100 text-amber-700 text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ml-2">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-stone-700 text-sm md:text-lg italic leading-relaxed mb-4 md:mb-6">"{item.content}"</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:xl overflow-hidden bg-stone-100 flex items-center justify-center text-stone-500 flex-shrink-0">
                        {item.photoUrl ? (
                          <img 
                            src={item.photoUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <User size={20} md:size={24} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm md:text-base">{item.name}</h4>
                        {item.role && <p className="text-stone-500 text-[10px] md:text-xs">{item.role}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex md:flex-col justify-end space-x-2 md:space-x-0 md:space-y-2">
                    {!item.approved && (
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="bg-primary text-white p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        title="Approve"
                      >
                        <Check size={18} md:size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-white text-red-500 border border-stone-200 p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-red-50 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} md:size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {testimonials.length === 0 && (
              <div className="text-center py-12 md:py-20 bg-white rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-stone-200">
                <MessageSquare className="mx-auto text-stone-200 mb-4" size={40} md:size={48} />
                <p className="text-stone-500 font-medium text-sm md:text-base">No testimonials found.</p>
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
              <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2">Delete Testimonial?</h3>
              <p className="text-sm md:text-base text-stone-500 mb-6 md:mb-8">This action cannot be undone. The testimonial will be permanently removed.</p>
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
              <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2">Delete ALL Testimonials?</h3>
              <p className="text-sm md:text-base text-stone-500 mb-6 md:mb-8">Are you absolutely sure? This will permanently delete all testimonials.</p>
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

export default ManageTestimonials;
