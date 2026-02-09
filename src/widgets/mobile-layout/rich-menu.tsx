import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CalendarCheck, Calendar, ClipboardCheck, MessageCircle, FileText, Settings, CreditCard, Search, DollarSign, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RichMenuItem {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  jobType?: 'regular' | 'spot';
}

interface RichMenuProps {
  userType: 'client' | 'supporter';
  onNavigate: (page: string, jobType?: 'regular' | 'spot') => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function RichMenu({ userType, onNavigate, isOpen, setIsOpen }: RichMenuProps) {
  // クライアント用メニュー項目
  const clientMenuItems: RichMenuItem[] = [
    {
      id: 'home',
      icon: Home,
      label: 'ホーム',
      color: 'bg-white text-primary',
    },
    {
      id: 'job-posting-spot',
      icon: Calendar,
      label: 'スポットで依頼',
      color: 'bg-white text-primary',
      jobType: 'spot',
    },
    {
      id: 'job-posting-regular',
      icon: CalendarCheck,
      label: '定期で依頼',
      color: 'bg-white text-primary',
      jobType: 'regular',
    },
    {
      id: 'chat',
      icon: MessageCircle,
      label: 'チャット',
      color: 'bg-white text-primary',
    },
    {
      id: 'schedule',
      icon: ClipboardCheck,
      label: 'スケジュール／レポート',
      color: 'bg-white text-primary',
    },
    {
      id: 'requests',
      icon: FileText,
      label: '各種申請',
      color: 'bg-white text-primary',
    },
    {
      id: 'payment',
      icon: CreditCard,
      label: 'お支払い',
      color: 'bg-white text-primary',
    },
    {
      id: 'profile',
      icon: Settings,
      label: '設定',
      color: 'bg-white text-gray-600',
    },
  ];

  // サポーター用メニュー項目
  const supporterMenuItems: RichMenuItem[] = [
    {
      id: 'home',
      icon: Home,
      label: 'ホーム',
      color: 'bg-white text-primary',
    },
    {
      id: 'job-search',
      icon: Search,
      label: 'お仕事をさがす',
      color: 'bg-white text-primary',
    },
    {
      id: 'chat',
      icon: MessageCircle,
      label: 'チャット',
      color: 'bg-white text-primary',
    },
    {
      id: 'schedule',
      icon: ClipboardCheck,
      label: 'スケジュール／レポート',
      color: 'bg-white text-primary',
    },
    {
      id: 'requests',
      icon: FileText,
      label: '各種申請',
      color: 'bg-white text-primary',
    },
    {
      id: 'reward',
      icon: DollarSign,
      label: '報酬',
      color: 'bg-white text-primary',
    },
    {
      id: 'profile',
      icon: Settings,
      label: '設定',
      color: 'bg-white text-gray-600',
    },
  ];

  const menuItems = userType === 'client' ? clientMenuItems : supporterMenuItems;

  const handleItemClick = (item: RichMenuItem) => {
    if (item.jobType) {
      onNavigate('job-posting', item.jobType);
    } else {
      onNavigate(item.id);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* 折りたたみボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-primary text-primary-foreground py-2.5 flex items-center justify-center gap-2 shadow-lg hover:opacity-90 transition-all border-t border-primary-foreground/10"
      >
        {isOpen ? (
          <>
            <ChevronDown size={20} />
            <span className="text-sm font-medium">メニューを閉じる</span>
          </>
        ) : (
          <>
            <ChevronUp size={20} />
            <span className="text-sm font-medium">メニューを開く</span>
          </>
        )}
      </button>

      {/* リッチメニュー本体 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-background shadow-2xl"
          >
            <div className={`grid grid-cols-4 gap-0.5 bg-border p-0.5`}>
              {menuItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`
                      ${item.color} 
                      p-4 flex flex-col items-center justify-center gap-2 
                      hover:brightness-95 active:brightness-90 transition-all
                      min-h-[90px] rounded-sm
                    `}
                  >
                    <Icon size={28} strokeWidth={2} />
                    <span className="text-xs font-medium text-center leading-tight">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}