import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
    const { data: session } = useSession();
    const router = useRouter();

    const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'moderator';

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Servers', href: '/servers', icon: '🌐' },
        ...(isAdmin ? [
            { name: 'Users', href: '/admin/users', icon: '👥' },
            { name: 'Activity', href: '/admin/activity', icon: '📈' },
            { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
        ] : []),
    ];

    return (
        <div className="min-h-screen bg-[#0F172A]">
            {/* Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full blur-3xl opacity-20 -top-20 -left-20 animate-pulse"></div>
                <div className="absolute w-80 h-80 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-full blur-3xl opacity-15 top-1/2 -right-20 animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>

            <div className="relative z-10 flex h-screen">
                {/* Sidebar */}
                <div className="w-64 bg-[#0D1526] border-r border-[#1E293B] flex flex-col">
                    <div className="p-6">
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">🛡️</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">goidaProxy</h1>
                                <p className="text-xs text-gray-400">Admin Panel</p>
                            </div>
                        </div>

                        <nav className="space-y-2">
                            {navigation.map((item) => {
                                const isActive = router.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                                            isActive
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                                                : 'text-gray-400 hover:bg-[#1E293B] hover:text-white'
                                        }`}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* User info */}
                    <div className="mt-auto p-6 border-t border-[#1E293B]">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-lg">👤</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white truncate">{session?.user?.name}</p>
                                <p className="text-xs text-indigo-400 capitalize">{session?.user?.role}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 overflow-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
