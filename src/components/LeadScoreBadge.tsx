// Lead Score Badge Component
import React from 'react';
import { Chip } from '@mui/material';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BoltIcon from '@mui/icons-material/Bolt';
import AcUnitIcon from '@mui/icons-material/AcUnit';

interface LeadScoreBadgeProps {
  score: number;
  size?: 'small' | 'medium';
  showIcon?: boolean;
}

export const LeadScoreBadge: React.FC<LeadScoreBadgeProps> = ({
  score,
  size = 'medium',
  showIcon = true,
}) => {
  const getScoreConfig = (score: number) => {
    if (score >= 70) {
      return {
        label: `${score} 🔥`,
        color: '#E53E3E' as const,
        textColor: '#FFFFFF',
        icon: <LocalFireDepartmentIcon sx={{ fontSize: 16 }} />,
        classification: 'Hot',
      };
    } else if (score >= 40) {
      return {
        label: `${score} ⚡`,
        color: '#FFB800' as const,
        textColor: '#000000',
        icon: <BoltIcon sx={{ fontSize: 16 }} />,
        classification: 'Warm',
      };
    } else {
      return {
        label: `${score} ❄️`,
        color: '#00B4D8' as const,
        textColor: '#FFFFFF',
        icon: <AcUnitIcon sx={{ fontSize: 16 }} />,
        classification: 'Cold',
      };
    }
  };

  const config = getScoreConfig(score);

  return (
    <Chip
      label={config.label}
      icon={showIcon ? config.icon : undefined}
      size={size}
      sx={{
        backgroundColor: config.color,
        color: config.textColor,
        fontWeight: 600,
        '& .MuiChip-icon': {
          color: config.textColor,
        },
      }}
    />
  );
};

export default LeadScoreBadge;
