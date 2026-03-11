import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Bookmark, Share2, MoreHorizontal, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    getPost,
    getComments,
    addComment,
    deleteComment,
    toggleLike,
    toggleFollow,
    toggleBookmark
} from '../services/api';
import CommentSection from '../components/CommentSection';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
    const { id } = useParams();
    const { user, refetchUser } = useAuth();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = user?.id || user?._id;
    const isLiked = post?.likes?.includes(userId);
    const isFollowing = user?.following?.includes(post?.author?._id || post?.author);
    const isBookmarked = user?.bookmarks?.includes(post?._id);

    const handleLike = async () => {
        if (!user) return;
        try {
            await toggleLike(post._id);
            // Refresh post data to get updated like count/state
            const res = await getPost(id);
            setPost(res.data.data);
        } catch (err) {
            toast.error(err.message || 'An unexpected error occurred');
        }
    };

    const handleFollow = async () => {
        if (!user) return;
        try {
            await toggleFollow(post.author?._id || post.author);
            refetchUser();
        } catch (err) {
            toast.error(err.message || 'An unexpected error occurred');
        }
    };

    const handleBookmark = async () => {
        if (!user) return;
        try {
            await toggleBookmark(post._id);
            refetchUser();
        } catch (err) {
            toast.error(err.message || 'An unexpected error occurred');
        }
    };
    const [isStickyVisible, setIsStickyVisible] = useState(false);

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => {
            setIsStickyVisible(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [postRes, commentRes] = await Promise.all([
                    getPost(id),
                    getComments(id)
                ]);
                setPost(postRes.data.data);
                setComments(commentRes.data.data);
            } catch (err) {
                toast.error(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    const handleAddComment = async (content, parentComment = null) => {
        try {
            const res = await addComment(id, { content, parentComment });
            if (res.data.success) {
                setComments([...comments, { ...res.data.data, user: { _id: user.id, name: user.name } }]);
            }
        } catch (err) {
            toast.error(err.message || 'An unexpected error occurred');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            setComments(comments.filter(c => c._id !== commentId));
        } catch (err) {
            toast.error(err.message || 'An unexpected error occurred');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-medium-green animate-spin"></div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Opening story...</p>
        </div>
    );

    if (!post) return <div className="min-h-screen flex items-center justify-center text-2xl font-serif">Story not found.</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500">
            {/* Reading Progress Bar */}
            <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-medium-green origin-left z-[70] shadow-[0_2px_10px_rgba(26,137,23,0.3)]" style={{ scaleX }} />

            {/* Sticky Interaction Bar (Medium Style) */}
            <AnimatePresence>
                {isStickyVisible && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-8 py-4 bg-white dark:bg-slate-900 shadow-2xl rounded-full border border-slate-100 dark:border-slate-800 flex items-center gap-8"
                    >
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 transition-all transform hover:scale-110 ${isLiked ? 'text-red-500' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} /> <span className="text-xs font-bold">{post.likes?.length || 0}</span>
                        </button>
                        <div className="w-px h-4 bg-slate-100 dark:bg-slate-800"></div>
                        <button className="flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all transform hover:scale-110">
                            <MessageSquare size={20} /> <span className="text-xs font-bold">{comments.length}</span>
                        </button>
                        <div className="w-px h-4 bg-slate-100 dark:bg-slate-800"></div>
                        <button
                            onClick={handleBookmark}
                            className={`transition-all transform hover:scale-110 ${isBookmarked ? 'text-medium-green' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                        <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all transform hover:scale-110">
                            <Share2 size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
                <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all mb-16">
                    <ChevronLeft size={14} /> Back to stories
                </Link>

                <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-16"
                >
                    {/* Header: Title and Author */}
                    <header className="space-y-12">
                        <h1 className="text-5xl md:text-7xl font-black font-source-serif leading-[1.05] tracking-tight text-slate-900 dark:text-white">
                            {post.title}
                        </h1>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 pb-10 border-b border-slate-50 dark:border-slate-900">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center text-xl font-black shrink-0 border border-slate-200 dark:border-slate-800">
                                    {post.author?.name?.charAt(0)}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="font-black text-slate-900 dark:text-slate-100 text-lg uppercase tracking-tight">{post.author?.name}</span>
                                        <span className="text-slate-300">·</span>
                                        <button
                                            onClick={handleFollow}
                                            className={`font-black text-xs uppercase tracking-widest hover:underline ${isFollowing ? 'text-slate-400' : 'text-medium-green'}`}
                                        >
                                            {isFollowing ? 'Following' : 'Follow'}
                                        </button>
                                    </div>
                                    <div className="text-slate-400 text-[10px] flex items-center gap-3 font-black uppercase tracking-[0.1em]">
                                        <span className="text-medium-green bg-medium-green/10 px-2 py-0.5 rounded tracking-widest">{post.category}</span>
                                        <span>·</span>
                                        <span>7 min read</span>
                                        <span>·</span>
                                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-slate-300">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-2 transition-all scale-110 ${isLiked ? 'text-red-500' : 'hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    <Heart size={21} fill={isLiked ? 'currentColor' : 'none'} />
                                    {post.likes?.length > 0 && <span className="text-xs font-black">{post.likes.length}</span>}
                                </button>
                                <button className="hover:text-slate-900 dark:hover:text-white transition-all scale-110"><Share2 size={24} /></button>
                                <button
                                    onClick={handleBookmark}
                                    className={`transition-all scale-110 ${isBookmarked ? 'text-medium-green' : 'hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    <Bookmark size={24} fill={isBookmarked ? 'currentColor' : 'none'} />
                                </button>
                                <button className="hover:text-slate-900 dark:hover:text-white transition-all scale-110"><MoreHorizontal size={24} /></button>
                            </div>
                        </div>
                    </header>

                    {/* High-Impact Featured Image */}
                    {post.image && (
                        <figure className="space-y-4 -mx-6 md:-mx-12 lg:-mx-20">
                            <img
                                src={post.image}
                                className="w-full h-auto object-cover md:rounded-[2rem] shadow-2xl saturate-[0.85] contrast-[1.05]"
                                alt={post.title}
                            />
                            <figcaption className="text-center text-xs text-slate-400 font-bold uppercase tracking-[0.2em] pt-2">
                                Artistic capture by the author
                            </figcaption>
                        </figure>
                    )}

                    {/* Premium Typography Body */}
                    <section className="reading-content prose prose-xl dark:prose-invert prose-slate max-w-none font-source-serif leading-[1.8] text-slate-800 dark:text-slate-200">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                    </section>

                    {/* Bottom Metadata & Footer */}
                    <footer className="pt-20 space-y-16">
                        {post.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {post.tags.map(tag => (
                                    <span key={tag} className="bg-slate-50 dark:bg-slate-900 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-500 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 transition-all cursor-pointer">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="p-10 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-10">
                            <div className="w-24 h-24 rounded-full bg-slate-900 text-white flex items-center justify-center text-4xl font-black shrink-0 shadow-xl">
                                {post.author?.name?.charAt(0)}
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Written by</p>
                                <h3 className="text-3xl font-black font-source-serif">{post.author?.name}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg italic">
                                    A passionate storyteller exploring the boundaries of technology and human creativity. Writing from the heart of the digital age.
                                </p>
                                <div className="flex items-center justify-center md:justify-start gap-6 pt-2">
                                    <button
                                        onClick={handleFollow}
                                        className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${isFollowing ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : 'bg-medium-black text-white dark:bg-white dark:text-medium-black hover:bg-black'}`}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                    <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-full text-slate-400 hover:text-slate-900 transition-all"><Share2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                    </footer>
                </motion.article>

                {/* Refined CommentSection Integration */}
                <section className="mt-32 pt-20 border-t border-slate-100 dark:border-slate-900">
                    <div className="flex items-center justify-between mb-16">
                        <h3 className="text-2xl font-black font-source-serif">Response ({comments.length})</h3>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Sort by: Top</span>
                        </div>
                    </div>
                    <CommentSection
                        comments={comments}
                        onAddComment={handleAddComment}
                        onDeleteComment={handleDeleteComment}
                        user={user}
                        postAuthorId={post.author?._id || post.author}
                    />
                </section>
            </div>
        </div>
    );
};

export default PostDetail;
