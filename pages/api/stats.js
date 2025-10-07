import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import Server from '../../models/Server';
import Connection from '../../models/Connection';

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    await dbConnect();

    try {
        const totalUsers = await User.countDocuments();
        const activeConnections = await Connection.countDocuments({ status: 'active' });
        const totalServers = await Server.countDocuments();

        const bandwidth = await Connection.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: { $add: ['$bytesReceived', '$bytesSent'] } }
                }
            }
        ]);

        const recentActivity = await Connection.find({ status: 'active' })
            .populate('userId', 'name email')
            .populate('serverId', 'name country')
            .sort({ startTime: -1 })
            .limit(10);

        res.status(200).json({
            totalUsers,
            activeConnections,
            totalServers,
            bandwidth: bandwidth[0]?.total || 0,
            recentActivity
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
