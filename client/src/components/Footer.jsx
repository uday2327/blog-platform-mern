import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-12 mt-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-4 text-center md:text-left">
                    <Link to="/" className="text-2xl font-bold font-serif">
                        BlogApp
                    </Link>
                    <p className="text-xs text-slate-500 max-w-xs">
                        Where good ideas find you. Share your thoughts with the world.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 text-xs font-medium text-slate-500">
                    <Link to="/" className="hover:text-slate-900 transition-colors">About</Link>
                    <Link to="/" className="hover:text-slate-900 transition-colors">Help</Link>
                    <Link to="/" className="hover:text-slate-900 transition-colors">Terms</Link>
                    <Link to="/" className="hover:text-slate-900 transition-colors">Privacy</Link>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400">© 2026 BlogApp Inc.</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
