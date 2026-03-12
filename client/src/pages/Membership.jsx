import toast from 'react-hot-toast';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { activateMembership } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Membership = () => {
    const { user, refetchUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const perks = useMemo(() => ([
        'Support independent writers',
        'Cleaner reading experience',
        'Early access to new features',
        'Premium badge on your profile'
    ]), []);

    const handleActivate = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.isPremium) {
            toast.success('You already have membership.');
            return;
        }

        setLoading(true);
        try {
            await activateMembership();
            await refetchUser();
            toast.success('Membership activated!');
        } catch (err) {
            toast.error(err.message || 'Failed to activate membership');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 pt-16">
            <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 md:p-14 shadow-sm"
                >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
                        <div className="space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-medium-green/10 text-medium-green text-[10px] font-black uppercase tracking-widest">
                                <Crown size={14} /> Membership
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black font-source-serif tracking-tight text-slate-900 dark:text-white">
                                Upgrade your reading.
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed">
                                Activate membership to support creators and unlock a premium experience across BlushInk.
                            </p>
                        </div>

                        <div className="w-full md:w-[360px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Plan</div>
                                    <div className="text-2xl font-black font-source-serif">Premium</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Price</div>
                                    <div className="text-2xl font-black">$0</div>
                                </div>
                            </div>

                            <button
                                onClick={handleActivate}
                                disabled={loading}
                                className="w-full py-3.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-[0.99] disabled:opacity-60 transition-all"
                            >
                                {user?.isPremium ? 'Active' : loading ? 'Activating...' : 'Activate Membership'}
                            </button>

                            {!user && (
                                <div className="flex items-start gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                                    <Lock size={16} className="mt-0.5 shrink-0" />
                                    Sign in to activate membership.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {perks.map((perk) => (
                            <div
                                key={perk}
                                className="flex items-center gap-4 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950/30"
                            >
                                <div className="w-10 h-10 rounded-xl bg-medium-green/10 text-medium-green flex items-center justify-center">
                                    <Check size={18} />
                                </div>
                                <div className="font-black text-sm uppercase tracking-wider text-slate-700 dark:text-slate-200">
                                    {perk}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Membership;

