// Lifecycle Stage Chip Component
import React from 'react';
import { Chip } from '@mui/material';
import type { LifecycleStage } from '../types';

interface LifecycleStageBadgeProps {
  stage: LifecycleStage;
  size?: 'small' | 'medium';
}

const stageConfig: Record<
  LifecycleStage,
  { label: string; color: string; bgColor: string }
> = {
  subscriber: {
    label: 'Subscriber',
    color: '#6B7280',
    bgColor: '#F3F4F6',
  },
  lead: {
    label: 'Lead',
    color: '#00B4D8',
    bgColor: '#E0F7FA',
  },
  mql: {
    label: 'MQL',
    color: '#FFB800',
    bgColor: '#FFF8E1',
  },
  sql: {
    label: 'SQL',
    color: '#FF8C00',
    bgColor: '#FFE0B2',
  },
  opportunity: {
    label: 'Opportunity',
    color: '#0052CC',
    bgColor: '#E3F2FD',
  },
  customer: {
    label: 'Customer',
    color: '#00B341',
    bgColor: '#E8F5E9',
  },
  evangelist: {
    label: 'Evangelist',
    color: '#9C27B0',
    bgColor: '#F3E5F5',
  },
};

export const LifecycleStageBadge: React.FC<LifecycleStageBadgeProps> = ({
  stage,
  size = 'medium',
}) => {
  const config = stageConfig[stage];

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        backgroundColor: config.bgColor,
        color: config.color,
        fontWeight: 600,
        border: `1px solid ${config.color}30`,
      }}
    />
  );
};

export default LifecycleStageBadge;
