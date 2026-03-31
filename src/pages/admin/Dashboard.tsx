import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Image as ImageIcon, 
  MessageSquare, 
  Heart, 
  FileText,
  ArrowUpRight,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Wifi,
  List,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    initiatives: 0,
    gallery: 0,
    testimonials: 0,
    suggestions: 0,
    playbook: 0
  });
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const collections = ['initiatives', 'gallery', 'testimonials', 'suggestions', 'impactPlaybook'];
        const results = await Promise.allSettled(
          collections.map(col => getDocs(collection(db, col)))
        );
        
        const counts = results.map(res => res.status === 'fulfilled' ? res.value.size : 0);

        setStats({
          initiatives: counts[0],
          gallery: counts[1],
          testimonials: counts[2],
          suggestions: counts[3],
          playbook: counts[4]
        });

        const failed = results.filter(res => res.status === 'rejected');
        if (failed.length > 0) {
          console.warn(`${failed.length} collections failed to load due to permissions.`);
          setConnectionError("Some stats couldn't be loaded. Check Firestore rules.");
        } else {
          setConnectionError(null);
        }
      } catch (error: any) {
        console.error("Error fetching stats:", error);
        setConnectionError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const menuItems = [
    { name: 'Initiatives', count: stats.initiatives, icon: BookOpen, color: 'bg-blue-500', path: '/admin/initiatives' },
    { name: 'Gallery', count: stats.gallery, icon: ImageIcon, color: 'bg-purple-500', path: '/admin/gallery' },
    { name: 'Testimonials', count: stats.testimonials, icon: MessageSquare, color: 'bg-emerald-500', path: '/admin/testimonials' },
    { name: 'Suggestions', count: stats.suggestions, icon: FileText, color: 'bg-amber-500', path: '/admin/suggestions' },
    { name: 'How We Do It!', count: stats.playbook, icon: List, color: 'bg-indigo-500', path: '/admin/playbook' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-1 md:mb-2">Admin Dashboard</h1>
          <p className="text-sm md:text-base text-stone-500">Welcome back! Here's an overview of Moksh – The Magfirat Foundation.</p>
        </div>
        <div className="flex">
          <Link
            to="/admin/initiatives"
            className="w-full md:w-auto bg-primary text-white px-6 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm md:text-base"
          >
            <Plus size={18} md:size={20} />
            <span>New Initiative</span>
          </Link>
        </div>
      </div>

      {/* System Status Check */}
      <div className="mb-8 md:mb-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className={`p-5 md:p-6 rounded-2xl md:rounded-3xl flex items-center space-x-4 border-2 ${isAdmin ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
          <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${isAdmin ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
            {isAdmin ? <ShieldCheck size={20} md:size={24} /> : <ShieldAlert size={20} md:size={24} />}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-stone-500 mb-0.5 md:mb-1">Admin Status</p>
            <p className={`font-bold text-sm md:text-base ${isAdmin ? 'text-emerald-700' : 'text-red-700'}`}>
              {isAdmin ? 'Verified Admin' : 'Access Restricted'}
            </p>
            <p className="text-[9px] md:text-[10px] text-stone-400 font-mono mt-0.5 md:mt-1 truncate">UID: {user?.uid}</p>
          </div>
        </div>
        <div className={`p-5 md:p-6 rounded-2xl md:rounded-3xl flex items-center space-x-4 border-2 ${!connectionError ? 'bg-blue-50 border-blue-100' : 'bg-amber-50 border-amber-100'}`}>
          <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${!connectionError ? 'bg-blue-500 text-white' : 'bg-amber-500 text-white'}`}>
            <Wifi size={20} md:size={24} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-stone-500 mb-0.5 md:mb-1">Database Connectivity</p>
            <p className={`font-bold text-sm md:text-base ${!connectionError ? 'text-blue-700' : 'text-amber-700'}`}>
              {!connectionError ? 'Connected to Firestore' : 'Connection Error'}
            </p>
            {connectionError && <p className="text-[9px] md:text-[10px] text-amber-600 mt-0.5 md:mt-1 truncate">{connectionError}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-12">
        {menuItems.map((item, idx) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-[#F5F5F0]/70 backdrop-blur-md p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] earthy-shadow group relative overflow-hidden border border-white/20"
          >
            <div className={`absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 ${item.color} opacity-5 rounded-bl-full`}></div>
            <div className={`${item.color} w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 shadow-lg shadow-current/20`}>
              <item.icon size={20} md:size={24} />
            </div>
            <div className="text-2xl md:text-3xl font-bold text-stone-900 mb-0.5 md:mb-1">
              {loading ? '...' : item.count}
            </div>
            <div className="text-sm md:text-base text-stone-500 font-medium mb-4 md:mb-6">{item.name}</div>
            <Link
              to={item.path}
              className="flex items-center text-xs md:text-sm font-bold text-primary group-hover:translate-x-1 transition-transform"
            >
              Manage <ArrowUpRight className="ml-1" size={14} md:size={16} />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Recent Activity or Quick Actions could go here */}
        <div className="bg-[#F5F5F0]/70 backdrop-blur-md p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] earthy-shadow border border-white/20">
          <h2 className="text-xl md:text-2xl font-bold text-stone-900 mb-6 md:mb-8">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <Link to="/admin/gallery" className="p-4 md:p-6 bg-stone-50 rounded-2xl md:rounded-3xl hover:bg-secondary transition-colors text-center group">
              <ImageIcon className="mx-auto mb-2 md:mb-3 text-stone-400 group-hover:text-primary transition-colors" size={24} md:size={32} />
              <span className="font-bold text-stone-700 text-sm md:text-base">Upload Photos</span>
            </Link>
            <Link to="/admin/testimonials" className="p-4 md:p-6 bg-stone-50 rounded-2xl md:rounded-3xl hover:bg-secondary transition-colors text-center group">
              <MessageSquare className="mx-auto mb-2 md:mb-3 text-stone-400 group-hover:text-primary transition-colors" size={24} md:size={32} />
              <span className="font-bold text-stone-700 text-sm md:text-base">Review Stories</span>
            </Link>
            <Link to="/admin/suggestions" className="p-4 md:p-6 bg-stone-50 rounded-2xl md:rounded-3xl hover:bg-secondary transition-colors text-center group">
              <FileText className="mx-auto mb-2 md:mb-3 text-stone-400 group-hover:text-primary transition-colors" size={24} md:size={32} />
              <span className="font-bold text-stone-700 text-sm md:text-base">Read Feedback</span>
            </Link>
            <Link to="/admin/playbook" className="p-4 md:p-6 bg-stone-50 rounded-2xl md:rounded-3xl hover:bg-secondary transition-colors text-center group">
              <List className="mx-auto mb-2 md:mb-3 text-stone-400 group-hover:text-primary transition-colors" size={24} md:size={32} />
              <span className="font-bold text-stone-700 text-sm md:text-base">How We Do It!</span>
            </Link>
          </div>
        </div>

        <div className="bg-primary rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Foundation Info</h2>
            <div className="space-y-4 md:space-y-6">
              <div>
                <p className="text-white/60 text-[10px] md:text-sm font-bold uppercase tracking-wider mb-0.5 md:mb-1">Founder</p>
                <p className="text-lg md:text-xl font-medium">Syed Sharif Ahmad</p>
              </div>
              <div>
                <p className="text-white/60 text-[10px] md:text-sm font-bold uppercase tracking-wider mb-0.5 md:mb-1">Contact</p>
                <p className="text-base md:text-lg">+91 8858272425</p>
                <p className="text-base md:text-lg">themoksh.org@gmail.com</p>
              </div>
              <div>
                <p className="text-white/60 text-[10px] md:text-sm font-bold uppercase tracking-wider mb-0.5 md:mb-1">Location</p>
                <p className="text-base md:text-lg">Moksh Library, Kanpur, UP</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
