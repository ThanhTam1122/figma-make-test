import { Home, Calendar, MessageCircle, Menu, Search } from 'lucide-react';

interface TabNavigationProps {
  userType: 'client' | 'supporter';
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function TabNavigation({ userType, currentPage, onNavigate }: TabNavigationProps) {
  // クライアント用タブ
  const clientTabs = [
    {
      id: 'home',
      icon: Home,
      label: 'ホーム',
    },
    {
      id: 'booking',
      icon: Calendar,
      label: '予約',
    },
    {
      id: 'chat',
      icon: MessageCircle,
      label: 'チャット',
    },
    {
      id: 'menu',
      icon: Menu,
      label: 'メニュー',
    },
  ];

  // サポーター用タブ
  const supporterTabs = [
    {
      id: 'home',
      icon: Home,
      label: 'ホーム',
    },
    {
      id: 'job-search',
      icon: Search,
      label: 'お仕事',
    },
    {
      id: 'chat',
      icon: MessageCircle,
      label: 'チャット',
    },
    {
      id: 'menu',
      icon: Menu,
      label: 'メニュー',
    },
  ];

  const tabs = userType === 'client' ? clientTabs : supporterTabs;

  const isActive = (tabId: string) => {
    // 現在のページに基づいてアクティブ状態を判定
    if (tabId === 'home' && currentPage === 'home') return true;
    if (tabId === 'booking' && (currentPage === 'schedule' || currentPage === 'job-posting')) return true;
    if (tabId === 'job-search' && (currentPage === 'job-search' || currentPage === 'schedule')) return true;
    if (tabId === 'chat' && currentPage === 'chat') return true;
    if (tabId === 'menu' && (
      currentPage === 'menu' || 
      currentPage === 'payment' || 
      currentPage === 'reward' || 
      currentPage === 'requests' || 
      currentPage === 'profile'
    )) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40">
      <div className="grid grid-cols-4 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                active 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={24} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-xs ${active ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
