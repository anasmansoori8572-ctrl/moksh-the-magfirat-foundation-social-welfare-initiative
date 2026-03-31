import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { Initiative } from '../../types';
import AdminSidebar from '../../components/AdminSidebar';
import { Plus, Trash2, Edit2, X, Upload, Loader2, Search, Filter, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

const InitiativeCard = ({ item, onEdit, onDelete }: { item: Initiative, onEdit: (item: Initiative) => void, onDelete: (id: string, url: string) => Promise<void>, key?: React.Key }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden earthy-shadow group">
      <div className="relative h-40 md:h-48 overflow-hidden bg-stone-100">
        <img
          src={item.imageUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400'}
          alt={item.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            console.error("Image failed to load:", item.imageUrl);
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400';
          }}
        />
        <div className="absolute top-3 right-3 md:top-4 md:right-4 flex space-x-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="bg-white/90 backdrop-blur-md p-1.5 md:p-2 rounded-lg md:rounded-xl text-stone-700 hover:text-primary transition-colors shadow-lg"
          >
            <Edit2 size={16} md:size={18} />
          </button>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              console.log("Delete button clicked for:", item.id);
              try {
                await onDelete(item.id, item.imageUrl);
              } catch (err: any) {
                alert("Delete action failed: " + err.message);
              }
            }}
            className="bg-white/90 backdrop-blur-md p-1.5 md:p-2 rounded-lg md:rounded-xl text-red-500 hover:bg-red-50 transition-colors shadow-lg"
          >
            <Trash2 size={16} md:size={18} />
          </button>
        </div>
      </div>
      <div className="p-5 md:p-8">
        <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider mb-1.5 md:mb-2 block">{item.category}</span>
        <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2 md:mb-3">{item.title}</h3>
        <p className="text-stone-500 text-xs md:text-sm line-clamp-3 mb-4 md:mb-6">{item.description}</p>
        <div className="text-[10px] md:text-xs text-stone-400">
          Created: {item.createdAt.toDate().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

const ManageInitiatives = () => {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string, url: string } | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Partial<Initiative>>();

  useEffect(() => {
    register('imageUrl');
    fetchInitiatives();
  }, [register]);

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

  const openUploadWidget = () => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      alert("Cloudinary configuration is missing. Please check your environment variables.");
      return;
    }

    if (!(window as any).cloudinary) {
      alert("Cloudinary widget is not loaded. Please refresh the page.");
      return;
    }

    (window as any).cloudinary.openUploadWidget(
      {
        cloudName,
        uploadPreset,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        cropping: true,
        croppingAspectRatio: 4/3,
        showSkipCropButton: false,
        theme: "minimal"
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          const url = result.info.secure_url;
          setValue('imageUrl', url);
          setImagePreview(url);
        }
      }
    );
  };

  const onSubmit = async (data: any) => {
    try {
      if (editingId) {
        await updateDoc(doc(db, 'initiatives', editingId), {
          ...data,
          updatedAt: Timestamp.now()
        });
      } else {
        await addDoc(collection(db, 'initiatives'), {
          ...data,
          createdAt: Timestamp.now()
        });
      }
      setIsModalOpen(false);
      reset();
      setImagePreview(null);
      setEditingId(null);
      fetchInitiatives();
    } catch (error) {
      console.error("Error saving initiative:", error);
      alert("Failed to save initiative");
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    setConfirmDelete({ id, imageUrl });
  };

  const executeDelete = async () => {
    if (!confirmDelete) return;
    const { id, imageUrl } = confirmDelete;
    setConfirmDelete(null);
    
    try {
      if (!db) throw new Error("Database not initialized");
      
      await deleteDoc(doc(db, 'initiatives', id));
      
      await fetchInitiatives();
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(`Failed to delete: ${error.message || "Unknown error"}`);
    }
  };

  const handleDeleteAll = async () => {
    setConfirmDeleteAll(false);
    setLoading(true);
    try {
      const q = query(collection(db, 'initiatives'));
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(async (initiativeDoc) => {
        await deleteDoc(doc(db, 'initiatives', initiativeDoc.id));
      });
      
      await Promise.all(deletePromises);
      await fetchInitiatives();
      alert("All initiatives deleted successfully");
    } catch (error: any) {
      console.error("Delete all error:", error);
      alert("Failed to delete all initiatives");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (item: Initiative) => {
    setEditingId(item.id);
    setValue('title', item.title);
    setValue('description', item.description);
    setValue('category', item.category);
    setValue('imageUrl', item.imageUrl);
    setImagePreview(item.imageUrl);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-1 md:mb-2">Manage Initiatives</h1>
            <p className="text-sm md:text-base text-stone-500">Add, edit, or remove foundation programs.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:space-x-4">
            {initiatives.length > 0 && (
              <button
                onClick={() => setConfirmDeleteAll(true)}
                className="bg-red-50 text-red-600 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-red-100 transition-all border border-red-100"
              >
                <Trash2 size={18} md:size={20} />
                <span className="text-sm md:text-base">Delete All</span>
              </button>
            )}
            <button
              onClick={() => {
                setEditingId(null);
                reset();
                setImagePreview(null);
                setIsModalOpen(true);
              }}
              className="bg-primary text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <Plus size={18} md:size={20} />
              <span className="text-sm md:text-base">Add Initiative</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl md:rounded-3xl h-80 md:h-96 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {initiatives.map((item) => (
              <InitiativeCard key={item.id} item={item} onEdit={openEditModal} onDelete={handleDelete} />
            ))}
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
              <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2">Delete Initiative?</h3>
              <p className="text-sm md:text-base text-stone-500 mb-6 md:mb-8">This action cannot be undone. The initiative and its image will be permanently removed.</p>
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
              <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2">Delete ALL Initiatives?</h3>
              <p className="text-sm md:text-base text-stone-500 mb-6 md:mb-8">Are you absolutely sure? This will permanently delete all initiatives and their associated images.</p>
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-[#F5F5F0]/70 backdrop-blur-md w-full max-w-2xl rounded-[2rem] md:rounded-[3rem] shadow-2xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto border border-white/20">
              <div className="p-6 md:p-12">
                <div className="flex justify-between items-center mb-8 md:mb-10">
                  <h2 className="text-xl md:text-2xl font-bold text-stone-900">{editingId ? 'Edit Initiative' : 'Add New Initiative'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 md:space-y-6">
                  <input type="hidden" {...register('imageUrl')} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-xs md:text-sm font-bold text-stone-700 ml-1">Title</label>
                      <input
                        {...register('title', { required: 'Title is required' })}
                        className="w-full bg-stone-50 border-stone-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        placeholder="Initiative Title"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs md:text-sm font-bold text-stone-700 ml-1">Category</label>
                      <select
                        {...register('category', { required: 'Category is required' })}
                        className="w-full bg-stone-50 border-stone-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                      >
                        <option value="Education">Education</option>
                        <option value="Social Welfare">Social Welfare</option>
                        <option value="Vocational">Vocational</option>
                        <option value="Health">Health</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-bold text-stone-700 ml-1">Description</label>
                    <textarea
                      {...register('description', { required: 'Description is required' })}
                      rows={4}
                      className="w-full bg-stone-50 border-stone-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                      placeholder="Describe the initiative..."
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-bold text-stone-700 ml-1">Image</label>
                    <div className="relative group">
                      <div 
                        onClick={openUploadWidget}
                        className={`aspect-video rounded-2xl md:rounded-3xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center overflow-hidden bg-stone-50 transition-all cursor-pointer ${imagePreview ? 'border-primary/20' : 'hover:border-primary/40'}`}
                      >
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            className="w-full h-full object-cover" 
                            alt="Preview" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="text-center p-4 md:p-8">
                            <Upload className="mx-auto text-stone-300 mb-3 md:mb-4" size={32} md:size={40} />
                            <p className="text-stone-500 text-xs md:text-sm">Click to upload image via Cloudinary</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white font-bold py-4 md:py-5 rounded-xl md:rounded-2xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 flex flex-col items-center justify-center"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm md:text-base">{editingId ? 'Update Initiative' : 'Save Initiative'}</span>
                    </div>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageInitiatives;
