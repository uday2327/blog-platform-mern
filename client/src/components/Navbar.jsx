import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Bell, FileEdit, Menu, X, User,
    LogOut, Settings, Bookmark, LayoutDashboard,
    Moon, Sun, ChevronDown
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
        const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (searchQuery.trim()) {
                navigate(`/posts?search=${searchQuery}`);
                setSearchQuery('');
            }
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] px-6 py-4 transition-all duration-700 ${scrolled ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-800 shadow-sm py-3' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-12">
                    <Link to="/" className="text-3xl font-black font-source-serif tracking-tighter text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="w-8 h-8 bg-medium-green rounded-lg flex items-center justify-center text-white text-sm transform -rotate-6 group-hover:rotate-0 transition-transform">B</span>
                        BlogApp
                    </Link>
                    <div className="hidden lg:flex items-center gap-8">
                        <Link
                            to="/posts"
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                        >
                            Explore
                        </Link>
                        <Link
                            to="/posts"
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                        >
                            Membership
                        </Link>
                        <Link
                            to="/create"
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                        >
                            Write
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-5 md:gap-8">
                    <div className="hidden md:flex items-center bg-slate-50 dark:bg-slate-900/50 rounded-full px-5 py-2 border border-slate-100 dark:border-slate-800 focus-within:ring-4 focus-within:ring-medium-green/5 transition-all">
                        <Search
                            className="text-slate-300 mr-3 cursor-pointer hover:text-slate-900"
                            size={16}
                            onClick={handleSearch}
                            aria-label="Search"
                        />
                        <input
                            type="text"
                            placeholder="Explore stories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                            aria-label="Search stories"
                            className="bg-transparent border-none outline-none w-32 focus:w-56 transition-all text-[11px] font-bold uppercase tracking-widest placeholder:text-slate-300"
                        />
                    </div>

                    <div className="flex items-center md:gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full"
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-4 md:gap-6">
                                <Link to="/create" className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800">
                                    <FileEdit size={14} />
                                    <span>Write</span>
                                </Link>
                                <button className="text-slate-300 hover:text-slate-900 transition-colors hidden sm:block">
                                    <Bell size={18} />
                                </button>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 group p-1 pr-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full transition-all hover:shadow-lg"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white overflow-hidden flex items-center justify-center font-black text-xs">
                                            {user.profileImage ? <img src={user.profileImage} alt="" className="w-full h-full object-cover" /> : (user.name?.charAt(0) || '?')}
                                        </div>
                                        <ChevronDown size={14} className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showUserMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                                className="absolute right-0 top-full mt-4 w-64 bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 rounded-[2rem] py-4 overflow-hidden"
                                            >
                                                <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 mb-2">
                                                    <p className="font-black text-sm uppercase tracking-tight truncate">{user.name}</p>
                                                    <p className="text-[10px] text-slate-400 truncate tracking-[0.1em] font-medium mt-1 uppercase">{user.email}</p>
                                                </div>
                                                <div className="px-2 space-y-1">
                                                    {[
                                                        { to: '/profile', icon: User, label: 'Profile', show: true },
                                                        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', show: user.role === 'admin' },
                                                        { to: '/posts', icon: FileEdit, label: 'My Stories', show: true },
                                                        { to: '/posts', icon: Bookmark, label: 'Library', show: true },
                                                    ].filter(link => link.show).map(link => (
                                                        <Link key={link.label} to={link.to} onClick={() => setShowUserMenu(false)} className="flex items-center gap-4 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl text-[11px] font-black uppercase tracking-wider text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                                                            <link.icon size={16} /> {link.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                                <div className="border-t border-slate-50 dark:border-slate-800 my-2"></div>
                                                <div className="px-2">
                                                    <button
                                                        onClick={() => { logout(); navigate('/'); }}
                                                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
                                                    >
                                                        <LogOut size={16} /> Sign out
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Sign In</Link>
                                <Link to="/signup" className="px-8 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-black dark:hover:bg-slate-200 transition-all shadow-2xl active:scale-95">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
