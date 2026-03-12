import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Sliders, ChevronDown } from 'lucide-react';
import { getPosts } from '../services/api';
import BlogGrid from '../components/BlogGrid';
import { motion, AnimatePresence } from 'framer-motion';

const BlogList = () => {
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category') || 'All';
    const initialSearch = searchParams.get('search') || '';

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState(initialCategory);
    const [search, setSearch] = useState(initialSearch);

    useEffect(() => {
        // Sync state if search params change externally (e.g., from Navbar)
        const searchVal = searchParams.get('search') || '';
        const catVal = searchParams.get('category') || 'All';
        setSearch(searchVal);
        setCategory(catVal);
    }, [searchParams]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const params = {};
                if (category !== 'All') params.category = category;
                if (search) params.keyword = search;

                const res = await getPosts(params);
                setPosts(res.data.data);
            } catch (err) {
                toast.error(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [category, search]);

    return (
        <div className="min-h-screen pt-20 md:pt-32 bg-white dark:bg-slate-950 transition-colors duration-500">
            <div className="max-w-7xl mx-auto px-6">
                <header className="mb-20 space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 max-w-3xl"
                    >
                        <h1 className="text-6xl md:text-8xl font-black font-source-serif tracking-tight text-slate-900 dark:text-white leading-[0.9]">
                            Explore the <br />
                            <span className="italic font-normal">archive.</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-inter font-medium text-xl leading-relaxed">
                            A curated selection of thoughts, technical deep-dives, and creative essays from around the globe.
                        </p>
                    </motion.div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 py-10 border-y border-slate-50 dark:border-slate-900">
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                            {['All', 'Technology', 'Science', 'Blog', 'Lifestyle', 'Health', 'Business', 'Education', 'Writing', 'Design', 'Future', 'Politics', 'Art', 'Self Improved', 'Other'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${category === cat ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-2xl' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="relative group flex-1 md:flex-none">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-medium-green transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search topic..."
                                    className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-full pl-14 pr-6 py-3.5 text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-medium-green/5 w-full md:w-80 transition-all placeholder:text-slate-300"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <button className="p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:shadow-xl transition-all">
                                <Sliders size={18} />
                            </button>
                        </div>
                    </div>
                </header>

                <BlogGrid posts={posts} loading={loading} />

                {!loading && posts.length > 0 && (
                    <div className="py-32 flex justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-12 py-4 border-2 border-slate-100 dark:border-slate-800 rounded-full text-xs font-black uppercase tracking-[0.3em] hover:border-slate-900 dark:hover:border-white transition-all shadow-sm hover:shadow-2xl"
                        >
                            Load more stories
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogList;
