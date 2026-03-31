import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Target, Eye, Heart, ShieldCheck, Clock, MapPin } from 'lucide-react';

import ReadMoreText from '../components/ReadMoreText';
import ClipReveal from '../components/ClipReveal';

const About = () => {
  const founderRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: founderRef,
    offset: ["start end", "end start"]
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const values = [
    { title: 'Transparency', desc: 'We maintain complete openness in our operations and fund utilization.', icon: ShieldCheck },
    { title: 'Empowerment', desc: 'We believe in giving people the tools to build their own future.', icon: Target },
    { title: 'Compassion', desc: 'Every action we take is rooted in deep empathy for our community.', icon: Heart },
    { title: 'Integrity', desc: 'We uphold the highest ethical standards in all our endeavors.', icon: Eye },
  ];

  const timeline = [
    { year: '2019', event: 'Moksh – The Magfirat Foundation was established with a small library.' },
    { year: '2020', event: 'Launched "Education for All" program during the pandemic.' },
    { year: '2021', event: 'Expanded to vocational training for local youth.' },
    { year: '2022', event: 'Reached a milestone of impacting 2000+ lives.' },
    { year: '2023', event: 'Inaugurated the new community center in Kanpur.' },
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <section className="bg-secondary/30 py-24 md:py-32">
        <div className="section-container text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-4 md:mb-6"
          >
            Our Story & <span className="text-primary italic">Mission</span>
          </motion.h1>
          <p className="text-base md:text-xl text-stone-600 max-w-2xl mx-auto px-4">
            Founded by Syed Sharif Ahmad, Moksh – The Magfirat is more than an NGO—it's a movement towards a more equitable society.
          </p>
        </div>
      </section>

      {/* Founder Message */}
      <section ref={founderRef} className="py-24 md:py-48 overflow-hidden">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-center">
            <div className="relative px-4 sm:px-0">
              <div className="aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden earthy-shadow">
                <motion.img
                  style={{ scale: imageScale }}
                  src="https://res.cloudinary.com/dbdx1mxd5/image/upload/v1773522526/cld-sample-3.jpg"
                  alt="Founder Syed Sharif Ahmad"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-2 md:-bottom-6 -left-2 md:-left-6 bg-white p-3 md:p-6 rounded-xl md:rounded-3xl shadow-xl border border-stone-100">
                <p className="font-bold text-stone-900 text-xs md:text-base">Syed Sharif Ahmad</p>
                <p className="text-primary text-[10px] md:text-sm font-medium">Founder & Visionary</p>
              </div>
            </div>
            <div className="pt-6 lg:pt-0 px-4 sm:px-0">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-stone-900 mb-4 md:mb-8 text-center lg:text-left">A Message from our Founder</h2>
              <ReadMoreText 
                className="text-sm md:text-lg text-stone-600 leading-relaxed italic text-center lg:text-left"
                lines={6}
                text={`"With a sincere vision to achieve the true purpose of Moksh, I, Syed Sharif Ahmed, have established the Moksh Library and Community Centre. It is a humble effort to understand the problems of our society and to search for meaningful and lasting solutions. Our mission is to bring positive change in the community by spreading awareness and opportunities. We believe that real progress comes by modern education, which opens minds and builds confidence. We believe in empowering the youth by technical education, so they can build a strong future. We also aim to strengthen individuals by skill centres, where practical abilities can grow. Through knowledge, guidance and unity, we hope to uplift our society step by step and create a brighter future for the coming generations."`}
              />
              <div className="mt-6 md:mt-10 flex items-center justify-center lg:justify-start space-x-4">
                <div className="w-8 md:w-12 h-px bg-stone-300"></div>
                <span className="font-bold text-stone-900 text-sm md:text-base">Syed Sharif Ahmad</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="py-16 md:py-32 bg-stone-50">
        <div className="section-container">
          <div className="grid md:grid-cols-2 gap-6 md:gap-12">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] earthy-shadow"
            >
              <div className="bg-primary/10 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-8">
                <Eye className="text-primary" size={24} md:size={28} />
              </div>
              <h3 className="text-xl md:text-3xl font-bold text-stone-900 mb-3 md:mb-6">Our Vision</h3>
              <p className="text-sm md:text-lg text-stone-600 leading-relaxed">
                To create a society where education is accessible to all, regardless of their socio-economic background, and where community support systems ensure no one is left behind.
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-primary p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] text-white shadow-2xl shadow-primary/20"
            >
              <div className="bg-white/20 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-8">
                <Target className="text-white" size={24} md:size={28} />
              </div>
              <h3 className="text-xl md:text-3xl font-bold mb-3 md:mb-6">Our Mission</h3>
              <p className="text-sm md:text-lg text-white/80 leading-relaxed">
                To empower underprivileged communities through sustainable educational programs, vocational training, and comprehensive social welfare initiatives that foster self-reliance and dignity.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 md:py-48">
        <div className="section-container">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-4 md:mb-6">Our Core Values</h2>
            <p className="text-sm md:text-lg text-stone-600 max-w-2xl mx-auto px-4">
              These principles guide every decision we make and every action we take at Moksh – The Magfirat Foundation.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="text-center p-5 md:p-8 rounded-2xl md:rounded-3xl bg-secondary/20 hover:bg-secondary/40 transition-all hover:scale-105 duration-300">
                <div className="bg-white w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm">
                  <value.icon className="text-primary" size={20} md:size={24} />
                </div>
                <h4 className="text-base md:text-xl font-bold text-stone-900 mb-2 md:mb-3">{value.title}</h4>
                <p className="text-xs md:text-base text-stone-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 md:py-48 bg-stone-900 text-white overflow-hidden">
        <div className="section-container">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Our Journey</h2>
            <p className="text-stone-400 text-sm md:text-base px-4">A look back at the milestones that shaped us.</p>
          </div>
          <div className="relative px-4 sm:px-0">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-800 hidden lg:block"></div>
            <div className="space-y-8 md:space-y-12">
              {timeline.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col lg:flex-row items-center ${idx % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className="flex-1 w-full lg:w-auto">
                    <div className={`p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-stone-800 border border-stone-700 ${idx % 2 === 0 ? 'lg:mr-12' : 'lg:ml-12'}`}>
                      <span className="text-primary font-bold text-lg md:text-xl mb-2 block">{item.year}</span>
                      <p className="text-stone-300 text-sm md:text-lg">{item.event}</p>
                    </div>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full border-4 border-stone-900 z-10 hidden lg:flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                  <div className="flex-1 hidden lg:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 md:py-48">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-center">
            <div className="text-center lg:text-left px-4 sm:px-0">
              <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-4 md:mb-6">Visit Us</h2>
              <p className="text-sm md:text-lg text-stone-600 mb-6 md:mb-10">
                Our doors are always open to those who wish to learn, volunteer, or support our cause. Visit us at our main center in Kanpur.
              </p>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center lg:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm md:text-base">Address</h4>
                    <p className="text-xs md:text-sm text-stone-600">Moksh Library, Kanpur, Uttar Pradesh, India</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] md:rounded-[3rem] overflow-hidden earthy-shadow h-[300px] md:h-[450px] mx-4 sm:mx-0">
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
        </div>
      </section>
    </div>
  );
};

export default About;
