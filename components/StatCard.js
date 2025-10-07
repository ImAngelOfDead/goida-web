export default function StatCard({ icon, label, value, badge, trend }) {
    return (
        <div className="bg-[#0D1526] border border-[#1E293B] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{icon}</span>
                {badge && (
                    <span className={`px-2 py-1 rounded-full text-xs ${badge.className}`}>
            {badge.text}
          </span>
                )}
            </div>
            <p className="text-gray-400 text-sm mb-1">{label}</p>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-white">{value}</p>
                {trend && (
                    <span className={`text-sm ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
                )}
            </div>
        </div>
    );
}