import mongoose from 'mongoose';

const ConnectionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server',
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: Date,
    bytesReceived: {
        type: Number,
        default: 0
    },
    bytesSent: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'completed'],
        default: 'active'
    }
});

export default mongoose.models.Connection || mongoose.model('Connection', ConnectionSchema);