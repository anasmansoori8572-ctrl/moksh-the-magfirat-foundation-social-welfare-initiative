import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { PlaybookEntry } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Languages, Loader2, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ImpactPlaybook = () => {
  const [entries, setEntries] = useState<PlaybookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState<string | null>(null);
  const [translations, setTranslations] = useState<Record<string, { title: string; steps: string[] }>>({});
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPlaybook = async () => {
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
          console.warn("Firestore permissions denied for 'impactPlaybook'. Please update your security rules.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlaybook();
  }, []);

  const handleTranslate = async (entry: PlaybookEntry) => {
    if (translations[entry.id]) {
      // Toggle back if already translated
      const newTranslations = { ...translations };
      delete newTranslations[entry.id];
      setTranslations(newTranslations);
      return;
    }

    setTranslating(entry.id);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const stepsPrompt = entry.steps.map((s, i) => `Step ${i + 1}: ${s}`).join('\n');
      const prompt = `Translate the following NGO impact playbook entry into Hindi. 
      Keep the tone professional and instructional.
      
      Title: ${entry.title}
      ${stepsPrompt}
      
      Return the translation in JSON format with keys: "title" (string) and "steps" (array of strings).`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text);
      setTranslations(prev => ({
        ...prev,
        [entry.id]: {
          title: result.title,
          steps: result.steps
        }
      }));
    } catch (error) {
      console.error("Translation error:", error);
      alert("Failed to translate. Please try again.");
    } finally {
      setTranslating(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedEntries(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <section className="py-24 md:py-48 bg-stone-50 overflow-hidden">
      <div className="section-container">
        <div className="text-center mb-12 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-4 md:mb-6"
          >
            How We Do It!
          </motion.h2>
          <p className="text-base md:text-xl text-stone-600 max-w-2xl mx-auto px-4">
            Actionable, low-cost roadmaps for social change. Follow our guides to replicate these impacts in your own community.
          </p>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-16 md:py-24 bg-white rounded-[1.5rem] md:rounded-[3rem] border-2 border-dashed border-stone-200 mx-4">
            <CheckCircle2 className="mx-auto text-stone-200 mb-4 md:mb-6" size={40} md:size={56} />
            <p className="text-stone-500 font-medium italic text-sm md:text-lg px-4">New impact roadmaps are being prepared. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-4 sm:px-0">
            {entries.map((entry, index) => {
              const translation = translations[entry.id];
              const displayTitle = translation ? translation.title : entry.title;
              const displaySteps = translation ? translation.steps : entry.steps;
              const isExpanded = expandedEntries.has(entry.id);
              const visibleSteps = isExpanded ? displaySteps : displaySteps.slice(0, 3);

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden earthy-shadow flex flex-col group h-full hover:shadow-2xl transition-all"
                >
                  {/* Visual Proof */}
                  <div className="h-48 sm:h-64 md:h-72 overflow-hidden relative">
                    <img
                      src={entry.imageUrl}
                      alt={entry.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 inline-flex items-center space-x-2 bg-primary/90 text-white px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                      <CheckCircle2 size={12} md:size={14} />
                      <span>Roadmap</span>
                    </div>
                  </div>

                  {/* Instructional Content */}
                  <div className="p-6 md:p-10 flex flex-col flex-grow space-y-6 md:space-y-8">
                    <h3 className="text-xl md:text-2xl font-bold text-stone-900 leading-tight min-h-[3rem] md:min-h-[4rem] flex items-center">
                      {displayTitle}
                    </h3>

                    <div className="space-y-4 md:space-y-5 relative flex-grow">
                      {/* Vertical Line */}
                      <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-stone-100"></div>

                      <AnimatePresence mode="popLayout">
                        {visibleSteps.map((step, sIdx) => (
                          <motion.div 
                            key={sIdx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-start space-x-3 md:space-x-4 relative z-10"
                          >
                            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white border border-primary text-primary text-[10px] md:text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                              {sIdx + 1}
                            </div>
                            <p className={`text-sm md:text-base text-stone-600 pt-0.5 md:pt-1 leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
                              {step}
                            </p>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <div className="pt-2 md:pt-4 flex flex-col gap-3 md:gap-4">
                      <button
                        onClick={() => handleTranslate(entry)}
                        disabled={translating === entry.id}
                        className="w-full inline-flex items-center justify-center space-x-2 bg-stone-100 text-stone-600 px-5 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-stone-200 transition-all disabled:opacity-50 active:scale-95 text-sm md:text-base"
                      >
                        {translating === entry.id ? (
                          <Loader2 className="animate-spin" size={18} md:size={20} />
                        ) : (
                          <Languages size={18} md:size={20} />
                        )}
                        <span>{translation ? 'Original' : 'Translate (Hindi)'}</span>
                      </button>
                      
                      <button 
                        onClick={() => toggleExpand(entry.id)}
                        className="w-full inline-flex items-center justify-center space-x-2 bg-primary text-white px-5 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 text-sm md:text-base"
                      >
                        <span>{isExpanded ? 'Show Less' : 'Full Guide'}</span>
                        <ArrowRight size={18} md:size={20} className={`transition-transform duration-300 ${isExpanded ? '-rotate-90' : ''}`} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ImpactPlaybook;
