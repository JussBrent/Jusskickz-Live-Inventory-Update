import React from 'react';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function SyncStatus({ status }) {
  if (status === 'idle') return null;

  const configs = {
    syncing: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      icon: RefreshCw,
      message: 'Syncing to Google Sheets...',
      spin: true
    },
    success: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      icon: CheckCircle,
      message: 'Successfully synced to Google Sheets!',
      spin: false
    },
    error: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      icon: AlertCircle,
      message: 'Failed to sync to Google Sheets',
      spin: false
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`mt-4 px-4 py-2 rounded-lg flex items-center gap-2 ${config.bg} ${config.text}`}>
      <Icon size={16} className={config.spin ? 'animate-spin' : ''} />
      <span className="text-sm font-medium">{config.message}</span>
    </div>
  );
}