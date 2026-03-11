import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, MapPin, Link as LinkIcon, Edit, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPosts } from '../services/api';
import BlogCard from '../components/BlogCard';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('stories');

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // Fetch posts authored by the current user
                const res = await getPosts({ author: user.id });
                setUserPosts(res.data.data);
            } catch (err) {
                toast.error(err.message || 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchUserPosts();
    }, [user]);

    if (!user) return <div className="min-h-screen flex items-center justify-center font-serif italic text-xl">Please sign in to view your profile.</div>;

    return (
        <div className="min-h-screen pt-12">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-16">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border-4 border-white dark:border-slate-900 shadow-2xl shrink-0">
                        {user.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl font-black text-slate-300">
                                {user.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="space-y-2">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <h1 className="text-4xl md:text-5xl font-black font-source-serif tracking-tight">{user.name}</h1>
                                <button className="self-center md:self-auto px-6 py-2 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
                                    <Edit size={14} /> Edit Profile
                                </button>
                            </div>
                            <p className="text-slate-500 font-medium text-lg max-w-2xl">
                                {user.bio || "Writer, thinker, and regular explorer of world affairs. Sharing my thoughts on tech, life, and everything in between."}
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <Mail size={16} /> <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} /> <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} /> <span>World Citizen</span>
                            </div>
                        </div>

                        <div className="flex justify-center md:justify-start items-center gap-12 pt-4">
                            <div className="text-center md:text-left">
                                <span className="block text-3xl font-black">{userPosts.length}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Stories</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="block text-3xl font-black">{user.role === 'author' ? '1.2K' : '0'}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Followers</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="block text-3xl font-black">{user.following?.length || 0}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Following</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <div className="border-b border-slate-50 dark:border-slate-900 mb-12 flex items-center gap-10">
                    <button
                        onClick={() => setActiveTab('stories')}
                        className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'stories' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Stories
                        {activeTab === 'stories' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('about')}
                        className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'about' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        About
                        {activeTab === 'about' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white" />}
                    </button>
                </div>

                {/* Content */}
                <div className="pb-20">
                    {activeTab === 'stories' && (
                        <div className="space-y-4">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <div key={i} className="h-40 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] animate-pulse" />
                                ))
                            ) : userPosts.length > 0 ? (
                                <div className="divide-y divide-slate-50 dark:divide-slate-900">
                                    {userPosts.map(post => (
                                        <BlogCard key={post._id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                                    <FileText size={48} className="mx-auto text-slate-200 mb-6" />
                                    <h3 className="text-2xl font-black font-source-serif mb-3">No stories yet.</h3>
                                    <p className="text-slate-400 mb-8 max-w-xs mx-auto font-medium">You haven't published any stories on BlogApp yet. Share your first experience.</p>
                                    <Link to="/create" className="px-10 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
                                        Write your first story
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'about' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-12 space-y-10 shadow-sm"
                        >
                            <div className="space-y-6">
                                <h3 className="text-3xl font-black font-source-serif">About {user.name}</h3>
                                <div className="prose prose-lg dark:prose-invert font-source-serif text-slate-600 dark:text-slate-400 leading-relaxed max-w-none">
                                    <p>
                                        I am a storyteller at heart, exploring the intersections of technology, culture, and clinical philosophy. My work focuses on finding the human element in the digital noise.
                                    </p>
                                    <p>
                                        With over a decade of experience in creative writing and structural analysis, I bring a unique perspective to every story I share. Join me on this journey of exploration and discovery.
                                    </p>
                                </div>
                            </div>
                            <div className="pt-10 border-t border-slate-50 dark:border-slate-800">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Let's Connect</h4>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all cursor-pointer hover:shadow-lg">
                                        <LinkIcon size={20} />
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all cursor-pointer hover:shadow-lg">
                                        <Mail size={20} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
