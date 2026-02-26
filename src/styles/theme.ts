// CRM B2B Tech Foursys - Material-UI Theme (Design System Foursys)
// Baseado em design-toolkit-17-12.md

import { createTheme, ThemeOptions } from '@mui/material/styles';

// ============================================================================
// PALETA DE CORES FOURSYS
// ============================================================================

const foursysColors = {
  // Primary/Brand (Design Toolkit)
  primary: {
    main: '#000000',
    light: '#F1F5F9',
    dark: '#000000',
    contrastText: '#FFFFFF',
  },
  // Accent
  secondary: {
    main: '#18C964',
    light: '#E6FDF1',
    dark: '#16A34A',
    contrastText: '#0F172A',
  },
  // Status
  success: {
    main: '#16A34A',
    light: '#DCFCE7',
    dark: '#15803D',
    contrastText: '#FFFFFF',
  },
  // Status
  warning: {
    main: '#F59E0B',
    light: '#FEF3C7',
    dark: '#D97706',
    contrastText: '#000000',
  },
  // Status
  error: {
    main: '#DC2626',
    light: '#FEE2E2',
    dark: '#B91C1C',
    contrastText: '#FFFFFF',
  },
  // Status
  info: {
    main: '#2563EB',
    light: '#DBEAFE',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
  // Text + neutral surfaces
  grey: {
    50: '#F9FAFB',
    100: '#F8FAFC',
    200: '#EEF2FF',
    300: '#E2E8F0',
    400: '#CBD5E1',
    500: '#94A3B8',
    600: '#64748B',
    700: '#475569',
    800: '#334155',
    900: '#0F172A',
  },
  // Surfaces
  background: {
    default: '#F5F3FF',
    paper: '#FFFFFF',
    dark: '#020617',
  },
  leadScore: {
    hot: '#E53E3E',
    warm: '#FFB800',
    cold: '#00B4D8',
  },
  dealStages: {
    stage1: '#4C8BF5',
    stage2: '#00B4D8',
    stage3: '#FFB800',
    stage4: '#FF8C00',
    stage5: '#00B341',
    won: '#00B341',
    lost: '#E53E3E',
  },
};

// ============================================================================
// TYPOGRAPHY FOURSYS — com responsive clamp
// ============================================================================

const foursysTypography = {
  fontFamily: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(','),
  h1: {
    fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: 'clamp(1.25rem, 3vw, 1.875rem)',
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h4: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 1.75,
    textTransform: 'none' as const,
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 700,
    lineHeight: 2,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  },
};

// ============================================================================
// SPACING & SIZING
// ============================================================================

const foursysSpacing = 8;

const foursysSizing = {
  borderRadius: {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 20,
    pill: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
};

// ============================================================================
// SHADOWS FOURSYS
// ============================================================================

const foursysShadows = [
  'none',
  '0 10px 25px rgba(15,23,42,0.06)',
  '0 18px 45px rgba(15,23,42,0.10)',
  '0 10px 25px rgba(15,23,42,0.06)',
  '0 10px 25px rgba(15,23,42,0.06)',
  '0 18px 45px rgba(15,23,42,0.10)',
];

while (foursysShadows.length < 25) {
  foursysShadows.push(foursysShadows[foursysShadows.length - 1]);
}

// ============================================================================
// COMPONENTS OVERRIDES — com touch targets 48px para mobile
// ============================================================================

const componentsOverrides = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 999,
        padding: '10px 16px',
        fontWeight: 600,
        boxShadow: 'none',
        minHeight: 48,
        textTransform: 'none',
        touchAction: 'manipulation',
        '&:focus-visible': {
          outline: '2px solid #000000',
          outlineOffset: '2px',
        },
        '&:hover': {
          boxShadow: '0 10px 25px rgba(15,23,42,0.06)',
        },
      },
      sizeLarge: {
        padding: '12px 24px',
        fontSize: '1rem',
      },
      sizeSmall: {
        padding: '6px 12px',
        fontSize: '0.813rem',
        minHeight: 40,
      },
    },
    defaultProps: {
      disableElevation: true,
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        minWidth: 48,
        minHeight: 48,
        padding: 12,
        touchAction: 'manipulation',
        '&:focus-visible': {
          outline: '2px solid #000000',
          outlineOffset: '2px',
        },
      },
      sizeSmall: {
        minWidth: 40,
        minHeight: 40,
        padding: 8,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 20,
        boxShadow: '0 10px 25px rgba(15,23,42,0.06)',
        border: '1px solid #EEF2FF',
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        minHeight: 48,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#E2E8F0',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#000000',
          borderWidth: 1,
        },
      },
      notchedOutline: {
        borderColor: '#E2E8F0',
      },
      input: {
        padding: '12px 14px',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiInputBase-root': { minHeight: 48 },
      },
    },
    defaultProps: {
      variant: 'outlined' as const,
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        minHeight: 48,
        touchAction: 'manipulation',
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        minHeight: 48,
        touchAction: 'manipulation',
      },
    },
  },
  MuiBottomNavigation: {
    styleOverrides: {
      root: {
        height: 56,
        borderTop: '1px solid #EEF2FF',
        backgroundColor: '#FFFFFF',
      },
    },
  },
  MuiBottomNavigationAction: {
    styleOverrides: {
      root: {
        minWidth: 60,
        padding: '6px 0 8px',
        touchAction: 'manipulation',
        color: '#94A3B8',
        '&.Mui-selected': {
          color: '#4C1D95',
        },
        '& .MuiBottomNavigationAction-label': {
          fontSize: '0.625rem',
          fontWeight: 600,
          '&.Mui-selected': {
            fontSize: '0.625rem',
          },
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 999,
        fontWeight: 500,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 20,
      },
      rounded: {
        borderRadius: 20,
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 16,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: '0 10px 25px rgba(15,23,42,0.06)',
        backgroundColor: '#FFFFFF',
        color: '#0F172A',
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        '& .MuiTableCell-head': {
          borderBottom: '1px solid #E2E8F0',
          color: '#64748B',
          fontWeight: 600,
        },
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: '#F9FAFB',
        },
      },
    },
  },
};

