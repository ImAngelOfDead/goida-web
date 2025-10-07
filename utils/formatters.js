export function formatBytes(bytes) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

export function getStatusColor(status) {
    const colors = {
        online: 'bg-green-500/10 text-green-400',
        offline: 'bg-red-500/10 text-red-400',
        maintenance: 'bg-orange-500/10 text-orange-400',
        active: 'bg-green-500/10 text-green-400',
        inactive: 'bg-gray-500/10 text-gray-400',
        banned: 'bg-red-500/10 text-red-400',
    };

    return colors[status] || 'bg-gray-500/10 text-gray-400';
}
