import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

interface OnboardingChecklistProps {
  userType: 'client' | 'supporter';
  onNavigate: (page: string) => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  page: string;
}

export function OnboardingChecklist({ userType, onNavigate }: OnboardingChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // ユーザー向け7ステップ
  const clientSteps: ChecklistItem[] = [
    { id: 'profile', label: 'プロフィール登録', completed: true, page: 'profile' },
    { id: 'address', label: '住所登録', completed: true, page: 'profile' },
    { id: 'payment', label: 'お支払い方法登録', completed: false, page: 'payment' },
    { id: 'job-posting', label: '募集内容の作成', completed: false, page: 'requests' },
    { id: 'match', label: 'サポーターとマッチング', completed: false, page: 'requests' },
    { id: 'schedule', label: '初回スケジュール調整', completed: false, page: 'schedule' },
    { id: 'first-visit', label: '初回訪問完了', completed: false, page: 'schedule' },
  ];

  // サポーター向け4ステップ
  const supporterSteps: ChecklistItem[] = [
    { id: 'profile', label: 'プロフィール登録', completed: true, page: 'profile' },
    { id: 'job-search', label: 'お仕事を探す', completed: false, page: 'job-search' },
    { id: 'apply', label: '案件に応募', completed: false, page: 'job-search' },
    { id: 'first-visit', label: '初回訪問完了', completed: false, page: 'schedule' },
  ];

  const steps = userType === 'client' ? clientSteps : supporterSteps;
  const completedCount = steps.filter(step => step.completed).length;
  const totalCount = steps.length;
  const progress = (completedCount / totalCount) * 100;
  
  // 次のステップ（最初の未完了項目）のみ取得
  const nextStep = steps.find(step => !step.completed);

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-accent transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm">✓</span>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-sm">やることリスト</h3>
            <p className="text-xs text-muted-foreground">
              {completedCount} / {totalCount} 完了
            </p>
          </div>
        </div>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isExpanded && (
        <div className="px-3 pb-3">
          {/* プログレスバー */}
          <div className="mb-2">
            <div className="h-1.5 bg-accent rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* チェックリスト */}
          <div className="space-y-1.5">
            {nextStep && (
              <button
                key={nextStep.id}
                onClick={() => onNavigate(nextStep.page)}
                className="w-full flex items-center gap-2 p-2 rounded-lg transition-colors bg-accent hover:bg-accent/80"
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-white border-2 border-border">
                  <span className="text-xs text-muted-foreground">
                    {steps.findIndex(s => s.id === nextStep.id) + 1}
                  </span>
                </div>
                <span className="text-xs text-foreground">
                  {nextStep.label}
                </span>
              </button>
            )}
          </div>

          {/* 完了メッセージ */}
          {completedCount === totalCount && (
            <div className="p-2 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-xs text-green-700 font-medium">
                🎉 すべてのステップが完了しました！
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}