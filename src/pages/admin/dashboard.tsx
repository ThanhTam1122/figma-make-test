import React from 'react';
import { Users, UserCheck, Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export function AdminDashboard() {
  // モックデータ
  const stats = [
    {
      label: '今月の訪問件数',
      value: '148',
      change: '+12%',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'アクティブご利用者',
      value: '45',
      change: '+3',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'アクティブサポーター',
      value: '23',
      change: '+2',
      icon: UserCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: '今月の売上',
      value: '¥1,248,000',
      change: '+8%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const pendingItems = [
    { type: '申請承認待ち', count: 5, icon: AlertCircle, color: 'text-amber-600' },
    { type: 'レポート確認待ち', count: 12, icon: CheckCircle, color: 'text-blue-600' },
    { type: '日程調整中', count: 3, icon: Calendar, color: 'text-purple-600' },
  ];

  const recentActivities = [
    { time: '10:30', activity: '新規ご利用者登録', detail: '山田 太郎 様' },
    { time: '10:15', activity: '訪問完了', detail: '鈴木 様 - 山田サポーター' },
    { time: '09:45', activity: '申請承認', detail: '鍵預かり申請が承認されました' },
    { time: '09:20', activity: 'レポート提出', detail: '佐藤サポーター - 定期清掃' },
    { time: '09:00', activity: 'スケジュール変更', detail: '田中 様の訪問日時変更' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={stat.color} size={24} />
                </div>
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 要対応項目 */}
        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="mb-4">要対応項目</h3>
          <div className="space-y-3">
            {pendingItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.type} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className={item.color} size={20} />
                    <span className="font-medium">{item.type}</span>
                  </div>
                  <span className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full">
                    {item.count}件
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 最近のアクティビティ */}
        <div className="bg-white rounded-lg border border-border p-6">
          <h3 className="mb-4">最近のアクティビティ</h3>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                <span className="text-xs text-muted-foreground flex-shrink-0 w-12">{activity.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.activity}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 今日のスケジュール */}
      <div className="bg-white rounded-lg border border-border p-6">
        <h3 className="mb-4">今日のスケジュール</h3>
        <div className="space-y-2">
          {[
            { time: '10:00-12:00', client: '鈴木 太郎', supporter: '山田 花子', service: '定期清掃' },
            { time: '13:00-15:00', client: '田中 恵子', supporter: '佐藤 明美', service: '定期清掃' },
            { time: '14:00-16:00', client: '高橋 一郎', supporter: '山田 花子', service: 'スポット清掃' },
          ].map((schedule, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-accent rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium w-32">
                <Calendar size={16} className="text-primary" />
                {schedule.time}
              </div>
              <div className="flex-1 text-sm">
                <span className="font-medium">{schedule.client}</span>
                <span className="text-muted-foreground"> × </span>
                <span className="font-medium">{schedule.supporter}</span>
              </div>
              <div className="text-sm text-muted-foreground">{schedule.service}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
