import toast from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';
import { motion } from 'framer-motion';
import { Image, MoreHorizontal, Globe, Check, ChevronDown, Plus, X } from 'lucide-react';
import MarkdownEditor from '../components/MarkdownEditor';

const CreatePost = () => {
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
        const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const postData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };
            const res = await createPost(postData);
            if (res.data.success) {
                navigate(`/posts/${res.data.data._id}`);
            }
        } catch (err) {
            toast.error(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950">
            {/* Top Bar */}
            <nav className="fixed top-0 left-0 right-0 z-[60] px-6 py-4 bg-white/95 dark:bg-slate-950/95 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <span className="text-xl font-black font-serif">Draft</span>
                    <span className="text-xs text-slate-400 font-medium">Saved</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={!formData.title || !formData.content || loading}
                        className="bg-medium-green text-white px-4 py-1.5 rounded-full text-xs font-black disabled:opacity-50 hover:bg-opacity-90 transition-all"
                    >
                        {loading ? 'Publishing...' : 'Publish'}
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
                        className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Featured Image URL</label>
                            <input
                                type="text"
                                placeholder="https://images.unsplash.com/..."
                                className="w-full bg-white dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-medium focus:ring-1 focus:ring-slate-200 outline-none"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category & Tags</label>
                            <div className="flex gap-2">
                                <select
                                    className="bg-white dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-medium focus:ring-1 focus:ring-slate-200 outline-none"
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
                                    className="flex-1 bg-white dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-xs font-medium focus:ring-1 focus:ring-slate-200 outline-none"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="relative group">
                    <button className="absolute -left-14 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 border border-slate-200 dark:border-slate-700 rounded-full text-slate-400 hover:text-slate-900">
                        <Plus size={20} />
                    </button>
                    <textarea
                        placeholder="Title"
                        autoFocus
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

            {/* Action Popups (Simulated) */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900 text-white rounded-full px-4 py-2 text-xs font-black shadow-2xl opacity-0 hover:opacity-100 transition-opacity">
                <Image size={14} className="mr-1" /> Add Image · <ChevronDown size={14} /> More Options
            </div>
        </div>
    );
};

export default CreatePost;
