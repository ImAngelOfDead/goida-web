import mongoose from 'mongoose';

const ServerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    flag: {
        type: String,
        required: true
    },
    host: {
        type: String,
        required: true
    },
    port: {
        type: Number,
        required: true
    },
    username: String,
    password: String,
    status: {
        type: String,
        enum: ['online', 'offline', 'maintenance'],
        default: 'online'
    },
    ping: {
        type: Number,
        default: 0
    },
    activeUsers: {
        type: Number,
        default: 0
    },
    maxUsers: {
        type: Number,
        default: 1000
    },
    bandwidth: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Server || mongoose.model('Server', ServerSchema);