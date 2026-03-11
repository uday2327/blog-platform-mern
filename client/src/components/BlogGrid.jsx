import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BlogCard from './BlogCard';

const BlogGrid = ({ posts, loading }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-4 animate-pulse">
                        <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-900 rounded-2xl"></div>
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4"></div>
                        <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!posts || posts.length === 0) {
        return (
            <div className="py-20 text-center space-y-6">
                <p className="text-slate-400 italic font-serif text-lg">
                    No stories found in this category.
                </p>
                <Link to="/create" className="inline-block px-10 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all">
                    Write a story
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-10">
            {posts.map((post, index) => (
                <motion.div
                    key={post._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group space-y-4"
                >
                    <Link to={`/posts/${post._id}`} className="block aspect-[16/10] overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
                        <img
                            src={post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop'}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 saturate-50 group-hover:saturate-100"
                        />
                    </Link>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-medium-green">{post.category}</span>
                            <span className="text-slate-300">·</span>
                            <span className="text-[10px] font-bold text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Link to={`/posts/${post._id}`} className="block group-hover:text-slate-600 transition-colors">
                            <h3 className="text-lg font-black font-serif leading-tight line-clamp-2">{post.title}</h3>
                        </Link>
                        <div className="flex items-center gap-2 pt-2">
                            <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[9px] font-black">
                                {post.author?.name?.charAt(0) || '?'}
                            </div>
                            <span className="text-[10px] font-bold text-slate-500">{post.author?.name || 'Anonymous'}</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};


export default BlogGrid;
