import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';

interface HeroSlide {
  id: string;
  imageURL: string;
  captionText: string;
  title?: string;
  order?: number;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: '1',
    title: 'Mission Overview',
    captionText: 'Empowering underprivileged communities through education and social welfare initiatives.',
    imageURL: 'https://res.cloudinary.com/dbdx1mxd5/image/upload/v1773523690/samples/radial_02.jpg',
  },
  {
    id: '2',
    title: 'Madarsa Modernization',
    captionText: 'Bridging tradition with digital literacy to prepare students for the modern world.',
    imageURL: 'https://res.cloudinary.com/dbdx1mxd5/image/upload/v1773092756/gi8v9n1ognb24koiw44y.jpg',
  },
  {
    id: '3',
    title: 'Free Career Counseling',
    captionText: 'Expert guidance for Medical, Engineering, Law, and UPSC aspirants.',
    imageURL: 'https://res.cloudinary.com/dbdx1mxd5/image/upload/v1774861571/WhatsApp_Image_2026-03-30_at_2.25.50_PM_evyafn.jpg',
  },
  {
    id: '4',
    title: 'Silent & Public Libraries',
    captionText: 'Providing a peaceful sanctuary for knowledge and focused learning.',
    imageURL: 'https://res.cloudinary.com/dbdx1mxd5/image/upload/v1774644703/sample.jpg',
  },
  {
    id: '5',
    title: 'Legal Aid Clinic',
    captionText: 'Assistance with Voter ID, PAN cards, and essential documentation for the community.',
    imageURL: 'https://res.cloudinary.com/dbdx1mxd5/image/upload/v1773524471/cld-sample.jpg',
  },
  {
    id: '6',
    title: 'Community Outreach',
    captionText: 'Providing essential supplies like clothes, blankets, and school bags to empower families and support the education of every soul.',
    imageURL: 'https://res.cloudinary.com/dbdx1mxd5/image/upload/v1773180883/x58ptkdxzfpnnsmr1n3p.jpg',
  },
];

const HeroCarousel = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const q = query(collection(db, 'hero_slides'), orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        const fetchedSlides = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as HeroSlide[];

        if (fetchedSlides.length > 0) {
          setSlides(fetchedSlides);
        } else {
          setSlides(DEFAULT_SLIDES);
        }
      } catch (error: any) {
        if (error.code === 'permission-denied') {
          console.warn("Hero slides: Using default slides (Firestore permissions not yet configured).");
        } else {
          console.error("Error fetching hero slides:", error);
        }
        setSlides(DEFAULT_SLIDES);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (loading || slides.length === 0 || isHovered) return;

    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [loading, slides.length, nextSlide, isHovered]);

  if (loading) {
    return (
      <div className="h-[90vh] w-full flex items-center justify-center bg-stone-100">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <section 
      className="relative h-[70vh] sm:h-[80vh] md:h-[90vh] w-full overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slides[currentIndex].id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "tween", duration: 0.8, ease: "easeInOut" },
            opacity: { duration: 0.8 }
          }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentIndex].imageURL}
            alt={slides[currentIndex].title || 'Hero Slide'}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 md:p-20 text-white">
            <div className="section-container">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="max-w-4xl"
              >
                {slides[currentIndex].title && (
                  <h2 className="fluid-heading mb-3 md:mb-6 text-white drop-shadow-lg">
                    {slides[currentIndex].title}
                  </h2>
                )}
                <p className="text-base sm:text-lg md:text-2xl text-white/90 max-w-3xl leading-relaxed drop-shadow-md">
                  {slides[currentIndex].captionText}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/20 text-white backdrop-blur-sm opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-black/40 z-20"
      >
        <ChevronLeft size={24} className="sm:w-8 sm:h-8" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/20 text-white backdrop-blur-sm opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-black/40 z-20"
      >
        <ChevronRight size={24} className="sm:w-8 sm:h-8" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary w-8' 
                : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
