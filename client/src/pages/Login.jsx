import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const result = await login(formData.email, formData.password);
        setLoading(false);
        if (result?.success) {
            navigate('/');
        } else {
            setError(result?.error || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-6 py-20 bg-slate-50/30 dark:bg-transparent">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 md:p-14 space-y-10"
            >
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black font-serif tracking-tight">Welcome back.</h1>
                    <p className="text-slate-500 font-medium tracking-wide">Enter your details to sign in to your account.</p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold"
                        >
                            <AlertCircle size={18} className="shrink-0" />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" size={18} />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={formData.email}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 outline-none transition-all text-sm font-medium"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" size={18} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 outline-none transition-all text-sm font-medium"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full font-black text-sm hover:opacity-90 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={18} />
                    </button>
                </form>

                <p className="text-center text-sm font-bold text-slate-400">
                    No account? <Link to="/signup" className="text-medium-green hover:underline">Create one</Link>
                </p>

                <p className="text-[10px] text-center text-slate-400 max-w-xs mx-auto leading-relaxed">
                    By signing in, you agree to our Terms of Service and Privacy Policy. Click to learn more about how we use your data.
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
