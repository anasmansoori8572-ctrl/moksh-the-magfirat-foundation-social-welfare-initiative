import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Users, Heart, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import ReadMoreText from '../components/ReadMoreText';
import ImpactPlaybook from '../components/ImpactPlaybook';
import ClipReveal from '../components/ClipReveal';
import TiltCard from '../components/TiltCard';

const Home = () => {
  const pillars = [
    { title: 'Empowerment', subtext: 'Uplifting the underprivileged through direct support.', icon: Users },
    { title: 'Modernization', subtext: 'Bringing digital tools and teachers to local Madrasas.', icon: BookOpen },
    { title: 'Welfare', subtext: 'Distributing essential supplies like clothes and blankets.', icon: Heart },
    { title: 'Mentorship', subtext: 'Providing career guidance for medical and law aspirants.', icon: Award },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Core Impact Pillars Section */}
      <section className="py-16 md:py-32 bg-stone-50/50">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {pillars.map((pillar, index) => (
              <TiltCard key={pillar.title} className="h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 md:p-8 lg:p-10 rounded-3xl earthy-shadow text-center hover:scale-[1.02] transition-all duration-300 flex flex-col items-center justify-center h-full"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-4 md:mb-6" style={{ backgroundColor: '#B2AC8820' }}>
                    <pillar.icon style={{ color: '#B2AC88' }} size={24} md:size={28} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-stone-900 mb-2 md:mb-3 uppercase tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-stone-500 text-sm md:text-base leading-relaxed max-w-[240px] mx-auto">
                    {pillar.subtext}
                  </p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Preview */}
      <section className="py-24 md:py-48">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-center">
            <div className="relative">
              <div className="flex flex-col md:block relative">
                <div className="aspect-[4/3] sm:aspect-video md:aspect-[4/5] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl relative group">
                  <img
                    src="https://res.cloudinary.com/dbdx1mxd5/image/upload/v1773398283/cld-sample-4.jpg"
                    alt="Education"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {/* Desktop Overlay */}
                  <div className="hidden md:flex absolute inset-0 bg-gradient-to-l from-stone-900/70 via-stone-900/20 to-transparent items-center justify-end p-16">
                    <motion.div
                      initial={{ opacity: 0, x: -100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="text-left max-w-sm"
                    >
                      <ClipReveal delay={0.2}>
                        <h3 className="text-white fluid-heading mb-4 drop-shadow-2xl">
                          EMPOWERING<br />
                          THE NEXT<br />
                          GENERATION
                        </h3>
                      </ClipReveal>
                      <div className="w-20 h-2 bg-primary mr-auto rounded-full shadow-lg"></div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Mobile Content (Stacked) */}
                <div className="md:hidden bg-[#F5F5F0] p-6 sm:p-12 rounded-b-[1.5rem] -mt-6 relative z-10 shadow-xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <ClipReveal delay={0.2}>
                      <h3 className="text-stone-900 text-2xl sm:text-3xl font-bold mb-3 uppercase tracking-tight leading-tight">
                        EMPOWERING<br />
                        THE NEXT<br />
                        GENERATION
                      </h3>
                    </ClipReveal>
                    <div className="w-16 h-1.5 bg-primary rounded-full"></div>
                  </motion.div>
                </div>
              </div>
              
              <div className="absolute -bottom-10 -right-10 bg-primary p-8 lg:p-10 rounded-[2rem] text-white hidden lg:block max-w-xs shadow-2xl">
                <p className="text-lg font-medium italic">
                  "Education is the most powerful weapon which you can use to change the world."
                </p>
                <p className="mt-4 font-bold">— Nelson Mandela</p>
              </div>
            </div>
            <div className="pt-6 lg:pt-0">
              <ClipReveal>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-4 md:mb-8 leading-tight group">
                  Our <motion.span 
                    whileHover={{ letterSpacing: '0.1em' }}
                    transition={{ duration: 0.4 }}
                    className="text-primary cursor-default inline-block"
                  >Motive</motion.span> for a <span className="text-primary">Better Tomorrow</span>
                </h2>
              </ClipReveal>
              <ReadMoreText 
                className="text-sm md:text-lg text-stone-600 leading-relaxed mb-6 md:mb-8"
                lines={4}
                text={`At Moksh – The Magfirat Foundation, we focus on bridging the gap in educational resources and social support. Our foundation works tirelessly to provide quality education, vocational training, and social welfare programs to underprivileged communities.

We believe that every individual has the potential to succeed if given the right opportunities. Our programs are designed to empower people with the skills and knowledge they need to build a better future for themselves and their families.

Through our dedicated efforts, we aim to create a lasting impact on society and inspire others to join us in our mission of service and empowerment.`}
              />
              <ul className="grid sm:grid-cols-2 gap-3 md:gap-6 mb-8 md:mb-10">
                {[
                  'Quality Education for All',
                  'Social Welfare & Community Support',
                  'Vocational Training & Skill Development',
                  'Health & Wellness Initiatives',
                ].map((item) => (
                  <li key={item} className="flex items-center space-x-3 text-stone-700 font-medium">
                    <div className="bg-primary/20 p-1 rounded-full flex-shrink-0">
                      <ArrowRight className="text-primary" size={12} md:size={14} />
                    </div>
                    <span className="text-xs md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/about"
                className="inline-flex items-center text-primary font-bold hover:translate-x-2 transition-transform group text-sm md:text-base"
              >
                Read our full story <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} md:size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Initiatives Preview */}
      <section className="py-24 md:py-48 bg-stone-50">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-4 md:mb-6">Our Core Initiatives</h2>
            <p className="text-sm md:text-lg text-stone-600">
              Discover how we are making a tangible difference in the lives of people through our dedicated programs.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: 'Moksh Library',
                desc: 'A sanctuary for knowledge, providing free access to books and a peaceful study environment.',
                image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800'
              },
              {
                title: 'Education for All',
                desc: 'Supporting underprivileged children with school supplies, tutoring, and scholarships.',
                image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800'
              },
              {
                title: 'Community Welfare',
                desc: 'Providing essential support and resources to families in need during challenging times.',
                image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800'
              }
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="h-48 md:h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="text-xl md:text-2xl font-bold text-stone-900 mb-3 md:mb-4">{item.title}</h3>
                  <p className="text-sm md:text-base text-stone-600 mb-4 md:mb-6 leading-relaxed">{item.desc}</p>
                  <Link
                    to="/initiatives"
                    className="text-primary font-bold flex items-center group-hover:translate-x-2 transition-transform text-sm md:text-base"
                  >
                    Learn more <ArrowRight className="ml-2" size={16} md:size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Playbook Section */}
      <ImpactPlaybook />

      {/* CTA Section */}
      <section className="py-24 md:py-48">
        <div className="section-container">
          <div className="bg-primary rounded-[2.5rem] md:rounded-[3rem] p-8 sm:p-12 md:p-20 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 md:mb-8">Ready to Make an Impact?</h2>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 md:mb-12">
                Your support can change a life. Join us in our mission to empower communities through education and social welfare.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                <Link
                  to="/suggestions"
                  className="bg-white text-primary px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg hover:bg-stone-50 transition-all shadow-xl active:scale-95"
                >
                  Share a Suggestion
                </Link>
                <Link
                  to="/testimonials"
                  className="bg-primary-dark border-2 border-white/30 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg hover:bg-white/10 transition-all active:scale-95"
                >
                  Share Your Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
