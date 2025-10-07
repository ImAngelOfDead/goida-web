import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminUsers() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (session && session.user.role !== 'admin' && session.user.role !== 'moderator') {
            router.push('/dashboard');
        }
    }, [status, session, router]);

    useEffect(() => {
        if (session && (session.user.role === 'admin' || session.user.role === 'moderator')) {
            fetchUsers();
        }
    }, [session]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('/api/users');
            setUsers(res.data.users);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            await axios.put(`/api/users/${userId}`, { role: newRole });
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const deleteUser = async (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/api/users/${userId}`);
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">User Management</h1>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] text-white rounded-lg"
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="bg-[#0D1526] border border-[#1E293B] rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-[#0F172A]">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Connections</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1E293B]">
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-[#1E293B]/50">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm font-medium text-white">{user.name}</p>
                                        <p className="text-xs text-gray-400">{user.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                                        className="bg-[#1E293B] text-white px-3 py-1 rounded-lg text-sm border border-[#334155]"
                                        disabled={session?.user?.role !== 'admin'}
                                    >
                                        <option value="user">User</option>
                                        <option value="premium">Premium</option>
                                        <option value="moderator">Moderator</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                    <span className={`flex items-center text-sm ${
                        user.status === 'active' ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                          user.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                      }`}></span>
                        {user.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-white">{user.connections}</td>
                                <td className="px-6 py-4">
                                    {session?.user?.role === 'admin' && (
                                        <button
                                            onClick={() => deleteUser(user._id)}
                                            className="text-red-400 hover:text-red-300 text-sm"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
