import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface ReportsPageProps {
  userType: 'client' | 'supporter';
}

interface Report {
  id: number;
  date: string;
  time: string;
  partner: string;
  service: string;
  content: string;
  approved: boolean;
  approvalComment?: string;
}

export function ReportsPage({ userType }: ReportsPageProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // モックデータ
  const reports: Report[] = [
    {
      id: 1,
      date: '1月10日（金）',
      time: '10:00 - 12:00',
      partner: userType === 'client' ? '山田 花子' : '田中 太郎',
      service: '定期清掃',
      content: 'リビング、キッチン、浴室の清掃を行いました。特にキッチンの油汚れがひどかったため、念入りに清掃しました。窓拭きも実施し、全体的にきれいになりました。',
      approved: true,
      approvalComment: 'いつもありがとうございます。とてもきれいになりました！',
    },
    {
      id: 2,
      date: '1月7日（火）',
      time: '14:00 - 16:00',
      partner: userType === 'client' ? '山田 花子' : '佐藤 明美',
      service: '定期清掃',
      content: 'リビングと寝室の清掃を実施しました。掃除機がけ、床の拭き掃除、トイレ清掃を行いました。',
      approved: false,
    },
    {
      id: 3,
      date: '1月3日（金）',
      time: '10:00 - 12:00',
      partner: userType === 'client' ? '佐藤 明美' : '鈴木 恵子',
      service: '定期清掃',
      content: 'お正月明けの大掃除を行いました。キッチン、リビング、浴室、トイレの清掃を実施。換気扇の掃除も行い、すっきりしました。',
      approved: true,
      approvalComment: 'とても丁寧に清掃していただきありがとうございました！',
    },
    {
      id: 4,
      date: '12月27日（金）',
      time: '10:00 - 12:00',
      partner: userType === 'client' ? '山田 花子' : '田中 太郎',
      service: '定期清掃',
      content: '年末の大掃除を実施しました。窓掃除、床のワックスがけ、キッチンの徹底清掃を行いました。',
      approved: true,
      approvalComment: '年末の大掃除、ありがとうございました！',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 space-y-3">
        <h2 className="mb-1">お仕事レポート</h2>
        <p className="text-sm text-muted-foreground mb-4">
          過去の訪問のレポートを確認できます
        </p>

        {reports.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            レポートがありません
          </div>
        ) : (
          reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report)}
              className="w-full bg-card rounded-lg border border-border p-4 hover:bg-accent transition-colors"
            >
              <div className="flex items-start gap-3">
                {report.approved ? (
                  <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                ) : (
                  <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                )}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">{report.service}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        report.approved
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {report.approved ? '承認済み' : '確認待ち'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {report.date} {report.time}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {userType === 'client' ? 'サポーター: ' : 'ご利用者: '}
                    {report.partner}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* レポート詳細モーダル */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
              <h3>お仕事レポート</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">訪問日時</div>
                <div className="font-medium">{selectedReport.date} {selectedReport.time}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">サービス内容</div>
                <div className="font-medium">{selectedReport.service}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  {userType === 'client' ? '担当サポーター' : 'ご利用者様'}
                </div>
                <div className="font-medium">{selectedReport.partner}</div>
              </div>
              <div className="border-t border-border pt-4">
                <div className="text-sm text-muted-foreground mb-2">作業内容</div>
                <p className="text-sm leading-relaxed">{selectedReport.content}</p>
              </div>
              {selectedReport.approved && selectedReport.approvalComment && (
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-sm text-muted-foreground">承認コメント</div>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                      承認済み
                    </span>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                    {selectedReport.approvalComment}
                  </div>
                </div>
              )}
              {!selectedReport.approved && userType === 'client' && (
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
              {!selectedReport.approved && userType === 'supporter' && (
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
