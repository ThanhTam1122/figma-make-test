import React, { ReactNode } from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  valueClassName?: string;
  className?: string;
}

export function StatsCard({ label, value, icon, valueClassName = 'text-primary', className = '' }: StatsCardProps) {
  return (
    <div className={`bg-white rounded-lg border border-border p-4 ${className}`}>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center gap-2">
        {icon}
        <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
      </div>
    </div>
  );
}
