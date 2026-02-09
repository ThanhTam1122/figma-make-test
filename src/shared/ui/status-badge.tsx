import React from 'react';

export type StatusVariant = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'active' 
  | 'inactive'
  | 'open'
  | 'closed'
  | 'reviewing'
  | 'completed'
  | 'cancelled'
  | 'pending_partner'
  | 'pending_admin'
  | 'draft'
  | 'sent'
  | 'scheduled'
  | 'matched'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

interface StatusBadgeProps {
  variant?: StatusVariant;
  label: string;
  color?: string;
  className?: string;
}

const variantColors: Record<StatusVariant, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
  open: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
  reviewing: 'bg-amber-100 text-amber-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
  pending_partner: 'bg-amber-100 text-amber-700',
  pending_admin: 'bg-amber-100 text-amber-700',
  draft: 'bg-gray-100 text-gray-700',
  sent: 'bg-green-100 text-green-700',
  scheduled: 'bg-purple-100 text-purple-700',
  matched: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

export function StatusBadge({ variant, label, color, className = '' }: StatusBadgeProps) {
  const colorClass = color || (variant ? variantColors[variant] : 'bg-gray-100 text-gray-700');

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {label}
    </span>
  );
}
