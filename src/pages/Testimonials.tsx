import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, Timestamp, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Testimonial } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Send, CheckCircle, Star, User, Loader2, Settings, Camera, Image as ImageIcon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ImageCropper from '../components/ImageCropper';
import ReadMoreText from '../components/ReadMoreText';
import ClipReveal from '../components/ClipReveal';

const Testimonials = () => {
  const { isAdmin } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ name: string; content: string; role?: string }>();

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const q = query(
          collection(db, 'testimonials'), 
          where('approved', '==', true)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Testimonial[];
        
        // Sort in memory to avoid composite index requirement
        data.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
        
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSelectedImage(reader.result as string);
        setShowCropper(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = (croppedImg: string) => {
    setCroppedImage(croppedImg);
    setShowCropper(false);
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'testimonials'), {
        ...data,
        photoUrl: croppedImage || null,
        approved: false,
        createdAt: Timestamp.now()
      });
      setSubmitted(true);
      reset();
      setCroppedImage(null);
      setSelectedImage(null);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting testimonial:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-20">
      {showCropper && selectedImage && (
        <ImageCropper
          image={selectedImage}
          onCropComplete={onCropComplete}
          onCancel={() => setShowCropper(false)}
        />
      )}
      {/* Header */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-stone-50">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dbdx1mxd5/image/upload/v1774700671/samples/logo.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-50/30 via-stone-50/50 to-stone-50"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ClipReveal>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-4 md:mb-6">
              Voices of <span className="text-primary italic">Impact</span>
            </h1>
          </ClipReveal>
          <p className="text-base md:text-xl text-stone-600 max-w-2xl mx-auto mb-6 md:mb-8 px-4">
            Real stories from the people whose lives have been touched by Moksh – The Magfirat Foundation.
          </p>
          {isAdmin && (
            <Link 
              to="/admin/testimonials"
              className="inline-flex items-center space-x-2 bg-stone-900 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/20 text-sm md:text-base"
            >
              <Settings size={18} />
              <span>Manage Testimonials</span>
            </Link>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-48">
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          {/* Testimonials List */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {loading ? (
              <div className="space-y-6 md:space-y-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] animate-pulse">
                    <div className="h-4 bg-stone-100 rounded w-full mb-4"></div>
                    <div className="h-4 bg-stone-100 rounded w-5/6 mb-8"></div>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-stone-100 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-stone-100 rounded w-24"></div>
                        <div className="h-3 bg-stone-100 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:gap-8">
                {testimonials.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] earthy-shadow relative group overflow-hidden"
                  >
                    <Quote className={`absolute top-4 md:top-6 ${idx % 2 === 0 ? 'right-4 md:right-6' : 'left-4 md:left-6'} text-primary/5 group-hover:text-primary/10 transition-colors pointer-events-none`} size={60} md:size={80} />
                    
                    <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                      {/* Photo Section */}
                      <div className="flex-shrink-0 relative">
                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden shadow-lg ring-4 ring-secondary/30">
                          <img 
                            src={item.photoUrl || `https://picsum.photos/seed/${item.id}/200/200`} 
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className={`flex-1 text-center ${idx % 2 !== 0 ? 'md:text-right' : 'md:text-left'}`}>
                        <div className={`flex space-x-1 mb-3 md:mb-4 justify-center ${idx % 2 !== 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                          {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} size={14} md:size={16} className="text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                        
                        <ReadMoreText 
                          text={`"${item.content}"`}
                          lines={4}
                          className="text-base md:text-xl text-stone-700 leading-relaxed italic mb-4 md:mb-6 relative z-10"
                        />
                        
                        <div className="relative z-10">
                          <h4 className="text-lg md:text-xl font-bold text-stone-900">{item.name}</h4>
                          {item.role && (
                            <p className="text-primary font-semibold text-[10px] md:text-sm tracking-wide uppercase mt-1">
                              {item.role}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {testimonials.length === 0 && (
                  <div className="text-center py-16 md:py-20 bg-stone-50 rounded-[1.5rem] md:rounded-[3rem] border-2 border-dashed border-stone-200 mx-4 sm:mx-0">
                    <p className="text-stone-500 text-sm md:text-base mb-2">No stories shared yet. Be the first to share yours!</p>
                    <p className="text-stone-400 text-xs italic">(Note: New stories appear after admin approval)</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submission Form */}
          <div className="lg:col-span-1 px-4 sm:px-0">
            <div className="lg:sticky lg:top-32">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary p-6 md:p-10 rounded-[1.5rem] md:rounded-[3rem] text-white shadow-2xl shadow-primary/20"
              >
                {submitted ? (
                  <div className="text-center py-8 md:py-10">
                    <div className="bg-white/20 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                      <CheckCircle size={32} md:size={40} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Story Received!</h3>
                    <p className="text-sm md:text-base text-white/80 mb-6 md:mb-8">
                      Thank you for sharing your experience. Your story will be visible once approved by our team.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="bg-white text-primary font-bold px-6 py-2.5 md:px-8 md:py-3 rounded-xl md:rounded-2xl hover:bg-stone-50 transition-all text-sm md:text-base"
                    >
                      Share Another
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Share Your Story</h3>
                    <p className="text-sm md:text-base text-white/70 mb-6 md:mb-8">
                      Has Moksh – The Magfirat Foundation made a difference in your life? We'd love to hear your story.
                    </p>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                      <div className="space-y-3 md:space-y-4">
                        <label className="text-xs md:text-sm font-bold text-white/80 ml-1 block">Your Photo</label>
                        <div className="flex items-center space-x-4">
                          {croppedImage ? (
                            <div className="relative">
                              <img 
                                src={croppedImage} 
                                alt="Preview" 
                                className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl object-cover ring-4 ring-white/20"
                              />
                              <button
                                type="button"
                                onClick={() => setCroppedImage(null)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <label className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl border-2 border-dashed border-white/30 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all group">
                              <Camera className="text-white/40 group-hover:text-white/60 transition-colors" size={20} md:size={24} />
                              <span className="text-[8px] md:text-[10px] text-white/40 mt-1 font-bold uppercase">Upload</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleImageSelect}
                              />
                            </label>
                          )}
                          <div className="flex-1">
                            <p className="text-[10px] md:text-xs text-white/50 leading-relaxed">
                              {croppedImage 
                                ? "Looking good! You can still change it if you want." 
                                : "Add a photo to make your story more personal. You can crop it after selecting."}
                            </p>
                            {croppedImage && (
                              <button
                                type="button"
                                onClick={() => setShowCropper(true)}
                                className="text-[10px] md:text-xs font-bold text-white/80 hover:text-white mt-1.5 md:mt-2 underline underline-offset-4"
                              >
                                Adjust Photo
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 md:space-y-2">
                        <label className="text-xs md:text-sm font-bold text-white/80 ml-1">Your Name</label>
                        <input
                          {...register('name', { required: 'Name is required' })}
                          type="text"
                          placeholder="Full Name"
                          className="w-full bg-white/10 border border-white/20 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white/50 transition-all placeholder:text-white/30"
                        />
                        {errors.name && <span className="text-red-200 text-[10px] md:text-xs ml-1">{errors.name.message}</span>}
                      </div>
                      <div className="space-y-1.5 md:space-y-2">
                        <label className="text-xs md:text-sm font-bold text-white/80 ml-1">Your Role (Optional)</label>
                        <input
                          {...register('role')}
                          type="text"
                          placeholder="e.g. Student, Volunteer"
                          className="w-full bg-white/10 border border-white/20 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white/50 transition-all placeholder:text-white/30"
                        />
                      </div>
                      <div className="space-y-1.5 md:space-y-2">
                        <label className="text-xs md:text-sm font-bold text-white/80 ml-1">Your Experience</label>
                        <textarea
                          {...register('content', { required: 'Content is required', minLength: { value: 20, message: 'Minimum 20 characters' } })}
                          rows={4}
                          placeholder="How did we help you?"
                          className="w-full bg-white/10 border border-white/20 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-white/50 transition-all placeholder:text-white/30 resize-none"
                        ></textarea>
                        {errors.content && <span className="text-red-200 text-[10px] md:text-xs ml-1">{errors.content.message}</span>}
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-white text-primary font-bold py-3.5 md:py-5 rounded-xl md:rounded-2xl hover:bg-stone-50 transition-all shadow-xl flex items-center justify-center space-x-2 disabled:opacity-70 text-sm md:text-base"
                      >
                        {submitting ? (
                          <Loader2 className="animate-spin" size={18} md:size={20} />
                        ) : (
                          <>
                            <span>Submit Story</span>
                            <Send size={16} md:size={18} />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
