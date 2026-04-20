// components/common/GridToggle.tsx
import { ToggleGroup, ToggleGroupItem } from '@/components/ui'; // Assuming this is the correct path to your UI components
import { Grid2X2, Grid3x3 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn is a utility for class names

type GridLayout = '2x2' | '3x3';

interface GridToggleProps {
  gridLayout: GridLayout;
  setGridLayout: (layout: GridLayout) => void;
}

export default function GridViewToggle({
  gridLayout,
  setGridLayout,
}: GridToggleProps) {
  const toggleButtonClass = cn(
    'w-9 h-9 flex items-center justify-center rounded-full! text-neutral-500 transition-colors cursor-pointer',
    'data-[state=on]:bg-accent-red-900 data-[state=on]:text-white hover:bg-primary-100'
  );

  const getIconColor = (value: string) =>
    gridLayout === value ? 'text-white' : 'text-primary-300';

  return (
    <ToggleGroup
      type='single'
      value={gridLayout}
      onValueChange={(val) => {
        if (val === '2x2' || val === '3x3') {
          setGridLayout(val);
        }
      }}
      className='inline-flex items-center bg-neutral-50 border rounded-full py-0.5 px-1 overflow-hidden'
    >
      <ToggleGroupItem
        value='2x2'
        aria-label='Grid2X2'
        className={toggleButtonClass}
      >
        <Grid2X2 className={`w-5 h-5 ${getIconColor('2x2')}`} />
      </ToggleGroupItem>
      <ToggleGroupItem
        value='3x3'
        aria-label='Grid3x3'
        className={toggleButtonClass}
      >
        <Grid3x3 className={`w-5 h-5 ${getIconColor('3x3')}`} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
