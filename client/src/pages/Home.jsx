import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts, toggleFollow } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/BlogCard';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const navigate = useNavigate();

    const { user, refetchUser } = useAuth();
    const trendingPosts = posts.slice(0, 6);

    const handleFollow = async (userId) => {
        if (!user) return; // Add login redirect logic if needed
        try {
            await toggleFollow(userId);
            refetchUser();
        } catch (err) {
            toast.error(err.message || 'An unexpected error occurred');
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const res = await getPosts(activeCategory !== 'All' ? { category: activeCategory } : {});
                setPosts(res.data.data);
            } catch (err) {
                toast.error(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [activeCategory]);

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
            {/* High-Impact Hero Section */}
            <section className="relative overflow-hidden bg-white dark:bg-slate-950 py-24 md:py-32 px-6 border-b border-slate-100 dark:border-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
                <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medium-green/10 text-medium-green text-[10px] font-black uppercase tracking-widest"
                        >
                            <TrendingUp size={12} /> The New Way to Read & Write
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-7xl md:text-9xl font-black font-source-serif leading-[0.9] tracking-tight text-slate-900 dark:text-white"
                        >
                            Human <br />
                            <span className="italic font-normal serif text-medium-green">stories</span> & <br />
                            ideas.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed font-inter font-medium"
                        >
                            Join a world-class community of writers, thinkers, and storytellers. Explore the depth of human experience through words.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex items-center gap-6"
                        >
                            <Link to="/posts" className="px-10 py-4 bg-medium-black text-white dark:bg-white dark:text-medium-black rounded-full text-lg font-black hover:bg-black transition-all shadow-2xl active:scale-95 inline-block">
                                Start Reading
                            </Link>
                            <Link to="/posts" className="text-sm font-black uppercase tracking-widest border-b-2 border-black dark:border-white pb-1 hover:opacity-70 transition-opacity">
                                Explore Stories
                            </Link>
                        </motion.div>
                    </div>
                    <div className="hidden lg:block flex-1 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            className="relative"
                        >
                            <div className="absolute -inset-10 bg-medium-green/5 blur-[100px] rounded-full animate-pulse"></div>
                            <div className="p-4 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 transform rotate-3 hover:rotate-0 transition-transform duration-700">
                                <img
                                    src="https://images.unsplash.com/photo-1457369804593-5423136ebf7b?q=80&w=2070&auto=format&fit=crop"
                                    alt="Creative writing"
                                    className="w-full h-[550px] object-cover rounded-[2rem] saturate-[0.8] contrast-[1.1]"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trending Section with Numeric Markers */}
            <div className="bg-white dark:bg-slate-950 pt-20 pb-16 border-b border-slate-50 dark:border-slate-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                            <TrendingUp size={16} className="text-slate-900 dark:text-white" />
                        </div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Trending on BlushInk</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-16">
                        {trendingPosts.map((post, i) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-6 group cursor-pointer"
                            >
                                <span className="text-4xl font-black text-slate-100 dark:text-slate-800 font-source-serif leading-none group-hover:text-medium-green transition-colors">0{i + 1}</span>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px] font-black">
                                            {post.author?.name?.charAt(0) || '?'}
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-white">{post.author?.name || 'Anonymous'}</span>
                                    </div>
                                    <Link to={`/posts/${post._id}`} className="block">
                                        <h3 className="font-black text-sm md:text-md leading-tight font-source-serif group-hover:text-medium-green transition-all line-clamp-2">{post.title}</h3>
                                    </Link>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · 6 min read
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto w-full px-6 py-24">
                <div className="flex flex-col lg:flex-row gap-24">
                    {/* Main Feed */}
                    <main className="lg:w-2/3">
                        <div className="flex items-center justify-between mb-12 pb-4 border-b border-slate-50 dark:border-slate-900">
                            <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                                {['Relevant', 'Recent', 'Popular', 'Staff Picks'].map((label, i) => (
                                    <button
                                        key={label}
                                        onClick={() => setActiveCategory(i === 0 ? 'All' : label)}
                                        className={`flex-shrink-0 text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:text-slate-900 ${activeCategory === (i === 0 ? 'All' : label) ? 'text-slate-900 dark:text-white pb-4 border-b-2 border-slate-900 dark:border-white' : 'text-slate-400'}`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="space-y-16">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex gap-10 animate-pulse">
                                            <div className="flex-1 space-y-4">
                                                <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded w-1/4"></div>
                                                <div className="h-6 bg-slate-100 dark:bg-slate-900 rounded w-3/4"></div>
                                                <div className="h-16 bg-slate-100 dark:bg-slate-900 rounded w-full"></div>
                                            </div>
                                            <div className="w-40 h-32 bg-slate-100 dark:bg-slate-900 rounded-2xl"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-50 dark:divide-slate-900">
                                    {posts.length > 0 ? (
-                                        posts.map(post => <BlogCard key={post._id} post={post} />)
+                                        posts.map(post => <BlogCard key={post._id} post={post} />)
                                    ) : (
                                        <div className="text-center py-24 space-y-6">
                                            <p className="text-slate-400 font-serif italic text-lg">No stories available yet.</p>
                                            <Link to="/create" className="inline-block px-10 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all">
                                                Write the first story
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Highly Curated Sidebar */}
                    <aside className="lg:w-1/3">
                        <div className="sticky top-28 space-y-16">
                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Topics of interest</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Writing', 'Science', 'Design', 'Future', 'Politics', 'Art', 'Self Improved'].map(tag => (
                                        <button 
                                            key={tag} 
                                            onClick={() => navigate('/posts')}
                                            className="px-5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-full text-[11px] font-black uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Who to follow</h3>
                                <div className="space-y-6">
                                    {posts.slice(0, 3).map(post => (
                                        <div key={post._id} className="flex items-center justify-between group cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-[10px] border border-slate-200 dark:border-slate-800">
                                                    {post.author?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <h4 className="text-[11px] font-black uppercase tracking-wider leading-none">{post.author?.name || 'Anonymous'}</h4>
                                                    <p className="text-[10px] text-slate-500 font-medium mt-1">Writer & Thinker</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleFollow(post.author?._id)}
                                                className={`px-4 py-1.5 border rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${user?.following?.includes(post.author?._id) ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-transparent' : 'border-slate-900 dark:border-white hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black'}`}
                                            >
                                                {user?.following?.includes(post.author?._id) ? 'Following' : 'Follow'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <footer className="pt-10 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 dark:border-slate-900 mt-10">
                                {['Help', 'Status', 'About', 'Terms', 'Privacy'].map(link => (
                                    <button 
                                        key={link} 
                                        onClick={() => toast.success('Coming Soon!')}
                                        className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors uppercase"
                                    >
                                        {link}
                                    </button>
                                ))}
                            </footer>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Home;
