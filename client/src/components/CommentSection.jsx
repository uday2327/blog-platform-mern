import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Send, Trash2, Heart, Reply, MoreVertical, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CommentItem = ({ comment, onAddComment, onDeleteComment, user, depth = 0, postAuthorId }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [showReplies, setShowReplies] = useState(true);

    const handleReply = (e) => {
        e.preventDefault();
        if (replyContent.trim()) {
            onAddComment(replyContent, comment._id);
            setReplyContent('');
            setIsReplying(false);
            setShowReplies(true);
        }
    };

    return (
        <div className={`space-y-4 ${depth > 0 ? 'ml-6 md:ml-12 border-l-2 border-slate-50 dark:border-slate-900 pl-4 md:pl-8' : ''}`}>
            <div className="group space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-xs border border-slate-200 dark:border-slate-700">
                            {comment.user?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-slate-900 dark:text-white">{comment.user?.name || 'Anonymous'}</span>
                                {comment.user?._id === postAuthorId && (
                                    <span className="text-[9px] font-black uppercase text-medium-green px-1.5 py-0.5 bg-medium-green/10 rounded tracking-widest">Author</span>
                                )}
                            </div>
                            <p className="text-[10px] font-medium text-slate-400 italic">
                                {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <button className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical size={14} />
                    </button>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium pl-11">
                    {comment.content}
                </p>

                <div className="flex items-center gap-6 pl-11 pt-2">
                    <button className="flex items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors">
                        <Heart size={14} />
                        <span className="text-[11px] font-bold">Laps</span>
                    </button>
                    {user && (
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <Reply size={14} />
                            <span className="text-[11px] font-bold">Reply</span>
                        </button>
                    )}
                    {user && (user.id === comment.user?._id || user.role === 'admin') && (
                        <button
                            onClick={() => onDeleteComment(comment._id)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>

                <AnimatePresence>
                    {isReplying && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleReply}
                            className="ml-11 mt-4 bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 space-y-3 border border-slate-100 dark:border-slate-800"
                        >
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Reply to this response..."
                                className="w-full bg-transparent border-none focus:ring-0 text-xs resize-none min-h-[60px] placeholder:text-slate-400 font-medium"
                                autoFocus
                            />
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={() => setIsReplying(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cancel</button>
                                <button type="submit" className="text-[10px] font-black uppercase tracking-widest text-medium-green">Reply</button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>

            {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-6 pt-4">
                    <button
                        onClick={() => setShowReplies(!showReplies)}
                        className="ml-11 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-medium-green hover:underline mb-4"
                    >
                        <ChevronDown size={12} className={`transition-transform duration-300 ${!showReplies ? '-rotate-90' : ''}`} />
                        {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                    </button>
                    <AnimatePresence>
                        {showReplies && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-8"
                            >
                                {comment.replies.map(reply => (
                                    <CommentItem
                                        key={reply._id}
                                        comment={reply}
                                        onAddComment={onAddComment}
                                        onDeleteComment={onDeleteComment}
                                        user={user}
                                        depth={depth + 1}
                                        postAuthorId={postAuthorId}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

const CommentSection = ({ comments, onAddComment, onDeleteComment, user, postAuthorId }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim()) {
            onAddComment(content);
            setContent('');
        }
    };

    // Transform flat comments into a tree structure
    const buildCommentTree = (flatComments) => {
        const commentMap = {};
        const roots = [];

        flatComments.forEach(comment => {
            commentMap[comment._id] = { ...comment, replies: [] };
        });

        flatComments.forEach(comment => {
            if (comment.parentComment && commentMap[comment.parentComment]) {
                commentMap[comment.parentComment].replies.push(commentMap[comment._id]);
            } else {
                roots.push(commentMap[comment._id]);
            }
        });

        return roots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    const rootComments = buildCommentTree(comments);

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-900 pb-6">
                <h3 className="text-2xl font-black font-source-serif">
                    Responses <span className="text-slate-300 font-inter text-sm font-medium ml-2">({comments.length})</span>
                </h3>
            </div>

            {user ? (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                            {user.name.charAt(0)}
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">{user.name}</span>
                    </div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What are your thoughts?"
                        className="w-full bg-transparent border-none focus:ring-0 text-md md:text-lg resize-none min-h-[120px] placeholder:text-slate-300 font-medium font-source-serif"
                    />
                    <div className="flex justify-end gap-5 pt-6 border-t border-slate-50 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => setContent('')}
                            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!content.trim()}
                            className="bg-medium-green text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all shadow-medium-green/20"
                        >
                            Publish Response
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-12 text-center">
                    <p className="text-md font-medium text-slate-500 mb-6 italic">Sign in to share your thoughts on this story.</p>
                    <Link to="/login" className="px-10 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest inline-block shadow-xl">Sign In to Respond</Link>
                </div>
            )}

            <div className="space-y-16">
                <AnimatePresence mode="popLayout">
                    {rootComments.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            onAddComment={onAddComment}
                            onDeleteComment={onDeleteComment}
                            user={user}
                            postAuthorId={postAuthorId}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CommentSection;
