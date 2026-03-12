import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const EditPost = lazy(() => import('./pages/EditPost'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const BlogList = lazy(() => import('./pages/BlogList'));
const Membership = lazy(() => import('./pages/Membership'));

// Global suspense loader
const PageLoader = () => (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-medium-green animate-spin"></div>
    </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Toaster position="top-center" />
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/posts" element={<BlogList />} />
                  <Route path="/archive" element={<BlogList />} />
                  <Route path="/membership" element={<Membership />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  {/* Protected Routes */}
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/create" element={
                    <ProtectedRoute authorOnly={true}>
                      <CreatePost />
                    </ProtectedRoute>
                  } />
                  <Route path="/edit/:id" element={
                    <ProtectedRoute authorOnly={true}>
                      <EditPost />
                    </ProtectedRoute>
                  } />
                  <Route path="/posts/:id" element={<PostDetail />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
