import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { serverApi } from '../utils/api';
import { formatBytes } from '../utils/formatters';
import { useToast } from '../hooks/useToast';

export default function Servers() {
    const { data: session } = useSession();
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToast, ToastContainer } = useToast();

    useEffect(() => {
        if (session) {
            fetchServers();
        }
    }, [session]);

    const fetchServers = async () => {
        try {
            const res = await serverApi.getAll();
            setServers(res.data.servers);
            setLoading(false);
        } catch (error) {
            addToast('Failed to load servers', 'error');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-full">
                    <div className="text-white">Loading...</div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <ToastContainer />
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Servers</h1>
                    <p className="text-gray-400">Manage your VPN servers</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {servers.map((server) => (
                        <div key={server._id} className="bg-[#0D1526] border border-[#1E293B] rounded-2xl p-6 hover:border-[#334155] transition">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <span className="text-4xl">{server.flag}</span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{server.name}</h3>
                                        <p className="text-sm text-gray-400">{server.country}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    server.status === 'online'
                                        ? 'bg-green-500/10 text-green-400'
                                        : server.status === 'maintenance'
                                            ? 'bg-orange-500/10 text-orange-400'
                                            : 'bg-red-500/10 text-red-400'
                                }`}>
                  {server.status}
                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Ping</span>
                                    <span className="text-sm font-semibold text-green-400">{server.ping}ms</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Users</span>
                                    <span className="text-sm font-semibold text-white">
                    {server.activeUsers} / {server.maxUsers}
                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Load</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-24 h-2 bg-[#1E293B] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                                                style={{ width: `${(server.activeUsers / server.maxUsers) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-white">
                      {Math.round((server.activeUsers / server.maxUsers) * 100)}%
                    </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-[#1E293B]">
                                <button className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition">
                                    Connect
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}