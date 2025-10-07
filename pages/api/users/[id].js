import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session || session.user.role !== 'admin') {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    await dbConnect();

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const user = await User.findById(id).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else if (req.method === 'PUT') {
        try {
            const user = await User.findByIdAndUpdate(id, req.body, { new: true }).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ user });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else if (req.method === 'DELETE') {
        try {
            const user = await User.findByIdAndDelete(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}