import React, { useEffect, useRef, useState } from 'react';

interface PickerOption {
  value: string | number;
  label: string;
}

interface ScrollPickerProps {
  value: string | number;
  onChange: (value: string | number) => void;
  onClose: () => void;
  options?: PickerOption[];
  min?: number;
  max?: number;
  title?: string;
  suffix?: string;
  cancelLabel?: string;
  confirmLabel?: string;
}

export function ScrollPicker({ 
  value, 
  onChange, 
  onClose,
  options,
  min = 1,
  max = 60,
  title = 'Select',
  suffix = '',
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm'
}: ScrollPickerProps) {
  // Generate options from min/max if not provided
  const pickerOptions: PickerOption[] = options || 
    Array.from({ length: max - min + 1 }, (_, i) => ({
      value: i + min,
      label: `${i + min}${suffix}`
    }));

  const [selectedValue, setSelectedValue] = useState(value);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 48;

  useEffect(() => {
    // Set initial scroll position
    if (scrollContainerRef.current) {
      const selectedIndex = pickerOptions.findIndex(opt => opt.value === value);
      if (selectedIndex !== -1) {
        scrollContainerRef.current.scrollTop = selectedIndex * itemHeight;
      }
    }
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const scrollTop = scrollContainerRef.current.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const option = pickerOptions[index];
    if (option) {
      setSelectedValue(option.value);
    }
  };

  const handleConfirm = () => {
    onChange(selectedValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            {cancelLabel}
          </button>
          <h3 className="font-bold">{title}</h3>
          <button
            onClick={handleConfirm}
            className="text-primary font-bold"
          >
            {confirmLabel}
          </button>
        </div>

        {/* Picker */}
        <div className="relative h-64 overflow-hidden">
          {/* Selection frame */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 border-y-2 border-primary bg-primary/5 pointer-events-none z-10" />
          
          {/* Scrollable list */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="h-full overflow-y-scroll snap-y snap-mandatory"
            style={{
              scrollSnapType: 'y mandatory',
              scrollPaddingTop: '96px', // (256px - 48px) / 2
              scrollPaddingBottom: '96px',
            }}
          >
            {/* Top padding */}
            <div style={{ height: '96px' }} />
            
            {/* Options list */}
            {pickerOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center justify-center snap-start"
                style={{ height: `${itemHeight}px` }}
              >
                <span
                  className={`text-2xl transition-all ${
                    option.value === selectedValue
                      ? 'font-bold text-foreground scale-110'
                      : 'text-muted-foreground'
                  }`}
                >
                  {option.label}
                </span>
              </div>
            ))}
            
            {/* Bottom padding */}
            <div style={{ height: '96px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Specialized floor picker for backward compatibility
interface FloorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  title?: string;
  cancelLabel?: string;
  confirmLabel?: string;
}

export function FloorPicker({ 
  value, 
  onChange, 
  onClose,
  title = 'Floor',
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm'
}: FloorPickerProps) {
  return (
    <ScrollPicker
      value={value ? parseInt(value) : 1}
      onChange={(val) => onChange(val.toString())}
      onClose={onClose}
      min={1}
      max={60}
      suffix=""
      title={title}
      cancelLabel={cancelLabel}
      confirmLabel={confirmLabel}
    />
  );
}
