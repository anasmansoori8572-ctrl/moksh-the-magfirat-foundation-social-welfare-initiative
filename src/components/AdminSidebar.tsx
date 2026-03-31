import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Image as ImageIcon, 
  MessageSquare, 
  Heart, 
  FileText,
  LogOut,
  ChevronRight,
  List,
  Target
} from 'lucide-react';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Initiatives', icon: BookOpen, path: '/admin/initiatives' },
    { name: 'Gallery', icon: ImageIcon, path: '/admin/gallery' },
    { name: 'Testimonials', icon: MessageSquare, path: '/admin/testimonials' },
    { name: 'Suggestions', icon: FileText, path: '/admin/suggestions' },
    { name: 'How We Do It!', icon: List, path: '/admin/playbook' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="w-64 bg-[#F5F5F0]/70 backdrop-blur-md border-r border-white/20 min-h-screen sticky top-20 hidden lg:block">
      <div className="p-8">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                location.pathname === item.path
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-stone-500 hover:bg-stone-50 hover:text-primary'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={18} />
                <span>{item.name}</span>
              </div>
              {location.pathname === item.path && <ChevronRight size={14} />}
            </Link>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-stone-100">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
