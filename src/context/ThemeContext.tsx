import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';

type ThemeMode = 'light' | 'dark' | 'dark-blue' | 'forest' | 'high-contrast';

interface ThemeConfig {
  name: ThemeMode;
  displayName: string;
  primaryColor: string;
  algorithm: any;
  token: Record<string, any>;
}

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  themeConfig: ThemeConfig;
  availableThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const availableThemes: ThemeConfig[] = [
  {
    name: 'light',
    displayName: '☀️ Light',
    primaryColor: '#1890ff',
    algorithm: theme.defaultAlgorithm,
    token: {
      colorBgContainer: '#ffffff',
      colorBgElevated: '#ffffff',
      colorBgLayout: '#f5f5f5',
      colorText: '#000000',
      colorTextSecondary: '#666666',
      colorBorder: '#d9d9d9',
      colorBorderSecondary: '#f0f0f0',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    }
  },
  {
    name: 'dark',
    displayName: '🌙 Dark',
    primaryColor: '#1890ff',
    algorithm: theme.darkAlgorithm,
    token: {
      colorBgContainer: '#141414',
      colorBgElevated: '#1f1f1f',
      colorBgLayout: '#000000',
      colorText: '#ffffff',
      colorTextSecondary: '#a6a6a6',
      colorBorder: '#434343',
      colorBorderSecondary: '#303030',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    }
  },
  {
    name: 'dark-blue',
    displayName: '🌌 Professional',
    primaryColor: '#4096ff',
    algorithm: theme.darkAlgorithm,
    token: {
      colorBgContainer: '#0f1419',
      colorBgElevated: '#161b22',
      colorBgLayout: '#0d1117',
      colorText: '#e6edf3',
      colorTextSecondary: '#7d8590',
      colorBorder: '#21262d',
      colorBorderSecondary: '#30363d',
      colorPrimary: '#4096ff',
      colorSuccess: '#3fb950',
      colorWarning: '#d29922',
      colorError: '#f85149',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6)',
    }
  },
  {
    name: 'forest',
    displayName: '🌿 Forest',
    primaryColor: '#52c41a',
    algorithm: theme.darkAlgorithm,
    token: {
      colorBgContainer: '#0f1b0f',
      colorBgElevated: '#162016',
      colorBgLayout: '#0a120a',
      colorText: '#e8f5e8',
      colorTextSecondary: '#95d895',
      colorBorder: '#2d4a2d',
      colorBorderSecondary: '#1a331a',
      colorPrimary: '#52c41a',
      colorSuccess: '#73d13d',
      colorWarning: '#faad14',
      colorError: '#ff7875',
      boxShadow: '0 4px 12px rgba(0, 50, 0, 0.3)',
    }
  },
  {
    name: 'high-contrast',
    displayName: '🔲 High Contrast',
    primaryColor: '#ff6b35',
    algorithm: theme.darkAlgorithm,
    token: {
      colorBgContainer: '#000000',
      colorBgElevated: '#111111',
      colorBgLayout: '#000000',
      colorText: '#ffffff',
      colorTextSecondary: '#cccccc',
      colorBorder: '#ffffff',
      colorBorderSecondary: '#888888',
      colorPrimary: '#ff6b35',
      colorSuccess: '#00ff00',
      colorWarning: '#ffff00',
      colorError: '#ff0000',
      boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
    }
  }
];

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    if (savedTheme && availableThemes.find(t => t.name === savedTheme)) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  const currentTheme = availableThemes.find(t => t.name === themeMode) || availableThemes[0];

  useEffect(() => {
    localStorage.setItem('theme', themeMode);
    
    // Update body class for global styling
    document.body.className = `theme-${themeMode}`;
    
    // Apply CSS custom properties for advanced styling
    const root = document.documentElement;
    root.style.setProperty('--primary-color', currentTheme.primaryColor);
    root.style.setProperty('--bg-container', currentTheme.token.colorBgContainer);
    root.style.setProperty('--bg-layout', currentTheme.token.colorBgLayout);
    root.style.setProperty('--text-color', currentTheme.token.colorText);
    root.style.setProperty('--border-color', currentTheme.token.colorBorder);
    root.style.setProperty('--box-shadow', currentTheme.token.boxShadow);
  }, [themeMode, currentTheme]);

  const toggleTheme = () => {
    const currentIndex = availableThemes.findIndex(t => t.name === themeMode);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    setThemeMode(availableThemes[nextIndex].name);
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  // Ant Design theme configuration
  const antdTheme = {
    algorithm: currentTheme.algorithm,
    token: {
      ...currentTheme.token,
      borderRadius: 8,
      colorPrimary: currentTheme.primaryColor,
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: 14,
      lineHeight: 1.5714285714285714,
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      themeMode, 
      toggleTheme, 
      setTheme, 
      themeConfig: currentTheme, 
      availableThemes 
    }}>
      <ConfigProvider theme={antdTheme}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}