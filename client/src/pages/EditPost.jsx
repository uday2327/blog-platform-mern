import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Image, MoreHorizontal, Globe, Check, ChevronDown, Plus, X, ArrowLeft } from 'lucide-react';
import { getPost, updatePost } from '../services/api';
import { useAuth } from '../context/AuthContext';
import MarkdownEditor from '../components/MarkdownEditor';

const EditPost = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Technology',
        tags: '',
        image: '',
        status: 'published'
    });
    const [showOptions, setShowOptions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const res = await getPost(id);
                const post = res.data.data;

                // Check if user is the author
                if (post.author._id !== user.id && user.role !== 'admin') {
                    navigate('/');
                    return;
                }

                setFormData({
                    title: post.title,
                    content: post.content,
                    category: post.category || 'Technology',
                    tags: post.tags ? post.tags.join(', ') : '',
                    image: post.image || '',
                    status: post.status || 'published'
                });
            } catch (err) {
                toast.error(err.message || 'An unexpected error occurred');
                navigate('/');
            } finally {
                setFetching(false);
            }
        };
        fetchPostData();
    }, [id, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const postData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };
            const res = await updatePost(id, postData);
            if (res.data.success) {
                navigate(`/posts/${id}`);
            }
        } catch (err) {
            toast.error(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="min-h-screen flex items-center justify-center text-xl font-serif italic animate-pulse">Loading story data...</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Top Bar */}
            <nav className="fixed top-0 left-0 right-0 z-[60] px-6 py-4 bg-white/95 dark:bg-slate-950/95 flex justify-between items-center max-w-7xl mx-auto shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <span className="text-xl font-black font-serif">Edit Story</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={!formData.title || !formData.content || loading}
                        className="bg-medium-green text-white px-6 py-2 rounded-full text-xs font-black disabled:opacity-50 hover:shadow-lg transition-all"
                    >
                        {loading ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <MoreHorizontal size={24} />
                    </button>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-6 pt-32 pb-20 space-y-10">
                {/* Options Dropdown */}
                {showOptions && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-xl"
                    >
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Featured Image URL</label>
                            <input
                                type="text"
                                placeholder="https://images.unsplash.com/..."
                                className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-3 px-4 text-xs font-medium focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category & Tags</label>
                            <div className="flex flex-col gap-3">
                                <select
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-3 px-4 text-xs font-medium focus:ring-2 focus:ring-slate-200 outline-none transition-all appearance-none cursor-pointer"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option>Technology</option>
                                    <option>Science</option>
                                    <option>Blog</option>
                                    <option>Lifestyle</option>
                                    <option>Health</option>
                                    <option>Business</option>
                                    <option>Education</option>
                                    <option>Writing</option>
                                    <option>Design</option>
                                    <option>Future</option>
                                    <option>Politics</option>
                                    <option>Art</option>
                                    <option>Self Improved</option>
                                    <option>Other</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Tags (comma separated)"
                                    className="w-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-3 px-4 text-xs font-medium focus:ring-2 focus:ring-slate-200 outline-none transition-all"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="relative group">
                    <textarea
                        placeholder="Title"
                        className="w-full bg-transparent border-none text-5xl md:text-6xl font-black font-serif focus:ring-0 resize-none min-h-[80px] placeholder:text-slate-200 leading-tight"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <MarkdownEditor
                    content={formData.content}
                    onChange={(val) => setFormData({ ...formData, content: val })}
                />
            </div>
        </div>
    );
};

export default EditPost;
