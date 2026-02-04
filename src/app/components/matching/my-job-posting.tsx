import React, { useState } from 'react';
import { Edit, Users, X, Check, MessageCircle } from 'lucide-react';
import { JobPostingEdit } from './job-posting-edit';

interface Applicant {
  id: number;
  name: string;
  rating: number;
  experience: string;
  message: string;
  appliedAt: string;
  profileImage?: string;
}

interface MyJobPostingProps {
  onOpenChat: (applicantId: number) => void;
  jobPosting?: any;
  onSavePosting: (posting: any) => void;
  initialJobType?: 'regular' | 'spot';
  basicInfo?: any;
  onNavigateHome?: () => void;
}

export function MyJobPosting({ onOpenChat, jobPosting, onSavePosting, initialJobType, basicInfo, onNavigateHome }: MyJobPostingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);
  const [hasPosting, setHasPosting] = useState(false); // 募集があるかどうか

  // モックデータ
  const myPosting = {
    id: 1,
    jobNumber: 'JOB202601',
    jobType: 'regular' as const,
    address: '東京都渋谷区道玄坂1-2',
    nearestStation: '渋谷駅',
    accessTime: '10分',
    accessMethod: '徒歩',
    carParking: true,
    startPreference: 'asap',
    courseDuration: '2時間',
    frequency: '毎週',
    preferredDays: ['tue', 'wed', 'thu'],
    preferredTimeStart: '10:00',
    preferredTimeEnd: '12:00',
    servicePriorities: [
      { service: '掃除', priority: 1 },
      { service: '片付け', priority: 2 },
      { service: '洗濯', priority: 3 },
    ],
    familyType: '夫婦＋子ども',
    familyDetails: [
      { relation: '本人', age: '35歳' },
      { relation: '配偶者', age: '33歳' },
      { relation: '子ども', age: '5歳' },
    ],
    housingType: '集合住宅',
    apartmentFloor: '3階',
    hasElevator: false,
    homePresence: '時々在宅',
    appealMessage: '明るく丁寧な方を希望しています。ペット（犬）がいますので、動物が苦手でない方だと助かります。',
    status: 'reviewing' as const,
    postedDate: '2026-01-15',
  };

  const applicants: Applicant[] = [
    {
      id: 1,
      name: '山田 花子',
      rating: 4.8,
      experience: '家事代行歴3年',
      message: 'はじめまして。ペットが大好きで、犬の飼育経験もあります。丁寧な作業を心がけています。ぜひ宜しくお願いいたします。',
      appliedAt: '2026-01-16 10:30',
    },
  ];

  const getDayLabel = (day: string) => {
    const labels: Record<string, string> = {
      mon: '月',
      tue: '火',
      wed: '水',
      thu: '木',
      fri: '金',
      sat: '土',
      sun: '日',
    };
    return labels[day] || day;
  };

  const handleSave = (posting: any) => {
    console.log('Save posting:', posting);
    onSavePosting(posting);
    setIsEditing(false);
  };

  const handleAcceptApplicant = (applicantId: number) => {
    console.log('Accept applicant:', applicantId);
    // TODO: マッチング成立処理
    setShowApplicants(false);
  };

  const handleRejectApplicant = (applicantId: number) => {
    console.log('Reject applicant:', applicantId);
    // TODO: 応募者却下処理
  };

  // 募集がまだない場合は新規作成画面を表示
  if (!jobPosting) {
    return (
      <div className="pb-20">
        <div className="p-4">
          <div className="bg-white rounded-lg border border-border p-4">
            <JobPostingEdit
              onSave={handleSave}
              onCancel={() => {}}
              initialJobType={initialJobType}
              basicInfo={basicInfo}
              onNavigateHome={onNavigateHome}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="p-4 pb-20">
        <div className="bg-white rounded-lg border border-border p-4">
          <h2 className="text-xl font-bold mb-4">募集内容を編集</h2>
          <JobPostingEdit
            posting={jobPosting}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
            basicInfo={basicInfo}
            onNavigateHome={onNavigateHome}
          />
        </div>
      </div>
    );
  }

  // 保存済みの募集内容を使用（表示用にフォーマット）
  const displayPosting = jobPosting || myPosting;

  return (
    <div className="pb-20">
      <div className="bg-primary text-primary-foreground p-6">
        <h2 className="text-xl font-bold mb-2">わたしの募集</h2>
        <p className="text-sm opacity-90">
          {displayPosting.status === 'open' && '現在募集中です'}
          {displayPosting.status === 'reviewing' && `応募者が${applicants.length}名います`}
          {displayPosting.status === 'matched' && 'マッチング成立済み'}
          {displayPosting.status === 'closed' && '募集を終了しました'}
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* 募集内容カード */}
        <div className="bg-white rounded-lg border border-border p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {/* 定期/スポット */}
                <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                  {displayPosting.jobType === 'regular' ? '定期' : 'スポット'}
                </span>
                {displayPosting.status === 'open' && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">募集中</span>
                )}
                {displayPosting.status === 'reviewing' && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                    応募受付中（{applicants.length}名）
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-accent rounded-lg"
            >
              <Edit size={20} className="text-primary" />
            </button>
          </div>

          <div className="space-y-3 mb-4">
            {/* 依頼日（または定期スケジュールの曜日時間） */}
            <div>
              <label className="text-sm text-muted-foreground">
                {displayPosting.jobType === 'regular' ? '希望曜日・時間' : '依頼日'}
              </label>
              <p className="font-medium">
                {displayPosting.jobType === 'regular' ? (
                  <>
                    {displayPosting.preferredDays?.map(getDayLabel).join('・')}曜日 {displayPosting.preferredTimeStart}〜{displayPosting.preferredTimeEnd}
                  </>
                ) : (
                  displayPosting.spotDate || '2026年1月30日'
                )}
              </p>
            </div>

            {/* サポート内容 */}
            <div>
              <label className="text-sm text-muted-foreground">サポート内容</label>
              <div className="flex flex-wrap gap-1 mt-1">
                {displayPosting.servicePriorities
                  ?.sort((a, b) => a.priority - b.priority)
                  .map(item => (
                    <span
                      key={item.service}
                      className="px-2 py-1 bg-primary/10 text-primary rounded text-xs flex items-center gap-1"
                    >
                      <span className="font-bold">{item.priority}</span>
                      {item.service}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* 応募者を確認するボタン */}
          {applicants.length > 0 && (
            <button
              onClick={() => setShowApplicants(true)}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center justify-center gap-2 mb-2"
            >
              <Users size={18} />
              応募者を確認する（{applicants.length}名）
            </button>
          )}
        </div>
      </div>

      {/* 応募者一覧モーダル */}
      {showApplicants && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex items-center justify-between">
              <h3>応募者一覧</h3>
              <button
                onClick={() => setShowApplicants(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {applicants.map(applicant => (
                <div key={applicant.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">👤</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold">{applicant.name}</h4>
                        <span className="text-sm text-muted-foreground">⭐ {applicant.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{applicant.experience}</p>
                      <p className="text-xs text-muted-foreground mt-1">応募日：{applicant.appliedAt}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="text-sm text-muted-foreground">応募メッセージ</label>
                    <p className="text-sm leading-relaxed mt-1">{applicant.message}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onOpenChat(applicant.id)}
                      className="flex-1 py-2 border border-border rounded-lg hover:bg-accent flex items-center justify-center gap-2 text-sm"
                    >
                      <MessageCircle size={16} />
                      メッセージ
                    </button>
                    <button
                      onClick={() => handleRejectApplicant(applicant.id)}
                      className="flex-1 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 flex items-center justify-center gap-2 text-sm"
                    >
                      <X size={16} />
                      お断り
                    </button>
                    <button
                      onClick={() => handleAcceptApplicant(applicant.id)}
                      className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center justify-center gap-2 text-sm"
                    >
                      <Check size={16} />
                      承諾
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}