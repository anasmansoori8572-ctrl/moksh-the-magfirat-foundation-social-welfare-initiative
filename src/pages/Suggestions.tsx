import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { motion } from 'motion/react';
import { Send, MessageSquare, CheckCircle, Info, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

interface SuggestionForm {
  name: string;
  email: string;
  content: string;
}

const Suggestions = () => {
  const { isAdmin } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SuggestionForm>();

  const onSubmit = async (data: SuggestionForm) => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'suggestions'), {
        ...data,
        createdAt: Timestamp.now()
      });
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting suggestion:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
      <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="px-2 sm:px-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] md:text-sm font-bold tracking-wide uppercase mb-4 md:mb-6">
              Your Voice Matters
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-4 md:mb-8">
              Help Us <span className="text-primary italic">Grow</span>
            </h1>
            <p className="text-base md:text-xl text-stone-600 leading-relaxed mb-8 md:mb-10">
              We value your ideas and feedback. Whether it's a new initiative, an improvement to our current programs, or a general suggestion, we want to hear from you.
            </p>

            {isAdmin && (
              <Link 
                to="/admin/suggestions"
                className="inline-flex items-center space-x-2 bg-stone-900 text-white px-5 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/20 mb-8 md:mb-10 text-sm md:text-base"
              >
                <Settings size={18} />
                <span>Manage Suggestions</span>
              </Link>
            )}

            <div className="space-y-6 md:space-y-8">
              {[
                {
                  title: 'No Language Barrier',
                  desc: 'Feel free to write in any language you are comfortable with. Our team will use AI to translate and understand your message.',
                  icon: MessageSquare
                },
                {
                  title: 'Direct Impact',
                  desc: 'Every suggestion is reviewed by our core team and the founder, Syed Sharif Ahmad.',
                  icon: Info
                }
              ].map((item) => (
                <div key={item.title} className="flex items-start space-x-4">
                  <div className="bg-secondary p-2.5 md:p-3 rounded-xl md:rounded-2xl text-primary shrink-0">
                    <item.icon size={20} md:size={24} />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-stone-900 mb-1">{item.title}</h3>
                    <p className="text-sm md:text-base text-stone-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 md:p-12 rounded-[1.5rem] md:rounded-[3rem] earthy-shadow relative mx-2 sm:mx-0"
        >
          {submitted ? (
            <div className="text-center py-8 md:py-12">
              <div className="bg-primary/10 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <CheckCircle className="text-primary" size={32} md:size={40} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-stone-900 mb-3 md:mb-4">Thank You!</h2>
              <p className="text-sm md:text-base text-stone-600 mb-6 md:mb-8">
                Your suggestion has been received. We appreciate you taking the time to help us improve.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-primary font-bold hover:underline text-sm md:text-base"
              >
                Send another suggestion
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm font-bold text-stone-700 ml-1">Your Name</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-stone-50 border-stone-200 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                  {errors.name && <span className="text-red-500 text-[10px] md:text-xs ml-1">{errors.name.message}</span>}
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm font-bold text-stone-700 ml-1">Email Address</label>
                  <input
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                    })}
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-stone-50 border-stone-200 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                  {errors.email && <span className="text-red-500 text-[10px] md:text-xs ml-1">{errors.email.message}</span>}
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-xs md:text-sm font-bold text-stone-700 ml-1">Your Suggestion</label>
                <textarea
                  {...register('content', { required: 'Content is required', minLength: { value: 10, message: 'Minimum 10 characters' } })}
                  rows={4}
                  placeholder="Tell us what's on your mind..."
                  className="w-full bg-stone-50 border-stone-200 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                ></textarea>
                {errors.content && <span className="text-red-500 text-[10px] md:text-xs ml-1">{errors.content.message}</span>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-bold py-3.5 md:py-5 rounded-xl md:rounded-2xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center space-x-2 disabled:opacity-70 text-sm md:text-base"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <span>Submit Suggestion</span>
                    <Send size={16} md:size={20} />
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Suggestions;
