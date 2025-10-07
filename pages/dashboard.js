import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [servers, setServers] = useState([]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (session) {
            fetchStats();
            fetchServers();
        }
    }, [session]);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/stats');
            setStats(res.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchServers = async () => {
        try {
            const res = await axios.get('/api/servers');
            setServers(res.data.servers);
        } catch (error) {
            console.error('Error fetching servers:', error);
        }
    };

    if (status === 'loading' || !stats) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full blur-3xl opacity-20 -top-20 -left-20 animate-pulse"></div>
            </div>

            <div className="relative z-10">
                {/* Header */}
                <header className="bg-[#0F172A]/80 backdrop-blur-md border-b border-[#1E293B]">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-xl">🛡️</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">goidaProxy</h1>
                                <p className="text-xs text-gray-400">Dashboard</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-white">{session?.user?.name}</p>
                                <p className="text-xs text-indigo-400">{session?.user?.role}</p>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] text-white rounded-lg text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 py-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-[#0D1526] border border-[#1E293B] rounded-2xl p-6">
                            <span className="text-3xl mb-4 block">👥</span>
                            <p className="text-gray-400 text-sm mb-1">Total Users</p>
                            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                        </div>

                        <div className="bg-[#0D1526] border border-[#1E293B] rounded-2xl p-6">
                            <span className="text-3xl mb-4 block">⚡</span>
                            <p className="text-gray-400 text-sm mb-1">Active Connections</p>
                            <p className="text-3xl font-bold text-white">{stats.activeConnections}</p>
                        </div>

                        <div className="bg-[#0D1526] border border-[#1E293B] rounded-2xl p-6">
                            <span className="text-3xl mb-4 block">🌐</span>
                            <p className="text-gray-400 text-sm mb-1">Servers</p>
                            <p className="text-3xl font-bold text-white">{stats.totalServers}</p>
                        </div>

                        <div className="bg-[#0D1526] border border-[#1E293B] rounded-2xl p-6">
                            <span className="text-3xl mb-4 block">📊</span>
                            <p className="text-gray-400 text-sm mb-1">Bandwidth</p>
                            <p className="text-3xl font-bold text-white">
                                {(stats.bandwidth / 1024 / 1024 / 1024).toFixed(2)} GB
                            </p>
                        </div>
                    </div>

                    {/* Servers */}
                    <div className="bg-[#0D1526] border border-[#1E293B] rounded-2xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Available Servers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {servers.map((server) => (
                                <div key={server._id} className="bg-[#1E293B] rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <span className="text-3xl">{server.flag}</span>
                                            <div>
                                                <h3 className="text-white font-semibold">{server.name}</h3>
                                                <p className="text-gray-400 text-sm">{server.country}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs ${
                                            server.status === 'online'
                                                ? 'bg-green-500/10 text-green-400'
                                                : 'bg-red-500/10 text-red-400'
                                        }`}>
                      {server.status}
                    </span>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center pt-4 border-t border-[#334155]">
                                        <div>
                                            <p className="text-xs text-gray-400">Ping</p>
                                            <p className="text-green-400 font-semibold">{server.ping}ms</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Users</p>
                                            <p className="text-white font-semibold">{server.activeUsers}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}