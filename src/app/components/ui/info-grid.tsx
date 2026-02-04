import React, { ReactNode } from 'react';

interface InfoItem {
  label: string;
  value: ReactNode;
  fullWidth?: boolean;
}

interface InfoGridProps {
  title?: string;
  items: InfoItem[];
  columns?: 1 | 2;
  className?: string;
}

export function InfoGrid({ title, items, columns = 2, className = '' }: InfoGridProps) {
  const gridClass = columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1';

  return (
    <div className={className}>
      {title && (
        <h4 className="mb-3 pb-2 border-b border-border font-bold">{title}</h4>
      )}
      <div className={`grid ${gridClass} gap-4`}>
        {items.map((item, index) => (
          <div key={index} className={item.fullWidth ? 'md:col-span-2' : ''}>
            <label className="text-sm text-muted-foreground block mb-1">{item.label}</label>
            <div className="font-medium">{item.value || '-'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
