import React, { useState } from 'react';
import { Calendar, Search, Filter, Plus, Edit, X, Check } from 'lucide-react';

interface Schedule {
  id: number;
  date: string;
  time: string;
  client: string;
  supporter: string;
  service: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export function ScheduleManagement() {
  const [selectedDate, setSelectedDate] = useState('2026-01-17');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [showMatchModal, setShowMatchModal] = useState(false);

  // モックデータ
  const schedules: Schedule[] = [
    {
      id: 1,
      date: '2026-01-17',
      time: '10:00-12:00',
      client: '鈴木 太郎',
      supporter: '山田 花子',
      service: '定期清掃',
      status: 'scheduled',
    },
    {
      id: 2,
      date: '2026-01-17',
      time: '13:00-15:00',
      client: '田中 恵子',
      supporter: '佐藤 明美',
      service: '定期清掃',
      status: 'scheduled',
    },
    {
      id: 3,
      date: '2026-01-17',
      time: '14:00-16:00',
      client: '高橋 一郎',
      supporter: '山田 花子',
      service: 'スポット清掃',
      status: 'scheduled',
    },
    {
      id: 4,
      date: '2026-01-16',
      time: '10:00-12:00',
      client: '佐藤 美咲',
      supporter: '田中 直美',
      service: '定期清掃',
      status: 'completed',
    },
    {
      id: 5,
      date: '2026-01-16',
      time: '14:00-16:00',
      client: '山本 健一',
      supporter: '佐藤 明美',
      service: '定期清掃',
      status: 'completed',
    },
  ];

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = 
      schedule.client.includes(searchTerm) ||
      schedule.supporter.includes(searchTerm) ||
      schedule.service.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || schedule.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">予定</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">完了</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">キャンセル</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">スケジュール管理</h2>
          <p className="text-sm text-muted-foreground">
            全スケジュール：{schedules.length}件 / 今日の予定：{schedules.filter(s => s.date === selectedDate).length}件
          </p>
        </div>
        <button
          onClick={() => setShowMatchModal(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-2"
        >
          <Plus size={20} />
          新規マッチング
        </button>
      </div>

      {/* フィルター・検索バー */}
      <div className="bg-white rounded-lg border border-border p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="ご利用者、サポーター、サービスで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input-background"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-input-background"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-border rounded-lg bg-input-background"
            >
              <option value="all">すべて</option>
              <option value="scheduled">予定</option>
              <option value="completed">完了</option>
              <option value="cancelled">キャンセル</option>
            </select>
          </div>
        </div>
      </div>

      {/* スケジュール一覧 */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-accent border-b border-border">
              <tr>
                <th className="text-left p-4 text-sm font-medium">日時</th>
                <th className="text-left p-4 text-sm font-medium">ご利用者</th>
                <th className="text-left p-4 text-sm font-medium">サポーター</th>
                <th className="text-left p-4 text-sm font-medium">サービス内容</th>
                <th className="text-left p-4 text-sm font-medium">ステータス</th>
                <th className="text-left p-4 text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    スケジュールが見つかりません
                  </td>
                </tr>
              ) : (
                filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="border-b border-border last:border-0 hover:bg-accent/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-primary" />
                        <div>
                          <div className="font-medium">{schedule.date}</div>
                          <div className="text-xs text-muted-foreground">{schedule.time}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{schedule.client}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-medium">{schedule.supporter}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm">{schedule.service}</span>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(schedule.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-accent rounded">
                          <Edit size={16} className="text-primary" />
                        </button>
                        <button className="p-1 hover:bg-accent rounded">
                          <X size={16} className="text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* マッチングモーダル */}
      {showMatchModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <h3>新規スケジュール作成</h3>
              <button
                onClick={() => setShowMatchModal(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block mb-2">ご利用者</label>
                <select className="w-full px-3 py-2 border border-border rounded-lg bg-input-background">
                  <option>鈴木 太郎</option>
                  <option>田中 恵子</option>
                  <option>高橋 一郎</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">サポーター</label>
                <select className="w-full px-3 py-2 border border-border rounded-lg bg-input-background">
                  <option>山田 花子</option>
                  <option>佐藤 明美</option>
                  <option>田中 直美</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">訪問日</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-2">開始時間</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                  />
                </div>
                <div>
                  <label className="block mb-2">終了時間</label>
                  <input
                    type="time"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2">サービス内容</label>
                <select className="w-full px-3 py-2 border border-border rounded-lg bg-input-background">
                  <option>定期清掃</option>
                  <option>スポット清掃</option>
                  <option>料理代行</option>
                  <option>買い物代行</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">備考</label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                  rows={3}
                  placeholder="特記事項があれば入力してください"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => setShowMatchModal(false)}
                  className="flex-1 py-3 border border-border rounded-lg hover:bg-accent"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    setShowMatchModal(false);
                    // TODO: スケジュール作成処理
                  }}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  作成
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
