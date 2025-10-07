import { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: 'bg-green-500/10 border-green-500/20 text-green-400',
        error: 'bg-red-500/10 border-red-500/20 text-red-400',
        warning: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    };

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
    };

    return (
        <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border ${styles[type]} backdrop-blur-sm`}>
            <span className="text-xl">{icons[type]}</span>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition"
            >
                ✕
            </button>
        </div>
    );
}