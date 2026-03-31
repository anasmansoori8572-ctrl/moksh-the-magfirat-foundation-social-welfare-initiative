import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<ContactForm>();

  const onSubmit = (data: ContactForm) => {
    console.log(data);
    // In a real app, you'd send this to an API or Firebase
    alert("Thank you for your message! We will get back to you soon.");
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-stone-50">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://res.cloudinary.com/dbdx1mxd5/image/upload/v1774861159/Gemini_Generated_Image_sexm8tsexm8tsexm_amdzbo.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-50/30 via-stone-50/50 to-stone-50"></div>
        </div>
        <div className="section-container text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-4 md:mb-6"
          >
            Get in <span className="text-primary italic">Touch</span>
          </motion.h1>
          <p className="text-base md:text-xl text-stone-600 max-w-2xl mx-auto px-4">
            Have questions or want to get involved? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-24 md:py-48">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-20">
            {/* Contact Info */}
            <div className="px-4 sm:px-0">
              <h2 className="text-2xl md:text-4xl font-bold text-stone-900 mb-6 md:mb-8">Contact Information</h2>
              <div className="space-y-5 md:space-y-8">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="bg-primary/10 p-2.5 md:p-4 rounded-xl md:rounded-2xl text-primary shrink-0">
                    <MapPin size={18} md:size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm md:text-lg">Our Location</h3>
                    <p className="text-xs md:text-base text-stone-600">Moksh Library, Kanpur, Uttar Pradesh, India</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="bg-primary/10 p-2.5 md:p-4 rounded-xl md:rounded-2xl text-primary shrink-0">
                    <Phone size={18} md:size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm md:text-lg">Phone Number</h3>
                    <p className="text-xs md:text-base text-stone-600">+91 8858272425, +91 7007397430</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="bg-primary/10 p-2.5 md:p-4 rounded-xl md:rounded-2xl text-primary shrink-0">
                    <Mail size={18} md:size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm md:text-lg">Email Address</h3>
                    <p className="text-xs md:text-base text-stone-600 break-all">themoksh.org@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="bg-primary/10 p-2.5 md:p-4 rounded-xl md:rounded-2xl text-primary shrink-0">
                    <Clock size={18} md:size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm md:text-lg">Working Hours</h3>
                    <p className="text-xs md:text-base text-stone-600">9:00 AM - 10:00 PM (All Days)</p>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
              <div className="mt-8 md:mt-12 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden earthy-shadow h-[250px] md:h-[400px]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3573.0134232802166!2d80.4041087!3d26.423043399999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399c41d018762b59%3A0xc95c2f64be23177e!2sMoksh%20Library!5e0!3m2!1sen!2sin!4v1772459491483!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] earthy-shadow mx-4 sm:mx-0"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-6 md:mb-8">Send us a Message</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm font-bold text-stone-700 ml-1">Full Name</label>
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
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm font-bold text-stone-700 ml-1">Subject</label>
                  <input
                    {...register('subject', { required: 'Subject is required' })}
                    type="text"
                    placeholder="How can we help?"
                    className="w-full bg-stone-50 border-stone-200 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                  {errors.subject && <span className="text-red-500 text-[10px] md:text-xs ml-1">{errors.subject.message}</span>}
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-xs md:text-sm font-bold text-stone-700 ml-1">Message</label>
                  <textarea
                    {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Minimum 10 characters' } })}
                    rows={4}
                    placeholder="Your message..."
                    className="w-full bg-stone-50 border-stone-200 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  ></textarea>
                  {errors.message && <span className="text-red-500 text-[10px] md:text-xs ml-1">{errors.message.message}</span>}
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white font-bold py-3.5 md:py-5 rounded-xl md:rounded-2xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20 flex items-center justify-center space-x-2 text-sm md:text-base"
                >
                  <span>Send Message</span>
                  <Send size={16} md:size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
