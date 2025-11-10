import React from 'react';

export default function StatsCard({ title, value, icon: Icon, color = 'blue' }) {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400'
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${colorClasses[color]}`}>
            {value}
          </p>
        </div>
        {Icon && <Icon className={colorClasses[color]} size={32} />}
      </div>
    </div>
  );
}