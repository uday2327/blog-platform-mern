import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Edit3, Type, List, Link, Code, Image } from 'lucide-react';

const MarkdownEditor = ({ content, onChange, placeholder }) => {
    const [view, setView] = useState('edit'); // edit or preview

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-4 mb-8 border-b border-slate-50 dark:border-slate-800 pb-4">
                <button
                    onClick={() => setView('edit')}
                    className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${view === 'edit' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Edit3 size={14} /> Write
                </button>
                <button
                    onClick={() => setView('preview')}
                    className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${view === 'preview' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <Eye size={14} /> Preview
                </button>

                <div className="flex-1"></div>

                <div className="hidden md:flex items-center gap-4 text-slate-300">
                    <Type size={16} className="cursor-pointer hover:text-slate-600 transition-colors" />
                    <List size={16} className="cursor-pointer hover:text-slate-600 transition-colors" />
                    <Link size={16} className="cursor-pointer hover:text-slate-600 transition-colors" />
                    <Code size={16} className="cursor-pointer hover:text-slate-600 transition-colors" />
                    <Image size={16} className="cursor-pointer hover:text-slate-600 transition-colors" />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'edit' ? (
                    <motion.div
                        key="edit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <textarea
                            placeholder={placeholder || 'Tell your story...'}
                            className="w-full bg-transparent border-none text-xl md:text-2xl font-serif focus:ring-0 resize-none min-h-[500px] placeholder:text-slate-200 leading-relaxed font-medium"
                            value={content}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="reading-content prose prose-lg dark:prose-invert max-w-none min-h-[500px]"
                    >
                        {content ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                        ) : (
                            <p className="text-slate-300 italic font-serif">Nothing to preview yet.</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MarkdownEditor;
