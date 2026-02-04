import { Home, Calendar, MessageCircle, FileText, User, Search, Users, Bell } from 'lucide-react';
import { DollarSign, CreditCard } from 'lucide-react';
import { TabNavigation } from './tab-navigation';
import React, { useState } from 'react';
import { NotificationDrawer } from './notification-drawer';
import { useMenu } from '../../contexts/menu-context';

interface MobileLayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  onPageChangeWithJobType?: (page: string, jobType?: 'regular' | 'spot') => void;
  userType: 'client' | 'supporter';
  pendingReportsCount?: number;
}

export function MobileLayout({ children, currentPage, onPageChange, onPageChangeWithJobType, userType, pendingReportsCount = 0 }: MobileLayoutProps) {
  // モック：お知らせ未読数
  const unreadNotifications = 3;

  // タブナビゲーションのハンドラー
  const handleTabNavigate = (tabId: string) => {
    if (tabId === 'booking' || tabId === 'menu') {
      // booking と menu ページに遷移
      onPageChange(tabId);
    } else {
      onPageChange(tabId);
    }
  };

  const [isNotificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
              <span className="text-lg">✨</span>
            </div>
            <h1 className="text-lg font-bold">きらりライフサポート</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* お知らせアイコン */}
            <button 
              onClick={() => setNotificationDrawerOpen(true)}
              className="relative p-2 hover:bg-primary-foreground/10 rounded-full transition-colors"
            >
              <Bell size={22} />
              {unreadNotifications > 0 && (
                <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold">{unreadNotifications}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Tab Navigation */}
      <TabNavigation userType={userType} currentPage={currentPage} onNavigate={handleTabNavigate} />

      {/* Notification Drawer */}
      <NotificationDrawer isOpen={isNotificationDrawerOpen} onClose={() => setNotificationDrawerOpen(false)} />
    </div>
  );
}