import { ArrowLeft, MapPin, Calendar, Clock, User, MessageCircle, CheckCircle, X, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

interface MatchingDetailPageProps {
  jobId: string;
  onBack: () => void;
  onOpenChat: (applicantId: string) => void;
  onViewProfile: (applicantId: string) => void;
}

type ApplicantStatus = 'pending' | 'approved' | 'rejected';

interface Applicant {
  id: string;
  name: string;
  age: number;
  gender: string;
  rating: number;
  reviewCount: number;
  experience: string;
  message: string;
  appliedDate: string;
  status: ApplicantStatus;
  distance: string;
  availability: string[];
}

export function MatchingDetailPage({ jobId, onBack, onOpenChat, onViewProfile }: MatchingDetailPageProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    applicantId: string;
    applicantName: string;
  } | null>(null);

  const [rejectMessage, setRejectMessage] = useState('');

  // モック：依頼内容
  const jobDetail = {
    id: jobId,
    jobNumber: 'JOB123456',
    jobType: 'spot' as const,
    spotDate: '2月10日（木）',
    spotTime: '14:00 - 17:00',
    services: ['料理'],
    address: '東京都渋谷区道玄坂1-2-3',
    nearestStation: '渋谷駅',
    createdDate: '2月1日',
    status: 'open' as const,
  };

  // モック：応募者リス
  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: '1',
      name: '山田 花子',
      age: 35,
      gender: '女性',
      rating: 4.8,
      reviewCount: 127,
      experience: '3年',
      message: 'こんにちは！料理が得意で、和食から洋食まで幅広く対応できます。お子様がいらっしゃるご家庭での経験も豊富です。ぜひお手伝いさせていただきたいです！',
      appliedDate: '2月1日',
      status: 'pending',
      distance: '2.5km',
      availability: ['平日午後', '土日'],
    },
    {
      id: '2',
      name: '佐藤 美咲',
      age: 42,
      gender: '女性',
      rating: 4.9,
      reviewCount: 203,
      experience: '5年',
      message: '料理経験が豊富で、栄養バランスを考えた献立作りが得意です。アレルギー対応も可能です。よろしくお願いいたします。',
      appliedDate: '2月1日',
      status: 'pending',
      distance: '1.8km',
      availability: ['平日', '週末'],
    },
    {
      id: '3',
      name: '田中 恵',
      age: 28,
      gender: '女性',
      rating: 4.7,
      reviewCount: 89,
      experience: '2年',
      message: '時短料理が得意です！限られた時間でも美味しく栄養のある料理を作ります。ご希望に沿った対応を心がけています。',
      appliedDate: '2月2日',
      status: 'pending',
      distance: '3.2km',
      availability: ['平日午後'],
    },
  ]);

  const [selectedApplicant, setSelectedApplicant] = useState<string | null>(null);

  const handleApprove = (applicantId: string) => {
    setApplicants(prev =>
      prev.map(app =>
        app.id === applicantId ? { ...app, status: 'approved' as const } : app
      )
    );
  };

  const handleReject = (applicantId: string) => {
    setApplicants(prev =>
      prev.map(app =>
        app.id === applicantId ? { ...app, status: 'rejected' as const } : app
      )
    );
  };

  const pendingApplicants = applicants.filter(app => app.status === 'pending');
  const approvedApplicants = applicants.filter(app => app.status === 'approved');
  const rejectedApplicants = applicants.filter(app => app.status === 'rejected');

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ヘッダー */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">マッチング詳細</h1>
        </div>
      </div>

      {/* 依頼内容サマリー */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                jobDetail.jobType === 'regular' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {jobDetail.jobType === 'regular' ? '定期' : 'スポット'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                募集中
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm mb-1">
              <Calendar size={16} className="text-primary" />
              <span className="font-medium">{jobDetail.spotDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm mb-1">
              <Clock size={16} className="text-primary" />
              <span>{jobDetail.spotTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-primary" />
              <span className="text-muted-foreground">{jobDetail.nearestStation}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {jobDetail.services.map((service, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-accent rounded-full text-sm font-medium"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* 応募状況サマリー */}
      <div className="p-4 bg-blue-50 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">応募状況</p>
            <p className="text-2xl font-bold text-primary">{applicants.length}件</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">未対応</p>
            <p className="text-xl font-bold text-orange-600">{pendingApplicants.length}件</p>
          </div>
        </div>
      </div>

      {/* タブ切り替え */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex">
          <button
            onClick={() => setSelectedApplicant(null)}
            className="flex-1 py-3 text-sm font-medium border-b-2 border-primary text-primary"
          >
            未対応 ({pendingApplicants.length})
          </button>
        </div>
      </div>

      {/* 応募者リスト */}
      <div className="p-4">
        {pendingApplicants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">現在、未対応の応募はありません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingApplicants.map((applicant) => (
              <div
                key={applicant.id}
                className="bg-card border border-border rounded-lg p-4"
              >
                {/* きらりさん情報 */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center text-white font-bold">
                    {applicant.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{applicant.name}さん</h3>
                      <span className="text-xs text-muted-foreground">
                        {applicant.age}歳・{applicant.gender}
                      </span>
                    </div>
                    <button
                      onClick={() => onViewProfile(applicant.id)}
                      className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
                    >
                      <User size={12} />
                      プロフィール
                    </button>
                  </div>
                </div>

                {/* メッセージ */}
                <div className="bg-accent rounded-lg p-3 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle size={16} className="text-primary" />
                    <span className="text-xs font-medium text-muted-foreground">メッセージ</span>
                  </div>
                  <p className="text-sm leading-relaxed">{applicant.message}</p>
                </div>

                {/* 応募日 */}
                <p className="text-xs text-muted-foreground mb-3">
                  {applicant.appliedDate}に応募
                </p>

                {/* アクションボタン */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onOpenChat(applicant.id)}
                    className="flex-1 py-2.5 border border-border rounded-lg font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    メッセージ
                  </button>
                  <button
                    onClick={() => setConfirmDialog({ isOpen: true, type: 'reject', applicantId: applicant.id, applicantName: applicant.name })}
                    className="px-4 py-2.5 border border-border rounded-lg font-medium hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
                  >
                    <X size={18} />
                  </button>
                  <button
                    onClick={() => setConfirmDialog({ isOpen: true, type: 'approve', applicantId: applicant.id, applicantName: applicant.name })}
                    className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-colors flex items-center gap-1"
                  >
                    <CheckCircle size={18} />
                    承認
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 承認済み・お断り済みの応募者（折りたたみ可能） */}
      {(approvedApplicants.length > 0 || rejectedApplicants.length > 0) && (
        <div className="p-4 pt-0 space-y-3">
          {approvedApplicants.length > 0 && (
            <details className="bg-green-50 border border-green-200 rounded-lg">
              <summary className="p-3 cursor-pointer font-medium text-green-700 flex items-center justify-between">
                <span>承認済み ({approvedApplicants.length}件)</span>
                <ChevronRight size={18} className="transform transition-transform" />
              </summary>
              <div className="p-3 pt-0 space-y-2">
                {approvedApplicants.map((applicant) => (
                  <div key={applicant.id} className="bg-white rounded p-2 text-sm">
                    {applicant.name}さん
                  </div>
                ))}
              </div>
            </details>
          )}

          {rejectedApplicants.length > 0 && (
            <details className="bg-gray-50 border border-gray-200 rounded-lg">
              <summary className="p-3 cursor-pointer font-medium text-gray-700 flex items-center justify-between">
                <span>お断り済み ({rejectedApplicants.length}件)</span>
                <ChevronRight size={18} className="transform transition-transform" />
              </summary>
              <div className="p-3 pt-0 space-y-2">
                {rejectedApplicants.map((applicant) => (
                  <div key={applicant.id} className="bg-white rounded p-2 text-sm">
                    {applicant.name}さん
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      {/* 確認ダイアログ */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-sm w-full p-6">
            <h3 className="font-bold text-lg mb-4">
              {confirmDialog.type === 'approve' 
                ? '応募を承諾しますか？' 
                : 'お断りしますか？'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {confirmDialog.type === 'approve' 
                ? `${confirmDialog.applicantName}さんの応募を承諾します。この操作は取り消せません。` 
                : `${confirmDialog.applicantName}さんの応募をお断りします。この操作は取り消せません。`}
            </p>
            
            {/* お断り時のメッセージ入力（任意） */}
            {confirmDialog.type === 'reject' && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  メッセージ（任意）
                </label>
                <textarea
                  value={rejectMessage}
                  onChange={(e) => setRejectMessage(e.target.value)}
                  placeholder="お断りの理由をお伝えすることができます"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  ※ 入力したメッセージは応募者に送信されます
                </p>
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmDialog(null);
                  setRejectMessage('');
                }}
                className="flex-1 py-2.5 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  if (confirmDialog.type === 'approve') {
                    handleApprove(confirmDialog.applicantId);
                  } else {
                    handleReject(confirmDialog.applicantId);
                    // メッセージがあれば送信処理（モックなのでコンソールに出力）
                    if (rejectMessage.trim()) {
                      console.log('お断りメッセージ:', rejectMessage);
                    }
                  }
                  setConfirmDialog(null);
                  setRejectMessage('');
                }}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                  confirmDialog.type === 'approve'
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {confirmDialog.type === 'approve' ? '承諾する' : 'お断りする'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}