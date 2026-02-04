import React, { ReactNode, useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Calendar, 
  ClipboardCheck, 
  FileText, 
  Bell, 
  DollarSign,
  Menu,
  X,
  LogOut,
  Heart
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function AdminLayout({ children, currentPage, onPageChange }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'ダッシュボード' },
    { id: 'clients', icon: Users, label: 'ご利用者管理' },
    { id: 'supporters', icon: UserCheck, label: 'サポーター管理' },
    { id: 'matching', icon: Heart, label: 'マッチング管理' },
    { id: 'schedules', icon: Calendar, label: 'スケジュール管理' },
    { id: 'reports', icon: ClipboardCheck, label: 'レポート管理' },
    { id: 'applications', icon: FileText, label: '申請管理' },
    { id: 'notifications', icon: Bell, label: 'お知らせ管理' },
    { id: 'billing', icon: DollarSign, label: '売上/請求管理' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* サイドバー（デスクトップ） */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">きらり</h1>
              <p className="text-xs text-muted-foreground">運営管理</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent text-foreground'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent text-destructive">
            <LogOut size={20} />
            <span className="text-sm font-medium">ログアウト</span>
          </button>
        </div>
      </aside>

      {/* モバイルサイドバー */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-xl">✨</span>
                </div>
                <div>
                  <h1 className="font-bold text-lg">きらり</h1>
                  <p className="text-xs text-muted-foreground">運営管理</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-accent rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent text-foreground'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ヘッダー */}
        <header className="bg-white border-b border-border p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-accent rounded-lg"
          >
            <Menu size={24} />
          </button>
          <h2 className="font-medium hidden lg:block">
            {menuItems.find(item => item.id === currentPage)?.label || 'ダッシュボード'}
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">管理者</p>
              <p className="text-xs text-muted-foreground">admin@kirari.com</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span>👤</span>
            </div>
          </div>
        </header>

        {/* コンテンツエリア */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}