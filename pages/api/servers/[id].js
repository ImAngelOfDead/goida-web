import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/mongodb';
import Server from '../../../models/Server';

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    await dbConnect();

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const server = await Server.findById(id);
            if (!server) {
                return res.status(404).json({ message: 'Server not found' });
            }
            res.status(200).json({ server });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else if (req.method === 'PUT') {
        if (session.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        try {
            const server = await Server.findByIdAndUpdate(id, req.body, { new: true });
            if (!server) {
                return res.status(404).json({ message: 'Server not found' });
            }
            res.status(200).json({ server });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else if (req.method === 'DELETE') {
        if (session.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        try {
            const server = await Server.findByIdAndDelete(id);
            if (!server) {
                return res.status(404).json({ message: 'Server not found' });
            }
            res.status(200).json({ message: 'Server deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}