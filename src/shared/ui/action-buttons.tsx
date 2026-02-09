import React, { ReactNode } from 'react';
import { Edit, Trash2, Check, X, Eye, LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'destructive' | 'primary' | 'ghost';
}

const variantStyles = {
  default: 'border border-border hover:bg-accent',
  destructive: 'border border-destructive text-destructive hover:bg-destructive/10',
  primary: 'bg-primary text-primary-foreground hover:opacity-90',
  ghost: 'hover:bg-accent',
};

export function ActionButton({ 
  onClick, 
  disabled, 
  className = '', 
  label,
  icon: Icon,
  variant = 'default'
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {label}
    </button>
  );
}

export function EditButton({ onClick, disabled, className = '', label = 'Edit' }: ActionButtonProps) {
  return (
    <ActionButton
      onClick={onClick}
      disabled={disabled}
      className={className}
      label={label}
      icon={Edit}
      variant="default"
    />
  );
}

export function DeleteButton({ onClick, disabled, className = '', label = 'Delete' }: ActionButtonProps) {
  return (
    <ActionButton
      onClick={onClick}
      disabled={disabled}
      className={className}
      label={label}
      icon={Trash2}
      variant="destructive"
    />
  );
}

export function ApproveButton({ onClick, disabled, className = '', label = 'Approve' }: ActionButtonProps) {
  return (
    <ActionButton
      onClick={onClick}
      disabled={disabled}
      className={className}
      label={label}
      icon={Check}
      variant="primary"
    />
  );
}

export function RejectButton({ onClick, disabled, className = '', label = 'Reject' }: ActionButtonProps) {
  return (
    <ActionButton
      onClick={onClick}
      disabled={disabled}
      className={className}
      label={label}
      icon={X}
      variant="destructive"
    />
  );
}

export function ViewDetailButton({ onClick, disabled, className = '', label = 'View' }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-primary hover:underline text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <Eye size={16} />
      {label}
    </button>
  );
}

interface ActionButtonGroupProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  approveLabel?: string;
  rejectLabel?: string;
  className?: string;
}

export function ActionButtonGroup({ 
  onEdit, 
  onDelete, 
  onApprove, 
  onReject,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  approveLabel = 'Approve',
  rejectLabel = 'Reject',
  className = '' 
}: ActionButtonGroupProps) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {onReject && <RejectButton onClick={onReject} label={rejectLabel} className="flex-1" />}
      {onApprove && <ApproveButton onClick={onApprove} label={approveLabel} className="flex-1" />}
      {onEdit && <EditButton onClick={onEdit} label={editLabel} className="flex-1" />}
      {onDelete && <DeleteButton onClick={onDelete} label={deleteLabel} className="flex-1" />}
    </div>
  );
}
