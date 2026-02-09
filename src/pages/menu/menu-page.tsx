import { ChevronRight, CreditCard, FileText, Settings, DollarSign, Calendar } from 'lucide-react';

interface MenuPageProps {
  userType: 'client' | 'supporter';
  onNavigate: (page: string) => void;
}

export function MenuPage({ userType, onNavigate }: MenuPageProps) {
  // クライアント用メニュー項目
  const clientMenuItems = [
    {
      id: 'schedule',
      icon: Calendar,
      label: 'スケジュール／レポート',
      description: '予約状況とレポートを確認',
      color: 'text-primary',
    },
    {
      id: 'payment',
      icon: CreditCard,
      label: 'お支払い',
      description: '利用料金と支払い履歴',
      color: 'text-primary',
    },
    {
      id: 'requests',
      icon: FileText,
      label: '各種申請',
      description: '18種類の申請手続き',
      color: 'text-primary',
    },
    {
      id: 'profile',
      icon: Settings,
      label: '設定',
      description: 'アカウント情報と設定',
      color: 'text-gray-600',
    },
  ];

  // サポーター用メニュー項目
  const supporterMenuItems = [
    {
      id: 'schedule',
      icon: Calendar,
      label: 'スケジュール／レポート',
      description: '予約状況とレポートを確認',
      color: 'text-primary',
    },
    {
      id: 'reward',
      icon: DollarSign,
      label: '報酬',
      description: '報酬履歴と振込情報',
      color: 'text-primary',
    },
    {
      id: 'requests',
      icon: FileText,
      label: '各種申請',
      description: '18種類の申請手続き',
      color: 'text-primary',
    },
    {
      id: 'profile',
      icon: Settings,
      label: '設定',
      description: 'アカウント情報と設定',
      color: 'text-gray-600',
    },
  ];

  const menuItems = userType === 'client' ? clientMenuItems : supporterMenuItems;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ヘッダー */}
      <div className="bg-primary text-primary-foreground p-6">
        <h1 className="text-2xl font-bold">メニュー</h1>
        <p className="text-sm mt-1 opacity-90">
          各種機能にアクセスできます
        </p>
      </div>

      {/* メニュー項目 */}
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full bg-card border border-border rounded-lg p-4 flex items-center gap-4 hover:bg-accent transition-colors"
            >
              <div className={`p-3 rounded-full bg-primary/10 ${item.color}`}>
                <Icon size={24} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-base">{item.label}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.description}
                </p>
              </div>
              <ChevronRight size={20} className="text-muted-foreground" />
            </button>
          );
        })}
      </div>

      {/* アプリ情報 */}
      <div className="p-4 mt-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            きらりライフサポート
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            バージョン 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}
