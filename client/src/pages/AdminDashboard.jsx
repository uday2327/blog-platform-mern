import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, FileText, MessageSquare, TrendingUp,
    MoreHorizontal, Edit, Trash2, Check, X,
    Search, Filter, ChevronRight, BarChart3, AlertCircle
} from 'lucide-react';
import { getPosts, deletePost, getAdminStats } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalUsers: 42, // Simulated for now
        totalComments: 128, // Simulated
        totalViews: '84.2K'
    });

    useEffect(() => {
        // Restricted to admin
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [postsRes, statsRes] = await Promise.all([
                    getPosts(),
                    getAdminStats()
                ]);
                setPosts(postsRes.data.data);
                setStats(statsRes.data.data);
            } catch (err) {
                toast.error(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, navigate]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(id);
                setPosts(posts.filter(p => p._id !== id));
            } catch (err) {
                toast.error(err.message || 'An unexpected error occurred');
            }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-serif italic text-xl animate-pulse">Loading dashboard...</div>;

    return (
        <div className="min-h-screen pt-12">
            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-12 space-y-4">
                    <div className="flex items-center gap-3 text-medium-green font-black text-[10px] uppercase tracking-[0.2em]">
                        <BarChart3 size={14} />
                        Platform Overview
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black font-serif tracking-tight">Admin Dashboard</h1>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {[
                        { label: 'Total Stories', value: stats.totalPosts, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
                        { label: 'Total Comments', value: stats.totalComments, icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-50' },
                        { label: 'Platform Views', value: stats.totalViews, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} dark:bg-slate-800 flex items-center justify-center ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <span className="block text-3xl font-black">{stat.value}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm mb-20">
                    <div className="px-10 py-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h2 className="text-2xl font-black font-serif">Recent Stories</h2>
                        <div className="flex items-center gap-4">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Filter posts..."
                                    className="bg-slate-50 dark:bg-slate-800 border-none rounded-full pl-11 pr-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-slate-100 w-full md:w-64 transition-all"
                                />
                            </div>
                            <button className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-900">
                                <Filter size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Story Title</th>
                                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Author</th>
                                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                    <th className="px-10 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {posts.map((post, i) => (
                                    <motion.tr
                                        key={post._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-slate-50/30 dark:hover:bg-slate-800/30 transition-colors"
                                    >
                                        <td className="px-10 py-6">
                                            <div className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{post.title}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">ID: {post._id.slice(-8)}</div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
                                                    {post.author?.name?.charAt(0)}
                                                </div>
                                                <span className="font-medium text-sm">{post.author?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-sm text-slate-500 font-medium">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => navigate(`/edit/${post._id}`)}
                                                    className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post._id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {posts.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <AlertCircle size={48} className="mx-auto text-slate-100" />
                            <p className="text-slate-400 font-serif italic text-lg">No stories found in the system.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
