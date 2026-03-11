import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Bookmark, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { toggleBookmark } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BlogCard = ({ post }) => {
    const { user, refetchUser } = useAuth();
    const isBookmarked = user?.bookmarks?.includes(post._id);

    const handleBookmark = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) return;
        try {
            await toggleBookmark(post._id);
            refetchUser();
        } catch (err) {
            toast.error(err.message || 'An unexpected error occurred');
        }
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group flex flex-col md:flex-row gap-8 md:gap-12 py-12 transition-all duration-300 first:pt-0"
        >
            <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black border border-slate-100 dark:border-slate-800">
                        {post.author?.name?.charAt(0) || '?'}
                    </div>
                    <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">{post.author?.name || 'Anonymous'}</span>
                    <span className="text-slate-200 dark:text-slate-800">·</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.category}</span>
                </div>

                <Link to={`/posts/${post._id}`} className="block group/title">
                    <h2 className="text-2xl md:text-3xl font-black font-source-serif leading-tight group-hover/title:text-medium-green transition-colors duration-300">
                        {post.title}
                    </h2>
                </Link>

                <p className="hidden md:block text-slate-500 dark:text-slate-400 text-md line-clamp-2 leading-relaxed font-inter font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    {post.content}
                </p>

                <div className="flex items-center justify-between pt-6">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                        <span className="bg-slate-50 dark:bg-slate-900 px-3 py-1 rounded-full text-slate-500 border border-slate-100 dark:border-slate-800">
                            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span>·</span>
                        <span>6 min read</span>
                        <span className="hidden sm:inline">·</span>
                        <span className="hidden sm:inline-flex items-center gap-1 text-medium-green italic font-medium lowercase tracking-normal bg-medium-green/5 px-2 py-0.5 rounded">
                            Our pick
                        </span>
                    </div>

                    <div className="flex items-center gap-5 text-slate-300 group-hover:text-slate-400 transition-colors">
                        <button
                            onClick={handleBookmark}
                            className={`transition-all transform hover:scale-110 ${isBookmarked ? 'text-medium-green' : 'hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                        <button className="hover:text-slate-900 dark:hover:text-white transition-all transform hover:scale-110"><MoreHorizontal size={20} /></button>
                    </div>
                </div>
            </div>

            {post.image && (
                <div className="md:w-56 w-full order-first md:order-last">
                    <Link to={`/posts/${post._id}`} className="block overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-900 aspect-[16/10] md:aspect-square group shadow-sm group-hover:shadow-xl transition-all duration-500">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 saturate-[0.7] group-hover:saturate-100 brightness-[0.95] group-hover:brightness-100"
                        />
                    </Link>
                </div>
            )}
        </motion.div>
    );
};

export default BlogCard;
