import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Edit2, X, ChevronRight } from 'lucide-react';

interface SchedulePageProps {
  userType: 'client' | 'supporter';
}

interface Visit {
  id: number;
  date: string;
  time: string;
  partner: string;
  service: string;
  status: 'upcoming' | 'past';
  report?: {
    content: string;
    images?: string[];
    approvalComment?: string;
    approved: boolean;
  };
}

export function SchedulePage({ userType }: SchedulePageProps) {
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // モックデータ
  const visits: Visit[] = [
    {
      id: 1,
      date: '2026年1月17日（金）',
      time: '10:00 - 12:00',
      partner: userType === 'client' ? '山田 花子' : '田中 太郎',
      service: '定期清掃',
      status: 'upcoming',
    },
    {
      id: 2,
      date: '2026年1月24日（金）',
      time: '10:00 - 12:00',
      partner: userType === 'client' ? '山田 花子' : '田中 太郎',
      service: '定期清掃',
      status: 'upcoming',
    },
    {
      id: 3,
      date: '2026年1月10日（金）',
      time: '10:00 - 12:00',
      partner: userType === 'client' ? '山田 花子' : '佐藤 明美',
      service: '定期清掃',
      status: 'past',
      report: {
        content: 'リビング、キッチン、浴室の清掃を行いました。特にキッチンの油汚れがひどかったため、念入りに清掃しました。窓拭きも実施し、全体的にきれいになりました。',
        approved: true,
        approvalComment: 'いつもありがとうございます。とてもきれいになりました！',
      },
    },
    {
      id: 4,
      date: '2026年1月7日（火）',
      time: '14:00 - 16:00',
      partner: userType === 'client' ? '山田 花子' : '田中 太郎',
      service: '定期清掃',
      status: 'past',
      report: {
        content: 'リビングと寝室の清掃を実施しました。掃除機がけ、床の拭き掃除、トイレ清掃を行いました。',
        approved: false,
      },
    },
  ];

  const filteredVisits = visits.filter(v => v.status === selectedTab);

  const handleEdit = (visit: Visit) => {
    setSelectedVisit(visit);
    setShowEditModal(true);
  };

  const handleCancel = (visit: Visit) => {
    setSelectedVisit(visit);
    setShowCancelModal(true);
  };

  const handleViewReport = (visit: Visit) => {
    setSelectedVisit(visit);
  };

  return (
    <div className="min-h-screen bg-background pb-4">
      {/* タブ */}
      <div className="sticky top-0 bg-white border-b border-border z-10">
        <div className="flex">
          <button
            onClick={() => setSelectedTab('upcoming')}
            className={`flex-1 py-4 text-center transition-colors ${
              selectedTab === 'upcoming'
                ? 'text-primary border-b-2 border-primary font-medium'
                : 'text-muted-foreground'
            }`}
          >
            今後の予定
          </button>
          <button
            onClick={() => setSelectedTab('past')}
            className={`flex-1 py-4 text-center transition-colors ${
              selectedTab === 'past'
                ? 'text-primary border-b-2 border-primary font-medium'
                : 'text-muted-foreground'
            }`}
          >
            過去の訪問・レポート
          </button>
        </div>
      </div>

      {/* スケジュールリスト */}
      <div className="p-4 space-y-3">
        {filteredVisits.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {selectedTab === 'upcoming' ? '予定はありません' : '過去の訪問がありません'}
          </div>
        ) : (
          filteredVisits.map((visit) => (
            <div
              key={visit.id}
              className="bg-card rounded-lg border border-border overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-primary mb-1">
                      <Calendar size={16} />
                      <span className="font-medium">{visit.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={14} />
                      <span>{visit.time}</span>
                    </div>
                  </div>
                  {selectedTab === 'upcoming' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(visit)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                      >
                        <Edit2 size={18} className="text-primary" />
                      </button>
                      <button
                        onClick={() => handleCancel(visit)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                      >
                        <X size={18} className="text-destructive" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-border pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {userType === 'client' ? '担当サポーター' : 'ご利用者様'}
                    </span>
                    <span className="font-medium">{visit.partner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">サービス内容</span>
                    <span className="font-medium">{visit.service}</span>
                  </div>
                </div>

                {/* レポート表示 */}
                {selectedTab === 'past' && visit.report && (
                  <div className="border-t border-border pt-3">
                    <button
                      onClick={() => handleViewReport(visit)}
                      className="w-full flex items-center justify-between p-3 bg-accent hover:bg-accent/80 rounded-lg transition-colors"
                    >
                      <span className="text-sm font-medium">お仕事レポートを見る</span>
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 日程変更モーダル */}
      {showEditModal && selectedVisit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
              <h3>日程変更</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">現在の日時</label>
                <div className="text-sm">
                  {selectedVisit.date} {selectedVisit.time}
                </div>
              </div>
              <div>
                <label className="block mb-2">新しい日付</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                />
              </div>
              <div>
                <label className="block mb-2">開始時間</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                />
              </div>
              <div>
                <label className="block mb-2">変更理由</label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                  rows={3}
                  placeholder="変更理由を入力してください"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 border border-border rounded-lg hover:bg-accent"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    // TODO: 実際の変更処理
                  }}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  変更を申請
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* キャンセルモーダル */}
      {showCancelModal && selectedVisit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md">
            <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
              <h3>訪問のキャンセル</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                この訪問をキャンセルしてもよろしいですか？
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">キャンセル対象</div>
                <div className="font-medium">{selectedVisit.date} {selectedVisit.time}</div>
              </div>
              <div>
                <label className="block mb-2">キャンセル理由</label>
                <textarea
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input-background"
                  rows={3}
                  placeholder="キャンセル理由を入力してください"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-3 border border-border rounded-lg hover:bg-accent"
                >
                  戻る
                </button>
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    // TODO: 実際のキャンセル処理
                  }}
                  className="flex-1 py-3 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90"
                >
                  キャンセルする
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* レポート詳細モーダル */}
      {selectedVisit && selectedVisit.report && !showEditModal && !showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
              <h3>お仕事レポート</h3>
              <button
                onClick={() => setSelectedVisit(null)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">訪問日時</div>
                <div className="font-medium">{selectedVisit.date} {selectedVisit.time}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  {userType === 'client' ? '担当サポーター' : 'ご利用者様'}
                </div>
                <div className="font-medium">{selectedVisit.partner}</div>
              </div>
              <div className="border-t border-border pt-4">
                <div className="text-sm text-muted-foreground mb-2">作業内容</div>
                <p className="text-sm leading-relaxed">{selectedVisit.report.content}</p>
              </div>
              {selectedVisit.report.approved && selectedVisit.report.approvalComment && (
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-sm text-muted-foreground">承認コメント</div>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                      承認済み
                    </span>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                    {selectedVisit.report.approvalComment}
                  </div>
                </div>
              )}
              {!selectedVisit.report.approved && userType === 'client' && (
                <div className="border-t border-border pt-4">
                  <div className="text-sm text-muted-foreground mb-2">承認コメント</div>
                  <textarea
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input-background mb-2"
                    rows={3}
                    placeholder="コメントを入力してください（任意）"
                  />
                  <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                    承認する
                  </button>
                </div>
              )}
              {!selectedVisit.report.approved && userType === 'supporter' && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                  ご利用者様の承認をお待ちください
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}