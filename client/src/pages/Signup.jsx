import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Please enter your full name.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role
        });
        setLoading(false);

        if (result?.success) {
            navigate('/');
        } else {
            setError(result?.error || 'Registration failed. Please try again.');
        }
    };

    const passwordsMatch = formData.password.length >= 6 && formData.password === formData.confirmPassword;

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-6 py-20 bg-slate-50/30 dark:bg-transparent">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 md:p-14 space-y-10"
            >
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black font-serif tracking-tight">Join BlogApp.</h1>
                    <p className="text-slate-500 font-medium tracking-wide">Create an account to start writing and reading.</p>
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
                        {/* Name */}
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Full name"
                                value={formData.name}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 outline-none transition-all text-sm font-medium"
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Email */}
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

                        {/* Password */}
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" size={18} />
                            <input
                                type="password"
                                placeholder="Password (min. 6 characters)"
                                value={formData.password}
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 outline-none transition-all text-sm font-medium"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors" size={18} />
                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                className={`w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800/50 border rounded-2xl focus:ring-2 outline-none transition-all text-sm font-medium ${formData.confirmPassword
                                        ? passwordsMatch
                                            ? 'border-green-300 dark:border-green-700 focus:ring-green-200'
                                            : 'border-red-300 dark:border-red-700 focus:ring-red-200'
                                        : 'border-slate-100 dark:border-slate-700 focus:ring-slate-200 dark:focus:ring-slate-600'
                                    }`}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                            />
                            {formData.confirmPassword && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {passwordsMatch ? (
                                        <CheckCircle size={18} className="text-green-500" />
                                    ) : (
                                        <AlertCircle size={18} className="text-red-400" />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'user' })}
                                className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${formData.role === 'user' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white' : 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'}`}
                            >
                                Reader
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'author' })}
                                className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${formData.role === 'author' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white' : 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'}`}
                            >
                                Writer
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full font-black text-sm hover:opacity-90 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Creating account...' : 'Get Started'} <ArrowRight size={18} />
                    </button>
                </form>

                <p className="text-center text-sm font-bold text-slate-400">
                    Already have an account? <Link to="/login" className="text-medium-green hover:underline">Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
