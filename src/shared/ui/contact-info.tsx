import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

interface ContactInfoProps {
  phone?: string;
  email?: string;
  address?: string;
  className?: string;
}

export function ContactInfo({ phone, email, address, className = '' }: ContactInfoProps) {
  return (
    <div className={`space-y-1 text-sm ${className}`}>
      {phone && (
        <div className="flex items-center gap-1">
          <Phone size={14} className="text-muted-foreground" />
          <span>{phone}</span>
        </div>
      )}
      {email && (
        <div className="flex items-center gap-1">
          <Mail size={14} className="text-muted-foreground" />
          <span>{email}</span>
        </div>
      )}
      {address && (
        <div className="flex items-start gap-1">
          <MapPin size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{address}</span>
        </div>
      )}
    </div>
  );
}
