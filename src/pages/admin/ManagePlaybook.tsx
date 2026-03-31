import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { PlaybookEntry } from '../../types';
import AdminSidebar from '../../components/AdminSidebar';
import { Plus, Trash2, Edit2, X, Upload, Loader2, AlertCircle, List, Minus } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';

const PlaybookCard = ({ item, onEdit, onDelete }: { item: PlaybookEntry, onEdit: (item: PlaybookEntry) => void, onDelete: (id: string) => Promise<void>, key?: React.Key }) => {
  return (
    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden earthy-shadow group">
      <div className="relative h-40 md:h-48 overflow-hidden bg-stone-100">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 md:top-4 md:right-4 flex space-x-2 z-10">
          <button
            onClick={() => onEdit(item)}
            className="bg-white/90 backdrop-blur-md p-1.5 md:p-2 rounded-lg md:rounded-xl text-stone-700 hover:text-primary transition-colors shadow-lg"
          >
            <Edit2 size={16} md:size={18} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="bg-white/90 backdrop-blur-md p-1.5 md:p-2 rounded-lg md:rounded-xl text-red-500 hover:bg-red-50 transition-colors shadow-lg"
          >
            <Trash2 size={16} md:size={18} />
          </button>
        </div>
      </div>
      <div className="p-5 md:p-8">
        <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-3 md:mb-4">{item.title}</h3>
        <div className="space-y-1.5 md:space-y-2 mb-4 md:mb-6">
          {item.steps.map((step, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs md:text-sm text-stone-500">
              <span className="font-bold text-primary">{idx + 1}.</span>
              <span className="line-clamp-1">{step}</span>
            </div>
          ))}
        </div>
        <div className="text-[10px] md:text-xs text-stone-400">
          Created: {item.createdAt.toDate().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

const ManagePlaybook = () => {
  const [entries, setEntries] = useState<PlaybookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<{
    title: string;
    imageUrl: string;
    steps: { value: string }[];
  }>({
    defaultValues: {
      steps: [{ value: '' }, { value: '' }, { value: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps"
  });

  useEffect(() => {
    register('imageUrl');
    fetchPlaybook();
  }, [register]);

  const fetchPlaybook = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'impactPlaybook'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PlaybookEntry[];
      setEntries(data);
    } catch (error: any) {
      console.error("Error fetching playbook:", error);
      if (error.code === 'permission-denied') {
        alert("Permission denied. Please ensure you have updated your Firestore security rules for the 'impactPlaybook' collection.");
      }
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
    const payload = {
      title: data.title,
      imageUrl: data.imageUrl,
      steps: data.steps.map((s: { value: string }) => s.value),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'impactPlaybook', editingId), {
          ...payload,
          updatedAt: Timestamp.now()
        });
      } else {
        await addDoc(collection(db, 'impactPlaybook'), {
          ...payload,
          createdAt: Timestamp.now()
        });
      }
      setIsModalOpen(false);
      reset();
      setImagePreview(null);
      setEditingId(null);
      fetchPlaybook();
    } catch (error) {
      console.error("Error saving playbook entry:", error);
      alert("Failed to save playbook entry");
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
      await deleteDoc(doc(db, 'impactPlaybook', id));
      fetchPlaybook();
    } catch (error: any) {
      console.error("Delete error:", error);
      alert(`Failed to delete: ${error.message}`);
    }
  };

  const openEditModal = (item: PlaybookEntry) => {
    setEditingId(item.id);
    setValue('title', item.title);
    setValue('imageUrl', item.imageUrl);
    setValue('steps', item.steps.map(s => ({ value: s })));
    setImagePreview(item.imageUrl);
    setIsModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <div className="flex-1 p-4 md:p-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-900 mb-1 md:mb-2">How We Do It!</h1>
            <p className="text-sm md:text-base text-stone-500">Manage instructional roadmaps for social impact.</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              reset({
                title: '',
                imageUrl: '',
                steps: [{ value: '' }, { value: '' }, { value: '' }]
              });
              setImagePreview(null);
              setIsModalOpen(true);
            }}
            className="w-full md:w-auto bg-primary text-white px-6 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm md:text-base"
          >
            <Plus size={18} md:size={20} />
            <span>Add Roadmap</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl md:rounded-3xl h-80 md:h-96 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {entries.map((item) => (
              <PlaybookCard key={item.id} item={item} onEdit={openEditModal} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Delete Confirmation */}
        {confirmDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}></div>
            <div className="bg-white w-full max-w-sm md:max-w-md rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative z-10 p-6 md:p-8 text-center">
              <div className="bg-red-50 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Trash2 className="text-red-500" size={24} md:size={32} />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-stone-900 mb-2">Delete Roadmap?</h3>
              <p className="text-sm md:text-base text-stone-500 mb-6 md:mb-8">This action cannot be undone.</p>
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="bg-white w-full max-w-2xl rounded-[2rem] md:rounded-[3rem] shadow-2xl relative z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="p-6 md:p-12">
                <div className="flex justify-between items-center mb-6 md:mb-10">
                  <h2 className="text-xl md:text-2xl font-bold text-stone-900">{editingId ? 'Edit Roadmap' : 'Add New Roadmap'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                    <X size={20} md:size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                  <input type="hidden" {...register('imageUrl', { required: 'Image is required' })} />
                  
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-xs md:text-sm font-bold text-stone-700 ml-1">Title Hint</label>
                    <input
                      {...register('title', { required: 'Title is required' })}
                      className="w-full bg-stone-50 border-stone-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-3 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      placeholder="e.g., Madrasa Modernization Guide"
                    />
                  </div>

                  <div className="grid gap-3 md:gap-4">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-xs md:text-sm font-bold text-stone-700">Roadmap Steps</label>
                      <button
                        type="button"
                        onClick={() => append({ value: "" })}
                        className="text-[10px] md:text-xs font-bold text-primary hover:text-primary/80 flex items-center space-x-1"
                      >
                        <Plus size={12} md:size={14} />
                        <span>Add Step</span>
                      </button>
                    </div>
                    <div className="space-y-3 md:space-y-4 max-h-48 md:max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center space-x-3 md:space-x-4">
                          <span className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center flex-shrink-0 text-xs md:text-sm">{index + 1}</span>
                          <input
                            {...register(`steps.${index}.value` as const, { required: 'Step description is required' })}
                            className="flex-1 bg-stone-50 border-stone-200 rounded-xl md:rounded-2xl px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            placeholder={`Step ${index + 1} description`}
                          />
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Minus size={16} md:size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-xs md:text-sm font-bold text-stone-700 ml-1">Visual Proof (Image)</label>
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
                          <Upload className="mx-auto text-stone-300 mb-2 md:mb-4" size={32} md:size={40} />
                          <p className="text-stone-500 text-xs md:text-sm">Click to upload image via Cloudinary</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white font-bold py-4 md:py-5 rounded-xl md:rounded-2xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 text-sm md:text-base"
                  >
                    {editingId ? 'Update Roadmap' : 'Save Roadmap'}
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

export default ManagePlaybook;
