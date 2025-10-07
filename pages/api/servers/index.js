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

    if (req.method === 'GET') {
        try {
            const servers = await Server.find({}).sort({ country: 1 });
            res.status(200).json({ servers });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else if (req.method === 'POST') {
        if (session.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        try {
            const server = await Server.create(req.body);
            res.status(201).json({ server });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
