import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquare, Users, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';

const AdminSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: FileText, label: 'Posts', path: '/admin/posts' },
        { icon: MessageSquare, label: 'Comments', path: '/admin/comments' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <aside className={clsx(
            "h-screen sticky top-0 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300 flex flex-col",
            collapsed ? "w-20" : "w-64"
        )}>
            <div className="p-6 flex items-center justify-between">
                {!collapsed && <span className="font-bold text-lg font-serif">Admin</span>}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={clsx(
                            "flex items-center gap-3 px-3 py-3 rounded-lg transition-all transition-colors",
                            location.pathname === item.path
                                ? "bg-slate-100 dark:bg-slate-900 text-medium-black font-semibold"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                        )}
                    >
                        <item.icon size={20} />
                        {!collapsed && <span className="text-sm">{item.label}</span>}
                    </Link>
                ))}
            </nav>

            {!collapsed && (
                <div className="p-4 m-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Signed in as</p>
                    <p className="text-xs font-bold truncate">Admin User</p>
                </div>
            )}
        </aside>
    );
};

export default AdminSidebar;
