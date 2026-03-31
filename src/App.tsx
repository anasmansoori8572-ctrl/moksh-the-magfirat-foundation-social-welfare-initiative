import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import SmoothScroll from './components/SmoothScroll';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Initiatives = lazy(() => import('./pages/Initiatives'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Suggestions = lazy(() => import('./pages/Suggestions'));
const Contact = lazy(() => import('./pages/Contact'));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageInitiatives = lazy(() => import('./pages/admin/ManageInitiatives'));
const ManageGallery = lazy(() => import('./pages/admin/ManageGallery'));
const ManageTestimonials = lazy(() => import('./pages/admin/ManageTestimonials'));
const ManageSuggestions = lazy(() => import('./pages/admin/ManageSuggestions'));
const ManagePlaybook = lazy(() => import('./pages/admin/ManagePlaybook'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-pulse flex flex-col items-center">
      <div className="w-16 h-16 bg-primary/20 rounded-full mb-4"></div>
      <div className="h-4 w-32 bg-stone-200 rounded"></div>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <SmoothScroll>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/initiatives" element={<Initiatives />} />
                  <Route path="/testimonials" element={<Testimonials />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/suggestions" element={<Suggestions />} />
                  <Route path="/contact" element={<Contact />} />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route 
                    path="/admin/dashboard" 
                    element={
                      <ProtectedRoute adminOnly>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/initiatives" 
                    element={
                      <ProtectedRoute adminOnly>
                        <ManageInitiatives />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/gallery" 
                    element={
                      <ProtectedRoute adminOnly>
                        <ManageGallery />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/testimonials" 
                    element={
                      <ProtectedRoute adminOnly>
                        <ManageTestimonials />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/suggestions" 
                    element={
                      <ProtectedRoute adminOnly>
                        <ManageSuggestions />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/playbook" 
                    element={
                      <ProtectedRoute adminOnly>
                        <ManagePlaybook />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </SmoothScroll>
      </Router>
    </AuthProvider>
  );
}

export default App;