// ============================================================================
// DARK MODE PALETTE
// ============================================================================

const darkBackground = {
  default: '#0F172A',
  paper: '#1E293B',
};

// ============================================================================
// CUSTOM THEME EXTENSIONS
// ============================================================================

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      leadScore: typeof foursysColors.leadScore;
      dealStages: typeof foursysColors.dealStages;
    };
  }
  interface ThemeOptions {
    custom?: {
      leadScore?: typeof foursysColors.leadScore;
      dealStages?: typeof foursysColors.dealStages;
    };
  }
}

// ============================================================================
// THEME FACTORY
// ============================================================================

export function createAppTheme(mode: 'light' | 'dark') {
  const isDark = mode === 'dark';

  const themeOptions: ThemeOptions = {
    palette: {
      mode,
      primary: foursysColors.primary,
      secondary: foursysColors.secondary,
      success: foursysColors.success,
      warning: foursysColors.warning,
      error: foursysColors.error,
      info: foursysColors.info,
      grey: foursysColors.grey,
      background: isDark ? darkBackground : foursysColors.background,
      ...(isDark && {
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
          disabled: '#475569',
        },
        divider: '#334155',
        action: {
          hover: 'rgba(255,255,255,0.05)',
          selected: 'rgba(255,255,255,0.08)',
          disabled: '#475569',
          disabledBackground: '#1E293B',
        },
      }),
    },
    typography: foursysTypography,
    spacing: foursysSpacing,
    shape: {
      borderRadius: foursysSizing.borderRadius.lg,
    },
    shadows: foursysShadows as any,
    components: {
      ...componentsOverrides,
      ...(isDark && {
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 20,
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              border: '1px solid #334155',
              backgroundColor: '#1E293B',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 20,
              backgroundImage: 'none',
            },
          },
        },
        MuiBottomNavigation: {
          styleOverrides: {
            root: {
              height: 56,
              borderTop: '1px solid #334155',
              backgroundColor: '#1E293B',
            },
          },
        },
        MuiBottomNavigationAction: {
          styleOverrides: {
            root: {
              color: '#475569',
              '&.Mui-selected': {
                color: '#A78BFA',
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              minHeight: 48,
              borderRadius: 20,
              backgroundColor: '#0F172A',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#475569',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#7C3AED',
                borderWidth: 1,
              },
            },
            notchedOutline: {
              borderColor: '#334155',
            },
            input: {
              padding: '12px 14px',
            },
          },
        },
        MuiTableHead: {
          styleOverrides: {
            root: {
              '& .MuiTableCell-head': {
                borderBottom: '1px solid #334155',
                color: '#94A3B8',
                fontWeight: 600,
                backgroundColor: '#1E293B',
              },
            },
          },
        },
        MuiTableRow: {
          styleOverrides: {
            root: {
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.03)',
              },
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              borderBottom: '1px solid #1E293B',
            },
          },
        },
        MuiDivider: {
          styleOverrides: {
            root: {
              borderColor: '#334155',
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 999,
              fontWeight: 500,
            },
            outlined: {
              borderColor: '#334155',
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: '0 1px 0 #334155',
              backgroundColor: '#1E293B',
              color: '#F1F5F9',
            },
          },
        },
        MuiTooltip: {
          styleOverrides: {
            tooltip: {
              backgroundColor: '#334155',
              color: '#F1F5F9',
            },
          },
        },
      }),
    },
  };

  const theme = createTheme(themeOptions);
  theme.custom = {
    leadScore: foursysColors.leadScore,
    dealStages: foursysColors.dealStages,
  };
  return theme;
}

export const foursysTheme = createAppTheme('light');
export default foursysTheme;
