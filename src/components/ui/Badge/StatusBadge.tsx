import React from 'react';
import Badge from './Badge';

export type GameStatus = 'draft' | 'active' | 'completed' | 'expired';
export type PlayerStatus = 'playing' | 'won' | 'eliminated';
export type SystemStatus = 'online' | 'offline' | 'maintenance' | 'error';

type Status = GameStatus | PlayerStatus | SystemStatus;

interface StatusBadgeProps extends Omit<React.ComponentProps<typeof Badge>, 'variant' | 'children'> {
  status: Status;
  showIcon?: boolean;
  customLabel?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showIcon = true,
  customLabel,
  ...props
}) => {
  // Status configuration
  const statusConfig = {
    // Game statuses
    draft: {
      variant: 'info' as const,
      label: 'Draft',
      icon: '📝'
    },
    active: {
      variant: 'success' as const,
      label: 'Active',
      icon: '🟢'
    },
    completed: {
      variant: 'primary' as const,
      label: 'Completed',
      icon: '✅'
    },
    expired: {
      variant: 'default' as const,
      label: 'Expired',
      icon: '⏰'
    },
    
    // Player statuses
    playing: {
      variant: 'info' as const,
      label: 'Playing',
      icon: '🎮'
    },
    won: {
      variant: 'success' as const,
      label: 'Won',
      icon: '🏆'
    },
    eliminated: {
      variant: 'error' as const,
      label: 'Eliminated',
      icon: '❌'
    },
    
    // System statuses
    online: {
      variant: 'success' as const,
      label: 'Online',
      icon: '🟢'
    },
    offline: {
      variant: 'default' as const,
      label: 'Offline',
      icon: '⚫'
    },
    maintenance: {
      variant: 'warning' as const,
      label: 'Maintenance',
      icon: '🔧'
    },
    error: {
      variant: 'error' as const,
      label: 'Error',
      icon: '⚠️'
    },
  };

  const config = statusConfig[status];
  
  if (!config) {
    console.warn(`Unknown status: ${status}`);
    return (
      <Badge variant="default" {...props}>
        {customLabel || status}
      </Badge>
    );
  }

  return (
    <Badge
      variant={config.variant}
      icon={showIcon ? config.icon : undefined}
      {...props}
    >
      {customLabel || config.label}
    </Badge>
  );
};

export default StatusBadge;