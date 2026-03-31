import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { GalleryItem } from '../../types';
import AdminSidebar from '../../components/AdminSidebar';
import { Plus, Trash2, X, Upload, Loader2, Camera, Filter, AlertCircle } from 'lucide-react';

const GalleryImage = ({ item, onDelete }: { item: GalleryItem, onDelete: (id: string, url: string) => Promise<void>, key?: React.Key }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative aspect-square rounded-3xl overflow-hidden earthy-shadow group bg-stone-100">
      <img
        src={item.imageUrl || 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=400'}
        alt={item.title || 'Gallery'}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        onError={(e) => {
          console.error("Image failed to load:", item.imageUrl);
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400';
        }}
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
        <button
          onClick={async (e) => {
            e.stopPropagation();
            console.log("Delete button clicked for gallery item:", item.id);
            try {
              await onDelete(item.id, item.imageUrl);
            } catch (err: any) {
              alert("Delete action failed: " + err.message);
            }
          }}
          className="bg-white/90 backdrop-blur-md p-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all shadow-xl"
        >
          <Trash2 size={24} />
        </button>
      </div>
      <div className="absolute bottom-4 left-4">
        <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-bold text-primary uppercase">
          {item.category}
        </span>
      </div>
    </div>
  );
};

const ManageGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string, url: string } | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [category, setCategory] = useState('Events');
  const [title, setTitle] = useState('');
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
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
        croppingAspectRatio: 1,
        showSkipCropButton: false,
        theme: "minimal"
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          const url = result.info.secure_url;
          setCloudinaryUrl(url);
          setImagePreview(url);
        }
      }
    );
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudinaryUrl) {
      alert("Please upload an image first.");
      return;
    }

    try {
      if (!auth?.currentUser) {
        throw new Error("You must be logged in to upload images. Please log in again.");
      }

      await addDoc(collection(db, 'gallery'), {
        imageUrl: cloudinaryUrl,
        category,
        title,
        createdAt: Timestamp.now()
      });

      setIsModalOpen(false);
      setImagePreview(null);
      setCloudinaryUrl(null);
      setTitle('');
      fetchGallery();
    } catch (error: any) {
      console.error("Save error:", error);
      alert(error.message || "Failed to save gallery item");
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
      
      await deleteDoc(doc(db, 'gallery', id));
      
      await fetchGallery();
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(`Failed to delete: ${error.message || "Unknown error"}`);
    }
  };

  const handleDeleteAll = async () => {
    setConfirmDeleteAll(false);
    setLoading(true);
    try {
      const q = query(collection(db, 'gallery'));
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(async (galleryDoc) => {
        await deleteDoc(doc(db, 'gallery', galleryDoc.id));
      });
      
      await Promise.all(deletePromises);
      await fetchGallery();
      alert("All gallery items deleted successfully");
    } catch (error: any) {
      console.error("Delete all error:", error);
      alert("Failed to delete all gallery items");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-1 md:mb-2">Manage Gallery</h1>
            <p className="text-sm md:text-base text-stone-500">Upload and organize foundation photos.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:space-x-4">
            {items.length > 0 && (
              <button
                onClick={() => setConfirmDeleteAll(true)}
                className="bg-red-50 text-red-600 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-red-100 transition-all border border-red-100"
              >
                <Trash2 size={18} md:size={20} />
                <span className="text-sm md:text-base">Delete All</span>
              </button>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              <Plus size={18} md:size={20} />
              <span className="text-sm md:text-base">Upload Photo</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-square bg-white rounded-2xl md:rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => (
              <GalleryImage key={item.id} item={item} onDelete={handleDelete} />
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
              <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2">Delete Photo?</h3>
              <p className="text-sm md:text-base text-stone-500 mb-6 md:mb-8">This action cannot be undone. The photo will be permanently removed from the gallery.</p>
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
              <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2">Delete ALL Photos?</h3>
              <p className="text-sm md:text-base text-stone-500 mb-6 md:mb-8">Are you absolutely sure? This will permanently delete all gallery photos and their associated images.</p>
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
            <div className="bg-white w-full max-w-xl rounded-[2rem] md:rounded-[3rem] shadow-2xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="p-6 md:p-12">
                <div className="flex justify-between items-center mb-8 md:mb-10">
                  <h2 className="text-xl md:text-2xl font-bold text-stone-900">Upload Photo</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-5 md:space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-bold text-stone-700 ml-1">Photo Title (Optional)</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-stone-50 border-stone-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="Event name or description"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-bold text-stone-700 ml-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-stone-50 border-stone-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
                    >
                      <option value="Events">Events</option>
                      <option value="Education">Education</option>
                      <option value="Community">Community</option>
                      <option value="Library">Library</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-bold text-stone-700 ml-1">Select Image</label>
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
                    disabled={!cloudinaryUrl}
                    className="w-full bg-primary text-white font-bold py-4 md:py-5 rounded-xl md:rounded-2xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 flex flex-col items-center justify-center disabled:opacity-70"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm md:text-base">Upload to Gallery</span>
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

export default ManageGallery;
