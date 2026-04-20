'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui';
import { useTheme } from 'next-themes';

const ThemeButton = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="h-full">
      <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </Button>
    </div>
  );
};

export default ThemeButton;
